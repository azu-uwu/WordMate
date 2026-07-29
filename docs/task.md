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

Backend có thể khởi động với `npm start`, Express server listen trên port đã cấu hình.

### Acceptance Criteria

1. `npm start` chạy thành công, server listen trên port 3000 (mặc định).
2. `package.json` có đầy đủ dependencies: express, mysql2, dotenv, bcryptjs, jsonwebtoken, multer, cors.
3. `.env` có đủ biến môi trường.
4. `.gitignore` loại trừ node_modules, .env, uploads/.

### Kiểm thử

- **Kiểm thử chức năng**: Chạy `npm start`, kiểm tra server khởi động, gọi `http://localhost:3000` trả về response (404 là OK vì chưa có route).
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Kiểm tra khi PORT không cấu hình thì dùng mặc định 3000.
- **Kết quả mong đợi**: Server khởi động thành công.

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

1. Tạo file `backend/src/utils/response.js`.
2. Hàm `successResponse(res, data, message = 'Success', statusCode = 200)`: Format `{ success: true, message, data }`.
3. Hàm `errorResponse(res, message = 'Error', statusCode = 500)`: Format `{ success: false, message }`.
4. Hàm `createdResponse(res, data, message = 'Created')`: Status 201.

### File cần tạo

- `backend/src/utils/response.js`

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
2. Định nghĩa BASE_URL (mặc định `http://localhost:3000/api`).
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
3. Hàm `register(email, password, confirmPassword)`: gọi api.post('/auth/register', ...), lưu token + user info.
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
3. Controller.auth.register: validate email format, password >= 8, confirm match. Kiểm tra email tồn tại → 409. Hash password bcrypt. Tạo user (role='user', streak=0). Tạo JWT token. Format response theo spec 7.1.
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
- **Dependencies**: M2-T4, M2-T1, M3-T1

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

Tạo trang đăng ký với form email, password, confirm password, gọi API register, lưu JWT.

### Công việc cần thực hiện

1. Tạo file `frontend/src/pages/auth/register.html`: form email, password, confirm password, nút submit, link login, Tailwind CSS.
2. Tạo file `frontend/src/js/pages/register.js`: validate (email format, password >= 8, confirm match), gọi authService.register, redirect onboarding.

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
- **Dependencies**: M1-T2

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

Tạo script seed dữ liệu mẫu: 3 roadmaps, 9+ topics, 50+ vocabularies.

### Công việc cần thực hiện

1. Tạo file `database/seed.sql` (hoặc `backend/seed.js`).
2. INSERT 3 roadmaps: "Basic English", "TOEIC", "Phrasal Verb & Idiom".
3. INSERT 3+ topics cho mỗi roadmap, 5+ vocabularies cho mỗi topic.

### File cần tạo

- `database/seed.sql` hoặc `backend/seed.js`

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

1. Tạo file `frontend/src/pages/dashboard/onboarding.html`: card layout danh sách roadmap, sau khi chọn roadmap → hiển thị danh sách topics.
2. Tạo file `frontend/src/js/pages/onboarding.js`: gọi GET /api/roadmaps, PUT /api/profile/roadmap, GET /api/topics.

### File cần tạo

- `frontend/src/pages/dashboard/onboarding.html`
- `frontend/src/js/pages/onboarding.js`

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

Tạo cấu trúc HTML và CSS cho trang Dashboard.

### Công việc cần thực hiện

1. Tạo file `frontend/src/pages/dashboard/dashboard.html`: header (avatar, roadmap name, streak), topic list (card/grid), bottom navigation (Trang chủ, Ôn tập, Sổ tay), AI Chat placeholder. Tailwind CSS, #FFC300.
2. Tạo file `frontend/src/css/main.css`: style Tailwind cơ bản.

### File cần tạo

- `frontend/src/pages/dashboard/dashboard.html`
- `frontend/src/css/main.css`

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

1. Tạo file `frontend/src/js/pages/dashboard.js`: kiểm tra auth, gọi GET /api/profile, GET /api/roadmaps, GET /api/topics. Render danh sách topic cards. Bottom navigation highlight tab "Trang chủ".
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
- **Dependencies**: M1-T2

### Mục tiêu

Tạo model cho user_vocabularies với các hàm CRUD và UPSERT.

### Công việc cần thực hiện

