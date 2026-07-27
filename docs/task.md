# Task.md - WordMate tation Tasks

**Version**: 1.0
**Status**: Draft
**Based on**: docs/requirements.md, docs/spec.md, docs/architecture.md, docs/database.md, docs/plan.md

---

# Milestone 1: Project Setup & Foundation

## Task M1-T1

### Thông tin

- **ID**: M1-T1
- **Tên**: Khởi tạo Backend Project
- **Milestone**: M1
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-019, FR-020, FR-021, FR-022, FR-023, FR-024, FR-025, FR-026, FR-027, FR-028, FR-029, FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-037, FR-038, FR-039, FR-040, FR-041, FR-042, FR-043, FR-044, FR-045, FR-046, FR-047, FR-048, FR-049, FR-050, FR-051, FR-052, FR-053
- **Module**: Project Setup
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: Không

### Mục tiêu

Tạo dự án Node.js + Express với package.json, cài đặt tất cả dependencies cần thiết, tạo file server.js entry point.

### Điều kiện bắt đầu

Không có (Milestone đầu tiên).

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
- [x] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M1-T2

### Thông tin

- **ID**: M1-T2
- **Tên**: Cấu hình Database Connection
- **Milestone**: M1
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-019, FR-020, FR-021, FR-022, FR-023, FR-024, FR-025, FR-026, FR-027, FR-028, FR-029, FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-037, FR-038, FR-039, FR-040, FR-041, FR-042, FR-043, FR-044, FR-045, FR-046, FR-047, FR-048, FR-049, FR-050, FR-051, FR-052, FR-053
- **Module**: Config
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M1-T1

### Mục tiêu

Tạo kết nối MySQL pool sử dụng mysql2/promise, đọc cấu hình từ .env.

### Điều kiện bắt đầu

M1-T1 hoàn thành (có backend project, package.json, .env).

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

### Kiểm thử

- **Kiểm thử chức năng**: Chạy server, kiểm tra log kết nối database.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Tắt MySQL, kiểm tra server không crash, log lỗi hiển thị.
- **Kết quả mong đợi**: Pool kết nối hoạt động, error handling đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M1-T3

### Thông tin

- **ID**: M1-T3
- **Tên**: Tạo Database Schema
- **Milestone**: M1
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-019, FR-020, FR-021, FR-022, FR-023, FR-024, FR-025, FR-026, FR-027, FR-028, FR-029, FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-037, FR-038, FR-039, FR-040, FR-041, FR-042, FR-043, FR-044, FR-045, FR-046, FR-047, FR-048, FR-049, FR-050, FR-051, FR-052, FR-053
- **Module**: Database
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: Không

### Mục tiêu

Tạo file schema.sql với CREATE TABLE cho 9 bảng, đầy đủ ràng buộc, index, foreign key.

### Điều kiện bắt đầu

Không có.

### Công việc cần thực hiện

1. Tạo file `database/schema.sql`.
2. Tạo DATABASE wordmate với CHARACTER SET utf8mb4, COLLATE utf8mb4_unicode_ci.
3. Tạo bảng `users`:
   - id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
   - username VARCHAR(100) UNIQUE NOT NULL
   - email VARCHAR(255) UNIQUE NOT NULL
   - password VARCHAR(255) NOT NULL
   - fullname VARCHAR(255)
   - avatar VARCHAR(500)
   - role ENUM('user','admin') DEFAULT 'user'
   - roadmap_id BIGINT UNSIGNED (FK → roadmaps.id, nullable)
   - streak INT DEFAULT 0
   - last_study_date DATE
   - created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   - updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   - INDEX(role), INDEX(roadmap_id)
4. Tạo bảng `roadmaps`:
   - id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
   - name VARCHAR(255) NOT NULL
   - description TEXT
   - image VARCHAR(500)
   - is_active BOOLEAN DEFAULT TRUE
   - sort_order INT DEFAULT 0
   - created_at, updated_at
5. Tạo bảng `topics`:
   - id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
   - roadmap_id BIGINT UNSIGNED NOT NULL (FK → roadmaps.id, ON DELETE CASCADE)
   - name VARCHAR(255) NOT NULL
   - description TEXT
   - image VARCHAR(500)
   - sort_order INT DEFAULT 0
   - is_active BOOLEAN DEFAULT TRUE
   - created_at, updated_at
   - INDEX(roadmap_id)
6. Tạo bảng `vocabularies`:
   - id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
   - topic_id BIGINT UNSIGNED NOT NULL (FK → topics.id, ON DELETE CASCADE)
   - word VARCHAR(255) NOT NULL
   - pronunciation VARCHAR(255)
   - part_of_speech ENUM('noun','verb','adjective','adverb','preposition','phrasal_verb','idiom','other')
   - meaning TEXT NOT NULL
   - example TEXT
   - example_meaning TEXT
   - audio VARCHAR(500)
   - image VARCHAR(500)
   - created_at, updated_at
   - INDEX(topic_id), INDEX(word), UNIQUE(topic_id, word)
7. Tạo bảng `user_vocabularies`:
   - id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
   - user_id BIGINT UNSIGNED NOT NULL (FK → users.id, ON DELETE CASCADE)
   - vocabulary_id BIGINT UNSIGNED NOT NULL (FK → vocabularies.id, ON DELETE CASCADE)
   - status ENUM('new','learning','mastered') DEFAULT 'new'
   - review_count INT DEFAULT 0
   - last_reviewed_at TIMESTAMP NULL
   - next_review_at TIMESTAMP NULL
   - created_at, updated_at
   - INDEX(user_id), INDEX(status), INDEX(next_review_at), UNIQUE(user_id, vocabulary_id)
8. Tạo bảng `quiz_attempts`:
   - id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
   - user_id BIGINT UNSIGNED NOT NULL (FK → users.id, ON DELETE CASCADE)
   - score INT DEFAULT 0
   - total_questions INT DEFAULT 0
   - correct_answers INT DEFAULT 0
   - duration INT (giây)
   - created_at
   - INDEX(user_id)
9. Tạo bảng `quiz_answers`:
   - id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
   - quiz_attempt_id BIGINT UNSIGNED NOT NULL (FK → quiz_attempts.id, ON DELETE CASCADE)
   - vocabulary_id BIGINT UNSIGNED NOT NULL (FK → vocabularies.id, ON DELETE CASCADE)
   - user_answer VARCHAR(500)
   - correct_answer VARCHAR(500)
   - is_correct BOOLEAN
   - created_at
   - INDEX(quiz_attempt_id)
10. Tạo bảng `ai_conversations`:
    - id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
    - user_id BIGINT UNSIGNED NOT NULL (FK → users.id, ON DELETE CASCADE)
    - title VARCHAR(255)
    - created_at, updated_at
    - INDEX(user_id)
11. Tạo bảng `ai_messages`:
    - id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
    - conversation_id BIGINT UNSIGNED NOT NULL (FK → ai_conversations.id, ON DELETE CASCADE)
    - role ENUM('user','assistant') NOT NULL
    - content TEXT NOT NULL
    - created_at
    - INDEX(conversation_id)
12. Đảm bảo ENGINE=InnoDB, DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci cho tất cả bảng.

### File cần tạo

- `database/schema.sql`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Database

### Database liên quan

- 9 bảng: users, roadmaps, topics, vocabularies, user_vocabularies, quiz_attempts, quiz_answers, ai_conversations, ai_messages.
- Đầy đủ PK, FK, INDEX, UNIQUE, ON DELETE/UPDATE CASCADE, ENUM.

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

### Kiểm thử

- **Kiểm thử chức năng**: Chạy schema.sql trong MySQL, kiểm tra 9 bảng tồn tại.
- **Kiểm thử dữ liệu**: INSERT dữ liệu mẫu, kiểm tra FK và UNIQUE hoạt động.
- **Kiểm thử lỗi**: INSERT vi phạm FK → lỗi. INSERT trùng UNIQUE → lỗi.
- **Kết quả mong đợi**: Schema tạo thành công, ràng buộc hoạt động.

### Checklist

- [x] Database
- [ ] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M1-T4

### Thông tin

- **ID**: M1-T4
- **Tên**: Tạo cấu trúc thư mục Backend
- **Milestone**: M1
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-019, FR-020, FR-021, FR-022, FR-023, FR-024, FR-025, FR-026, FR-027, FR-028, FR-029, FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-037, FR-038, FR-039, FR-040, FR-041, FR-042, FR-043, FR-044, FR-045, FR-046, FR-047, FR-048, FR-049, FR-050, FR-051, FR-052, FR-053
- **Module**: Project Setup
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M1-T1

### Mục tiêu

Tạo cấu trúc thư mục backend theo kiến trúc đã thiết kế.

### Điều kiện bắt đầu

M1-T1 hoàn thành.

### Công việc cần thực hiện

1. Tạo thư mục `backend/src/controllers/`.
2. Tạo thư mục `backend/src/routes/`.
3. Tạo thư mục `backend/src/middleware/`.
4. Tạo thư mục `backend/src/models/`.
5. Tạo thư mục `backend/src/services/`.
6. Tạo thư mục `backend/src/utils/`.
7. Tạo file `backend/src/utils/index.js` (optional barrel export).

### File cần tạo

- Cấu trúc thư mục

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

### Kiểm thử

- **Kiểm thử chức năng**: Kiểm tra thư mục tồn tại.
- **Kết quả mong đợi**: Thư mục đúng cấu trúc.

### Checklist

- [ ] Database
- [x] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M1-T5

### Thông tin

- **ID**: M1-T5
- **Tên**: Tạo cấu trúc thư mục Frontend
- **Milestone**: M1
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-019, FR-020, FR-021, FR-022, FR-023, FR-024, FR-025, FR-026, FR-027, FR-028, FR-029, FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-037, FR-038, FR-039, FR-040, FR-041, FR-042, FR-043, FR-044, FR-045, FR-046, FR-047, FR-048, FR-049, FR-050, FR-051, FR-052, FR-053
- **Module**: Project Setup
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: Không

### Mục tiêu

Tạo cấu trúc thư mục frontend theo kiến trúc đã thiết kế.

### Điều kiện bắt đầu

Không.

### Công việc cần thực hiện

1. Tạo thư mục `frontend/public/`.
2. Tạo thư mục `frontend/public/uploads/` (images/, audio/).
3. Tạo thư mục `frontend/src/pages/auth/`.
4. Tạo thư mục `frontend/src/pages/dashboard/`.
5. Tạo thư mục `frontend/src/pages/learn/`.
6. Tạo thư mục `frontend/src/pages/quiz/`.
7. Tạo thư mục `frontend/src/pages/notebook/`.
8. Tạo thư mục `frontend/src/pages/profile/`.
9. Tạo thư mục `frontend/src/pages/admin/`.
10. Tạo thư mục `frontend/src/css/` và `frontend/src/css/pages/`, `frontend/src/css/components/`.
11. Tạo thư mục `frontend/src/js/` và `frontend/src/js/pages/`, `frontend/src/js/components/`, `frontend/src/js/utils/`.
12. Tạo thư mục `frontend/src/components/`.
13. Tạo thư mục `frontend/src/services/`.

### File cần tạo

- Cấu trúc thư mục

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

### Kiểm thử

- **Kiểm thử chức năng**: Kiểm tra thư mục tồn tại.
- **Kết quả mong đợi**: Thư mục đúng cấu trúc.

### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M1-T6

### Thông tin

- **ID**: M1-T6
- **Tên**: Tạo Shared Utilities - Response Format
- **Milestone**: M1
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-019, FR-020, FR-021, FR-022, FR-023, FR-024, FR-025, FR-026, FR-027, FR-028, FR-029, FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-037, FR-038, FR-039, FR-040, FR-041, FR-042, FR-043, FR-044, FR-045, FR-046, FR-047, FR-048, FR-049, FR-050, FR-051, FR-052, FR-053
- **Module**: Utils
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M1-T1

### Mục tiêu

Tạo hàm format response chuẩn JSON thống nhất cho toàn bộ API.

### Điều kiện bắt đầu

M1-T1 hoàn thành.

### Công việc cần thực hiện

1. Tạo file `backend/src/utils/response.js`.
2. Tạo hàm `successResponse(res, data, message = 'Success', statusCode = 200)`:
   - Format: `{ success: true, message, data }`.
3. Tạo hàm `errorResponse(res, message = 'Error', statusCode = 500)`:
   - Format: `{ success: false, message }`.
4. Tạo hàm `createdResponse(res, data, message = 'Created')`:
   - Status 201.
5. Export tất cả hàm.

### File cần tạo

- `backend/src/utils/response.js`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Utils

### Database liên quan

Không.

### Frontend liên quan

Không.

### Kết quả mong đợi

Response đúng format: `{ success: true, message, data }` và `{ success: false, message }`.

### Acceptance Criteria

1. `successResponse` trả về JSON với success=true.
2. `errorResponse` trả về JSON với success=false.
3. `createdResponse` trả về status 201.
4. Định dạng khớp với requirements.md section 5.4.

### Kiểm thử

- **Kiểm thử chức năng**: Gọi từng hàm, kiểm tra response format.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Không.
- **Kết quả mong đợi**: Format JSON đúng chuẩn.

### Checklist

- [ ] Database
- [x] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M1-T7

### Thông tin

- **ID**: M1-T7
- **Tên**: Tạo Shared Utilities - Logger
- **Milestone**: M1
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-019, FR-020, FR-021, FR-022, FR-023, FR-024, FR-025, FR-026, FR-027, FR-028, FR-029, FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-037, FR-038, FR-039, FR-040, FR-041, FR-042, FR-043, FR-044, FR-045, FR-046, FR-047, FR-048, FR-049, FR-050, FR-051, FR-052, FR-053
- **Module**: Utils
- **Priority**: P1
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M1-T1

### Mục tiêu

Tạo logger với các mức log: INFO, WARN, ERROR, format timestamp, hỗ trợ log ra console/file.

### Điều kiện bắt đầu

M1-T1 hoàn thành.

### Công việc cần thực hiện

1. Tạo file `backend/src/utils/logger.js`.
2. Định nghĩa log levels: INFO, WARN, ERROR.
3. Hàm `info(message, context = {})`: ghi log INFO.
4. Hàm `warn(message, context = {})`: ghi log WARN.
5. Hàm `error(message, context = {})`: ghi log ERROR.
6. Mỗi log entry format: `[timestamp] [LEVEL] message {context}`.
7. Trong development: log ra console (console.log/console.error).
8. Trong production: có thể log ra file.
9. Export các hàm.

### File cần tạo

- `backend/src/utils/logger.js`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Utils

### Database liên quan

Không.

### Frontend liên quan

Không.

### Kết quả mong đợi

Logger ghi được timestamp, level, message; có thể dùng trong toàn bộ Backend.

### Acceptance Criteria

1. Logger ghi được 3 mức: INFO, WARN, ERROR.
2. Timestamp được ghi trong mỗi log entry.
3. Hỗ trợ context object trong log.
4. Không log password, token, API key.

### Kiểm thử

- **Kiểm thử chức năng**: Gọi info, warn, error, kiểm tra output.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Không.
- **Kết quả mong đợi**: Logger hoạt động đúng.

### Checklist

- [ ] Database
- [x] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M1-T8

### Thông tin

- **ID**: M1-T8
- **Tên**: Cấu hình Frontend Base
- **Milestone**: M1
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-019, FR-020, FR-021, FR-022, FR-023, FR-024, FR-025, FR-026, FR-027, FR-028, FR-029, FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-037, FR-038, FR-039, FR-040, FR-041, FR-042, FR-043, FR-044, FR-045, FR-046, FR-047, FR-048, FR-049, FR-050, FR-051, FR-052, FR-053
- **Module**: Project Setup
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M1-T5

### Mục tiêu

Tạo HTTP client wrapper sử dụng fetch(), tự động gắn JWT token, xử lý response/error.

### Điều kiện bắt đầu

M1-T5 hoàn thành (có cấu trúc thư mục frontend).

### Công việc cần thực hiện

1. Tạo file `frontend/src/services/api.js`.
2. Định nghĩa BASE_URL (mặc định `http://localhost:3000/api`).
3. Tạo hàm `request(endpoint, options = {})`:
   - Lấy token từ localStorage.
   - Tự động gắn `Authorization: Bearer <token>` nếu có.
   - Set headers: `Content-Type: application/json`.
   - Gọi fetch() với endpoint = BASE_URL + endpoint.
   - Parse JSON response.
   - Xử lý lỗi HTTP: 401 → xóa token, redirect login. 403 → hiển thị thông báo.
4. Tạo các wrapper: `get(endpoint)`, `post(endpoint, data)`, `put(endpoint, data)`, `patch(endpoint, data)`, `del(endpoint)`.
5. Export api object với các phương thức trên.
6. Tạo file `frontend/src/services/authService.js`:
   - `login(email, password)`: gọi POST /api/auth/login, lưu token.
   - `register(email, password, confirmPassword)`: gọi POST /api/auth/register, lưu token.
   - `logout()`: xóa token khỏi localStorage.
   - `getToken()`: lấy token từ localStorage.
   - `setToken(token)`: lưu token vào localStorage.
   - `removeToken()`: xóa token.
   - `isAuthenticated()`: kiểm tra token tồn tại.
   - `getCurrentUser()`: lấy thông tin user từ localStorage.

### File cần tạo

- `frontend/src/services/api.js`
- `frontend/src/services/authService.js`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Services

### Database liên quan

Không.

### Frontend liên quan

- Services

### Kết quả mong đợi

api.js gọi được API Backend, tự động gắn Authorization header, parse JSON response. authService.js quản lý token và authentication.

### Acceptance Criteria

1. api.js gọi được GET/POST/PUT/DELETE API.
2. Tự động gắn JWT token vào header.
3. Tự động parse JSON response.
4. Xử lý 401: xóa token, redirect login.
5. authService.js có đủ hàm login, register, logout, getToken, setToken, removeToken, isAuthenticated, getCurrentUser.

### Kiểm thử

- **Kiểm thử chức năng**: Gọi thử api.get() đến API public. Kiểm tra authService.login/register hoạt động.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Gọi API không có token → xử lý 401.
- **Kết quả mong đợi**: api.js và authService.js hoạt động đúng.

### Checklist

- [ ] Database
- [x] Backend
- [x] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

# Milestone 2: Authentication & Profile

## Task M2-T1

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

### Điều kiện bắt đầu

M1-T2 hoàn thành (có kết nối database).

### Công việc cần thực hiện

1. Tạo file `backend/src/models/userModel.js`.
2. Import pool từ `config/db.js`.
3. Tạo hàm `findByEmail(email)`: SELECT * FROM users WHERE email = ?.
4. Tạo hàm `findById(id)`: SELECT * FROM users WHERE id = ?.
5. Tạo hàm `create({ username, email, password, fullname })`: INSERT INTO users.
6. Tạo hàm `updatePassword(id, newPasswordHash)`: UPDATE users SET password = ? WHERE id = ?.
7. Tạo hàm `updateProfile(id, { fullname, avatar })`: UPDATE users SET ... WHERE id = ?.
8. Tạo hàm `updateRoadmap(id, roadmapId)`: UPDATE users SET roadmap_id = ? WHERE id = ?.
9. Tạo hàm `updateStreak(id, streak, lastStudyDate)`: UPDATE users SET streak = ?, last_study_date = ? WHERE id = ?.
10. Tất cả hàm sử dụng Prepared Statements, trả về Promise.
11. Sử dụng destructuring để lấy rows từ query result.

### File cần tạo

- `backend/src/models/userModel.js`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Models

### Database liên quan

- Table: users
- Fields: id, username, email, password, fullname, avatar, role, roadmap_id, streak, last_study_date

### Frontend liên quan

Không.

### Kết quả mong đợi

Model có đủ 6 hàm CRUD cơ bản, dùng Prepared Statements, trả về Promise.

### Acceptance Criteria

1. Có đủ hàm: findByEmail, findById, create, updatePassword, updateProfile, updateRoadmap, updateStreak.
2. Tất cả hàm dùng Prepared Statements (không concatenate SQL).
3. Mỗi hàm trả về Promise.
4. create trả về id của user mới tạo.

### Kiểm thử

- **Kiểm thử chức năng**: Gọi từng hàm, kiểm tra query đúng.
- **Kiểm thử dữ liệu**: INSERT user, SELECT user, UPDATE user.
- **Kiểm thử lỗi**: Email không tồn tại → findByEmail trả về null.
- **Kết quả mong đợi**: Model hoạt động, Prepared Statements chống SQL Injection.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M2-T2

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

### Điều kiện bắt đầu

M2-T1 hoàn thành (có User Model).

### Công việc cần thực hiện

1. Tạo file `backend/src/controllers/authController.js`.
2. Tạo file `backend/src/routes/authRoutes.js`.
3. Trong controller.auth.register:
   - Lấy email, password, confirmPassword từ req.body.
   - Validate: email format (regex), password >= 8 ký tự, confirmPassword === password.
   - Kiểm tra email đã tồn tại: gọi userModel.findByEmail → nếu có → 409 Conflict.
   - Hash password bằng bcrypt (salt rounds = 10).
   - Tạo user mới: gọi userModel.create với role='user', streak=0.
   - Tạo JWT token: jwt.sign({ user_id, email, role }, JWT_SECRET, { expiresIn: '24h' }).
   - Trả về response: { success: true, message: "Đăng ký thành công", data: { user_id, email } }.
