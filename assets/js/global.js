/* =============================================================
   STYLEMIX — assets/js/global.js  (v2 — upgraded)
   ============================================================= */
'use strict';

/* ── Custom Cursor ─────────────────────────── */
(function initCursor() {
    const dot = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!dot || !follower) return;
    let mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
    });
    (function loop() {
        fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12;
        follower.style.transform = `translate(${fx - 18}px, ${fy - 18}px)`;
        requestAnimationFrame(loop);
    })();
    function bindHover() {
        document.querySelectorAll(
            'button, a, .outfit-card, .color-pill, .slider-btn, .nav__icon, ' +
            '.cat-card, .featured-card, .tip-card, .hits-card, .filter-btn, .filter-chip'
        ).forEach(el => {
            el.addEventListener('mouseenter', () => { follower.style.opacity = '0.4'; });
            el.addEventListener('mouseleave', () => { follower.style.opacity = '1'; });
        });
    }
    bindHover();
    window.bindCursorHover = bindHover;
})();

/* ── Toast ──────────────────────────────────── */
let _toastTimer;
function showToast(msg, duration = 2800) {
    const el = document.getElementById('toast');
    if (!el) return;
    document.getElementById('toastMsg').textContent = msg;
    el.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => el.classList.remove('show'), duration);
}
window.showToast = showToast;

/* ── Modal ──────────────────────────────────── */
(function initModal() {
    const overlay = document.getElementById('modal');
    const closeBtn = document.getElementById('modalClose');
    if (!overlay) return;
    let previousFocus;
    overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-modal', 'true'); overlay.setAttribute('aria-labelledby', 'modalTitle');
    overlay.setAttribute('aria-hidden','true'); overlay.inert = true;
    closeBtn?.setAttribute('aria-label','Đóng chi tiết');
    function open() {
        previousFocus = document.activeElement; overlay.inert = false; overlay.setAttribute('aria-hidden','false');
        overlay.classList.add('open'); document.body.style.overflow = 'hidden'; closeBtn?.focus();
    }
    function close() {
        overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true'); overlay.inert = true; document.body.style.overflow = '';
        if(previousFocus?.isConnected) previousFocus.focus();
    }
    closeBtn && closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => {
        if(!overlay.classList.contains('open')) return;
        if(e.key === 'Escape') close();
        if(e.key === 'Tab') {
            const elements = [...overlay.querySelectorAll('button,a[href],input,select,[tabindex="0"]')].filter(el=>!el.disabled&&!el.hidden&&el.offsetParent!==null);
            const first=elements[0],last=elements[elements.length-1];
            if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
            else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
        }
    });
    function renderItems(items) {
        document.getElementById('modalItems').replaceChildren(...items.map(item=>{
            const li=document.createElement('li');li.className='modal__item';li.textContent=item;return li;
        }));
    }
    function renderGuidance(outfit) {
        let box=document.getElementById('modalGuidance');
        if(!box){box=document.createElement('div');box.id='modalGuidance';box.className='modal__guidance';document.getElementById('modalItems').after(box);}
        box.replaceChildren();
        for(const line of [...(outfit.fitNotes||[]),...(outfit.instructions||[])]){const p=document.createElement('p');p.textContent=line;box.append(p);}
        if(outfit.imageSource){const p=document.createElement('p');p.textContent='Hình minh họa phối đồ do StyleMix tạo.';box.append(p);}
    }

    window.openOutfitModal = function (o) {
        window.currentOutfit = o;
        document.getElementById('modalImg').src = o.img;
        document.getElementById('modalImg').alt = o.name;
        document.getElementById('modalTag').textContent = o.tag;
        document.getElementById('modalTitle').textContent = o.name.toUpperCase();
        document.getElementById('modalDesc').textContent = o.desc;
        renderItems(o.items || []); renderGuidance(o);
        const saveBtn = document.getElementById('modalSaveBtn');
        if (saveBtn) { saveBtn.hidden = false; updateSaveBtnUI(saveBtn, isOutfitLiked(o.id)); }
        open();
    };
    window.openStyleModal = function (key) {
        const data = window.STYLE_DATA && window.STYLE_DATA[key];
        if (!data) return;
        document.getElementById('modalImg').src = data.img;
        document.getElementById('modalTag').textContent = data.tag;
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalDesc').textContent = data.desc;
        renderItems(data.items || []); renderGuidance({});
        window.currentOutfit = null; document.getElementById('modalSaveBtn').hidden = true;
        open();
    };
})();

/* ── Scroll Reveal ──────────────────────────── */
function initScrollReveal() {
    const obs = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => obs.observe(el));
}
window.initScrollReveal = initScrollReveal;
initScrollReveal();

/* ── Nav scroll border ──────────────────────── */
(function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 50); }, { passive: true });
    const page = location.pathname.split('/').pop();
    document.querySelectorAll('.nav__links a').forEach(a => {
        if (a.getAttribute('href') === page || a.getAttribute('href') === './' + page) a.classList.add('active');
    });
    document.addEventListener('DOMContentLoaded', updateNavLikeBadge);
})();