1. Mở rộng `backend/src/models/vocabularyModel.js` (hoặc tạo model riêng).
2. Hàm `findByUserAndVocab(userId, vocabId)`, `upsert(userId, vocabId, data)`, `getByUserAndStatus(userId, status)`, `updateStudySession(userId, vocabId, { status, reviewCount, nextReviewAt })`.

### File cần tạo/chỉnh sửa

- `backend/src/models/vocabularyModel.js`

---

## Task M4-T2 (Backend)

### Thông tin

- **ID**: M4-T2
- **Tên**: API Bắt đầu phiên học
- **Milestone**: M4
- **User Story**: US-03
- **Functional Requirement**: FR-013
- **Module**: Study Session
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M2-T4, M3-T5

### Mục tiêu

Tạo route POST /api/learning/start + controller. Input: topic_id. Trả về session_id + danh sách từ vựng.

### File cần chỉnh sửa

- `backend/src/controllers/vocabularyController.js`
- `backend/src/routes/vocabularyRoutes.js`

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
- **Dependencies**: M4-T1, M4-T2

### Mục tiêu

Tạo route POST /api/learning/mastered + controller. UPSERT user_vocabularies: status='mastered', review_count++.

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

Tạo route POST /api/learning/writing + controller. Trả về prompt: meaning, example.

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
- **Dependencies**: M4-T1, M4-T2, M6-T6

### Mục tiêu

Tạo route POST /api/learning/writing/submit + controller. UPSERT user_vocabularies: status='learning', tính SRS, cập nhật streak.

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

### Công việc cần thực hiện

1. Tạo file `backend/src/services/srsService.js`.
2. `calculateNextReview(reviewCount)`: 0→1d, 1→3d, 2→7d, 3→14d, 4+→30d.
3. `handleCorrectAnswer(reviewCount)`: tăng count, tính nextReviewAt.
4. `handleWrongAnswer()`: reset count=0, nextReviewAt=NOW().

### File cần tạo

- `backend/src/services/srsService.js`

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

Tạo cấu trúc HTML và CSS cho trang học Flashcard với hiệu ứng lật thẻ.

### Công việc cần thực hiện

1. Tạo `frontend/src/pages/learn/learn.html`: header, flashcard container (mặt trước: word, pronunciation, audio, image; mặt sau: part_of_speech, meaning, example, example_meaning), nút "Đã thuộc" (Emerald-500) và "Tiếp tục" (Amber-500), progress bar, writing exercise placeholder, bottom navigation, AI Chat.
2. Tạo `frontend/src/css/pages/learn.css`: hiệu ứng lật thẻ 3D CSS.

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

Tạo JavaScript cho trang học Flashcard.

### Công việc cần thực hiện

1. Tạo `frontend/src/js/pages/learn.js`: lấy topic_id từ URL, gọi POST /api/learning/start, hiển thị flashcard, xử lý click "Đã thuộc" → POST /api/learning/mastered, click "Tiếp tục" → POST /api/learning/writing, xử lý lật thẻ.

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

Hoàn thiện writing exercise, màn hình tổng kết và phím tắt.

### Công việc cần thực hiện

1. Trong learn.js: writing exercise (hiển thị gợi ý, input, nút nộp → POST /api/learning/writing/submit), màn hình tổng kết (số từ đã học, đã thuộc), phím tắt (Space→lật, ArrowRight→mastered, ArrowLeft→writing).

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

Tạo route GET /api/user-vocabularies + controller. Query params: topic_id (optional).

### File cần chỉnh sửa

- `backend/src/controllers/vocabularyController.js`
- `backend/src/routes/vocabularyRoutes.js`

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

Tạo model cho quiz_attempts và quiz_answers.

### Công việc cần thực hiện

1. Tạo file `backend/src/models/quizModel.js`.
2. Hàm: `createAttempt(userId)`, `createAnswer({ quizAttemptId, vocabularyId, userAnswer, correctAnswer, isCorrect })`, `updateAttempt(attemptId, { score, totalQuestions, correctAnswers })`, `getAttemptById(attemptId)`, `getAnswersByAttemptId(attemptId)`, `getIncompleteAttempt(userId)`.

### File cần tạo

- `backend/src/models/quizModel.js`

---

## Task M5-T2 (Backend)

### Thông tin

