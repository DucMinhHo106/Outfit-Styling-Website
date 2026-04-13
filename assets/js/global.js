/* =============================================================
   STYLEMIX — assets/js/global.js
   Shared utilities: cursor, toast, modal, scroll-reveal, nav
   ============================================================= */

'use strict';

/* ── Custom Cursor ────────────────────────────────────────── */
(function initCursor() {
    const dot = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!dot || !follower) return;

    let mx = 0,
        my = 0,
        fx = 0,
        fy = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
    });

    (function loop() {
        fx += (mx - fx) * 0.12;
        fy += (my - fy) * 0.12;
        follower.style.transform = `translate(${fx - 18}px, ${fy - 18}px)`;
        requestAnimationFrame(loop);
    })();

    function bindHover() {
        document.querySelectorAll(
            'button, a, .outfit-card, .color-pill, .slider-btn, .nav__icon, .cat-card, .featured-card, .tip-card, .hits-card, .filter-btn'
        ).forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.style.opacity = '0.4';
                follower.style.transform += ' scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                follower.style.opacity = '1';
            });
        });
    }

    // Run now and expose for dynamic content
    bindHover();
    window.bindCursorHover = bindHover;
})();

/* ── Toast ────────────────────────────────────────────────── */
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

/* ── Modal ────────────────────────────────────────────────── */
(function initModal() {
    const overlay = document.getElementById('modal');
    const closeBtn = document.getElementById('modalClose');
    if (!overlay) return;

    function open() {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    closeBtn?.addEventListener('click', close);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) close();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') close();
    });

    window.openOutfitModal = function (o) {
        window.currentOutfit = o;
        document.getElementById('modalImg').src = o.img;
        document.getElementById('modalTag').textContent = o.tag;
        document.getElementById('modalTitle').textContent = o.name.toUpperCase();
        document.getElementById('modalDesc').textContent = o.desc;
        document.getElementById('modalItems').innerHTML =
            o.items.map(i => `<li class="modal__item">${i}</li>`).join('');
        open();
    };

    window.openStyleModal = function (key) {
        const data = window.STYLE_DATA?.[key];
        if (!data) return;
        document.getElementById('modalImg').src = data.img;
        document.getElementById('modalTag').textContent = data.tag;
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalDesc').textContent = data.desc;
        document.getElementById('modalItems').innerHTML =
            data.items.map(i => `<li class="modal__item">${i}</li>`).join('');
        open();
    };
})();

/* ── Scroll Reveal ────────────────────────────────────────── */
function initScrollReveal() {
    const observer = new IntersectionObserver(
        entries => entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        }), {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
        .forEach(el => observer.observe(el));
}
window.initScrollReveal = initScrollReveal;
initScrollReveal();

/* ── Nav scroll border ────────────────────────────────────── */
(function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }, {
        passive: true
    });

    // Highlight active nav link based on current page
    const page = location.pathname.split('/').pop();
    document.querySelectorAll('.nav__links a').forEach(a => {
        if (a.getAttribute('href') === page || a.getAttribute('href') === './' + page) {
            a.classList.add('active');
        }
    });
})();

/* ── Like toggle ──────────────────────────────────────────── */
function likeOutfit(btn, event) {
    if (event) event.stopPropagation();
    const liked = btn.dataset.liked === 'true';
    btn.dataset.liked = liked ? 'false' : 'true';
    btn.classList.toggle('liked', !liked);
    const svg = btn.querySelector('svg');
    svg.style.fill = liked ? 'none' : 'var(--color-orange)';
    svg.style.stroke = liked ? 'currentColor' : 'var(--color-orange)';
    showToast(liked ? 'Đã bỏ yêu thích' : 'Đã thêm vào yêu thích ♥');
}
window.likeOutfit = likeOutfit;

/* ── Page transition ──────────────────────────────────────── */
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
            setTimeout(() => {
                window.location.href = href;
            }, 420);
        });
    });

    // Entrance: slide out
    window.addEventListener('pageshow', () => {
        pt.style.transformOrigin = 'top';
        pt.style.transform = 'scaleY(0)';
    });
})();

/* ── Render outfit card HTML ──────────────────────────────── */
function createOutfitCard(o, delay = 0) {
    const div = document.createElement('div');
    div.className = 'outfit-card reveal';
    div.style.transitionDelay = delay + 's';
    div.dataset.color = o.color || '';
    div.innerHTML = `
    <img class="outfit-card__img" src="${o.img}" alt="${o.name}" loading="lazy"/>
    <div class="outfit-card__overlay">
      <span class="outfit-card__tag">${o.tag}</span>
      <span class="outfit-card__name">${o.name}</span>
    </div>
    <button class="outfit-card__like" onclick="likeOutfit(this, event)" aria-label="Yêu thích">
      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>`;
    div.addEventListener('click', () => window.openOutfitModal(o));
    return div;
}
window.createOutfitCard = createOutfitCard;

/* ── Save Outfits to LocalStorage ──────────────────────────────── */

function saveOutfitLocal(outfit) {
    let list = JSON.parse(localStorage.getItem('savedOutfits')) || [];

    if (!list.find(i => i.id === outfit.id)) {
        list.push(outfit);
        localStorage.setItem('savedOutfits', JSON.stringify(list));
        showToast('Đã lưu vào tủ đồ!');
    } else {
        showToast('Outfit đã tồn tại!');
    }
}
window.saveOutfitLocal = saveOutfitLocal;