/* ══ LIKE / SAVE SYSTEM ════════════════════════ */
const LIKED_KEY = 'stylemix_liked_outfits';

let fallbackLikes;
function getLikedOutfits() {
    let list;
    if (window.OutfitStorage) list = window.OutfitStorage.store.get(LIKED_KEY, []);
    else { try { list = fallbackLikes || JSON.parse(localStorage.getItem(LIKED_KEY) || '[]'); } catch { list = fallbackLikes || []; } }
    return Array.isArray(list) ? list.filter(o => o && ['string','number'].includes(typeof o.id) && typeof o.name === 'string' && Array.isArray(o.items)) : [];
}
function saveLikedList(list) {
    const clean = list.map(({fitNotes, ...outfit}) => outfit);
    let persisted;
    if (window.OutfitStorage) persisted = window.OutfitStorage.store.set(LIKED_KEY, clean);
    else { fallbackLikes = clean; try { localStorage.setItem(LIKED_KEY, JSON.stringify(clean)); persisted = true; } catch { persisted = false; } }
    window.likesPersisted = persisted;
    document.dispatchEvent(new Event('stylemix:likes-changed'));
}
window.addEventListener('storage', event => {
    if (event.key === LIKED_KEY || event.key === null) {
        window.OutfitStorage?.store.invalidate(LIKED_KEY);
        updateNavLikeBadge(); document.dispatchEvent(new Event('stylemix:likes-changed'));
    }
});
function isOutfitLiked(id) { return getLikedOutfits().some(o => o.id === id); }
window.isOutfitSaved = isOutfitLiked;

function toggleLiked(outfit) {
    let list = getLikedOutfits();
    const idx = list.findIndex(o => o.id === outfit.id);
    if (idx === -1) { list.unshift(outfit); saveLikedList(list); return true; }
    else { list.splice(idx, 1); saveLikedList(list); return false; }
}

function updateNavLikeBadge() {
    const icon = document.querySelector('.nav__like-icon');
    if (!icon) return;
    const count = getLikedOutfits().length;
    let badge = icon.querySelector('.like-badge');
    if (!badge) { badge = document.createElement('span'); badge.className = 'like-badge'; icon.appendChild(badge); }
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
}

function updateSaveBtnUI(btn, isSaved) {
    if (!btn) return;
    if (isSaved) {
        btn.innerHTML = '<svg width="14" height="14" fill="var(--color-orange)" stroke="var(--color-orange)" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Đã lưu vào tủ đồ';
        btn.classList.add('saved');
    } else {
        btn.innerHTML = '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Lưu vào tủ đồ';
        btn.classList.remove('saved');
    }
}

window.saveOutfitLocal = function (outfit) {
    if (!outfit) return;
    const now = toggleLiked(outfit);
    updateSaveBtnUI(document.getElementById('modalSaveBtn'), now);
    updateNavLikeBadge();
    // sync like button on card if visible
    document.querySelectorAll('.outfit-card__like').forEach(btn => {
        try {
            const d = JSON.parse(btn.dataset.outfitJson);
            if (d && d.id === outfit.id) syncLikeBtn(btn, now);
        } catch {}
    });
    showToast(window.likesPersisted === false ? 'Đã cập nhật trong phiên này; trình duyệt chưa cho lưu lâu dài.' : now ? 'Đã lưu vào tủ đồ ♥' : 'Đã xoá khỏi tủ đồ');
};

function syncLikeBtn(btn, liked) {
    btn.dataset.liked = liked ? 'true' : 'false';
    btn.classList.toggle('liked', liked);
    const svg = btn.querySelector('svg');
    if (svg) { svg.style.fill = liked ? 'var(--color-orange)' : 'none'; svg.style.stroke = liked ? 'var(--color-orange)' : 'currentColor'; }
}

window.likeOutfit = function (btn, event, outfit) {
    if (event) event.stopPropagation();
    if (!outfit && btn.dataset.outfitJson) {
        try { outfit = JSON.parse(btn.dataset.outfitJson); } catch {}
    }
    if (!outfit) { showToast('Lỗi: không tìm thấy outfit'); return; }
    const nowLiked = toggleLiked(outfit);
    syncLikeBtn(btn, nowLiked);
    updateNavLikeBadge();
    const saveBtn = document.getElementById('modalSaveBtn');
    if (saveBtn && window.currentOutfit && window.currentOutfit.id === outfit.id) updateSaveBtnUI(saveBtn, nowLiked);
    showToast(window.likesPersisted === false ? 'Đã cập nhật trong phiên này; trình duyệt chưa cho lưu lâu dài.' : nowLiked ? 'Đã thêm vào yêu thích ♥' : 'Đã bỏ yêu thích');
};

window.openSavedOutfits = function () {
    const list = getLikedOutfits();
    if (list.length === 0) { showToast('Tủ đồ trống! Hãy tim outfit yêu thích ♥'); return; }
    const pt = document.getElementById('pageTransition');
    if (pt) { pt.style.transform = 'scaleY(1)'; pt.style.transformOrigin = 'bottom'; setTimeout(() => { window.location.href = './yeu-thich.html'; }, 380); }
    else window.location.href = './yeu-thich.html';
};

