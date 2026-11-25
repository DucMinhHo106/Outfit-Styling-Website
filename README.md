# StyleMix - Outfit Styling Website

Thư viện phối đồ cơ bản cho học sinh, sinh viên và dân công sở. Chọn hoàn cảnh và những món đang có để tìm bộ mẫu, đọc hướng dẫn và lưu lại.

**Demo:** https://ducminhho106.github.io/Outfit-Styling-Website/

## Chức năng
- Chọn một hoặc nhiều món trong 21 món cơ bản, theo 4 hoàn cảnh.
- 24 bộ mẫu có hình minh họa gốc, hướng dẫn mặc và phương án thay thế.
- Phân biệt bộ có thể mặc ngay, có thể thay thế và còn thiếu món.
- Giữ thiết kế hiện tại; Hot Hits đã bỏ, URL cũ chuyển đến thư viện.
- Danh mục áo, quần và phụ kiện.
- Tìm theo tên, tag hoặc màu; bộ lọc màu theo dữ liệu danh mục.
- Xem thông tin trang phục trong modal.
- Lưu/bỏ yêu thích trên trình duyệt và xem ở `yeu-thich.html`.

## Công nghệ
HTML, CSS, JavaScript; dữ liệu JSON và localStorage.

## Chạy local

Cần Python 3. Tại thư mục gốc repo, chạy:

```powershell
python -m http.server 8000
```

Mở http://localhost:8000/. Không cần npm hoặc bước build. Dùng HTTP server thay vì mở trực tiếp file HTML vì trang có tải dữ liệu/thành phần bằng `fetch`.

## Cấu trúc
- `index.html`: trang chủ; `ao.html`, `quan.html`, `phu-kien.html`: danh mục.
- `yeu-thich.html`: danh sách yêu thích; `thong-tin.html`: hướng dẫn, liên hệ và lưu dữ liệu.
- `hot_hits.html`: chỉ là chuyển hướng tương thích, không còn chức năng Hot Hits.
- `assets/data/`: dữ liệu danh mục JSON.
- `assets/js/global.js`: modal, yêu thích, điều hướng và tương tác dùng chung.
- `assets/js/pages.js`: nạp dữ liệu, tìm kiếm và hiển thị theo trang.
- `assets/js/home.js`: tương tác trang chủ.
- `assets/js/outfit-data.js`, `outfit-matcher.js`, `outfit-picker.js`, `outfit-storage.js`: dữ liệu, ghép mẫu, chọn đồ và lưu cục bộ.
- `assets/illustrations/`: minh họa món, bộ phối và ảnh chia sẻ do dự án tạo.
- `docs/design.md`, `docs/implementation-plan.md`, `docs/progress.md`, `docs/qa-results.md`: thiết kế, kế hoạch và bằng chứng kiểm tra.

## Kiểm tra tự động

Cần Node 22+ và Python 3; không cần cài npm package.

```powershell
node --test
python scripts/check-static.py
```

## Kiểm tra thủ công
1. Mở từng danh mục, nhập một tên hoặc màu có trong dữ liệu.
2. Mở modal một món, lưu yêu thích và kiểm tra số lượng trên điều hướng.
3. Vào trang yêu thích, tải lại trang rồi bỏ một món khỏi danh sách.
4. Thử từ khóa không có kết quả và giao diện mobile.
5. Chọn riêng Sơ mi trắng + Đi làm: kết quả ghi rõ món thiếu. Thêm Quần vải đen + Loafer đen: xuất hiện bộ có thể mặc ngay.
6. Thử đóng modal bằng Escape, dùng Tab/Shift+Tab và tải lại lựa chọn.

## Phạm vi và giới hạn
Dữ liệu tĩnh; không có tài khoản, đồng bộ server, mua hàng hoặc AI sinh bộ mới. Lựa chọn/yêu thích chỉ lưu trong trình duyệt hiện tại; khi lưu bị chặn, dùng bộ nhớ phiên và thông báo giới hạn. Minh họa thể hiện loại đồ và màu, không mô phỏng độ vừa người. Các ảnh tham khảo/hero cũ tải từ bên thứ ba; cần xác nhận quyền sử dụng trước phát hành công khai. Bản nâng cấp ở nhánh riêng, chưa thay bản GitHub Pages công khai.
