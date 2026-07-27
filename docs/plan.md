# Implementation Plan - WordMate

**Version**: 1.0
**Status**: Approved
**Based on**: docs/requirements.md, docs/spec.md, docs/architecture.md, docs/database.md

---

## Milestone 1: Project Setup & Foundation

### Mục tiêu
Thiết lập toàn bộ môi trường phát triển, cấu trúc thư mục dự án, kết nối cơ sở dữ liệu và các tiện ích dùng chung cho cả Backend và Frontend.

### Phạm vi
- Khởi tạo dự án Backend (Node.js + Express).
- Khởi tạo dự án Frontend (HTML/CSS/JS).
- Cấu hình kết nối MySQL.
- Tạo cấu trúc Database (schema.sql).
- Thiết lập Environment Variables (.env).
- Tạo Shared Utilities (response format, logger).
- Tạo cấu trúc thư mục Backend và Frontend theo kiến trúc.

### Điều kiện tiên quyết
- Không có (Milestone đầu tiên).

### Các module liên quan
- Project Setup (tất cả module)
- Config (db.js)
- Utils (response.js, logger.js)

### Tiêu chí hoàn thành
- Backend có thể khởi động được với Express server.
- Frontend có cấu trúc thư mục đầy đủ.
- Database schema có thể chạy thành công, tạo đủ 9 bảng.
- Pool kết nối MySQL hoạt động.
- Hàm response chuẩn (success/error) sẵn sàng.

### Tasks

| ID | Tên | Mô tả | Module | Backend | Frontend | Database | Testing | Priority | Complexity | Dependencies | Deliverables | Acceptance Criteria |
|----|-----|-------|--------|---------|----------|----------|---------|----------|------------|--------------|--------------|-------------------|
| M1-T1 | Khởi tạo Backend Project | Tạo dự án Node.js + Express với package.json, cài dependencies (express, mysql2, dotenv, bcrypt, jsonwebtoken, multer), tạo file server.js entry point | Project Setup | ✅ | ❌ | ❌ | ❌ | P0 | S | Không | `backend/package.json`, `backend/src/server.js`, `backend/.env` | Backend chạy được `npm start`, Express server listen trên port cấu hình |
| M1-T2 | Cấu hình Database Connection | Tạo `backend/config/db.js` với MySQL pool connection sử dụng mysql2/promise, đọc cấu hình từ .env | Config | ✅ | ❌ | ❌ | ❌ | P0 | S | M1-T1 | `backend/config/db.js` | Pool kết nối MySQL được export, có error handling khi kết nối thất bại |
| M1-T3 | Tạo Database Schema | Viết `database/schema.sql` với CREATE TABLE cho 9 bảng: users, roadmaps, topics, vocabularies, user_vocabularies, quiz_attempts, quiz_answers, ai_conversations, ai_messages. Đầy đủ PK, FK, INDEX, UNIQUE, ON DELETE/UPDATE CASCADE, ENUM | Database | ❌ | ❌ | ✅ | ❌ | P0 | M | Không | `database/schema.sql` | Script chạy thành công, tạo đúng 9 bảng với đầy đủ ràng buộc, ENGINE=InnoDB, CHARSET=utf8mb4 |
| M1-T4 | Tạo cấu trúc thư mục Backend | Tạo thư mục: `backend/src/controllers/`, `backend/src/routes/`, `backend/src/middleware/`, `backend/src/models/`, `backend/src/services/`, `backend/src/utils/` | Project Setup | ✅ | ❌ | ❌ | ❌ | P0 | S | M1-T1 | Cấu trúc thư mục backend/ hoàn chỉnh | Thư mục khớp với kiến trúc trong architecture.md |
| M1-T5 | Tạo cấu trúc thư mục Frontend | Tạo thư mục: `frontend/public/`, `frontend/src/pages/`, `frontend/src/css/`, `frontend/src/js/`, `frontend/src/components/`, `frontend/src/services/` | Project Setup | ❌ | ✅ | ❌ | ❌ | P0 | S | Không | Cấu trúc thư mục frontend/ hoàn chỉnh | Thư mục khớp với kiến trúc trong architecture.md |
| M1-T6 | Tạo Shared Utilities - Response Format | Tạo `backend/src/utils/response.js` với hàm successResponse và errorResponse, format JSON thống nhất theo requirements.md | Utils | ✅ | ❌ | ❌ | ❌ | P0 | S | M1-T1 | `backend/src/utils/response.js` | Response đúng format: `{ success: true, message, data }` và `{ success: false, message }` |
| M1-T7 | Tạo Shared Utilities - Logger | Tạo `backend/src/utils/logger.js` với các mức log: INFO, WARN, ERROR, format timestamp, hỗ trợ log ra console/file | Utils | ✅ | ❌ | ❌ | ❌ | P1 | S | M1-T1 | `backend/src/utils/logger.js` | Logger ghi được timestamp, level, message; có thể dùng trong toàn bộ Backend |
| M1-T8 | Cấu hình Frontend Base | Tạo `frontend/src/services/api.js`: HTTP client wrapper dùng fetch(), tự động gắn JWT token từ localStorage, xử lý response/error | Project Setup | ❌ | ✅ | ❌ | ❌ | P0 | S | M1-T5 | `frontend/src/services/api.js` | api.js gọi được API Backend, tự động gắn Authorization header, parse JSON response |

---

## Milestone 2: Authentication & Profile

### Mục tiêu
Xây dựng toàn bộ hệ thống xác thực người dùng: đăng ký, đăng nhập, đăng xuất, đổi mật khẩu, JWT, phân quyền role, và trang Profile người dùng.

### Phạm vi
- Đăng ký tài khoản mới với email, password.
- Đăng nhập với email, password.
- JWT token (HS256, 24h expiry).
- authMiddleware (xác thực JWT).
- adminMiddleware (kiểm tra role='admin').
- Đổi mật khẩu.
- Đăng xuất (xóa token phía client).
- Xem/Đổi thông tin cá nhân (fullname).
- Chọn/Đổi lộ trình học tập.
- Trang Đăng ký, Đăng nhập, Profile (Frontend).

### Điều kiện tiên quyết
- Hoàn thành Milestone 1 (có thể chạy Backend, có DB connection, có response utilities).

### Các module liên quan
- Authentication Module
- User Module
- JWT
- authMiddleware
- adminMiddleware

### Tiêu chí hoàn thành
- Người dùng có thể đăng ký (email + password >= 8 ký tự) và nhận JWT token.
- Người dùng có thể đăng nhập và nhận JWT token.
- API có authMiddleware bảo vệ route, trả về 401 nếu token hết hạn/không hợp lệ.
- API admin có adminMiddleware kiểm tra role, trả về 403 nếu không phải admin.
- Người dùng có thể đổi mật khẩu.
- Người dùng có thể xem và đổi thông tin cá nhân, chọn/đổi lộ trình.
- Frontend có trang Login, Register, Profile.

### Tasks

