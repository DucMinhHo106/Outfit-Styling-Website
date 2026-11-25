# StyleMix Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chọn một hoặc nhiều món đang có để tìm, hiểu và lưu bộ phối mẫu phù hợp hoàn cảnh; giữ thiết kế hiện tại, bỏ Hot Hits.

**Architecture:** Giữ website tĩnh HTML/CSS/JavaScript và JSON. Ghép bộ theo quy tắc biên tập, quản lý lựa chọn tập trung, lưu cục bộ với phương án dự phòng trong bộ nhớ. Chưa cần backend.

**Tech Stack:** HTML, CSS, JavaScript, JSON, localStorage; đề xuất Node built-in test runner cho logic thuần nếu môi trường có Node.

**Spec:** ../specs/2026-11-25-stylemix-design.md

## Global Constraints

- Giữ nguyên thiết kế web hiện tại và xóa chức năng Hot Hits.
- Không chỉnh sửa sources/ hay tệp đồng bộ của dự án ChatGPT.
- Không bắt đăng nhập; không thu ảnh cá nhân hoặc số đo.
- Không đánh dấu mặc ngay nếu thiếu món thiết yếu; phụ kiện tùy chọn không tính là thiếu.
- Không tự push hoặc thay production trong giai đoạn lập kế hoạch.
- Mã nguồn chưa có trong workspace này. Đường dẫn repo dưới đây là tương đối trong bản sao triển khai; tên module mới là đề xuất. Bước 1 phải xác minh cấu trúc và bổ sung đường dẫn CSS/thành phần thực tế trước khi chỉnh code. Chưa ước lượng lịch khi chưa kiểm kê ảnh và mã nguồn.

## Review Focus

- Chỉ chọn một món: vẫn trả bộ liên quan và nêu các món chưa biết có sở hữu; task 4 kiểm tra.
- Nhiều món cùng nhóm: một món khớp đã đủ vị trí, không yêu cầu dùng hết; task 4 kiểm tra.
- Đổi điều kiện hoặc tìm không có kết quả: không tự bỏ bộ lọc; task 5 kiểm tra.
- Dữ liệu localStorage hỏng hoặc bị chặn: phiên hiện tại vẫn dùng được; task 6 kiểm tra.
- Outfit dùng chung với Hot Hits: gỡ chức năng không làm mất bộ mẫu hay ảnh ở trang khác; task 2 kiểm tra.

## Task 1: Chuẩn bị bản triển khai và ghi nhận giao diện gốc

**Files:** đọc README.md, index.html, ao.html, quan.html, phu-kien.html, hot_hits.html, yeu-thich.html, assets/js/global.js, assets/js/pages.js, assets/js/home.js; kiểm kê assets/data/ và các CSS/thành phần thực tế.

**Interfaces:** tạo danh sách trang, phụ thuộc dùng chung, ảnh nguồn và đường dẫn chỉnh sửa xác thực để các task sau sử dụng.

- [ ] Tạo bản sao mã nguồn trong vùng có quyền ghi; xác minh nhánh, commit và hướng dẫn repo, không làm việc trên sources/.
- [ ] Chạy `python -m http.server 8000`; mở trang chủ và các trang chính, chụp mốc tại 360px và 1280px.
- [ ] Ghi nhận các lỗi hiện tại, ảnh có thể dùng, nguồn ảnh, cấu trúc CSS/thành phần và tham chiếu Hot Hits. Chốt danh sách file thực tế trước task 2.

## Task 2: Bỏ Hot Hits và hoàn thiện các tương tác hiện có

**Files:** hot_hits.html, assets/js/pages.js, assets/js/global.js, assets/js/home.js, index.html, các thành phần điều hướng/footer và dữ liệu đã xác minh ở task 1.

**Interfaces:** bảo toàn dữ liệu bộ phối dùng chung; toàn bộ điểm điều hướng hiển thị có đích đến hoạt động.

