/* =============================================================
   STYLEMIX — assets/js/pages.js  (v2 clean)
   ============================================================= */
'use strict';

async function loadData(path) {
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return await res.json();
    } catch (err) {
        console.error('Lỗi load JSON:', err);
        return [];
    }
}

function renderProducts(gridId, items) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    items.forEach(function(o, i) {
        grid.appendChild(window.createOutfitCard(o, (i % 4) * 0.06));
    });
    window.initScrollReveal && window.initScrollReveal();
    window.bindCursorHover && window.bindCursorHover();
    const countEl = document.getElementById('productCount');
    if (countEl) countEl.textContent = items.length;
}

function setupSearchFilter(gridId, getData) {
    const input = document.getElementById('searchInput');
    if (!input) return;
    input.addEventListener('input', function() {
        const kw = input.value.toLowerCase().trim();
        const filtered = getData().filter(function(item) {
            return item.name.toLowerCase().includes(kw) ||
                   item.tag.toLowerCase().includes(kw) ||
                   (item.color || '').toLowerCase().includes(kw);
        });
        renderProducts(gridId, filtered);
    });
}

/* ─────────────────────────────────────────────
   ÁO PAGE
───────────────────────────────────────────── */
if (document.body.dataset.page === 'ao') {
    var AO_DATA = [];
    document.addEventListener('DOMContentLoaded', async function() {
        AO_DATA = await loadData('./assets/data/ao.json');
        window.__FILTER_DATA__ = AO_DATA;
        renderProducts('aoGrid', AO_DATA);
        var colors = AO_DATA.map(function(d){ return d.color; }).filter(Boolean)
                            .filter(function(v,i,a){ return a.indexOf(v)===i; });
        window.buildColorFilterBar(colors, 'aoGrid', AO_DATA);
        setupSearchFilter('aoGrid', function(){ return AO_DATA; });
    });
}

/* ─────────────────────────────────────────────
   QUẦN PAGE
───────────────────────────────────────────── */
if (document.body.dataset.page === 'quan') {
    var QUAN_DATA = [];
    document.addEventListener('DOMContentLoaded', async function() {
        QUAN_DATA = await loadData('./assets/data/quan.json');
        window.__FILTER_DATA__ = QUAN_DATA;
        renderProducts('quanGrid', QUAN_DATA);
        var colors = QUAN_DATA.map(function(d){ return d.color; }).filter(Boolean)
                              .filter(function(v,i,a){ return a.indexOf(v)===i; });
        window.buildColorFilterBar(colors, 'quanGrid', QUAN_DATA);
        setupSearchFilter('quanGrid', function(){ return QUAN_DATA; });
    });
}