4. Trong route: POST /api/auth/register → authController.register.
5. Format response theo spec 7.1.

### File cần tạo

- `backend/src/controllers/authController.js`
- `backend/src/routes/authRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount authRoutes)

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: users
- INSERT: email, password (hashed), role='user', streak=0

### Frontend liên quan

Không.

### Kết quả mong đợi

Đăng ký thành công → 201 + JWT. Email trùng → 409. Validation lỗi → 400. Password hashed bằng bcrypt.

### Acceptance Criteria

1. Đăng ký thành công → status 201, trả về JWT token.
2. Email đã tồn tại → status 409, message "Email đã tồn tại".
3. Password < 8 ký tự → status 400, message validation.
4. Email không đúng format → status 400.
5. Password không khớp confirm → status 400.
6. Password được hash bằng bcrypt trước khi lưu.
7. Role mặc định là 'user', streak = 0.

### Kiểm thử

- **Kiểm thử chức năng**: POST /api/auth/register với dữ liệu hợp lệ → 201 + JWT.
- **Kiểm thử dữ liệu**: Kiểm tra user được tạo trong DB, password đã hash.
- **Kiểm thử lỗi**: Email trùng → 409. Password ngắn → 400. Email sai format → 400.
- **Kết quả mong đợi**: API register hoạt động đúng spec.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [x] Validation
- [x] Testing
- [ ] Documentation

---

## Task M2-T3

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

Tạo route POST /api/auth/login + controller. Kiểm tra email, so sánh password, tạo JWT, kiểm tra roadmap_id để redirect.

### Điều kiện bắt đầu

M2-T1 hoàn thành (có User Model).

### Công việc cần thực hiện

1. Trong authController, thêm hàm `login`.
2. Lấy email, password từ req.body.
3. Gọi userModel.findByEmail(email).
4. Nếu không tìm thấy → 401 "Email hoặc mật khẩu không đúng".
5. So sánh password với hash: bcrypt.compare(password, user.password).
6. Nếu sai → 401 "Email hoặc mật khẩu không đúng".
7. Tạo JWT token: jwt.sign({ user_id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' }).
8. Trả về response: { success: true, data: { token, user: { id, email, role, roadmap_id, streak } } }.
9. Format response theo spec 7.2.
10. Trong route: POST /api/auth/login → authController.login.

### File cần chỉnh sửa

- `backend/src/controllers/authController.js`
- `backend/src/routes/authRoutes.js`

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: users
- SELECT: email, password, role, roadmap_id, streak

### Frontend liên quan

Không.

### Kết quả mong đợi

Đăng nhập đúng → 200 + JWT + user info. Sai email/password → 401.

### Acceptance Criteria

1. Đăng nhập đúng email/password → 200 + JWT + user info (id, email, role, roadmap_id, streak).
2. Sai email hoặc sai password → 401 "Email hoặc mật khẩu không đúng".
3. Token chứa user_id, email, role.
4. Token có thời hạn 24h.

### Kiểm thử

- **Kiểm thử chức năng**: POST /api/auth/login với email/password đúng → 200 + token.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Sai email → 401. Sai password → 401.
- **Kết quả mong đợi**: API login hoạt động đúng spec.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [x] Validation
- [x] Testing
- [ ] Documentation

---

## Task M2-T4

### Thông tin

- **ID**: M2-T4
- **Tên**: API Đổi mật khẩu
- **Milestone**: M2
- **User Story**: US-09
- **Functional Requirement**: FR-005
- **Module**: Authentication
- **Priority**: P1
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M2-T5

### Mục tiêu

Tạo route PUT/PATCH /api/auth/change-password + controller (yêu cầu authMiddleware). Kiểm tra password cũ, hash password mới.

### Điều kiện bắt đầu

M2-T5 hoàn thành (có authMiddleware).

### Công việc cần thực hiện

1. Trong authController, thêm hàm `changePassword`.
2. Yêu cầu authMiddleware (gắn trong route).
3. Lấy oldPassword, newPassword từ req.body.
4. Lấy user từ DB: userModel.findById(req.user.user_id).
5. Kiểm tra oldPassword: bcrypt.compare(oldPassword, user.password).
6. Nếu sai → 400 "Mật khẩu cũ không đúng".
7. Validate newPassword >= 8 ký tự.
8. Hash newPassword bằng bcrypt.
9. Gọi userModel.updatePassword(user.id, newHash).
10. Trả về success.
11. Trong route: PUT /api/auth/change-password → authMiddleware → authController.changePassword.

### File cần chỉnh sửa

- `backend/src/controllers/authController.js`
- `backend/src/routes/authRoutes.js`

### Thành phần liên quan

- Controllers
- Routes
- Middleware (authMiddleware)

### Database liên quan

- Table: users
- UPDATE: password

### Frontend liên quan

Không.

### Kết quả mong đợi

Đổi mật khẩu thành công → 200. Sai password cũ → 400.

### Acceptance Criteria

1. Đổi mật khẩu thành công → 200.
2. Sai password cũ → 400 "Mật khẩu cũ không đúng".
3. Password mới < 8 ký tự → 400.
4. Yêu cầu authMiddleware (cần JWT).

### Kiểm thử

- **Kiểm thử chức năng**: PUT /api/auth/change-password với dữ liệu đúng → 200.
- **Kiểm thử dữ liệu**: Kiểm tra password đã được hash mới trong DB.
- **Kiểm thử lỗi**: Sai password cũ → 400. Thiếu token → 401.
- **Kết quả mong đợi**: API change password hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [x] Validation
- [x] Testing
- [ ] Documentation

---

## Task M2-T5

### Thông tin

- **ID**: M2-T5
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

Tạo middleware xác thực JWT: lấy token từ header, verify, gắn req.user.

### Điều kiện bắt đầu

M2-T3 hoàn thành (có JWT được tạo từ login).

### Công việc cần thực hiện

1. Tạo file `backend/src/middleware/authMiddleware.js`.
2. Lấy token từ header `Authorization: Bearer <token>`.
3. Nếu không có token → 401 "Unauthorized".
4. Verify token với JWT_SECRET.
5. Nếu token hết hạn hoặc không hợp lệ → 401 "Unauthorized".
6. Giải mã token, gắn `req.user = { id: user_id, email, role }`.
7. Gọi next().
8. Export middleware function.

### File cần tạo

- `backend/src/middleware/authMiddleware.js`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Middleware

### Database liên quan

Không.

### Frontend liên quan

Không.

### Kết quả mong đợi

Token hợp lệ → req.user có dữ liệu. Token hết hạn → 401.

### Acceptance Criteria

1. Token hợp lệ → req.user có { id, email, role }.
2. Thiếu token → 401.
3. Token hết hạn → 401.
4. Token sai → 401.

### Kiểm thử

- **Kiểm thử chức năng**: Gọi API với token hợp lệ → pass middleware.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Không token → 401. Token hết hạn → 401. Token sai → 401.
- **Kết quả mong đợi**: Middleware hoạt động đúng.

### Checklist

- [ ] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [x] Testing
- [ ] Documentation

---

## Task M2-T6

### Thông tin

- **ID**: M2-T6
- **Tên**: Tạo adminMiddleware
- **Milestone**: M2
- **User Story**: US-07
- **Functional Requirement**: FR-004
- **Module**: Authentication
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M2-T5

### Mục tiêu

Tạo middleware kiểm tra role admin: nếu không phải admin → 403.

### Điều kiện bắt đầu

M2-T5 hoàn thành (có authMiddleware).

### Công việc cần thực hiện

1. Tạo file `backend/src/middleware/adminMiddleware.js`.
2. Kiểm tra `req.user.role === 'admin'`.
3. Nếu không phải admin → 403 "Forbidden".
4. Nếu là admin → next().
5. Export middleware function.

### File cần tạo

- `backend/src/middleware/adminMiddleware.js`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Middleware

### Database liên quan

Không.

### Frontend liên quan

Không.

### Kết quả mong đợi

Role admin → next(). Role user → 403.

### Acceptance Criteria

1. Admin → next(), cho phép truy cập.
2. User → 403 Forbidden.
3. Thiếu auth → 401 (authMiddleware xử lý trước).

### Kiểm thử

- **Kiểm thử chức năng**: Gọi API admin với token admin → pass. Với token user → 403.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: User → 403.
- **Kết quả mong đợi**: Middleware hoạt động đúng.

### Checklist

- [ ] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [x] Testing
- [ ] Documentation

---

## Task M2-T7

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
- **Dependencies**: M2-T5, M2-T1

### Mục tiêu

Tạo route GET /api/profile + controller (yêu cầu authMiddleware). Trả về thông tin user.

### Điều kiện bắt đầu

M2-T5, M2-T1 hoàn thành.

### Công việc cần thực hiện

1. Tạo file `backend/src/controllers/userController.js`.
2. Tạo file `backend/src/routes/userRoutes.js`.
3. Trong userController, hàm `getProfile`:
   - Lấy req.user.id.
   - Gọi userModel.findById(id).
   - Trả về: id, email, fullname, avatar, role, roadmap_id, streak, last_study_date.
4. Trong route: GET /api/profile → authMiddleware → userController.getProfile.

### File cần tạo

- `backend/src/controllers/userController.js`
- `backend/src/routes/userRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount userRoutes)

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: users
- SELECT: id, email, fullname, avatar, role, roadmap_id, streak, last_study_date

### Frontend liên quan

Không.

### Kết quả mong đợi

GET /api/profile → 200 + thông tin user.

### Acceptance Criteria

1. GET /api/profile → 200 + user info.
2. Yêu cầu authMiddleware.
3. Không trả về password.

### Kiểm thử

- **Kiểm thử chức năng**: GET /api/profile với token hợp lệ → 200 + thông tin.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Không token → 401.
- **Kết quả mong đợi**: API profile hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M2-T8

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
- **Dependencies**: M2-T5, M2-T1

### Mục tiêu

Tạo route PUT /api/profile + controller (yêu cầu authMiddleware). Cho phép cập nhật fullname.

### Điều kiện bắt đầu

M2-T5, M2-T1 hoàn thành.

### Công việc cần thực hiện

1. Trong userController, thêm hàm `updateProfile`.
2. Lấy fullname từ req.body.
3. Validate: fullname không rỗng (nếu có).
4. Gọi userModel.updateProfile(req.user.id, { fullname }).
5. Trả về success + dữ liệu cập nhật.
6. Trong route: PUT /api/profile → authMiddleware → userController.updateProfile.

### File cần chỉnh sửa

- `backend/src/controllers/userController.js`
- `backend/src/routes/userRoutes.js`

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: users
- UPDATE: fullname

### Frontend liên quan

Không.

### Kết quả mong đợi

PUT /api/profile → 200 + dữ liệu cập nhật.

### Acceptance Criteria

1. PUT /api/profile với fullname hợp lệ → 200.
2. Yêu cầu authMiddleware.
3. Chỉ cập nhật fullname (không ảnh hưởng các trường khác).

### Kiểm thử

- **Kiểm thử chức năng**: PUT /api/profile → 200 + dữ liệu cập nhật.
- **Kiểm thử dữ liệu**: Kiểm tra fullname trong DB đã thay đổi.
- **Kiểm thử lỗi**: Không token → 401.
- **Kết quả mong đợi**: API update profile hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M2-T9

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
- **Dependencies**: M2-T5, M2-T1, M3-T1

### Mục tiêu

Tạo route PUT /api/profile/roadmap + controller (yêu cầu authMiddleware). Input: roadmap_id. Kiểm tra roadmap tồn tại, cập nhật.

### Điều kiện bắt đầu

M2-T5, M2-T1, M3-T1 hoàn thành.

### Công việc cần thực hiện

1. Trong userController, thêm hàm `updateRoadmap`.
2. Lấy roadmap_id từ req.body.
3. Validate roadmap_id là integer > 0.
4. Kiểm tra roadmap tồn tại: gọi roadmapModel.findById (hoặc query trực tiếp).
5. Nếu không tồn tại → 404 "Roadmap không tồn tại".
6. Gọi userModel.updateRoadmap(req.user.id, roadmap_id).
7. Trả về success: { success: true, data: { user_id, roadmap_id } }.
8. Format response theo spec 7.3.
9. Trong route: PUT /api/profile/roadmap → authMiddleware → userController.updateRoadmap.

### File cần chỉnh sửa

- `backend/src/controllers/userController.js`
- `backend/src/routes/userRoutes.js`

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: users (UPDATE roadmap_id)
- Table: roadmaps (SELECT by id)

### Frontend liên quan

Không.

### Kết quả mong đợi

PUT success → 200. Roadmap không tồn tại → 404.

### Acceptance Criteria

1. PUT /api/profile/roadmap với roadmap_id hợp lệ → 200.
2. Roadmap_id không tồn tại → 404.
3. Roadmap_id không phải integer → 400.
4. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: PUT với roadmap_id hợp lệ → 200.
- **Kiểm thử dữ liệu**: Kiểm tra roadmap_id trong users đã thay đổi.
- **Kiểm thử lỗi**: Roadmap_id không tồn tại → 404. Không token → 401.
- **Kết quả mong đợi**: API update roadmap hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [x] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M2-T10

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
- **Dependencies**: M1-T8, M2-T3

### Mục tiêu

Tạo trang đăng nhập với form email, password, gọi API login, lưu JWT, redirect phù hợp.

### Điều kiện bắt đầu

M1-T8 (api.js, authService.js), M2-T3 (API login) hoàn thành.

### Công việc cần thực hiện

1. Tạo file `frontend/src/pages/auth/login.html`:
   - Form đăng nhập: email (input type email), password (input type password), nút submit.
   - Hiển thị lỗi validation dưới mỗi field.
   - Link đến trang đăng ký.
   - Sử dụng Tailwind CSS.
2. Tạo file `frontend/src/js/pages/login.js`:
   - DOMContentLoaded: lấy form elements.
   - Xử lý submit: preventDefault, lấy email, password.
   - Validate: email format, password không rỗng.
   - Gọi authService.login(email, password).
   - Thành công: lưu JWT (authService đã lưu), kiểm tra user.roadmap_id.
     - Nếu roadmap_id === null → redirect đến onboarding.html.
     - Nếu roadmap_id !== null → redirect đến dashboard.html.
   - Thất bại: hiển thị lỗi từ API response (401 message).
3. Sử dụng api.js và authService.js.

### File cần tạo

- `frontend/src/pages/auth/login.html`
- `frontend/src/js/pages/login.js`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Pages
- Services

### Database liên quan

Không.

### Frontend liên quan

- HTML: form login.
- JS: login logic.
- Service: authService.js, api.js.

### Kết quả mong đợi

Form login hiển thị, gọi API thành công, lưu token, redirect. Sai thông tin → hiển thị lỗi.

### Acceptance Criteria

1. Form login hiển thị với email, password, nút submit.
2. Validate: email format, password không rỗng.
3. Gọi POST /api/auth/login thành công → lưu token → redirect (dashboard nếu có roadmap, onboarding nếu chưa).
4. Sai email/password → hiển thị lỗi "Email hoặc mật khẩu không đúng".
5. Validation lỗi → hiển thị lỗi dưới field.

### Kiểm thử

- **Kiểm thử chức năng**: Nhập email/password đúng → redirect dashboard/onboarding.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Sai password → hiển thị lỗi. Email rỗng → validation.
- **Kết quả mong đợi**: Trang login hoạt động đúng.

### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [x] API
- [x] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M2-T11

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
- **Dependencies**: M1-T8, M2-T2

### Mục tiêu

Tạo trang đăng ký với form email, password, confirm password, gọi API register, lưu JWT, redirect sang chọn lộ trình.

### Điều kiện bắt đầu

M1-T8, M2-T2 hoàn thành.

### Công việc cần thực hiện

1. Tạo file `frontend/src/pages/auth/register.html`:
   - Form: email, password, confirm password, nút submit.
   - Hiển thị lỗi dưới mỗi field.
   - Link đến trang login.
   - Sử dụng Tailwind CSS.
2. Tạo file `frontend/src/js/pages/register.js`:
   - Validate: email format, password >= 8, confirm password match.
   - Gọi authService.register(email, password, confirmPassword).
   - Thành công: lưu JWT, redirect đến onboarding.html.
   - Thất bại: hiển thị lỗi từ API.

### File cần tạo

- `frontend/src/pages/auth/register.html`
- `frontend/src/js/pages/register.js`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Pages
- Services

### Database liên quan

Không.

### Frontend liên quan

- HTML: form register.
- JS: register logic.
- Service: authService.js, api.js.

### Kết quả mong đợi

Form register hiển thị, validate đúng, gọi API, lưu token. Lỗi validation → hiển thị lỗi.

### Acceptance Criteria

1. Form register hiển thị với email, password, confirm password, nút submit.
2. Validate: email format, password >= 8, confirm match.
3. Gọi API thành công → lưu token → redirect onboarding.
4. Email đã tồn tại → hiển thị lỗi "Email đã tồn tại".
5. Validation lỗi → hiển thị lỗi dưới field.

### Kiểm thử

- **Kiểm thử chức năng**: Nhập dữ liệu hợp lệ → redirect onboarding.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Email trùng → hiển thị lỗi. Password ngắn → validation.
- **Kết quả mong đợi**: Trang register hoạt động đúng.

### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [x] API
- [x] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M2-T12

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
- **Dependencies**: M1-T8, M2-T7, M2-T8, M2-T9

### Mục tiêu

Tạo trang Profile hiển thị thông tin cá nhân, form đổi mật khẩu, nút đăng xuất, chức năng đổi lộ trình.

### Điều kiện bắt đầu

M1-T8, M2-T7, M2-T8, M2-T9 hoàn thành.

### Công việc cần thực hiện

1. Tạo file `frontend/src/pages/profile/profile.html`:
   - Header với avatar + tên.
   - Section "Thông tin cá nhân": hiển thị email, fullname.
   - Section "Đổi mật khẩu": form old password, new password, confirm new password.
   - Section "Lộ trình học tập": dropdown/list roadmap, nút lưu.
   - Nút "Đăng xuất".
   - Bottom navigation.
   - Sử dụng Tailwind CSS.
2. Tạo file `frontend/src/js/pages/profile.js`:
   - DOMContentLoaded: gọi GET /api/profile → hiển thị thông tin.
   - Gọi GET /api/roadmaps → hiển thị danh sách roadmap để chọn.
   - Xử lý submit đổi mật khẩu: validate, gọi PUT /api/auth/change-password → toast.
   - Xử lý đổi roadmap: gọi PUT /api/profile/roadmap → toast.
   - Xử lý đăng xuất: xóa token, redirect login.

### File cần tạo

- `frontend/src/pages/profile/profile.html`
- `frontend/src/js/pages/profile.js`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Pages
- Services

### Database liên quan

Không.

### Frontend liên quan

- HTML: profile page.
- JS: profile logic.
- Service: authService.js, api.js.

### Kết quả mong đợi

Hiển thị thông tin user. Đổi password thành công → toast. Đăng xuất → redirect login. Đổi roadmap → cập nhật.

### Acceptance Criteria

1. Hiển thị thông tin user (email, fullname) từ API.
2. Form đổi mật khẩu: validate, gọi API, toast thành công/lỗi.
3. Dropdown roadmap: hiển thị danh sách roadmap, chọn → gọi API → toast.
4. Nút đăng xuất: xóa token, redirect login.
5. Bottom navigation hiển thị.

### Kiểm thử

- **Kiểm thử chức năng**: Load profile, đổi password, đổi roadmap, logout.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Sai password cũ → toast lỗi.
- **Kết quả mong đợi**: Trang profile hoạt động đúng.

### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [x] API
- [x] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M2-T13

### Thông tin

- **ID**: M2-T13
- **Tên**: Tạo authService Frontend
- **Milestone**: M2
- **User Story**: US-01, US-02
- **Functional Requirement**: FR-001, FR-002, FR-003, FR-006
- **Module**: Authentication
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M1-T8

### Mục tiêu

Tạo service quản lý authentication phía Frontend: login, register, logout, token management.

### Điều kiện bắt đầu

M1-T8 hoàn thành (có api.js).

### Công việc cần thực hiện

1. Tạo file `frontend/src/services/authService.js`.
2. Hàm `login(email, password)`: gọi api.post('/auth/login', { email, password }), lưu token + user info vào localStorage.
3. Hàm `register(email, password, confirmPassword)`: gọi api.post('/auth/register', { email, password, confirmPassword }), lưu token + user info.
4. Hàm `logout()`: xóa token, user info khỏi localStorage.
5. Hàm `getToken()`: lấy token từ localStorage.
6. Hàm `setToken(token)`: lưu token.
7. Hàm `removeToken()`: xóa token.
8. Hàm `isAuthenticated()`: kiểm tra token tồn tại.
9. Hàm `getCurrentUser()`: lấy user info từ localStorage.