| ID | Tên | Mô tả | Module | Backend | Frontend | Database | Testing | Priority | Complexity | Dependencies | Deliverables | Acceptance Criteria |
|----|-----|-------|--------|---------|----------|----------|---------|----------|------------|--------------|--------------|-------------------|
| M2-T1 | Tạo Model User | Tạo `backend/src/models/userModel.js` với các hàm: findByEmail, findById, create, updatePassword, updateProfile, updateRoadmap. Sử dụng Prepared Statements | Authentication | ✅ | ❌ | ❌ | ❌ | P0 | M | M1-T2 (DB connection) | `backend/src/models/userModel.js` | Model có đủ 6 hàm CRUD cơ bản, dùng Prepared Statements, trả về Promise |
| M2-T2 | API Đăng ký (Register) | Tạo route POST `/api/auth/register` + controller. Validate: email format, password >= 8 ký tự, confirm password match. Kiểm tra email tồn tại (409). Hash password bằng bcrypt. Tạo user với role='user', streak=0. Trả về JWT token. Format response theo spec 7.1 | Authentication | ✅ | ❌ | ❌ | ✅ | P0 | M | M2-T1 | `backend/src/controllers/authController.js`, `backend/src/routes/authRoutes.js` | Đăng ký thành công → 201 + JWT. Email trùng → 409. Validation lỗi → 400. Password hashed bằng bcrypt. Role mặc định user, streak=0 |
| M2-T3 | API Đăng nhập (Login) | Tạo route POST `/api/auth/login` + controller. Kiểm tra email tồn tại → bcrypt.compare password → tạo JWT (HS256, 24h, payload: user_id, email, role). Kiểm tra roadmap_id → redirect phù hợp. Format response theo spec 7.2 | Authentication | ✅ | ❌ | ❌ | ✅ | P0 | M | M2-T1 | `backend/src/controllers/authController.js`, `backend/src/routes/authRoutes.js` | Đăng nhập đúng → 200 + JWT + user info. Sai email/password → 401. Token chứa user_id, email, role |
| M2-T4 | API Đổi mật khẩu | Tạo route PUT/PATCH `/api/auth/change-password` + controller (yêu cầu authMiddleware). Kiểm tra password cũ, hash password mới, cập nhật database | Authentication | ✅ | ❌ | ❌ | ✅ | P1 | M | M2-T2 (authMiddleware) | `backend/src/controllers/authController.js`, `backend/src/routes/authRoutes.js` | Đổi mật khẩu thành công → 200. Sai password cũ → 400. Password mới < 8 ký tự → 400 |
| M2-T5 | Tạo authMiddleware | Tạo `backend/src/middleware/authMiddleware.js`: lấy token từ header `Authorization: Bearer <token>`, verify JWT, gắn req.user = { id, email, role }. Hết hạn/không hợp lệ → 401 Unauthorized | Authentication | ✅ | ❌ | ❌ | ✅ | P0 | M | M2-T3 (JWT tạo token) | `backend/src/middleware/authMiddleware.js` | Token hợp lệ → req.user có dữ liệu. Token hết hạn → 401. Thiếu token → 401 |
| M2-T6 | Tạo adminMiddleware | Tạo `backend/src/middleware/adminMiddleware.js`: kiểm tra `req.user.role === 'admin'`, nếu không → 403 Forbidden | Authentication | ✅ | ❌ | ❌ | ✅ | P0 | S | M2-T5 (authMiddleware) | `backend/src/middleware/adminMiddleware.js` | Role admin → next(). Role user → 403 |
| M2-T7 | API Xem thông tin cá nhân | Tạo route GET `/api/profile` + controller (yêu cầu authMiddleware). Trả về thông tin user: id, email, fullname, avatar, role, roadmap_id, streak, last_study_date | User | ✅ | ❌ | ❌ | ❌ | P0 | S | M2-T5, M2-T1 | `backend/src/controllers/userController.js`, `backend/src/routes/userRoutes.js` | GET /api/profile → 200 + thông tin user |
| M2-T8 | API Cập nhật thông tin cá nhân | Tạo route PUT `/api/profile` + controller (yêu cầu authMiddleware). Cho phép cập nhật: fullname. Format response chuẩn | User | ✅ | ❌ | ❌ | ❌ | P1 | S | M2-T5, M2-T1 | `backend/src/controllers/userController.js`, `backend/src/routes/userRoutes.js` | PUT /api/profile → 200 + dữ liệu cập nhật |
| M2-T9 | API Chọn/Đổi Lộ trình | Tạo route PUT `/api/profile/roadmap` + controller (yêu cầu authMiddleware). Input: roadmap_id (integer). Kiểm tra roadmap tồn tại (404). Cập nhật roadmap_id trong bảng users. Format response theo spec 7.3 | User | ✅ | ❌ | ❌ | ❌ | P0 | S | M2-T5, M2-T1, M3-T1 (roadmap tồn tại) | `backend/src/controllers/userController.js`, `backend/src/routes/userRoutes.js` | PUT success → 200. Roadmap không tồn tại → 404 |
| M2-T10 | Trang Đăng nhập (Frontend) | Tạo `frontend/src/pages/auth/login.html` + `frontend/src/js/pages/login.js`. Form đăng nhập: email, password, nút submit. Validate phía client. Gọi POST /api/auth/login, lưu JWT vào localStorage. Redirect dựa trên roadmap_id | Authentication | ❌ | ✅ | ❌ | ❌ | P0 | M | M1-T8 (api.js), M2-T3 | `frontend/src/pages/auth/login.html`, `frontend/src/js/pages/login.js` | Form login hiển thị, gọi API thành công, lưu token, redirect. Sai thông tin → hiển thị lỗi |
| M2-T11 | Trang Đăng ký (Frontend) | Tạo `frontend/src/pages/auth/register.html` + `frontend/src/js/pages/register.js`. Form đăng ký: email, password, confirm password. Validate: email format, password >= 8, confirm match. Gọi POST /api/auth/register. Lưu JWT. Redirect sang chọn lộ trình nếu thành công | Authentication | ❌ | ✅ | ❌ | ❌ | P0 | M | M1-T8, M2-T2 | `frontend/src/pages/auth/register.html`, `frontend/src/js/pages/register.js` | Form register hiển thị, validate đúng, gọi API, lưu token. Lỗi validation → hiển thị lỗi |
| M2-T12 | Trang Profile (Frontend) | Tạo `frontend/src/pages/profile/profile.html` + `frontend/src/js/pages/profile.js`. Hiển thị thông tin cá nhân. Form đổi mật khẩu. Nút đăng xuất (xóa token, redirect login). Chức năng chọn/đổi lộ trình học tập | User | ❌ | ✅ | ❌ | ❌ | P0 | M | M1-T8, M2-T7, M2-T8, M2-T9, M2-T12 (profile data) | `frontend/src/pages/profile/profile.html`, `frontend/src/js/pages/profile.js` | Hiển thị thông tin user. Đổi password thành công → toast. Đăng xuất → redirect login. Đổi roadmap → cập nhật |
| M2-T13 | Tạo authService Frontend | Tạo `frontend/src/services/authService.js` với các hàm: login, register, logout, getToken, setToken, removeToken, isAuthenticated, getCurrentUser | Authentication | ❌ | ✅ | ❌ | ❌ | P0 | S | M1-T8 | `frontend/src/services/authService.js` | Các hàm login, register, getToken, isAuthenticated hoạt động đúng |

---

## Milestone 3: Roadmap, Topic & Vocabulary

### Mục tiêu
Xây dựng các module quản lý nội dung học tập cốt lõi: Lộ trình (Roadmap), Chủ đề (Topic), Từ vựng (Vocabulary). Hiển thị danh sách lộ trình, chủ đề, từ vựng cho người dùng. Xây dựng luồng Onboarding chọn lộ trình và chủ đề lần đầu.

### Phạm vi
- API GET danh sách lộ trình đang active.
- API GET danh sách chủ đề theo roadmap_id.
- API GET danh sách từ vựng theo topic_id.
- Seed data mẫu cho 3 lộ trình: Basic English, TOEIC, Phrasal Verb & Idiom.
- Trang Onboarding (chọn lộ trình + chủ đề lần đầu).
- Trang Dashboard (hiển thị danh sách chủ đề của lộ trình hiện tại).
- Hiển thị thông tin streak, avatar trên Dashboard.

### Điều kiện tiên quyết
- Hoàn thành Milestone 2 (có auth, user có roadmap_id, JWT).

### Các module liên quan
- Roadmap Module
- Topic Module
- Vocabulary Module

### Tiêu chí hoàn thành
- API GET /api/roadmaps trả về danh sách lộ trình active, sắp xếp theo sort_order.
- API GET /api/topics?roadmap_id=x trả về danh sách chủ đề active thuộc lộ trình.
- API GET /api/vocabularies?topic_id=x trả về danh sách từ vựng thuộc chủ đề.
- Seed data có 3 lộ trình với ít nhất 9 chủ đề và 50+ từ vựng.
- Người dùng mới có thể chọn lộ trình và thấy danh sách chủ đề.
- Dashboard hiển thị streak, avatar, danh sách chủ đề.

### Tasks

