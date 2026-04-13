'use strict';

/* ── Helper load JSON ───────────────────────────── */
async function loadData(path) {
    try {
        const res = await fetch(path);
        return await res.json();
    } catch (err) {
        console.error("Lỗi load JSON:", err);
        return [];
    }
}

/* ── Render Áo / Quần ───────────────────────────── */
function renderProducts(gridId, items) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.innerHTML = '';

    items.forEach((o, i) => {
        const card = window.createOutfitCard(o, (i % 4) * 0.06);
        grid.appendChild(card);
    });

    window.initScrollReveal ?.();
    window.bindCursorHover ?.();
    updateCount(items.length);
}

function updateCount(n) {
    const el = document.getElementById('productCount');
    if (el) el.textContent = n;
}

/* ── Áo page (UPGRADE) ───────────────────────────── */
if (document.body.dataset.page === 'ao') {
    let DATA = [];

    document.addEventListener('DOMContentLoaded', async () => {
        DATA = await loadData('./assets/data/ao.json');
        renderProducts('aoGrid', DATA);

        setupSearch();
    });

    /* 🔍 Search realtime */
    function setupSearch() {
        const input = document.getElementById('searchInput');
        if (!input) return;

        input.addEventListener('input', () => {
            const keyword = input.value.toLowerCase().trim();

            const filtered = DATA.filter(item =>
                item.name.toLowerCase().includes(keyword) ||
                item.tag.toLowerCase().includes(keyword) ||
                item.color.toLowerCase().includes(keyword)
            );

            renderProducts('aoGrid', filtered);
        });
    }

    /* 🎯 Filter theo màu (nếu dùng sau này) */
    window.filterAo = function (btn, color) {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');

        const list = color === 'all' ?
            DATA :
            DATA.filter(p => p.color === color);

        renderProducts('aoGrid', list);
    };
}

/* ── Quần page ─────────────────────────────────── */
if (document.body.dataset.page === 'quan') {
    document.addEventListener('DOMContentLoaded', async () => {
        const data = await loadData('./assets/data/quan.json');
        renderProducts('quanGrid', data);
    });
}

/* ── Phụ kiện page ─────────────────────────────── */
if (document.body.dataset.page === 'phu-kien') {
    document.addEventListener('DOMContentLoaded', async () => {
        const grid = document.getElementById('featuredGrid');
        if (!grid) return;

        const data = await loadData('./assets/data/phu-kien.json');

        grid.innerHTML = '';

        data.forEach((item, i) => {
            const div = document.createElement('div');
            div.className = 'featured-card reveal';
            div.style.transitionDelay = i * 0.1 + 's';

            div.innerHTML = `
                <img class="featured-card__img" src="${item.img}" alt="${item.name}" loading="lazy"/>
                <div class="featured-card__overlay">
                    <span class="outfit-card__tag">${item.tag}</span>
                    <span class="featured-card__name">${item.name}</span>
                </div>
            `;

            div.addEventListener('click', () => window.openOutfitModal(item));
            grid.appendChild(div);
        });

        window.initScrollReveal ?.();
        window.bindCursorHover ?.();
    });
}

/* ── Hot Hits page ─────────────────────────────── */
if (document.body.dataset.page === 'hot_hits') {
    document.addEventListener('DOMContentLoaded', async () => {
        const data = await loadData('./assets/data/hot-hits.json');

        const grid = document.getElementById('hitsGrid');
        if (!grid) return;

        grid.innerHTML = '';

        // render grid
        data.forEach((o, i) => {
            const div = document.createElement('div');
            div.className = 'outfit-card hits-card reveal';
            div.style.transitionDelay = (i % 4) * 0.07 + 's';

            div.innerHTML = `
                <img class="outfit-card__img" src="${o.img}" alt="${o.name}" loading="lazy"/>
                <div class="outfit-card__overlay">
                    <span class="outfit-card__tag">${o.tag}</span>
                    <span class="outfit-card__name">${o.name}</span>
                </div>
                <button class="outfit-card__like" onclick="likeOutfit(this, event)">
                    ❤️
                </button>
            `;

            div.addEventListener('click', () => window.openOutfitModal(o));
            grid.appendChild(div);
        });

        // ⭐ Featured = item đầu tiên
        const f = data[0];
        if (f) {
            document.getElementById('featuredImg').src = f.img;
            document.getElementById('featuredName').textContent = f.name;
            document.getElementById('featuredDesc').textContent = f.desc;
            document.getElementById('featuredViews').textContent = f.views;
            document.getElementById('featuredSaves').textContent = f.saves;
            document.getElementById('featuredRating').textContent = f.rating;
        }

        window.initScrollReveal?.();
        window.bindCursorHover?.();
    });
}

/* ── Save outfit ───────────────────────────────── */
window.saveOutfit = function () {
    showToast('Đã lưu outfit vào tủ đồ!');
};