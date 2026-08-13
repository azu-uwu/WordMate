# Task.md - WordMate Tasks

**Version**: 1.0
**Status**: Draft
**Based on**: docs/requirements.md, docs/spec.md, docs/architecture.md, docs/database.md, docs/plan.md

---

# Milestone 1: Project Setup & Foundation

## Task M1-T1 (Backend)

### Thông tin

- **ID**: M1-T1
- **Tên**: Khởi tạo Backend Project
- **Milestone**: M1
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001–FR-053
- **Module**: Project Setup
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: Không

### Mục tiêu

Tạo dự án Node.js + Express với package.json, cài đặt tất cả dependencies cần thiết, tạo file server.js entry point.

### Công việc cần thực hiện

1. Tạo thư mục `backend/` và khởi tạo `npm init -y` để tạo `package.json`.
2. Cài đặt các dependencies: `express`, `mysql2`, `dotenv`, `bcryptjs`, `jsonwebtoken`, `multer`, `cors`.
3. Tạo file `backend/src/server.js`:
   - Import express, cors, dotenv.
   - Cấu hình CORS.
   - Parse JSON body.
   - Khởi tạo Express server.
   - Lắng nghe trên port từ biến môi trường PORT (mặc định 3000).
   - Export app để testing.
4. Tạo file `backend/.env` với các biến môi trường: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, GEMINI_API_KEY, PORT.
5. Thêm script `"start": "node src/server.js"` và `"dev": "node --watch src/server.js"` vào package.json.
6. Tạo file `backend/.gitignore` bao gồm node_modules, .env, uploads/.

### File cần tạo

- `backend/package.json`
- `backend/src/server.js`
- `backend/.env`
- `backend/.gitignore`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Config
- Utils

### Database liên quan

Không.

### Frontend liên quan

Không.

### Kết quả mong đợi

Backend có thể khởi động bằng `npm start`, Express server lắng nghe trên `PORT` được cấu hình trong `.env`; nếu không có `PORT` thì mặc định là `3000`.

### Acceptance Criteria

1. `npm start` chạy thành công, server khởi động và lắng nghe trên `PORT` được cấu hình trong `.env`; nếu không có `PORT` thì mặc định là `3000`.
2. `package.json` có đầy đủ dependencies:
   - express
   - mysql2
   - dotenv
   - bcrypt
   - jsonwebtoken
   - multer
   - cors
3. `.env` có đầy đủ các biến môi trường.
4. `.gitignore` loại trừ:
   - node_modules/
   - .env
   - uploads/

### Kiểm thử

- Chạy `npm start`.
- Kiểm tra server khởi động thành công.
- Truy cập `http://localhost:<PORT>` (ví dụ `http://localhost:5000` nếu `PORT=5000`).
- Nếu chưa có route thì trả về `404 Not Found` là bình thường.
- Kiểm tra khi không cấu hình `PORT` thì server mặc định chạy trên `3000`.

### Checklist

- [ ] Database
- [ ] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M1-T2 (Backend)

### Thông tin

- **ID**: M1-T2
- **Tên**: Cấu hình Database Connection
- **Milestone**: M1
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001–FR-053
- **Module**: Config
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M1-T1

### Mục tiêu

Tạo kết nối MySQL pool sử dụng mysql2/promise, đọc cấu hình từ .env.

### Công việc cần thực hiện

1. Tạo file `backend/config/db.js`.
2. Import `mysql2/promise`.
3. Đọc cấu hình từ process.env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).
4. Tạo pool connection với các options: host, user, password, database, waitForConnections, connectionLimit (10), queueLimit (0).
5. Export pool để các model sử dụng.
6. Thêm hàm testConnection để kiểm tra kết nối khi khởi động server.
7. Xử lý lỗi kết nối (ECONNREFUSED, ER_ACCESS_DENIED_ERROR) với log message rõ ràng.
8. Import và gọi testConnection trong server.js.

### File cần tạo

- `backend/config/db.js`

### File cần chỉnh sửa

- `backend/src/server.js` (import và test connection)

### Thành phần liên quan

- Config
- Utils

### Database liên quan

- MySQL database connection pool.

### Frontend liên quan

Không.

### Kết quả mong đợi

Pool kết nối MySQL được export, có error handling khi kết nối thất bại.

### Acceptance Criteria

1. Pool kết nối MySQL được export từ db.js.
2. Test connection thành công khi DB chạy.
3. Error handling khi kết nối thất bại (log lỗi, không crash server).
4. Cấu hình đọc từ biến môi trường trong .env.

### Checklist

- [ ] Database
- [ ] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M1-T3 (Database)

### Thông tin

- **ID**: M1-T3
- **Tên**: Tạo Database Schema
- **Milestone**: M1
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001–FR-053
- **Module**: Database
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: Không

### Mục tiêu

Tạo file schema.sql với CREATE TABLE cho 9 bảng, đầy đủ ràng buộc, index, foreign key.

### Công việc cần thực hiện

1. Tạo file `database/schema.sql`.
2. Tạo DATABASE wordmate với CHARACTER SET utf8mb4, COLLATE utf8mb4_unicode_ci.
3. Tạo bảng `users`: id, username (UNIQUE NOT NULL), email (UNIQUE NOT NULL), password (NOT NULL), fullname, avatar, role ENUM('user','admin') DEFAULT 'user', roadmap_id (FK → roadmaps.id, nullable), streak DEFAULT 0, last_study_date, created_at, updated_at. INDEX(role), INDEX(roadmap_id).
4. Tạo bảng `roadmaps`: id, name NOT NULL, description, image, is_active DEFAULT TRUE, sort_order DEFAULT 0, created_at, updated_at.
5. Tạo bảng `topics`: id, roadmap_id (FK → roadmaps.id, ON DELETE CASCADE) NOT NULL, name NOT NULL, description, image, sort_order DEFAULT 0, is_active DEFAULT TRUE, created_at, updated_at. INDEX(roadmap_id).
6. Tạo bảng `vocabularies`: id, topic_id (FK → topics.id, ON DELETE CASCADE) NOT NULL, word NOT NULL, pronunciation, part_of_speech ENUM('noun','verb','adjective','adverb','preposition','phrasal_verb','idiom','other'), meaning NOT NULL, example, example_meaning, audio, image, created_at, updated_at. INDEX(topic_id), INDEX(word), UNIQUE(topic_id, word).
7. Tạo bảng `user_vocabularies`: id, user_id (FK → users.id, ON DELETE CASCADE) NOT NULL, vocabulary_id (FK → vocabularies.id, ON DELETE CASCADE) NOT NULL, status ENUM('new','learning','mastered') DEFAULT 'new', review_count DEFAULT 0, last_reviewed_at, next_review_at, created_at, updated_at. INDEX(user_id), INDEX(status), INDEX(next_review_at), UNIQUE(user_id, vocabulary_id).
8. Tạo bảng `quiz_attempts`: id, user_id (FK → users.id, ON DELETE CASCADE) NOT NULL, score DEFAULT 0, total_questions DEFAULT 0, correct_answers DEFAULT 0, duration, created_at. INDEX(user_id).
9. Tạo bảng `quiz_answers`: id, quiz_attempt_id (FK → quiz_attempts.id, ON DELETE CASCADE) NOT NULL, vocabulary_id (FK → vocabularies.id, ON DELETE CASCADE) NOT NULL, user_answer, correct_answer, is_correct, created_at. INDEX(quiz_attempt_id).
10. Tạo bảng `ai_conversations`: id, user_id (FK → users.id, ON DELETE CASCADE) NOT NULL, title, created_at, updated_at. INDEX(user_id).
11. Tạo bảng `ai_messages`: id, conversation_id (FK → ai_conversations.id, ON DELETE CASCADE) NOT NULL, role ENUM('user','assistant') NOT NULL, content TEXT NOT NULL, created_at. INDEX(conversation_id).
12. Đảm bảo ENGINE=InnoDB, DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci cho tất cả bảng.

### File cần tạo

- `database/schema.sql`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Database

### Database liên quan

- 9 bảng: users, roadmaps, topics, vocabularies, user_vocabularies, quiz_attempts, quiz_answers, ai_conversations, ai_messages.

### Frontend liên quan

Không.

### Kết quả mong đợi

Script chạy thành công, tạo đúng 9 bảng với đầy đủ ràng buộc.

### Acceptance Criteria

1. Script tạo database và 9 bảng thành công.
2. Tất cả bảng đều ENGINE=InnoDB, CHARSET=utf8mb4.
3. Foreign key đầy đủ: ON DELETE CASCADE, ON UPDATE CASCADE.
4. Unique constraint trên email, username, user_id+vocabulary_id, topic_id+word.
5. Index trên các cột: email, role, roadmap_id, topic_id, word, user_id, status, next_review_at, conversation_id, quiz_attempt_id.

### Checklist

- [ ] Database
- [ ] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M1-T4 (Backend)

### Thông tin

- **ID**: M1-T4
- **Tên**: Tạo cấu trúc thư mục Backend
- **Milestone**: M1
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001–FR-053
- **Module**: Project Setup
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M1-T1

### Mục tiêu

Tạo cấu trúc thư mục backend theo kiến trúc đã thiết kế.

### Công việc cần thực hiện

1. Tạo thư mục `backend/src/controllers/`.
2. Tạo thư mục `backend/src/routes/`.
3. Tạo thư mục `backend/src/middleware/`.
4. Tạo thư mục `backend/src/models/`.
5. Tạo thư mục `backend/src/services/`.
6. Tạo thư mục `backend/src/utils/`.
7. Tạo file `backend/src/utils/index.js` (optional barrel export).

### File cần tạo

- Cấu trúc thư mục backend

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Project Setup

### Database liên quan

Không.

### Frontend liên quan

Không.

### Kết quả mong đợi

Thư mục backend/ hoàn chỉnh khớp với kiến trúc trong architecture.md.

### Acceptance Criteria

1. Tồn tại đủ thư mục: controllers, routes, middleware, models, services, utils.
2. Cấu trúc khớp với kiến trúc.

### Checklist

- [ ] Database
- [ ] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M1-T5 (Frontend)

### Thông tin

- **ID**: M1-T5
- **Tên**: Tạo cấu trúc thư mục Frontend
- **Milestone**: M1
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001–FR-053
- **Module**: Project Setup
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: Không

### Mục tiêu

Tạo cấu trúc thư mục frontend theo kiến trúc đã thiết kế.

### Công việc cần thực hiện

1. Tạo thư mục `frontend/public/` và `frontend/public/uploads/` (images/, audio/).
2. Tạo thư mục `frontend/src/pages/auth/`, `dashboard/`, `learn/`, `quiz/`, `notebook/`, `profile/`, `admin/`.
3. Tạo thư mục `frontend/src/css/` và `frontend/src/css/pages/`, `frontend/src/css/components/`.
4. Tạo thư mục `frontend/src/js/` và `frontend/src/js/pages/`, `frontend/src/js/components/`, `frontend/src/js/utils/`.
5. Tạo thư mục `frontend/src/components/`.
6. Tạo thư mục `frontend/src/services/`.

### File cần tạo

- Cấu trúc thư mục frontend

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Project Setup

### Database liên quan

Không.

### Frontend liên quan

- Toàn bộ cấu trúc Frontend.

### Kết quả mong đợi

Thư mục frontend/ hoàn chỉnh khớp với kiến trúc trong architecture.md.

### Acceptance Criteria

1. Tồn tại đủ thư mục con theo kiến trúc.
2. Thư mục uploads/images/, uploads/audio/ sẵn sàng.

### Checklist

- [ ] Database
- [ ] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M1-T6 (Backend)

### Thông tin

- **ID**: M1-T6
- **Tên**: Tạo Shared Utilities - Response Format
- **Milestone**: M1
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001–FR-053
- **Module**: Utils
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M1-T1