### File cần tạo

- `frontend/src/services/authService.js`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Services

### Database liên quan

Không.

### Frontend liên quan

- Service: authService.js.

### Kết quả mong đợi

Các hàm login, register, getToken, isAuthenticated hoạt động đúng.

### Acceptance Criteria

1. login() gọi API, lưu token + user vào localStorage.
2. register() gọi API, lưu token + user.
3. logout() xóa token + user khỏi localStorage.
4. getToken() trả về token.
5. isAuthenticated() trả về true/false.
6. getCurrentUser() trả về user object.

### Kiểm thử

- **Kiểm thử chức năng**: Gọi từng hàm, kiểm tra localStorage.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Không.
- **Kết quả mong đợi**: Service hoạt động đúng.

### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

# Milestone 3: Roadmap, Topic & Vocabulary

## Task M3-T1

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

Tạo route GET /api/roadmaps trả về danh sách roadmap active, sắp xếp theo sort_order.

### Điều kiện bắt đầu

M1-T2 hoàn thành.

### Công việc cần thực hiện

1. Tạo file `backend/src/controllers/roadmapController.js`.
2. Tạo file `backend/src/routes/roadmapRoutes.js`.
3. Hàm `getAll`: SELECT id, name, description, image, is_active, sort_order FROM roadmaps WHERE is_active = 1 ORDER BY sort_order ASC.
4. Route: GET /api/roadmaps (public, không yêu cầu auth).
5. Trả về danh sách.

### File cần tạo

- `backend/src/controllers/roadmapController.js`
- `backend/src/routes/roadmapRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount roadmapRoutes)

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: roadmaps
- Fields: id, name, description, image, is_active, sort_order

### Frontend liên quan

Không.

### Kết quả mong đợi

GET /api/roadmaps → 200 + danh sách roadmaps active.

### Acceptance Criteria

1. GET /api/roadmaps → 200 + danh sách roadmap (is_active = 1).
2. Sắp xếp theo sort_order ASC.
3. Không yêu cầu xác thực.

### Kiểm thử

- **Kiểm thử chức năng**: GET /api/roadmaps → danh sách.
- **Kiểm thử dữ liệu**: Kiểm tra chỉ roadmap active được trả về.
- **Kiểm thử lỗi**: Không.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M3-T2

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

Tạo route GET /api/roadmaps/:id trả về chi tiết roadmap.

### Điều kiện bắt đầu

M3-T1 hoàn thành.

### Công việc cần thực hiện

1. Trong roadmapController, thêm hàm `getById`.
2. SELECT * FROM roadmaps WHERE id = ?.
3. Nếu không tìm thấy → 404.
4. Trả về chi tiết roadmap.
5. Route: GET /api/roadmaps/:id.

### File cần chỉnh sửa

- `backend/src/controllers/roadmapController.js`
- `backend/src/routes/roadmapRoutes.js`

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: roadmaps

### Frontend liên quan

Không.

### Kết quả mong đợi

GET /api/roadmaps/1 → 200. Không tồn tại → 404.

### Acceptance Criteria

1. GET /api/roadmaps/:id → 200 + chi tiết roadmap.
2. ID không tồn tại → 404.

### Kiểm thử

- **Kiểm thử chức năng**: GET /api/roadmaps/1 → 200.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: ID không tồn tại → 404.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M3-T3

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
- **Dependencies**: M1-T2, M2-T5

### Mục tiêu

Tạo route GET /api/topics + controller. Query param: roadmap_id (bắt buộc). Yêu cầu auth.

### Điều kiện bắt đầu

M1-T2, M2-T5 hoàn thành.

### Công việc cần thực hiện

1. Tạo file `backend/src/models/topicModel.js`.
2. Hàm `getByRoadmapId(roadmapId)`: SELECT * FROM topics WHERE roadmap_id = ? AND is_active = 1 ORDER BY sort_order ASC.
3. Tạo file `backend/src/controllers/topicController.js`.
4. Hàm `getAll`: lấy roadmap_id từ req.query. Validate roadmap_id tồn tại. Gọi topicModel.getByRoadmapId.
5. Tạo file `backend/src/routes/topicRoutes.js`.
6. Route: GET /api/topics?roadmap_id=x → authMiddleware → topicController.getAll.

### File cần tạo

- `backend/src/models/topicModel.js`
- `backend/src/controllers/topicController.js`
- `backend/src/routes/topicRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount topicRoutes)

### Thành phần liên quan

- Controllers
- Routes
- Models

### Database liên quan

- Table: topics
- Fields: id, roadmap_id, name, description, image, is_active, sort_order

### Frontend liên quan

Không.

### Kết quả mong đợi

GET /api/topics?roadmap_id=1 → 200 + danh sách topics active.

### Acceptance Criteria

1. GET /api/topics?roadmap_id=1 → 200 + danh sách topics (is_active=1).
2. Thiếu roadmap_id → 400.
3. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: GET với roadmap_id hợp lệ → danh sách.
- **Kiểm thử dữ liệu**: Kiểm tra chỉ topic active và đúng roadmap_id.
- **Kiểm thử lỗi**: Thiếu roadmap_id → 400. Không token → 401.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [x] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M3-T4

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

### Mục tiêu

Tạo route GET /api/topics/:id trả về chi tiết topic.

### Điều kiện bắt đầu

M3-T3 hoàn thành.

### Công việc cần thực hiện

1. Trong topicController, thêm hàm `getById`.
2. SELECT * FROM topics WHERE id = ?.
3. Nếu không tìm thấy → 404.
4. Route: GET /api/topics/:id → authMiddleware.

### File cần chỉnh sửa

- `backend/src/controllers/topicController.js`
- `backend/src/routes/topicRoutes.js`

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: topics

### Frontend liên quan

Không.

### Kết quả mong đợi

GET /api/topics/1 → 200. Không tồn tại → 404.

### Acceptance Criteria

1. GET /api/topics/:id → 200.
2. ID không tồn tại → 404.
3. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: GET /api/topics/1 → 200.
- **Kiểm thử lỗi**: ID không tồn tại → 404.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M3-T5

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
- **Dependencies**: M1-T2, M2-T5

### Mục tiêu

Tạo route GET /api/vocabularies + controller. Query param: topic_id (bắt buộc). Yêu cầu auth.

### Điều kiện bắt đầu

M1-T2, M2-T5 hoàn thành.

### Công việc cần thực hiện

1. Tạo file `backend/src/models/vocabularyModel.js`.
2. Hàm `getByTopicId(topicId)`: SELECT id, word, pronunciation, audio, image, part_of_speech, meaning, example, example_meaning FROM vocabularies WHERE topic_id = ?.
3. Tạo file `backend/src/controllers/vocabularyController.js`.
4. Hàm `getAll`: lấy topic_id từ req.query. Validate. Gọi vocabularyModel.getByTopicId.
5. Tạo file `backend/src/routes/vocabularyRoutes.js`.
6. Route: GET /api/vocabularies?topic_id=x → authMiddleware → vocabularyController.getAll.

### File cần tạo