| ID | Tên | Mô tả | Module | Backend | Frontend | Database | Testing | Priority | Complexity | Dependencies | Deliverables | Acceptance Criteria |
|----|-----|-------|--------|---------|----------|----------|---------|----------|------------|--------------|--------------|-------------------|
| M3-T1 | API Lấy danh sách Roadmap | Tạo route GET `/api/roadmaps` + controller. Truy vấn bảng roadmaps WHERE is_active = 1, ORDER BY sort_order. Trả về danh sách. Không yêu cầu xác thực (public) | Roadmap | ✅ | ❌ | ❌ | ❌ | P0 | S | M1-T2 (DB) | `backend/src/controllers/roadmapController.js`, `backend/src/routes/roadmapRoutes.js` | GET /api/roadmaps → 200 + danh sách roadmaps active |
| M3-T2 | API Lấy chi tiết Roadmap | Tạo route GET `/api/roadmaps/:id` + controller. Kiểm tra tồn tại (404). Trả về chi tiết roadmap | Roadmap | ✅ | ❌ | ❌ | ❌ | P0 | S | M3-T1 | `backend/src/controllers/roadmapController.js`, `backend/src/routes/roadmapRoutes.js` | GET /api/roadmaps/1 → 200. Không tồn tại → 404 |
| M3-T3 | API Lấy danh sách Topic | Tạo route GET `/api/topics` + controller. Query param: roadmap_id (bắt buộc). WHERE roadmap_id = ? AND is_active = 1, ORDER BY sort_order. Yêu cầu authMiddleware | Topic | ✅ | ❌ | ❌ | ❌ | P0 | S | M1-T2, M2-T5 (auth) | `backend/src/controllers/topicController.js`, `backend/src/routes/topicRoutes.js`, `backend/src/models/topicModel.js` | GET /api/topics?roadmap_id=1 → 200 + danh sách topics active. Thiếu roadmap_id → 400 |
| M3-T4 | API Lấy chi tiết Topic | Tạo route GET `/api/topics/:id` + controller. Kiểm tra tồn tại (404). Yêu cầu authMiddleware | Topic | ✅ | ❌ | ❌ | ❌ | P0 | S | M3-T3 | `backend/src/controllers/topicController.js`, `backend/src/routes/topicRoutes.js` | GET /api/topics/1 → 200. Không tồn tại → 404 |
| M3-T5 | API Lấy danh sách Vocabulary | Tạo route GET `/api/vocabularies` + controller. Query param: topic_id (bắt buộc). WHERE topic_id = ?. Trả về: id, word, pronunciation, audio, image, part_of_speech, meaning, example, example_meaning. Yêu cầu authMiddleware | Vocabulary | ✅ | ❌ | ❌ | ❌ | P0 | S | M1-T2, M2-T5 | `backend/src/controllers/vocabularyController.js`, `backend/src/routes/vocabularyRoutes.js`, `backend/src/models/vocabularyModel.js` | GET /api/vocabularies?topic_id=1 → 200 + danh sách từ vựng |
| M3-T6 | API Lấy chi tiết Vocabulary | Tạo route GET `/api/vocabularies/:id` + controller. Kiểm tra tồn tại (404). Yêu cầu authMiddleware | Vocabulary | ✅ | ❌ | ❌ | ❌ | P0 | S | M3-T5 | `backend/src/controllers/vocabularyController.js`, `backend/src/routes/vocabularyRoutes.js` | GET /api/vocabularies/1 → 200 + chi tiết. Không tồn tại → 404 |
| M3-T7 | Seed Data | Tạo script seed: INSERT 3 roadmaps (Basic English, TOEIC, Phrasal Verb & Idiom), mỗi roadmap 3+ topics, mỗi topic 5+ vocabularies. Tổng tối thiểu 50 từ vựng | Database | ❌ | ❌ | ✅ | ❌ | P0 | M | M1-T3 (schema) | Seed script (SQL) | 3 roadmaps active, 9+ topics active, 50+ vocabularies, dữ liệu seed chạy được |
| M3-T8 | Trang Onboarding (Chọn Lộ trình) | Tạo `frontend/src/pages/dashboard/onboarding.html` + `frontend/src/js/pages/onboarding.js`. Bước 1: GET /api/roadmaps, hiển thị danh sách lộ trình. Bước 2: chọn roadmap → PUT /api/profile/roadmap. Bước 3: GET /api/topics, hiển thị danh sách chủ đề. Yêu cầu chọn lộ trình bắt buộc lần đầu | Onboarding | ❌ | ✅ | ❌ | ❌ | P0 | M | M1-T8, M2-T13 (auth), M3-T1, M3-T3, M2-T9 | `frontend/src/pages/dashboard/onboarding.html`, `frontend/src/js/pages/onboarding.js` | Hiển thị danh sách roadmap. Chọn roadmap → lưu → hiển thị topics. Đã chọn roadmap → redirect dashboard |
| M3-T9 | Trang Dashboard (Trang chủ) | Tạo `frontend/src/pages/dashboard/dashboard.html` + `frontend/src/js/pages/dashboard.js`. Hiển thị: avatar, streak, roadmap name. Danh sách topics thuộc roadmap hiện tại (dạng card/button để bấm vào học). Bottom navigation. Nút Ôn tập (Quiz). Sổ tay từ vựng. AI Chat widget | Dashboard | ❌ | ✅ | ❌ | ❌ | P0 | L | M1-T8, M2-T13, M3-T3, M3-T8 (onboarding đã chọn roadmap) | `frontend/src/pages/dashboard/dashboard.html`, `frontend/src/js/pages/dashboard.js` | Hiển thị streak, avatar, roadmap. Danh sách topics từ roadmap hiện tại. Bottom nav: Trang chủ, Ôn tập, Sổ tay |

---

## Milestone 4: Learning - Flashcard & Writing Exercise

### Mục tiêu
Xây dựng giao diện và API cho luồng học từ vựng: Flashcard với hiệu ứng lật thẻ, bài tập luyện viết, quản lý trạng thái User Vocabulary, tính toán Spaced Repetition (SRS), cập nhật streak khi học xong.

### Phạm vi
- Hiển thị Flashcard (mặt trước: word, pronunciation, audio, image; mặt sau: part_of_speech, meaning, example, example_meaning).
- Hiệu ứng lật thẻ (flip animation) khi bấm vào thẻ hoặc phím Space.
- Nút "Đã thuộc" (mastered) và "Tiếp tục" (chuyển luyện viết).
- Bài tập luyện viết: hiển thị gợi ý, người dùng gõ từ.
- Lưu/cập nhật user_vocabularies (status, review_count, next_review_at).
- Tính toán next_review_at theo SRS.
- Cập nhật last_study_date và tăng streak khi hoàn thành luyện viết.
- Màn hình tổng kết khi học hết từ trong chủ đề.
- Phím tắt: Space (lật), ArrowRight (Đã thuộc), ArrowLeft (Tiếp tục).

### Điều kiện tiên quyết
- Hoàn thành Milestone 2 (auth, user).
- Hoàn thành Milestone 3 (topics, vocabularies, dashboard).

### Các module liên quan
- Study Session Module (Vocabulary)
- Streak Module
- User Vocabulary

### Tiêu chí hoàn thành
- Người dùng bấm vào chủ đề → vào trang học → Flashcard đầu tiên hiển thị.
- Flashcard lật được (click hoặc Space).
- Bấm "Đã thuộc" → user_vocabularies status='mastered', review_count++.
- Bấm "Tiếp tục" → hiển thị bài tập luyện viết.
- Hoàn thành luyện viết → user_vocabularies status='learning', next_review_at được tính, last_study_date cập nhật, streak tăng.
- Học hết từ → màn hình tổng kết.
- Phím tắt hoạt động.

### Tasks

