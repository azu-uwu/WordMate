# Tài liệu Yêu cầu Sản phẩm (Product Requirements Document - PRD)
## Dự án: WordMate - Ứng dụng học từ vựng thông minh
<!-- Version 1.0 -->
<!-- Status: Approved -->

---

### 1. Tổng quan & Mục tiêu (Overview & Objectives)
* **Tên ứng dụng:** WordMate
* **Mục tiêu:** Tạo ra một nền tảng học từ vựng cá nhân hóa, giúp người dùng học từ mới theo lộ trình bài bản, ôn tập theo phương pháp lặp lại ngắt quãng (Spaced Repetition), lưu trữ sổ tay từ vựng riêng, có sự hỗ trợ liên tục từ Trợ lý AI và hệ thống Quản trị viên (Admin) tinh gọn.
* **Đối tượng sử dụng:**
  * **Học viên (`role = 'user'`):** Người học tiếng Anh ở mọi cấp độ (Cơ bản, luyện thi TOEIC, Phrasal Verb & Idiom).
  * **Quản trị viên (`role = 'admin'`):** Quản lý kho dữ liệu Lộ trình, Chủ đề và Từ vựng toàn hệ thống.

---

### 2. Phạm vi dự án (Scope of Work)

#### 2.1. Trong phạm vi (In-Scope - Phiên bản MVP+):
* **Phân hệ Người dùng (Client Side):**
  * Đăng ký, Đăng nhập, Quản lý tài khoản và phân quyền `role`.
  * Luồng chọn Lộ trình (`Roadmap`) & Chủ đề (`Topic`) học tập.
  * Giao diện học từ vựng kết hợp Flashcard và Bài tập gõ/viết từ vựng nâng cao.
  * Trang chủ quản lý điều hướng: Ôn tập (Quiz), Học từ mới, Sổ tay từ vựng cá nhân.
  * Hệ thống ghi nhận chuỗi ngày học liên tiếp (`streak`) và ngày học cuối (`last_study_date`).
  * Trợ lý AI (Popup & Chatroom): Lưu trữ lịch sử trò chuyện theo từng phiên (`ai_conversations` & `ai_messages`).
* **Phân hệ Quản trị (Admin Dashboard):**
  * Quản lý CRUD (Thêm, Xem, Sửa, Xóa) Lộ trình (`Roadmaps`), Chủ đề (`Topics`), Từ vựng (`Vocabularies`).
  * Không bao gồm giao diện làm bài tập/học tập của học viên.
* **Hệ thống Ôn tập & Đánh giá (Quiz System):**
  * Tự động lọc từ vựng thuộc danh sách chưa thuộc (`new`, `learning`) hoặc tới hạn ôn tập (`next_review_at <= NOW()`).
  * Lưu trữ chi tiết lượt làm Quiz (`quiz_attempts`) và chi tiết từng câu trả lời (`quiz_answers`).

#### 2.2. Ngoài phạm vi (Out-of-Scope):
* Bảng xếp hạng (Leaderboard) cạnh tranh giữa các người dùng.
* Thanh toán / Gói học trả phí (Subscription).

---

### 3. Quy trình người dùng & Giao diện (User Flows & UI)

#### 3.1. Luồng Người dùng Mới (Onboarding Flow)
1. **Đăng ký / Đăng nhập:** Hệ thống khởi tạo tài khoản mới với mặc định `role = 'user'`, khởi tạo `streak = 0`.
2. **Chọn Lộ trình (Roadmap Selection):** Bắt buộc chọn lần đầu. Lưu ID lộ trình đã chọn vào cột `roadmap_id` của bảng `users`. (*Người dùng có thể đổi lại trong trang Profile*).
3. **Chọn Chủ đề (Topic Selection):** Hiển thị danh sách các Topic thuộc Roadmap tương ứng dựa trên `roadmap_id`.

