# StyleMix — thiết kế bản dùng thử công khai

## Mục tiêu và người dùng

Phục vụ học sinh, sinh viên và dân công sở chưa có kinh nghiệm phối đồ: chọn hoàn cảnh và vài món đang có để tìm bộ phối mẫu có thể mặc theo. Kết quả đến từ thư viện được biên tập, kèm hướng dẫn dễ hiểu.

Người dùng đã chọn hướng: chọn nhanh đồ mỗi lần tìm, ghi nhớ trên trình duyệt, phát triển tủ đồ cá nhân sau. Các quyết định chi tiết dưới đây là đề xuất của người thiết kế, chờ duyệt.

Yêu cầu bổ sung đã được người dùng xác nhận: giữ nguyên thiết kế web hiện tại và xóa chức năng Hot Hits. Giữ nhận diện, màu sắc, typography, bố cục và phong cách thành phần hiện có; các điều khiển mới sử dụng cùng ngôn ngữ thiết kế. Chỉ điều chỉnh phần bố cục cần thiết để bỏ Hot Hits và đưa luồng chọn đồ vào; không thiết kế lại website.

## Hiện trạng đã khảo sát

- Website công khai: https://ducminhho106.github.io/Outfit-Styling-Website/
- Mã nguồn: https://github.com/DucMinhHo106/Outfit-Styling-Website
- HTML/CSS/JavaScript, dữ liệu JSON, yêu thích lưu bằng localStorage.
- Có danh mục, tìm kiếm, lọc màu, modal và trang yêu thích; chưa có tài khoản hay đồng bộ server.
- Đã quan sát: nút bộ lọc chỉ báo đang phát triển; tìm kiếm bỏ qua màu đã chọn; bỏ yêu thích chưa cập nhật ngay danh sách/số lượng; không có thông báo tìm kiếm rỗng; nhiều liên kết footer trỏ #.
- Chưa kiểm thử toàn bộ màn hình, thiết bị, trình duyệt hoặc tất cả trang.

## Các cách đã cân nhắc

1. Chọn nhanh đồ đang có: ít bước, không đăng ký; cần ghi nhớ lựa chọn để lần sau tiện dùng. Người dùng đã chọn cách này theo đề xuất.
2. Tạo tủ đồ cá nhân trước: thuận tiện dùng lâu dài nhưng cần khai báo nhiều món, tài khoản/đồng bộ nếu dùng nhiều thiết bị. Để giai đoạn sau.

## Phạm vi bản đầu

- Chọn một hoàn cảnh: đi học, đi làm, thuyết trình/phỏng vấn, đi chơi. Có gợi ý tuân thủ quy định trang phục tại trường hoặc nơi làm việc.
- Chọn món qua thẻ minh họa và tên tiếng Việt, phân nhóm áo, quần/váy, giày. Có thể chọn nhiều món mỗi nhóm, sửa hoặc xóa từng lựa chọn.
- Mô tả món theo loại và màu; không yêu cầu ảnh cá nhân, số đo, thương hiệu hay giới tính. Phụ kiện là tùy chọn.
- Kết quả gồm bộ mẫu, các món đã khớp, món cần thay thế hoặc còn thiếu, cùng lý do ngắn.
- Trang chi tiết có ảnh, danh sách món thiết yếu/tùy chọn, hướng dẫn mặc và lựa chọn thay thế đã được biên tập.
- Lưu/bỏ lưu bộ mẫu và ghi nhớ đồ đã chọn trên trình duyệt; có nút xóa lựa chọn, giải thích giới hạn lưu cục bộ.
- Sửa các lỗi đã quan sát thuộc luồng bản đầu; hoàn thiện hoặc bỏ liên kết chưa có đích đến.
- Xóa chức năng Hot Hits: bỏ trang/mục Hot Hits, liên kết điều hướng, CTA và mã/dữ liệu chỉ phục vụ chức năng này. Không tự xóa khối outfit nổi bật ở trang chủ chỉ vì tên gần giống; chỉ bỏ phần dẫn đến hoặc phụ thuộc Hot Hits. Giữ nội dung, ảnh và bộ phối đang được các phần khác sử dụng. Nếu Hot Hits có bộ mẫu hữu ích, chuyển sang thư viện chung trước khi gỡ phần dữ liệu riêng. Kiểm kê mọi tham chiếu để tránh liên kết chết.

## Luồng sử dụng

Trang chủ giải thích ngắn lợi ích → chọn hoàn cảnh → chọn đồ đang có → xem kết quả → mở bộ mẫu → lưu bộ yêu thích. Không bắt đăng nhập. Cho phép quay lại sửa mà không mất lựa chọn.

Nút tìm vẫn dùng được khi mới chọn một món. Khi chưa chọn đồ, hiển thị thư viện theo hoàn cảnh và ghi rõ chưa đối chiếu tủ đồ. Không có bộ phù hợp thì giữ lựa chọn, giải thích và cho phép đổi hoàn cảnh/xem mẫu thiếu món; không tự bỏ điều kiện.

## Quy tắc tìm bộ mẫu