### Mục tiêu

Tạo hàm format response chuẩn JSON thống nhất cho toàn bộ API.

### Công việc cần thực hiện

1. Sửa file `backend/src/utils/response.js`.
2. Hàm `successResponse(res, data, message = 'Success', statusCode = 200)`: Format `{ success: true, message, data }`.
3. Hàm `errorResponse(res, message = 'Error', statusCode = 500)`: Format `{ success: false, message }`.
4. Hàm `createdResponse(res, data, message = 'Created')`: Status 201.

### File cần tạo

Không.

### File cần chỉnh sửa

- `backend/src/utils/response.js`

### Checklist

- [ ] Database
- [ ] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M1-T7 (Backend)

### Thông tin

- **ID**: M1-T7
- **Tên**: Tạo Shared Utilities - Logger
- **Milestone**: M1
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001–FR-053
- **Module**: Utils
- **Priority**: P1
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M1-T1

### Mục tiêu

Tạo logger với các mức log: INFO, WARN, ERROR, format timestamp.

### Công việc cần thực hiện

1. Tạo file `backend/src/utils/logger.js`.
2. Định nghĩa log levels: INFO, WARN, ERROR.
3. Hàm `info(message, context = {})`, `warn(message, context = {})`, `error(message, context = {})`.
4. Mỗi log entry format: `[timestamp] [LEVEL] message {context}`.
5. Development: log ra console. Production: log ra file.

### File cần tạo

- `backend/src/utils/logger.js`

### File cần chỉnh sửa

Không.

### Checklist

- [ ] Database
- [ ] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M1-T8 (Frontend)

### Thông tin

- **ID**: M1-T8
- **Tên**: Cấu hình Frontend Base - API Client
- **Milestone**: M1
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001–FR-053
- **Module**: Project Setup

- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M1-T5

### Mục tiêu

Tạo HTTP client wrapper sử dụng fetch(), tự động gắn JWT token, xử lý response/error.

### Công việc cần thực hiện

1. Tạo file `frontend/src/services/api.js`.
2. Định nghĩa BASE_URL (mặc định `http://localhost:5000/api`).
3. Hàm `request(endpoint, options = {})`: lấy token từ localStorage, gắn Authorization header, gọi fetch, parse JSON, xử lý lỗi HTTP.
4. Các wrapper: `get()`, `post()`, `put()`, `patch()`, `del()`.

### File cần tạo

- `frontend/src/services/api.js`

### File cần chỉnh sửa

Không.

### Checklist

- [ ] Database
- [ ] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M1-T9 (Frontend)

### Thông tin

- **ID**: M1-T9
- **Tên**: Tạo authService Frontend
- **Milestone**: M1
- **User Story**: US-01, US-02
- **Functional Requirement**: FR-001, FR-002, FR-003, FR-006
- **Module**: Authentication
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M1-T8

### Mục tiêu

Tạo service quản lý authentication phía Frontend.

### Công việc cần thực hiện

1. Tạo file `frontend/src/services/authService.js`.
2. Hàm `login(email, password)`: gọi api.post('/auth/login', ...), lưu token + user info vào localStorage.
3. Hàm `register(username, fullname, email, password)`: gọi api.post('/auth/register', ...), lưu token + user info. 
confirmPassword chỉ dùng để validate trên Frontend, không truyền lên API.
4. Hàm `logout()`, `getToken()`, `setToken(token)`, `removeToken()`, `isAuthenticated()`, `getCurrentUser()`.

### File cần tạo

- `frontend/src/services/authService.js`

### File cần chỉnh sửa

Không.

### Checklist

- [ ] Database
- [ ] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

# Milestone 2: Authentication & Profile

## Task M2-T1 (Backend)

### Thông tin

- **ID**: M2-T1
- **Tên**: Tạo Model User
- **Milestone**: M2
- **User Story**: US-01, US-02, US-09
- **Functional Requirement**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007
- **Module**: Authentication
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T2

### Mục tiêu

Tạo User Model với các hàm CRUD cơ bản sử dụng Prepared Statements.

### Công việc cần thực hiện

1. Tạo file `backend/src/models/userModel.js`.
2. Import pool từ `config/db.js`.
3. Hàm `findByEmail(email)`, `findById(id)`, `create({ username, email, password, fullname })`, `updatePassword(id, newPasswordHash)`, `updateProfile(id, { fullname, avatar })`, `updateRoadmap(id, roadmapId)`, `updateStreak(id, streak, lastStudyDate)`.
4. Tất cả hàm sử dụng Prepared Statements, trả về Promise.

### File cần tạo

- `backend/src/models/userModel.js`

### File cần chỉnh sửa

Không.

---

## Task M2-T2 (Backend)

### Thông tin

- **ID**: M2-T2
- **Tên**: API Đăng ký (Register)
- **Milestone**: M2
- **User Story**: US-01
- **Functional Requirement**: FR-001, FR-007
- **Module**: Authentication
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M2-T1

### Mục tiêu

Tạo route POST /api/auth/register + controller. Validate input, hash password, tạo user, trả về JWT.

### Công việc cần thực hiện

1. Tạo file `backend/src/controllers/authController.js`.
2. Tạo file `backend/src/routes/authRoutes.js`.
3. Controller.auth.register: 
Validate:
- username bắt buộc
- fullname bắt buộc
- email đúng định dạng
- password >= 8
- username chưa tồn tại
- email chưa tồn tại
- Hash password bằng bcrypt.
- Tạo user (username, fullname, email, password, role='user', streak=0).
- Tạo JWT token.
- Format response theo spec 7.1.
Lưu ý:
confirmPassword không xử lý ở Backend.

4. Route: POST /api/auth/register → authController.register.

### File cần tạo

- `backend/src/controllers/authController.js`
- `backend/src/routes/authRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount authRoutes)

---

## Task M2-T3 (Backend)

### Thông tin

- **ID**: M2-T3
- **Tên**: API Đăng nhập (Login)
- **Milestone**: M2
- **User Story**: US-02
- **Functional Requirement**: FR-002, FR-003
- **Module**: Authentication
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M2-T1

### Mục tiêu

Tạo route POST /api/auth/login + controller. Kiểm tra email, so sánh password, tạo JWT.

### Công việc cần thực hiện

1. Trong authController, thêm hàm `login`.
2. Lấy email, password. Gọi userModel.findByEmail. Nếu không tìm thấy → 401. So sánh password bcrypt → sai → 401. Tạo JWT (HS256, 24h). Trả về { token, user: { id, email, role, roadmap_id, streak } }.
3. Format response theo spec 7.2.

### File cần chỉnh sửa

- `backend/src/controllers/authController.js`
- `backend/src/routes/authRoutes.js`

---

## Task M2-T4 (Backend)

### Thông tin

- **ID**: M2-T4
- **Tên**: Tạo authMiddleware
- **Milestone**: M2
- **User Story**: US-01, US-02
- **Functional Requirement**: FR-003, FR-004
- **Module**: Authentication
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M2-T3

### Mục tiêu

Tạo middleware xác thực JWT.

### Công việc cần thực hiện

1. Tạo file `backend/src/middleware/authMiddleware.js`.
2. Lấy token từ header `Authorization: Bearer <token>`. Không có token → 401. Verify JWT_SECRET. Hết hạn/không hợp lệ → 401. Giải mã, gắn `req.user = { id, email, role }`. Gọi next().

### File cần tạo

- `backend/src/middleware/authMiddleware.js`

### File cần chỉnh sửa

Không.

---

## Task M2-T5 (Backend)

### Thông tin

- **ID**: M2-T5
- **Tên**: Tạo adminMiddleware
- **Milestone**: M2
- **User Story**: US-07
- **Functional Requirement**: FR-004
- **Module**: Authentication
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M2-T4

### Mục tiêu

Tạo middleware kiểm tra role admin.

### Công việc cần thực hiện

1. Tạo file `backend/src/middleware/adminMiddleware.js`.
2. Kiểm tra `req.user.role === 'admin'`. Không phải admin → 403. Admin → next().

### File cần tạo

- `backend/src/middleware/adminMiddleware.js`

### File cần chỉnh sửa

Không.

---

## Task M2-T6 (Backend)

### Thông tin

- **ID**: M2-T6
- **Tên**: API Đổi mật khẩu
- **Milestone**: M2
- **User Story**: US-09
- **Functional Requirement**: FR-005
- **Module**: Authentication
- **Priority**: P1
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M2-T4

### Mục tiêu

Tạo route PUT /api/auth/change-password + controller (yêu cầu authMiddleware).

### Công việc cần thực hiện

1. Trong authController, thêm hàm `changePassword`.
2. Lấy oldPassword, newPassword từ req.body. Kiểm tra oldPassword (bcrypt.compare). Nếu sai → 400. Validate newPassword >= 8. Hash newPassword. Gọi userModel.updatePassword.

### File cần chỉnh sửa

- `backend/src/controllers/authController.js`
- `backend/src/routes/authRoutes.js`

---

## Task M2-T7 (Backend)

### Thông tin

- **ID**: M2-T7
- **Tên**: API Xem thông tin cá nhân
- **Milestone**: M2
- **User Story**: US-09
- **Functional Requirement**: FR-005
- **Module**: User
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M2-T4, M2-T1

### Mục tiêu

Tạo route GET /api/profile + controller (yêu cầu authMiddleware).

### Công việc cần thực hiện

1. Tạo file `backend/src/controllers/userController.js`.
2. Tạo file `backend/src/routes/userRoutes.js`.
3. Hàm `getProfile`: lấy req.user.id, gọi userModel.findById, trả về id, email, fullname, avatar, role, roadmap_id, streak, last_study_date.
4. Route: GET /api/profile → authMiddleware → userController.getProfile.

### File cần tạo

- `backend/src/controllers/userController.js`
- `backend/src/routes/userRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount userRoutes)

---

## Task M2-T8 (Backend)

### Thông tin

- **ID**: M2-T8
- **Tên**: API Cập nhật thông tin cá nhân
- **Milestone**: M2
- **User Story**: US-09
- **Functional Requirement**: FR-005
- **Module**: User
- **Priority**: P1
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M2-T4, M2-T1

### Mục tiêu

Tạo route PUT /api/profile + controller (yêu cầu authMiddleware). Cập nhật fullname.

### Công việc cần thực hiện

1. Trong userController, thêm hàm `updateProfile`.
2. Validate fullname không rỗng. Gọi userModel.updateProfile.

### File cần chỉnh sửa

- `backend/src/controllers/userController.js`
- `backend/src/routes/userRoutes.js`

---

## Task M2-T9 (Backend)

### Thông tin

- **ID**: M2-T9
- **Tên**: API Chọn/Đổi Lộ trình
- **Milestone**: M2
- **User Story**: US-09
- **Functional Requirement**: FR-010
- **Module**: User
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M2-T4, M2-T1, M3-T0

### Mục tiêu

Tạo route PUT /api/profile/roadmap + controller (yêu cầu authMiddleware).

### Công việc cần thực hiện

1. Trong userController, thêm hàm `updateRoadmap`.
2. Validate roadmap_id là integer > 0. Kiểm tra roadmap tồn tại → 404 nếu không. Gọi userModel.updateRoadmap. Format response theo spec 7.3.

### File cần chỉnh sửa

- `backend/src/controllers/userController.js`
- `backend/src/routes/userRoutes.js`

---

## Task M2-T10 (Frontend)

### Thông tin

- **ID**: M2-T10
- **Tên**: Trang Đăng nhập (Frontend)
- **Milestone**: M2
- **User Story**: US-02
- **Functional Requirement**: FR-002, FR-003, FR-007
- **Module**: Authentication
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T8, M1-T9, M2-T3

### Mục tiêu

Tạo trang đăng nhập với form email, password, gọi API login, lưu JWT, redirect phù hợp.

