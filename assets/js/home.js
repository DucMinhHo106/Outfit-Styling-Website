/* =============================================================
   STYLEMIX — assets/js/home.js
   Homepage logic: outfits data, filter, slider, hero reveal
   ============================================================= */

'use strict';

/* ── Outfits Data ─────────────────────────────────────────── */
const OUTFITS = [{
        id: 1,
        img: 'https://down-vn.img.susercontent.com/file/sg-11134201-7ratp-ma8a3rb83jjy9d.webp',
        name: 'Casual Street Look',
        tag: 'Streetwear',
        color: 'gray',
        desc: 'Set casual đường phố năng động với áo thun oversized và quần jean.',
        items: ['Áo thun oversized trắng', 'Quần jean xám', 'Belt bag đen']
    },
    {
        id: 2,
        img: 'https://bizweb.dktcdn.net/100/527/490/files/minimal-style-2.jpg?v=1748826842923',
        name: 'Gray Minimal Set',
        tag: 'Minimal',
        color: 'gray',
        desc: 'Bộ đồ tối giản thanh lịch với tông xám nổi bật cùng phụ kiện tinh xảo.',
        items: ['Áo sơ mi xám', 'Quần ống suông xám', 'Sneakers trắng']
    },
    {
        id: 3,
        img: 'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mfnog69g9lag28.webp',
        name: 'Old School',
        tag: 'Vintage',
        color: 'brown',
        desc: 'Phong cách vintage tối giản với tông nâu trung tính ấm áp, sang trọng.',
        items: ['Chân váy nâu', 'Túi xách trắng', 'Sơ mi kem', 'Kính mắt gọng tròn']
    },
    {
        id: 4,
        img: 'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mfi45szrj3m152.webp',
        name: 'Summer Vibes',
        tag: 'Sporty',
        color: 'white',
        desc: 'Phong cách mùa hè tươi trẻ với tông trắng tươi mát.',
        items: ['Áo sơ mi', 'Quần shorts trắng', 'Áo thun cổ tròn']
    },
    {
        id: 5,
        img: 'https://cdn.tcdulichtphcm.vn/upload/4-2024/images/2024-11-28/1732785817-gu-thoi-trang-cua-son-tung-15.jpg',
        name: 'Streetwear Style',
        tag: 'Streetwear',
        color: 'white',
        desc: 'Cá tính với chiếc mũ nổi bật kết hợp set denim phong cách.',
        items: ['Mũ', 'Áo sơ mi denim', 'Quần short', 'Sneakers trắng']
    },
    {
        id: 6,
        img: 'https://down-vn.img.susercontent.com/file/sg-11134201-82596-mfryurxdvn67b9.webp',
        name: 'Autumn Minimal Look',
        tag: 'Minimal',
        color: 'black',
        desc: 'Thanh lịch và nhẹ nhàng với tông màu trầm kết hợp tinh tế.',
        items: ['Áo khoác đen', 'Quần xám basic', 'Túi tote', 'Giày loafer']
    },
    {
        id: 7,
        img: 'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mff3n2l7fvgr16.webp',
        name: 'Basic Streetwear Outfit',
        tag: 'Streetwear',
        color: 'gray',
        desc: 'Tông màu xám trầm pha chút cá tính từ phụ kiện đầy cuốn hút.',
        items: ['Áo thun cổ tròn xám', 'Quần Đen', 'Giày Sneaker', 'Khăn Bandana']
    },
    {
        id: 8,
        img: 'https://www.politix.com.au/dw/image/v2/ABBA_PRD/on/demandware.static/-/Sites-politix-master-catalog/default/dw09c8a843/images/hires/Winter%2024/G4/GV04W-DK-KHAKI-1.jpg?sw=2500&sh=3000&sm=cut',
        name: 'Matching suit',
        tag: 'Minimal',
        color: 'orange',
        desc: 'Một chiếc vibe mang lại cảm giác sang trọng, tự tin và quý phái.',
        items: ['Sơ mi tay dài', 'Giày tây đen', 'Áo Gile', 'Cà vạt']
    },
];

