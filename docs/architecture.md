# Architecture Document - WordMate

**Version**: 1.0
**Created**: 2026-07-22
**Status**: Approved
**Based on**: docs/spec.md v1.0

---

## 1. Introduction

### 1.1. Mục tiêu kiến trúc

Tài liệu này mô tả kiến trúc tổng thể của hệ thống WordMate — nền tảng học từ vựng tiếng Anh cá nhân hóa tích hợp AI Assistant.

Mục tiêu:

- Cung cấp bản thiết kế kiến trúc thống nhất cho toàn bộ hệ thống.
- Đảm bảo các thành phần Frontend, Backend, Database và AI hoạt động nhất quán.
- Làm nền tảng để đội phát triển triển khai code mà không cần thiết kế lại.
- Đảm bảo kiến trúc phản ánh đúng spec, không thêm chức năng ngoài phạm vi MVP.

### 1.2. Phạm vi

Tài liệu bao gồm:

- Kiến trúc tổng thể (High-Level Architecture).
- Cấu trúc thư mục dự án.
- Kiến trúc Backend (Controllers, Routes, Middleware, Models, Services, Utils, Config).
- Kiến trúc Frontend (Pages, Components, CSS, JavaScript, Services, Assets).
- Kiến trúc từng Module (Authentication, User, Roadmap, Topic, Vocabulary, Study Session, Notebook, Quiz, Streak, AI Assistant, Admin).
- Kiến trúc Database (vai trò, nhóm bảng, quan hệ).
- Luồng dữ liệu cho các chức năng chính.
- Luồng xác thực (JWT).
- Kiến trúc AI (Gemini API).
- Kiến trúc bảo mật.
- Chiến lược xử lý lỗi.
- Chiến lược logging.
- Kiến trúc upload file.
- Tổ chức API.
- Quan hệ phụ thuộc giữa các module.
- Tổng quan triển khai.
- Hướng mở rộng sau MVP.

### 1.3. Định hướng thiết kế