### Công việc cần thực hiện

1. Tạo file `frontend/src/pages/auth/login.html`: form email, password, nút submit, link đăng ký, Tailwind CSS.
2. Tạo file `frontend/src/js/pages/login.js`: validate (email format, password không rỗng), gọi authService.login, redirect (onboarding nếu roadmap_id null, dashboard nếu có).

### File cần tạo

- `frontend/src/pages/auth/login.html`
- `frontend/src/js/pages/login.js`

### File cần chỉnh sửa

Không.

---

## Task M2-T11 (Frontend)

### Thông tin

- **ID**: M2-T11
- **Tên**: Trang Đăng ký (Frontend)
- **Milestone**: M2
- **User Story**: US-01
- **Functional Requirement**: FR-001, FR-007
- **Module**: Authentication
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T8, M1-T9, M2-T2

### Mục tiêu

Tạo trang đăng ký với form fullname, username, email, password, confirm password, gọi API register, lưu JWT.

### Công việc cần thực hiện

1. Tạo file frontend/src/pages/auth/register.html:
   form fullname, username, email, password, confirm password,
   nút submit, link login, Tailwind CSS.

2. Tạo file frontend/src/js/pages/register.js:
   validate:
   - fullname không được để trống
   - username không được để trống
   - email đúng định dạng
   - password >= 8 ký tự
   - confirm password phải trùng password

   Gọi authService.register(username, fullname, email, password),
   redirect onboarding.

### File cần tạo

- `frontend/src/pages/auth/register.html`
- `frontend/src/js/pages/register.js`

### File cần chỉnh sửa

Không.

---

## Task M2-T12 (Frontend)

### Thông tin

- **ID**: M2-T12
- **Tên**: Trang Profile (Frontend)
- **Milestone**: M2
- **User Story**: US-09
- **Functional Requirement**: FR-005, FR-006, FR-010
- **Module**: User
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T8, M1-T9, M2-T7, M2-T8, M2-T9

### Mục tiêu

Tạo trang Profile hiển thị thông tin cá nhân, form đổi mật khẩu, nút đăng xuất, chức năng đổi lộ trình.

### Công việc cần thực hiện

1. Tạo file `frontend/src/pages/profile/profile.html`: header với avatar + tên, section thông tin cá nhân, section đổi mật khẩu, section lộ trình học tập, nút đăng xuất, bottom navigation, Tailwind CSS.
2. Tạo file `frontend/src/js/pages/profile.js`: gọi GET /api/profile, GET /api/roadmaps, xử lý submit đổi mật khẩu, xử lý đổi roadmap, xử lý đăng xuất.

### File cần tạo

- `frontend/src/pages/profile/profile.html`
- `frontend/src/js/pages/profile.js`

### File cần chỉnh sửa

Không.

---

# Milestone 3: Roadmap, Topic & Vocabulary

## Task M3-T0 (Backend)

### Thông tin

- **ID**: M3-T0
- **Tên**: Tạo Roadmap Model
- **Milestone**: M3
- **User Story**: US-03, US-09
- **Functional Requirement**: FR-008, FR-009, FR-010
- **Module**: Roadmap
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M1-T2

### Mục tiêu

Tạo Roadmap Model với các hàm truy cập dữ liệu Roadmap sử dụng Prepared Statements để phục vụ các API Roadmap và User.

### Công việc cần thực hiện

1. Tạo file `backend/src/models/roadmapModel.js`.
2. Import pool từ `config/db.js`.
3. Tạo hàm `findAllActive()`:
   - Lấy tất cả roadmap có `is_active = 1`.
   - Sắp xếp theo `sort_order ASC`.
4. Tạo hàm `findById(id)`:
   - Tìm roadmap theo `id`.
   - Trả về `null` nếu không tồn tại.
5. Tất cả các hàm sử dụng Prepared Statements (`pool.execute`) và trả về Promise.

### File cần tạo

- `backend/src/models/roadmapModel.js`

### File cần chỉnh sửa

Không.

### Checklist

- [ ] Database
- [ ] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

## Task M3-T1 (Backend)

### Thông tin

- **ID**: M3-T1
- **Tên**: API Lấy danh sách Roadmap
- **Milestone**: M3
- **User Story**: US-03, US-09
- **Functional Requirement**: FR-008, FR-009
- **Module**: Roadmap
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M1-T2,  M3-T0

### Mục tiêu

Tạo route GET /api/roadmaps trả về danh sách roadmap active, sắp xếp theo sort_order. Public, không yêu cầu auth.

### Công việc cần thực hiện

1. Tạo file `backend/src/controllers/roadmapController.js` và `backend/src/routes/roadmapRoutes.js`.
2. Hàm `getAll`: SELECT WHERE is_active = 1 ORDER BY sort_order ASC.

### File cần tạo

- `backend/src/controllers/roadmapController.js`
- `backend/src/routes/roadmapRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount roadmapRoutes)

---

## Task M3-T2 (Backend)

### Thông tin

- **ID**: M3-T2
- **Tên**: API Lấy chi tiết Roadmap
- **Milestone**: M3
- **User Story**: US-03
- **Functional Requirement**: FR-008
- **Module**: Roadmap
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M3-T1

### Mục tiêu

Tạo route GET /api/roadmaps/:id trả về chi tiết roadmap. Không tìm thấy → 404.

### File cần chỉnh sửa

- `backend/src/controllers/roadmapController.js`
- `backend/src/routes/roadmapRoutes.js`

### Bỏ qua task này vì chưa có trang xem chi tiết roadmap (tính năng admin - làm sau)
---

## Task M3-T3 (Backend)

### Thông tin

- **ID**: M3-T3
- **Tên**: API Lấy danh sách Topic
- **Milestone**: M3
- **User Story**: US-03
- **Functional Requirement**: FR-009
- **Module**: Topic
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M1-T2, M2-T4

### Mục tiêu

Tạo route GET /api/topics?roadmap_id=x + controller. Yêu cầu auth.

### Công việc cần thực hiện

1. Tạo `backend/src/models/topicModel.js`, `backend/src/controllers/topicController.js`, `backend/src/routes/topicRoutes.js`.
2. Hàm `getByRoadmapId(roadmapId)`: SELECT WHERE is_active = 1 ORDER BY sort_order.

### File cần tạo

- `backend/src/models/topicModel.js`
- `backend/src/controllers/topicController.js`
- `backend/src/routes/topicRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount topicRoutes)

---

## Task M3-T4 (Backend)

### Thông tin

- **ID**: M3-T4
- **Tên**: API Lấy chi tiết Topic
- **Milestone**: M3
- **User Story**: US-03
- **Functional Requirement**: FR-009
- **Module**: Topic
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M3-T3

### File cần chỉnh sửa

- `backend/src/controllers/topicController.js`
- `backend/src/routes/topicRoutes.js`

### Bỏ qua task này vì chưa có trang xem chi tiết topic (tính năng admin - làm sau)

---

## Task M3-T5 (Backend)

### Thông tin

- **ID**: M3-T5
- **Tên**: API Lấy danh sách Vocabulary
- **Milestone**: M3
- **User Story**: US-03
- **Functional Requirement**: FR-013
- **Module**: Vocabulary
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M1-T2, M2-T4

### Mục tiêu

Tạo route GET /api/vocabularies?topic_id=x + controller. Yêu cầu auth.

### Công việc cần thực hiện

1. Tạo `backend/src/models/vocabularyModel.js`, `backend/src/controllers/vocabularyController.js`, `backend/src/routes/vocabularyRoutes.js`.
2. Hàm `getByTopicId(topicId)`: SELECT id, word, pronunciation, audio, image, part_of_speech, meaning, example, example_meaning.

### File cần tạo