#### 3.2. Trang chủ Người học (Student Dashboard)
* **Thông tin tiến độ:** Hiển thị số ngày `streak`, Lộ trình đang theo học, ảnh đại diện `avatar`.
* **Học từ mới:** Hiển thị danh sách các Topics khả dụng.
* **Ôn tập (Quiz System):** Nút mở bài Quiz trắc nghiệm. Hệ thống truy vấn từ bảng `user_vocabularies` lấy ra các từ có `status IN ('new', 'learning')` hoặc có `next_review_at <= NOW()` để tạo đề thi. Sau khi nộp bài, hệ thống ghi dữ liệu vào `quiz_attempts` và `quiz_answers`.
* **Sổ tay từ vựng (Vocabulary Notebook):** Hiển thị danh sách từ vựng cá nhân được phân loại rõ ràng theo `status` (`new` -> `learning` -> `mastered`). Tích hợp thanh tìm kiếm nhanh theo từ gốc (`word`).

#### 3.3. Giao diện Học bài (Learning Interface)
1. **Bước 1 - Học Flashcard:** Hiển thị mặt trước (`word`, `pronunciation`, `audio`, `image`), mặt sau (`part_of_speech`, `meaning`, `example`, `example_meaning`).
   * **Bấm "Đã thuộc":** Tạo/Cập nhật bản ghi trong `user_vocabularies` với `status = 'mastered'`, tăng `review_count`. Bỏ qua không đưa vào danh sách ôn tập.
   * **Bấm "Tiếp tục":** Chuyển sang Bước 2.
2. **Bước 2 - Bài tập thực hành (Luyện viết):** 
   * Người dùng nhập từ dựa vào gợi ý nghĩa/ví dụ. 
   * Khi hoàn tất, hệ thống lưu/cập nhật vào `user_vocabularies` với `status = 'learning'`, tính toán thời gian `next_review_at` để đưa vào hàng đợi ôn tập. Cập nhật `last_study_date` và tăng `streak` trong bảng `users`.

#### 3.4. Trợ lý AI (Universal AI Assistant)
* Popup bong bóng cố định góc dưới màn hình trên mọi trang giao diện người học.
* Cho phép chọn hoặc tạo hội thoại mới (Lưu vào `ai_conversations`).
* Mỗi tin nhắn gửi/nhận được lưu vết chi tiết vào `ai_messages` với `role = 'user'` hoặc `role = 'assistant'` để duy trì ngữ cảnh ngắn hạn/dài hạn.

#### 3.5. Trang Quản trị (Admin Dashboard Flow)
* **Phân quyền Route:** Khóa middleware backend kiểm tra `req.user.role === 'admin'`. Nếu không phải, từ chối truy cập (403 Forbidden).
* **Giao diện:** Tách biệt độc lập với giao diện học viên.
* **Chức năng:**
  * **Quản lý Roadmaps & Topics:** Tạo mới lộ trình, tạo chủ đề thuộc lộ trình, bật/tắt hiển thị (`is_active`), sắp xếp thứ tự (`sort_order`).
  * **Quản lý Từ vựng (Vocabularies CRUD):** Form nhập liệu đầy đủ các trường: `word`, `pronunciation`, `part_of_speech`, `meaning`, `example`, `example_meaning`, `audio`, `image`. Tự động gắn thuộc tính `topic_id`.

---

### 4. Yêu cầu Kỹ thuật (Tech Stack Requirements)

#### 4.1. Frontend (Giao diện)
* **Công nghệ cốt lõi:** HTML5, CSS3, JavaScript (ES6+ Native).
* **CSS Frameworks:**
  * **Tailwind CSS:** Dùng cho toàn bộ Client Interface (Học viên). Tận dụng CSS 3D Transform để làm hiệu ứng lật Flashcard mượt mà.
  * **Bootstrap (v5):** Dùng cho Admin Dashboard (DataTables, Modal, Form UI) để dựng giao diện quản trị nhanh chóng.

#### 4.2. Backend (Máy chủ)
* **Nền tảng:** Node.js + Express.js.
* **Xác thực:** JWT (JSON Web Token) lưu tại Cookie/LocalStorage để xác thực người dùng và phân quyền `role`.
* **Kết nối DB:** `mysql2/promise` (Viết câu lệnh SQL thuần dùng Prepared Statements chống SQL Injection).
* **Tích hợp AI:** Node.js gọi trực tiếp API (OpenAI / Gemini) và quản lý lưu vết hội thoại qua 2 bảng `ai_conversations` và `ai_messages`.
* **Quản lý Upload File:** Thư viện `multer` xử lý lưu trữ file ảnh (`.jpg`, `.png`) và âm thanh (`.mp3`) vào thư mục static `/uploads/`, đường dẫn chuỗi được lưu vào database.