| ID | Tên | Mô tả | Module | Backend | Frontend | Database | Testing | Priority | Complexity | Dependencies | Deliverables | Acceptance Criteria |
|----|-----|-------|--------|---------|----------|----------|---------|----------|------------|--------------|--------------|-------------------|
| M4-T1 | Tạo UserVocabulary Model | Tạo model với các hàm: findByUserAndVocab (tìm bản ghi user_vocabularies), upsert (tạo mới/cập nhật), getByUserAndStatus (lấy danh sách theo user và status), updateStudySession (cập nhật review_count, status, next_review_at) | Vocabulary | ✅ | ❌ | ❌ | ❌ | P0 | M | M1-T2 (DB) | `backend/src/models/vocabularyModel.js` | Model có đủ 4 hàm, dùng Prepared Statements, hỗ trợ UPSERT |
| M4-T2 | API Bắt đầu phiên học | Tạo route POST `/api/learning/start` + controller (authMiddleware). Input: topic_id. Tạo session mới (study_session_id). Lấy danh sách vocabulary theo topic_id. Trả về session_id + danh sách từ vựng. Format response theo spec 7.4 | Vocabulary | ✅ | ❌ | ❌ | ❌ | P0 | M | M2-T5, M3-T5 | `backend/src/controllers/vocabularyController.js`, `backend/src/routes/vocabularyRoutes.js` | POST /api/learning/start → 200 + session_id + danh sách từ vựng |
| M4-T3 | API Đã thuộc (Mastered) | Tạo route POST `/api/learning/mastered` + controller (authMiddleware). Input: vocabulary_id, session_id. UPSERT user_vocabularies: status='mastered', review_count++. Trả về từ tiếp theo. Format response theo spec 7.4 | Vocabulary | ✅ | ❌ | ❌ | ❌ | P0 | M | M4-T1, M4-T2 | `backend/src/controllers/vocabularyController.js`, `backend/src/routes/vocabularyRoutes.js` | POST → 200 + next_vocabulary. user_vocabularies status='mastered', review_count tăng 1 |
| M4-T4 | API Chuyển tiếp (Writing Prompt) | Tạo route POST `/api/learning/writing` + controller (authMiddleware). Input: vocabulary_id, session_id. Trả về prompt: meaning, example để người dùng gõ từ. Format response theo spec 7.4 | Vocabulary | ✅ | ❌ | ❌ | ❌ | P0 | S | M4-T2 | `backend/src/controllers/vocabularyController.js`, `backend/src/routes/vocabularyRoutes.js` | POST → 200 + { prompt: { meaning, example }, vocabulary_id } |
| M4-T5 | API Nộp bài Luyện viết | Tạo route POST `/api/learning/writing/submit` + controller (authMiddleware). Input: vocabulary_id, session_id, user_input. UPSERT user_vocabularies: status='learning', tính next_review_at (SRS). Cập nhật last_study_date = today. Tăng streak (gọi streak update). Trả về next_vocabulary, streak_updated. Format response theo spec 7.5 | Vocabulary | ✅ | ❌ | ❌ | ✅ | P0 | M | M4-T1, M4-T2, M6-T6 (streak update) | `backend/src/controllers/vocabularyController.js`, `backend/src/routes/vocabularyRoutes.js` | POST → 200 + next_vocabulary + streak_updated. user_vocabularies status='learning', next_review_at được tính |
| M4-T6 | Service Tính toán SRS | Tạo service/hàm `calculateNextReview`: input (review_count, status), output (next_review_at). Sử dụng thuật toán SM-2 đơn giản hóa: lần 1 = 1 ngày, lần 2 = 3 ngày, lần 3 = 7 ngày, lần 4 = 14 ngày, lần 5+ = 30 ngày. Nếu sai → reset review_count=0, next_review_at=NOW() | Vocabulary | ✅ | ❌ | ❌ | ✅ | P0 | M | M4-T1 | Hàm trong `backend/src/services/srsService.js` | Tính đúng next_review_at dựa trên review_count: 1→1d, 2→3d, 3→7d, 4→14d, 5+→30d |
| M4-T7 | Trang Học Flashcard (Frontend) | Tạo `frontend/src/pages/learn/learn.html` + `frontend/src/js/pages/learn.js`. Hiển thị Flashcard theo đúng spec: mặt trước (word, pronunciation, audio, image), mặt sau (part_of_speech, meaning, example, example_meaning). Hiệu ứng lật thẻ CSS 3D Transform. Nút "Đã thuộc", "Tiếp tục". Gọi API M4-T2, M4-T3, M4-T4 | Learning | ❌ | ✅ | ❌ | ❌ | P0 | L | M1-T8, M2-T13, M4-T2, M4-T3, M4-T4 | `frontend/src/pages/learn/learn.html`, `frontend/src/js/pages/learn.js` | Flashcard hiển thị đúng 2 mặt. Bấm vào thẻ → lật. Bấm "Đã thuộc" → API mastered. Bấm "Tiếp tục" → chuyển luyện viết |
| M4-T8 | Bài tập Luyện viết (Frontend) | Component/tab trong learn page: hiển thị gợi ý (meaning, example), input text, nút nộp bài. Gọi API M4-T5. Hiển thị kết quả đúng/sai. Chuyển sang từ tiếp theo | Learning | ❌ | ✅ | ❌ | ❌ | P0 | M | M4-T7 (trang học), M4-T5 | Component trong `frontend/src/js/pages/learn.js` | Hiển thị gợi ý, input, nút nộp. Gọi API submit. Thành công → next vocabulary |
| M4-T9 | Màn hình Tổng kết | Hiển thị khi học hết từ trong chủ đề: số từ đã học, số từ đã thuộc, số từ đã lưu sổ tay. Có nút "Quay về trang chủ" | Learning | ❌ | ✅ | ❌ | ❌ | P0 | S | M4-T8 | Màn hình tổng kết trong learn page | Hiển thị đúng thống kê. Nút quay về dashboard hoạt động |
| M4-T10 | Phím tắt Flashcard | Hỗ trợ phím tắt: Space (lật thẻ), ArrowRight (Đã thuộc), ArrowLeft (Tiếp tục/Chưa thuộc). Gắn event listener trên learn page | Learning | ❌ | ✅ | ❌ | ❌ | P1 | S | M4-T7 | Phím tắt trong learn page JS | Space → lật thẻ. ArrowRight → gọi mastered. ArrowLeft → gọi writing |
| M4-T11 | API User Vocabulary - Danh sách | Tạo route GET `/api/user-vocabularies` + controller (authMiddleware). Query params: topic_id (optional). Lấy danh sách user_vocabularies JOIN vocabularies của user hiện tại. Trả về: id, word, meaning, status, review_count, next_review_at | Vocabulary | ✅ | ❌ | ❌ | ❌ | P0 | S | M4-T1, M2-T5 | `backend/src/controllers/vocabularyController.js`, `backend/src/routes/vocabularyRoutes.js` | GET /api/user-vocabularies → 200 + danh sách user_vocabularies của user |

---

## Milestone 5: Quiz

### Mục tiêu
Xây dựng hệ thống Quiz ôn tập: tự động lọc từ vựng cần ôn, tạo bài Quiz trắc nghiệm (multiple choice), xử lý trả lời (đúng/sai), cập nhật SRS, lưu lịch sử quiz, hiển thị kết quả, hỗ trợ tiếp tục Quiz nếu thoát giữa chừng.

### Phạm vi
- Lọc từ vựng từ user_vocabularies: status IN ('new', 'learning') hoặc next_review_at <= NOW().
- Tạo Quiz với tối đa 20 câu, ưu tiên review_count thấp.
- Hiển thị câu hỏi trắc nghiệm (4 lựa chọn).
- Xử lý trả lời đúng: cập nhật SRS (review_count++, next_review_at mới).
- Xử lý trả lời sai: reset review_count=0, next_review_at=NOW(), hiển thị đáp án.
- Lưu quiz_attempts và quiz_answers.
- Màn hình kết quả Quiz: điểm, từ đã master, từ cần ôn lại.
- Tiếp tục Quiz từ câu chưa làm nếu thoát giữa chừng.

### Điều kiện tiên quyết
- Hoàn thành Milestone 4 (user_vocabularies có dữ liệu, SRS hoạt động).

### Các module liên quan
- Quiz Module
- SRS Service