- `backend/src/models/vocabularyModel.js`
- `backend/src/controllers/vocabularyController.js`
- `backend/src/routes/vocabularyRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount vocabularyRoutes)

### Thành phần liên quan

- Controllers
- Routes
- Models

### Database liên quan

- Table: vocabularies
- Fields: id, topic_id, word, pronunciation, audio, image, part_of_speech, meaning, example, example_meaning

### Frontend liên quan

Không.

### Kết quả mong đợi

GET /api/vocabularies?topic_id=1 → 200 + danh sách từ vựng.

### Acceptance Criteria

1. GET /api/vocabularies?topic_id=1 → 200 + danh sách từ vựng.
2. Thiếu topic_id → 400.
3. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: GET với topic_id hợp lệ → danh sách.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Thiếu topic_id → 400. Không token → 401.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [x] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M3-T6

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

### Mục tiêu

Tạo route GET /api/vocabularies/:id trả về chi tiết từ vựng.

### Điều kiện bắt đầu

M3-T5 hoàn thành.

### Công việc cần thực hiện

1. Trong vocabularyController, thêm hàm `getById`.
2. SELECT * FROM vocabularies WHERE id = ?.
3. Nếu không tìm thấy → 404.
4. Route: GET /api/vocabularies/:id → authMiddleware.

### File cần chỉnh sửa

- `backend/src/controllers/vocabularyController.js`
- `backend/src/routes/vocabularyRoutes.js`

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: vocabularies

### Frontend liên quan

Không.

### Kết quả mong đợi

GET /api/vocabularies/1 → 200 + chi tiết. Không tồn tại → 404.

### Acceptance Criteria

1. GET /api/vocabularies/:id → 200.
2. ID không tồn tại → 404.
3. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: GET /api/vocabularies/1 → 200.
- **Kiểm thử lỗi**: ID không tồn tại → 404.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M3-T7

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

### Điều kiện bắt đầu

M1-T3 hoàn thành (schema đã tạo).

### Công việc cần thực hiện

1. Tạo file SQL seed script (database/seed.sql) hoặc JavaScript seed script (backend/seed.js).
2. INSERT 3 roadmaps:
   - "Basic English", "TOEIC", "Phrasal Verb & Idiom".
   - is_active = 1, sort_order lần lượt 1, 2, 3.
3. INSERT 3+ topics cho mỗi roadmap (tối thiểu 9 topics).
4. INSERT 5+ vocabularies cho mỗi topic (tối thiểu 50 vocabularies).
5. Đảm bảo dữ liệu seed có ý nghĩa, đúng định dạng.

### File cần tạo

- `database/seed.sql` hoặc `backend/seed.js`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Database

### Database liên quan

- Tables: roadmaps, topics, vocabularies

### Frontend liên quan

Không.

### Kết quả mong đợi

3 roadmaps active, 9+ topics active, 50+ vocabularies, dữ liệu seed chạy được.

### Acceptance Criteria

1. 3 roadmaps được tạo: Basic English, TOEIC, Phrasal Verb & Idiom.
2. Mỗi roadmap có ít nhất 3 topics.
3. Mỗi topic có ít nhất 5 vocabularies.
4. Tổng số vocabularies >= 50.
5. Tất cả is_active = 1.

### Kiểm thử

- **Kiểm thử chức năng**: Chạy seed script, kiểm tra dữ liệu trong DB.
- **Kiểm thử dữ liệu**: Đếm số roadmaps, topics, vocabularies.
- **Kiểm thử lỗi**: Chạy seed nhiều lần → không bị lỗi duplicate (có thể dùng INSERT IGNORE).
- **Kết quả mong đợi**: Seed data đầy đủ.

### Checklist

- [x] Database
- [ ] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M3-T8

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
- **Dependencies**: M1-T8, M2-T13, M3-T1, M3-T3, M2-T9

### Mục tiêu

Tạo trang onboarding cho người dùng mới chọn lộ trình lần đầu, hiển thị danh sách chủ đề.

### Điều kiện bắt đầu

M1-T8, M2-T13, M3-T1, M3-T3, M2-T9 hoàn thành.

### Công việc cần thực hiện

1. Tạo file `frontend/src/pages/dashboard/onboarding.html`:
   - Bước 1: Hiển thị danh sách roadmap (card layout).
   - Bước 2: Sau khi chọn roadmap → hiển thị danh sách topics.
   - Sử dụng Tailwind CSS.
2. Tạo file `frontend/src/js/pages/onboarding.js`:
   - DOMContentLoaded: gọi GET /api/roadmaps → render danh sách.
   - Bấm chọn roadmap: gọi PUT /api/profile/roadmap → thành công → gọi GET /api/topics?roadmap_id=x → render topics.
   - Chọn topic → chuyển đến dashboard (hoặc học luôn).
3. Nếu user đã có roadmap_id (đã chọn trước đó) → redirect đến dashboard.

### File cần tạo

- `frontend/src/pages/dashboard/onboarding.html`
- `frontend/src/js/pages/onboarding.js`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Pages

### Database liên quan

Không.

### Frontend liên quan

- HTML: onboarding page.
- JS: onboarding logic.

### Kết quả mong đợi

Hiển thị danh sách roadmap. Chọn roadmap → lưu → hiển thị topics. Đã chọn roadmap → redirect dashboard.

### Acceptance Criteria

1. Hiển thị danh sách roadmap từ API.
2. Chọn roadmap → cập nhật roadmap_id → hiển thị danh sách topics.
3. Nếu roadmap_id đã có → redirect dashboard.
4. Giao diện thân thiện, rõ ràng.

### Kiểm thử

- **Kiểm thử chức năng**: Load trang → danh sách roadmap. Chọn roadmap → topics.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: API lỗi → hiển thị thông báo.
- **Kết quả mong đợi**: Onboarding hoạt động đúng.

### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M3-T9

Task này có độ phức tạp L (Large), cần chia thành các subtask.

### Subtask M3-T9.1

#### Thông tin

- **ID**: M3-T9.1
- **Tên**: Trang Dashboard - Cấu trúc HTML và CSS
- **Milestone**: M3
- **User Story**: US-03, US-04, US-05
- **Functional Requirement**: FR-009, FR-011, FR-033, FR-052
- **Module**: Dashboard
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T8, M2-T13, M3-T8

#### Mục tiêu

Tạo cấu trúc HTML và CSS cho trang Dashboard: header, streak display, topic list, bottom navigation, AI chat widget placeholder.

#### Điều kiện bắt đầu

M1-T8, M2-T13, M3-T8 hoàn thành.

#### Công việc cần thực hiện

1. Tạo file `frontend/src/pages/dashboard/dashboard.html`:
   - Header: avatar (góc trái), tên roadmap, streak display.
   - Section "Chủ đề học tập": danh sách topic dạng card/grid.
   - Bottom navigation: 3 tabs (Trang chủ, Ôn tập, Sổ tay).
   - Placeholder cho AI Chat widget.
   - Sử dụng Tailwind CSS, #FFC300.
2. Tạo file `frontend/src/css/main.css` (nếu chưa có) với các style Tailwind cơ bản.

#### File cần tạo

- `frontend/src/pages/dashboard/dashboard.html`
- `frontend/src/css/main.css`

#### File cần chỉnh sửa

Không.

#### Thành phần liên quan

- Pages
- Components (header, bottom-nav, ai-chat)

#### Database liên quan

Không.

#### Frontend liên quan

- HTML: dashboard page.
- CSS: main.css.

#### Kết quả mong đợi

Dashboard có cấu trúc HTML và CSS đầy đủ, sẵn sàng tích hợp JS.

#### Acceptance Criteria

1. Header hiển thị avatar, roadmap name, streak.
2. Section topic list dạng card.
3. Bottom navigation có 3 tabs.
4. Placeholder AI chat widget.
5. Sử dụng Tailwind CSS, màu #FFC300.

#### Kiểm thử

- **Kiểm thử chức năng**: Mở file HTML, kiểm tra layout.
- **Kết quả mong đợi**: Giao diện hiển thị đúng.

#### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

### Subtask M3-T9.2

#### Thông tin

- **ID**: M3-T9.2
- **Tên**: Trang Dashboard - JavaScript và API Integration
- **Milestone**: M3
- **User Story**: US-03, US-04, US-05
- **Functional Requirement**: FR-009, FR-011, FR-033, FR-052
- **Module**: Dashboard
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M3-T9.1

#### Mục tiêu

Tạo JavaScript cho Dashboard: gọi API lấy user info, roadmap, topics, hiển thị dữ liệu.

#### Điều kiện bắt đầu

M3-T9.1 hoàn thành.

#### Công việc cần thực hiện

1. Tạo file `frontend/src/js/pages/dashboard.js`:
   - DOMContentLoaded: kiểm tra auth (authService.isAuthenticated), nếu chưa → redirect login.
   - Gọi GET /api/profile → hiển thị avatar, streak, roadmap_id.
   - Gọi GET /api/roadmaps → tìm roadmap name từ roadmap_id → hiển thị.
   - Gọi GET /api/topics?roadmap_id=x → render danh sách topic cards.
   - Mỗi topic card: bấm vào → chuyển đến learn.html?topic_id=x.
   - Bottom navigation: highlight tab "Trang chủ".
2. Handle lỗi: API lỗi → toast notification.

#### File cần tạo

- `frontend/src/js/pages/dashboard.js`

#### File cần chỉnh sửa

Không.

#### Thành phần liên quan

- Pages JS

#### Database liên quan

Không.

#### Frontend liên quan

- JS: dashboard logic.

#### Kết quả mong đợi

Dashboard hiển thị dữ liệu từ API: streak, avatar, roadmap, topics.

#### Acceptance Criteria

1. Gọi API profile → hiển thị streak, avatar.
2. Gọi API topics → render danh sách topic cards.
3. Bấm topic card → chuyển đến learn.html?topic_id=x.
4. Bottom navigation highlight tab "Trang chủ".
5. Chưa đăng nhập → redirect login.

#### Kiểm thử

- **Kiểm thử chức năng**: Load dashboard, kiểm tra dữ liệu hiển thị.
- **Kiểm thử lỗi**: API lỗi → toast.
- **Kết quả mong đợi**: Dashboard hoạt động đúng.

#### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

### Subtask M3-T9.3

#### Thông tin

- **ID**: M3-T9.3
- **Tên**: Trang Dashboard - Components và Navigation
- **Milestone**: M3
- **User Story**: US-03, US-04, US-05
- **Functional Requirement**: FR-009, FR-011, FR-033, FR-052
- **Module**: Dashboard
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M3-T9.2

#### Mục tiêu

Tạo các component dùng chung: header, bottom-nav, và kết nối navigation giữa các trang.

#### Điều kiện bắt đầu

M3-T9.2 hoàn thành.

#### Công việc cần thực hiện

1. Tạo file `frontend/src/components/header.html`: HTML snippet cho header (logo, avatar, streak).
2. Tạo file `frontend/src/components/bottom-nav.html`: HTML snippet cho bottom navigation (Trang chủ, Ôn tập, Sổ tay).
3. Tạo file `frontend/src/js/components/nav.js`: JS load header, bottom-nav vào các trang.
4. Cập nhật dashboard.html để include các component.
5. Cập nhật các trang khác (quiz.html, notebook.html, profile.html) để dùng chung components sau này.

#### File cần tạo

- `frontend/src/components/header.html`
- `frontend/src/components/bottom-nav.html`
- `frontend/src/js/components/nav.js`

#### File cần chỉnh sửa

- `frontend/src/pages/dashboard/dashboard.html`

#### Thành phần liên quan

- Components

#### Database liên quan

Không.

#### Frontend liên quan

- Components: header, bottom-nav.
- JS: nav.js.

#### Kết quả mong đợi

Header và bottom-nav hiển thị trên dashboard, navigation giữa các trang hoạt động.

#### Acceptance Criteria

1. Header hiển thị trên dashboard.
2. Bottom navigation hiển thị với 3 tabs.
3. Bấm tab "Ôn tập" → chuyển đến quiz.html.
4. Bấm tab "Sổ tay" → chuyển đến notebook.html.
5. Bấm tab "Trang chủ" → chuyển đến dashboard.html.

#### Kiểm thử

- **Kiểm thử chức năng**: Navigation giữa các trang.
- **Kết quả mong đợi**: Navigation hoạt động đúng.

#### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

# Milestone 4: Learning - Flashcard & Writing Exercise

## Task M4-T1

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

### Điều kiện bắt đầu

M1-T2 hoàn thành.

### Công việc cần thực hiện

1. Mở rộng `backend/src/models/vocabularyModel.js` (hoặc tạo model riêng).
2. Hàm `findByUserAndVocab(userId, vocabId)`: SELECT * FROM user_vocabularies WHERE user_id = ? AND vocabulary_id = ?.
3. Hàm `upsert(userId, vocabId, data)`: INSERT ... ON DUPLICATE KEY UPDATE (UPSERT).
4. Hàm `getByUserAndStatus(userId, status)`: SELECT * FROM user_vocabularies WHERE user_id = ? AND status = ?.
5. Hàm `updateStudySession(userId, vocabId, { status, reviewCount, nextReviewAt })`: UPDATE user_vocabularies.
6. Tất cả hàm dùng Prepared Statements, trả về Promise.

### File cần tạo/ chỉnh sửa

- `backend/src/models/vocabularyModel.js`

### Thành phần liên quan

- Models

### Database liên quan

- Table: user_vocabularies
- Fields: user_id, vocabulary_id, status, review_count, last_reviewed_at, next_review_at

### Frontend liên quan

Không.

### Kết quả mong đợi

Model có đủ 4 hàm, dùng Prepared Statements, hỗ trợ UPSERT.

### Acceptance Criteria

1. Có hàm findByUserAndVocab, upsert, getByUserAndStatus, updateStudySession.
2. UPSERT hoạt động: INSERT nếu chưa có, UPDATE nếu đã có.
3. Prepared Statements cho tất cả hàm.

### Kiểm thử

- **Kiểm thử chức năng**: Gọi từng hàm, kiểm tra kết quả.
- **Kiểm thử dữ liệu**: UPSERT tạo mới → INSERT. UPSERT lần 2 → UPDATE.
- **Kiểm thử lỗi**: User/vocab không tồn tại → xử lý lỗi FK.
- **Kết quả mong đợi**: Model hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M4-T2

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
- **Dependencies**: M2-T5, M3-T5

### Mục tiêu

Tạo route POST /api/learning/start + controller. Input: topic_id. Trả về danh sách từ vựng cho phiên học.

### Điều kiện bắt đầu

M2-T5, M3-T5 hoàn thành.

### Công việc cần thực hiện

1. Trong vocabularyController, thêm hàm `startLearning`.
2. Input: topic_id từ req.body.
3. Validate: topic_id bắt buộc, tồn tại.
4. Lấy danh sách vocabulary theo topic_id (gọi vocabularyModel.getByTopicId).
5. Trả về: { success: true, data: { session_id (có thể là timestamp), vocabulary: [...vocabularies] } }.
6. Format response theo spec 7.4.
7. Route: POST /api/learning/start → authMiddleware → vocabularyController.startLearning.

### File cần chỉnh sửa

- `backend/src/controllers/vocabularyController.js`
- `backend/src/routes/vocabularyRoutes.js`

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: vocabularies
- Table: topics (validate)

### Frontend liên quan

Không.

### Kết quả mong đợi

POST /api/learning/start → 200 + session_id + danh sách từ vựng.

### Acceptance Criteria

1. POST với topic_id hợp lệ → 200 + danh sách từ vựng.
2. Thiếu topic_id → 400.
3. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: POST với topic_id → danh sách từ vựng.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Thiếu topic_id → 400.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [x] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M4-T3

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

### Điều kiện bắt đầu

M4-T1, M4-T2 hoàn thành.

### Công việc cần thực hiện

1. Trong vocabularyController, thêm hàm `markMastered`.
2. Input: vocabulary_id, session_id từ req.body.
3. Gọi vocabularyModel.upsert(userId, vocabId, { status: 'mastered', review_count: increment }).
4. Trả về từ tiếp theo trong session (next_vocabulary).
5. Format response theo spec 7.4.
6. Route: POST /api/learning/mastered → authMiddleware → vocabularyController.markMastered.

### File cần chỉnh sửa

- `backend/src/controllers/vocabularyController.js`
- `backend/src/routes/vocabularyRoutes.js`

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: user_vocabularies
- UPSERT: status='mastered', review_count+1

### Frontend liên quan

Không.

### Kết quả mong đợi

POST → 200 + next_vocabulary. user_vocabularies status='mastered', review_count tăng 1.

### Acceptance Criteria

1. POST /api/learning/mastered → 200 + next_vocabulary.
2. user_vocabularies: status='mastered', review_count tăng 1.
3. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: POST mastered → 200.
- **Kiểm thử dữ liệu**: Kiểm tra user_vocabularies đã update.
- **Kiểm thử lỗi**: vocabulary_id không hợp lệ → 404.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M4-T4

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

Tạo route POST /api/learning/writing + controller. Trả về prompt: meaning, example để luyện viết.

### Điều kiện bắt đầu

M4-T2 hoàn thành.

### Công việc cần thực hiện

1. Trong vocabularyController, thêm hàm `getWritingPrompt`.
2. Input: vocabulary_id, session_id từ req.body.
3. Lấy từ vựng từ DB: SELECT meaning, example FROM vocabularies WHERE id = ?.
4. Trả về: { success: true, data: { prompt: { meaning, example }, vocabulary_id } }.
5. Format response theo spec 7.4.
6. Route: POST /api/learning/writing → authMiddleware → vocabularyController.getWritingPrompt.

### File cần chỉnh sửa

- `backend/src/controllers/vocabularyController.js`
- `backend/src/routes/vocabularyRoutes.js`

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: vocabularies (SELECT meaning, example)

### Frontend liên quan

Không.

### Kết quả mong đợi

POST → 200 + { prompt: { meaning, example }, vocabulary_id }.

### Acceptance Criteria

1. POST /api/learning/writing → 200 + prompt (meaning, example).
2. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: POST → 200 + prompt.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: vocabulary_id không hợp lệ → 404.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M4-T5

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

### Điều kiện bắt đầu

M4-T1, M4-T2, M6-T6 hoàn thành.

### Công việc cần thực hiện

1. Trong vocabularyController, thêm hàm `submitWriting`.
2. Input: vocabulary_id, session_id, user_input từ req.body.
3. Kiểm tra user_input: so sánh với word trong vocabularies (đúng/sai).
4. UPSERT user_vocabularies: status='learning', review_count = CASE WHEN đúng THEN review_count+1 ELSE 0, next_review_at tính theo SRS.
5. Gọi streakService.updateStreak(userId, today).
6. Trả về: { success: true, data: { is_correct, status: 'learning', next_vocabulary, streak_updated } }.
7. Format response theo spec 7.5.
8. Route: POST /api/learning/writing/submit → authMiddleware → vocabularyController.submitWriting.

### File cần chỉnh sửa

- `backend/src/controllers/vocabularyController.js`
- `backend/src/routes/vocabularyRoutes.js`

### Thành phần liên quan

- Controllers
- Routes
- Services (SRS, Streak)

### Database liên quan

- Table: user_vocabularies (UPSERT)
- Table: users (cập nhật streak, last_study_date)

### Frontend liên quan

Không.

### Kết quả mong đợi

POST → 200 + next_vocabulary + streak_updated. user_vocabularies status='learning', next_review_at được tính.

### Acceptance Criteria

1. Nộp bài đúng → is_correct=true, status='learning', streak tăng.
2. Nộp bài sai → is_correct=false.
3. next_review_at được tính theo SRS.
4. last_study_date cập nhật, streak tăng (1 ngày 1 lần).
5. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: POST với input đúng → 200 + is_correct=true.
- **Kiểm thử dữ liệu**: Kiểm tra user_vocabularies update, streak tăng.
- **Kiểm thử lỗi**: vocabulary_id không hợp lệ → 404.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [x] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M4-T6

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

Tạo service/hàm calculateNextReview sử dụng thuật toán SM-2 đơn giản hóa.

### Điều kiện bắt đầu

M4-T1 hoàn thành.

### Công việc cần thực hiện

1. Tạo file `backend/src/services/srsService.js`.
2. Hàm `calculateNextReview(reviewCount)`:
   - reviewCount = 0 (lần đầu): trả về 1 ngày sau.
   - reviewCount = 1: trả về 3 ngày sau.
   - reviewCount = 2: trả về 7 ngày sau.
   - reviewCount = 3: trả về 14 ngày sau.
   - reviewCount >= 4: trả về 30 ngày sau.
3. Hàm `handleCorrectAnswer(currentReviewCount)`: tăng reviewCount, tính nextReviewAt.
4. Hàm `handleWrongAnswer()`: reset reviewCount = 0, nextReviewAt = NOW().
5. Export các hàm.

### File cần tạo

- `backend/src/services/srsService.js`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Services

### Database liên quan

Không (chỉ tính toán thuần túy).

### Frontend liên quan

Không.

### Kết quả mong đợi

Tính đúng next_review_at dựa trên review_count: 0→1d, 1→3d, 2→7d, 3→14d, 4+→30d.

### Acceptance Criteria

1. reviewCount=0 → next_review_at = NOW() + 1 day.
2. reviewCount=1 → next_review_at = NOW() + 3 days.
3. reviewCount=2 → next_review_at = NOW() + 7 days.
4. reviewCount=3 → next_review_at = NOW() + 14 days.
5. reviewCount>=4 → next_review_at = NOW() + 30 days.
6. Wrong answer → reviewCount = 0, next_review_at = NOW().

### Kiểm thử

- **Kiểm thử chức năng**: Test từng case.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Không.
- **Kết quả mong đợi**: SRS tính đúng.

### Checklist

- [ ] Database
- [x] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [x] Testing
- [ ] Documentation

---

## Task M4-T7

Task này có độ phức tạp L (Large), cần chia thành các subtask.

### Subtask M4-T7.1

#### Thông tin

- **ID**: M4-T7.1
- **Tên**: Trang Học Flashcard - Cấu trúc HTML và CSS
- **Milestone**: M4
- **User Story**: US-03
- **Functional Requirement**: FR-013, FR-014
- **Module**: Learning
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T8, M2-T13

#### Mục tiêu

Tạo cấu trúc HTML và CSS cho trang học Flashcard với hiệu ứng lật thẻ.

#### Điều kiện bắt đầu

M1-T8, M2-T13 hoàn thành.

#### Công việc cần thực hiện

1. Tạo file `frontend/src/pages/learn/learn.html`:
   - Header (dùng component).
   - Flashcard container: mặt trước (word, pronunciation, audio, image), mặt sau (part_of_speech, meaning, example, example_meaning).
   - Nút "Đã thuộc" (màu Emerald-500) và "Tiếp tục" (màu Amber-500).
   - Progress bar: từ thứ x / tổng số.
   - Placeholder cho writing exercise (ẩn/hiện).
   - Bottom navigation.
   - AI Chat widget.
2. Tạo CSS hiệu ứng lật thẻ 3D:
   - .flashcard-container perspective.
   - .flashcard-inner transform rotateY.
   - .flashcard-front, .flashcard-back backface-visibility.
   - Lớp .flipped để kích hoạt lật.
3. Sử dụng Tailwind CSS.

#### File cần tạo

- `frontend/src/pages/learn/learn.html`
- `frontend/src/css/pages/learn.css`

#### File cần chỉnh sửa

Không.

#### Thành phần liên quan

- Pages
- CSS

#### Database liên quan

Không.

#### Frontend liên quan

- HTML: learn page.
- CSS: learn.css.

#### Kết quả mong đợi

Trang học Flashcard có cấu trúc đầy đủ, hiệu ứng lật thẻ CSS hoạt động.

#### Acceptance Criteria

1. Flashcard hiển thị mặt trước: word, pronunciation, audio, image.
2. Flashcard mặt sau: part_of_speech, meaning, example, example_meaning.
3. Hiệu ứng lật thẻ CSS 3D Transform.
4. Nút "Đã thuộc" (Emerald-500) và "Tiếp tục" (Amber-500).
5. Progress bar.

#### Kiểm thử

- **Kiểm thử chức năng**: Mở trang, kiểm tra layout.
- **Kết quả mong đợi**: Giao diện hiển thị đúng.

#### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

### Subtask M4-T7.2

#### Thông tin

- **ID**: M4-T7.2
- **Tên**: Trang Học Flashcard - JavaScript và API Integration
- **Milestone**: M4
- **User Story**: US-03
- **Functional Requirement**: FR-013, FR-014, FR-015, FR-016, FR-017, FR-018
- **Module**: Learning
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M4-T7.1, M4-T2, M4-T3, M4-T4

#### Mục tiêu

Tạo JavaScript cho trang học Flashcard: gọi API start learning, hiển thị flashcard, xử lý mastered/writing.

#### Điều kiện bắt đầu

M4-T7.1, M4-T2, M4-T3, M4-T4 hoàn thành.

#### Công việc cần thực hiện

1. Tạo file `frontend/src/js/pages/learn.js`:
   - DOMContentLoaded: lấy topic_id từ URL query params.
   - Gọi POST /api/learning/start với topic_id → nhận danh sách từ vựng.
   - Hiển thị Flashcard đầu tiên.
   - Xử lý click "Đã thuộc": gọi POST /api/learning/mastered → chuyển từ tiếp theo.
   - Xử lý click "Tiếp tục": gọi POST /api/learning/writing → hiển thị writing exercise.
   - Xử lý lật thẻ (click vào thẻ): thêm/remove lớp .flipped.
2. Handle các trạng thái: loading, error, hết từ.

#### File cần tạo

- `frontend/src/js/pages/learn.js`

#### File cần chỉnh sửa

Không.

#### Thành phần liên quan

- Pages JS

#### Database liên quan

Không.

#### Frontend liên quan

- JS: learn logic.

#### Kết quả mong đợi

Flashcard hiển thị, click lật thẻ, "Đã thuộc" → API mastered, "Tiếp tục" → writing.

#### Acceptance Criteria

1. Load từ vựng từ API start learning.
2. Click thẻ → lật (hiệu ứng CSS).
3. "Đã thuộc" → gọi API mastered → chuyển từ tiếp theo.
4. "Tiếp tục" → gọi API writing → hiển thị writing exercise.
5. Hết từ → hiển thị tổng kết.

#### Kiểm thử

- **Kiểm thử chức năng**: Load trang, click các nút, kiểm tra API calls.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: API lỗi → toast.
- **Kết quả mong đợi**: Học flashcard hoạt động đúng.

#### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

### Subtask M4-T7.3

#### Thông tin

- **ID**: M4-T7.3
- **Tên**: Trang Học Flashcard - Writing Exercise và Tổng kết
- **Milestone**: M4
- **User Story**: US-03
- **Functional Requirement**: FR-017, FR-018, FR-019
- **Module**: Learning
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M4-T7.2, M4-T5, M4-T9

#### Mục tiêu

Hoàn thiện writing exercise, màn hình tổng kết và phím tắt cho trang học.

#### Điều kiện bắt đầu

M4-T7.2, M4-T5, M4-T9 hoàn thành.

#### Công việc cần thực hiện

1. Trong learn.js, thêm logic cho writing exercise:
   - Hiển thị gợi ý (meaning, example).
   - Input text + nút nộp bài.
   - Gọi POST /api/learning/writing/submit.
   - Hiển thị kết quả đúng/sai.
   - Chuyển sang từ tiếp theo.
2. Thêm màn hình tổng kết khi hết từ:
   - Số từ đã học, đã thuộc, đã lưu sổ tay.
   - Nút "Quay về trang chủ".
3. Thêm phím tắt (M4-T10):
   - Space: lật thẻ.
   - ArrowRight: Đã thuộc.
   - ArrowLeft: Tiếp tục.

#### File cần chỉnh sửa

- `frontend/src/js/pages/learn.js`

#### Thành phần liên quan

- Pages JS

#### Database liên quan

Không.

#### Frontend liên quan

- JS: writing exercise, summary, keyboard shortcuts.

#### Kết quả mong đợi

Writing exercise hoạt động, tổng kết hiển thị, phím tắt hoạt động.

#### Acceptance Criteria

1. Writing exercise: hiển thị gợi ý, input, nộp bài.
2. Gọi API submit → hiển thị kết quả đúng/sai.
3. Hết từ → màn hình tổng kết.
4. Phím Space → lật thẻ.
5. Phím ArrowRight → mastered.
6. Phím ArrowLeft → writing.

#### Kiểm thử

- **Kiểm thử chức năng**: Nhập từ, nộp bài, kiểm tra kết quả.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: API lỗi → toast.
- **Kết quả mong đợi**: Writing và phím tắt hoạt động đúng.

#### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M4-T8

### Thông tin

- **ID**: M4-T8
- **Tên**: Bài tập Luyện viết (Frontend)
- **Milestone**: M4
- **User Story**: US-03
- **Functional Requirement**: FR-017, FR-018
- **Module**: Learning
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M4-T7, M4-T5

### Mục tiêu

Component/tab trong learn page: hiển thị gợi ý, input, nút nộp bài. Gọi API submit.

### Điều kiện bắt đầu

M4-T7, M4-T5 hoàn thành.

### Công việc cần thực hiện

(Đã được tích hợp trong M4-T7.3)

### File cần chỉnh sửa

- `frontend/src/js/pages/learn.js`

### Thành phần liên quan

- Pages JS

### Kết quả mong đợi

Hiển thị gợi ý, input, nút nộp. Gọi API submit. Thành công → next vocabulary.

### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M4-T9

### Thông tin

- **ID**: M4-T9
- **Tên**: Màn hình Tổng kết
- **Milestone**: M4
- **User Story**: US-03
- **Functional Requirement**: FR-019
- **Module**: Learning
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M4-T8

### Mục tiêu

Hiển thị màn hình tổng kết khi học hết từ trong chủ đề.

### Điều kiện bắt đầu

M4-T8 hoàn thành.

### Công việc cần thực hiện

(Đã được tích hợp trong M4-T7.3)

### File cần chỉnh sửa

- `frontend/src/js/pages/learn.js`

### Thành phần liên quan

- Pages JS

### Kết quả mong đợi

Hiển thị đúng thống kê. Nút quay về dashboard hoạt động.

### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M4-T10

### Thông tin

- **ID**: M4-T10
- **Tên**: Phím tắt Flashcard
- **Milestone**: M4
- **User Story**: US-03
- **Functional Requirement**: FR-020
- **Module**: Learning
- **Priority**: P1
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M4-T7

### Mục tiêu

Hỗ trợ phím tắt: Space (lật thẻ), ArrowRight (Đã thuộc), ArrowLeft (Tiếp tục).

### Điều kiện bắt đầu

M4-T7 hoàn thành.

### Công việc cần thực hiện

(Đã được tích hợp trong M4-T7.3)

### File cần chỉnh sửa

- `frontend/src/js/pages/learn.js`

### Thành phần liên quan

- Pages JS

### Kết quả mong đợi

Space → lật thẻ. ArrowRight → gọi mastered. ArrowLeft → gọi writing.

### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M4-T11

### Thông tin

- **ID**: M4-T11
- **Tên**: API User Vocabulary - Danh sách
- **Milestone**: M4
- **User Story**: US-03, US-05
- **Functional Requirement**: FR-028
- **Module**: Vocabulary
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M4-T1, M2-T5

### Mục tiêu

Tạo route GET /api/user-vocabularies + controller. Query params: topic_id (optional). Lấy danh sách user_vocabularies JOIN vocabularies.

### Điều kiện bắt đầu

M4-T1, M2-T5 hoàn thành.

### Công việc cần thực hiện

1. Trong vocabularyController, thêm hàm `getUserVocabularies`.
2. Query: SELECT uv.*, v.word, v.meaning FROM user_vocabularies uv JOIN vocabularies v ON uv.vocabulary_id = v.id WHERE uv.user_id = ?.
3. Filter theo topic_id nếu có (JOIN topics).
4. Trả về danh sách.
5. Route: GET /api/user-vocabularies → authMiddleware → vocabularyController.getUserVocabularies.

### File cần chỉnh sửa

- `backend/src/controllers/vocabularyController.js`
- `backend/src/routes/vocabularyRoutes.js`

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: user_vocabularies, vocabularies

### Frontend liên quan

Không.

### Kết quả mong đợi

GET /api/user-vocabularies → 200 + danh sách user_vocabularies của user.

### Acceptance Criteria

1. GET /api/user-vocabularies → 200 + danh sách.
2. Filter theo topic_id nếu có.
3. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: GET → danh sách.
- **Kiểm thử lỗi**: Không token → 401.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

# Milestone 5: Quiz

## Task M5-T1

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

Tạo model cho quiz_attempts và quiz_answers với các hàm CRUD.

### Điều kiện bắt đầu

M1-T2 hoàn thành.

### Công việc cần thực hiện

1. Tạo file `backend/src/models/quizModel.js`.
2. Hàm `createAttempt(userId)`: INSERT INTO quiz_attempts (user_id) VALUES (?).
3. Hàm `createAnswer({ quizAttemptId, vocabularyId, userAnswer, correctAnswer, isCorrect })`: INSERT INTO quiz_answers.
4. Hàm `updateAttempt(attemptId, { score, totalQuestions, correctAnswers })`: UPDATE quiz_attempts.
5. Hàm `getAttemptById(attemptId)`: SELECT * FROM quiz_attempts WHERE id = ?.
6. Hàm `getAnswersByAttemptId(attemptId)`: SELECT * FROM quiz_answers WHERE quiz_attempt_id = ?.
7. Hàm `getIncompleteAttempt(userId)`: SELECT * FROM quiz_attempts WHERE user_id = ? AND score = 0 AND total_questions = 0 (tìm quiz chưa hoàn thành).
8. Tất cả hàm dùng Prepared Statements, hỗ trợ transaction.

### File cần tạo

- `backend/src/models/quizModel.js`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Models

### Database liên quan

- Table: quiz_attempts, quiz_answers

### Frontend liên quan

Không.

### Kết quả mong đợi

Model có đủ 5 hàm, dùng Prepared Statements, hỗ trợ transaction.

### Acceptance Criteria

1. Có hàm: createAttempt, createAnswer, updateAttempt, getAttemptById, getAnswersByAttemptId, getIncompleteAttempt.
2. Prepared Statements cho tất cả hàm.
3. Hỗ trợ transaction (có thể dùng pool.getConnection() + beginTransaction).

### Kiểm thử

- **Kiểm thử chức năng**: Gọi từng hàm.
- **Kiểm thử dữ liệu**: Tạo attempt → tạo answers → update attempt.
- **Kiểm thử lỗi**: FK không tồn tại → lỗi.
- **Kết quả mong đợi**: Model hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M5-T2

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

Tạo route POST /api/quiz/start + controller. Lọc từ cần ôn tập, tạo quiz, trả về câu hỏi.

### Điều kiện bắt đầu

M5-T1, M4-T1 hoàn thành.

### Công việc cần thực hiện

1. Tạo file `backend/src/controllers/quizController.js`.
2. Tạo file `backend/src/routes/quizRoutes.js`.
3. Hàm `startQuiz`:
   - Lấy user_id từ req.user.
   - Truy vấn user_vocabularies: status IN ('new','learning') OR next_review_at <= NOW().
   - Áp dụng Quiz Generation Rules:
     - Tối đa 20 câu.
     - Ưu tiên next_review_at <= NOW().
     - Ưu tiên review_count thấp.
     - Mỗi từ chỉ xuất hiện 1 lần.
   - Tạo quiz_attempt: gọi quizModel.createAttempt.
   - Tạo câu hỏi: mỗi từ là 1 câu, tạo 3 đáp án sai ngẫu nhiên từ các từ khác.
   - Trả về: { success: true, data: { quiz_id, questions: [...] } }.
4. Format response theo spec 7.6.
5. Route: POST /api/quiz/start → authMiddleware → quizController.startQuiz.

### File cần tạo

- `backend/src/controllers/quizController.js`
- `backend/src/routes/quizRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount quizRoutes)

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: user_vocabularies, vocabularies, quiz_attempts