- Một bộ có các vị trí thiết yếu (ví dụ áo, quần hoặc váy, giày); mỗi vị trí tham chiếu loại và màu được chuẩn hóa. Bộ liền thân có thể thay cho cặp áo/quần theo cấu trúc dữ liệu.
- Món người dùng chọn được xem là món sở hữu; không bắt buộc một bộ sử dụng tất cả món đã chọn.
- Lọc theo hoàn cảnh trước. Nhóm “Có thể mặc ngay” gồm bộ mà mọi vị trí thiết yếu đều có ít nhất một món khớp chính xác.
- Nhóm “Có thể thay thế” gồm bộ đủ các vị trí thiết yếu nhờ các phương án thay thế được biên tập; ghi rõ thay món nào bằng món nào.
- Nhóm “Còn thiếu món” chỉ hiện ở khu vực riêng, nêu rõ món thiếu; không gọi là bộ có thể mặc ngay.
- Ưu tiên khớp chính xác, ít thay thế, sau đó theo thứ tự biên tập ổn định. Không hiển thị phần trăm phù hợp gây hiểu nhầm.
- Không tự xem màu hoặc kiểu dáng bất kỳ là thay thế tương đương. Phụ kiện tùy chọn không làm bộ bị đánh dấu thiếu.

## Nội dung và dữ liệu

Đề xuất khởi đầu 24 bộ mẫu, khoảng 6 bộ mỗi hoàn cảnh; số lượng này là mục tiêu biên tập, không phải nội dung đã có. Ưu tiên áo thun trơn, sơ mi, polo, jeans, quần vải, chân váy, sneaker và giày đơn giản; có các bộ với váy/đầm phù hợp.

Mỗi bộ có ID ổn định, tiêu đề, hoàn cảnh, ảnh có nguồn/quyền sử dụng, các vị trí thiết yếu, phụ kiện tùy chọn, phương án thay thế, hướng dẫn và tag. Không gắn nhãn trending hay dùng số lượt xem/lưu giả như dữ liệu thực.

Trước khi code phải kiểm kê ảnh/dữ liệu hiện có; chỉ đưa bộ đủ nội dung và quyền dùng ảnh vào bản công khai. Nếu chưa đủ 24 bộ, giảm số lượng và báo rõ, không lấp bằng nội dung lặp hoặc ảnh chưa xác minh.

## Kỹ thuật và giới hạn

Đề xuất giữ HTML/CSS/JavaScript và JSON cho bản đầu, tách xử lý lựa chọn, tìm bộ và lưu cục bộ thành các phần dễ kiểm tra. Không cần backend cho phạm vi này. Mã nguồn chưa được tải về hoặc chỉnh sửa trong cuộc khảo sát; việc triển khai cần bản sao riêng trong vùng có quyền ghi.

Không chỉnh sửa sources/ hay tệp đồng bộ của dự án ChatGPT. Chưa push hoặc thay bản đang công khai trong giai đoạn thiết kế.

Ngoài phạm vi: AI sinh outfit, thử đồ ảo, tải ảnh tủ đồ, tài khoản, cộng đồng, mua hàng, dữ liệu thời tiết, đồng bộ nhiều thiết bị, hệ quản trị riêng, tạo/chia sẻ ảnh outfit.

## Chất lượng và tiêu chí chấp nhận

- Hoàn cảnh và đồ đã chọn được áp dụng đồng thời; sửa điều kiện cập nhật kết quả nhất quán.
- Bộ “Có thể mặc ngay” luôn đủ món thiết yếu; trường hợp thay thế và thiếu món được phân biệt đúng.
- Lưu/bỏ lưu cập nhật ngay ở thẻ, danh sách và số lượng; tải lại vẫn đúng.
- localStorage không khả dụng/hỏng thì vẫn dùng được phiên hiện tại và có thông báo phù hợp.
- Có trạng thái đang tải, dữ liệu lỗi/thử lại, không có kết quả và tủ đồ trống; ảnh lỗi có phương án hiển thị thay thế.
- Dùng được trên điện thoại, bàn phím; có nhãn điều khiển rõ, focus nhìn thấy, modal quản lý focus và hỗ trợ giảm chuyển động.
- Kiểm tra thực tế tối thiểu ở chiều rộng 360px và 1280px; kiểm thử quy tắc ghép bộ và các luồng tìm → xem → lưu → tải lại → bỏ lưu.
- Mọi liên kết hiển thị đều có tác dụng; ảnh và nội dung đủ nguồn để công khai. Không còn đường dẫn hoặc điều khiển dẫn đến Hot Hits; các bộ mẫu dùng chung vẫn hoạt động.
- Đối chiếu ảnh giao diện trước/sau ở các trang và kích thước kiểm tra: thiết kế hiện tại được giữ, chỉ khác các điều chỉnh chức năng đã nêu.
- Có thông tin giới thiệu, liên hệ và cách lưu dữ liệu cục bộ; tiêu đề/mô tả trang và ảnh xem trước chia sẻ phù hợp.

## Thành công và những điều cần tránh

Thành công: người mới tìm được một bộ mẫu đủ món hoặc biết rõ món nào cần thay, hiểu cách mặc và lưu lại được mà không cần đăng ký. Bản dùng thử cần thu phản hồi về độ dễ chọn món và tính khả dụng của gợi ý trước khi mở rộng.

Tránh: ép người dùng biết thuật ngữ thời trang, gợi ý phải mua thêm mà không báo thiếu, bắt khai báo cả tủ đồ, giả vờ cá nhân hóa theo cơ thể khi chưa có cơ sở.

## Để người triển khai quyết định

Tên biến/module, cấu trúc JSON cụ thể và lựa chọn thư viện kiểm thử nhẹ. Bố trí responsive và hình thức thẻ phải giữ thiết kế hiện tại, các thành phần mới tái sử dụng kiểu hiện có. Cần kiểm kê mã nguồn và ảnh trước khi ước lượng công sức hoặc chốt lịch.

## Trạng thái

Người dùng đã duyệt kế hoạch và yêu cầu triển khai từng bước, lưu tiến độ vào Notion. Bản nâng cấp đã được thực hiện trên nhánh riêng, có kiểm thử và review độc lập; xem progress.md và final-review.md để biết bằng chứng, giới hạn và các điểm còn lại. Chưa thay production.