- **Client-Server**: Frontend (client) giao tiếp với Backend (server) qua REST API.
- **Monolithic Backend**: Backend là một ứng dụng Node.js/Express duy nhất, không microservices.
- **Server-side Rendering không áp dụng**: Frontend là HTML/CSS/JS thuần, gọi API để lấy dữ liệu và render phía client.
- **Stateless API**: Backend không lưu trạng thái session, sử dụng JWT để xác thực.
- **AI qua Backend**: Mọi request đến Gemini API đều đi qua Backend, Frontend không gọi trực tiếp.
- **Giả định**: Dữ liệu Roadmap, Topic và Vocabulary được seed sẵn trong database khi khởi tạo ứng dụng (theo spec Assumption #2).

---

## 2. High Level Architecture

### 2.1. Sơ đồ tổng thể

```
+------------------------------------------------------------------+
|                        USER (Browser)                            |
|  +------------------------------------------------------------+  |
|  |                    FRONTEND (HTML/CSS/JS)                   |  |
|  |  +------------------+  +----------------+  +-------------+  |  |
|  |  | Pages            |  | Components     |  | Services    |  |  |
|  |  | - Login/Register |  | - Modal        |  | - api.js    |  |  |
|  |  | - Home           |  | - Loading      |  | - auth.js   |  |  |
|  |  | - Flashcard      |  | - Toast        |  | - storage.js|  |  |
|  |  | - Quiz           |  | - Navbar       |  |             |  |  |
|  |  | - Notebook       |  | - Chatbot      |  |             |  |  |
|  |  | - Profile        |  | - Flashcard    |  |             |  |  |
|  |  | - Admin          |  | - QuizCard     |  |             |  |  |
|  |  +------------------+  +----------------+  +-------------+  |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
                              |  HTTPS / JSON
                              v
+------------------------------------------------------------------+
|                     BACKEND (Node.js + Express)                   |
|  +------------------------------------------------------------+  |
|  |  Routes  -->  Middleware  -->  Controllers  -->  Models    |  |
|  |                    |                            |          |  |
|  |                    v                            v          |  |
|  |              authMiddleware              MySQL (mysql2)    |  |
|  |              adminMiddleware              Prepared Stmts   |  |
|  |                                                    |       |  |
|  |  +------------------+  +------------------+        |       |  |
|  |  | Services         |  | Utils            |        |       |  |
|  |  | - aiService.js   |  | - response.js    |        |       |  |
|  |  |                  |  | - logger.js      |        |       |  |
|  |  +------------------+  +------------------+        |       |  |
|  +----------------------------------------------------+-------+  |
+------------------------------------------------------------------+
                              |                          |
                              v                          v
                    +------------------+      +------------------+
                    |   MySQL Database |      |   Gemini API     |
                    |   (wordmate)     |      |   (Google AI)    |
                    +------------------+      +------------------+
```

### 2.2. Mô tả luồng tổng quát

1. **User** tương tác với **Frontend** (HTML/CSS/JS thuần) qua trình duyệt.
2. **Frontend** gửi HTTP request (JSON) đến **Backend** qua REST API.
3. **Backend** (Node.js + Express) xử lý request qua các tầng:
   - **Routes**: Định tuyến request đến Controller phù hợp.
   - **Middleware**: Kiểm tra xác thực, phân quyền, validate.
   - **Controllers**: Xử lý logic nghiệp vụ, gọi Model/Service.
   - **Models**: Tương tác với MySQL qua Prepared Statements.
   - **Services**: Xử lý logic đặc thù (ví dụ: gọi Gemini API).
4. **Backend** trả về JSON response cho **Frontend**.
5. **Frontend** render kết quả cho người dùng.

### 2.3. Công nghệ sử dụng

| Thành phần | Công nghệ | Ghi chú |
|------------|-----------|---------|
| Frontend | HTML5, CSS3, JavaScript ES6 | Không SPA framework |
| Frontend UI | Bootstrap, TailwindCSS | Bootstrap cho Admin, TailwindCSS cho User |
| Backend | Node.js, ExpressJS | REST API |
| Database | MySQL | InnoDB, utf8mb4 |
| Authentication | JWT, bcrypt | Access Token 24h |
| AI | Gemini API (Google) | Gọi qua Backend |
| Environment | dotenv | Cấu hình biến môi trường |
| Database Driver | mysql2 | Prepared Statements |

---

## 3. Project Structure

### 3.1. Cấu trúc thư mục gốc

```
WordMate/
│
├── backend/           # Node.js + Express API server
├── frontend/          # HTML/CSS/JS client
├── database/          # Database scripts
│   └── schema.sql     # Database schema (source of truth)
│
└── docs/              # Tài liệu dự án
    ├── spec.md        # Software specification
    └── architecture.md # Architecture document (this file)
```

### 3.2. Backend

```
backend/
│
├── config/
│   └── db.js              # Kết nối MySQL (pool connection)
│
├── src/
│   ├── controllers/       # Xử lý logic nghiệp vụ
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── roadmapController.js
│   │   ├── topicController.js
│   │   ├── vocabularyController.js
│   │   ├── notebookController.js
│   │   ├── quizController.js
│   │   ├── streakController.js
│   │   ├── adminController.js
│   │   └── aiController.js
│   │
│   ├── routes/            # Định tuyến HTTP
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── roadmapRoutes.js
│   │   ├── topicRoutes.js
│   │   ├── vocabularyRoutes.js
│   │   ├── notebookRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── streakRoutes.js
│   │   ├── adminRoutes.js
│   │   └── aiRoutes.js
│   │
│   ├── middleware/         # Xử lý trung gian
│   │   ├── authMiddleware.js   # Xác thực JWT
│   │   └── adminMiddleware.js  # Kiểm tra quyền admin
│   │
│   ├── models/            # Tương tác database
│   │   ├── userModel.js
│   │   ├── vocabularyModel.js
│   │   ├── topicModel.js
│   │   └── notebookModel.js
│   │
│   ├── services/          # Logic nghiệp vụ đặc thù
│   │   └── aiService.js   # Gọi Gemini API
│   │
│   ├── utils/             # Tiện ích
│   │   └── response.js    # Format response chuẩn
│   │
│   └── server.js          # Entry point, khởi tạo Express
│
├── .env                   # Biến môi trường
└── package.json           # Dependencies
```

**Vai trò từng thư mục Backend:**

| Thư mục | Vai trò |
|----------|---------|
| `config/` | Cấu hình kết nối database, pool connection |
| `src/controllers/` | Xử lý request, gọi model/service, trả về response |
| `src/routes/` | Định nghĩa endpoint, gắn middleware, gọi controller |
| `src/middleware/` | Xác thực JWT, kiểm tra quyền, validate |
| `src/models/` | Query database qua Prepared Statements |
| `src/services/` | Logic nghiệp vụ phức tạp (AI, SRS calculation) |
| `src/utils/` | Hàm tiện ích dùng chung (response format, logger) |
| `src/server.js` | Khởi tạo Express, mount routes, start server |

### 3.3. Frontend

```
frontend/
│
├── public/
│
├── src/
│
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── learn/
│   │   ├── quiz/
│   │   ├── notebook/
│   │   ├── profile/
│   │   └── admin/
│   │
│   ├── css/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── main.css
│   │   └── admin.css
│   │
│   ├── js/
│   │   ├── pages/
│   │   ├── components/
│   │   └── utils/
│   │       └── validator.js
│   │
│   ├── components/
│   │   ├── navbar.html
│   │   ├── modal.html
│   │   ├── loading.html
│   │   ├── toast.html
│   │   ├── vocabulary-card.html
│   │   └── chatbot.html
│   │
│   └── services/
│       ├── api.js
│       ├── authService.js
│       ├── learnService.js
│       ├── quizService.js
│       ├── notebookService.js
│       └── profileService.js

```

**Vai trò từng thư mục Frontend:**

| Thư mục | Vai trò |
|----------|---------|
| `public/` | File tĩnh: hình ảnh, audio upload, favicon |
| `src/pages/` | File HTML cho từng trang, mỗi trang một thư mục riêng |
| `src/css/` | Stylesheet: TailwindCSS cho user, Bootstrap cho admin |
| `src/js/` | JavaScript: logic trang, component, validation |
| `src/components/` | HTML snippet tái sử dụng (modal, loading, toast, card) |
| `src/services/` | Module gọi API, quản lý token, localStorage |
| `index.html` | File chính, load các page component động |

### 3.4. Database

```
database/
└── schema.sql    # Định nghĩa database schema (DDL)
```

**Vai trò:** File schema.sql là nguồn sự thật duy nhất cho cấu trúc database. Chứa toàn bộ CREATE TABLE, INDEX, FOREIGN KEY, CONSTRAINTS.

### 3.5. Docs

```
docs/
├── spec.md          # Software specification (yêu cầu chức năng, business rules)
└── architecture.md  # Architecture document (this file)
```

**Vai trò:** Lưu trữ tài liệu thiết kế và đặc tả kỹ thuật của dự án.

---

## 4. Backend Architecture

### 4.1. Tổng quan

Backend sử dụng kiến trúc phân tầng (Layered Architecture):

```
Client
  │
  ▼
Routes          → Định tuyến endpoint
  │
  ▼
Middleware      → Xác thực, phân quyền, validate
  │
  ▼
Controllers     → Xử lý request, điều phối logic
  │
  ├──► Services  → Logic nghiệp vụ đặc thù (AI, SRS)
  │
  └──► Models    → Tương tác database (Prepared Statements)
        │
        ▼
      MySQL
```

### 4.2. Routes

**Trách nhiệm:**

- Định nghĩa các endpoint HTTP (method + path).
- Gắn middleware phù hợp (auth, admin, validation).
- Gọi controller tương ứng để xử lý request.

**Nguyên tắc:**

- Mỗi module có một file routes riêng.
- Route admin bắt đầu bằng `/api/admin/`.
- Route user bắt đầu bằng `/api/`.
- Route auth (không cần xác thực) như `/api/auth/register`, `/api/auth/login`.

**Ví dụ cấu trúc:**

```
/api/auth/register       → authRoutes.js → authController.register
/api/auth/login          → authRoutes.js → authController.login
/api/roadmaps            → roadmapRoutes.js → roadmapController.getAll
/api/admin/roadmaps      → adminRoutes.js → adminController.roadmaps
```

### 4.3. Middleware

**Trách nhiệm:**

- **authMiddleware.js**: Kiểm tra JWT token trong header `Authorization: Bearer <token>`. Giải mã token, gắn thông tin user vào `req.user`. Nếu token hết hạn hoặc không hợp lệ, trả về 401.
- **adminMiddleware.js**: Kiểm tra `req.user.role === 'admin'`. Nếu không phải admin, trả về 403.

**Luồng xử lý middleware:**

```
Request → authMiddleware (verify JWT) → adminMiddleware (check role) → Controller
```

### 4.4. Controllers

**Trách nhiệm:**

- Nhận request từ routes (sau khi qua middleware).
- Parse và validate dữ liệu đầu vào.
- Gọi models để truy vấn database.
- Gọi services nếu cần xử lý logic đặc thù (AI, SRS).
- Format response theo chuẩn thống nhất.
- Xử lý lỗi và trả về HTTP status code phù hợp.

**Nguyên tắc:**

- Controller không chứa query SQL trực tiếp.
- Controller không chứa logic quá phức tạp — nếu cần, chuyển sang Service.
- Mỗi controller function xử lý một action cụ thể.

### 4.5. Models

**Trách nhiệm:**

- Thực hiện các câu query database.
- Sử dụng Prepared Statements để chống SQL Injection.
- Trả về dữ liệu đã được xử lý (object/array) cho Controller.

**Nguyên tắc:**

- Model chỉ chứa logic liên quan đến database.
- Sử dụng connection pool từ `config/db.js`.
- Transaction được sử dụng cho các thao tác nhiều bảng.

### 4.6. Services

**Trách nhiệm:**

- Chứa logic nghiệp vụ phức tạp, không thuộc phạm vi Controller hay Model.
- **aiService.js**: Gọi Gemini API, quản lý context, xử lý prompt.

**Nguyên tắc:**

- Service có thể gọi Model để lấy dữ liệu.
- Service không gọi trực tiếp database.
- Service trả về kết quả đã xử lý cho Controller.

### 4.7. Utils

**Trách nhiệm:**

- Các hàm tiện ích dùng chung.
- **response.js**: Hàm format response chuẩn (success/error response).

### 4.8. Config

**Trách nhiệm:**

- **db.js**: Khởi tạo kết nối MySQL pool, đọc cấu hình từ `.env`.
- Export pool để các model sử dụng.

---

## 5. Frontend Architecture

### 5.1. Tổng quan

Frontend là ứng dụng HTML/CSS/JS thuần (không SPA framework), tổ chức theo mô hình:

```
index.html
  │
  ├──► Pages (HTML)       → Cấu trúc giao diện từng trang
  ├──► Components (HTML)  → Snippet tái sử dụng
  ├──► CSS                → Stylesheet (TailwindCSS + Bootstrap)
  ├──► JS                 → Logic xử lý
  └──► Services           → Gọi API Backend
```

### 5.2. Pages

**Trách nhiệm:**

- Mỗi trang là một file HTML riêng trong thư mục `src/pages/`.
- Trang chứa cấu trúc HTML hoàn chỉnh cho giao diện đó.
- Các trang được load động vào `index.html` thông qua JavaScript.

**Danh sách trang:**

| Trang | Thư mục | Mô tả |
|-------|---------|-------|
| Đăng nhập | `pages/auth/login.html` | Form đăng nhập |
| Đăng ký | `pages/auth/register.html` | Form đăng ký |
| Trang chủ | `pages/home/` | Dashboard, danh sách chủ đề, streak |
| Học Flashcard | `pages/flashcard/` | Flashcard + luyện viết |
| Quiz | `pages/quiz/` | Quiz ôn tập |
| Sổ tay | `pages/notebook/` | Danh sách từ vựng cá nhân |
| Profile | `pages/profile/` | Cài đặt, đổi mật khẩu, đổi lộ trình |
| Admin | `pages/admin/` | Admin Dashboard (CRUD) |

### 5.3. Components

**Trách nhiệm:**

- Các HTML snippet tái sử dụng được (modal, loading spinner, toast notification, navbar, flashcard, chatbot message).
- Được load vào trang khi cần thông qua JavaScript.

**Danh sách component:**

| Component | File | Mô tả |
|-----------|------|-------|
| Modal | `components/modal.html` | Popup modal chung |
| Loading | `components/loading.html` | Skeleton loading / Spinner |
| Toast | `components/toast.html` | Toast notification (tự động ẩn 3s) |
| Navbar | `components/navbar.html` | Thanh điều hướng |
| Vocabulary Card | `components/vocabulary-card.html` | Card hiển thị từ vựng |
| Chatbot Message | `components/chatbot-message.html` | Tin nhắn AI chat |

### 5.4. CSS

**Trách nhiệm:**

- **main.css**: Style chính sử dụng TailwindCSS cho giao diện người học. Màu chủ đạo Indigo-600 (#4F46E5).
- **admin.css**: Style cho Admin Dashboard sử dụng Bootstrap, tông màu tối trung tính (Slate/Dark).
- **components/**: CSS riêng cho từng component nếu cần.

**Nguyên tắc:**

- User interface: TailwindCSS, màu Indigo-600.
- Admin interface: Bootstrap, tông màu tối.
- Font: Inter / Roboto / system-ui, hỗ trợ IPA.
- Màu trạng thái: Success = Emerald-500, Warning = Amber-500, Danger = Rose-500.

### 5.5. JavaScript

**Trách nhiệm:**

- **pages/**: Logic xử lý cho từng trang (event listener, DOM manipulation, gọi service).
- **components/**: Logic cho component tái sử dụng (modal toggle, toast show/hide).
- **validator.js**: Validation phía client (email format, password length, confirm password).

**Nguyên tắc:**

- Mỗi trang có file JS riêng trong `js/pages/`.
- Dùng `fetch()` để gọi API Backend.
- Xử lý JWT token: lưu trong localStorage, gửi qua header `Authorization`.
- Hiển thị Toast Notification thay vì `alert()`.

### 5.6. Services

**Trách nhiệm:**

- **api.js**: HTTP client wrapper sử dụng `fetch()`. Tự động gắn JWT token vào header. Xử lý response và lỗi HTTP.
- **auth.js**: Xử lý đăng nhập, đăng xuất, lưu/lấy token từ localStorage.
- **storage.js**: Helper cho localStorage (set, get, remove).

### 5.7. Assets

**Trách nhiệm:**

- Thư mục `public/` chứa file tĩnh: images, audio uploads, favicon.
- File upload từ Admin được lưu vào `public/uploads/`.

---

## 6. Module Architecture

### 6.1. Authentication Module

| Thành phần | Mô tả |
|------------|-------|
| **Mục đích** | Đăng ký, đăng nhập, đăng xuất, đổi mật khẩu |
| **Dữ liệu** | `users` (email, password, role) |
| **Controller** | `authController.js` |
| **Route** | `authRoutes.js` |
| **Model** | `userModel.js` |
| **Middleware** | `authMiddleware.js` (cho đổi mật khẩu) |

**Chức năng:**
- Đăng ký: validate input → kiểm tra email tồn tại → hash password → tạo user → trả về JWT.
- Đăng nhập: kiểm tra email → so sánh password → tạo JWT → kiểm tra roadmap_id → redirect phù hợp.
- Đổi mật khẩu: yêu cầu xác thực → kiểm tra password cũ → hash password mới → cập nhật.
- Đăng xuất: xóa token phía client (Frontend).

### 6.2. User Module

| Thành phần | Mô tả |
|------------|-------|
| **Mục đích** | Quản lý thông tin cá nhân, hồ sơ người dùng |
| **Dữ liệu** | `users` (fullname, avatar, roadmap_id) |
| **Controller** | `userController.js` |
| **Route** | `userRoutes.js` |
| **Model** | `userModel.js` |

**Chức năng:**
- Xem thông tin cá nhân.
- Cập nhật hồ sơ (fullname, avatar).
- Chọn/đổi lộ trình học tập (cập nhật `roadmap_id`).

### 6.3. Roadmap Module

| Thành phần | Mô tả |
|------------|-------|
| **Mục đích** | Hiển thị danh sách lộ trình học tập cho người dùng |
| **Dữ liệu** | `roadmaps` (name, description, is_active, sort_order) |
| **Controller** | `roadmapController.js` |
| **Route** | `roadmapRoutes.js` |
| **Model** | (sử dụng chung model nếu cần) |

**Chức năng:**
- Lấy danh sách lộ trình đang active (`is_active = 1`), sắp xếp theo `sort_order`.
- Lấy chi tiết một lộ trình.

### 6.4. Topic Module

| Thành phần | Mô tả |
|------------|-------|
| **Mục đích** | Hiển thị danh sách chủ đề thuộc lộ trình |
| **Dữ liệu** | `topics` (name, description, roadmap_id, is_active, sort_order) |
| **Controller** | `topicController.js` |
| **Route** | `topicRoutes.js` |
| **Model** | `topicModel.js` |

**Chức năng:**
- Lấy danh sách chủ đề theo `roadmap_id` (chỉ `is_active = 1`).
- Lấy chi tiết một chủ đề.

### 6.5. Vocabulary Module

| Thành phần | Mô tả |
|------------|-------|
| **Mục đích** | Lấy danh sách từ vựng theo chủ đề để học |
| **Dữ liệu** | `vocabularies` (word, pronunciation, meaning, example, audio, image) |
| **Controller** | `vocabularyController.js` |
| **Route** | `vocabularyRoutes.js` |
| **Model** | `vocabularyModel.js` |

**Chức năng:**
- Lấy danh sách từ vựng theo `topic_id`.
- Lấy chi tiết một từ vựng.

### 6.6. Study Session Module

| Thành phần | Mô tả |
|------------|-------|
| **Mục đích** | Quản lý phiên học Flashcard + luyện viết |
| **Dữ liệu** | `user_vocabularies` (status, review_count, next_review_at) |
| **Controller** | (xử lý trong `vocabularyController.js`) |
| **Route** | `vocabularyRoutes.js` |
| **Model** | `vocabularyModel.js` |

**Chức năng:**
- Bắt đầu phiên học: tạo session, lấy danh sách từ vựng.
- Xử lý "Đã thuộc": cập nhật `status = 'mastered'`, tăng `review_count`.
- Xử lý "Tiếp tục": chuyển sang bài tập luyện viết.
- Xử lý luyện viết: kiểm tra input, cập nhật `status = 'learning'`, tính `next_review_at`, cập nhật `last_study_date`, tăng `streak`.
- Hiển thị tổng kết khi hết từ.

### 6.7. Notebook Module

| Thành phần | Mô tả |
|------------|-------|
| **Mục đích** | Quản lý sổ tay từ vựng cá nhân |
| **Dữ liệu** | `user_vocabularies` (join với `vocabularies`) |
| **Controller** | `notebookController.js` |
| **Route** | `notebookRoutes.js` |
| **Model** | `notebookModel.js` |

**Chức năng:**
- Lấy danh sách từ vựng của user, phân loại theo `status`.
- Tìm kiếm từ theo `word`.
- Xem chi tiết từ (join với `vocabularies` để lấy đầy đủ thông tin).
- "Ôn lại": chuyển `status` từ `mastered` về `learning`.

### 6.8. Quiz Module

| Thành phần | Mô tả |
|------------|-------|
| **Mục đích** | Tạo và quản lý bài Quiz ôn tập |
| **Dữ liệu** | `user_vocabularies`, `quiz_attempts`, `quiz_answers` |
| **Controller** | `quizController.js` |
| **Route** | `quizRoutes.js` |
| **Model** | (sử dụng `vocabularyModel.js` và model riêng cho quiz) |

**Chức năng:**
- Tạo Quiz: lọc từ vựng cần ôn tập (status IN ('new', 'learning') hoặc `next_review_at <= NOW()`), áp dụng Quiz Generation Rules (tối đa 20 câu, ưu tiên `review_count` thấp).
- Xử lý trả lời: kiểm tra đáp án, cập nhật SRS (tăng/giảm `review_count`, cập nhật `next_review_at`).
- Hoàn thành Quiz: lưu `quiz_attempts` và `quiz_answers`, hiển thị kết quả.
- Tiếp tục Quiz: load câu chưa làm nếu thoát giữa chừng.

### 6.9. Streak Module

| Thành phần | Mô tả |
|------------|-------|
| **Mục đích** | Theo dõi và cập nhật chuỗi ngày học |
| **Dữ liệu** | `users` (streak, last_study_date) |
| **Controller** | `streakController.js` |
| **Route** | `streakRoutes.js` |
| **Model** | `userModel.js` |

**Chức năng:**
- Lấy streak hiện tại của user.
- Cập nhật streak khi user hoàn thành hoạt động học tập.
- Reset streak về 0 nếu bỏ lỡ một ngày.
- Đảm bảo mỗi ngày chỉ tính một lần.

### 6.10. AI Assistant Module

| Thành phần | Mô tả |
|------------|-------|
| **Mục đích** | Cung cấp trợ lý AI học tập |
| **Dữ liệu** | `ai_conversations`, `ai_messages` |
| **Controller** | `aiController.js` |
| **Route** | `aiRoutes.js` |
| **Service** | `aiService.js` (gọi Gemini API) |
| **Model** | (model riêng cho conversation và message) |

**Chức năng:**
- Tạo hội thoại mới.
- Gửi tin nhắn: lấy context → ghép prompt → gọi Gemini API → lưu tin nhắn → trả về phản hồi.
- Lấy lịch sử hội thoại.
- Xử lý lỗi API/timeout.

### 6.11. Admin Module

| Thành phần | Mô tả |
|------------|-------|
| **Mục đích** | Quản lý dữ liệu hệ thống |
| **Dữ liệu** | `roadmaps`, `topics`, `vocabularies` |
| **Controller** | `adminController.js` |
| **Route** | `adminRoutes.js` |
| **Middleware** | `authMiddleware.js` + `adminMiddleware.js` |
| **Model** | (sử dụng các model tương ứng) |

**Chức năng:**
- CRUD Roadmaps (name, description, is_active, sort_order).
- CRUD Topics (gắn với roadmap_id, is_active, sort_order).
- CRUD Vocabularies (gắn với topic_id, upload audio/image).
- Tất cả route đều yêu cầu `role = 'admin'`.

---

## 7. Database Architecture

### 7.1. Vai trò

Database MySQL là nơi lưu trữ toàn bộ dữ liệu của hệ thống, bao gồm:

- Thông tin người dùng và xác thực.
- Dữ liệu lộ trình, chủ đề, từ vựng.
- Trạng thái học tập của từng người dùng (SRS).
- Lịch sử Quiz và kết quả.
- Lịch sử hội thoại AI.
- Thông tin streak.

### 7.2. Nhóm bảng

| Nhóm | Bảng | Mô tả |
|------|------|-------|
| **User & Auth** | `users` | Tài khoản người dùng, role, streak |
| **Nội dung** | `roadmaps`, `topics`, `vocabularies` | Dữ liệu học tập (seed sẵn) |
| **Học tập** | `user_vocabularies` | Trạng thái học từng từ của user (SRS) |
| **Quiz** | `quiz_attempts`, `quiz_answers` | Lịch sử làm bài Quiz |
| **AI** | `ai_conversations`, `ai_messages` | Lịch sử hội thoại AI |

### 7.3. Quan hệ tổng quát

```
users
  ├── 1 ──── n ──► user_vocabularies
  ├── 1 ──── n ──► quiz_attempts
  ├── 1 ──── n ──► ai_conversations
  └── * ──── 1 ──► roadmaps (roadmap_id)

roadmaps
  └── 1 ──── n ──► topics

topics
  └── 1 ──── n ──► vocabularies

vocabularies
  └── 1 ──── n ──► user_vocabularies
  └── 1 ──── n ──► quiz_answers

quiz_attempts
  └── 1 ──── n ──► quiz_answers

ai_conversations
  └── 1 ──── n ──► ai_messages
```

### 7.4. Nguyên tắc

- Sử dụng InnoDB engine để hỗ trợ transaction và foreign key.
- Charset `utf8mb4` với collation `utf8mb4_unicode_ci` hỗ trợ đầy đủ Unicode (tiếng Việt, IPA).
- Foreign key đảm bảo toàn vẹn dữ liệu tham chiếu.
- Index trên các cột thường xuyên truy vấn (user_id, status, next_review_at, email, role).
- UNIQUE constraint trên các cột không trùng lặp (email, username, user_id + vocabulary_id, topic_id + word).

---

## 8. Data Flow

### 8.1. Luồng Đăng ký

```
User                    Frontend                  Backend                   Database
 │                        │                         │                        │
 │  Nhập email,           │                         │                        │
 │  password,             │                         │                        │
 │  confirm_password      │                         │                        │
 ├───────────────────────►│                         │                        │
 │                        │  POST /api/auth/register│                        │
 │                        ├────────────────────────►│                        │
 │                        │                         │  Validate input        │
 │                        │                         │  (email format,        │
 │                        │                         │   password >= 8,       │
 │                        │                         │   confirm match)       │
 │                        │                         ├───────────────────────►│
 │                        │                         │  SELECT email FROM     │
 │                        │                         │  users WHERE email=?   │
 │                        │                         │◄───────────────────────┤
 │                        │                         │                        │
 │                        │                         │  Hash password (bcrypt)│
 │                        │                         │                        │
 │                        │                         │  INSERT INTO users     │
 │                        │                         │  (role='user',         │
 │                        │                         │   streak=0)            │
 │                        │                         ├───────────────────────►│
 │                        │                         │◄───────────────────────┤
 │                        │                         │                        │
 │                        │  { success: true,       │                        │
 │                        │    data: { token,       │                        │
 │                        │    user: { id, email }} │                        │
 │                        │◄────────────────────────┤                        │
 │  Chuyển đến trang      │                         │                        │
 │  chọn lộ trình         │                         │                        │
 │◄───────────────────────┤                         │                        │
```

### 8.2. Luồng Đăng nhập

```
User                    Frontend                  Backend                   Database
 │                        │                         │                        │
 │  Nhập email,           │                         │                        │
 │  password              │                         │                        │
 ├───────────────────────►│                         │                        │
 │                        │  POST /api/auth/login   │                        │
 │                        ├────────────────────────►│                        │
 │                        │                         │  SELECT * FROM users   │
 │                        │                         │  WHERE email=?         │
 │                        │                         ├───────────────────────►│
 │                        │                         │◄───────────────────────┤
 │                        │                         │                        │
 │                        │                         │  Compare password      │
 │                        │                         │  (bcrypt.compare)      │
 │                        │                         │                        │
 │                        │                         │  Tạo JWT token         │
 │                        │                         │  (24h expiry)          │
 │                        │                         │                        │
 │                        │  { success: true,       │                        │
 │                        │    data: { token,       │                        │
 │                        │    user: { id, email,   │                        │
 │                        │    role, roadmap_id,    │                        │
 │                        │    streak } }           │                        │
 │                        │◄────────────────────────┤                        │
 │                        │                         │                        │
 │  roadmap_id == null?   │                         │                        │
 │  → Chọn lộ trình       │                         │                        │
 │  roadmap_id != null?   │                         │                        │
 │  → Trang chủ           │                         │                        │
 │◄───────────────────────┤                         │                        │
```

### 8.3. Luồng Học Flashcard

```
User                    Frontend                  Backend                   Database
 │                        │                         │                        │
 │  Bấm vào chủ đề        │                         │                        │
 ├───────────────────────►│                         │                        │
 │                        │  GET /api/vocabularies  │                        │
 │                        │  ?topic_id=xxx          │                        │
 │                        ├────────────────────────►│                        │
 │                        │                         │  SELECT vocabularies   │
 │                        │                         │  WHERE topic_id=?      │
 │                        │                         ├───────────────────────►│
 │                        │                         │◄───────────────────────┤
 │                        │                         │                        │
 │                        │  { success: true,       │                        │
 │                        │    data: { vocabulary } │                        │
 │                        │◄────────────────────────┤                        │
 │                        │                         │                        │
 │  Hiển thị Flashcard    │                         │                        │
 │  mặt trước             │                         │                        │
 │◄───────────────────────┤                         │                        │
 │                        │                         │                        │
 │  Bấm Space / Lật thẻ   │                         │                        │
 ├───────────────────────►│                         │                        │
 │  Hiển thị mặt sau      │                         │                        │
 │◄───────────────────────┤                         │                        │
 │                        │                         │                        │
 │  [Đã thuộc]            │                         │                        │
 │  Bấm "Đã thuộc"        │                         │                        │
 ├───────────────────────►│  POST /api/vocabularies │                        │
 │                        │  /mastered              │                        │
 │                        ├────────────────────────►│                        │
 │                        │                         │  UPSERT                │
 │                        │                         │  user_vocabularies     │
 │                        │                         │  SET status='mastered' │
 │                        │                         │  review_count++        │
 │                        │                         ├───────────────────────►│
 │                        │                         │◄───────────────────────┤
 │                        │  { success: true,       │                        │
 │                        │    data: { next_vocab } │                        │
 │                        │◄────────────────────────┤                        │
 │  Chuyển từ tiếp theo   │                         │                        │
 │◄───────────────────────┤                         │                        │
 │                        │                         │                        │
 │  [Tiếp tục]            │                         │                        │
 │  Bấm "Tiếp tục"        │                         │                        │
 ├───────────────────────►│  POST /api/vocabularies │                        │
 │                        │  /writing               │                        │
 │                        ├────────────────────────►│                        │
 │                        │  { success: true,       │                        │
 │                        │    data: { prompt }     │                        │
 │                        │◄────────────────────────┤                        │
 │                        │                         │                        │
 │  Hiển thị bài tập      │                         │                        │
 │  luyện viết            │                         │                        │
 │◄───────────────────────┤                         │                        │
 │                        │                         │                        │
 │  Nhập từ → Nộp bài     │                         │                        │
 ├───────────────────────►│  POST /api/vocabularies │                        │
 │                        │  /writing/submit        │                        │
 │                        ├────────────────────────►│                        │
 │                        │                         │  UPSERT                │
 │                        │                         │  user_vocabularies     │
 │                        │                         │  SET status='learning' │
 │                        │                         │  next_review_at=...    │
 │                        │                         │  last_study_date=today │
 │                        │                         │  streak++              │
 │                        │                         ├───────────────────────►│
 │                        │                         │◄───────────────────────┤
 │                        │  { success: true,       │                        │
 │                        │    data: { next_vocab,  │                        │
 │                        │    streak_updated }     │                        │
 │                        │◄────────────────────────┤                        │
 │  Chuyển từ tiếp theo   │                         │                        │
 │◄───────────────────────┤                         │                        │
```

### 8.4. Luồng Quiz

```
User                    Frontend                  Backend                   Database
 │                        │                         │                        │
 │  Vào tab "Ôn tập"      │                         │                        │
 ├───────────────────────►│                         │                        │
 │                        │  POST /api/quiz/start   │                        │
 │                        ├────────────────────────►│                        │
 │                        │                         │  SELECT user_vocab     │
 │                        │                         │  WHERE user_id=?       │
 │                        │                         │  AND (status IN        │
 │                        │                         │  ('new','learning')    │
 │                        │                         │  OR next_review_at     │
 │                        │                         │  <= NOW())             │
 │                        │                         ├───────────────────────►│
 │                        │                         │◄───────────────────────┤
 │                        │                         │                        │
 │                        │                         │  Áp dụng Quiz Rules:   │
 │                        │                         │  - Tối đa 20 câu       │
 │                        │                         │  - Ưu tiên review_count│
 │                        │                         │  thấp                  │
 │                        │                         │                        │
 │                        │  { success: true,       │                        │
 │                        │    data: { quiz_id,     │                        │
 │                        │    questions } }        │                        │
 │                        │◄────────────────────────┤                        │
 │  Hiển thị câu hỏi      │                         │                        │
 │◄───────────────────────┤                         │                        │
 │                        │                         │                        │
 │  Chọn đáp án           │                         │                        │
 ├───────────────────────►│  POST /api/quiz/answer  │                        │
 │                        ├────────────────────────►│                        │
 │                        │                         │  Kiểm tra đáp án       │
 │                        │                         │                        │
 │                        │                         │  [Đúng]:               │
 │                        │                         │  UPDATE user_vocab     │
 │                        │                         │  SET review_count++,   │
 │                        │                         │  last_reviewed_at,     │
 │                        │                         │  next_review_at        │
 │                        │                         ├───────────────────────►│
 │                        │                         │◄───────────────────────┤
 │                        │                         │                        │
 │                        │                         │  [Sai]:                │
 │                        │                         │  UPDATE user_vocab     │
 │                        │                         │  SET review_count=0,   │
 │                        │                         │  next_review_at=NOW()  │
 │                        │                         ├───────────────────────►│
 │                        │                         │◄───────────────────────┤
 │                        │                         │                        │
 │                        │                         │  INSERT quiz_answers   │
 │                        │                         ├───────────────────────►│
 │                        │                         │◄───────────────────────┤
 │                        │                         │                        │
 │                        │  { success: true,       │                        │
 │                        │    data: { is_correct,  │                        │
 │                        │    correct_answer,      │                        │
 │                        │    explanation } }      │                        │
 │                        │◄────────────────────────┤                        │
 │  Hiển thị kết quả      │                         │                        │
 │◄───────────────────────┤                         │                        │
 │                        │                         │                        │
 │  [Hoàn thành Quiz]     │                         │                        │
 ├───────────────────────►│  POST /api/quiz/        │                        │
 │                        │  complete               │                        │
 │                        ├────────────────────────►│                        │
 │                        │                         │  UPDATE quiz_attempts  │
 │                        │                         │  SET score,            │
 │                        │                         │  total_questions,      │
 │                        │                         │  correct_answers       │
 │                        │                         ├───────────────────────►│
 │                        │                         │◄───────────────────────┤
 │                        │  { success: true,       │                        │
 │                        │    data: { score,       │                        │
 │                        │    words_mastered,      │                        │
 │                        │    words_to_review } }  │                        │
 │                        │◄────────────────────────┤                        │
 │  Hiển thị kết quả      │                         │                        │
 │◄───────────────────────┤                         │                        │
```

### 8.5. Luồng Sổ tay từ vựng (Notebook)

```
User                    Frontend                  Backend                   Database
 │                        │                         │                        │
 │  Vào tab "Sổ tay"      │                         │                        │
 ├───────────────────────►│                         │                        │
 │                        │  GET /api/notebook      │                        │
 │                        │  ?search=&status=       │                        │
 │                        ├────────────────────────►│                        │
 │                        │                         │  SELECT uv.*, v.*     │
 │                        │                         │  FROM user_vocabularies│
 │                        │                         │  JOIN vocabularies     │
 │                        │                         │  WHERE user_id=?       │
 │                        │                         │  [AND status=?]        │
 │                        │                         │  [AND v.word LIKE %?%] │
 │                        │                         ├───────────────────────►│
 │                        │                         │◄───────────────────────┤
 │                        │  { success: true,       │                        │
 │                        │    data: { total,       │                        │
 │                        │    items } }            │                        │
 │                        │◄────────────────────────┤                        │
 │  Hiển thị danh sách    │                         │                        │
 │◄───────────────────────┤                         │                        │
 │                        │                         │                        │
 │  Bấm "Ôn lại"          │                         │                        │
 ├───────────────────────►│  POST /api/notebook/    │                        │
 │                        │  review/{vocabulary_id} │                        │
 │                        ├────────────────────────►│                        │
 │                        │                         │  UPDATE user_vocab     │
 │                        │                         │  SET status='learning' │
 │                        │                         ├───────────────────────►│
 │                        │                         │◄───────────────────────┤
 │                        │  { success: true }      │                        │
 │                        │◄────────────────────────┤                        │
 │  Cập nhật UI           │                         │                        │
 │◄───────────────────────┤                         │                        │
```

### 8.6. Luồng AI Assistant

```
User                    Frontend                  Backend                   Database
 │                        │                         │                        │
 │  Bấm icon AI           │                         │                        │
 ├───────────────────────►│                         │                        │
 │  Mở popup chat         │                         │                        │
 │◄───────────────────────┤                         │                        │
 │                        │                         │                        │
 │  Nhập câu hỏi          │                         │                        │
 ├───────────────────────►│  POST /api/ai/chat      │                        │
 │                        ├────────────────────────►│                        │
 │                        │                         │  Lấy context (nếu có)  │
 │                        │                         │  (topic_id,            │
 │                        │                         │   vocabulary_id)       │
 │                        │                         │                        │
 │                        │                         │  Lấy 10 tin nhắn gần   │
 │                        │                         │  nhất (ai_messages)    │
 │                        │                         ├───────────────────────►│
 │                        │                         │◄───────────────────────┤
 │                        │                         │                        │
 │                        │                         │  Ghép prompt + context │
 │                        │                         │  + lịch sử             │
 │                        │                         │                        │
 │                        │                         │  Gọi Gemini API        │
 │                        │                         ├───────────────────────►│
 │                        │                         │  (Google AI)           │
 │                        │                         │◄───────────────────────┤
 │                        │                         │                        │
 │                        │                         │  Lưu user message      │
 │                        │                         │  + assistant message   │
 │                        │                         │  vào ai_messages       │
 │                        │                         ├───────────────────────►│
 │                        │                         │◄───────────────────────┤
 │                        │                         │                        │
 │                        │  { success: true,       │                        │
 │                        │    data: { reply,       │                        │
 │                        │    conversation_id } }  │                        │
 │                        │◄────────────────────────┤                        │
 │  Hiển thị phản hồi     │                         │                        │
 │  trong popup chat      │                         │                        │
 │◄───────────────────────┤                         │                        │
```

### 8.7. Luồng Admin

```
Admin                   Frontend (Admin)           Backend                   Database
 │                        │                         │                        │
 │  Đăng nhập admin       │                         │                        │
 ├───────────────────────►│  POST /api/auth/login   │                        │
 │                        ├────────────────────────►│                        │
 │                        │                         │  Kiểm tra role='admin' │
 │                        │  { success: true,       │                        │
 │                        │    data: { token,       │                        │
 │                        │    user: { role:admin }}│                        │
 │                        │◄────────────────────────┤                        │
 │                        │                         │                        │
 │  Vào Admin Dashboard   │                         │                        │
 ├───────────────────────►│                         │                        │
 │                        │  GET /api/admin/        │                        │
 │                        │  roadmaps               │                        │
 │                        ├────────────────────────►│                        │
 │                        │  authMiddleware         │                        │
 │                        │  → adminMiddleware      │                        │
 │                        │  → controller           │                        │
 │                        │                         │  SELECT roadmaps       │
 │                        │                         ├───────────────────────►│
 │                        │                         │◄───────────────────────┤
 │                        │  { success: true,       │                        │
 │                        │    data: roadmaps }     │                        │
 │                        │◄────────────────────────┤                        │
 │  Hiển thị danh sách    │                         │                        │
 │◄───────────────────────┤                         │                        │
 │                        │                         │                        │
 │  [CRUD Operations]     │                         │                        │
 │  Thêm/Sửa/Xóa          │                         │                        │
 │  Roadmap/Topic/Vocab   │                         │                        │
 ├───────────────────────►│  POST/PUT/DELETE        │                        │
 │                        │  /api/admin/*           │                        │
 │                        ├────────────────────────►│                        │
 │                        │  authMiddleware         │                        │
 │                        │  → adminMiddleware      │                        │
 │                        │  → controller           │                        │
 │                        │                         │  INSERT/UPDATE/DELETE  │
 │                        │                         ├───────────────────────►│
 │                        │                         │◄───────────────────────┤
 │                        │  { success: true,       │                        │
 │                        │    data: result }       │                        │
 │                        │◄────────────────────────┤                        │
 │  Cập nhật UI           │                         │                        │
 │◄───────────────────────┤                         │                        │
```

---

## 9. Authentication Flow

### 9.1. JWT (JSON Web Token)

- **Thuật toán**: HS256 (HMAC with SHA-256).
- **Payload**: `{ user_id, email, role, iat, exp }`.
- **Thời hạn**: 24 giờ (theo NFR-008).
- **Secret key**: Lưu trong biến môi trường `JWT_SECRET` (file `.env`).

### 9.2. Luồng xác thực

```
1. Client gửi request với header:
   Authorization: Bearer <token>

2. authMiddleware:
   a. Lấy token từ header Authorization
   b. Verify token với JWT_SECRET
   c. Nếu hợp lệ: giải mã → gắn req.user = { id, email, role }
   d. Nếu không hợp lệ/hết hạn: trả về 401 Unauthorized

3. Controller nhận req.user và xử lý logic
```

### 9.3. Middleware xác thực

**authMiddleware.js:**

- Áp dụng cho tất cả route yêu cầu đăng nhập.
- Kiểm tra sự tồn tại của token.
- Verify token.
- Gắn thông tin user vào `req.user`.
- Nếu lỗi: trả về `{ success: false, message: "Unauthorized" }` với status 401.

**adminMiddleware.js:**

- Áp dụng cho tất cả route `/api/admin/*`.
- Kiểm tra `req.user.role === 'admin'`.
- Nếu không phải admin: trả về `{ success: false, message: "Forbidden" }` với status 403.

### 9.4. Protected Routes

| Route | Middleware | Ghi chú |
|-------|-----------|---------|
| `/api/auth/register` | Không | Public |
| `/api/auth/login` | Không | Public |
| `/api/auth/*` (khác) | authMiddleware | Đổi mật khẩu, logout |
| `/api/user/*` | authMiddleware | Profile, settings |
| `/api/roadmaps` | Không (GET) / authMiddleware (khác) | Public list |
| `/api/topics` | authMiddleware | Theo roadmap của user |
| `/api/vocabularies/*` | authMiddleware | Học tập |
| `/api/notebook/*` | authMiddleware | Sổ tay cá nhân |
| `/api/quiz/*` | authMiddleware | Quiz |
| `/api/streak/*` | authMiddleware | Streak |
| `/api/ai/*` | authMiddleware | AI Assistant |
| `/api/admin/*` | authMiddleware + adminMiddleware | Admin CRUD |

### 9.5. Role

- **`role = 'user'`**: Học viên, truy cập tất cả route user.
- **`role = 'admin'`**: Quản trị viên, truy cập route admin.
- Mặc định khi đăng ký: `role = 'user'`.

---

## 10. AI Architecture

### 10.1. Tổng quan

AI Assistant sử dụng **Gemini API** (Google AI) để xử lý câu hỏi của người dùng. Backend đóng vai trò trung gian: nhận request từ Frontend, gọi Gemini API, trả về kết quả.

### 10.2. Kiến trúc

```
Frontend (popup chat)
    │
    │  POST /api/ai/chat { message, conversation_id, context }
    ▼
Backend (aiController.js)
    │
    ▼
Backend (aiService.js)
    │
    ├── 1. Lấy context (topic_id, vocabulary_id nếu có)
    ├── 2. Lấy 10 tin nhắn gần nhất từ ai_messages
    ├── 3. Ghép system prompt + context + lịch sử + user message
    ├── 4. Gọi Gemini API (gemini-pro hoặc tương đương)
    ├── 5. Parse response
    ├── 6. Lưu user message + assistant message vào ai_messages
    └── 7. Trả về reply cho Frontend
    │
    ▼
Frontend (hiển thị trong popup chat)
```

### 10.3. Conversation

- Mỗi cuộc hội thoại là một phiên chat, lưu trong bảng `ai_conversations`.
- Mỗi conversation có `title` (có thể null) và `user_id`.
- Người dùng có thể tạo nhiều conversation.
- Khi người dùng bấm "Hội thoại mới", Backend tạo conversation mới.

### 10.4. Message

- Mỗi tin nhắn lưu trong bảng `ai_messages`.
- `role`: `'user'` hoặc `'assistant'`.
- `content`: Nội dung tin nhắn (text).
- Mỗi message gắn với một `conversation_id`.

### 10.5. Context

- Khi người dùng đang học một từ hoặc chủ đề cụ thể, Frontend gửi kèm `context` object: `{ topic_id, vocabulary_id }`.
- Backend sử dụng context này để ghép vào prompt, giúp AI trả lời chính xác hơn.
- Context là tùy chọn (optional).

### 10.6. Prompt Engineering

- **System prompt**: Hướng dẫn AI扮演 trợ lý học tiếng Anh, hỗ trợ giải thích từ vựng, ngữ pháp, ví dụ.
- **Context**: Thông tin về từ/chủ đề hiện tại (nếu có).
- **History**: 10 tin nhắn gần nhất để duy trì ngữ cảnh hội thoại.
- **User message**: Câu hỏi của người dùng.

### 10.7. Xử lý lỗi AI

- Nếu Gemini API trả về lỗi hoặc timeout, Backend trả về response lỗi thân thiện.
- Frontend hiển thị thông báo: "AI hiện không khả dụng, vui lòng thử lại sau."
- Không để lộ thông tin lỗi kỹ thuật cho người dùng.

---

## 11. Security Architecture

### 11.1. JWT (JSON Web Token)

- Token được tạo khi đăng nhập thành công.
- Token có thời hạn 24 giờ.
- Token được gửi trong header `Authorization: Bearer <token>`.
- Backend verify token ở mọi request yêu cầu xác thực.
- Secret key lưu trong `.env`, không hardcode.

### 11.2. bcrypt

- Password được hash bằng bcrypt trước khi lưu vào database.
- Sử dụng salt rounds (mặc định 10).
- Không lưu plain-text password.
- Khi đăng nhập, so sánh password với hash bằng `bcrypt.compare()`.

### 11.3. Prepared Statement

- Tất cả query database sử dụng Prepared Statements (mysql2).
- Ngăn chặn SQL Injection.
- Không concatenate string để tạo query.

### 11.4. Authorization

- Phân quyền dựa trên `role` trong JWT token.
- Route admin yêu cầu `role = 'admin'`.
- Người dùng chỉ truy cập dữ liệu thuộc tài khoản của mình (kiểm tra `user_id`).
- API trả về 403 Forbidden nếu không đủ quyền.

### 11.5. Authentication

- Tất cả route ngoại trừ đăng ký/đăng nhập đều yêu cầu xác thực.
- authMiddleware kiểm tra token ở mỗi request.
- Token hết hạn → 401 Unauthorized.

### 11.6. Input Validation

- Validate đầu vào ở cả Frontend và Backend.
- Backend validate: email format, password length (>= 8), confirm password match.
- Backend kiểm tra tồn tại của dữ liệu (email, roadmap_id, topic_id, vocabulary_id).
- Sử dụng UNIQUE constraint để ngăn trùng lặp.

### 11.7. Environment Variables

- File `.env` chứa các biến môi trường nhạy cảm:
  - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
  - `JWT_SECRET`
  - `GEMINI_API_KEY`
  - `PORT`
- `.env` không được commit lên Git (có trong `.gitignore`).

---

## 12. Error Handling Strategy

### 12.1. Response Format

Tất cả API response sử dụng định dạng JSON thống nhất:

**Success:**
```json
{
  "success": true,
  "message": "Thông báo (tùy chọn)",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Mô tả lỗi"
}
```

### 12.2. HTTP Status Codes

| Status Code | Ý nghĩa | Sử dụng |
|-------------|---------|---------|
| 200 | Thành công | GET, PUT, PATCH, DELETE thành công |
| 201 | Tạo mới thành công | POST (register, create) |
| 400 | Bad Request | Validation lỗi, dữ liệu đầu vào không hợp lệ |
| 401 | Unauthorized | Chưa đăng nhập, token hết hạn |
| 403 | Forbidden | Không có quyền (role không phải admin) |
| 404 | Not Found | Resource không tồn tại |
| 409 | Conflict | Dữ liệu trùng lặp (email đã tồn tại) |
| 500 | Internal Server Error | Lỗi server, database, AI |

### 12.3. Validation Error

- Xảy ra khi dữ liệu đầu vào không hợp lệ.
- Backend kiểm tra: email format, password length, confirm password match, required fields.
- Trả về 400 với message mô tả lỗi cụ thể.

### 12.4. Database Error

- Xảy ra khi query database thất bại (connection lỗi, constraint violation, duplicate entry).
- Bắt exception, log lỗi chi tiết (server-side).
- Trả về 500 với message chung: "Lỗi hệ thống, vui lòng thử lại sau."
- Không để lộ thông tin database cho client.

### 12.5. AI Error

- Xảy ra khi Gemini API lỗi hoặc timeout.
- Bắt exception, log lỗi chi tiết.
- Trả về 500 với message thân thiện: "AI hiện không khả dụng, vui lòng thử lại sau."

### 12.6. Unauthorized

- Xảy ra khi token không hợp lệ hoặc hết hạn.
- authMiddleware trả về 401.
- Frontend chuyển hướng về trang đăng nhập.

### 12.7. Forbidden

- Xảy ra khi user không phải admin truy cập route admin.
- adminMiddleware trả về 403.
- Frontend hiển thị thông báo "Bạn không có quyền truy cập."

---

## 13. Logging Strategy

### 13.1. Log Authentication

- Log khi đăng ký thành công/thất bại (email, IP, thời gian).
- Log khi đăng nhập thành công/thất bại (email, IP, thời gian, lý do nếu thất bại).
- Log khi đổi mật khẩu (user_id, thời gian).
- **Mức độ**: INFO (thành công), WARN (thất bại).

### 13.2. Log AI

- Log mỗi request AI (user_id, conversation_id, độ dài message, thời gian phản hồi).
- Log khi AI API lỗi hoặc timeout (user_id, error message, thời gian).
- **Mức độ**: INFO (thành công), ERROR (lỗi).

### 13.3. Log Admin

- Log mọi thao tác CRUD của admin (admin_id, action, resource, resource_id, thời gian).
- Log khi admin truy cập dashboard (admin_id, IP, thời gian).
- **Mức độ**: INFO.

### 13.4. Log Error

- Log tất cả lỗi 500 (stack trace, request path, method, user_id nếu có, thời gian).
- Log database error (query, error code, message).
- Log lỗi không mong đợi (unhandled rejection, uncaught exception).
- **Mức độ**: ERROR.

### 13.5. Nguyên tắc chung

- Log được ghi vào file (hoặc console trong development).
- Không log thông tin nhạy cảm (password, token, API key).
- Mỗi log entry gồm: timestamp, level, message, context (user_id, IP, path).

---

## 14. File Upload Architecture

### 14.1. Image

- **Mục đích**: Upload hình ảnh cho từ vựng (Admin), avatar người dùng.
- **Định dạng**: JPG, PNG.
- **Kích thước tối đa**: 5MB.
- **Lưu trữ**: `frontend/public/uploads/images/`.
- **Tên file**: `{timestamp}-{random}.{extension}` (tránh trùng lặp).

### 14.2. Audio

- **Mục đích**: Upload file phát âm cho từ vựng (Admin).
- **Định dạng**: MP3.
- **Kích thước tối đa**: 2MB.
- **Lưu trữ**: `frontend/public/uploads/audio/`.
- **Tên file**: `{timestamp}-{random}.mp3`.

### 14.3. Upload Folder

- Thư mục `frontend/public/uploads/` được tạo tự động nếu chưa tồn tại.
- Phân loại: `images/` và `audio/`.
- File cũ không tự động xóa (có thể dọn dẹo thủ công sau).

### 14.4. Validation

- Kiểm tra định dạng file trước khi upload.
- Kiểm tra kích thước file.
- Chỉ admin mới có quyền upload (qua route admin).
- File được lưu trên server, đường dẫn được lưu trong database (`audio`, `image` columns).

---

## 15. API Organization

### 15.1. Cách tổ chức

API được tổ chức theo module, mỗi module có:

1. **Controller**: Xử lý logic nghiệp vụ.
2. **Route**: Định nghĩa endpoint, gắn middleware, gọi controller.
3. **Model** (nếu cần): Tương tác database.

### 15.2. Cấu trúc module

```
Authentication Module
    │
    ▼
authController.js
    │
    ▼
authRoutes.js
    │
    ▼
userModel.js

---

User Module
    │
    ▼
userController.js
    │
    ▼
userRoutes.js
    │
    ▼
userModel.js

---

Roadmap Module
    │
    ▼
roadmapController.js
    │
    ▼
roadmapRoutes.js

---

Topic Module
    │
    ▼
topicController.js
    │
    ▼
topicRoutes.js
    │
    ▼
topicModel.js

---

Vocabulary Module
    │
    ▼
vocabularyController.js
    │
    ▼
vocabularyRoutes.js
    │
    ▼
vocabularyModel.js

---

Notebook Module
    │
    ▼
notebookController.js
    │
    ▼
notebookRoutes.js
    │
    ▼
notebookModel.js

---

Quiz Module
    │
    ▼
quizController.js
    │
    ▼
quizRoutes.js

---

Streak Module
    │
    ▼
streakController.js
    │
    ▼
streakRoutes.js
    │
    ▼
userModel.js

---

AI Assistant Module
    │
    ▼
aiController.js
    │
    ▼
aiRoutes.js
    │
    ▼
aiService.js (gọi Gemini API)

---

Admin Module
    │
    ▼
adminController.js
    │
    ▼
adminRoutes.js
    │
    ▼
authMiddleware.js + adminMiddleware.js
    │
    ▼
(Sử dụng model tương ứng: userModel, topicModel, vocabularyModel)
```

### 15.3. Nguyên tắc

- Route không chứa logic, chỉ định tuyến.
- Controller không chứa query SQL.
- Model không chứa logic nghiệp vụ phức tạp.
- Service chứa logic đặc thù (AI, SRS).
- Middleware tách biệt, có thể tái sử dụng.

---

## 16. Dependency

### 16.1. Sơ đồ phụ thuộc

```
Authentication
    │
    ▼
User ─────────────────────────────────────┐
    │                                      │
    ▼                                      ▼
Roadmap ──► Topic ──► Vocabulary ──► Notebook
                            │
                            ▼
                        Quiz ──► Streak
                            │
                            ▼
                        AI Assistant
                            │
                            ▼
                        Admin
```

### 16.2. Mô tả chi tiết

| Module | Phụ thuộc vào | Mô tả |
|--------|---------------|-------|
| **Authentication** | User | Đăng ký tạo user, đăng nhập xác thực user |
| **User** | (không) | Module độc lập, quản lý thông tin cá nhân |
| **Roadmap** | (không) | Dữ liệu seed, không phụ thuộc module khác |
| **Topic** | Roadmap | Topic thuộc một Roadmap |
| **Vocabulary** | Topic | Vocabulary thuộc một Topic |
| **Study Session** | Vocabulary, User, Streak | Học từ vựng, cập nhật user_vocabularies, tăng streak |
| **Notebook** | Vocabulary, User | Xem user_vocabularies của user |
| **Quiz** | Vocabulary, User, Streak | Quiz dựa trên user_vocabularies, cập nhật streak |
| **Streak** | User | Cập nhật streak trong bảng users |
| **AI Assistant** | User, Vocabulary (context) | AI chat, có thể dùng context từ vocabulary |
| **Admin** | Roadmap, Topic, Vocabulary | CRUD tất cả dữ liệu |

### 16.3. Nguyên tắc

- Module không phụ thuộc vòng tròn.
- Module cấp thấp hơn không phụ thuộc module cấp cao hơn.
- Authentication là module nền tảng, mọi module khác đều cần xác thực.

---

## 17. Deployment Overview

### 17.1. Frontend

- **Loại**: Static HTML/CSS/JS.
- **Triển khai**: Web server (Nginx, Apache, hoặc static hosting).
- **Cấu hình**: Trỏ domain/subdomain đến thư mục `frontend/`.
- **Kết nối Backend**: Cấu hình `API_BASE_URL` trong JavaScript (địa chỉ Backend server).

### 17.2. Backend

- **Loại**: Node.js + Express application.
- **Triển khai**: VPS / Cloud Run / Heroku / các platform Node.js.
- **Khởi động**: `node src/server.js` hoặc `npm start`.
- **Cổng**: Mặc định 3000 (cấu hình qua `PORT` trong `.env`).
- **Kết nối Database**: Cấu hình `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` trong `.env`.

### 17.3. Database

- **Loại**: MySQL 8.0+ / MariaDB 10.3+.
- **Triển khai**: MySQL server riêng hoặc dịch vụ MySQL cloud.
- **Khởi tạo**: Chạy `database/schema.sql` để tạo database và tables.
- **Seed data**: Script riêng (không thuộc phạm vi architecture này) để insert dữ liệu mẫu (roadmaps, topics, vocabularies).

### 17.4. Gemini API

- **Loại**: Google AI API (Gemini).
- **Kết nối**: Backend gọi Gemini API qua HTTP request.
- **Cấu hình**: `GEMINI_API_KEY` trong `.env`.
- **Giới hạn**: Cần xử lý rate limit và timeout.

### 17.5. Sơ đồ kết nối

```
Internet
    │
    ├──► Frontend (HTML/CSS/JS)
    │       │
    │       └──► Backend API (Node.js + Express)
    │               │
    │               ├──► MySQL Database
    │               │
    │               └──► Gemini API (Google AI)
    │
    └──► Admin Browser
            │
            └──► Frontend (Admin Dashboard)
                    │
                    └──► Backend API (Node.js + Express)
                            │
                            ├──► MySQL Database
                            │
                            └──► File Upload (images, audio)
```

---

## 18. Future Extension

Các hướng mở rộng sau MVP (không thuộc phạm vi hiện tại):

### 18.1. Leaderboards

- Bảng xếp hạng học viên dựa trên streak, số từ đã học, số Quiz đã hoàn thành.
- Yêu cầu thêm bảng `leaderboards` và logic tính điểm.

### 18.2. Achievements / Badges

- Hệ thống thành tích: "Học 7 ngày liên tiếp", "Hoàn thành 100 từ", "Đạt 10/10 Quiz".
- Yêu cầu thêm bảng `achievements` và `user_achievements`.

### 18.3. Push Notification

- Gửi thông báo nhắc nhở học tập hàng ngày.
- Yêu cầu tích hợp Web Push API hoặc Firebase Cloud Messaging.

### 18.4. Analytics & Statistics

- Biểu đồ tiến độ học tập theo tuần/tháng.
- Thống kê số từ đã học, tỷ lệ đúng Quiz, thời gian học.
- Yêu cầu thêm module analytics và biểu đồ frontend.

### 18.5. Social Features

- Chia sẻ tiến độ học tập lên mạng xã hội.
- Kết bạn, thách đấu học tập.
- Yêu cầu thêm bảng `friends`, `shares`.

### 18.6. Mobile App

- Xây dựng ứng dụng di động (React Native / Flutter).
- API Backend hiện tại có thể tái sử dụng.

### 18.7. Advanced SRS

- Tùy chỉnh tham số SRS (hệ số dễ, khoảng cách ôn tập).
- Hỗ trợ nhiều thuật toán SRS hơn (Anki-style, SM-5).

### 18.8. Multi-language Support

- Hỗ trợ thêm ngôn ngữ khác ngoài tiếng Việt.
- Yêu cầu i18n cho Frontend và mở rộng database.

---

> **Tài liệu này được xây dựng dựa trên `docs/spec.md` v1.0 và phản ánh chính xác phạm vi MVP, business rules, functional requirements và database schema đã được phê duyệt.**