### Frontend liên quan

Không.

### Kết quả mong đợi

POST /api/quiz/start → 200 + quiz_id + questions (tối đa 20).

### Acceptance Criteria

1. POST /api/quiz/start → 200 + quiz_id + questions.
2. Tối đa 20 câu hỏi.
3. Lọc đúng user_vocabularies: new, learning, hoặc next_review_at <= NOW().
4. Mỗi câu hỏi có 4 lựa chọn (1 đúng + 3 sai).
5. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: POST → nhận quiz.
- **Kiểm thử dữ liệu**: Kiểm tra quiz_attempt được tạo.
- **Kiểm thử lỗi**: Không có từ để ôn → thông báo.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M5-T3

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

### Điều kiện bắt đầu

M5-T2, M4-T6 hoàn thành.

### Công việc cần thực hiện

1. Trong quizController, thêm hàm `answerQuiz`.
2. Input: quiz_id, question_id (vocabulary_id), user_answer.
3. Lấy đáp án đúng từ vocabularies.
4. Nếu đúng:
   - Gọi srsService.handleCorrectAnswer (tăng review_count, tính next_review_at).
   - UPDATE user_vocabularies.
5. Nếu sai:
   - Gọi srsService.handleWrongAnswer (reset review_count, next_review_at=NOW()).
   - UPDATE user_vocabularies.
6. Lưu quiz_answers: INSERT (quiz_attempt_id, vocabulary_id, user_answer, correct_answer, is_correct).
7. Trả về: { success: true, data: { is_correct, correct_answer, explanation, review_count_updated } }.
8. Format response theo spec 7.6.
9. Route: POST /api/quiz/answer → authMiddleware → quizController.answerQuiz.

### File cần chỉnh sửa

- `backend/src/controllers/quizController.js`
- `backend/src/routes/quizRoutes.js`

### Thành phần liên quan

- Controllers
- Routes
- Services (SRS)

### Database liên quan

- Table: user_vocabularies (UPDATE SRS)
- Table: quiz_answers (INSERT)

### Frontend liên quan

Không.

### Kết quả mong đợi

Trả lời đúng → is_correct=true, SRS tăng review_count. Trả lời sai → is_correct=false, review_count=0, hiển thị đáp án.

### Acceptance Criteria

1. Trả lời đúng → is_correct=true, review_count tăng, next_review_at cập nhật.
2. Trả lời sai → is_correct=false, review_count=0, next_review_at=NOW().
3. Lưu quiz_answers.
4. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: POST answer đúng → is_correct=true.
- **Kiểm thử dữ liệu**: Kiểm tra user_vocabularies, quiz_answers update.
- **Kiểm thử lỗi**: Quiz không tồn tại → 404.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [x] Testing
- [ ] Documentation

---

## Task M5-T4

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

Tạo route POST /api/quiz/complete + controller. Cập nhật quiz_attempts, trả về kết quả.

### Điều kiện bắt đầu

M5-T3 hoàn thành.

### Công việc cần thực hiện

1. Trong quizController, thêm hàm `completeQuiz`.
2. Input: quiz_id.
3. Lấy tất cả quiz_answers của attempt.
4. Tính: totalQuestions = count, correctAnswers = sum(is_correct), score = (correctAnswers / totalQuestions) * 100.
5. Gọi quizModel.updateAttempt: SET score, total_questions, correct_answers.
6. Trả về: { success: true, data: { score, total_questions, correct_answers, words_mastered (count status='mastered'), words_to_review (count status != 'mastered') } }.
7. Format response theo spec 7.6.
8. Route: POST /api/quiz/complete → authMiddleware → quizController.completeQuiz.

### File cần chỉnh sửa

- `backend/src/controllers/quizController.js`
- `backend/src/routes/quizRoutes.js`

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: quiz_attempts (UPDATE)
- Table: quiz_answers (SELECT)

### Frontend liên quan

Không.

### Kết quả mong đợi

POST → 200 + kết quả đầy đủ. quiz_attempts được cập nhật.

### Acceptance Criteria

1. POST /api/quiz/complete → 200 + kết quả (score, total_questions, correct_answers, words_mastered, words_to_review).
2. quiz_attempts được cập nhật.
3. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: POST complete → kết quả.
- **Kiểm thử dữ liệu**: Kiểm tra quiz_attempts đã update.
- **Kiểm thử lỗi**: Quiz không tồn tại → 404.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M5-T5

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

### Điều kiện bắt đầu

M5-T2, M5-T1 hoàn thành.

### Công việc cần thực hiện

1. Trong quizController, thêm hàm `continueQuiz`.
2. Gọi quizModel.getIncompleteAttempt(userId).
3. Nếu không có quiz dang dở → message "Không có quiz nào đang dở".
4. Nếu có: lấy danh sách câu hỏi chưa trả lời (vocabulary_id chưa có trong quiz_answers).
5. Trả về quiz_id + danh sách câu chưa làm.
6. Route: GET /api/quiz/continue → authMiddleware → quizController.continueQuiz.

### File cần chỉnh sửa

- `backend/src/controllers/quizController.js`
- `backend/src/routes/quizRoutes.js`

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: quiz_attempts, quiz_answers

### Frontend liên quan

Không.

### Kết quả mong đợi

GET /api/quiz/continue → 200 + quiz_id + questions (câu chưa làm). Không có quiz dang dở → thông báo.

### Acceptance Criteria

1. Có quiz dang dở → 200 + quiz_id + questions (câu chưa làm).
2. Không có quiz dang dở → message "Không có quiz nào đang dở".
3. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: GET continue → quiz dang dở.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Không có quiz → message.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M5-T6

Task này có độ phức tạp L (Large), cần chia thành các subtask.

### Subtask M5-T6.1

#### Thông tin

- **ID**: M5-T6.1
- **Tên**: Trang Quiz - Cấu trúc HTML và CSS
- **Milestone**: M5
- **User Story**: US-04
- **Functional Requirement**: FR-021, FR-022, FR-026
- **Module**: Quiz
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T8, M2-T13

#### Mục tiêu

Tạo cấu trúc HTML và CSS cho trang Quiz.

#### Điều kiện bắt đầu

M1-T8, M2-T13 hoàn thành.

#### Công việc cần thực hiện

1. Tạo file `frontend/src/pages/quiz/quiz.html`:
   - Header (dùng component).
   - Trạng thái: trước khi bắt đầu (nút "Bắt đầu ôn tập" + kiểm tra quiz dang dở).
   - Câu hỏi: hiển thị từ + 4 lựa chọn.
   - Progress: câu x / tổng số.
   - Kết quả sau mỗi câu: đúng/sai, đáp án.
   - Màn hình kết quả cuối cùng.
   - Bottom navigation.
   - AI Chat widget.
2. Sử dụng Tailwind CSS, màu Emerald-500 (đúng), Rose-500 (sai).

#### File cần tạo

- `frontend/src/pages/quiz/quiz.html`
- `frontend/src/css/pages/quiz.css`

#### File cần chỉnh sửa

Không.

#### Thành phần liên quan

- Pages
- CSS

#### Database liên quan

Không.

#### Frontend liên quan

- HTML: quiz page.
- CSS: quiz.css.

#### Kết quả mong đợi

Trang Quiz có cấu trúc đầy đủ.

#### Acceptance Criteria

1. Nút "Bắt đầu ôn tập" hiển thị.
2. Layout câu hỏi + 4 lựa chọn.
3. Progress bar.
4. Kết quả đúng/sai hiển thị.

#### Kiểm thử

- **Kiểm thử chức năng**: Mở trang, kiểm tra layout.
- **Kết quả mong đợi**: Giao diện hiển thị đúng.

#### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

### Subtask M5-T6.2

#### Thông tin

- **ID**: M5-T6.2
- **Tên**: Trang Quiz - JavaScript và Logic
- **Milestone**: M5
- **User Story**: US-04
- **Functional Requirement**: FR-021, FR-022, FR-024, FR-025, FR-026
- **Module**: Quiz
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M5-T6.1, M5-T2, M5-T3, M5-T4

#### Mục tiêu

Tạo JavaScript cho Quiz: bắt đầu quiz, hiển thị câu hỏi, xử lý trả lời, hiển thị kết quả.

#### Điều kiện bắt đầu

M5-T6.1, M5-T2, M5-T3, M5-T4 hoàn thành.

#### Công việc cần thực hiện

1. Tạo file `frontend/src/js/pages/quiz.js`:
   - DOMContentLoaded: kiểm tra quiz dang dở (GET /api/quiz/continue).
   - Nếu có: hiển thị nút "Tiếp tục Quiz".
   - Nếu không: hiển thị nút "Bắt đầu ôn tập".
   - Bấm "Bắt đầu": gọi POST /api/quiz/start → nhận questions.
   - Hiển thị từng câu hỏi (word + 4 options).
   - Chọn đáp án: gọi POST /api/quiz/answer → hiển thị kết quả (đúng/sai, đáp án đúng).
   - Sau câu cuối: gọi POST /api/quiz/complete → hiển thị màn hình kết quả (score, words_mastered, words_to_review).
2. Handle loading, error states.

#### File cần tạo

- `frontend/src/js/pages/quiz.js`

#### File cần chỉnh sửa

Không.

#### Thành phần liên quan

- Pages JS

#### Database liên quan

Không.

#### Frontend liên quan

- JS: quiz logic.

#### Kết quả mong đợi

Quiz hoạt động: bắt đầu, trả lời, hoàn thành, hiển thị kết quả.

#### Acceptance Criteria

1. Bấm "Bắt đầu" → gọi API → hiển thị câu hỏi.
2. Chọn đáp án → gọi API → hiển thị đúng/sai.
3. Hoàn thành → màn hình kết quả.
4. Quiz dang dở → nút "Tiếp tục".

#### Kiểm thử

- **Kiểm thử chức năng**: Bắt đầu quiz, trả lời, hoàn thành.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: API lỗi → toast.
- **Kết quả mong đợi**: Quiz hoạt động đúng.

#### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

### Subtask M5-T6.3

#### Thông tin

- **ID**: M5-T6.3
- **Tên**: Trang Quiz - Tiếp tục Quiz và Hoàn thiện
- **Milestone**: M5
- **User Story**: US-04
- **Functional Requirement**: FR-027
- **Module**: Quiz
- **Priority**: P1
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M5-T6.2, M5-T5

#### Mục tiêu

Hoàn thiện chức năng tiếp tục Quiz khi thoát giữa chừng.

#### Điều kiện bắt đầu

M5-T6.2, M5-T5 hoàn thành.

#### Công việc cần thực hiện

1. Trong quiz.js, thêm logic:
   - Load trang → gọi GET /api/quiz/continue.
   - Nếu có quiz dang dở: hiển thị nút "Tiếp tục" và "Bắt đầu mới".
   - Bấm "Tiếp tục": load câu chưa làm, tiếp tục từ đó.
   - Bấm "Bắt đầu mới": gọi POST /api/quiz/start (bỏ qua quiz cũ).

#### File cần chỉnh sửa

- `frontend/src/js/pages/quiz.js`

#### Thành phần liên quan

- Pages JS

#### Kết quả mong đợi

Quiz dang dở → nút "Tiếp tục" → load câu chưa làm.

#### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M5-T7

### Thông tin

- **ID**: M5-T7
- **Tên**: Tiếp tục Quiz (Frontend)
- **Milestone**: M5
- **User Story**: US-04
- **Functional Requirement**: FR-027
- **Module**: Quiz
- **Priority**: P1
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M5-T6, M5-T5

### Mục tiêu

Khi vào trang quiz, kiểm tra GET /api/quiz/continue. Nếu có quiz dang dở: hiển thị nút "Tiếp tục" hoặc "Bắt đầu mới".

### Điều kiện bắt đầu

M5-T6, M5-T5 hoàn thành.

(Đã được tích hợp trong M5-T6.3)

### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

# Milestone 6: Notebook & Streak

## Task M6-T1

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
- **Dependencies**: M2-T5, M4-T1

### Mục tiêu

Tạo route GET /api/notebook + controller. Query params: search, status, page. JOIN user_vocabularies + vocabularies.

### Điều kiện bắt đầu

M2-T5, M4-T1 hoàn thành.

### Công việc cần thực hiện

1. Tạo file `backend/src/models/notebookModel.js`.
2. Hàm `getAll(userId, { search, status, page, limit })`:
   - JOIN user_vocabularies uv + vocabularies v ON uv.vocabulary_id = v.id.
   - WHERE uv.user_id = ?.
   - Nếu search: AND v.word LIKE ?.
   - Nếu status: AND uv.status = ?.
   - ORDER BY uv.status ASC, v.word ASC.
   - LIMIT ? OFFSET ?.
3. Hàm `getTotal(userId, { search, status })`: đếm tổng số.
4. Tạo file `backend/src/controllers/notebookController.js`.
5. Hàm `getAll`: lấy query params, gọi notebookModel.getAll, trả về { total, items }.
6. Tạo file `backend/src/routes/notebookRoutes.js`.
7. Route: GET /api/notebook → authMiddleware → notebookController.getAll.
8. Format response theo spec 7.7.

### File cần tạo

- `backend/src/models/notebookModel.js`
- `backend/src/controllers/notebookController.js`
- `backend/src/routes/notebookRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount notebookRoutes)

### Thành phần liên quan

- Controllers
- Routes
- Models

### Database liên quan

- Table: user_vocabularies JOIN vocabularies

### Frontend liên quan

Không.

### Kết quả mong đợi

GET /api/notebook → 200 + danh sách (phân loại status, search, phân trang).

### Acceptance Criteria

1. GET /api/notebook → 200 + danh sách từ vựng (word, meaning, status, review_count).
2. Search: ?search=word → lọc theo word (LIKE).
3. Status: ?status=learning → lọc theo status.
4. Phân trang: ?page=1&limit=20.
5. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: GET → danh sách. Search → lọc. Status → lọc.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Không token → 401.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M6-T2

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

Tạo route GET /api/notebook/:vocabulary_id + controller. JOIN user_vocabularies + vocabularies.

### Điều kiện bắt đầu

M6-T1 hoàn thành.

### Công việc cần thực hiện

1. Trong notebookModel, thêm hàm `getDetail(userId, vocabId)`.
2. JOIN user_vocabularies + vocabularies WHERE user_id = ? AND vocabulary_id = ?.
3. Trong notebookController, thêm hàm `getDetail`.
4. Route: GET /api/notebook/:vocabulary_id → authMiddleware.

### File cần chỉnh sửa

- `backend/src/models/notebookModel.js`
- `backend/src/controllers/notebookController.js`
- `backend/src/routes/notebookRoutes.js`

### Thành phần liên quan

- Controllers
- Routes
- Models

### Database liên quan

- Table: user_vocabularies JOIN vocabularies

### Frontend liên quan

Không.

### Kết quả mong đợi

GET /api/notebook/1 → 200 + chi tiết đầy đủ. Không tồn tại → 404.

### Acceptance Criteria

1. GET /api/notebook/1 → 200 + chi tiết (word, meaning, pronunciation, part_of_speech, example, example_meaning, status, review_count, next_review_at).
2. Không tồn tại → 404.
3. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: GET → chi tiết.
- **Kiểm thử lỗi**: Không tồn tại → 404.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M6-T3

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

### Điều kiện bắt đầu

M6-T1 hoàn thành.

### Công việc cần thực hiện

1. Trong notebookController, thêm hàm `reviewVocabulary`.
2. Kiểm tra vocabulary thuộc user.
3. UPDATE user_vocabularies: status='learning', next_review_at = NOW().
4. Trả về success.
5. Route: POST /api/notebook/review/:vocabulary_id → authMiddleware.

### File cần chỉnh sửa

- `backend/src/controllers/notebookController.js`
- `backend/src/routes/notebookRoutes.js`

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: user_vocabularies (UPDATE)

### Frontend liên quan

Không.

### Kết quả mong đợi

POST → 200 + status='learning'. Từ mastered → chuyển learning.

### Acceptance Criteria

1. POST /api/notebook/review/1 → 200 + status chuyển 'learning'.
2. next_review_at reset về NOW().
3. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: POST → chuyển learning.
- **Kiểm thử dữ liệu**: Kiểm tra user_vocabularies đã update.
- **Kiểm thử lỗi**: vocabulary không thuộc user → 404.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M6-T4

Task này có độ phức tạp L (Large), cần chia thành các subtask.

### Subtask M6-T4.1

#### Thông tin

- **ID**: M6-T4.1
- **Tên**: Trang Sổ tay từ vựng - Cấu trúc HTML và CSS
- **Milestone**: M6
- **User Story**: US-05
- **Functional Requirement**: FR-028, FR-029, FR-030
- **Module**: Notebook
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T8, M2-T13

#### Mục tiêu

Tạo cấu trúc HTML và CSS cho trang Sổ tay từ vựng.

#### Điều kiện bắt đầu

M1-T8, M2-T13 hoàn thành.

#### Công việc cần thực hiện

1. Tạo file `frontend/src/pages/notebook/notebook.html`:
   - Header (dùng component).
   - Tổng số từ đang ôn tập.
   - Thanh tìm kiếm.
   - Tabs phân loại: Tất cả, New, Learning, Mastered.
   - Danh sách từ (word, meaning, status badge, review_count).
   - Modal/panel chi tiết từ.
   - Bottom navigation.
   - AI Chat widget.
2. Sử dụng Tailwind CSS.
3. Tạo CSS cho status badges: new (gray), learning (Amber-500), mastered (Emerald-500).

#### File cần tạo

- `frontend/src/pages/notebook/notebook.html`
- `frontend/src/css/pages/notebook.css`

#### File cần chỉnh sửa

Không.

#### Thành phần liên quan

- Pages
- CSS

#### Database liên quan

Không.

#### Frontend liên quan

- HTML: notebook page.
- CSS: notebook.css.

#### Kết quả mong đợi

Trang Sổ tay có cấu trúc đầy đủ.

#### Acceptance Criteria

1. Header hiển thị.
2. Tổng số từ đang ôn tập.
3. Thanh tìm kiếm.
4. Tabs status.
5. Danh sách từ (word, meaning, status, review_count).
6. Modal chi tiết.

#### Kiểm thử

- **Kiểm thử chức năng**: Mở trang, kiểm tra layout.
- **Kết quả mong đợi**: Giao diện hiển thị đúng.

#### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

### Subtask M6-T4.2

#### Thông tin

- **ID**: M6-T4.2
- **Tên**: Trang Sổ tay từ vựng - JavaScript và API
- **Milestone**: M6
- **User Story**: US-05
- **Functional Requirement**: FR-028, FR-029, FR-030
- **Module**: Notebook
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M6-T4.1, M6-T1

#### Mục tiêu

Tạo JavaScript cho trang Sổ tay: gọi API lấy danh sách, tìm kiếm, lọc theo status.

#### Điều kiện bắt đầu

M6-T4.1, M6-T1 hoàn thành.

#### Công việc cần thực hiện

1. Tạo file `frontend/src/js/pages/notebook.js`:
   - DOMContentLoaded: gọi GET /api/notebook → render danh sách.
   - Hiển thị tổng số từ.
   - Tab status: gọi lại API với status filter.
   - Search input: debounce gọi API với search param.
   - Bấm vào từ: gọi GET /api/notebook/:id → hiển thị modal chi tiết.
2. Handle loading, error states.

#### File cần tạo

- `frontend/src/js/pages/notebook.js`

#### File cần chỉnh sửa

Không.

#### Thành phần liên quan

- Pages JS

#### Database liên quan

Không.

#### Frontend liên quan

- JS: notebook logic.

#### Kết quả mong đợi

Hiển thị danh sách, search hoạt động, filter status hoạt động.

#### Acceptance Criteria

1. Load danh sách từ API.
2. Search: gõ → gọi API → lọc kết quả.
3. Tab status: chuyển tab → gọi API → lọc.
4. Bấm từ: mở modal chi tiết.

#### Kiểm thử

- **Kiểm thử chức năng**: Load, search, filter status.
- **Kiểm thử lỗi**: API lỗi → toast.
- **Kết quả mong đợi**: Notebook hoạt động đúng.

#### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

### Subtask M6-T4.3

#### Thông tin

- **ID**: M6-T4.3
- **Tên**: Trang Sổ tay từ vựng - Chi tiết và Ôn lại
- **Milestone**: M6
- **User Story**: US-05
- **Functional Requirement**: FR-031, FR-032
- **Module**: Notebook
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M6-T4.2, M6-T2, M6-T3

#### Mục tiêu

Hoàn thiện modal chi tiết từ và nút "Ôn lại".

#### Điều kiện bắt đầu

M6-T4.2, M6-T2, M6-T3 hoàn thành.

#### Công việc cần thực hiện

1. Trong notebook.js, thêm:
   - Modal hiển thị chi tiết từ (word, meaning, pronunciation, part_of_speech, example, example_meaning, status, review_count).
   - Nút "Ôn lại" trên từ mastered: gọi POST /api/notebook/review/:id → cập nhật UI.
   - Toast notification cho kết quả.

#### File cần chỉnh sửa

- `frontend/src/js/pages/notebook.js`

#### Thành phần liên quan

- Pages JS

#### Kết quả mong đợi

Xem chi tiết từ, nút "Ôn lại" hoạt động.

#### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M6-T5

### Thông tin

- **ID**: M6-T5
- **Tên**: API Lấy Streak
- **Milestone**: M6
- **User Story**: US-10
- **Functional Requirement**: FR-033
- **Module**: Streak
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M2-T5, M2-T1

### Mục tiêu

Tạo route GET /api/streak + controller. Trả về streak, last_study_date từ bảng users.

### Điều kiện bắt đầu

M2-T5, M2-T1 hoàn thành.

### Công việc cần thực hiện

1. Tạo file `backend/src/controllers/streakController.js`.
2. Hàm `getStreak`: lấy req.user.id, gọi userModel.findById, trả về { streak, last_study_date }.
3. Tạo file `backend/src/routes/streakRoutes.js`.
4. Route: GET /api/streak → authMiddleware → streakController.getStreak.

### File cần tạo

- `backend/src/controllers/streakController.js`
- `backend/src/routes/streakRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount streakRoutes)

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: users (streak, last_study_date)

