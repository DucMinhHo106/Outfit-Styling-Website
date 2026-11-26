# StyleMIX - Outfit Styling Website

Thư viện phối đồ cơ bản cho học sinh, sinh viên và dân công sở. Chọn hoàn cảnh và những món đang có để tìm bộ mẫu, đọc hướng dẫn và lưu lại.

**Demo:** https://stylemix.pages.dev/

## Chức năng
- Chọn một hoặc nhiều món trong 17 món cơ bản, theo 4 hoàn cảnh.
- 12 bộ mẫu có ảnh thật toàn thân và link Pinterest nguồn, hướng dẫn mặc và phương án thay thế.
- Phân biệt bộ có thể mặc ngay, có thể thay thế và còn thiếu món.
- Giữ thiết kế hiện tại; Hot Hits đã bỏ, URL cũ chuyển đến thư viện.
- Danh mục quần, áo và áo khoác; lọc theo màu rồi loại, không có nhóm phụ kiện riêng.
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
- `index.html`: trang chủ; `quan.html`, `ao.html`, `ao-khoac.html`: danh mục.
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
5. Chọn riêng Sơ mi trắng + Đi làm: kết quả ghi rõ món thiếu. Thêm Quần vải đen: xuất hiện bộ có thể mặc ngay.
6. Thử đóng modal bằng Escape, dùng Tab/Shift+Tab và tải lại lựa chọn.

## Chuẩn bị ảnh quản trị
Mở `admin.html`, chọn ảnh máy hoặc ảnh thư viện và link Pin nguồn. Chọn nhóm quần → áo → áo khoác; dùng Phân tích để nhận gợi ý loại/màu, hoặc nhập tay. CLIP chạy cục bộ, lần đầu tải mô hình hơn 100 MB; nhãn phải được kiểm tra và duyệt. Không suy luận chất liệu từ ảnh.

Xuất JSON đã duyệt trước khi đóng trang; bàn giao JSON cùng file ảnh gốc. Người duy trì đối chiếu nguồn, sao chép ảnh vào `assets/photos`, cập nhật catalog và các bộ phối trong `scripts/build-photo-library.py`, rồi chạy script và kiểm thử trước khi commit/deploy. Công cụ quản trị không ghi trực tiếp vào website công khai và không lưu phiên lên server.

## Phạm vi và giới hạn
Dữ liệu tĩnh; không có tài khoản, đồng bộ server, mua hàng hoặc AI sinh bộ mới. Lựa chọn/yêu thích lưu trong trình duyệt; khi storage bị chặn có chế độ dự phòng và thông báo. Ảnh Pinterest có nguồn truy nguyên trong chi tiết và metadata; không khẳng định quyền sở hữu hoặc giấy phép tái sử dụng. Không có số liệu chứng minh độ phổ biến. Gợi ý nhận diện có thể sai, cần duyệt lại. Bộ ảnh toàn thân đã được đối chiếu bằng mắt; trang hỗ trợ bốn hoàn cảnh, có nhắc quy định trường/công sở.