- **ID**: M5-T2
- **Tên**: API Bắt đầu Quiz
- **Milestone**: M5
- **User Story**: US-04
- **Functional Requirement**: FR-021, FR-022
- **Module**: Quiz
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M5-T1, M4-T1

### Mục tiêu

Tạo route POST /api/quiz/start + controller. Lọc từ cần ôn tập, tạo quiz, trả về câu hỏi (tối đa 20).

### Công việc cần thực hiện

1. Tạo `backend/src/controllers/quizController.js`, `backend/src/routes/quizRoutes.js`.
2. Hàm `startQuiz`: lọc user_vocabularies (status IN ('new','learning') OR next_review_at <= NOW()), áp dụng Quiz Generation Rules, tạo quiz_attempt, trả về questions.

### File cần tạo

- `backend/src/controllers/quizController.js`
- `backend/src/routes/quizRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount quizRoutes)

---

## Task M5-T3 (Backend)

### Thông tin

- **ID**: M5-T3
- **Tên**: API Trả lời Quiz
- **Milestone**: M5
- **User Story**: US-04
- **Functional Requirement**: FR-024, FR-025
- **Module**: Quiz
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M5-T2, M4-T6

### Mục tiêu

Tạo route POST /api/quiz/answer + controller. Kiểm tra đáp án, cập nhật SRS, lưu quiz_answers.

### File cần chỉnh sửa

- `backend/src/controllers/quizController.js`
- `backend/src/routes/quizRoutes.js`

---

## Task M5-T4 (Backend)

### Thông tin

- **ID**: M5-T4
- **Tên**: API Hoàn thành Quiz
- **Milestone**: M5
- **User Story**: US-04
- **Functional Requirement**: FR-026
- **Module**: Quiz
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M5-T3

### Mục tiêu

Tạo route POST /api/quiz/complete + controller. Tính score, cập nhật quiz_attempts.

### File cần chỉnh sửa

- `backend/src/controllers/quizController.js`
- `backend/src/routes/quizRoutes.js`

---

## Task M5-T5 (Backend)

### Thông tin

- **ID**: M5-T5
- **Tên**: API Tiếp tục Quiz
- **Milestone**: M5
- **User Story**: US-04
- **Functional Requirement**: FR-027
- **Module**: Quiz
- **Priority**: P1
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M5-T2, M5-T1

### Mục tiêu

Tạo route GET /api/quiz/continue + controller. Kiểm tra quiz chưa hoàn thành, trả về câu chưa làm.

### File cần chỉnh sửa

- `backend/src/controllers/quizController.js`
- `backend/src/routes/quizRoutes.js`

---

## Task M5-T6 (Frontend)

### Thông tin

- **ID**: M5-T6
- **Tên**: Trang Quiz - HTML & CSS
- **Milestone**: M5
- **User Story**: US-04
- **Functional Requirement**: FR-021, FR-022, FR-026
- **Module**: Quiz
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T8, M1-T9

### Mục tiêu

Tạo cấu trúc HTML và CSS cho trang Quiz.

### Công việc cần thực hiện

1. Tạo `frontend/src/pages/quiz/quiz.html`: trạng thái trước khi bắt đầu (nút "Bắt đầu ôn tập"), câu hỏi (từ + 4 lựa chọn), progress bar, kết quả đúng/sai, màn hình kết quả cuối cùng, bottom navigation, AI Chat.
2. Tạo `frontend/src/css/pages/quiz.css`: Tailwind CSS, Emerald-500 (đúng), Rose-500 (sai).

### File cần tạo

- `frontend/src/pages/quiz/quiz.html`
- `frontend/src/css/pages/quiz.css`

### File cần chỉnh sửa

Không.

---

## Task M5-T7 (Frontend)

### Thông tin

- **ID**: M5-T7
- **Tên**: Trang Quiz - JavaScript & Logic
- **Milestone**: M5
- **User Story**: US-04
- **Functional Requirement**: FR-021, FR-022, FR-024, FR-025, FR-026, FR-027
- **Module**: Quiz
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M5-T6, M5-T2, M5-T3, M5-T4, M5-T5

### Mục tiêu

Tạo JavaScript cho Quiz.

### Công việc cần thực hiện

1. Tạo `frontend/src/js/pages/quiz.js`: kiểm tra quiz dang dở (GET /api/quiz/continue), bấm "Bắt đầu" → POST /api/quiz/start, chọn đáp án → POST /api/quiz/answer, hoàn thành → POST /api/quiz/complete. Handle tiếp tục quiz (nút "Tiếp tục" và "Bắt đầu mới").

### File cần tạo

- `frontend/src/js/pages/quiz.js`

### File cần chỉnh sửa

Không.

---

# Milestone 6: Notebook & Streak

## Task M6-T1 (Backend)

### Thông tin

- **ID**: M6-T1
- **Tên**: API Lấy Sổ tay từ vựng
- **Milestone**: M6
- **User Story**: US-05
- **Functional Requirement**: FR-028, FR-029, FR-030
- **Module**: Notebook
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M2-T4, M4-T1

### Mục tiêu

Tạo route GET /api/notebook + controller. Query params: search, status, page. JOIN user_vocabularies + vocabularies.

### Công việc cần thực hiện

1. Tạo `backend/src/models/notebookModel.js`, `backend/src/controllers/notebookController.js`, `backend/src/routes/notebookRoutes.js`.
2. Hàm `getAll(userId, { search, status, page, limit })`: JOIN, WHERE, LIKE, ORDER BY, LIMIT.

### File cần tạo

- `backend/src/models/notebookModel.js`
- `backend/src/controllers/notebookController.js`
- `backend/src/routes/notebookRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount notebookRoutes)