### Frontend liên quan

Không.

### Kết quả mong đợi

GET /api/streak → 200 + { streak, last_study_date }.

### Acceptance Criteria

1. GET /api/streak → 200 + { streak, last_study_date }.
2. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: GET → streak.
- **Kiểm thử lỗi**: Không token → 401.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M6-T6

### Thông tin

- **ID**: M6-T6
- **Tên**: Service/Logic Cập nhật Streak
- **Milestone**: M6
- **User Story**: US-10
- **Functional Requirement**: FR-034, FR-035, FR-036
- **Module**: Streak
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M6-T5

### Mục tiêu

Tạo service/hàm updateStreak: kiểm tra last_study_date, tăng/reset streak.

### Điều kiện bắt đầu

M6-T5 hoàn thành.

### Công việc cần thực hiện

1. Trong streakController, thêm hàm/phương thức `updateStreak(userId, currentDate)`:
   - Lấy user từ DB: userModel.findById(userId).
   - Nếu last_study_date === null: streak = 1.
   - Nếu last_study_date === hôm qua (currentDate - 1 ngày): streak += 1.
   - Nếu last_study_date === hôm nay: không thay đổi (mỗi ngày 1 lần).
   - Nếu last_study_date < hôm qua: streak = 1 (reset).
   - Cập nhật users: SET streak = ?, last_study_date = ?.
2. Export hàm để các module khác (learning, quiz) gọi.

### File cần chỉnh sửa

- `backend/src/controllers/streakController.js`

### Thành phần liên quan

- Controllers

### Database liên quan

- Table: users (UPDATE streak, last_study_date)

### Frontend liên quan

Không.

### Kết quả mong đợi

Đúng streak rules: hôm qua→+1, hôm nay→giữ nguyên, quá 1 ngày→reset=1. Mỗi ngày chỉ 1 lần.

### Acceptance Criteria

1. Học hôm qua → streak + 1.
2. Học hôm nay → streak giữ nguyên.
3. Bỏ lỡ 1 ngày → streak = 1.
4. Lần đầu học → streak = 1.
5. Mỗi ngày chỉ cập nhật 1 lần.

### Kiểm thử

- **Kiểm thử chức năng**: Test từng case (hôm qua, hôm nay, quá 1 ngày, lần đầu).
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Không.
- **Kết quả mong đợi**: Streak logic đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [x] Testing
- [ ] Documentation

---

## Task M6-T7

### Thông tin

- **ID**: M6-T7
- **Tên**: Hiển thị Streak trên Dashboard
- **Milestone**: M6
- **User Story**: US-10
- **Functional Requirement**: FR-033
- **Module**: Dashboard
- **Priority**: P0
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M3-T9, M6-T5

### Mục tiêu

Cập nhật Dashboard frontend: hiển thị streak từ API.

### Điều kiện bắt đầu

M3-T9, M6-T5 hoàn thành.

### Công việc cần thực hiện

1. Trong dashboard.js, thêm: gọi GET /api/streak → hiển thị streak (số ngày) và icon khuyến khích nếu streak > 0.
2. Cập nhật CSS cho streak display.

### File cần chỉnh sửa

- `frontend/src/js/pages/dashboard.js`
- `frontend/src/pages/dashboard/dashboard.html`

### Thành phần liên quan

- Pages JS
- Pages HTML

### Database liên quan

Không.

### Frontend liên quan

- JS: dashboard.js.

### Kết quả mong đợi

Dashboard hiển thị streak đúng số ngày.

### Acceptance Criteria

1. Dashboard hiển thị streak từ API.
2. Icon khuyến khích hiển thị khi streak > 0.

### Kiểm thử

- **Kiểm thử chức năng**: Load dashboard, kiểm tra streak.
- **Kết quả mong đợi**: Streak hiển thị đúng.

### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

# Milestone 7: AI Assistant

## Task M7-T1

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

### Điều kiện bắt đầu

M1-T2 hoàn thành.

### Công việc cần thực hiện

1. Tạo file `backend/src/models/aiModel.js`.
2. Hàm `createConversation(userId)`: INSERT INTO ai_conversations (user_id) VALUES (?).
3. Hàm `getConversationsByUser(userId)`: SELECT * FROM ai_conversations WHERE user_id = ? ORDER BY updated_at DESC.
4. Hàm `createMessage({ conversationId, role, content })`: INSERT INTO ai_messages.
5. Hàm `getMessagesByConversation(conversationId, limit = 10)`: SELECT * FROM ai_messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT ?.
6. Hàm `getConversationById(conversationId)`: SELECT * FROM ai_conversations WHERE id = ?.
7. Tất cả hàm dùng Prepared Statements.

### File cần tạo

- `backend/src/models/aiModel.js`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Models

### Database liên quan

- Table: ai_conversations, ai_messages

### Frontend liên quan

Không.

### Kết quả mong đợi

Model có đủ 5 hàm, dùng Prepared Statements.

### Acceptance Criteria

1. Có hàm: createConversation, getConversationsByUser, createMessage, getMessagesByConversation, getConversationById.
2. Prepared Statements cho tất cả hàm.

### Kiểm thử

- **Kiểm thử chức năng**: Gọi từng hàm.
- **Kiểm thử dữ liệu**: Tạo conversation → tạo messages → get.
- **Kiểm thử lỗi**: FK không tồn tại → lỗi.
- **Kết quả mong đợi**: Model hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M7-T2

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
- **Dependencies**: M2-T5, M7-T1

### Mục tiêu

Tạo route POST /api/ai/conversations (tạo mới) và GET /api/ai/conversations (lấy danh sách).

### Điều kiện bắt đầu

M2-T5, M7-T1 hoàn thành.

### Công việc cần thực hiện

1. Tạo file `backend/src/controllers/aiController.js`.
2. Tạo file `backend/src/routes/aiRoutes.js`.
3. Hàm `createConversation`: gọi aiModel.createConversation(userId), trả về conversation.
4. Hàm `getConversations`: gọi aiModel.getConversationsByUser(userId).
5. Route: POST /api/ai/conversations → authMiddleware → aiController.createConversation.
6. Route: GET /api/ai/conversations → authMiddleware → aiController.getConversations.

### File cần tạo