/* ─────────────────────────────────────────────
   PHỤ KIỆN PAGE
───────────────────────────────────────────── */
if (document.body.dataset.page === 'phu-kien') {
    var PK_DATA = [];

    function renderFeaturedGrid(items) {
        var grid = document.getElementById('featuredGrid');
        if (!grid) return;
        grid.innerHTML = '';
        items.forEach(function(item, i) {
            var liked = window.isOutfitSaved ? window.isOutfitSaved(item.id) : false;
            var div = document.createElement('div');
            div.className = 'featured-card reveal';
            div.style.transitionDelay = (i * 0.1) + 's';

            var svgFill = liked ? 'fill:var(--color-orange);stroke:var(--color-orange)' : 'fill:none;stroke:currentColor';
            var likedClass = liked ? ' liked' : '';
            var safeJson = JSON.stringify(item)
                .replace(/\\/g, '\\\\')
                .replace(/'/g, "\\'");

            div.innerHTML =
                '<img class="featured-card__img" src="' + item.img + '" alt="' + item.name + '" loading="lazy"/>' +
                '<div class="featured-card__overlay">' +
                  '<span class="outfit-card__tag">' + item.tag + '</span>' +
                  '<span class="featured-card__name">' + item.name + '</span>' +
                '</div>' +
                '<button class="outfit-card__like' + likedClass + '" style="opacity:1;transform:scale(1)" ' +
                  'data-liked="' + liked + '" ' +
                  'aria-label="Yêu thích">' +
                  '<svg width="14" height="14" style="' + svgFill + '" stroke-width="2" viewBox="0 0 24 24">' +
                    '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' +
                  '</svg>' +
                '</button>';

            // Attach like button handler with closure
            (function(capturedItem, capturedDiv) {
                var likeBtn = capturedDiv.querySelector('.outfit-card__like');
                likeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    window.likeOutfit(likeBtn, e, capturedItem);
                });
                capturedDiv.addEventListener('click', function(e) {
                    if (e.target.closest('.outfit-card__like')) return;
                    window.openOutfitModal(capturedItem);
                });
            })(item, div);

            grid.appendChild(div);
        });
        window.initScrollReveal && window.initScrollReveal();
        window.bindCursorHover && window.bindCursorHover();
    }

    document.addEventListener('DOMContentLoaded', async function() {
        PK_DATA = await loadData('./assets/data/phu-kien.json');
        window.__FILTER_DATA__ = PK_DATA;
        renderFeaturedGrid(PK_DATA);

        var colors = PK_DATA.map(function(d){ return d.color; }).filter(Boolean)
                            .filter(function(v,i,a){ return a.indexOf(v)===i; });
        window.buildColorFilterBar(colors, 'featuredGrid', PK_DATA);

        // Override filterByColor for phu-kien to use featured-card style
        var origFilter = window.filterByColor;
        window.filterByColor = function(btn, color, gridId) {
            if (gridId === 'featuredGrid') {
                document.querySelectorAll('.filter-chip').forEach(function(c){ c.classList.remove('active'); });
                btn.classList.add('active');
                var filtered = color === 'all' ? PK_DATA : PK_DATA.filter(function(p){ return (p.color||'') === color; });
                renderFeaturedGrid(filtered);
            } else {
                origFilter && origFilter(btn, color, gridId);
            }
        };
    });
}

/* ─────────────────────────────────────────────
   HOT HITS PAGE
───────────────────────────────────────────── */
if (document.body.dataset.page === 'hot_hits') {
    var HITS_DATA = [];

    function renderHitsGrid(items) {
        var grid = document.getElementById('hitsGrid');
        if (!grid) return;
        grid.innerHTML = '';
        items.forEach(function(o, i) {
            var liked = window.isOutfitSaved ? window.isOutfitSaved(o.id) : false;
            var div = document.createElement('div');
            div.className = 'outfit-card hits-card reveal';
            div.style.transitionDelay = ((i % 4) * 0.07) + 's';
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

            (function(capturedO, capturedDiv) {
                var likeBtn = capturedDiv.querySelector('.outfit-card__like');
                likeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    window.likeOutfit(likeBtn, e, capturedO);
                });
                capturedDiv.addEventListener('click', function(e) {
                    if (e.target.closest('.outfit-card__like')) return;
                    window.openOutfitModal(capturedO);
                });
            })(o, div);

            grid.appendChild(div);
        });
        window.initScrollReveal && window.initScrollReveal();
        window.bindCursorHover && window.bindCursorHover();
        var countEl = document.getElementById('productCount');
        if (countEl) countEl.textContent = items.length;
    }

    document.addEventListener('DOMContentLoaded', async function() {
        HITS_DATA = await loadData('./assets/data/hot-hits.json');
        window.__FILTER_DATA__ = HITS_DATA;

        renderHitsGrid(HITS_DATA);

        // Featured first item
        var f = HITS_DATA[0];
        if (f) {
            window.currentOutfit = f;
            var fi = document.getElementById('featuredImg'); if (fi) fi.src = f.img;
            var fn = document.getElementById('featuredName'); if (fn) fn.textContent = f.name;
            var fd = document.getElementById('featuredDesc'); if (fd) fd.textContent = f.desc;
            var fv = document.getElementById('featuredViews'); if (fv) fv.textContent = f.views;
            var fs = document.getElementById('featuredSaves'); if (fs) fs.textContent = f.saves;
            var fr = document.getElementById('featuredRating'); if (fr) fr.textContent = f.rating;
        }

        var colors = HITS_DATA.map(function(d){ return d.color; }).filter(Boolean)
                              .filter(function(v,i,a){ return a.indexOf(v)===i; });
        window.buildColorFilterBar(colors, 'hitsGrid', HITS_DATA);

        // Override filterByColor for hot_hits
        var origFilter = window.filterByColor;
        window.filterByColor = function(btn, color, gridId) {
            if (gridId === 'hitsGrid') {
                document.querySelectorAll('.filter-chip').forEach(function(c){ c.classList.remove('active'); });
                btn.classList.add('active');
                var filtered = color === 'all' ? HITS_DATA : HITS_DATA.filter(function(p){ return (p.color||'') === color; });
                renderHitsGrid(filtered);
            } else {
                origFilter && origFilter(btn, color, gridId);
            }
        };
    });
}