### Tiêu chí hoàn thành
- POST /api/quiz/start → tạo quiz từ danh sách từ cần ôn tập (tối đa 20 câu).
- POST /api/quiz/answer → kiểm tra đáp án, cập nhật SRS, trả về kết quả.
- POST /api/quiz/complete → lưu kết quả, hiển thị điểm.
- Quiz tiếp tục từ câu chưa làm nếu thoát giữa chừng.
- Câu hỏi hiển thị với 4 lựa chọn random.
- Màn hình kết quả hiển thị score, total_questions, correct_answers, words_mastered, words_to_review.

### Tasks

| ID | Tên | Mô tả | Module | Backend | Frontend | Database | Testing | Priority | Complexity | Dependencies | Deliverables | Acceptance Criteria |
|----|-----|-------|--------|---------|----------|----------|---------|----------|------------|--------------|--------------|-------------------|
| M5-T1 | Tạo Quiz Model | Tạo model cho quiz_attempts và quiz_answers. Các hàm: createAttempt, createAnswer, updateAttempt, getAttemptById, getAnswersByAttemptId, getIncompleteAttempt (lấy quiz chưa hoàn thành của user) | Quiz | ✅ | ❌ | ❌ | ❌ | P0 | M | M1-T2 (DB) | `backend/src/models/quizModel.js` | Model có đủ 5 hàm, dùng Prepared Statements, hỗ trợ transaction |
| M5-T2 | API Bắt đầu Quiz | Tạo route POST `/api/quiz/start` + controller (authMiddleware). Truy vấn user_vocabularies: status IN ('new','learning') OR next_review_at <= NOW(). Áp dụng Quiz Generation Rules: tối đa 20 câu, ưu tiên review_count thấp. Tạo quiz_attempt. Tạo list quiz_answers (rỗng). Trả về danh sách câu hỏi. Format response theo spec 7.6 | Quiz | ✅ | ❌ | ❌ | ✅ | P0 | M | M5-T1, M4-T1 | `backend/src/controllers/quizController.js`, `backend/src/routes/quizRoutes.js` | POST /api/quiz/start → 200 + quiz_id + questions (tối đa 20). Lọc đúng user_vocabularies |
| M5-T3 | API Trả lời Quiz | Tạo route POST `/api/quiz/answer` + controller (authMiddleware). Input: quiz_id, question_id (vocabulary_id), user_answer. Kiểm tra đáp án. Nếu đúng: gọi SRS tăng review_count, update next_review_at. Nếu sai: reset review_count=0, next_review_at=NOW(). Lưu quiz_answers. Trả về is_correct, correct_answer, explanation. Format response theo spec 7.6 | Quiz | ✅ | ❌ | ❌ | ✅ | P0 | M | M5-T2, M4-T6 (SRS) | `backend/src/controllers/quizController.js`, `backend/src/routes/quizRoutes.js` | Trả lời đúng → is_correct=true, SRS tăng review_count. Trả lời sai → is_correct=false, review_count=0, hiển thị đáp án |
| M5-T4 | API Hoàn thành Quiz | Tạo route POST `/api/quiz/complete` + controller (authMiddleware). Input: quiz_id. Cập nhật quiz_attempts: score, total_questions, correct_answers. Trả về kết quả: score, total_questions, correct_answers, words_mastered, words_to_review. Format response theo spec 7.6 | Quiz | ✅ | ❌ | ❌ | ❌ | P0 | M | M5-T3 | `backend/src/controllers/quizController.js`, `backend/src/routes/quizRoutes.js` | POST → 200 + kết quả đầy đủ. quiz_attempts được cập nhật |
| M5-T5 | API Tiếp tục Quiz | Tạo route GET `/api/quiz/continue` + controller (authMiddleware). Kiểm tra user có quiz_attempt chưa hoàn thành không. Nếu có: trả về các câu chưa trả lời. Format response theo spec 7.6 | Quiz | ✅ | ❌ | ❌ | ❌ | P1 | S | M5-T2, M5-T1 | `backend/src/controllers/quizController.js`, `backend/src/routes/quizRoutes.js` | GET /api/quiz/continue → 200 + quiz_id + questions (câu chưa làm). Không có quiz dang dở → thông báo |
| M5-T6 | Trang Quiz (Frontend) | Tạo `frontend/src/pages/quiz/quiz.html` + `frontend/src/js/pages/quiz.js`. Hiển thị nút "Bắt đầu ôn tập". Gọi API start quiz. Hiển thị từng câu hỏi multiple choice (4 lựa chọn). Gọi API answer. Hiển thị kết quả đúng/sai ngay lập tức. Sau khi hoàn thành → màn hình kết quả (score, words_mastered, words_to_review). Bottom navigation + AI chat | Quiz | ❌ | ✅ | ❌ | ❌ | P0 | L | M1-T8, M2-T13, M5-T2, M5-T3, M5-T4 | `frontend/src/pages/quiz/quiz.html`, `frontend/src/js/pages/quiz.js` | Nút "Bắt đầu" → gọi API → hiển thị câu hỏi. Chọn đáp án → gọi API → hiển thị kết quả. Hoàn thành → màn hình kết quả |
| M5-T7 | Tiếp tục Quiz (Frontend) | Khi vào trang quiz, kiểm tra GET /api/quiz/continue. Nếu có quiz dang dở: hiển thị nút "Tiếp tục" hoặc "Bắt đầu mới". Bấm "Tiếp tục" → load câu chưa làm | Quiz | ❌ | ✅ | ❌ | ❌ | P1 | S | M5-T6, M5-T5 | Logic trong `frontend/src/js/pages/quiz.js` | Vào trang quiz → kiểm tra quiz dang dở → hiển thị nút tiếp tục. Tiếp tục từ câu chưa làm |

---

## Milestone 6: Notebook & Streak

### Mục tiêu
Xây dựng Sổ tay từ vựng cá nhân (Notebook) cho người dùng xem, tìm kiếm, quản lý từ vựng đã học. Xây dựng hệ thống Streak theo dõi chuỗi ngày học liên tiếp.

### Phạm vi
- Hiển thị danh sách từ vựng trong Sổ tay, phân loại theo status (new → learning → mastered).
- Hiển thị tổng số từ đang ôn tập.
- Thanh tìm kiếm nhanh theo word.
- Xem chi tiết từ vựng (word, meaning, pronunciation, part_of_speech, example, example_meaning, status, review_count, next_review_at).
- Nút "Ôn lại" (chuyển từ mastered về learning).
- API lấy và cập nhật streak.
- Hiển thị streak trên Dashboard.

### Điều kiện tiên quyết
- Hoàn thành Milestone 4 (user_vocabularies đã có dữ liệu).
- Hoàn thành Milestone 5 (quiz update streak).

### Các module liên quan
- Notebook Module
- Streak Module

### Tiêu chí hoàn thành
- GET /api/notebook → danh sách user_vocabularies của user, phân loại theo status.
- GET /api/notebook?search=word → lọc theo word.
- GET /api/notebook/:id → chi tiết từ + lịch sử.
- POST /api/notebook/review/:vocabulary_id → chuyển mastered về learning.
- GET /api/streak → streak hiện tại.
- Streak tăng khi học từ mới/hoàn thành Quiz.
- Streak reset về 0 nếu bỏ lỡ 1 ngày.
- Mỗi ngày chỉ tính 1 lần streak.

### Tasks