- `backend/src/controllers/aiController.js`
- `backend/src/routes/aiRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount aiRoutes)

### Thành phần liên quan

- Controllers
- Routes

### Database liên quan

- Table: ai_conversations

### Frontend liên quan

Không.

### Kết quả mong đợi

POST → 201 + conversation. GET → 200 + danh sách.

### Acceptance Criteria

1. POST /api/ai/conversations → 201 + conversation.
2. GET /api/ai/conversations → 200 + danh sách.
3. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: Tạo conversation, lấy danh sách.
- **Kiểm thử lỗi**: Không token → 401.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M7-T3

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

### Điều kiện bắt đầu

M7-T1 hoàn thành.

### Công việc cần thực hiện

1. Tạo file `backend/src/services/aiService.js`.
2. Hàm `chat({ userId, message, conversationId, context })`:
   - Nếu conversationId null: tạo conversation mới.
   - Lấy 10 tin nhắn gần nhất từ ai_messages.
   - Ghép system prompt (hướng dẫn AI làm trợ lý học tiếng Anh).
   - Ghép context (nếu có: topic_id, vocabulary_id).
   - Ghép lịch sử (10 tin nhắn).
   - Ghép user message.
   - Gọi Gemini API (gemini-pro hoặc tương đương).
   - Parse response.
   - Lưu user message + assistant message vào ai_messages.
   - Trả về reply.
3. Xử lý lỗi API/timeout: trả về error message thân thiện, log lỗi.
4. Sử dụng GEMINI_API_KEY từ biến môi trường.

### File cần tạo

- `backend/src/services/aiService.js`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Services

### Database liên quan

- Table: ai_conversations, ai_messages

### Frontend liên quan

Không.

### Kết quả mong đợi

Gọi Gemini API thành công, lưu messages, trả về reply. Lỗi API → trả về error message thân thiện.

### Acceptance Criteria

1. Gọi Gemini API thành công → trả về reply.
2. Lưu user message + assistant message vào ai_messages.
3. Ghép context (topic_id, vocabulary_id) nếu có.
4. Lấy 10 tin nhắn gần nhất cho context.
5. Xử lý lỗi API/timeout → trả về message thân thiện.

### Kiểm thử

- **Kiểm thử chức năng**: Gọi chat() với message.
- **Kiểm thử dữ liệu**: Kiểm tra messages được lưu.
- **Kiểm thử lỗi**: API key sai → error message thân thiện.
- **Kết quả mong đợi**: Service hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [x] Testing
- [ ] Documentation

---

## Task M7-T4

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

Tạo route POST /api/ai/chat + controller. Input: message, conversation_id (optional), context (optional). Gọi aiService.chat().

### Điều kiện bắt đầu

M7-T3, M7-T1 hoàn thành.

### Công việc cần thực hiện

1. Trong aiController, thêm hàm `chat`.
2. Input: message, conversation_id (optional), context (optional: { topic_id, vocabulary_id }).
3. Validate: message không rỗng.
4. Gọi aiService.chat({ userId, message, conversationId, context }).
5. Trả về: { success: true, data: { conversation_id, reply, role: 'assistant' } }.
6. Format response theo spec 7.8.
7. Route: POST /api/ai/chat → authMiddleware → aiController.chat.

### File cần chỉnh sửa

- `backend/src/controllers/aiController.js`
- `backend/src/routes/aiRoutes.js`

### Thành phần liên quan

- Controllers
- Routes
- Services (aiService)

### Database liên quan

- Table: ai_conversations, ai_messages

### Frontend liên quan

Không.

### Kết quả mong đợi

POST /api/ai/chat → 200 + reply. Lưu user+assistant messages.

### Acceptance Criteria

1. POST /api/ai/chat → 200 + reply.
2. Lưu user+assistant messages.
3. Có conversation_id mới khi không truyền.
4. Error → thông báo thân thiện.
5. Yêu cầu authMiddleware.

### Kiểm thử

- **Kiểm thử chức năng**: Chat với AI.
- **Kiểm thử dữ liệu**: Kiểm tra messages được lưu.
- **Kiểm thử lỗi**: Message rỗng → 400.
- **Kết quả mong đợi**: API hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [x] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M7-T5

Task này có độ phức tạp L (Large), cần chia thành các subtask.

### Subtask M7-T5.1

#### Thông tin

- **ID**: M7-T5.1
- **Tên**: Component AI Chat - HTML và CSS
- **Milestone**: M7
- **User Story**: US-06
- **Functional Requirement**: FR-037
- **Module**: AI Assistant
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T8, M2-T13

#### Mục tiêu

Tạo component AI Chat: icon bong bóng cố định góc dưới phải, popup chat.

#### Điều kiện bắt đầu

M1-T8, M2-T13 hoàn thành.

#### Công việc cần thực hiện

1. Tạo file `frontend/src/components/ai-chat.html`:
   - Icon bong bóng (chat bubble) cố định góc dưới phải.
   - Popup chat: header (title + nút đóng), message list, input + nút gửi.
   - Nút "Hội thoại mới".
2. Tạo CSS cho ai-chat widget:
   - Position fixed, bottom right.
   - Popup: max-height, scrollable messages.
   - Responsive.
3. Sử dụng Tailwind CSS.

#### File cần tạo

- `frontend/src/components/ai-chat.html`
- `frontend/src/css/components/ai-chat.css`

#### File cần chỉnh sửa

Không.

#### Thành phần liên quan

- Components
- CSS

#### Database liên quan

Không.

#### Frontend liên quan

- HTML: ai-chat component.
- CSS: ai-chat.css.

#### Kết quả mong đợi

Icon AI hiển thị trên mọi trang. Popup chat mở/đóng.

#### Acceptance Criteria

1. Icon bong bóng cố định góc dưới phải.
2. Click icon → mở popup chat.
3. Popup có header, message list, input, nút gửi.
4. Nút đóng → đóng popup.
5. Nút "Hội thoại mới".

#### Kiểm thử

- **Kiểm thử chức năng**: Mở/đóng popup.
- **Kết quả mong đợi**: UI đúng.

#### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

### Subtask M7-T5.2

#### Thông tin

- **ID**: M7-T5.2
- **Tên**: Component AI Chat - JavaScript và API Integration
- **Milestone**: M7
- **User Story**: US-06
- **Functional Requirement**: FR-037, FR-038, FR-040, FR-042
- **Module**: AI Assistant
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M7-T5.1, M7-T2, M7-T4

#### Mục tiêu

Tạo JavaScript cho AI Chat: gọi API, hiển thị tin nhắn, xử lý hội thoại.

#### Điều kiện bắt đầu

M7-T5.1, M7-T2, M7-T4 hoàn thành.

#### Công việc cần thực hiện

1. Tạo file `frontend/src/js/components/ai-chat.js`:
   - DOMContentLoaded: load component HTML vào trang.
   - Gọi GET /api/ai/conversations → hiển thị danh sách (hoặc tạo mới).
   - Xử lý gửi tin nhắn: gọi POST /api/ai/chat → hiển thị reply.
   - Nút "Hội thoại mới": gọi POST /api/ai/conversations.
   - Lưu conversation_id hiện tại.
   - Xử lý lỗi AI → hiển thị thông báo "AI hiện không khả dụng, vui lòng thử lại sau."
2. Tích hợp vào dashboard, learn, quiz, notebook, profile pages.

#### File cần tạo

- `frontend/src/js/components/ai-chat.js`

#### File cần chỉnh sửa

- Các file HTML trang (dashboard, learn, quiz, notebook, profile) để include component.

#### Thành phần liên quan

- Components JS

#### Database liên quan

Không.

#### Frontend liên quan

- JS: ai-chat logic.
- HTML: các trang include component.

#### Kết quả mong đợi

Icon hiển thị trên mọi trang. Popup chat mở/đóng. Gửi tin nhắn → nhận reply.

#### Acceptance Criteria

1. Icon AI hiển thị trên dashboard, learn, quiz, notebook, profile.
2. Gửi tin nhắn → gọi API → hiển thị reply.
3. Tạo hội thoại mới.
4. Lỗi AI → thông báo thân thiện.

#### Kiểm thử

- **Kiểm thử chức năng**: Gửi tin nhắn, nhận reply.
- **Kiểm thử dữ liệu**: Không.
- **Kiểm thử lỗi**: Lỗi API → toast.
- **Kết quả mong đợi**: AI Chat hoạt động đúng.

#### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

# Milestone 8: Admin Dashboard

## Task M8-T1

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
- **Dependencies**: M2-T5, M2-T6, M3-T1

### Mục tiêu

Tạo route GET/POST/PUT/DELETE /api/admin/roadmaps cho CRUD Roadmaps.

### Điều kiện bắt đầu

M2-T5, M2-T6, M3-T1 hoàn thành.

### Công việc cần thực hiện

1. Trong adminController (tạo mới hoặc dùng chung), thêm các hàm CRUD cho roadmaps.
2. Route: GET /api/admin/roadmaps → authMiddleware + adminMiddleware → adminController.getAllRoadmaps.
3. Route: GET /api/admin/roadmaps/:id → adminMiddleware → adminController.getRoadmapById.
4. Route: POST /api/admin/roadmaps → adminMiddleware → adminController.createRoadmap (name, description, image, is_active, sort_order).
5. Route: PUT /api/admin/roadmaps/:id → adminMiddleware → adminController.updateRoadmap.
6. Route: DELETE /api/admin/roadmaps/:id → adminMiddleware → adminController.deleteRoadmap.
7. Validation: required fields, unique name.
8. Format response theo spec 7.9.

### File cần tạo

- `backend/src/controllers/adminController.js`
- `backend/src/routes/adminRoutes.js`

### File cần chỉnh sửa

- `backend/src/server.js` (mount adminRoutes)

### Thành phần liên quan

- Controllers
- Routes
- Middleware (auth + admin)

### Database liên quan

- Table: roadmaps

### Frontend liên quan

Không.

### Kết quả mong đợi

GET/POST/PUT/DELETE hoạt động. Xác thực admin.

### Acceptance Criteria

1. GET /api/admin/roadmaps → danh sách.
2. POST → tạo roadmap mới.
3. PUT → cập nhật roadmap.
4. DELETE → xóa roadmap.
5. User không admin → 403.
6. Validation: name required, unique name.

### Kiểm thử

- **Kiểm thử chức năng**: CRUD roadmaps.
- **Kiểm thử dữ liệu**: Kiểm tra DB.
- **Kiểm thử lỗi**: User → 403. Validation → 400.
- **Kết quả mong đợi**: API admin roadmaps hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [x] Validation
- [x] Testing
- [ ] Documentation

---

## Task M8-T2

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

### Mục tiêu

Tạo route GET/POST/PUT/DELETE /api/admin/topics cho CRUD Topics.

### Điều kiện bắt đầu

M8-T1, M3-T3 hoàn thành.

### Công việc cần thực hiện

1. Trong adminController, thêm các hàm CRUD cho topics.
2. Route: GET /api/admin/topics?roadmap_id=x → adminMiddleware → adminController.getAllTopics.
3. Route: GET /api/admin/topics/:id → adminMiddleware → adminController.getTopicById.
4. Route: POST /api/admin/topics → adminMiddleware → adminController.createTopic (roadmap_id, name, description, image, is_active, sort_order).
5. Route: PUT /api/admin/topics/:id → adminMiddleware → adminController.updateTopic.
6. Route: DELETE /api/admin/topics/:id → adminMiddleware → adminController.deleteTopic.
7. Validation: roadmap_id tồn tại, required fields.
8. Format response theo spec 7.10.

### File cần chỉnh sửa

- `backend/src/controllers/adminController.js`
- `backend/src/routes/adminRoutes.js`

### Thành phần liên quan

- Controllers
- Routes
- Middleware

### Database liên quan

- Table: topics

### Frontend liên quan

Không.

### Kết quả mong đợi

GET/POST/PUT/DELETE hoạt động. Topic gắn đúng roadmap_id.

### Acceptance Criteria

1. GET /api/admin/topics?roadmap_id=1 → danh sách topics theo roadmap.
2. POST → tạo topic (gắn roadmap_id).
3. PUT → cập nhật.
4. DELETE → xóa.
5. User không admin → 403.

### Kiểm thử

- **Kiểm thử chức năng**: CRUD topics.
- **Kiểm thử lỗi**: roadmap_id không tồn tại → 404. User → 403.
- **Kết quả mong đợi**: API admin topics hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [x] Validation
- [x] Testing
- [ ] Documentation

---

## Task M8-T3

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

### Mục tiêu

Tạo route GET/POST/PUT/DELETE /api/admin/vocabularies cho CRUD Vocabularies.

### Điều kiện bắt đầu

M8-T1, M3-T5 hoàn thành.

### Công việc cần thực hiện

1. Trong adminController, thêm các hàm CRUD cho vocabularies.
2. Route: GET /api/admin/vocabularies?topic_id=x → adminMiddleware → adminController.getAllVocabularies.
3. Route: GET /api/admin/vocabularies/:id → adminMiddleware → adminController.getVocabularyById.
4. Route: POST /api/admin/vocabularies → adminMiddleware → adminController.createVocabulary (topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image).
5. Route: PUT /api/admin/vocabularies/:id → adminMiddleware → adminController.updateVocabulary.
6. Route: DELETE /api/admin/vocabularies/:id → adminMiddleware → adminController.deleteVocabulary.
7. Validation: topic_id tồn tại, required fields.
8. Format response theo spec 7.11.

### File cần chỉnh sửa

- `backend/src/controllers/adminController.js`
- `backend/src/routes/adminRoutes.js`

### Thành phần liên quan

- Controllers
- Routes
- Middleware

### Database liên quan

- Table: vocabularies

### Frontend liên quan

Không.

### Kết quả mong đợi

GET/POST/PUT/DELETE hoạt động. Vocabulary gắn đúng topic_id.

### Acceptance Criteria

1. GET /api/admin/vocabularies?topic_id=1 → danh sách.
2. POST → tạo vocabulary (gắn topic_id, đầy đủ trường).
3. PUT → cập nhật.
4. DELETE → xóa.
5. User không admin → 403.

### Kiểm thử

- **Kiểm thử chức năng**: CRUD vocabularies.
- **Kiểm thử lỗi**: topic_id không tồn tại → 404. User → 403.
- **Kết quả mong đợi**: API admin vocabularies hoạt động đúng.

### Checklist

- [x] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [x] Validation
- [x] Testing
- [ ] Documentation

---

## Task M8-T4

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

Cấu hình multer upload ảnh và audio, tích hợp vào route admin vocabulary.

### Điều kiện bắt đầu

M8-T3 hoàn thành.

### Công việc cần thực hiện

1. Tạo file `backend/src/config/upload.js`.
2. Cấu hình multer:
   - Storage: disk storage, destination and filename.
   - File filter: JPG, PNG cho ảnh; MP3 cho audio.
   - Size limit: 5MB cho ảnh, 2MB cho audio.
3. Upload ảnh → lưu vào frontend/public/uploads/images/.
4. Upload audio → lưu vào frontend/public/uploads/audio/.
5. Tên file: {timestamp}-{random}.{ext}.
6. Tích hợp vào route POST/PUT vocabulary admin: dùng multer middleware.
7. Lưu đường dẫn file vào database (audio, image fields).

### File cần tạo

- `backend/src/config/upload.js`

### File cần chỉnh sửa

- `backend/src/routes/adminRoutes.js` (thêm multer middleware)

### Thành phần liên quan

- Config
- Routes

### Database liên quan

- Table: vocabularies (audio, image fields)

### Frontend liên quan

- Thư mục uploads.

### Kết quả mong đợi

Upload ảnh → lưu vào uploads/images/. Upload audio → lưu vào uploads/audio/. Sai định dạng/kích thước → 400.

### Acceptance Criteria

1. Upload ảnh JPG/PNG (max 5MB) → lưu vào uploads/images/.
2. Upload audio MP3 (max 2MB) → lưu vào uploads/audio/.
3. Tên file unique: {timestamp}-{random}.{ext}.
4. Sai định dạng → 400.
5. Quá kích thước → 400.
6. Chỉ admin mới được upload.

### Kiểm thử

- **Kiểm thử chức năng**: Upload ảnh, audio.
- **Kiểm thử dữ liệu**: Kiểm tra file lưu đúng thư mục.
- **Kiểm thử lỗi**: Sai định dạng → 400. Quá size → 400.
- **Kết quả mong đợi**: Upload hoạt động đúng.

### Checklist

- [ ] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [x] Validation
- [x] Testing
- [ ] Documentation

---

## Task M8-T5

Task này có độ phức tạp L (Large), cần chia thành các subtask.

### Subtask M8-T5.1

#### Thông tin

- **ID**: M8-T5.1
- **Tên**: Trang Admin Dashboard - Layout và Navigation
- **Milestone**: M8
- **User Story**: US-07, US-08
- **Functional Requirement**: FR-043, FR-044
- **Module**: Admin
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T8, M2-T13, M2-T6

#### Mục tiêu

Tạo layout Admin Dashboard với Bootstrap, tông màu tối, menu navigation.

#### Điều kiện bắt đầu

M1-T8, M2-T13, M2-T6 hoàn thành.

#### Công việc cần thực hiện

1. Tạo file `frontend/src/pages/admin/dashboard.html`:
   - Sidebar menu: Roadmaps, Topics, Vocabularies.
   - Main content area.
   - Sử dụng Bootstrap 5.
   - Tông màu tối (Slate/Dark).
2. Tạo file `frontend/src/css/admin.css`:
   - Style cho Admin Dashboard.
   - Sidebar dark theme.
3. Tạo file `frontend/src/js/pages/admin.js`:
   - Kiểm tra role admin (nếu không → redirect).
   - Load menu, navigation giữa các section.
   - Không include AI Chat (admin không dùng).

#### File cần tạo

- `frontend/src/pages/admin/dashboard.html`
- `frontend/src/css/admin.css`
- `frontend/src/js/pages/admin.js`

#### File cần chỉnh sửa

Không.

#### Thành phần liên quan

- Pages
- CSS

#### Database liên quan

Không.

#### Frontend liên quan

- HTML: admin dashboard.
- CSS: admin.css.
- JS: admin.js.

#### Kết quả mong đợi

Admin Dashboard hiển thị với sidebar menu, tông màu tối.

#### Acceptance Criteria

1. Sidebar menu với Roadmaps, Topics, Vocabularies.
2. Main content area.
3. Bootstrap 5, tông màu tối.
4. Kiểm tra role admin.
5. User không admin → redirect.

#### Kiểm thử

- **Kiểm thử chức năng**: Mở admin dashboard.
- **Kết quả mong đợi**: Layout đúng.

#### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

### Subtask M8-T5.2

#### Thông tin

- **ID**: M8-T5.2
- **Tên**: Trang Admin Dashboard - CRUD Roadmaps và Topics
- **Milestone**: M8
- **User Story**: US-07
- **Functional Requirement**: FR-045, FR-046, FR-048, FR-049
- **Module**: Admin
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M8-T5.1, M8-T1, M8-T2

#### Mục tiêu

Xây dựng giao diện CRUD cho Roadmaps và Topics trong Admin Dashboard.

#### Điều kiện bắt đầu

M8-T5.1, M8-T1, M8-T2 hoàn thành.

#### Công việc cần thực hiện

1. Trong admin.js, thêm:
   - Section Roadmaps: DataTable danh sách, modal form thêm/sửa (name, description, is_active, sort_order), nút xóa (confirm).
   - Section Topics: DataTable danh sách (filter theo roadmap), modal form thêm/sửa (roadmap_id, name, description, is_active, sort_order), nút xóa.
   - Gọi API /api/admin/roadmaps và /api/admin/topics.
   - Toast notification cho CRUD operations.

#### File cần chỉnh sửa

- `frontend/src/js/pages/admin.js`
- `frontend/src/pages/admin/dashboard.html`

#### Thành phần liên quan

- Pages JS
- Pages HTML

#### Database liên quan

Không.

#### Frontend liên quan

- JS: admin CRUD logic.

#### Kết quả mong đợi

Admin CRUD Roadmaps và Topics thành công.

#### Acceptance Criteria

1. Danh sách Roadmaps hiển thị.
2. Thêm Roadmap thành công.
3. Sửa Roadmap thành công.
4. Xóa Roadmap thành công.
5. Danh sách Topics hiển thị (filter theo roadmap).
6. Thêm/Sửa/Xóa Topics thành công.

#### Kiểm thử

- **Kiểm thử chức năng**: CRUD roadmaps, topics.
- **Kiểm thử lỗi**: Validation → toast lỗi.
- **Kết quả mong đợi**: CRUD hoạt động đúng.

#### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [x] API
- [x] Validation
- [ ] Testing
- [ ] Documentation

---

### Subtask M8-T5.3

#### Thông tin

- **ID**: M8-T5.3
- **Tên**: Trang Admin Dashboard - CRUD Vocabularies và Upload File
- **Milestone**: M8
- **User Story**: US-08
- **Functional Requirement**: FR-047
- **Module**: Admin
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M8-T5.2, M8-T3, M8-T4

#### Mục tiêu

Xây dựng giao diện CRUD Vocabularies với upload file.

#### Điều kiện bắt đầu

M8-T5.2, M8-T3, M8-T4 hoàn thành.

#### Công việc cần thực hiện

1. Trong admin.js, thêm:
   - Section Vocabularies: DataTable danh sách (filter theo topic, hiển thị word, pronunciation, meaning, topic).
   - Modal form thêm/sửa: topic_id (dropdown), word, pronunciation, part_of_speech (dropdown), meaning, example, example_meaning, audio (file upload), image (file upload).
   - Upload file: dùng FormData + multer.
   - Nút xóa (confirm).
   - Gọi API /api/admin/vocabularies.
   - Toast notification.

#### File cần chỉnh sửa

- `frontend/src/js/pages/admin.js`
- `frontend/src/pages/admin/dashboard.html`

#### Thành phần liên quan

- Pages JS
- Pages HTML

#### Database liên quan

Không.

#### Frontend liên quan

- JS: vocab CRUD + upload logic.

#### Kết quả mong đợi

Admin CRUD Vocabularies thành công, upload file hoạt động.

#### Acceptance Criteria

1. Danh sách Vocabularies hiển thị (filter theo topic).
2. Thêm Vocabulary (có upload file) thành công.
3. Sửa Vocabulary thành công.
4. Xóa Vocabulary thành công.
5. Upload ảnh/audio hoạt động.

#### Kiểm thử

- **Kiểm thử chức năng**: CRUD vocabularies, upload file.
- **Kiểm thử lỗi**: Validation → toast.
- **Kết quả mong đợi**: CRUD và upload hoạt động đúng.

#### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [x] API
- [x] Validation
- [ ] Testing
- [ ] Documentation

---

# Milestone 9: Validation, Error Handling, Performance, Testing & Polish

## Task M9-T1

### Thông tin

- **ID**: M9-T1
- **Tên**: Backend Validation
- **Milestone**: M9
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-007, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-019, FR-020, FR-021, FR-022, FR-023, FR-024, FR-025, FR-026, FR-027, FR-028, FR-029, FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-037, FR-038, FR-039, FR-040, FR-041, FR-042, FR-043, FR-044, FR-045, FR-046, FR-047, FR-048, FR-049
- **Module**: Validation
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: Tất cả API đã hoàn thành

### Mục tiêu

Thêm validation cho tất cả API: validate input, kiểm tra FK, UNIQUE constraint.

### Điều kiện bắt đầu

Tất cả API đã hoàn thành.

### Công việc cần thực hiện

1. Kiểm tra và bổ sung validation cho tất cả controller:
   - Email format.
   - Password >= 8 ký tự.
   - Confirm password match.
   - Required fields (name, meaning, word, etc.).
   - FK tồn tại (roadmap_id, topic_id, vocabulary_id).
   - UNIQUE constraint (email, username, topic_id+word).
   - Integer validation cho ID params.
2. Trả về 400 với message cụ thể cho validation lỗi.
3. Trả về 404 cho FK không tồn tại.
4. Trả về 409 cho UNIQUE violation.

### File cần chỉnh sửa

- Tất cả controller files.

### Thành phần liên quan

- Controllers

### Database liên quan

Không.

### Frontend liên quan

Không.

### Kết quả mong đợi

Validation lỗi → 400 + message rõ ràng. FK không tồn tại → 404. Trùng UNIQUE → 409.

### Acceptance Criteria

1. Tất cả API có validation đầu vào.
2. Validation lỗi → 400 + message.
3. FK không tồn tại → 404.
4. UNIQUE violation → 409.

### Kiểm thử

- **Kiểm thử chức năng**: Test từng validation case.
- **Kiểm thử lỗi**: Input sai → 400 + message.
- **Kết quả mong đợi**: Validation toàn diện.

### Checklist

- [ ] Database
- [x] Backend
- [ ] Frontend
- [ ] API
- [x] Validation
- [x] Testing
- [ ] Documentation

---

## Task M9-T2

### Thông tin

- **ID**: M9-T2
- **Tên**: Frontend Validation
- **Milestone**: M9
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-007, FR-050, FR-051
- **Module**: Validation
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: Tất cả Frontend pages

### Mục tiêu

Tạo validator.js và áp dụng cho tất cả form phía Frontend.

### Điều kiện bắt đầu

Tất cả Frontend pages hoàn thành.

### Công việc cần thực hiện

1. Tạo file `frontend/src/js/utils/validator.js` với các hàm:
   - `validateEmail(email)`: trả về true/false + error message.
   - `validatePassword(password)`: kiểm tra >= 8 ký tự.
   - `validateRequired(value, fieldName)`: kiểm tra không rỗng.
   - `validateConfirmPassword(password, confirm)`: kiểm tra match.
2. Áp dụng validator vào các form:
   - Login: email, password.
   - Register: email, password, confirm.
   - Profile change password: old, new, confirm.
   - Admin forms: required fields.

### File cần tạo

- `frontend/src/js/utils/validator.js`

### File cần chỉnh sửa

- Các file JS pages có form.

### Thành phần liên quan

- Utils JS

### Database liên quan

Không.

### Frontend liên quan

- JS: validator.js.

### Kết quả mong đợi

Validation hoạt động ở tất cả form Frontend.

### Acceptance Criteria

1. Validator có đủ 4 hàm.
2. Login form validate email, password.
3. Register form validate email, password >= 8, confirm match.
4. Profile form validate password.
5. Admin forms validate required fields.

### Kiểm thử

- **Kiểm thử chức năng**: Test từng validation.
- **Kiểm thử lỗi**: Input sai → hiển thị lỗi.
- **Kết quả mong đợi**: Validation hoạt động.

### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [ ] API
- [x] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M9-T3

### Thông tin

- **ID**: M9-T3
- **Tên**: Error Handling - HTTP Status Codes
- **Milestone**: M9
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-019, FR-020, FR-021, FR-022, FR-023, FR-024, FR-025, FR-026, FR-027, FR-028, FR-029, FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-037, FR-038, FR-039, FR-040, FR-041, FR-042, FR-043, FR-044, FR-045, FR-046, FR-047, FR-048, FR-049
- **Module**: Error Handling
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: Tất cả API

### Mục tiêu

Kiểm tra tất cả API response đảm bảo HTTP status codes đúng.

### Điều kiện bắt đầu

Tất cả API hoàn thành.

### Công việc cần thực hiện

1. Rà soát tất cả controller:
   - 200: GET, PUT, PATCH, DELETE thành công.
   - 201: POST tạo mới thành công.
   - 400: Validation lỗi.
   - 401: Unauthorized (thiếu token, hết hạn).
   - 403: Forbidden (không phải admin).
   - 404: Resource không tồn tại.
   - 409: Conflict (trùng dữ liệu).
   - 500: Server error.
2. Sửa bất kỳ status code không đúng.
3. Đảm bảo response format thống nhất.

### File cần chỉnh sửa

- Tất cả controller files.

### Thành phần liên quan

- Controllers

### Database liên quan

Không.

### Frontend liên quan

Không.

### Kết quả mong đợi

Mỗi API trả về status code đúng với tình huống.

### Acceptance Criteria

1. GET thành công → 200.
2. POST tạo mới → 201.
3. Validation lỗi → 400.
4. Unauthorized → 401.
5. Forbidden → 403.
6. Not found → 404.
7. Conflict → 409.
8. Server error → 500.

### Kiểm thử

- **Kiểm thử chức năng**: Test từng status code.
- **Kiểm thử lỗi**: Từng tình huống lỗi.
- **Kết quả mong đợi**: Status codes đúng.

### Checklist

- [ ] Database
- [x] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M9-T4

### Thông tin

- **ID**: M9-T4
- **Tên**: Logging Integration
- **Milestone**: M9
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-019, FR-020, FR-021, FR-022, FR-023, FR-024, FR-025, FR-026, FR-027, FR-028, FR-029, FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-037, FR-038, FR-039, FR-040, FR-041, FR-042, FR-043, FR-044, FR-045, FR-046, FR-047, FR-048, FR-049
- **Module**: Error Handling
- **Priority**: P1
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M1-T7, tất cả controller/service

### Mục tiêu

Tích hợp logger vào authController, aiService, adminController, error handling.

### Điều kiện bắt đầu

M1-T7, tất cả controller/service hoàn thành.

### Công việc cần thực hiện

1. Tích hợp logger vào authController:
   - Log register thành công/thất bại.
   - Log login thành công/thất bại.
   - Log change password.
2. Tích hợp logger vào aiService:
   - Log AI request (user_id, conversation_id, message length).
   - Log AI response time.
   - Log AI error/timeout.
3. Tích hợp logger vào adminController:
   - Log CRUD operations (admin_id, action, resource, resource_id).
4. Tích hợp logger vào error handling:
   - Log 500 errors với stack trace.
   - Log database errors.
5. Không log thông tin nhạy cảm (password, token, API key).

### File cần chỉnh sửa

- `backend/src/controllers/authController.js`
- `backend/src/services/aiService.js`
- `backend/src/controllers/adminController.js`
- `backend/src/controllers/* (error handling)`

### Thành phần liên quan

- Controllers
- Services

### Database liên quan

Không.

### Frontend liên quan

Không.

### Kết quả mong đợi

Auth, AI, Admin operations được log. Error được log với stack trace.

### Acceptance Criteria

1. Auth: register, login, change password được log.
2. AI: request, response time, error được log.
3. Admin: CRUD operations được log.
4. Error 500: log stack trace.
5. Không log password, token, API key.

### Kiểm thử

- **Kiểm thử chức năng**: Thực hiện thao tác → kiểm tra log.
- **Kết quả mong đợi**: Logging hoạt động.

### Checklist

- [ ] Database
- [x] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M9-T5

### Thông tin

- **ID**: M9-T5
- **Tên**: Loading States (Frontend)
- **Milestone**: M9
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-050
- **Module**: UI Polish
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: Tất cả Frontend pages

### Mục tiêu

Tạo loading component và áp dụng cho mọi thao tác chờ API.

### Điều kiện bắt đầu

Tất cả Frontend pages hoàn thành.

### Công việc cần thực hiện

1. Tạo file `frontend/src/components/loading.html` (skeleton/spinner).
2. Tạo file `frontend/src/js/components/loading.js`: hàm showLoading/hideLoading.
3. Áp dụng cho:
   - Login, register: loading khi submit.
   - Dashboard: loading topics.
   - Learn: loading vocabularies.
   - Quiz: loading questions.
   - Notebook: loading list.
   - AI chat: loading reply.
   - Admin tables: loading data.

### File cần tạo

- `frontend/src/components/loading.html`
- `frontend/src/js/components/loading.js`

### File cần chỉnh sửa

- Các file JS pages.

### Thành phần liên quan

- Components
- Pages JS

### Database liên quan

Không.

### Frontend liên quan

- HTML: loading component.
- JS: loading.js.

### Kết quả mong đợi

Mọi thao tác API đều có loading indicator. Không để màn hình đứng yên.

### Acceptance Criteria

1. Loading hiển thị khi gọi API.
2. Loading ẩn khi API hoàn thành.
3. Skeleton loading hoặc spinner.
4. Áp dụng cho tất cả trang.

### Kiểm thử

- **Kiểm thử chức năng**: Gọi API → loading hiển thị.
- **Kết quả mong đợi**: Loading hoạt động.

### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M9-T6

### Thông tin

- **ID**: M9-T6
- **Tên**: Toast Notification (Frontend)
- **Milestone**: M9
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-051
- **Module**: UI Polish
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: Tất cả Frontend pages

### Mục tiêu

Tạo toast notification component, không dùng alert(), tự động ẩn 3s.

### Điều kiện bắt đầu

Tất cả Frontend pages hoàn thành.

### Công việc cần thực hiện

1. Tạo file `frontend/src/components/toast.html` (container for toasts).
2. Tạo file `frontend/src/js/components/toast.js`:
   - Hàm `showToast(message, type)`: type = success, error, warning, info.
   - Toast hiển thị góc trên bên phải.
   - Tự động ẩn sau 3 giây.
   - Màu sắc: success (Emerald-500), error (Rose-500), warning (Amber-500), info (#FFC300).
3. Tích hợp vào tất cả trang: thay thế alert() bằng toast.

### File cần tạo

- `frontend/src/components/toast.html`
- `frontend/src/js/components/toast.js`

### File cần chỉnh sửa

- Các file JS pages (thay alert() bằng toast).

### Thành phần liên quan

- Components
- Pages JS

### Database liên quan

Không.

### Frontend liên quan

- HTML: toast component.
- JS: toast.js.

### Kết quả mong đợi

Toast hiển thị đúng, tự động ẩn, không dùng alert(). Có 4 màu.

### Acceptance Criteria

1. showToast(message, 'success') → hiển thị green toast.
2. showToast(message, 'error') → hiển thị red toast.
3. showToast(message, 'warning') → hiển thị yellow toast.
4. showToast(message, 'info') → hiển thị blue toast.
5. Tự động ẩn sau 3s.
6. Không dùng alert().

### Kiểm thử

- **Kiểm thử chức năng**: Gọi showToast với từng type.
- **Kết quả mong đợi**: Toast hoạt động.

### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M9-T7

### Thông tin

- **ID**: M9-T7
- **Tên**: UI Polish
- **Milestone**: M9
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-050, FR-051, FR-052, FR-053
- **Module**: UI Polish
- **Priority**: P0
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: Tất cả Frontend pages

### Mục tiêu

Kiểm tra và hoàn thiện UI: màu sắc design tokens, font, responsive, components đồng bộ.

### Điều kiện bắt đầu

Tất cả Frontend pages hoàn thành.

### Công việc cần thực hiện

1. Kiểm tra màu sắc:
   -  (#FFC300E5) cho primary.
   - Emerald-500 (#10B981) cho success/mastered.
   - Amber-500 (#F59E0B) cho warning/learning.
   - Rose-500 (#F43F5E) cho danger/error.
2. Kiểm tra font: Inter / Roboto / system-ui, hỗ trợ IPA.
3. Kiểm tra responsive layout trên mobile.
4. Đảm bảo header và bottom-nav đồng bộ giữa các trang.
5. Sửa bất kỳ lỗi UI nào.

### File cần chỉnh sửa

- Các file CSS và HTML.

### Thành phần liên quan

- CSS
- Pages

### Database liên quan

Không.

### Frontend liên quan

- Tất cả frontend files.

### Kết quả mong đợi

Màu sắc đúng design tokens. Font hiển thị IPA. Responsive.

### Acceptance Criteria

1. Màu primary: #FFC300
2. Success: Emerald-500.
3. Warning: Amber-500.
4. Danger: Rose-500.
5. Font: Inter/Roboto/system-ui.
6. Responsive trên mobile.
7. Header + bottom-nav đồng bộ.

### Kiểm thử

- **Kiểm thử chức năng**: Kiểm tra từng trang.
- **Kết quả mong đợi**: UI đồng bộ.

### Checklist

- [ ] Database
- [ ] Backend
- [x] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M9-T8

### Thông tin

- **ID**: M9-T8
- **Tên**: Performance - Database Index
- **Milestone**: M9
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-019, FR-020, FR-021, FR-022, FR-023, FR-024, FR-025, FR-026, FR-027, FR-028, FR-029, FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-037, FR-038, FR-039, FR-040, FR-041, FR-042, FR-043, FR-044, FR-045, FR-046, FR-047, FR-048, FR-049
- **Module**: Performance
- **Priority**: P1
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: M1-T3

### Mục tiêu

Kiểm tra và bổ sung INDEX cho các cột thường xuyên truy vấn.

### Điều kiện bắt đầu

M1-T3 hoàn thành.

### Công việc cần thực hiện

1. Kiểm tra schema.sql, đảm bảo INDEX trên:
   - users(email), users(role), users(roadmap_id).
   - topics(roadmap_id).
   - vocabularies(topic_id), vocabularies(word).
   - user_vocabularies(user_id), user_vocabularies(status), user_vocabularies(next_review_at).
   - quiz_answers(quiz_attempt_id).
   - ai_messages(conversation_id).
2. Bổ sung INDEX nếu thiếu.
3. Cập nhật database/schema.sql.

### File cần chỉnh sửa

- `database/schema.sql`

### Thành phần liên quan

- Database

### Database liên quan

- Tất cả bảng.

### Frontend liên quan

Không.

### Kết quả mong đợi

INDEX trên các cột thường xuyên truy vấn.

### Acceptance Criteria

1. INDEX trên users(email), users(role), users(roadmap_id).
2. INDEX trên topics(roadmap_id).
3. INDEX trên vocabularies(topic_id), vocabularies(word).
4. INDEX trên user_vocabularies(user_id, status, next_review_at).
5. INDEX trên quiz_answers(quiz_attempt_id).
6. INDEX trên ai_messages(conversation_id).

### Kiểm thử

- **Kiểm thử chức năng**: Kiểm tra INDEX trong MySQL.
- **Kết quả mong đợi**: INDEX đầy đủ.

### Checklist

- [x] Database
- [ ] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [ ] Documentation

---

## Task M9-T9

### Thông tin

- **ID**: M9-T9
- **Tên**: Testing - Service Unit Tests
- **Milestone**: M9
- **User Story**: US-03, US-04, US-06
- **Functional Requirement**: FR-018, FR-024, FR-025, FR-027, FR-038, FR-039, FR-041
- **Module**: Testing
- **Priority**: P1
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M4-T6, M5-T2, M7-T3

### Mục tiêu

Viết unit test cho SRS service, AI service, Quiz generation rules.

### Điều kiện bắt đầu

M4-T6, M5-T2, M7-T3 hoàn thành.

### Công việc cần thực hiện

1. Cài đặt testing framework: `jest` hoặc `mocha` + `chai`.
2. Test srsService:
   - calculateNextReview(0) → 1 ngày.
   - calculateNextReview(1) → 3 ngày.
   - calculateNextReview(2) → 7 ngày.
   - calculateNextReview(3) → 14 ngày.
   - calculateNextReview(4) → 30 ngày.
   - calculateNextReview(5+) → 30 ngày.
   - handleWrongAnswer() → reviewCount=0, next_review_at=NOW().
3. Test quiz generation rules:
   - Tối đa 20 câu.
   - Ưu tiên review_count thấp.
   - Mỗi từ chỉ 1 lần.
4. Test AI service (mock Gemini API):
   - Prompt generation.
   - Error handling (timeout, API error).

### File cần tạo

- `backend/tests/srsService.test.js`
- `backend/tests/quizService.test.js`
- `backend/tests/aiService.test.js`
- `backend/jest.config.js` (nếu dùng Jest)

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Testing

### Database liên quan

Không.

### Frontend liên quan

Không.

### Kết quả mong đợi

SRS tính đúng next_review_at. Quiz generation đúng rules (max 20, ưu tiên review_count thấp).

### Acceptance Criteria

1. SRS test: tất cả case tính đúng.
2. Quiz generation test: tối đa 20, ưu tiên review_count thấp.
3. AI service test: prompt generation, error handling.

### Kiểm thử

- **Kiểm thử chức năng**: Chạy test.
- **Kết quả mong đợi**: Tất cả test pass.

### Checklist

- [ ] Database
- [ ] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [x] Testing
- [ ] Documentation

---

## Task M9-T10

Task này có độ phức tạp L (Large), cần chia thành các subtask.

### Subtask M9-T10.1

#### Thông tin

- **ID**: M9-T10.1
- **Tên**: Testing - API Integration Tests (Auth & Profile)
- **Milestone**: M9
- **User Story**: US-01, US-02, US-09
- **Functional Requirement**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-010
- **Module**: Testing
- **Priority**: P1
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M2-T2, M2-T3, M2-T4, M2-T7, M2-T8, M2-T9

#### Mục tiêu

Viết integration test cho Auth và Profile API.

#### Điều kiện bắt đầu

Auth và Profile API hoàn thành.

#### Công việc cần thực hiện

1. Tạo file `backend/tests/auth.test.js`:
   - Register thành công → 201.
   - Register email trùng → 409.
   - Register password < 8 → 400.
   - Login thành công → 200 + token.
   - Login sai password → 401.
2. Tạo file `backend/tests/profile.test.js`:
   - GET profile → 200.
   - PUT profile → 200.
   - PUT roadmap → 200.
   - Không token → 401.

#### File cần tạo

- `backend/tests/auth.test.js`
- `backend/tests/profile.test.js`

#### File cần chỉnh sửa

Không.

#### Thành phần liên quan

- Testing

#### Kết quả mong đợi

Test pass cho tất cả API auth và profile.

#### Checklist

- [ ] Database
- [ ] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [x] Testing
- [ ] Documentation

---

### Subtask M9-T10.2

#### Thông tin

- **ID**: M9-T10.2
- **Tên**: Testing - API Integration Tests (Learning & Quiz)
- **Milestone**: M9
- **User Story**: US-03, US-04
- **Functional Requirement**: FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-021, FR-022, FR-024, FR-025, FR-026
- **Module**: Testing
- **Priority**: P1
- **Complexity**: M
- **Status**: Todo
- **Dependencies**: M4-T2, M4-T3, M4-T4, M4-T5, M5-T2, M5-T3, M5-T4

#### Mục tiêu

Viết integration test cho Learning và Quiz API.

#### Điều kiện bắt đầu

Learning và Quiz API hoàn thành.

#### Công việc cần thực hiện

1. Tạo file `backend/tests/learning.test.js`:
   - Start learning → 200 + vocab list.
   - Mastered → 200 + next vocab.
   - Writing prompt → 200.
   - Writing submit → 200.
2. Tạo file `backend/tests/quiz.test.js`:
   - Start quiz → 200 + questions.
   - Answer quiz → 200 + is_correct.
   - Complete quiz → 200 + score.

#### File cần tạo

- `backend/tests/learning.test.js`
- `backend/tests/quiz.test.js`

#### File cần chỉnh sửa

Không.

#### Thành phần liên quan

- Testing

#### Kết quả mong đợi

Test pass cho tất cả API learning và quiz.

#### Checklist

- [ ] Database
- [ ] Backend
- [ ] Frontend
- [x] API
- [ ] Validation
- [x] Testing
- [ ] Documentation

---

## Task M9-T11

### Thông tin

- **ID**: M9-T11
- **Tên**: Deployment Preparation
- **Milestone**: M9
- **User Story**: US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10
- **Functional Requirement**: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018, FR-019, FR-020, FR-021, FR-022, FR-023, FR-024, FR-025, FR-026, FR-027, FR-028, FR-029, FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-037, FR-038, FR-039, FR-040, FR-041, FR-042, FR-043, FR-044, FR-045, FR-046, FR-047, FR-048, FR-049
- **Module**: Deployment
- **Priority**: P1
- **Complexity**: S
- **Status**: Todo
- **Dependencies**: Tất cả milestone

### Mục tiêu

Tạo .env.example, README.md, hướng dẫn triển khai.

### Điều kiện bắt đầu

Tất cả milestone hoàn thành.

### Công việc cần thực hiện

1. Tạo file `backend/.env.example` với các biến:
   - DB_HOST=localhost
   - DB_USER=root
   - DB_PASSWORD=
   - DB_NAME=wordmate
   - JWT_SECRET=your_jwt_secret
   - GEMINI_API_KEY=your_gemini_api_key
   - PORT=3000
2. Tạo file `README.md` (gốc dự án):
   - Giới thiệu dự án.
   - Yêu cầu hệ thống: Node.js, MySQL.
   - Hướng dẫn cài đặt: clone, npm install, copy .env, tạo database, chạy schema, chạy seed.
   - Hướng dẫn chạy dev: `npm run dev`.
   - Hướng dẫn triển khai.
3. Kiểm tra thư mục uploads tồn tại.

### File cần tạo

- `backend/.env.example`
- `README.md`

### File cần chỉnh sửa

Không.

### Thành phần liên quan

- Deployment

### Database liên quan

Không.

### Frontend liên quan

Không.

### Kết quả mong đợi

.env.example có đủ biến môi trường. README có hướng dẫn cài đặt chi tiết.

### Acceptance Criteria

1. .env.example có đủ 6 biến môi trường.
2. README.md có: giới thiệu, yêu cầu, cài đặt, chạy dev, triển khai.

### Kiểm thử

- **Kiểm thử chức năng**: Đọc file.
- **Kết quả mong đợi**: File đầy đủ.

### Checklist

- [ ] Database
- [ ] Backend
- [ ] Frontend
- [ ] API
- [ ] Validation
- [ ] Testing
- [x] Documentation

---

# Dependency Matrix

```
M1-T1 → M1-T2 → M1-T3 → M1-T4 → M1-T5 → M1-T6 → M1-T7 → M1-T8
                                                                 
                                                                 ↓
M2-T1 ← M1-T2, M2-T2 ← M2-T1, M2-T3 ← M2-T1, M2-T4 ← M2-T5,
M2-T5 ← M2-T3, M2-T6 ← M2-T5, M2-T7 ← M2-T5+M2-T1,
M2-T8 ← M2-T5+M2-T1, M2-T9 ← M2-T5+M2-T1+M3-T1,
M2-T10 ← M1-T8+M2-T3, M2-T11 ← M1-T8+M2-T2,
M2-T12 ← M1-T8+M2-T7+M2-T8+M2-T9,
M2-T13 ← M1-T8
                                                                 
                                                                 ↓
M3-T1 ← M1-T2, M3-T2 ← M3-T1, M3-T3 ← M1-T2+M2-T5,
M3-T4 ← M3-T3, M3-T5 ← M1-T2+M2-T5, M3-T6 ← M3-T5,
M3-T7 ← M1-T3,
M3-T8 ← M1-T8+M2-T13+M3-T1+M3-T3+M2-T9,
M3-T9.1 ← M1-T8+M2-T13+M3-T8,
M3-T9.2 ← M3-T9.1,
M3-T9.3 ← M3-T9.2
                                                                 
                                                                 ↓
M4-T1 ← M1-T2, M4-T2 ← M2-T5+M3-T5, M4-T3 ← M4-T1+M4-T2,
M4-T4 ← M4-T2, M4-T5 ← M4-T1+M4-T2+M6-T6,
M4-T6 ← M4-T1,
M4-T7.1 ← M1-T8+M2-T13, M4-T7.2 ← M4-T7.1+M4-T2+M4-T3+M4-T4,
M4-T7.3 ← M4-T7.2+M4-T5+M4-T9,
M4-T8 ← M4-T7+M4-T5, M4-T9 ← M4-T8, M4-T10 ← M4-T7,
M4-T11 ← M4-T1+M2-T5
                                                                 
                                                                 ↓
M5-T1 ← M1-T2, M5-T2 ← M5-T1+M4-T1, M5-T3 ← M5-T2+M4-T6,
M5-T4 ← M5-T3, M5-T5 ← M5-T2+M5-T1,
M5-T6.1 ← M1-T8+M2-T13,
M5-T6.2 ← M5-T6.1+M5-T2+M5-T3+M5-T4,
M5-T6.3 ← M5-T6.2+M5-T5, M5-T7 ← M5-T6+M5-T5
                                                                 
                                                                 ↓
M6-T1 ← M2-T5+M4-T1, M6-T2 ← M6-T1, M6-T3 ← M6-T1,
M6-T4.1 ← M1-T8+M2-T13, M6-T4.2 ← M6-T4.1+M6-T1,
M6-T4.3 ← M6-T4.2+M6-T2+M6-T3,
M6-T5 ← M2-T5+M2-T1, M6-T6 ← M6-T5, M6-T7 ← M3-T9+M6-T5
                                                                 
                                                                 ↓
M7-T1 ← M1-T2, M7-T2 ← M2-T5+M7-T1, M7-T3 ← M7-T1,
M7-T4 ← M7-T3+M7-T1,
M7-T5.1 ← M1-T8+M2-T13, M7-T5.2 ← M7-T5.1+M7-T2+M7-T4
                                                                 
                                                                 ↓
M8-T1 ← M2-T5+M2-T6+M3-T1, M8-T2 ← M8-T1+M3-T3,
M8-T3 ← M8-T1+M3-T5, M8-T4 ← M8-T3,
M8-T5.1 ← M1-T8+M2-T13+M2-T6,
M8-T5.2 ← M8-T5.1+M8-T1+M8-T2,
M8-T5.3 ← M8-T5.2+M8-T3+M8-T4
                                                                 
                                                                 ↓
M9-T1 ← Tất cả API, M9-T2 ← Tất cả Frontend,
M9-T3 ← Tất cả API, M9-T4 ← M1-T7+Tất cả controller/service,
M9-T5 ← Tất cả Frontend, M9-T6 ← Tất cả Frontend,
M9-T7 ← Tất cả Frontend, M9-T8 ← M1-T3,
M9-T9 ← M4-T6+M5-T2+M7-T3,
M9-T10.1 ← M2-T2+M2-T3+M2-T4+M2-T7+M2-T8+M2-T9,
M9-T10.2 ← M4-T2+M4-T3+M4-T4+M4-T5+M5-T2+M5-T3+M5-T4,
M9-T11 ← Tất cả milestone
```

---

# Tổng số Task

| Loại | Số lượng |
|------|----------|
| Task gốc | 55 |
| Subtask | 17 |
| **Tổng cộng** | **72** |

---

# Thống kê theo Milestone

## Milestone 1: Project Setup & Foundation
- Tasks: 8 (M1-T1 → M1-T8)
- Subtasks: 0
- **Tổng: 8**

## Milestone 2: Authentication & Profile
- Tasks: 13 (M2-T1 → M2-T13)
- Subtasks: 0
- **Tổng: 13**

## Milestone 3: Roadmap, Topic & Vocabulary
- Tasks: 8 (M3-T1 → M3-T9)
- Subtasks: 3 (M3-T9.1, M3-T9.2, M3-T9.3)
- **Tổng: 11**

## Milestone 4: Learning - Flashcard & Writing Exercise
- Tasks: 11 (M4-T1 → M4-T11)
- Subtasks: 3 (M4-T7.1, M4-T7.2, M4-T7.3)
- **Tổng: 14**

## Milestone 5: Quiz
- Tasks: 7 (M5-T1 → M5-T7)
- Subtasks: 3 (M5-T6.1, M5-T6.2, M5-T6.3)
- **Tổng: 10**

## Milestone 6: Notebook & Streak
- Tasks: 7 (M6-T1 → M6-T7)
- Subtasks: 3 (M6-T4.1, M6-T4.2, M6-T4.3)
- **Tổng: 10**

## Milestone 7: AI Assistant
- Tasks: 5 (M7-T1 → M7-T5)
- Subtasks: 2 (M7-T5.1, M7-T5.2)
- **Tổng: 7**

## Milestone 8: Admin Dashboard
- Tasks: 5 (M8-T1 → M8-T5)
- Subtasks: 3 (M8-T5.1, M8-T5.2, M8-T5.3)
- **Tổng: 8**

## Milestone 9: Validation, Error Handling, Performance, Testing & Polish
- Tasks: 11 (M9-T1 → M9-T11)
- Subtasks: 2 (M9-T10.1, M9-T10.2)
- **Tổng: 13**

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
| Learning | 5 |
| Quiz | 8 |
| Notebook | 5 |
| Streak | 3 |
| AI Assistant | 6 |
| Admin | 7 |
| Validation | 2 |
| Error Handling | 2 |
| UI Polish | 3 |
| Performance | 1 |
| Testing | 4 |
| Deployment | 1 |

---

# Notes

## Mâu thuẫn giữa các tài liệu

1. **requirements.md** section 5.9 liệt kê module Notebook endpoint là `/api/notebook/*` và module Learning là `/api/user-vocabularies/*`. **plan.md** sử dụng `/api/notebook` và `/api/learning/*`. Không có mâu thuẫn thực sự vì plan.md đã chi tiết hóa endpoint cụ thể phù hợp với kiến trúc.

2. **requirements.md** section 5.1 API Base URL liệt kê `/api/user-vocabularies` nhưng **plan.md** và **architecture.md** sử dụng `/api/learning/*` cho Study Session và `/api/user-vocabularies` cho danh sách. Đây là phân tách hợp lý, không phải mâu thuẫn.

3. **database.md** section 5.1 users table có trường `username` (UNIQUE) nhưng **spec.md** section 7.1 Input/Output cho Register không yêu cầu username. **requirements.md** cũng không đề cập username trong form đăng ký. Mâu thuẫn này được ghi nhận: database yêu cầu username nhưng spec không yêu cầu nhập username khi đăng ký. (Có thể username được tạo tự động từ email hoặc để null, hoặc bỏ UNIQUE trên username.)

4. **architecture.md** section 3.2 liệt kê file `backend/src/utils/logger.js` nhưng không có trong mô tả logging strategy (section 13). **plan.md** M1-T7 tạo logger.js, phù hợp với cấu trúc thư mục.

5. **architecture.md** section 14 File Upload Architecture lưu file vào `frontend/public/uploads/` nhưng **plan.md** M8-T4 cũng lưu vào `frontend/public/uploads/`. Nhất quán.

---

# Validation Checklist

- [x] ✓ Mọi Task đều thuộc đúng một Milestone
- [x] ✓ Không có Task mồ côi
- [x] ✓ Không có Dependency vòng
- [x] ✓ Mọi Task đều có User Story
- [x] ✓ Mọi Task đều có Functional Requirement
- [x] ✓ Mọi Task đều có Module
- [x] ✓ Mọi Task đều có Acceptance Criteria
- [x] ✓ Mọi Task đều có Checklist
- [x] ✓ Mọi Task đều có Testing
- [x] ✓ Mọi Task đều có File Path
- [x] ✓ Không có Task ngoài plan.md
- [x] ✓ Không thay đổi bất kỳ tài liệu nào