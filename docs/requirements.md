# Tài liệu yêu cầu sản phẩm (Product Requirements Document - PRD)
## Dự án: WordMate - Ứng dụng học từ vựng thông minh

### 1. Tổng quan & Mục tiêu (Overview & Objectives)
* **Tên ứng dụng:** WordMate
* **Mục tiêu:** Tạo ra một nền tảng học từ vựng cá nhân hóa, giúp người dùng học từ mới theo lộ trình bài bản, ôn tập dựa trên các từ chưa thuộc, lưu trữ sổ tay từ vựng riêng và có sự hỗ trợ liên tục từ Trợ lý AI.
* **Đối tượng sử dụng:** Người học tiếng Anh ở mọi cấp độ (Cơ bản, luyện thi TOEIC, học cụm từ/thành ngữ).

---

### 2. Phạm vi dự án (Scope of Work)
* **Trong phạm vi (In-Scope - Phiên bản MVP):**
  * Hệ thống Đăng ký / Đăng nhập cá nhân.
  * Luồng chọn Lộ trình & Chủ đề cho người dùng mới.
  * Giao diện học từ mới kết hợp Flashcard và Bài tập thực hành (Viết lại từ).
  * Trang chủ quản lý điều hướng: Ôn tập (Quiz), Học từ mới, Sổ tay từ vựng.
  * Tính năng lưu giữ chuỗi ngày học (Streak).
  * Tính năng Trợ lý AI (Popup hỏi đáp) xuất hiện xuyên suốt các trang.
* **Ngoài phạm vi (Out-of-Scope):**
  * Tính năng bảng xếp hạng (Leaderboard) cạnh tranh giữa các người dùng.

---

### 3. Quy trình người dùng & Giao diện (User Flows & UI)

#### 3.1. Luồng Người dùng Mới (Onboarding Flow)
1. **Đăng ký / Đăng nhập:** Người dùng tạo tài liệu khoản hoặc đăng nhập vào hệ thống.
2. **Chọn Lộ trình (Chọn lần đầu):** Hệ thống hiển thị danh sách các lộ trình để lựa chọn: *Lưu ý: Luồng này chỉ tự động xuất hiện bắt buộc ở lần đầu tiên đăng nhập. Về sau, người dùng vẫn luôn có thể chủ động thay đổi lộ trình bất kỳ lúc nào tại Trang cá nhân.*
   * Cơ bản
   * TOEIC
   * Phrasal verb & Idiom
   * *[Có thể mở rộng thêm các lộ trình khác sau]*
3. **Chọn Chủ đề (Topic Selection):** Sau khi chọn Lộ trình, người dùng được chuyển hướng đến trang danh sách các Chủ đề thuộc lộ trình đó để chọn bài và bắt đầu học.

#### 3.2. Trang chủ & Các Phân hệ chính (Dashboard Navigation)
Khi chưa bấm vào học, trang chủ cung cấp thanh điều hướng/nút chuyển nhanh sang 4 phân hệ chính:

* **Học từ mới:**
  * Hiển thị danh sách các đề tài/chủ đề của Lộ trình hiện tại.
  * Khi bấm vào một chủ đề cụ thể, hệ thống dẫn người dùng vào Giao diện học bài (Chi tiết ở mục 3.3).
* **Ôn tập (Quizzing):**
  * Hệ thống tự động lọc ra các từ vựng mà người dùng **chưa thuộc** trong quá trình học.
  * Tạo ra các bài trắc nghiệm (Quiz) thông minh giúp người dùng tái ôn tập các từ này.
* **Sổ tay từ vựng (Vocabulary Notebook):**
  * Nơi lưu trữ toàn bộ các từ vựng cá nhân mà người dùng đang học.
  * **Hiển thị số liệu:** Tổng số từ đang ôn tập và danh sách chi tiết các từ đó.
  * **Tính năng đi kèm:** Thanh tìm kiếm (Search bar) để tra cứu nhanh từ vựng trong sổ tay.