- [ ] Ghi nhận phép thử trước sửa: chọn màu đen rồi tìm trắng; bỏ lưu một bộ trên trang yêu thích; tìm từ không tồn tại.
- [ ] Gỡ trang và mã chỉ phục vụ Hot Hits, chuyển bộ hữu ích sang thư viện chung trước khi gỡ dữ liệu riêng; xử lý liên kết nội bộ và URL cũ theo khả năng hosting.
- [ ] Hợp nhất trạng thái tìm kiếm/lọc màu để điều kiện cùng áp dụng; cập nhật thẻ, số lượng và trạng thái trống ngay sau bỏ lưu; thêm lời giải thích khi không có kết quả.
- [ ] Chạy lại các phép thử: màu đen + từ trắng phải không trả áo trắng; bỏ lưu biến mất ngay và vẫn đúng sau tải lại. Kiểm tra mọi trang còn dùng ảnh/bộ phối chung và không còn nút dẫn Hot Hits.
- [ ] Review diff và tạo commit riêng cho task khi có repo Git.

## Task 3: Chuẩn hóa thư viện mẫu

**Files:** tạo assets/data/outfit-templates.json, assets/data/item-catalog.json, assets/js/outfit-data.js và tests/outfit-data.test.cjs (tên mới đề xuất).

**Interfaces:** `validateTemplates(templates, catalog) -> string[]`; mỗi template có `id`, `title`, `occasions`, `image`, `imageSource`, `requiredSlots`, `optionalItems`, `instructions`, `editorialOrder`. Mỗi slot có `id`, `acceptedItemIds`, `substituteItemIds`; catalog chứa item ID, loại và màu chuẩn hóa.

- [ ] Viết kiểm thử dữ liệu: ID duy nhất, tham chiếu item tồn tại, có ít nhất một slot thiết yếu, có nguồn ảnh; dữ liệu sai phải trả thông báo rõ. Chạy `node --test tests/outfit-data.test.cjs` và xác nhận fail trước triển khai.
- [ ] Triển khai validator và biên tập bộ mẫu theo 4 hoàn cảnh trong spec; mục tiêu 24 bộ, chỉ phát hành bộ đủ nội dung và ảnh hợp lệ. Đầm liền thân là template có các slot riêng, không bắt thêm quần.
- [ ] Chạy lại kiểm thử tới PASS và rà soát thủ công chất lượng hướng dẫn/ảnh; ghi số bộ thực tế. Review diff và commit.

## Task 4: Ghép đồ với bộ mẫu

**Files:** tạo assets/js/outfit-matcher.js và tests/outfit-matcher.test.cjs.

**Interfaces:** `matchTemplates(templates, selectedItemIds, occasion) -> {ready, alternatives, incomplete}`. Mỗi phần tử chứa `templateId`, `matchedSlotIds`, `substitutions`, `missingSlotIds`; thay thế ghi `slotId` và `itemId`.

- [ ] Viết test bằng fixture xác định: áo trắng + quần đen + sneaker trắng cho template cùng món thuộc ready; chỉ áo trắng thuộc incomplete với hai slot còn thiếu; giày thay thế đã biên tập thuộc alternatives; phụ kiện thiếu không đổi ready; nhiều áo không bắt dùng tất cả; hoàn cảnh sai bị loại. Chạy `node --test tests/outfit-matcher.test.cjs`, xác nhận fail.
- [ ] Triển khai ghép ID chuẩn hóa, ưu tiên khớp chính xác rồi thay thế đã biên tập; xếp ổn định theo ít thay thế và editorialOrder. Khi có lựa chọn đồ, chỉ trả bộ có ít nhất một slot liên quan; khi chưa chọn đồ trả chế độ thư viện chưa đối chiếu riêng ở UI.
- [ ] Chạy test tới PASS; kiểm tra không biến món chưa chọn thành món sở hữu. Review diff và commit.

## Task 5: Chọn đồ và xem gợi ý trong giao diện hiện tại

**Files:** index.html, assets/js/home.js; tạo assets/js/outfit-picker.js; cập nhật các CSS/thành phần đã xác minh tại task 1 theo phong cách hiện có.

**Interfaces:** trạng thái `{occasion, selectedItemIds}`; `updateSelection(state, action) -> state`; UI gọi matcher từ task 4, dùng template từ task 3. Tìm kiếm tên chỉ lọc thẻ hiển thị trong các điều kiện hiện tại.