/* ─────────────────────────────────────────────
   YÊU THÍCH PAGE
───────────────────────────────────────────── */
if (document.body.dataset.page === 'yeu-thich') {
    document.addEventListener('DOMContentLoaded', function() {
        renderLikedPage();
    });

    function renderLikedPage() {
        var list = [];
        try { list = JSON.parse(localStorage.getItem('stylemix_liked_outfits') || '[]'); } catch(e) {}

        var grid = document.getElementById('likedGrid');
        var emptyState = document.getElementById('emptyState');
        var countEl = document.getElementById('likedCount');
        var productCount = document.getElementById('productCount');

        if (countEl) countEl.textContent = list.length;
        if (productCount) productCount.textContent = list.length;

        if (!grid) return;

        if (list.length === 0) {
            grid.style.display = 'none';
            if (emptyState) emptyState.style.display = 'flex';
            return;
        }

        grid.style.display = '';
        if (emptyState) emptyState.style.display = 'none';

        window.__FILTER_DATA__ = list;
        grid.innerHTML = '';
        list.forEach(function(o, i) {
            grid.appendChild(window.createOutfitCard(o, (i % 4) * 0.06));
        });
        window.initScrollReveal && window.initScrollReveal();
        window.bindCursorHover && window.bindCursorHover();

        var colors = list.map(function(d){ return d.color; }).filter(Boolean)
                         .filter(function(v,i,a){ return a.indexOf(v)===i; });
        if (colors.length > 0) window.buildColorFilterBar(colors, 'likedGrid', list);
    }

    window.clearAllLiked = function() {
        if (!confirm('Xoá tất cả outfit yêu thích?')) return;
        localStorage.removeItem('stylemix_liked_outfits');
        renderLikedPage();
        window.showToast && window.showToast('Đã xoá tất cả outfit yêu thích');
    };

    // Search within liked
    document.addEventListener('DOMContentLoaded', function() {
        var input = document.getElementById('searchInput');
        if (!input) return;
        input.addEventListener('input', function() {
            var kw = input.value.toLowerCase().trim();
            var list = [];
            try { list = JSON.parse(localStorage.getItem('stylemix_liked_outfits') || '[]'); } catch(e) {}
            var filtered = kw ? list.filter(function(o) {
                return o.name.toLowerCase().includes(kw) ||
                       o.tag.toLowerCase().includes(kw) ||
                       (o.color || '').toLowerCase().includes(kw);
            }) : list;
            var grid = document.getElementById('likedGrid');
            if (!grid) return;
            grid.innerHTML = '';
            filtered.forEach(function(o, i) {
                grid.appendChild(window.createOutfitCard(o, (i % 4) * 0.06));
            });
            window.initScrollReveal && window.initScrollReveal();
            var countEl = document.getElementById('productCount');
            if (countEl) countEl.textContent = filtered.length;
        });
    });
}