| ID | Tên | Mô tả | Module | Backend | Frontend | Database | Testing | Priority | Complexity | Dependencies | Deliverables | Acceptance Criteria |
|----|-----|-------|--------|---------|----------|----------|---------|----------|------------|--------------|--------------|-------------------|
| M6-T1 | API Lấy Sổ tay từ vựng | Tạo route GET `/api/notebook` + controller (authMiddleware). Query params: search (optional), status (optional), page (optional). JOIN user_vocabularies + vocabularies WHERE user_id = ?. Hỗ trợ filter search theo word (LIKE), filter theo status. Phân trang. Format response theo spec 7.7 | Notebook | ✅ | ❌ | ❌ | ❌ | P0 | M | M2-T5, M4-T1 (user_vocab model) | `backend/src/controllers/notebookController.js`, `backend/src/routes/notebookRoutes.js`, `backend/src/models/notebookModel.js` | GET /api/notebook → 200 + danh sách (phân loại status, search, phân trang) |
| M6-T2 | API Chi tiết từ trong Sổ tay | Tạo route GET `/api/notebook/:vocabulary_id` + controller (authMiddleware). JOIN user_vocabularies + vocabularies. Trả về: word, meaning, pronunciation, part_of_speech, example, example_meaning, status, review_count, next_review_at, created_at, updated_at | Notebook | ✅ | ❌ | ❌ | ❌ | P0 | S | M6-T1 | `backend/src/controllers/notebookController.js`, `backend/src/routes/notebookRoutes.js` | GET /api/notebook/1 → 200 + chi tiết đầy đủ. Không tồn tại → 404 |
| M6-T3 | API Ôn lại từ | Tạo route POST `/api/notebook/review/:vocabulary_id` + controller (authMiddleware). Kiểm tra vocabulary thuộc user. Cập nhật user_vocabularies: status='learning', reset next_review_at = NOW(). Trả về success | Notebook | ✅ | ❌ | ❌ | ❌ | P0 | S | M6-T1 | `backend/src/controllers/notebookController.js`, `backend/src/routes/notebookRoutes.js` | POST → 200 + status='learning'. Từ mastered → chuyển learning |
| M6-T4 | Trang Sổ tay từ vựng (Frontend) | Tạo `frontend/src/pages/notebook/notebook.html` + `frontend/src/js/pages/notebook.js`. Hiển thị tổng số từ đang ôn tập. Danh sách từ phân loại theo status tab. Thanh tìm kiếm (gọi API search). Bấm vào từ → mở modal/panel chi tiết. Nút "Ôn lại" trên từ mastered. Bottom navigation + AI chat | Notebook | ❌ | ✅ | ❌ | ❌ | P0 | L | M1-T8, M2-T13, M6-T1, M6-T2, M6-T3 | `frontend/src/pages/notebook/notebook.html`, `frontend/src/js/pages/notebook.js` | Hiển thị danh sách từ, search hoạt động, xem chi tiết, nút "Ôn lại" hoạt động |
| M6-T5 | API Lấy Streak | Tạo route GET `/api/streak` + controller (authMiddleware). Trả về streak, last_study_date từ bảng users | Streak | ✅ | ❌ | ❌ | ❌ | P0 | S | M2-T5, M2-T1 | `backend/src/controllers/streakController.js`, `backend/src/routes/streakRoutes.js` | GET /api/streak → 200 + { streak, last_study_date } |
| M6-T6 | Service/Logic Cập nhật Streak | Tạo service/hàm `updateStreak`: input (user_id, current_date). Kiểm tra last_study_date: nếu hôm qua → streak+1. Nếu hôm nay → không thay đổi (mỗi ngày 1 lần). Nếu > 1 ngày trước → reset streak=1. Cập nhật users.streak và users.last_study_date | Streak | ✅ | ❌ | ❌ | ✅ | P0 | M | M6-T5 | Hàm trong `backend/src/controllers/streakController.js` | Đúng streak rules: hôm qua→+1, hôm nay→giữ nguyên, quá 1 ngày→reset=1. Mỗi ngày chỉ 1 lần |
| M6-T7 | Hiển thị Streak trên Dashboard | Cập nhật Dashboard frontend: hiển thị streak (số ngày) từ API GET /api/streak. Icon khuyến khích nếu streak > 0 | Dashboard | ❌ | ✅ | ❌ | ❌ | P0 | S | M3-T9 (dashboard), M6-T5 | Cập nhật `frontend/src/js/pages/dashboard.js` | Dashboard hiển thị streak đúng số ngày |

---

## Milestone 7: AI Assistant

### Mục tiêu
Xây dựng Trợ lý AI Assistant: popup chat cố định góc dưới màn hình trên mọi trang, gửi tin nhắn, nhận phản hồi từ Gemini API qua Backend, lưu lịch sử hội thoại, quản lý nhiều phiên chat.

### Phạm vi
- Icon AI cố định góc dưới màn hình.
- Popup chat: hiển thị, ẩn, gửi tin nhắn, nhận phản hồi.
- API tạo hội thoại mới (ai_conversations).
- API gửi tin nhắn + nhận phản hồi AI (ai_messages).
- Backend gọi Gemini API (aiService.js).
- Ghép context (topic_id, vocabulary_id nếu có) + lịch sử 10 tin nhắn gần nhất.
- Lưu user message + assistant message.
- Xử lý lỗi AI (timeout, API error) → hiển thị thông báo thân thiện.

### Điều kiện tiên quyết
- Hoàn thành Milestone 2 (auth).

### Các module liên quan
- AI Assistant Module

### Tiêu chí hoàn thành
- Icon AI hiển thị trên tất cả trang người học.
- Bấm icon → popup chat mở ra.
- Người dùng gửi tin nhắn → AI phản hồi (qua Backend).
- Lịch sử tin nhắn được lưu trong ai_messages với role='user'/'assistant'.
- Người dùng có thể tạo hội thoại mới.
- AI lỗi/timeout → hiển thị thông báo thân thiện.

### Tasks

| ID | Tên | Mô tả | Module | Backend | Frontend | Database | Testing | Priority | Complexity | Dependencies | Deliverables | Acceptance Criteria |
|----|-----|-------|--------|---------|----------|----------|---------|----------|------------|--------------|--------------|-------------------|
| M7-T1 | Tạo AI Model | Tạo model cho ai_conversations và ai_messages. Các hàm: createConversation, getConversationsByUser, createMessage, getMessagesByConversation (limit 10), getConversationById | AI Assistant | ✅ | ❌ | ❌ | ❌ | P0 | M | M1-T2 (DB) | `backend/src/models/aiModel.js` | Model có đủ 5 hàm, dùng Prepared Statements |
| M7-T2 | API Tạo/Nhận Hội thoại | Tạo route POST `/api/ai/conversations` + controller (authMiddleware). Tạo conversation mới. Route GET `/api/ai/conversations` + controller (authMiddleware). Lấy danh sách conversation của user | AI Assistant | ✅ | ❌ | ❌ | ❌ | P0 | S | M2-T5, M7-T1 | `backend/src/controllers/aiController.js`, `backend/src/routes/aiRoutes.js` | POST → 201 + conversation. GET → 200 + danh sách |
| M7-T3 | Tạo AI Service (Gemini) | Tạo `backend/src/services/aiService.js`. Hàm `chat`: input (userId, message, conversationId, context). Logic: lấy 10 tin nhắn gần nhất, ghép system prompt + context + history + user message, gọi Gemini API, parse response, lưu user+assistant messages, trả về reply. Xử lý lỗi API/timeout | AI Assistant | ✅ | ❌ | ❌ | ✅ | P0 | M | M7-T1 | `backend/src/services/aiService.js` | Gọi Gemini API thành công, lưu messages, trả về reply. Lỗi API → trả về error message thân thiện |
| M7-T4 | API Chat AI | Tạo route POST `/api/ai/chat` + controller (authMiddleware). Input: message, conversation_id (optional), context (optional: { topic_id, vocabulary_id }). Gọi aiService.chat(). Format response theo spec 7.8 | AI Assistant | ✅ | ❌ | ❌ | ❌ | P0 | M | M7-T3 (aiService), M7-T1 | `backend/src/controllers/aiController.js`, `backend/src/routes/aiRoutes.js` | POST /api/ai/chat → 200 + reply. Lưu user+assistant messages. Error → thông báo thân thiện |
| M7-T5 | Component AI Chat (Frontend) | Tạo `frontend/src/components/ai-chat.html` + `frontend/src/js/components/ai-chat.js`. Icon bong bóng cố định góc dưới phải. Popup chat: hiển thị/ẩn. Load danh sách conversation. Gửi tin nhắn → gọi POST /api/ai/chat → hiển thị phản hồi. Nút "Hội thoại mới". Xử lý lỗi AI → hiển thị thông báo. Tích hợp vào tất cả trang (dashboard, learn, quiz, notebook, profile) | AI Assistant | ❌ | ✅ | ❌ | ❌ | P0 | L | M1-T8, M2-T13, M7-T2, M7-T4 | `frontend/src/components/ai-chat.html`, `frontend/src/js/components/ai-chat.js` | Icon hiển thị trên mọi trang. Popup chat mở/đóng. Gửi tin nhắn → nhận reply. Tạo hội thoại mới. Lỗi → thông báo thân thiện |