- `backend/src/models/vocabularyModel.js`
- `backend/src/controllers/vocabularyController.js`
- `backend/src/routes/vocabularyRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount vocabularyRoutes)

---

## Task M3-T6 (Backend)

### Thông tin

- **ID**: M3-T6
- **Tên**: API Lấy chi tiết Vocabulary
- **Milestone**: M3
- **User Story**: US-03
- **Functional Requirement**: FR-013
- **Module**: Vocabulary
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M3-T5

### File cần chỉnh sửa

- `backend/src/controllers/vocabularyController.js`
- `backend/src/routes/vocabularyRoutes.js`

### Bỏ qua task này vì chưa có trang xem chi tiết vocab
---

## Task M3-T7 (Database/Data)

### Thông tin

- **ID**: M3-T7
- **Tên**: Seed Data
- **Milestone**: M3
- **User Story**: US-03
- **Functional Requirement**: FR-008, FR-009, FR-013
- **Module**: Database
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T3

### Mục tiêu

Tạo script seed dữ liệu mẫu: 3 roadmaps, 9 topics, 45 vocabularies.

### Công việc cần thực hiện

1. Tạo file `database/seed.sql`.
2. INSERT 3 roadmaps: "1000 từ cơ bản", "TOEIC", "IELS".
3. INSERT 3 topics cho mỗi roadmap, 5 vocabularies cho mỗi topic.

### File cần tạo

- `database/seed.sql` 

### File cần chỉnh sửa

Không.

---

## Task M3-T8 (Frontend)

### Thông tin

- **ID**: M3-T8
- **Tên**: Trang Onboarding (Chọn Lộ trình)
- **Milestone**: M3
- **User Story**: US-01, US-09
- **Functional Requirement**: FR-008, FR-009
- **Module**: Onboarding
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T8, M1-T9, M3-T1, M3-T3, M2-T9

### Mục tiêu

Tạo trang onboarding cho người dùng mới chọn lộ trình lần đầu.

### Công việc cần thực hiện

1. Tạo file   `frontend/src/pages/dashboard/onboarding.html`: hiển thị danh sách Roadmap dưới dạng card. Khi người dùng chọn một Roadmap, lưu lựa chọn và chuyển đến dashboard.html.
2. Tạo file `frontend/src/js/pages/onboarding.js`: gọi GET /api/roadmaps để lấy danh sách Roadmap, gọi PUT /api/profile/roadmap để lưu Roadmap người dùng đã chọn, sau khi thành công chuyển hướng đến dashboard.html.

### File cần tạo

- `frontend/src/pages/dashboard/onboarding.html`
- `frontend/src/js/pages/onboarding.js`
- `frontend/src/css/pages/onboarding.css`
-

### File cần chỉnh sửa

Không.

---

## Task M3-T9 (Frontend)

### Thông tin

- **ID**: M3-T9
- **Tên**: Trang Dashboard - HTML & CSS
- **Milestone**: M3
- **User Story**: US-03, US-04, US-05
- **Functional Requirement**: FR-009, FR-011, FR-033, FR-052
- **Module**: Dashboard
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M3-T8

### Mục tiêu

Tạo giao diện Dashboard hiển thị danh sách Topic thuộc Roadmap mà người dùng đã chọn.

### Công việc cần thực hiện

1. Tạo file `frontend/src/pages/dashboard/dashboard.html`: 
- Chỉ tạo phần main content của Dashboard.
- Header và Bottom Navigation không viết trực tiếp, sẽ được load từ Components dùng chung.
- Tạo khu vực hiển thị danh sách Topic dưới dạng card/grid.
- Mỗi Topic hiển thị: Tên Topic, Mô tả ngắn (nếu có), Ảnh minh họa (nếu có).
- Khi người dùng click vào một Topic sẽ chuyển đến learn.html (logic sẽ được thực hiện ở task JavaScript tiếp theo).
- Có placeholder cho AI Chat theo thiết kế của dự án.
- Sử dụng Tailwind CSS và màu chủ đạo của dự án.
2. Tạo file `frontend/src/css/pages/dashboard.css`: 
- Chỉ chứa các style riêng của Dashboard.
- Không chứa style của Header và Bottom Navigation.
- Phối hợp với Tailwind CSS.

### File cần tạo

- `frontend/src/pages/dashboard/dashboard.html`
- `frontend/src/css/pages/dashboard.css`

### File cần chỉnh sửa

Không.

---

## Task M3-T10 (Frontend)

### Thông tin

- **ID**: M3-T10
- **Tên**: Trang Dashboard - JavaScript
- **Milestone**: M3
- **User Story**: US-03, US-04, US-05
- **Functional Requirement**: FR-009, FR-011, FR-033, FR-052
- **Module**: Dashboard
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M3-T9

### Mục tiêu

Tạo JavaScript cho Dashboard: gọi API, hiển thị dữ liệu.

### Công việc cần thực hiện

1. Tạo file `frontend/src/js/pages/dashboard.js`: kiểm tra auth, gọi GET /api/profile để lấy roadmap_id, gọi GET /api/topics?roadmap_id={id}. Render danh sách topic cards. Bottom navigation highlight tab "Trang chủ".
2. Handle lỗi: toast notification.

### File cần tạo

- `frontend/src/js/pages/dashboard.js`

### File cần chỉnh sửa

Không.

---

## Task M3-T11 (Frontend)

### Thông tin

- **ID**: M3-T11
- **Tên**: Components dùng chung - Header & Bottom Nav
- **Milestone**: M3
- **User Story**: US-03, US-04, US-05
- **Functional Requirement**: FR-009, FR-011, FR-052
- **Module**: Dashboard
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M3-T10

### Mục tiêu

Tạo các component dùng chung: header, bottom-nav.

### Công việc cần thực hiện

1. Tạo `frontend/src/components/header.html`: HTML snippet (logo, avatar, streak).
2. Tạo `frontend/src/components/bottom-nav.html`: HTML snippet (Trang chủ, Ôn tập, Sổ tay).
3. Tạo `frontend/src/js/components/nav.js`: JS load header, bottom-nav vào các trang.
4. Cập nhật dashboard.html để include các component.

### File cần tạo

- `frontend/src/components/header.html`
- `frontend/src/components/bottom-nav.html`
- `frontend/src/js/components/nav.js`

### File cần chỉnh sửa

- `frontend/src/pages/dashboard/dashboard.html`

---

# Milestone 4: Learning - Flashcard & Writing Exercise

## Task M4-T1 (Backend)

### Thông tin

- **ID**: M4-T1
- **Tên**: Tạo UserVocabulary Model
- **Milestone**: M4
- **User Story**: US-03
- **Functional Requirement**: FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-019, FR-020
- **Module**: Study Session
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T2, M1-T3

### Mục tiêu

Tạo model thao tác với bảng `user_vocabularies`, cung cấp các hàm truy vấn và cập nhật dữ liệu phục vụ chức năng học tập. Model chỉ chịu trách nhiệm thao tác cơ sở dữ liệu, không chứa business logic.

### Công việc cần thực hiện

1. Tạo file `backend/src/models/userVocabularyModel.js`.
2. Cài đặt hàm `findByUserAndVocab(userId, vocabularyId)`:
   - Trả về bản ghi trong bảng `user_vocabularies` theo `user_id` và `vocabulary_id`.
3. Cài đặt hàm `upsert(userId, vocabularyId, data)`:
   - Sử dụng `INSERT ... ON DUPLICATE KEY UPDATE` để tạo mới hoặc cập nhật bản ghi.
4. Cài đặt hàm `getByUserAndStatus(userId, status)`:
   - Trả về danh sách từ vựng của người dùng theo trạng thái (`new`, `learning`, `mastered`).
5. Cài đặt hàm `updateStudySession(userId, vocabularyId, data)`:
   - Cập nhật các trường `status`, `review_count`, `next_review_at`, `last_reviewed_at`.
6. Sử dụng `mysql2/promise` theo chuẩn của dự án.
7. Không triển khai business logic (Spaced Repetition, tính `next_review_at`, tăng/reset `review_count`) trong model.

### File cần tạo

- `backend/src/models/userVocabularyModel.js`

### File cần chỉnh sửa

Không.

---

## Task M4-T2 (Backend)

### Thông tin

- **ID**: M4-T2
- **Tên**: API Khởi tạo dữ liệu học
- **Milestone**: M4
- **User Story**: US-03
- **Functional Requirement**: FR-013
- **Module**: Study Session
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M2-T4, M3-T5

### Mục tiêu

Tạo API `POST /api/learning/start` để khởi tạo dữ liệu cho phiên học. Backend nhận `topic_id` từ request, kiểm tra người dùng và topic hợp lệ, sau đó trả về thông tin topic cùng danh sách từ vựng để frontend bắt đầu học.
### Công việc cần thực hiện

1. Tạo route `POST /api/learning/start`.
2. Kiểm tra người dùng đã đăng nhập.
3. Validate `topic_id`.
4. Kiểm tra topic có tồn tại và thuộc roadmap hiện tại của người dùng.
5. Lấy danh sách từ vựng của topic.
6. Trả về thông tin topic và danh sách từ vựng để frontend hiển thị Flashcard.
7. Không lưu hoặc tạo `study_session` trong cơ sở dữ liệu.

### File cần chỉnh sửa

- `backend/src/controllers/vocabularyController.js`
- `backend/src/routes/vocabularyRoutes.js`

---

## Task M4-T6 (Backend)

### Thông tin

- **ID**: M4-T6
- **Tên**: Service Tính toán SRS
- **Milestone**: M4
- **User Story**: US-03
- **Functional Requirement**: FR-018, FR-024, FR-025
- **Module**: Study Session
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M4-T1

### Mục tiêu

Tạo service/hàm calculateNextReview (SM-2 đơn giản hóa).
Tạo `srsService` để xử lý toàn bộ logic Spaced Repetition (SM-2 đơn giản hóa), bao gồm tính thời điểm ôn tập tiếp theo và cập nhật thông tin sau khi người dùng trả lời đúng hoặc sai.

### Công việc cần thực hiện

1. Tạo file `backend/src/services/srsService.js`.
2. `calculateNextReview(reviewCount)`: 0→1d, 1→3d, 2→7d, 3→14d, 4+→30d.
3. Cài đặt hàm `handleCorrectAnswer(reviewCount)`:
   - Tăng `reviewCount`.
   - Tính `nextReviewAt`.
   - Trả về:
     - `reviewCount`
     - `nextReviewAt`
4. Cài đặt hàm `handleWrongAnswer()`:
   - Reset `reviewCount = 0`.
   - Đặt `nextReviewAt = NOW()`.
   - Trả về:
     - `reviewCount`
     - `nextReviewAt`
5. Service chỉ xử lý tính toán SRS, không thao tác trực tiếp với cơ sở dữ liệu.

### File cần tạo

- `backend/src/services/srsService.js`

---

## Task M4-T3 (Backend)

### Thông tin

- **ID**: M4-T3
- **Tên**: API Đã thuộc (Mastered)
- **Milestone**: M4
- **User Story**: US-03
- **Functional Requirement**: FR-015, FR-016
- **Module**: Study Session
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M4-T1, M4-T2, M4-T6

### Mục tiêu
Tạo API `POST /api/learning/mastered` để xử lý khi người dùng đánh dấu một từ vựng là "Đã thuộc". API cập nhật trạng thái học tập thông qua `userVocabularyModel` và `srsService`, sau đó trả kết quả cho frontend.
<!-- >> Tạo API `POST /api/learning/mastered` để xử lý khi người dùng đánh dấu một từ là "Đã thuộc". API cập nhật trạng thái học tập của từ trong `user_vocabularies`. -->

### Công việc cần thực hiện

1. Tạo route `POST /api/learning/mastered`.
2. Kiểm tra người dùng đã đăng nhập.
3. Validate `vocabulary_id`.
4. Kiểm tra từ vựng tồn tại.
5. Lấy trạng thái học tập hiện tại của từ.
6. Gọi `srsService.handleCorrectAnswer()` để tính `reviewCount` và `nextReviewAt`.
7. Cập nhật `user_vocabularies`:
   - `status = 'mastered'`
   - `review_count`
   - `next_review_at`
   - `last_reviewed_at`
8. Trả kết quả cập nhật cho frontend.


### File cần chỉnh sửa

- `backend/src/controllers/vocabularyController.js`
- `backend/src/routes/vocabularyRoutes.js`

---

## Task M4-T4 (Backend)

### Thông tin

- **ID**: M4-T4
- **Tên**: API Chuyển tiếp (Writing Prompt)
- **Milestone**: M4
- **User Story**: US-03
- **Functional Requirement**: FR-015, FR-017
- **Module**: Study Session
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M4-T2

### Mục tiêu

Tạo API `POST /api/learning/writing` để chuyển từ Flashcard sang Writing Exercise. API trả về dữ liệu cần thiết để frontend hiển thị bài luyện viết của từ vựng hiện tại.

### Công việc cần thực hiện

1. Tạo route `POST /api/learning/writing`.
2. Kiểm tra người dùng đã đăng nhập.
3. Validate `vocabulary_id`.
4. Kiểm tra từ vựng tồn tại.
5. Lấy dữ liệu của từ vựng.
6. Trả về dữ liệu cần thiết cho Writing Exercise:
   - `word`
   - `meaning`
   - `example`
   - `example_meaning`
7. Không cập nhật dữ liệu học tập trong `user_vocabularies`.

### File cần chỉnh sửa

- `backend/src/controllers/vocabularyController.js`
- `backend/src/routes/vocabularyRoutes.js`

---

## Task M4-T5 (Backend)

### Thông tin

- **ID**: M4-T5
- **Tên**: API Nộp bài Luyện viết
- **Milestone**: M4
- **User Story**: US-03
- **Functional Requirement**: FR-018
- **Module**: Study Session
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M4-T1, M4-T2, M4-T6

### Mục tiêu

Tạo API `POST /api/learning/writing/submit` để xử lý kết quả bài luyện viết của người dùng. API kiểm tra đáp án, cập nhật trạng thái học tập của từ vựng trong `user_vocabularies`, tính lịch ôn tập tiếp theo theo thuật toán SRS và cập nhật streak của người dùng.

### Công việc cần thực hiện

1. Tạo route `POST /api/learning/writing/submit`.
2. Kiểm tra người dùng đã đăng nhập.
3. Validate:
   - `vocabulary_id`
   - `answer`
4. Kiểm tra từ vựng tồn tại.
5. So sánh đáp án của người dùng với từ vựng gốc để xác định kết quả bài luyện viết.
6. Gọi `srsService` để tính:
   - `review_count`
   - `next_review_at`
7. UPSERT `user_vocabularies`:
   - `status = 'learning'`
   - `review_count`
   - `next_review_at`
   - `last_reviewed_at`
8. Cập nhật streak của người dùng.
9. Trả kết quả cho frontend.

### File cần chỉnh sửa

- `backend/src/controllers/vocabularyController.js`
- `backend/src/routes/vocabularyRoutes.js`

---

## Task M4-T7 (Frontend)

### Thông tin

- **ID**: M4-T7
- **Tên**: Trang Học Flashcard - HTML & CSS
- **Milestone**: M4
- **User Story**: US-03
- **Functional Requirement**: FR-013, FR-014
- **Module**: Learning
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T8, M1-T9

### Mục tiêu

Tạo giao diện HTML và CSS cho trang học Flashcard, bao gồm cấu trúc hiển thị Flashcard, hiệu ứng lật thẻ và các thành phần giao diện phục vụ phiên học.

### Công việc cần thực hiện

1. Tạo `frontend/src/pages/learn/learn.html` gồm:
   - Header.
   - Flashcard container:
     - Mặt trước:
       - `word`
       - `pronunciation`
       - `audio`
       - `image`
     - Mặt sau:
       - `part_of_speech`
       - `meaning`
       - `example`
       - `example_meaning`
   - Nút **"Đã thuộc"** (Emerald-500).
   - Nút **"Tiếp tục"** (Amber-500).
   - Progress Bar.
   - Writing Exercise container (placeholder, mặc định ẩn).
   - Bottom Navigation.
   - Tích hợp component AI Chat (Floating Chat Widget).

2. Tạo `frontend/src/css/pages/learn.css`:
   - Layout responsive.
   - Hiệu ứng lật thẻ 3D.
   - Style cho Flashcard.
   - Style cho Progress Bar.
   - Style cho Writing Exercise placeholder.

### File cần tạo

- `frontend/src/pages/learn/learn.html`
- `frontend/src/css/pages/learn.css`

### File cần chỉnh sửa

Không.

---

## Task M4-T8 (Frontend)

### Thông tin

- **ID**: M4-T8
- **Tên**: Trang Học Flashcard - JavaScript
- **Milestone**: M4
- **User Story**: US-03
- **Functional Requirement**: FR-013, FR-014, FR-015, FR-016, FR-017
- **Module**: Learning
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M4-T7, M4-T2, M4-T3, M4-T4

### Mục tiêu

Xây dựng logic JavaScript cho trang học Flashcard, bao gồm tải dữ liệu từ vựng theo topic, hiển thị dữ liệu từ vựng, xử lý các thao tác học và điều hướng sang Writing Exercise.

### Công việc cần thực hiện

1. Tạo `frontend/src/js/pages/learn.js`.
2. Lấy `topic_id` để xác định topic cần học.
3. Gọi `POST /api/learning/start` để lấy danh sách từ vựng của topic.
4. Hiển thị Flashcard đầu tiên và Progress Bar..
5. Cập nhật Progress Bar theo tiến độ học.
6. Xử lý hiệu ứng lật Flashcard.
7. Xử lý nút **"Đã thuộc"**:
   - Gọi `POST /api/learning/mastered`.
   - Chuyển sang từ tiếp theo.
8. Xử lý nút **"Tiếp tục"**:
   - Gọi `POST /api/learning/writing`.
   - Hiển thị Writing Exercise.

### File cần tạo

- `frontend/src/js/pages/learn.js`

### File cần chỉnh sửa

Không.

---

## Task M4-T9 (Frontend)

### Thông tin

- **ID**: M4-T9
- **Tên**: Writing Exercise & Summary & Keyboard Shortcuts
- **Milestone**: M4
- **User Story**: US-03
- **Functional Requirement**: FR-017, FR-018, FR-019, FR-020
- **Module**: Learning
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M4-T8, M4-T5, M4-T6

### Mục tiêu

Hoàn thiện trải nghiệm học trên trang Flashcard, bao gồm Writing Exercise, màn hình tổng kết sau khi hoàn thành topic và hỗ trợ các phím tắt giúp người dùng thao tác nhanh hơn.

### Công việc cần thực hiện

1. Hoàn thiện Writing Exercise:
   - Hiển thị dữ liệu từ API `POST /api/learning/writing`.
   - Hiển thị ô nhập đáp án.
   - Gửi đáp án qua `POST /api/learning/writing/submit`.
   - Hiển thị kết quả trả về từ backend.

2. Hoàn thiện màn hình tổng kết:
   - Hiển thị khi người dùng hoàn thành toàn bộ từ vựng của topic.
   - Hiển thị:
     - Tổng số từ đã học.
     - Số từ đã thuộc.
     - Số từ cần luyện thêm.
   - Thêm nút quay về Dashboard hoặc học lại topic.

3. Bổ sung phím tắt:
   - `Space`: Lật Flashcard.
   - `ArrowRight`: Đã thuộc.
   - `ArrowLeft`: Tiếp tục.
   - `Enter`: Gửi đáp án Writing Exercise.

### File cần chỉnh sửa

- `frontend/src/js/pages/learn.js`

---

## Task M4-T10 (Backend)

### Thông tin

- **ID**: M4-T10
- **Tên**: API User Vocabulary - Danh sách
- **Milestone**: M4
- **User Story**: US-03, US-05
- **Functional Requirement**: FR-028
- **Module**: Vocabulary
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M4-T1, M2-T4

### Mục tiêu

Tạo API `GET /api/user-vocabularies` để lấy danh sách từ vựng  và trạng thái học tập của người dùng. API hỗ trợ lọc theo `topic_id` nhằm phục vụ hiển thị tiến độ học và danh sách từ vựng trên frontend.

### Công việc cần thực hiện

1. Tạo route `GET /api/user-vocabularies`.
2. Kiểm tra người dùng đã đăng nhập.
3. Đọc `topic_id` từ query (optional).
4. Bổ sung các hàm truy vấn trong `userVocabularyModel` (nếu chưa có):
   - Lấy danh sách từ vựng của người dùng.
   - Lấy danh sách từ vựng của người dùng theo `topic_id`.
5. Gọi `userVocabularyModel` để lấy danh sách từ vựng của người dùng.
6. Nếu có `topic_id`, chỉ trả về các từ thuộc topic tương ứng.
7. Trả danh sách từ vựng và trạng thái học tập cho frontend.

### File cần chỉnh sửa

- `backend/src/controllers/vocabularyController.js`
- `backend/src/routes/vocabularyRoutes.js`
- `backend/src/models/userVocabularyModel.js`

---

# Milestone 5: Quiz

## Task M5-T1 (Backend)

### Thông tin

- **ID**: M5-T1
- **Tên**: Tạo Quiz Model
- **Milestone**: M5
- **User Story**: US-04
- **Functional Requirement**: FR-021, FR-022, FR-023, FR-024, FR-025, FR-026, FR-027
- **Module**: Quiz
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T2

### Mục tiêu

Xây dựng Model layer cho Quiz, thao tác với dữ liệu quiz_attempts, quiz_questions và quiz_answers.

### Công việc cần thực hiện

1. Tạo file `backend/src/models/quizModel.js`.
2. Implement các hàm:
- `createAttempt(userId)`
- `createQuestion({ quizAttemptId, vocabularyId, questionType, questionOrder })`
- `getQuestionsByAttemptId(attemptId)`
- `createAnswer({ quizAttemptId, vocabularyId, userAnswer, correctAnswer, isCorrect })`
- `updateAttempt(attemptId, { score, totalQuestions, correctAnswers, duration })`
- `getAttemptById(attemptId)`
- `getAnswersByAttemptId(attemptId)`
- `getIncompleteAttempt(userId)` <!-- số câu hỏi > số câu trả lời -> chưa hoàn thành -->

### File cần tạo

- `backend/src/models/quizModel.js`

---

## Task M5-T2 (Backend)

### Thông tin

* **ID**: M5-T2
* **Tên**: API Bắt đầu Quiz
* **Milestone**: M5
* **User Story**: US-04
* **Functional Requirement**: FR-021, FR-022
* **Module**: Quiz
* **Priority**: P0
* **Complexity**: M
* **Status**: Todo
* **Dependencies**: M5-T1, M4-T1

### Mục tiêu

Tạo API bắt đầu Quiz `POST /api/quiz/start`, chọn các vocabulary cần ôn, sinh tối đa 20 câu hỏi Multiple Choice và lưu các câu hỏi thuộc quiz attempt.

### Công việc cần thực hiện

1. Tạo `backend/src/controllers/quizController.js`, `backend/src/routes/quizRoutes.js`.
2. Implement `startQuiz` với các bước:

   * Lọc vocabulary cần ôn từ `user_vocabularies`.
   * Áp dụng Quiz Generation Rules và chọn tối đa 20 vocabulary.
   * Tạo `quiz_attempt`.
   * Với mỗi vocabulary, tạo một câu hỏi thuộc một trong 3 dạng:

     * `WORD_TO_MEANING`
     * `MEANING_TO_WORD`
     * `FILL_IN_BLANK`
   * Mỗi câu có 4 lựa chọn, gồm 1 đáp án đúng và 3 đáp án sai.
   * Lưu thông tin câu hỏi vào `quiz_questions`.
   * Trả danh sách câu hỏi về Frontend, không trả `correct_answer`.

### File cần tạo

* `backend/src/controllers/quizController.js`
* `backend/src/routes/quizRoutes.js`

### File cần chỉnh sửa

* `backend/src/server.js` (mount `quizRoutes`)

---

## Task M5-T3 (Backend)

### Thông tin

* **ID**: M5-T3
* **Tên**: API Trả lời Quiz
* **Milestone**: M5
* **User Story**: US-04
* **Functional Requirement**: FR-024, FR-025
* **Module**: Quiz
* **Priority**: P0
* **Complexity**: M
* **Status**: Todo
* **Dependencies**: M5-T2, M4-T6

### Mục tiêu

Tạo API nhận câu trả lời của người dùng, kiểm tra đáp án, lưu kết quả vào `quiz_answers` và cập nhật SRS cho vocabulary được review.

### Công việc cần thực hiện

1. Implement endpoint `POST /api/quiz/answer`.
2. Xác định câu hỏi thuộc `quiz_attempt` hiện tại và vocabulary tương ứng.
3. Kiểm tra câu trả lời và xác định `isCorrect`.
4. Lưu câu trả lời vào `quiz_answers`.
5. Gọi logic SRS hiện có để xử lý kết quả:

   * Trả lời đúng: tăng `review_count` và cập nhật `next_review_at` theo SRS.
   * Trả lời sai: không tăng `review_count`, cập nhật SRS theo quy tắc trả lời sai.
6. Trả kết quả đúng/sai về Frontend.

### File cần chỉnh sửa

* `backend/src/controllers/quizController.js`
* `backend/src/routes/quizRoutes.js`

---

## Task M5-T4 (Backend)

### Thông tin

* **ID**: M5-T4
* **Tên**: API Hoàn thành Quiz
* **Milestone**: M5
* **User Story**: US-04
* **Functional Requirement**: FR-026
* **Module**: Quiz
* **Priority**: P0
* **Complexity**: M
* **Status**: Todo
* **Dependencies**: M5-T3

### Mục tiêu

Tạo API hoàn thành Quiz, tính kết quả từ các câu trả lời đã lưu và cập nhật thông tin của `quiz_attempts`.

### Công việc cần thực hiện

1. Implement endpoint `POST /api/quiz/complete`.
2. Xác định `quiz_attempt` cần hoàn thành.
3. Lấy các câu hỏi và câu trả lời thuộc attempt.
4. Tính `score`, `totalQuestions` và `correctAnswers`.
5. Cập nhật `quiz_attempts` với kết quả và `duration`.
6. Trả kết quả Quiz về Frontend.

### File cần chỉnh sửa

* `backend/src/controllers/quizController.js`
* `backend/src/routes/quizRoutes.js`

---

## Task M5-T5 (Backend)

### Thông tin

* **ID**: M5-T5
* **Tên**: API Tiếp tục Quiz
* **Milestone**: M5
* **User Story**: US-04
* **Functional Requirement**: FR-027
* **Module**: Quiz
* **Priority**: P1
* **Complexity**: S
* **Status**: Todo
* **Dependencies**: M5-T2, M5-T3

### Mục tiêu

Tạo API tiếp tục Quiz chưa hoàn thành, lấy đúng các câu hỏi thuộc attempt đang dở và trả về các câu chưa được trả lời.

### Công việc cần thực hiện

1. Implement endpoint `GET /api/quiz/continue`.
2. Tìm `quiz_attempt` chưa hoàn thành mới nhất của người dùng.
3. Lấy các `quiz_questions` thuộc attempt đó.
4. Đối chiếu với `quiz_answers` để xác định các câu chưa trả lời.
5. Trả về thông tin attempt và các câu hỏi chưa làm cho Frontend.

### File cần chỉnh sửa

* `backend/src/controllers/quizController.js`
* `backend/src/routes/quizRoutes.js`

---

## Task M5-T6 (Frontend)

### Thông tin

* **ID**: M5-T6
* **Tên**: Trang Quiz - HTML & CSS
* **Milestone**: M5
* **User Story**: US-04
* **Functional Requirement**: FR-021, FR-022, FR-026, FR-027
* **Module**: Quiz
* **Priority**: P0
* **Complexity**: M
* **Status**: Todo
* **Dependencies**: M1-T8, M1-T9

### Mục tiêu

Tạo cấu trúc HTML và CSS cho trang Quiz, hỗ trợ bắt đầu Quiz, tiếp tục Quiz và hiển thị các dạng câu hỏi Multiple Choice.

### Công việc cần thực hiện

1. Tạo `frontend/src/pages/quiz/quiz.html` với các trạng thái:

   * Không có Quiz chưa hoàn thành: hiển thị nút "Bắt đầu ôn tập".
   * Có Quiz chưa hoàn thành: chỉ hiển thị nút "Tiếp tục".
   * Đang làm Quiz: câu hỏi, 4 lựa chọn và progress bar.
   * Phản hồi đúng/sai sau khi chọn đáp án.
   * Sau khi hoàn thành: hiển thị kết quả và nút "Bắt đầu Quiz mới".
2. Hỗ trợ hiển thị 3 dạng câu hỏi:

   * Word → Meaning.
   * Meaning → Word.
   * Fill in the blank.
3. Tạo `frontend/src/css/pages/quiz.css` theo thiết kế Quiz hiện có, sử dụng Tailwind CSS và màu Emerald-500 cho đúng, Rose-500 cho sai.
4. Giữ nguyên các shared component hiện có như Bottom Navigation và AI Chat, không triển khai lại logic của chúng.

### File cần tạo

* `frontend/src/pages/quiz/quiz.html`
* `frontend/src/css/pages/quiz.css`

### File cần chỉnh sửa

Không.

---

## Task M5-T7 (Frontend)

### Thông tin

* **ID**: M5-T7
* **Tên**: Trang Quiz - JavaScript & Logic
* **Milestone**: M5
* **User Story**: US-04
* **Functional Requirement**: FR-021, FR-022, FR-024, FR-025, FR-026, FR-027
* **Module**: Quiz
* **Priority**: P0
* **Complexity**: M
* **Status**: Todo
* **Dependencies**: M5-T6, M5-T2, M5-T3, M5-T4, M5-T5

### Mục tiêu

Tạo JavaScript xử lý toàn bộ luồng Quiz và tương tác với các API Quiz.

### Công việc cần thực hiện

1. Tạo `frontend/src/js/pages/quiz.js`.
2. Khi vào trang Quiz, kiểm tra Quiz chưa hoàn thành bằng `GET /api/quiz/continue`:

   * Có Quiz chưa hoàn thành → chỉ hiển thị và tiếp tục Quiz đó.
   * Không có Quiz chưa hoàn thành → cho phép bắt đầu Quiz mới.
3. Xử lý `POST /api/quiz/start` khi người dùng bắt đầu Quiz mới.
4. Hiển thị câu hỏi và 4 lựa chọn, hỗ trợ 3 dạng câu hỏi.
5. Xử lý lựa chọn đáp án và gửi `POST /api/quiz/answer`.
6. Hiển thị kết quả đúng/sai theo response từ Backend.
7. Khi hoàn thành tất cả câu hỏi, gửi `POST /api/quiz/complete` và hiển thị kết quả Quiz.
8. Sau khi hoàn thành Quiz, cho phép người dùng bắt đầu Quiz mới.

### File cần tạo

* `frontend/src/js/pages/quiz.js`

### File cần chỉnh sửa

Không.

---

# Milestone 6: Notebook & Streak

## Task M6-T1 (Backend)

### Thông tin

* **ID**: M6-T1
* **Tên**: API Lấy Sổ tay từ vựng
* **Milestone**: M6
* **User Story**: US-05
* **Functional Requirement**: FR-028, FR-029, FR-030
* **Module**: Notebook
* **Priority**: P0
* **Complexity**: M
* **Status**: Todo
* **Dependencies**: M2-T4, M4-T1

### Mục tiêu

Tạo route `GET /api/notebook` + controller. Query params: `search`, `topic_id`, `status`, `page`, `limit`. JOIN `user_vocabularies` + `vocabularies` + `topics`. Chỉ lấy từ có status `learning` hoặc `mastered`, không phụ thuộc roadmap. Search theo cả `word` và `meaning`.

### Công việc cần thực hiện

1. Tạo `backend/src/models/notebookModel.js`, `backend/src/controllers/notebookController.js`, `backend/src/routes/notebookRoutes.js`.
2. Hàm `getAll(userId, { search, topicId, status, page, limit })`: JOIN, WHERE, LIKE trên `word`/`meaning`, lọc `topic_id`/`status`, ORDER BY, LIMIT.
3. Hàm `getTotal(userId, { search, topicId, status })` để lấy tổng số kết quả.

### File cần tạo

* `backend/src/models/notebookModel.js`
* `backend/src/controllers/notebookController.js`
* `backend/src/routes/notebookRoutes.js`

### File cần chỉnh sửa

* `backend/src/server.js` (mount notebookRoutes)

---

## Task M6-T3 (Backend)

### Thông tin

* **ID**: M6-T3
* **Tên**: API Đưa từ đã thuộc về luyện tập
* **Milestone**: M6
* **User Story**: US-05
* **Functional Requirement**: FR-032
* **Module**: Notebook
* **Priority**: P0
* **Complexity**: S
* **Status**: Todo
* **Dependencies**: M6-T1

### Mục tiêu

Tạo route `POST /api/notebook/review/:vocabulary_id` + controller. Chỉ cho phép từ có status `mastered` được đưa về `learning` và đưa lại vào hàng đợi ôn tập bằng cách cập nhật `next_review_at = NOW()`.

### Công việc cần thực hiện

1. Thêm hàm xử lý trong `backend/src/models/notebookModel.js` để cập nhật vocabulary của user.
2. Trong controller, lấy `userId` từ `req.user.id` và xử lý `vocabulary_id`.
3. Cập nhật `status = 'learning'`, `next_review_at = NOW()` khi vocabulary đang ở trạng thái `mastered`.
4. Từ không thuộc user hoặc không ở trạng thái `mastered` phải được xử lý theo quy ước lỗi hiện tại của API.

### File cần chỉnh sửa

* `backend/src/models/notebookModel.js`
* `backend/src/controllers/notebookController.js`
* `backend/src/routes/notebookRoutes.js`

---

## Task M6-T4 (Frontend)

### Thông tin

* **ID**: M6-T4
* **Tên**: Trang Sổ tay từ vựng - HTML & CSS
* **Milestone**: M6
* **User Story**: US-05
* **Functional Requirement**: FR-028, FR-029, FR-030
* **Module**: Notebook
* **Priority**: P0
* **Complexity**: M
* **Status**: Todo
* **Dependencies**: M1-T8, M1-T9

### Mục tiêu

Tạo cấu trúc HTML và CSS cho trang Sổ tay từ vựng.

### Công việc cần thực hiện

1. Tạo `frontend/src/pages/notebook/notebook.html`: header, tổng số từ, thanh tìm kiếm, nút lọc topic, danh sách từ, cột action, bottom navigation, AI Chat placehoder.
2. Danh sách hiển thị: từ vựng, phát âm, từ loại, nghĩa tiếng Việt và action tương ứng với status.
3. Với từ `learning`, hiển thị nút **Đánh dấu đã thuộc**; với từ `mastered`, hiển thị nút **Đưa về luyện tập**.
4. Tạo `frontend/src/css/pages/notebook.css`: style danh sách, pronunciation, action buttons và giao diện lọc topic.

### File cần tạo

* `frontend/src/pages/notebook/notebook.html`
* `frontend/src/css/pages/notebook.css`

### File cần chỉnh sửa

Không.

---

## Task M6-T5 (Frontend)

### Thông tin

* **ID**: M6-T5
* **Tên**: Trang Sổ tay từ vựng - JavaScript
* **Milestone**: M6
* **User Story**: US-05
* **Functional Requirement**: FR-028, FR-029, FR-030, FR-031, FR-032
* **Module**: Notebook
* **Priority**: P0
* **Complexity**: M
* **Status**: Todo
* **Dependencies**: M6-T4, M6-T1, M6-T2, M6-T3

### Mục tiêu

Tạo JavaScript cho trang Sổ tay.

### Công việc cần thực hiện

1. Tạo `frontend/src/js/pages/notebook.js`: gọi `GET /api/notebook`, render danh sách, search debounce, lọc theo topic, cập nhật phân trang.
2. Gọi `GET /api/notebook/topics` để hiển thị danh sách topic khi người dùng mở bộ lọc.
3. Với từ `learning`, gọi `POST /api/notebook/master/:vocabulary_id` khi người dùng bấm **Đánh dấu đã thuộc**.
4. Với từ `mastered`, gọi `POST /api/notebook/review/:vocabulary_id` khi người dùng bấm **Đưa về luyện tập**.
5. Sau khi cập nhật status thành công, cập nhật lại danh sách hoặc item tương ứng.

### File cần tạo

* `frontend/src/js/pages/notebook.js`

### File cần chỉnh sửa

Không.

---

<!-- ## Task M6-T6 (Backend)

### Thông tin

- **ID**: M6-T6
- **Tên**: API Lấy Streak
- **Milestone**: M6
- **User Story**: US-10
- **Functional Requirement**: FR-033
- **Module**: Streak
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M2-T4, M2-T1

### Mục tiêu

Tạo route GET /api/streak + controller. Trả về streak, last_study_date.

### Công việc cần thực hiện

1. Tạo `backend/src/controllers/streakController.js`, `backend/src/routes/streakRoutes.js`.
2. Hàm `getStreak`: lấy req.user.id, gọi userModel.findById, trả về { streak, last_study_date }.

### File cần tạo

- `backend/src/controllers/streakController.js`
- `backend/src/routes/streakRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount streakRoutes)