- [ ] Kiểm tra luồng trước khi bổ sung: trang chủ chưa có chọn đồ và nhóm kết quả theo mức sẵn sàng.
- [ ] Thêm chọn hoàn cảnh, thẻ món có hình và nhãn tiếng Việt, bỏ từng món/xóa lựa chọn, số kết quả; tái sử dụng hình thức component hiện tại.
- [ ] Hiển thị nhóm có thể mặc ngay/có thể thay thế/còn thiếu, trạng thái chưa chọn đồ, không khớp và lỗi tải có thử lại. Chi tiết bộ hiển thị hướng dẫn và món thay thế rõ ràng.
- [ ] Kiểm tra trên trình duyệt: chọn riêng áo trắng vẫn có bộ liên quan; đổi hoàn cảnh không mất đồ; quay lại sửa giữ trạng thái; không kết quả không tự bỏ điều kiện; không lỗi ảnh/tải dữ liệu âm thầm. Review diff và commit.

## Task 6: Ghi nhớ và lưu bộ yêu thích

**Files:** assets/js/global.js, assets/js/pages.js, yeu-thich.html; tạo assets/js/outfit-storage.js và tests/outfit-storage.test.cjs.

**Interfaces:** `readSelection(storage) -> {occasion, selectedItemIds}` và `writeSelection(storage, state) -> {persisted: boolean}`; dùng ID ổn định, xác thực dữ liệu khi đọc. Bảo toàn danh sách yêu thích hiện tại hoặc chuyển đổi có kiểm chứng; không tự xóa dữ liệu cũ.

- [ ] Viết test storage với mock getItem/setItem: dữ liệu hợp lệ đọc lại được; JSON hỏng trả mặc định; storage ném lỗi thì write trả persisted=false, lựa chọn trong phiên không mất. Chạy `node --test tests/outfit-storage.test.cjs`, xác nhận fail.
- [ ] Thêm lưu trạng thái có version, dự phòng bộ nhớ, nút xóa lựa chọn và thông tin chỉ lưu ở trình duyệt này. Giữ đồng bộ trạng thái yêu thích trên các thành phần.
- [ ] Chạy test tới PASS; thử lưu bộ → tải lại → bỏ lưu → tải lại; thử dữ liệu yêu thích cũ và storage bị chặn. Review diff và commit.

## Task 7: Xác minh và phát hành

**Files:** các trang/CSS đã xác minh, README.md; thêm nội dung giới thiệu/liên hệ/lưu dữ liệu vào vị trí hợp với thiết kế hiện tại.

**Interfaces:** bản preview hoạt động và bằng chứng kiểm tra trước khi thay production.

- [ ] Chạy `node --test tests/*.test.cjs` với các file test thực tế; tất cả phải PASS. Nếu môi trường chưa có Node, hoàn tất chuẩn bị runner phù hợp trước khi triển khai logic, không bỏ qua kiểm thử matcher.
- [ ] Kiểm tra end-to-end chọn → tìm → xem → lưu → tải lại → bỏ lưu; kiểm tra bàn phím, focus modal, giảm chuyển động, ảnh lỗi và tải dữ liệu lỗi.
- [ ] So sánh ảnh 360px/1280px trước và sau: chỉ thay đổi chức năng đã duyệt; không đổi nhận diện, font, màu hoặc thiết kế tổng thể.
- [ ] Kiểm tra link, quyền dùng ảnh, tiêu đề/mô tả và ảnh chia sẻ; bỏ mọi số liệu tương tác giả. Cập nhật hướng dẫn chạy và giới hạn lưu cục bộ.
- [ ] Tạo preview theo hosting đã xác minh, kiểm tra asset path trên hosting. Báo kết quả và giới hạn còn lại; thay production khi đã được phép phát hành, giữ commit triển khai trước để có thể khôi phục.

## Tự rà soát kế hoạch

Đã đối chiếu các phần trong spec: nội dung (task 3), ghép mẫu (4), UI và trạng thái (5), lưu cục bộ (6), sửa lỗi/Hot Hits (2), giữ giao diện và điều kiện phát hành (1, 7). Các interface dùng cùng selectedItemIds/templateId. Chưa viết mã sản phẩm, chưa chạy test hoặc deploy; bước 1 còn cần kiểm kê repo thực tế.
