# Bổ sung yêu cầu: ảnh thời trang thật và phân loại khi nhập ảnh

## Yêu cầu người dùng đã nêu

- Hình minh họa áo/quần hiện tại chưa đủ trực quan hoặc tạo cảm hứng thử phối đồ.
- Dùng ảnh thời trang thật, hiện đại và phù hợp các đối tượng đã chọn.
- Nguồn tìm mẫu gồm Google, Douyin (đã xác nhận đúng tên) và Pinterest (người dùng bổ sung).
- Khi cập nhật ảnh, tự phân loại món như áo đen, quần xanh biển, áo khoác nỉ trắng.
- Tiếp tục giữ thiết kế website hiện tại; bổ sung nội dung hình ảnh và luồng dữ liệu.

## Hiện trạng kiểm tra

assets/data/item-catalog.json dùng các trường loại, màu và ảnh SVG được nhập thủ công. assets/js/outfit-data.js chỉ kiểm tra dữ liệu và mô tả phương án thay thế. Chưa có xử lý thị giác, nhập ảnh tự động, nguồn xu hướng hay dịch vụ nhận diện.

## Đề xuất đang thảo luận, chưa triển khai

- Ảnh một món dùng ở bộ chọn tủ đồ; ảnh người mặc toàn bộ outfit dùng ở kết quả/chi tiết. Một ảnh toàn bộ outfit cần gắn nhãn nhiều món, không chỉ một màu chung.
- Luồng quản trị đề xuất: nhập ảnh cùng link nguồn → phân tích loại/màu từng món → chuẩn hóa nhãn tiếng Việt → kiểm tra nhãn chưa chắc → duyệt để xuất bản.
- Loại/kiểu dáng và màu là nhãn chính. Chất liệu như nỉ, len, cotton không được khẳng định chỉ từ ảnh nếu chưa đủ căn cứ; ưu tiên mô tả nguồn hoặc duyệt thủ công.
- Lưu tác giả/nguồn gốc, trạng thái quyền dùng ảnh, thời điểm thu thập, và chỉ số phổ biến nếu có dữ liệu xác minh. Xếp hạng tìm kiếm hoặc nhiều người theo dõi không tự chứng minh ảnh đó đang được tìm kiếm nhiều.
- Nhập ảnh đã tuyển chọn và nhận diện có duyệt là lựa chọn đề xuất cho giai đoạn đầu. Tự thu thập/xếp hạng xu hướng và xuất bản toàn bộ là một phạm vi lớn hơn, cần nguồn truy cập và vận hành riêng.
- Nhận diện AI thật có thể cần dịch vụ thị giác phía server hoặc mô hình chạy cục bộ; chưa chốt nhà cung cấp, tài nguyên hoặc chi phí. Không đưa khóa dịch vụ vào JavaScript công khai.

## Nguồn đã đối chiếu

- Pinterest copyright: https://help.pinterest.com/en/article/copyright — ảnh tìm thấy trên Pinterest có thể cần xin quyền từ chủ sở hữu.
- Pinterest Get Pin: https://developers.pinterest.com/docs/api/v5/pins-get/ — API này giới hạn vào Pin thuộc tài khoản thao tác hoặc group board được chia sẻ; không coi là công cụ tải mọi Pin bất kỳ.
- Google image reuse: https://support.google.com/websearch/answer/29508?hl=EN — kiểm tra thông tin giấy phép tại nguồn ảnh.

## Trạng thái

Đã lưu yêu cầu mới; chưa thay ảnh, chưa thêm AI vào sản phẩm, chưa thay production. Cần chốt phạm vi nhập ảnh do quản trị viên hay cả người dùng thông thường và chọn mức tự động trước khi viết thiết kế triển khai.