* **Tính năng Streak (Chuỗi ngày học):**
  * Hiển thị trên giao diện trang chủ để ghi nhận chuỗi số ngày học liên tiếp của người dùng, thúc đẩy động lực học tập hàng ngày.

#### 3.3. Giao diện & Trải nghiệm Học bài (Learning Interface)
Khi người dùng bắt đầu học một chủ đề, giao diện sẽ hoạt động theo logic tương tác như sau:

1. **Bước 1 - Học kiểu Flashcard:** 
   * Hiển thị thẻ từ vựng (Mặt trước: từ gốc, mặt sau: nghĩa/phát âm).
   * Người dùng có 2 lựa chọn (nút bấm):
     * **Nút "Mình đã thuộc từ này":** Hệ thống ghi nhận người dùng đã master từ này, lập tức bỏ qua và chuyển sang từ tiếp theo.
     * **Nút "Tiếp tục":** Hệ thống hiểu người dùng chưa thuộc hẳn và cần học sâu hơn. Hệ thống sẽ mở ra các bước bài tập tiếp theo cho từ đó.
2. **Bước 2 - Bài tập thực hành nâng cao (Nếu bấm "Tiếp tục"):**
   * Hệ thống hiển thị các câu hỏi/thử thách tương tác (Ví dụ: Bài tập viết lại từ dựa trên gợi ý nghĩa/phát âm).
   * Sau khi hoàn thành, từ này sẽ **tự động được lưu vào Sổ tay từ vựng cá nhân** để đưa vào hàng đợi ôn tập sau này.

#### 3.4. Tính năng Trợ lý AI (Universal AI Assistant)
* **Hình thức:** Xuất hiện dưới dạng một nút bấm/Icon popup (Bong bóng chat) cố định ở một góc màn hình.
* **Phạm vi hiển thị:** Hiện diện trên **tất cả các trang** của ứng dụng (Trang chủ, Sổ tay, Giao diện học, v.v.).
* **Chức năng:** Khi người dùng bấm vào, popup chat sẽ mở ra, cho phép người dùng nhập câu hỏi và nhận câu trả lời từ AI để giải đáp thắc mắc về ngữ pháp, ngữ cảnh sử dụng từ vựng, hoặc đặt câu ví dụ ngay lập tức.

#### 3.5. Hệ thống Menu Trang cá nhân (Profile Menu)
* **Vị trí & Kích hoạt:** Một biểu tượng (Icon) hoặc ảnh đại diện trang cá nhân luôn hiển thị cố định ở **góc trên bên trái** màn hình trên các trang chính.
* **Hành vi:** Khi người dùng bấm vào biểu tượng này, một menu/trang cá nhân sẽ hiện ra bao gồm các tùy chọn:
  * **Cài đặt tài khoản (Account Settings):** Nơi người dùng quản lý thông tin cá nhân, mật khẩu hoặc đăng xuất.
  * **Lộ trình học tập (Learning Roadmap):** Cho phép người dùng xem lại lộ trình hiện tại và có thể bấm chọn đổi sang lộ trình khác (Cơ bản, TOEIC, Phrasal verb & idiom...) bất cứ lúc nào. Khi đổi lộ trình thành công, danh sách chủ đề ở trang chủ sẽ tự động cập nhật theo lộ trình mới.

---

### 4. Yêu cầu phi chức năng (Non-Functional Requirements)
* **Trải nghiệm người dùng:** Giao diện tối giản, nút bấm rõ ràng, việc chuyển đổi giữa mặt trước/mặt sau flashcard và mở bài tập viết phải mượt mà không bị trễ.
* **Tính năng Trợ lý AI:** Popup AI mở ra nhanh chóng, có bộ nhớ ngữ cảnh ngắn hạn để hiểu + JavaScript + Bootstrap + Tailwind CSS, Backend dùng Node.js, Cơ sở dữ liệu dùng SQLite để lưu trữ local.