---

## Task M6-T2 (Backend)

### Thông tin

- **ID**: M6-T2
- **Tên**: API Chi tiết từ trong Sổ tay
- **Milestone**: M6
- **User Story**: US-05
- **Functional Requirement**: FR-031
- **Module**: Notebook
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M6-T1

### Mục tiêu

Tạo route GET /api/notebook/:vocabulary_id + controller.

### File cần chỉnh sửa

- `backend/src/models/notebookModel.js`
- `backend/src/controllers/notebookController.js`
- `backend/src/routes/notebookRoutes.js`

---

## Task M6-T3 (Backend)

### Thông tin

- **ID**: M6-T3
- **Tên**: API Ôn lại từ
- **Milestone**: M6
- **User Story**: US-05
- **Functional Requirement**: FR-032
- **Module**: Notebook
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M6-T1

### Mục tiêu

Tạo route POST /api/notebook/review/:vocabulary_id + controller. Chuyển status từ mastered về learning.

### File cần chỉnh sửa

- `backend/src/controllers/notebookController.js`
- `backend/src/routes/notebookRoutes.js`

---

## Task M6-T4 (Frontend)

### Thông tin

- **ID**: M6-T4
- **Tên**: Trang Sổ tay từ vựng - HTML & CSS
- **Milestone**: M6
- **User Story**: US-05
- **Functional Requirement**: FR-028, FR-029, FR-030
- **Module**: Notebook
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T8, M1-T9

### Mục tiêu

Tạo cấu trúc HTML và CSS cho trang Sổ tay từ vựng.

### Công việc cần thực hiện

1. Tạo `frontend/src/pages/notebook/notebook.html`: header, tổng số từ, thanh tìm kiếm, tabs status (Tất cả, New, Learning, Mastered), danh sách từ, modal chi tiết, bottom navigation, AI Chat.
2. Tạo `frontend/src/css/pages/notebook.css`: status badges (gray, Amber-500, Emerald-500).

### File cần tạo

- `frontend/src/pages/notebook/notebook.html`
- `frontend/src/css/pages/notebook.css`

### File cần chỉnh sửa

Không.

---

## Task M6-T5 (Frontend)

### Thông tin

- **ID**: M6-T5
- **Tên**: Trang Sổ tay từ vựng - JavaScript
- **Milestone**: M6
- **User Story**: US-05
- **Functional Requirement**: FR-028, FR-029, FR-030, FR-031, FR-032
- **Module**: Notebook
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M6-T4, M6-T1, M6-T2, M6-T3

### Mục tiêu

Tạo JavaScript cho trang Sổ tay.

### Công việc cần thực hiện

1. Tạo `frontend/src/js/pages/notebook.js`: gọi GET /api/notebook, render danh sách, search debounce, filter status, modal chi tiết (GET /api/notebook/:id), nút "Ôn lại" (POST /api/notebook/review/:id).

### File cần tạo

- `frontend/src/js/pages/notebook.js`

### File cần chỉnh sửa

Không.

---

## Task M6-T6 (Backend)

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

---

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