---

## Task M6-T7 (Backend)

### Thông tin

- **ID**: M6-T7
- **Tên**: Service Cập nhật Streak
- **Milestone**: M6
- **User Story**: US-10
- **Functional Requirement**: FR-034, FR-035, FR-036
- **Module**: Streak
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M6-T6

### Mục tiêu

Tạo service/hàm updateStreak.

### Công việc cần thực hiện

1. Trong streakController, thêm hàm `updateStreak(userId, currentDate)`: nếu last_study_date null → streak=1, nếu hôm qua → streak+1, nếu hôm nay → giữ nguyên, nếu quá 1 ngày → streak=1.
2. Export hàm để learning, quiz gọi.

### File cần chỉnh sửa

- `backend/src/controllers/streakController.js`

---

## Task M6-T8 (Frontend)

### Thông tin

- **ID**: M6-T8
- **Tên**: Hiển thị Streak trên Dashboard
- **Milestone**: M6
- **User Story**: US-10
- **Functional Requirement**: FR-033
- **Module**: Dashboard
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M3-T10, M6-T6

### Mục tiêu

Cập nhật Dashboard frontend: hiển thị streak từ API.

### Công việc cần thực hiện

1. Trong dashboard.js: gọi GET /api/streak → hiển thị streak và icon khuyến khích.