/* ── Style Modal Data ─────────────────────────────────────── */
window.STYLE_DATA = {
    streetwear: {
        title: 'STREETWEAR BOLD',
        tag: 'Streetwear',
        img: 'https://cdn.tcdulichtphcm.vn/upload/4-2024/images/2024-11-28/1732785817-gu-thoi-trang-cua-son-tung-11.jpg',
        desc: 'Phong cách đường phố năng động, tự do, thể hiện cá tính mạnh mẽ với những item oversized và màu sắc táo bạo.',
        items: ['Áo thun oversized', 'Quần jean ống suông', 'Sneakers', 'Mũ lưỡi trai', 'Kính mắt']
    },
    minimal: {
        title: 'MINIMAL CHIC',
        tag: 'Minimal',
        img: 'https://www.stylebysavina.com/wp-content/uploads/2023/09/minimal-style.jpg',
        desc: 'Tối giản nhưng tinh tế — tông màu trung tính kết hợp cắt may hoàn hảo tạo vẻ đẹp vượt thời gian.',
        items: ['Áo thun cổ tròn', 'Quần thẳng suông', 'Giày sneaker', 'Túi xách']
    },
    vintage: {
        title: 'VINTAGE REVIVAL',
        tag: 'Vintage',
        img: 'https://media.routine.vn/prod/media/phong-cach-vintage-la-gi-2.webp',
        desc: 'Phong cách vintage hoài cổ trở lại mạnh mẽ với hoạ tiết retro và chất liệu denim cổ điển.',
        items: ['Áo denim vintage', 'Quần kaki xám', 'Sneakers retro', 'Kính mắt retro']
    },
    sporty: {
        title: 'SPORTY LUXE',
        tag: 'Sporty',
        img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-m0bd0srefogf1f.webp',
        desc: 'Kết hợp phong cách thể thao và luxury fashion — năng động nhưng vẫn sang trọng mọi lúc.',
        items: ['Áo thể thao', 'Quần nỉ', 'Sneakers luxury', 'Túi xách', 'Mắt kính']
    },
};

/* ── Render & Filter ──────────────────────────────────────── */
let currentFilter = 'all';

function renderOutfits(data) {
    const grid = document.getElementById('outfitGrid');
    if (!grid) return;
    grid.innerHTML = '';
    data.forEach((o, i) => {
        const card = window.createOutfitCard(o, (i % 4) * 0.07);
        grid.appendChild(card);
    });
    window.initScrollReveal?.();
    window.bindCursorHover?.();
}

window.filterColor = function (el, color) {
    document.querySelectorAll('.color-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    currentFilter = color;
    const list = color === 'all' ? OUTFITS : OUTFITS.filter(o => o.color === color);
    renderOutfits(list.length ? list : OUTFITS);
};

window.loadMore = function () {
    showToast('Đang tải thêm outfit...');
    setTimeout(() => showToast('Đã tải thêm 8 outfit mới!'), 1000);
    
};

/* ── Trending Slider ──────────────────────────────────────── */
(function initSlider() {
    const track = document.getElementById('trendingTrack');
    const dotsWrap = document.getElementById('sliderDots');
    if (!track || !dotsWrap) return;

    const TOTAL = track.querySelectorAll('.trending__slide').length;
    let idx = 0,
        timer;

    // Build dots
    for (let i = 0; i < TOTAL; i++) {
        const d = document.createElement('div');
        d.className = 'slider-dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => go(i));
        dotsWrap.appendChild(d);
    }

    function slideW() {
        const s = track.querySelector('.trending__slide');
        return s ? s.offsetWidth + 28 : 0;
    }

    function go(i) {
        idx = i;
        track.style.transform = `translateX(-${idx * slideW()}px)`;
        dotsWrap.querySelectorAll('.slider-dot').forEach((d, k) =>
            d.classList.toggle('active', k === idx));
    }

    window.slideMove = function (dir) {
        go((idx + dir + TOTAL) % TOTAL);
        clearInterval(timer);
        timer = setInterval(() => window.slideMove(1), 4000);
    };

    timer = setInterval(() => window.slideMove(1), 4000);
    window.addEventListener('resize', () => go(idx));
})();

/* ── Hero entrance ────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
    renderOutfits(OUTFITS);
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal').forEach((el, i) =>
            setTimeout(() => el.classList.add('visible'), i * 130));
    }, 150);
});