/* ── Page transition ────────────────────────── */
(function initPageTransition() {
    const pt = document.getElementById('pageTransition');
    if (!pt) return;
    document.querySelectorAll('a[href]:not([target="_blank"])').forEach(a => {
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) return;
        a.addEventListener('click', e => {
            e.preventDefault();
            pt.style.transform = 'scaleY(1)';
            pt.style.transformOrigin = 'bottom';
            setTimeout(() => { window.location.href = href; }, 420);
        });
    });
    window.addEventListener('pageshow', () => { pt.style.transformOrigin = 'top'; pt.style.transform = 'scaleY(0)'; });
})();

/* ── Render outfit card ─────────────────────── */
function createOutfitCard(o, delay) {
    delay = delay || 0;
    var div = document.createElement('div');
    div.className = 'outfit-card reveal';
    div.style.transitionDelay = delay + 's';
    div.dataset.color = o.color || '';
    var liked = isOutfitLiked(o.id);
    var svgFill = liked ? 'fill:var(--color-orange);stroke:var(--color-orange)' : 'fill:none;stroke:currentColor';
    var likedClass = liked ? ' liked' : '';
    div.innerHTML =
        '<img class="outfit-card__img" src="' + o.img + '" alt="' + o.name + '" loading="lazy"/>' +
        '<div class="outfit-card__overlay">' +
          '<span class="outfit-card__tag">' + o.tag + '</span>' +
          '<span class="outfit-card__name">' + o.name + '</span>' +
        '</div>' +
        '<button class="outfit-card__like' + likedClass + '" data-liked="' + liked + '" aria-label="Yêu thích">' +
          '<svg width="14" height="14" style="' + svgFill + '" stroke-width="2" viewBox="0 0 24 24">' +
            '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' +
          '</svg>' +
        '</button>';
    // Use closure to attach events — no inline onclick, no JSON in HTML
    (function(outfit, container) {
        var btn = container.querySelector('.outfit-card__like');
        btn.dataset.outfitJson = JSON.stringify(outfit);
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            window.likeOutfit(btn, e, outfit);
        });
        container.addEventListener('click', function(e) {
            if (e.target.closest('.outfit-card__like')) return;
            window.openOutfitModal(outfit);
        });
    })(o, div);
    return div;
}
window.createOutfitCard = createOutfitCard;

/* ── Color filter chips ─────────────────────── */
const COLOR_MAP = {
    all:    { label: 'Tất cả', bg: 'linear-gradient(135deg,#f97316,#7c3aed,#0ea5e9,#10b981)' },
    white:  { label: 'Trắng',  bg: '#f5f5f5', border: '#aaa' },
    black:  { label: 'Đen',    bg: '#1c1c1c' },
    blue:   { label: 'Xanh dương', bg: '#3b82f6' },
    brown:  { label: 'Nâu',    bg: '#92400e' },
    orange: { label: 'Cam',    bg: '#f97316' },
    red:    { label: 'Đỏ',     bg: '#ef4444' },
    gray:   { label: 'Xám',    bg: '#6b7280' },
    green:  { label: 'Xanh lá', bg: '#10b981' },
    pink:   { label: 'Hồng',   bg: '#ec4899' },
    yellow: { label: 'Vàng',   bg: '#eab308' },
    purple: { label: 'Tím',    bg: '#7c3aed' },
};

window.filterByColor = function (btn, color, gridId) {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    if (window.applyCatalogFilters) { window.applyCatalogFilters(color); return; }
    const data = window.__FILTER_DATA__ || [];
    const filtered = color === 'all' ? data : data.filter(p => {
        const c = p.color || '';
        return Array.isArray(c) ? c.includes(color) : c === color;
    });
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    filtered.forEach((o, i) => { grid.appendChild(createOutfitCard(o, (i % 4) * 0.06)); });
    window.initScrollReveal && window.initScrollReveal();
    window.bindCursorHover && window.bindCursorHover();
    const countEl = document.getElementById('productCount');
    if (countEl) countEl.textContent = filtered.length;
};

window.buildColorFilterBar = function (colors, gridId, dataRef) {
    const bar = document.getElementById('colorFilterBar');
    if (!bar) return;
    window.__FILTER_DATA__ = dataRef;
    const all = ['all', ...colors];
    bar.innerHTML = all.map((c, i) => {
        const info = COLOR_MAP[c] || { label: c, bg: '#888' };
        const borderCss = info.border ? 'border:1px solid ' + info.border + ';' : '';
        return `<button data-color="${c}" class="filter-chip${i === 0 ? ' active' : ''}" onclick="filterByColor(this,'${c}','${gridId}')" title="${info.label}">
            <span class="filter-chip__dot" style="background:${info.bg};${borderCss}"></span>${info.label}
        </button>`;
    }).join('');
    window.bindCursorHover && window.bindCursorHover();
};