### File cần chỉnh sửa

- `frontend/src/js/pages/dashboard.js`

--- -->

# Milestone 7: AI Assistant

## Task M7-T1 (Backend)

### Thông tin

- **ID**: M7-T1
- **Tên**: Tạo AI Model
- **Milestone**: M7
- **User Story**: US-06
- **Functional Requirement**: FR-039
- **Module**: AI Assistant
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T2

### Mục tiêu

Tạo model cho ai_conversations và ai_messages.

### Công việc cần thực hiện

1. Tạo file `backend/src/models/aiModel.js`.
2. Hàm: `createConversation(userId)`, `getConversationsByUser(userId)`, `createMessage({ conversationId, role, content })`, `getMessagesByConversation(conversationId, limit)`, `getConversationById(conversationId)`.

### File cần tạo

- `backend/src/models/aiModel.js`

---

## Task M7-T2 (Backend)

### Thông tin

- **ID**: M7-T2
- **Tên**: API Tạo/Nhận Hội thoại
- **Milestone**: M7
- **User Story**: US-06
- **Functional Requirement**: FR-040
- **Module**: AI Assistant
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M2-T4, M7-T1

### Mục tiêu

Tạo route POST /api/ai/conversations (tạo mới) và GET /api/ai/conversations (lấy danh sách).