---

### 5. Quy chuẩn Giao diện & Trải nghiệm (UI/UX Rules)

#### 5.1. Design Tokens (Hệ màu & Typography)
* **Font chữ chủ đạo:** Inter / Roboto / system-ui (Đảm bảo hiển thị chuẩn ký tự phiên âm IPA không lỗi font).
* **Hệ màu Tailwind (Client - Học viên):**
  * **Primary:** `Indigo-600` (`#4F46E5`) - Màu chủ đạo ứng dụng.
  * **Success:** `Emerald-500` (`#10B981`) - Trạng thái `mastered` / Trả lời đúng.
  * **Warning:** `Amber-500` (`#F59E0B`) - Trạng thái `learning` / Nút "Tiếp tục".
  * **Danger:** `Rose-500` (`#F43F5E`) - Trả lời sai / Nút xóa.
* **Hệ màu Admin (Bootstrap):** Tông màu tối trung tính (Slate/Dark Sidebar) phân biệt rõ ràng với giao diện học viên.

#### 5.2. Quy chuẩn Tương tác
* **Loading State:** Mọi thao tác chờ API (Login, Quiz generation, AI response) **bắt buộc** phải có hiệu ứng Skeleton Loading hoặc Spinner, không để màn hình đứng yên.
* **Thao tác phím tắt Flashcard:** Hỗ trợ phím `Space` (Lật mặt thẻ), `ArrowRight` (Đã thuộc), `ArrowLeft` (Chưa thuộc).
* **Toast Notification:** Thông báo phản hồi thao tác tự động ẩn sau 3s ở góc trên bên phải, không dùng `alert()` của trình duyệt.

---

### 5. Quy chuẩn API & Kết nối (API Conventions)

Hệ thống sử dụng **RESTful API** để giao tiếp giữa Frontend và Backend. Toàn bộ API được xây dựng bằng **Node.js + Express.js** và trả về dữ liệu dưới định dạng **JSON**.

### 5.1. API Base URL

Tất cả các API đều sử dụng tiền tố:

```text
/api
```

Ví dụ:

```text
/api/auth/register
/api/auth/login
/api/profile
/api/roadmaps
/api/topics
/api/vocabularies
/api/user-vocabularies
/api/quiz
/api/notebook
/api/ai
/api/admin
```

---

### 5.2. Quy tắc đặt Endpoint

- Sử dụng chữ thường (`lowercase`).
- Sử dụng danh từ số nhiều (`plural nouns`) cho tài nguyên.
- Các từ được phân tách bằng dấu gạch ngang (`-`).
- URL phải ngắn gọn, dễ hiểu và tuân theo chuẩn RESTful.
- Không sử dụng tên hàm hoặc động từ trong Endpoint.

Ví dụ:

| Đúng | Không nên |
|------|-----------|
| `/api/topics` | `/api/getTopics` |
| `/api/vocabularies` | `/api/listVocabulary` |
| `/api/user-vocabularies` | `/api/userVocabulary` |

---

### 5.3. HTTP Methods

| Method | Chức năng |
|---------|-----------|
| **GET** | Lấy dữ liệu |
| **POST** | Tạo mới dữ liệu |
| **PUT** | Cập nhật toàn bộ dữ liệu |
| **PATCH** | Cập nhật một phần dữ liệu (nếu cần) |
| **DELETE** | Xóa dữ liệu |

Ví dụ:

```http
GET    /api/topics
GET    /api/topics/1

POST   /api/topics

PUT    /api/topics/1

DELETE /api/topics/1
```

---

### 5.4. Định dạng Response

Tất cả API trả về dữ liệu theo định dạng JSON thống nhất.

#### Thành công

```json
{
    "success": true,
    "message": "Request successful.",
    "data": {}
}
```

#### Danh sách dữ liệu

```json
{
    "success": true,
    "data": []
}
```

#### Lỗi

```json
{
    "success": false,
    "message": "Validation failed."
}
```

---

### 5.5. HTTP Status Codes

