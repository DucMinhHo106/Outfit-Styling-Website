# StyleMIX — ảnh thật, phân loại quản trị và phát hành

Người dùng yêu cầu tiếp tục thu dữ liệu, thay ảnh cũ, giữ thiết kế hiện tại; thứ tự thu thập: quần theo màu rồi loại, tiếp đến áo và áo khoác. Không có nhóm/bộ lọc phụ kiện riêng. Ảnh phải toàn thân, thấy tổng thể outfit và giày. Nguồn Pinterest đã đăng nhập trong trình duyệt chat; Google/Douyin có thể bổ sung. Người dùng cho phép tải dữ liệu và yêu cầu merge main, push repo cũ, deploy, tên trang StyleMIX. Không hỏi lại các quyền này.

## Lựa chọn triển khai

- Tuyển ảnh thật qua giao diện nguồn, lưu file cùng Pin URL và các nhãn đã đối chiếu bằng mắt. Không tự gắn số liệu trending/follower khi chưa kiểm chứng.
- Tái sử dụng thiết kế tối/cam và bố cục hiện tại. Ảnh outfit hiển thị contain để không cắt người; ảnh dùng trong bộ chọn vẫn có thể là toàn bộ outfit nhưng nhãn chỉ rõ món cần chọn.
- Quy tắc ghép mẫu chỉ dùng quần/áo/áo khoác; giày xuất hiện trong ảnh là ngữ cảnh, không bắt buộc người dùng khai báo. Không thu phụ kiện thành nhóm riêng. Bỏ trang/phần phụ kiện riêng khỏi điều hướng; URL cũ chuyển về thư viện.
- Công cụ quản trị buildless tại admin.html: nhập ảnh cục bộ và link nguồn, gợi ý loại/màu bằng mô hình ảnh chạy trên trình duyệt, duyệt/sửa nhãn rồi xuất JSON. Không có khóa API, không tải ảnh riêng lên dịch vụ nhận diện. Lần đầu cần tải model; lỗi model có thông báo và cho nhập tay. Đây là công cụ chuẩn bị dữ liệu cho người duy trì, không phải endpoint cho người ngoài ghi vào repo/production.
- Gợi ý AI là nhãn ứng viên, không phải xác suất đúng đã hiệu chuẩn; không khẳng định chất liệu chỉ từ ảnh. Không tự xuất bản nhãn chưa duyệt.

## Phân công và thứ tự

1. Root tuyển ảnh, lưu metadata nguồn; chuẩn hóa taxonomy và dữ liệu mẫu, loại ảnh ghép/cắt người.
2. Agent riêng chỉ xây admin.html, assets/js/admin-core.js, assets/js/admin.js, assets/css/admin.css, tests/admin-core.test.cjs. Các file khác do root sở hữu. Agent không thao tác browser hoặc Git.
3. Root tích hợp data mới và bộ lọc theo màu/loại, đổi tên StyleMIX, giữ giao diện. Bổ sung test dữ liệu/ghép bộ theo yêu cầu mới.
4. Chạy suite, kiểm tra link/tài nguyên, duyệt ảnh và luồng trên browser; một review độc lập, sửa Important có hồi quy.
5. Cập nhật Notion các thay đổi/bằng chứng/giới hạn. Merge main, push origin repo hiện tại, kiểm tra GitHub Pages deployment đến hoàn tất rồi trả URL sản phẩm.

## Quy tắc nguồn ảnh

Ghi nguồn Pinterest và trạng thái quyền sử dụng chưa xác minh, không tuyên bố ảnh là tác phẩm do StyleMIX sở hữu. Dùng link nguồn ở chi tiết để truy nguyên; không bỏ watermark hoặc giả mạo tác giả. Trước khi claim production hoàn tất, kiểm tra ảnh tải được trên chính bản deploy.

## Điều kiện đạt

Ảnh thật khớp các món/màu trong mẫu; không cắt mất chân/giày trong giao diện. Bộ chọn theo quần → áo → áo khoác, không phụ kiện. Admin xuất dữ liệu hợp lệ sau duyệt; không bí mật gọi API có phí. Site và tài nguyên trên repo cũ deploy thành công, giữ lưu/bỏ lưu và lựa chọn cũ có xử lý tương thích.