### Công việc cần thực hiện

1. Tạo file `backend/src/controllers/aiController.js`, `backend/src/routes/aiRoutes.js`.

### File cần tạo

- `backend/src/controllers/aiController.js`
- `backend/src/routes/aiRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount aiRoutes)

---

## Task M7-T3 (Backend)

### Thông tin

- **ID**: M7-T3
- **Tên**: Tạo AI Service (Gemini)
- **Milestone**: M7
- **User Story**: US-06
- **Functional Requirement**: FR-038, FR-039, FR-041, FR-042
- **Module**: AI Assistant
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M7-T1

### Mục tiêu

Tạo aiService.js: gọi Gemini API, ghép prompt, lưu messages, xử lý lỗi.

### Công việc cần thực hiện

1. Tạo file `backend/src/services/aiService.js`.
2. Hàm `chat({ userId, message, conversationId, context })`: lấy 10 tin nhắn gần nhất, ghép system prompt + context + history + user message, gọi Gemini API, lưu messages, trả về reply.

### File cần tạo

- `backend/src/services/aiService.js`

---

## Task M7-T4 (Backend)

### Thông tin

- **ID**: M7-T4
- **Tên**: API Chat AI
- **Milestone**: M7
- **User Story**: US-06
- **Functional Requirement**: FR-038, FR-039, FR-041, FR-042
- **Module**: AI Assistant
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M7-T3, M7-T1

### Mục tiêu

Tạo route POST /api/ai/chat + controller. Gọi aiService.chat().

### File cần chỉnh sửa

- `backend/src/controllers/aiController.js`
- `backend/src/routes/aiRoutes.js`

---

## Task M7-T5 (Frontend)

### Thông tin

- **ID**: M7-T5
- **Tên**: Component AI Chat - HTML & CSS
- **Milestone**: M7
- **User Story**: US-06
- **Functional Requirement**: FR-037
- **Module**: AI Assistant
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T8, M1-T9

### Mục tiêu

Tạo component AI Chat: icon bong bóng cố định góc dưới phải, popup chat.

### Công việc cần thực hiện

1. Tạo `frontend/src/components/ai-chat.html`: icon bong bóng, popup (header, message list, input, nút gửi), nút "Hội thoại mới".
2. Tạo `frontend/src/css/components/ai-chat.css`: position fixed, bottom right, scrollable messages.

### File cần tạo

- `frontend/src/components/ai-chat.html`
- `frontend/src/css/components/ai-chat.css`

### File cần chỉnh sửa

Không.

---

## Task M7-T6 (Frontend)

### Thông tin

- **ID**: M7-T6
- **Tên**: Component AI Chat - JavaScript
- **Milestone**: M7
- **User Story**: US-06
- **Functional Requirement**: FR-037, FR-038, FR-040, FR-042
- **Module**: AI Assistant
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M7-T5, M7-T2, M7-T4

### Mục tiêu

Tạo JavaScript cho AI Chat.

### Công việc cần thực hiện

1. Tạo `frontend/src/js/components/ai-chat.js`: load component HTML, gọi GET /api/ai/conversations, xử lý gửi tin nhắn (POST /api/ai/chat), nút "Hội thoại mới" (POST /api/ai/conversations), lỗi AI → thông báo thân thiện.
2. Tích hợp vào dashboard, learn, quiz, notebook, profile pages.

### File cần tạo

- `frontend/src/js/components/ai-chat.js`

### File cần chỉnh sửa

- `frontend/src/pages/dashboard/dashboard.html`
- `frontend/src/pages/learn/learn.html`
- `frontend/src/pages/quiz/quiz.html`
- `frontend/src/pages/notebook/notebook.html`
- `frontend/src/pages/profile/profile.html`

---

# Milestone 8: Admin Dashboard

## Task M8-T1 (Backend)

### Thông tin

- **ID**: M8-T1
- **Tên**: API Admin - CRUD Roadmaps
- **Milestone**: M8
- **User Story**: US-07
- **Functional Requirement**: FR-045, FR-048, FR-049
- **Module**: Admin
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M2-T4, M2-T5, M3-T1

### Mục tiêu

Tạo route GET/POST/PUT/DELETE /api/admin/roadmaps cho CRUD Roadmaps.

### Công việc cần thực hiện

1. Tạo `backend/src/controllers/adminController.js`, `backend/src/routes/adminRoutes.js`.
2. CRUD đầy đủ: name, description, image, is_active, sort_order.

### File cần tạo

- `backend/src/controllers/adminController.js`
- `backend/src/routes/adminRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount adminRoutes)

---

## Task M8-T2 (Backend)

### Thông tin

- **ID**: M8-T2
- **Tên**: API Admin - CRUD Topics
- **Milestone**: M8
- **User Story**: US-07
- **Functional Requirement**: FR-046, FR-048, FR-049
- **Module**: Admin
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M8-T1, M3-T3

### File cần chỉnh sửa

- `backend/src/controllers/adminController.js`
- `backend/src/routes/adminRoutes.js`

---

## Task M8-T3 (Backend)

### Thông tin

- **ID**: M8-T3
- **Tên**: API Admin - CRUD Vocabularies
- **Milestone**: M8
- **User Story**: US-08
- **Functional Requirement**: FR-047
- **Module**: Admin
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M8-T1, M3-T5

### File cần chỉnh sửa

- `backend/src/controllers/adminController.js`
- `backend/src/routes/adminRoutes.js`

---

## Task M8-T4 (Backend)

### Thông tin

- **ID**: M8-T4
- **Tên**: Upload File (multer)
- **Milestone**: M8
- **User Story**: US-08
- **Functional Requirement**: FR-047
- **Module**: Admin
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M8-T3

### Mục tiêu

Cấu hình multer upload ảnh và audio.

### Công việc cần thực hiện

1. Tạo `backend/src/config/upload.js`: storage disk, file filter (JPG/PNG/MP3), size limit (5MB/2MB).
2. Lưu vào `frontend/public/uploads/images/` và `frontend/public/uploads/audio/`.
3. Tên file: `{timestamp}-{random}.{ext}`.

### File cần tạo

- `backend/src/config/upload.js`

### File cần chỉnh sửa

- `backend/src/routes/adminRoutes.js` (thêm multer middleware)

---

## Task M8-T5 (Frontend)

### Thông tin

- **ID**: M8-T5
- **Tên**: Trang Admin Dashboard - Layout
- **Milestone**: M8
- **User Story**: US-07, US-08
- **Functional Requirement**: FR-043, FR-044
- **Module**: Admin
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T8, M1-T9, M2-T5

### Mục tiêu

Tạo layout Admin Dashboard với Bootstrap, tông màu tối.

### Công việc cần thực hiện

1. Tạo `frontend/src/pages/admin/dashboard.html`: sidebar (Roadmaps, Topics, Vocabularies), main content area. Bootstrap 5, tông màu tối.
2. Tạo `frontend/src/css/admin.css`.
3. Tạo `frontend/src/js/pages/admin.js`: kiểm tra role admin, load menu, navigation.

### File cần tạo

- `frontend/src/pages/admin/dashboard.html`
- `frontend/src/css/admin.css`
- `frontend/src/js/pages/admin.js`

### File cần chỉnh sửa

Không.

---

## Task M8-T6 (Frontend)

### Thông tin

- **ID**: M8-T6
- **Tên**: Trang Admin Dashboard - CRUD Logic
- **Milestone**: M8
- **User Story**: US-07, US-08
- **Functional Requirement**: FR-045, FR-046, FR-047, FR-048, FR-049
- **Module**: Admin
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M8-T5, M8-T1, M8-T2, M8-T3

### Mục tiêu

Xây dựng giao diện CRUD cho Roadmaps, Topics, Vocabularies.

### Công việc cần thực hiện

1. Trong admin.js: Section Roadmaps (DataTable, modal form, nút xóa), Section Topics (DataTable filter theo roadmap, modal form, nút xóa), Section Vocabularies (DataTable filter theo topic, modal form với upload file).
2. Gọi API /api/admin/roadmaps, /api/admin/topics, /api/admin/vocabularies.
3. Upload file dùng FormData + multer.

### File cần chỉnh sửa

- `frontend/src/js/pages/admin.js`
- `frontend/src/pages/admin/dashboard.html`

---

# Milestone 9: Validation, Error Handling, Performance, Testing & Polish

## Task M9-T1 (Backend)

### Thông tin

- **ID**: M9-T1
- **Tên**: Backend Validation
- **Milestone**: M9
- **User Story**: US-01–US-10
- **Functional Requirement**: FR-007, FR-011–FR-049
- **Module**: Validation
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: Tất cả API đã hoàn thành

### Mục tiêu

Thêm validation cho tất cả API.

### Công việc cần thực hiện

1. Validate: email format, password >= 8, confirm match, required fields.
2. Kiểm tra FK tồn tại (roadmap_id, topic_id, vocabulary_id) → 404.
3. Kiểm tra UNIQUE constraint → 409.
4. Integer validation cho ID params.

### File cần chỉnh sửa

- Tất cả controller files.

---

## Task M9-T2 (Frontend)

### Thông tin

- **ID**: M9-T2
- **Tên**: Frontend Validation
- **Milestone**: M9
- **User Story**: US-01–US-10
- **Functional Requirement**: FR-007, FR-050, FR-051
- **Module**: Validation
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: Tất cả Frontend pages

### Mục tiêu

Tạo validator.js và áp dụng cho tất cả form.

### Công việc cần thực hiện

1. Tạo `frontend/src/js/utils/validator.js`: validateEmail, validatePassword, validateRequired, validateConfirmPassword.
2. Áp dụng vào login, register, profile, admin forms.

### File cần tạo

- `frontend/src/js/utils/validator.js`

### File cần chỉnh sửa

- Các file JS pages có form.

---

## Task M9-T3 (Backend)

### Thông tin

- **ID**: M9-T3
- **Tên**: Error Handling - HTTP Status Codes
- **Milestone**: M9
- **User Story**: US-01–US-10
- **Functional Requirement**: FR-001–FR-053
- **Module**: Error Handling
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: Tất cả API

### Mục tiêu

Kiểm tra tất cả API response đảm bảo HTTP status codes đúng (200, 201, 400, 401, 403, 404, 409, 500).

### File cần chỉnh sửa

- Tất cả controller files.

---

## Task M9-T4 (Backend)

### Thông tin

- **ID**: M9-T4
- **Tên**: Logging Integration
- **Milestone**: M9
- **User Story**: US-01–US-10
- **Functional Requirement**: FR-001–FR-049
- **Module**: Error Handling
- **Priority**: P1
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T7

### Mục tiêu

Tích hợp logger vào authController, aiService, adminController, error handling.

### File cần chỉnh sửa

- `backend/src/controllers/authController.js`
- `backend/src/services/aiService.js`
- `backend/src/controllers/adminController.js`
- Tất cả controller (error handling)

---

## Task M9-T5 (Frontend)

### Thông tin

- **ID**: M9-T5
- **Tên**: Loading States
- **Milestone**: M9
- **User Story**: US-01–US-10
- **Functional Requirement**: FR-050
- **Module**: UI Polish
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: Tất cả Frontend pages