| Status Code | Ý nghĩa |
|-------------|----------|
| **200** | Thành công |
| **201** | Tạo dữ liệu thành công |
| **400** | Dữ liệu không hợp lệ |
| **401** | Chưa đăng nhập |
| **403** | Không có quyền truy cập |
| **404** | Không tìm thấy dữ liệu |
| **409** | Dữ liệu bị trùng |
| **500** | Lỗi máy chủ |

---

### 5.6. Authentication & Authorization

- Hệ thống sử dụng **JWT (JSON Web Token)** để xác thực người dùng.
- Token được gửi trong Header của mỗi Request.

Ví dụ:

```http
Authorization: Bearer <JWT_TOKEN>
```

- Backend sử dụng Middleware để xác thực người dùng.
- Các API quản trị chỉ cho phép tài khoản có `role = 'admin'` truy cập.
- Người dùng chưa đăng nhập sẽ nhận mã lỗi **401 Unauthorized**.
- Người dùng không đủ quyền sẽ nhận mã lỗi **403 Forbidden**.

---

### 5.7. Validation Rules

Backend phải kiểm tra dữ liệu đầu vào trước khi xử lý.

Ví dụ:

- Username không được để trống.
- Email đúng định dạng.
- Password tối thiểu 8 ký tự.
- Các khóa ngoại (`roadmap_id`, `topic_id`, `vocabulary_id`) phải tồn tại trong cơ sở dữ liệu.
- Không cho phép tạo dữ liệu trùng với các trường có ràng buộc `UNIQUE`.

Nếu dữ liệu không hợp lệ, API trả về:

```http
400 Bad Request
```

---

### 5.8. Database Access

Backend sử dụng thư viện **mysql2/promise** để kết nối MySQL.

Các nguyên tắc truy vấn:

- Sử dụng **Prepared Statement** để chống SQL Injection.
- Sử dụng **Async/Await** cho toàn bộ truy vấn.
- Các thao tác cập nhật nhiều bảng phải sử dụng **Transaction**.
- Không viết trực tiếp câu lệnh SQL trong Router.
- Mọi truy vấn được xử lý thông qua tầng **Model** hoặc **Service** theo kiến trúc MVC.

---

### 5.9. API Modules

Các API được tổ chức theo từng phân hệ của hệ thống.

| Module | Endpoint |
|---------|----------|
| Authentication | `/api/auth/*` |
| Profile | `/api/profile/*` |
| Roadmaps | `/api/roadmaps/*` |
| Topics | `/api/topics/*` |
| Vocabularies | `/api/vocabularies/*` |
| Learning | `/api/user-vocabularies/*` |
| Quiz | `/api/quiz/*` |
| Notebook | `/api/notebook/*` |
| AI Assistant | `/api/ai/*` |
| Admin Dashboard | `/api/admin/*` |

---

### 5.10. Nguyên tắc thiết kế API

- Tuân thủ kiến trúc **RESTful API**.
- Mỗi Endpoint chỉ thực hiện một chức năng duy nhất.
- API không trả về dữ liệu nhạy cảm như mật khẩu hoặc JWT Secret.
- Thông báo lỗi phải rõ ràng và nhất quán để Frontend dễ xử lý.
- Mọi phản hồi đều sử dụng định dạng JSON thống nhất.
- API được thiết kế để dễ mở rộng và bảo trì trong các phiên bản tiếp theo.

## 7. Database Requirements

- Database: MySQL 8.0+
- Storage Engine: InnoDB
- Character Set: utf8mb4
- Collation: utf8mb4_unicode_ci
- Chuẩn hóa dữ liệu theo 3NF.
- Sử dụng Foreign Key cho toàn bộ quan hệ.
- ON DELETE CASCADE.
- ON UPDATE CASCADE.
- Mỗi bảng đều có created_at.
- Các bảng cần cập nhật dữ liệu có updated_at.
- Tối ưu truy vấn bằng INDEX và UNIQUE INDEX.

## 8. Coding Convention

- Backend theo mô hình MVC.
- JavaScript ES6+.
- camelCase cho biến và hàm.
- PascalCase cho Class.
- snake_case cho tên bảng và cột trong Database.
- Mỗi module gồm Route, Controller, Model và Middleware riêng.