---

## Milestone 8: Admin Dashboard

### Mục tiêu
Xây dựng giao diện Quản trị viên (Admin Dashboard) riêng biệt với giao diện Bootstrap, cho phép Admin CRUD Lộ trình, Chủ đề, Từ vựng. Tích hợp authMiddleware + adminMiddleware cho tất cả route admin. Xử lý upload file ảnh/âm thanh.

### Phạm vi
- Giao diện Admin Dashboard riêng biệt (Bootstrap, tông màu tối).
- CRUD Roadmaps (name, description, is_active, sort_order).
- CRUD Topics (gắn với roadmap_id, name, description, is_active, sort_order).
- CRUD Vocabularies (gắn với topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image).
- Upload file ảnh (JPG/PNG, max 5MB) và âm thanh (MP3, max 2MB) bằng multer.
- Kiểm tra role admin (authMiddleware + adminMiddleware).
- 403 Forbidden nếu không phải admin.

### Điều kiện tiên quyết
- Hoàn thành Milestone 2 (auth, adminMiddleware).
- Hoàn thành Milestone 3 (roadmap, topic, vocabulary models).

### Các module liên quan
- Admin Module

### Tiêu chí hoàn thành
- Admin đăng nhập → vào Admin Dashboard → thấy menu: Roadmaps, Topics, Vocabularies.
- Admin CRUD Roadmaps thành công.
- Admin CRUD Topics (gắn roadmap_id) thành công.
- Admin CRUD Vocabularies (gắn topic_id, upload file) thành công.
- User không phải admin → 403 khi truy cập route admin.
- File upload validation: đúng định dạng, kích thước.

### Tasks

| ID | Tên | Mô tả | Module | Backend | Frontend | Database | Testing | Priority | Complexity | Dependencies | Deliverables | Acceptance Criteria |
|----|-----|-------|--------|---------|----------|----------|---------|----------|------------|--------------|--------------|-------------------|
| M8-T1 | API Admin - CRUD Roadmaps | Tạo route GET/POST/PUT/DELETE `/api/admin/roadmaps` + `/api/admin/roadmaps/:id` (auth + adminMiddleware). Controller: getAll, getById, create, update, delete. CRUD đầy đủ các trường: name, description, image, is_active, sort_order. Format response theo spec 7.9 | Admin | ✅ | ❌ | ❌ | ✅ | P0 | M | M2-T5, M2-T6 (auth + admin), M3-T1 (roadmap model) | `backend/src/controllers/adminController.js`, `backend/src/routes/adminRoutes.js` | GET/POST/PUT/DELETE hoạt động. Xác thực admin. Validation đầy đủ |
| M8-T2 | API Admin - CRUD Topics | Tạo route GET/POST/PUT/DELETE `/api/admin/topics` + `/api/admin/topics/:id` (auth + adminMiddleware). Controller: getAll (theo roadmap_id), getById, create (gắn roadmap_id), update, delete. CRUD: name, description, image, roadmap_id, is_active, sort_order. Format response theo spec 7.10 | Admin | ✅ | ❌ | ❌ | ✅ | P0 | M | M8-T1, M3-T3 (topic model) | `backend/src/controllers/adminController.js`, `backend/src/routes/adminRoutes.js` | GET/POST/PUT/DELETE hoạt động. Topic gắn đúng roadmap_id. Validation |
| M8-T3 | API Admin - CRUD Vocabularies | Tạo route GET/POST/PUT/DELETE `/api/admin/vocabularies` + `/api/admin/vocabularies/:id` (auth + adminMiddleware). Controller: getAll (theo topic_id), getById, create (gắn topic_id), update, delete. CRUD: word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image. Format response theo spec 7.11 | Admin | ✅ | ❌ | ❌ | ✅ | P0 | M | M8-T1, M3-T5 (vocab model) | `backend/src/controllers/adminController.js`, `backend/src/routes/adminRoutes.js` | GET/POST/PUT/DELETE hoạt động. Vocabulary gắn đúng topic_id. Validation |
| M8-T4 | Upload File (multer) | Cấu hình multer: upload ảnh (JPG, PNG, max 5MB) vào `frontend/public/uploads/images/`, upload audio (MP3, max 2MB) vào `frontend/public/uploads/audio/`. Tên file: {timestamp}-{random}.{ext}. Validation định dạng, kích thước. Tích hợp vào route POST/PUT vocabulary admin | Admin | ✅ | ❌ | ❌ | ✅ | P0 | M | M8-T3 (admin vocab CRUD) | Cấu hình multer trong `backend/src/config/upload.js` | Upload ảnh → lưu vào uploads/images/. Upload audio → lưu vào uploads/audio/. Sai định dạng/kích thước → 400 |
| M8-T5 | Trang Admin Dashboard (Frontend) | Tạo `frontend/src/pages/admin/` gồm: dashboard.html + CSS (Bootstrap, tông màu tối) + JS. Menu: Roadmaps, Topics, Vocabularies. Giao diện CRUD: DataTable hiển thị danh sách, Modal form thêm/sửa, nút xóa (confirm). Upload file trong form vocabulary. Yêu cầu đăng nhập admin. Gọi API admin | Admin | ❌ | ✅ | ❌ | ❌ | P0 | L | M1-T8, M2-T13, M2-T6, M8-T1, M8-T2, M8-T3, M8-T4 | full Admin Dashboard pages | Admin dashboard hiển thị, CRUD hoạt động, upload file, xác thực admin. Người dùng không phải admin → 403 |

---

## Milestone 9: Validation, Error Handling, Performance, Testing & Polish

### Mục tiêu
Hoàn thiện hệ thống: validation toàn diện (Frontend + Backend), xử lý lỗi thống nhất, logging, hiệu ứng loading, toast notification, UI polish, performance tối ưu, testing, và chuẩn bị triển khai.

### Phạm vi
- Backend validation (email format, password >= 8, required fields, foreign key tồn tại, UNIQUE constraint).
- Frontend validation (email, password, confirm password, required fields).
- Xử lý lỗi: 400, 401, 403, 404, 409, 500 → hiển thị thông báo phù hợp.
- Logging: authentication, AI, admin, error logs.
- Loading states: Skeleton loading / Spinner cho mọi thao tác chờ API.
- Toast Notification cho phản hồi thao tác (tự động ẩn 3s), không dùng alert().
- UI Polish: màu sắc theo design tokens, font, responsive.
- Performance: Prepared Statements, INDEX, tối ưu query.
- Testing: unit test cho các service, integration test cho API chính.
- Deployment preparation: cấu hình môi trường, .env.example, README.

### Điều kiện tiên quyết
- Hoàn thành Milestone 8 (tất cả module đã có API và Frontend).

### Các module liên quan
- Tất cả module

### Tiêu chí hoàn thành
- Validation hoạt động ở cả Frontend và Backend cho tất cả API.
- Error handling trả về HTTP status code chính xác, message rõ ràng.
- Loading state hiển thị cho mọi thao tác API.
- Toast notification cho mọi phản hồi thao tác.
- UI nhất quán: màu sắc, font, responsive.
- Logging đầy đủ cho auth, AI, admin, error.
- Performance: query dùng INDEX, Prepared Statements.
- Test coverage cho các service chính (SRS, AI, Quiz generation).
- README + .env.example + hướng dẫn triển khai.

### Tasks