### Mục tiêu

Tạo loading component và áp dụng cho mọi thao tác chờ API.

### Công việc cần thực hiện

1. Tạo `frontend/src/components/loading.html` (skeleton/spinner).
2. Tạo `frontend/src/js/components/loading.js`: showLoading/hideLoading.
3. Áp dụng cho login, register, dashboard, learn, quiz, notebook, AI chat, admin.

### File cần tạo

- `frontend/src/components/loading.html`
- `frontend/src/js/components/loading.js`

### File cần chỉnh sửa

- Các file JS pages.

---

## Task M9-T6 (Frontend)

### Thông tin

- **ID**: M9-T6
- **Tên**: Toast Notification
- **Milestone**: M9
- **User Story**: US-01–US-10
- **Functional Requirement**: FR-051
- **Module**: UI Polish
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: Tất cả Frontend pages

### Mục tiêu

Tạo toast notification component, không dùng alert(), tự động ẩn 3s.

### Công việc cần thực hiện

1. Tạo `frontend/src/components/toast.html`.
2. Tạo `frontend/src/js/components/toast.js`: showToast(message, type), type = success (Emerald), error (Rose), warning (Amber), info (#FFC300).

### File cần tạo

- `frontend/src/components/toast.html`
- `frontend/src/js/components/toast.js`

### File cần chỉnh sửa

- Các file JS pages (thay alert() bằng toast).

---

## Task M9-T7 (Frontend)

### Thông tin

- **ID**: M9-T7
- **Tên**: UI Polish
- **Milestone**: M9
- **User Story**: US-01–US-10
- **Functional Requirement**: FR-050, FR-051, FR-052, FR-053
- **Module**: UI Polish
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: Tất cả Frontend pages

### Mục tiêu

Kiểm tra và hoàn thiện UI: màu sắc, font, responsive, components đồng bộ.

### Công việc cần thực hiện

1. Màu sắc: #FFC300 (primary), Emerald-500 (success), Amber-500 (warning), Rose-500 (danger).
2. Font: Inter / Roboto / system-ui, hỗ trợ IPA.
3. Responsive mobile.
4. Header + bottom-nav đồng bộ giữa các trang.

### File cần chỉnh sửa

- Các file CSS và HTML.

---

## Task M9-T8 (Database)

### Thông tin

- **ID**: M9-T8
- **Tên**: Performance - Database Index
- **Milestone**: M9
- **User Story**: US-01–US-10
- **Functional Requirement**: FR-001–FR-053
- **Module**: Performance
- **Priority**: P1
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M1-T3

### Mục tiêu

Kiểm tra và bổ sung INDEX cho các cột thường xuyên truy vấn.

### Công việc cần thực hiện

Đảm bảo INDEX trên: users(email), users(role), users(roadmap_id), topics(roadmap_id), vocabularies(topic_id), vocabularies(word), user_vocabularies(user_id), user_vocabularies(status), user_vocabularies(next_review_at), quiz_answers(quiz_attempt_id), ai_messages(conversation_id).

### File cần chỉnh sửa

- `database/schema.sql`

---

## Task M9-T9 (Testing)

### Thông tin

- **ID**: M9-T9
- **Tên**: Service Unit Tests
- **Milestone**: M9
- **User Story**: US-03, US-04, US-06
- **Functional Requirement**: FR-018, FR-024, FR-025, FR-038, FR-039, FR-041
- **Module**: Testing
- **Priority**: P1
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M4-T6, M5-T2, M7-T3

### Mục tiêu

Viết unit test cho SRS service, AI service, Quiz generation rules.

### File cần tạo

- `backend/tests/srsService.test.js`
- `backend/tests/quizService.test.js`
- `backend/tests/aiService.test.js`
- `backend/jest.config.js`

---

## Task M9-T10 (Testing)

### Thông tin

- **ID**: M9-T10
- **Tên**: API Integration Tests
- **Milestone**: M9
- **User Story**: US-01, US-02, US-03, US-04, US-09
- **Functional Requirement**: FR-001–FR-007, FR-010, FR-013–FR-018, FR-021–FR-026
- **Module**: Testing
- **Priority**: P1
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M2-T2, M2-T3, M2-T7, M2-T8, M2-T9, M4-T2, M4-T3, M4-T4, M4-T5, M5-T2, M5-T3, M5-T4

### Mục tiêu

Viết integration test cho Auth, Profile, Learning, Quiz API.

### File cần tạo

- `backend/tests/auth.test.js`
- `backend/tests/profile.test.js`
- `backend/tests/learning.test.js`
- `backend/tests/quiz.test.js`

---

## Task M9-T11 (DevOps/Documentation)

### Thông tin

- **ID**: M9-T11
- **Tên**: Deployment Preparation
- **Milestone**: M9
- **User Story**: US-01–US-10
- **Functional Requirement**: FR-001–FR-049
- **Module**: Deployment
- **Priority**: P1
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: Tất cả milestone

### Mục tiêu

Tạo .env.example, README.md, hướng dẫn triển khai.

### File cần tạo

- `backend/.env.example`
- `README.md`

---

# Dependency Matrix

```
M1-T1 → M1-T2 → M1-T3 → M1-T4 → M1-T5 → M1-T6 → M1-T7 → M1-T8 → M1-T9

M2-T1 ← M1-T2
M2-T2 ← M2-T1
M2-T3 ← M2-T1
M2-T4 ← M2-T3
M2-T5 ← M2-T4
M2-T6 ← M2-T4
M2-T7 ← M2-T4 + M2-T1
M2-T8 ← M2-T4 + M2-T1
M2-T9 ← M2-T4 + M2-T1 + M3-T1
M2-T10 ← M1-T8 + M1-T9 + M2-T3
M2-T11 ← M1-T8 + M1-T9 + M2-T2
M2-T12 ← M1-T8 + M1-T9 + M2-T7 + M2-T8 + M2-T9

M3-T1 ← M1-T2
M3-T2 ← M3-T1
M3-T3 ← M1-T2 + M2-T4
M3-T4 ← M3-T3
M3-T5 ← M1-T2 + M2-T4
M3-T6 ← M3-T5
M3-T7 ← M1-T3
M3-T8 ← M1-T8 + M1-T9 + M3-T1 + M3-T3 + M2-T9
M3-T9 ← M3-T8
M3-T10 ← M3-T9
M3-T11 ← M3-T10

M4-T1 ← M1-T2
M4-T2 ← M2-T4 + M3-T5
M4-T3 ← M4-T1 + M4-T2
M4-T4 ← M4-T2
M4-T5 ← M4-T1 + M4-T2 + M6-T7
M4-T6 ← M4-T1
M4-T7 ← M1-T8 + M1-T9
M4-T8 ← M4-T7 + M4-T2 + M4-T3 + M4-T4
M4-T9 ← M4-T8 + M4-T5 + M4-T6
M4-T10 ← M4-T1 + M2-T4

M5-T1 ← M1-T2
M5-T2 ← M5-T1 + M4-T1
M5-T3 ← M5-T2 + M4-T6
M5-T4 ← M5-T3
M5-T5 ← M5-T2 + M5-T1
M5-T6 ← M1-T8 + M1-T9
M5-T7 ← M5-T6 + M5-T2 + M5-T3 + M5-T4 + M5-T5

M6-T1 ← M2-T4 + M4-T1
M6-T2 ← M6-T1
M6-T3 ← M6-T1
M6-T4 ← M1-T8 + M1-T9
M6-T5 ← M6-T4 + M6-T1 + M6-T2 + M6-T3
M6-T6 ← M2-T4 + M2-T1
M6-T7 ← M6-T6
M6-T8 ← M3-T10 + M6-T6

M7-T1 ← M1-T2
M7-T2 ← M2-T4 + M7-T1
M7-T3 ← M7-T1
M7-T4 ← M7-T3 + M7-T1
M7-T5 ← M1-T8 + M1-T9
M7-T6 ← M7-T5 + M7-T2 + M7-T4

M8-T1 ← M2-T4 + M2-T5 + M3-T1
M8-T2 ← M8-T1 + M3-T3
M8-T3 ← M8-T1 + M3-T5
M8-T4 ← M8-T3
M8-T5 ← M1-T8 + M1-T9 + M2-T5
M8-T6 ← M8-T5 + M8-T1 + M8-T2 + M8-T3

M9-T1 ← Tất cả API
M9-T2 ← Tất cả Frontend
M9-T3 ← Tất cả API
M9-T4 ← M1-T7
M9-T5 ← Tất cả Frontend
M9-T6 ← Tất cả Frontend
M9-T7 ← Tất cả Frontend
M9-T8 ← M1-T3
M9-T9 ← M4-T6 + M5-T2 + M7-T3
M9-T10 ← M2-T2 + M2-T3 + M2-T7 + M2-T8 + M2-T9 + M4-T2 + M4-T3 + M4-T4 + M4-T5 + M5-T2 + M5-T3 + M5-T4
M9-T11 ← Tất cả milestone
```

---

# Tổng số Task

| Loại | Số lượng |
|------|----------|
| Backend Task | 35 |
| Frontend Task | 22 |
| Database/Test Task | 6 |
| **Tổng cộng** | **63** |

---

# Thống kê theo Milestone

## Milestone 1: Project Setup & Foundation
- Tasks: 9 (M1-T1 → M1-T9)
- **Tổng: 9**

## Milestone 2: Authentication & Profile
- Tasks: 12 (M2-T1 → M2-T12)
- **Tổng: 12**

## Milestone 3: Roadmap, Topic & Vocabulary
- Tasks: 11 (M3-T1 → M3-T11)
- **Tổng: 11**

## Milestone 4: Learning - Flashcard & Writing Exercise
- Tasks: 10 (M4-T1 → M4-T10)
- **Tổng: 10**

## Milestone 5: Quiz
- Tasks: 7 (M5-T1 → M5-T7)
- **Tổng: 7**

## Milestone 6: Notebook & Streak
- Tasks: 8 (M6-T1 → M6-T8)
- **Tổng: 8**

## Milestone 7: AI Assistant
- Tasks: 6 (M7-T1 → M7-T6)
- **Tổng: 6**

## Milestone 8: Admin Dashboard
- Tasks: 6 (M8-T1 → M8-T6)
- **Tổng: 6**

## Milestone 9: Validation, Error Handling, Performance, Testing & Polish
- Tasks: 11 (M9-T1 → M9-T11)
- **Tổng: 11**

---

# Thống kê theo Module

| Module | Số Task |
|--------|---------|
| Project Setup | 5 |
| Config | 1 |
| Database | 2 |
| Utils | 2 |
| Authentication | 8 |
| User | 6 |
| Roadmap | 2 |
| Topic | 2 |
| Vocabulary | 4 |
| Study Session | 6 |
| Onboarding | 1 |
| Dashboard | 4 |
| Learning | 4 |
| Quiz | 5 |
| Notebook | 4 |
| Streak | 3 |
| AI Assistant | 5 |
| Admin | 5 |
| Validation | 2 |
| Error Handling | 2 |
| UI Polish | 3 |
| Performance | 1 |
| Testing | 3 |
| Deployment | 1 |

---

# Validation Checklist

- [ ] ✓ Mọi Task đều thuộc đúng một Milestone
- [ ] ✓ Không có Task mồ côi
- [ ] ✓ Không có Dependency vòng
- [ ] ✓ Mọi Task đều có User Story
- [ ] ✓ Mọi Task đều có Functional Requirement
- [ ] ✓ Mọi Task đều có Module
- [ ] ✓ Mọi Task đều có Acceptance Criteria
- [ ] ✓ Mọi Task đều có Checklist
- [ ] ✓ Mọi Task đều có File Path
- [ ] ✓ Không có Task ngoài plan.md
- [ ] ✓ Không thay đổi bất kỳ tài liệu nào