| ID | Tên | Mô tả | Module | Backend | Frontend | Database | Testing | Priority | Complexity | Dependencies | Deliverables | Acceptance Criteria |
|----|-----|-------|--------|---------|----------|----------|---------|----------|------------|--------------|--------------|-------------------|
| M9-T1 | Backend Validation | Thêm validation cho tất cả API: validate input (email format, password >= 8, required fields), kiểm tra foreign key tồn tại (roadmap_id, topic_id, vocabulary_id), kiểm tra UNIQUE constraint (email, username). Trả về 400 với message cụ thể | Validation | ✅ | ❌ | ❌ | ✅ | P0 | M | Tất cả API đã hoàn thành | Update controllers: validate input trước khi xử lý | Validation lỗi → 400 + message rõ ràng. FK không tồn tại → 404. Trùng UNIQUE → 409 |
| M9-T2 | Frontend Validation | Tạo `frontend/src/js/utils/validator.js` với các hàm: validateEmail, validatePassword, validateRequired, validateConfirmPassword. Áp dụng cho tất cả form: register, login, change password, admin forms | Validation | ❌ | ✅ | ❌ | ❌ | P0 | M | Tất cả Frontend pages | `frontend/src/js/utils/validator.js` + tích hợp vào các form | Email format sai → hiển thị lỗi. Password < 8 → hiển thị lỗi. Required fields → hiển thị lỗi |
| M9-T3 | Error Handling - HTTP Status Codes | Kiểm tra tất cả API response: 200 (thành công), 201 (tạo mới), 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found), 409 (conflict), 500 (server error). Format response thống nhất | Error Handling | ✅ | ❌ | ❌ | ❌ | P0 | M | Tất cả API | Update controllers: đảm bảo HTTP status codes đúng | Mỗi API trả về status code đúng với tình huống |
| M9-T4 | Logging Integration | Tích hợp logger.js vào: authController (register, login, change password), aiService (AI request/response, error), adminController (CRUD operations), error handling (500, database error). Log: timestamp, level, message, context | Error Handling | ✅ | ❌ | ❌ | ❌ | P1 | M | M1-T7 (logger), tất cả controller/service | Tích hợp logger vào controllers và services | Auth, AI, Admin operations được log. Error được log với stack trace |
| M9-T5 | Loading States (Frontend) | Tạo `frontend/src/components/loading.html` (skeleton/spinner component). Áp dụng cho: tất cả trang khi gọi API (login, register, load topics, load vocab, flashcard, quiz, notebook, AI chat, admin tables) | UI Polish | ❌ | ✅ | ❌ | ❌ | P0 | M | Tất cả Frontend pages | Loading component + tích hợp vào mọi trang | Mọi thao tác API đều có loading indicator. Không để màn hình đứng yên |
| M9-T6 | Toast Notification (Frontend) | Tạo `frontend/src/components/toast.html` + `frontend/src/js/components/toast.js`. Hàm showToast(message, type): success, error, warning, info. Tự động ẩn sau 3 giây. Góc trên bên phải. Không dùng alert(). Tích hợp vào tất cả trang | UI Polish | ❌ | ✅ | ❌ | ❌ | P0 | M | Tất cả Frontend pages | Toast component + tích hợp vào mọi trang | Toast hiển thị đúng, tự động ẩn, không dùng alert(). Có 4 màu: success, error, warning, info |
| M9-T7 | UI Polish | Kiểm tra và hoàn thiện: màu sắc theo design tokens (#FFC300, Emerald-500, Amber-500, Rose-500), font Inter/Roboto/system-ui (hỗ trợ IPA), responsive layout, các component header/bottom-nav đồng bộ | UI Polish | ❌ | ✅ | ❌ | ❌ | P0 | M | Tất cả Frontend pages | Update CSS các trang | Màu sắc đúng design tokens. Font hiển thị IPA. Responsive. Header + bottom-nav đồng bộ |
| M9-T8 | Performance - Database Index | Kiểm tra và bổ sung INDEX cho các cột: users(email), users(role), users(roadmap_id), topics(roadmap_id), vocabularies(topic_id), vocabularies(word), user_vocabularies(user_id), user_vocabularies(status), user_vocabularies(next_review_at), quiz_answers(quiz_attempt_id), ai_messages(conversation_id) | Performance | ❌ | ❌ | ✅ | ❌ | P1 | S | M1-T3 (schema) | Update `database/schema.sql` | INDEX trên các cột thường xuyên truy vấn. Truy vấn dùng INDEX đúng |
| M9-T9 | Testing - Service Unit Tests | Viết test cho: srsService (tính next_review_at), aiService (prompt generation, error handling), quiz generation rules (lọc từ, ưu tiên review_count thấp, tối đa 20 câu) | Testing | ✅ | ❌ | ❌ | ✅ | P1 | M | M4-T6 (SRS), M5-T2 (quiz), M7-T3 (AI) | Test files: srsService.test.js, aiService.test.js, quizService.test.js | SRS tính đúng next_review_at. Quiz generation đúng rules (max 20, ưu tiên review_count thấp) |
| M9-T10 | Testing - API Integration Tests | Viết test cho các API chính: register (thành công, trùng email, validation lỗi), login (thành công, sai password), profile (get, update), roadmaps (list active), topics (list by roadmap), vocabularies (list by topic), learning (start, mastered, writing), quiz (start, answer, complete) | Testing | ✅ | ❌ | ❌ | ✅ | P1 | L | Tất cả controller hoàn thành | Test files: auth.test.js, profile.test.js, learning.test.js, quiz.test.js | Các API chính hoạt động đúng theo spec, test pass |
| M9-T11 | Deployment Preparation | Tạo .env.example với các biến: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, GEMINI_API_KEY, PORT. Tạo README.md: hướng dẫn cài đặt, cấu hình, chạy seed, chạy dev. Kiểm tra folder upload tồn tại | Deployment | ✅ | ✅ | ❌ | ❌ | P1 | S | Tất cả milestone | `backend/.env.example`, `README.md` | .env.example có đủ biến môi trường. README có hướng dẫn cài đặt chi tiết |

---

## Tổng quan Dependency

```
Milestone 1 (Setup)
    │
    ▼
Milestone 2 (Authentication & Profile)
    │
    ▼
Milestone 3 (Roadmap, Topic, Vocabulary)
    │
    ├────────────────────────────────┐
    ▼                                ▼
Milestone 4 (Learning, Flashcard,   Milestone 5 (Quiz)
 Writing Exercise, SRS)                  │
    │                                     ▼
    └────────────────────────────────► Milestone 6 (Notebook, Streak)
                                        │
                                        ▼
                                    Milestone 7 (AI Assistant)
                                        │
                                        ▼
                                    Milestone 8 (Admin Dashboard)
                                        │
                                        ▼
                                    Milestone 9 (Polish, Testing, Deploy)
```

## Kiểm tra truy vết

### Truy vết từ nguồn tài liệu

- **requirements.md**: Yêu cầu tổng quan, User Flows (3.1-3.5), API Conventions (5.1-5.10), Database Requirements, Coding Convention.
- **spec.md**: Functional Requirements (FR-001 đến FR-053), User Stories (US-01 đến US-10), Business Rules (6.1-6.6), Input/Output Data Specs (7.1-7.11), Business Flows (8.1-8.7), Edge Cases.
- **architecture.md**: Kiến trúc tổng thể (2.1), Cấu trúc thư mục (3.1-3.5), Backend Architecture (4.1-4.8), Frontend Architecture (5.1-5.8), Module Architecture (6.1-6.11), Dependency (16.1-16.3).
- **database.md**: Danh sách bảng (9 bảng), Mô tả chi tiết từng bảng, Quan hệ, Chiến lược Index.

### Xác nhận

- ✅ Không có chức năng ngoài spec.md
- ✅ Không có bảng ngoài database.md (9 bảng: users, roadmaps, topics, vocabularies, user_vocabularies, quiz_attempts, quiz_answers, ai_conversations, ai_messages)
- ✅ Không có module ngoài architecture.md (Authentication, User, Roadmap, Topic, Vocabulary, Notebook, Quiz, Streak, AI, Admin)
- ✅ Không có API mới ngoài spec.md và requirements.md
- ✅ Không có Business Rule mới ngoài spec.md
- ✅ Không có Framework mới ngoài requirements.md và architecture.md
- ✅ Không có Milestone mới (đúng 9 Milestone)
- ✅ Không thay đổi thứ tự Milestone
- ✅ Mọi Task đều có Dependency
- ✅ Mọi Task đều có Acceptance Criteria
- ✅ Mọi Task đều có Deliverables