# Research & Technical Decisions — WordMate

- **Version:** 1.0
- **Created:** 2026-07-22
- **Status:** Draft for Review
- **Based on:** `requirements.md`, `spec.md`, `architecture.md`, `database.md`, `database/schema.sql`

---

## Table of Contents
1. [Kiến trúc Express.js](#1-kiến-trúc-expressjs)
2. [Cấu trúc thư mục Backend và Frontend](#2-cấu-trúc-thư-mục-backend-và-frontend)
3. [JWT Authentication](#3-jwt-authentication)
4. [Password Hashing (bcrypt)](#4-password-hashing-bcrypt)
5. [Middleware](#5-middleware)
6. [Chuẩn Response API](#6-chuẩn-response-api)
7. [Validation dữ liệu](#7-validation-dữ-liệu)
8. [Xử lý lỗi (Error Handling)](#8-xử-lý-lỗi-error-handling)
9. [Logging](#9-logging)
10. [CORS](#10-cors)
11. [Biến môi trường (.env)](#11-biến-môi-trường-env)
12. [Kết nối MySQL](#12-kết-nối-mysql)
13. [Tổ chức Service và Controller](#13-tổ-chức-service-và-controller)
14. [Quy ước đặt tên API RESTful](#14-quy-ước-đặt-tên-api-restful)
15. [Bảo mật cơ bản cho ứng dụng](#15-bảo-mật-cơ-bản-cho-ứng-dụng)
16. [Tích hợp OpenAI API cho Chatbot AI](#16-tích-hợp-openai-api-cho-chatbot-ai)
17. [Open Questions](#17-open-questions)

---

## 1. Kiến trúc Express.js

### Vấn đề cần quyết định
Lựa chọn cấu trúc kiến trúc cho ứng dụng Express.js sao cho phù hợp với quy mô MVP, dễ bảo trì và mở rộng sau này.

### Quyết định được chọn
Sử dụng **MVC (Model-View-Controller)** với biến thể **Route-Controller-Service-Model** (RCSM). Backend chỉ đóng vai trò API, không render view — vì Frontend là SPA (Single Page Application) thuần HTML/CSS/JS.

### Lý do lựa chọn
- Tài liệu `architecture.md` và `requirements.md` đã chỉ rõ backend theo mô hình MVC.
- Tách biệt rõ ràng: Route (định tuyến) → Controller (xử lý request) → Service (business logic) → Model (truy vấn DB).
- Dễ dàng kiểm thử (unit test) từng layer riêng biệt.
- Quen thuộc với đa số developer Node.js, giảm chi phí onboarding.

### Các phương án đã cân nhắc
| Phương án | Mô tả | Lý do không chọn |
|-----------|-------|-----------------|
| MVC thuần (Model-View-Controller) | View render ở server | Frontend là SPA riêng, không cần server-side rendering |
| Clean Architecture / Hexagonal | Phân lớp sâu hơn (Use Case, Domain, Repository) | Over-engineering cho MVP, tăng boilerplate không cần thiết |
| Express Router thuần (fat controller) | Logic trong route handler | Khó bảo trì, khó test khi ứng dụng lớn dần |

---

## 2. Cấu trúc thư mục Backend và Frontend

### Vấn đề cần quyết định
Tổ chức cây thư mục cho cả Backend và Frontend sao cho nhất quán, dễ điều hướng.

### Quyết định được chọn

#### Backend (`backend/`)
```
backend/
├── config/              # Cấu hình: database, env, ...
├── src/
│   ├── routes/          # Định nghĩa route (authRoutes, vocabRoutes, ...)
│   ├── controllers/     # Xử lý request/response
│   ├── services/        # Business logic
│   ├── models/          # Truy vấn database
│   ├── middleware/       # Custom middleware (auth, validation, error, ...)
│   ├── utils/           # Hàm tiện ích (response helper, logger, ...)
│   ├── validators/      # Schema validation (Joi/Zod)
│   └── server.js        # Entry point
├── uploads/             # File upload (images, audio)
├── .env                 # Biến môi trường
└── package.json
```

#### Frontend (`frontend/`)
```
frontend/
├── public/              # Static assets (favicon, manifest, ...)
├── src/
│   ├── pages/           # HTML pages (auth/, dashboard/, admin/)
│   ├── css/             # Global styles, Tailwind/Bootstrap overrides
│   ├── js/
│   │   ├── utils/       # Helper functions (api.js, validator.js, toast.js)
│   │   ├── components/  # JS logic cho từng component (chatbot, flashcard, ...)
│   │   └── pages/       # JS logic cho từng trang (login.js, register.js, ...)
│   └── components/      # HTML components (modal, loading, chatbot, ...)
└── index.html
```

### Lý do lựa chọn
- Backend tách biệt rõ ràng từng layer (Route → Controller → Service → Model).
- Mỗi module (auth, vocabulary, quiz, ai) có bộ route + controller + service + model riêng.
- Frontend tách HTML (template), CSS (style), JS (logic) — phù hợp với kiến trúc SPA thuần.
- Components HTML tái sử dụng qua các trang (modal, toast, loading spinner).
- `utils/response.js` đã tồn tại trong codebase — khẳng định hướng đi đúng.

### Các phương án đã cân nhắc
| Phương án | Mô tả | Lý do không chọn |
|-----------|-------|-----------------|
| Feature-based (mỗi feature một folder chứa cả route + controller + model) | `auth/` chứa hết | Dễ trùng lặp, khó quản lý middleware dùng chung |
| Monolithic backend (không tách service) | Controller gọi trực tiếp Model | Vi phạm SRP, khó kiểm thử |
| Frontend framework (React, Vue) | Thêm dependency nặng | requirements.md đã chốt HTML/CSS/JS Native |

---

## 3. JWT Authentication

### Vấn đề cần quyết định
Cơ chế xác thực người dùng và phân quyền dựa trên role.

### Quyết định được chọn
- Sử dụng **JWT (JSON Web Token)** với cơ chế **Access Token**.
- Access Token được gửi trong HTTP Header: `Authorization: Bearer <token>`.
- Payload token chứa `{ user_id, email, role }`.
- Thời gian sống (TTL): **24 giờ** (theo NFR-008 của spec.md).
- Lưu token ở **localStorage** cho Frontend (phù hợp với SPA thuần).
- Backend sử dụng middleware `authMiddleware.js` để verify token trước mỗi request cần bảo vệ.
- Riêng admin routes, middleware mở rộng kiểm tra thêm `role === 'admin'`.

### Lý do lựa chọn
- spec.md (FR-003, NFR-008) và requirements.md (API Conventions 5.6) đã quy định rõ JWT.
- Token-based authentication không cần session lưu server — scale tốt.
- 24 giờ là dung hòa giữa bảo mật và trải nghiệm người dùng.
- localStorage dùng được cho SPA, không phụ thuộc vào cookie.

### Các phương án đã cân nhắc
| Phương án | Mô tả | Lý do không chọn |
|-----------|-------|-----------------|
| Session-based (cookie + session store) | Lưu session trong DB/memory | Cần session store, không phù hợp với kiến trúc stateless API |
| JWT + Refresh Token | Access token ngắn hạn (15 phút) + refresh token dài hạn | Over-engineering cho MVP; 24h token đủ an toàn với ứng dụng học tập |
| Cookie (httpOnly) | Lưu JWT trong cookie | Khó tích hợp với SPA thuần trên multiple domains/subdomains |

---

## 4. Password Hashing (bcrypt)

### Vấn đề cần quyết định
Thuật toán và thư viện mã hóa mật khẩu người dùng.

### Quyết định được chọn
- Sử dụng **bcrypt** (thư viện `bcryptjs` — bản pure JavaScript, không cần native build).
- Số vòng salt (salt rounds): **10**.
- Hash được lưu ở cột `password` (VARCHAR(255)) trong bảng `users`.

### Lý do lựa chọn
- spec.md (NFR-007) và requirements.md đã chỉ rõ password phải được hash bằng bcrypt.
- bcrypt là chuẩn công nghiệp, built-in chống brute-force (chậm để tính toán).
- `bcryptjs` (pure JS) tránh lỗi biên dịch native addon trên môi trường Windows (phù hợp với dev machine).
- Salt rounds = 10 là cân bằng giữa bảo mật và hiệu năng (~100ms trên máy trung bình).

### Các phương án đã cân nhắc
| Phương án | Mô tả | Lý do không chọn |
|-----------|-------|-----------------|
| bcrypt (bản native) | `bcrypt` npm package cần C++ build toolchain | Lỗi cài đặt trên Windows thường gặp, không cần thiết |
| argon2 | Thuật toán hiện đại hơn | Ít phổ biến hơn, không được yêu cầu trong spec |
| SHA-256 + salt | Hash nhanh | Không chống brute-force hiệu quả, không khuyến nghị cho password |
| plain text | — | Vi phạm bảo mật nghiêm trọng |

---

## 5. Middleware

### Vấn đề cần quyết định
Các tầng middleware cần xây dựng để xử lý request lifecycle.

### Quyết định được chọn
Các middleware sau sẽ được triển khai:

| Middleware | Vị trí | Chức năng |
|-----------|--------|-----------|
| `auth.js` | `middleware/` | Verify JWT token, gắn `req.user` |
| `adminAuth.js` | `middleware/` | Kế thừa auth, kiểm tra `req.user.role === 'admin'` |
| `errorHandler.js` | `middleware/` | Global error handler (catch all uncaught errors) |
| `validate.js` | `middleware/` | Gọi validator để validate request body/params/query |
| `upload.js` | `middleware/` | Xử lý file upload (multer) |
| `logger.js` | `middleware/` | Ghi log request (kết hợp với morgan) |
| `cors.js` | `middleware/` | Cấu hình CORS (hoặc dùng package `cors`) |

Thứ tự middleware trong server:
```
1. Logger (morgan)
2. CORS
3. JSON body parser (express.json)
4. URL-encoded parser (express.urlencoded)
5. Static files (express.static — uploads)
6. Routes (có middleware auth/adminAuth bên trong từng route)
7. 404 handler
8. Global error handler
```

### Lý do lựa chọn
- requirements.md (5.6) yêu cầu middleware để xác thực và phân quyền.
- architecture.md đã đề cập middleware-based architecture.
- Tách adminAuth riêng giúp tái sử dụng auth cho các route thường.
- Global error handler đảm bảo mọi lỗi đều trả về JSON format.

### Các phương án đã cân nhắc
| Phương án | Mô tả | Lý do không chọn |
|-----------|-------|-----------------|
| Auth + role check trong cùng middleware | Middleware duy nhất kiểm tra token và role | Kém linh hoạt, khó tái sử dụng cho route không cần admin |

---

## 6. Chuẩn Response API

### Vấn đề cần quyết định
Format JSON thống nhất cho toàn bộ API response.

### Quyết định được chọn
Tuân thủ chính xác format đã được định nghĩa trong `requirements.md` (5.4) và `spec.md` (7.x):

#### Thành công (200 OK):
```json
{
    "success": true,
    "message": "Request successful.",
    "data": {}
}
```

#### Danh sách (200 OK):
```json
{
    "success": true,
    "data": []
}
```

#### Tạo mới (201 Created):
```json
{
    "success": true,
    "message": "Created successfully.",
    "data": {}
}
```

#### Lỗi:
```json
{
    "success": false,
    "message": "Error description."
}
```

#### Lỗi validation (400 Bad Request):
```json
{
    "success": false,
    "message": "Validation failed.",
    "errors": [
        { "field": "email", "message": "Email is required" }
    ]
}
```

### Lý do lựa chọn
- requirements.md (5.4, 5.5) và spec.md (7.x) đã quy định chi tiết format.
- Codebase hiện tại đã có `utils/response.js` — cần giữ nguyên và mở rộng.
- Nhất quán giúp Frontend dễ dàng xử lý response.
- `message` field giúp hiển thị thông báo lỗi thân thiện.

### Các phương án đã cân nhắc
| Phương án | Mô tả | Lý do không chọn |
|-----------|-------|-----------------|
| JSON:API (jsonapi.org) | Chuẩn phức tạp với relationships, links | Over-engineering, không cần thiết cho MVP |
| Chỉ trả về data (không success flag) | Frontend tự suy luận từ HTTP status | Không nhất quán, khó xử lý error message |

---

## 7. Validation dữ liệu

### Vấn đề cần quyết định
Thư viện và cơ chế kiểm tra dữ liệu đầu vào cho API.

### Quyết định được chọn
- Sử dụng **Joi** làm thư viện validation (hoặc **Zod** nếu team muốn TypeScript sau này).
- Tạo file validator riêng cho từng module (ví dụ: `validators/authValidator.js`).
- Middleware `validate.js` nhận schema và tự động validate `req.body`, `req.params`, `req.query`.
- Validation bao gồm:
  - Email: đúng định dạng.
  - Password: tối thiểu 8 ký tự.
  - Username: không để trống.
  - Các khóa ngoại (roadmap_id, topic_id, vocabulary_id): phải là số nguyên dương.
  - Các trường UNIQUE (email, username, word trong topic): kiểm tra tồn tại.

### Lý do lựa chọn
- requirements.md (5.7) yêu cầu backend phải kiểm tra dữ liệu đầu vào.
- Joi là thư viện validation phổ biến nhất cho Node.js, dễ dùng, cú pháp rõ ràng.
- Middleware-based validation tái sử dụng được, giảm code trong controller.
- Kiểm tra tồn tại khóa ngoại giúp tránh lỗi database constraint violation.

### Các phương án đã cân nhắc
| Phương án | Mô tả | Lý do không chọn |
|-----------|-------|-----------------|
| express-validator | Middleware validation tích hợp | Cú pháp dài dòng, khó đọc hơn Joi |
| Manual validation (if-else) | Tự viết hàm kiểm tra | Dễ sai sót, khó bảo trì, trùng lặp code |
| Zod | TypeScript-first validation | Codebase hiện tại dùng JS thuần, Zod không phát huy hết lợi thế |

---

## 8. Xử lý lỗi (Error Handling)

### Vấn đề cần quyết định
Cơ chế xử lý lỗi tập trung, tránh try-catch tràn lan.

### Quyết định được chọn
- Sử dụng **Global Error Handler Middleware** duy nhất.
- Định nghĩa class `AppError` kế thừa `Error`, chứa `statusCode`, `isOperational`.
- Controller/Service khi gặp lỗi chỉ cần `throw new AppError(400, 'message')`.
- Global handler bắt tất cả lỗi, log lỗi nghiêm trọng (500), trả về JSON format.
- Sử dụng `express-async-errors` package (hoặc wrapper function) để bắt lỗi async tự động.

### Cấu trúc AppError:
```javascript
class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}
```

### Xử lý các loại lỗi:
| Loại lỗi | HTTP Status | Cách xử lý |
|-----------|-------------|------------|
| Validation | 400 | Joi validation → throw AppError |
| Unauthorized | 401 | Auth middleware → 401 |
| Forbidden | 403 | Admin middleware → 403 |
| Not Found | 404 | Query result empty → AppError('Resource not found') |
| Duplicate | 409 | MySQL duplicate entry → AppError('Already exists') |
| Internal | 500 | Catch-all → log error, trả về message chung |

### Lý do lựa chọn
- requirements.md (5.5) và spec.md (NFR-015) yêu cầu HTTP status codes chính xác.
- tránh try-catch ở mọi controller, code sạch hơn.
- `express-async-errors` giúp bắt lỗi async tự động mà không cần wrapper.

### Các phương án đã cân nhắc
| Phương án | Mô tả | Lý do không chọn |
|-----------|-------|-----------------|
| Try-catch từng controller | Bắt lỗi riêng mỗi handler | Trùng lặp code, dễ quên xử lý error |
| Không global handler | Lỗi 500 trả về HTML mặc định của Express | Không đúng JSON format, lộ thông tin server |

---

## 9. Logging

### Vấn đề cần quyết định
Thư viện và chiến lược ghi log cho ứng dụng.

### Quyết định được chọn
- Sử dụng **Winston** làm thư viện logging chính.
- Sử dụng **Morgan** làm HTTP request logger (output qua Winston stream).
- Cấu hình 3 mức log:
  - **Console**: Development — format `combined`, log ra stdout.
  - **File - error.log**: Production — chỉ log error.
  - **File - combined.log**: Production — log tất cả.
- Cấu hình log level qua biến môi trường `LOG_LEVEL` (mặc định: `debug` cho dev, `info` cho production).

### Lý do lựa chọn
- Winston là thư viện logging mạnh mẽ, linh hoạt (multiple transports).
- Morgan là chuẩn cho HTTP request logging trong Express.
- Log ra file giúp debug production — không phụ thuộc vào console.

### Các phương án đã cân nhắc
| Phương án | Mô tả | Lý do không chọn |
|-----------|-------|-----------------|
| console.log | Không thư viện | Không có level, khó filter, không rotate file |
| Pino | Hiệu năng cao hơn Winston | Winston quen thuộc hơn, đủ nhanh cho MVP |

---

## 10. CORS

### Vấn đề cần quyết định
Cấu hình Cross-Origin Resource Sharing cho API.

### Quyết định được chọn
- Sử dụng package **`cors`**.
- Cấu hình:
  ```javascript
  const corsOptions = {
      origin: process.env.CORS_ORIGIN || ['http://localhost:5500', 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
  };
  ```

### Lý do lựa chọn
- Frontend (SPA thuần) và Backend (Express API) chạy trên port/domain khác nhau.
- Cần cho phép `Authorization` header để gửi JWT.
- `credentials: true` cho phép cookie nếu sau này cần chuyển sang cookie-based auth.
- CORS origin được cấu hình qua `.env` để linh hoạt khi deploy.

### Các phương án đã cân nhắc
| Phương án | Mô tả | Lý do không chọn |
|-----------|-------|-----------------|
| Allow all origins (`*`) | Dễ nhưng không an toàn | Rủi ro bảo mật, không cho phép gửi credentials |
| Tự viết CORS middleware | Kiểm soát hoàn toàn | Không cần thiết, `cors` package đã đáp ứng đủ |

---

## 11. Biến môi trường (.env)

### Vấn đề cần quyết định
Các biến môi trường cần thiết cho ứng dụng.

### Quyết định được chọn
File `.env` với các biến sau:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=wordmate

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5500,http://localhost:3000

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.0-flash
GEMINI_MAX_TOKENS=2048
GEMINI_TEMPERATURE=0.7

# Logging
LOG_LEVEL=debug

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
ALLOWED_IMAGE_TYPES=jpg,jpeg,png
ALLOWED_AUDIO_TYPES=mp3
```

### Lý do lựa chọn
- Codebase hiện tại đã có file `backend/.env` — cần chuẩn hóa và mở rộng.
- Tách biệt cấu hình khỏi code, tuân thủ 12-factor app.
- `JWT_SECRET` cần được thay đổi trong production.
- Cấu hình Gemini API key riêng biệt, không hardcode.

### Các phương án đã cân nhắc
| Phương án | Mô tả | Lý do không chọn |
|-----------|-------|-----------------|
| Cấu hình trong file JSON | Dễ đọc nhưng không nằm trong .gitignore | Dễ lộ secret khi push code |
| Không dùng .env, dùng biến môi trường OS | An toàn hơn | Khó quản lý khi dev, cần công cụ hỗ trợ |

---

## 12. Kết nối MySQL

### Vấn đề cần quyết định
Thư viện và cơ chế kết nối MySQL cho Node.js.

### Quyết định được chọn
- Sử dụng **`mysql2/promise`** (promise-based version).
- Tạo **connection pool** thay vì single connection.
- Cấu hình pool:
  ```javascript
  const pool = mysql2.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
  });
  ```
- Export pool dưới dạng `promise()` để dùng `pool.execute()` với prepared statements.
- Đặt file cấu hình ở `config/db.js` (codebase đã có).

### Lý do lựa chọn
- requirements.md (5.8) yêu cầu `mysql2/promise`, Prepared Statements, Async/Await.
- Connection pool tối ưu hiệu năng, tránh overhead tạo kết nối mới mỗi request.
- `mysql2/promise` hỗ trợ prepared statements chống SQL injection.
- `connectionLimit = 10` phù hợp với quy mô MVP.

### Các phương án đã cân nhắc
| Phương án | Mô tả | Lý do không chọn |
|-----------|-------|-----------------|
| mysql (callback-based) | Thư viện cũ | Không hỗ trợ Promise/async-await |
| Knex.js / Sequelize | ORM/Query Builder | requirements.md yêu cầu SQL thuần, ORM thêm độ phức tạp |
| Single connection | Pool không cần thiết cho MVP | Không scale được, dễ quá tải |

---

## 13. Tổ chức Service và Controller

### Vấn đề cần quyết định
Cách phân chia trách nhiệm giữa Controller và Service.

### Quyết định được chọn

#### Controller (controllers/):
- Chỉ xử lý request/response (parse body, gọi service, trả về response).
- Gọi validation.
- Không chứa business logic hay truy vấn DB.
- Sử dụng response helper (`utils/response.js`) để trả về format thống nhất.

#### Service (services/):
- Chứa toàn bộ business logic.
- Gọi Model để truy vấn DB.
- Quản lý transaction.
- Throw `AppError` khi gặp lỗi.

#### Model (models/):
- Chỉ chứa các hàm truy vấn SQL thuần sử dụng `mysql2/promise`.
- Mỗi bảng có một model riêng (userModel.js, vocabularyModel.js, ...).
- Trả về dữ liệu thô từ database.

### Ví dụ luồng:
```
Request → Route → Controller (validate input) → Service (business logic) 
→ Model (SQL query) → Service → Controller (format response) → Client
```

### Lý do lựa chọn
- architecture.md yêu cầu Model layer cho truy vấn DB.
- SRP (Single Responsibility Principle): mỗi layer chỉ làm một việc.
- Service layer dễ unit test (không phụ thuộc vào req/res).
- Model layer dễ thay đổi DB driver mà không ảnh hưởng phần còn lại.

### Các phương án đã cân nhắc
| Phương án | Mô tả | Lý do không chọn |
|-----------|-------|-----------------|
| Controller gọi trực tiếp Model (bỏ Service) | Đơn giản hơn | Business logic nằm rải rác, khó test, vi phạm SRP |
| Repository pattern | Thêm tầng abstraction so với Model | Over-engineering, Model layer đã đủ làm repository |

---

## 14. Quy ước đặt tên API RESTful

### Vấn đề cần quyết định
Chuẩn hóa cách đặt tên endpoint API.

### Quyết định được chọn
Tuân thủ chính xác quy tắc trong `requirements.md` (5.2):

1. **Chữ thường (`lowercase`)** — `/api/topics`
2. **Danh từ số nhiều (`plural nouns`)** — `/api/vocabularies`
3. **Phân tách từ bằng dấu gạch ngang (`-`)** — `/api/user-vocabularies`
4. **Không sử dụng động từ trong endpoint** — KHÔNG dùng `/api/getTopics`
5. **HTTP methods đúng chuẩn:**
   - `GET` — Lấy dữ liệu
   - `POST` — Tạo mới
   - `PUT/PATCH` — Cập nhật
   - `DELETE` — Xóa

#### Endpoint cụ thể:
| Method | Endpoint | Chức năng |
|--------|----------|-----------|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/logout` | Đăng xuất |
| GET/PUT | `/api/profile` | Xem/Cập nhật profile |
| GET | `/api/roadmaps` | Danh sách lộ trình |
| PUT | `/api/profile/roadmap` | Đổi lộ trình |
| GET | `/api/topics?roadmap_id=x` | Danh sách chủ đề |
| GET | `/api/vocabularies?topic_id=x` | Danh sách từ vựng |
| POST | `/api/learning/start` | Bắt đầu học flashcard |
| POST | `/api/learning/mastered` | Đánh dấu đã thuộc |
| POST | `/api/learning/practice` | Nộp bài luyện viết |
| GET/POST | `/api/quiz` | Bắt đầu/Trả lời quiz |
| GET | `/api/notebook` | Sổ tay từ vựng |
| POST | `/api/ai/chat` | Gửi tin nhắn AI |
| GET | `/api/ai/conversations` | Danh sách hội thoại AI |
| GET/POST/PUT/DELETE | `/api/admin/roadmaps` | CRUD roadmaps (admin) |
| GET/POST/PUT/DELETE | `/api/admin/topics` | CRUD topics (admin) |
| GET/POST/PUT/DELETE | `/api/admin/vocabularies` | CRUD vocabularies (admin) |

### Lý do lựa chọn
- requirements.md (5.1, 5.2) đã quy định rõ base URL và quy tắc đặt tên.
- Nhất quán giúp Frontend team dễ dàng gọi API.
- Tuân thủ RESTful convention chuẩn.

---

## 15. Bảo mật cơ bản cho ứng dụng

### Vấn đề cần quyết định
Các biện pháp bảo mật cần áp dụng cho MVP.

### Quyết định được chọn

| Biện pháp | Mô tả |
|-----------|-------|
| **Prepared Statements** | Tất cả SQL query qua `mysql2/promise.execute()`, không concatenate string |
| **JWT Secret mạnh** | Key dài, phức tạp, lưu trong `.env`, không hardcode |
| **bcrypt hash password** | Salt rounds = 10 |
| **Input validation** | Joi schema, reject invalid input ngay từ middleware |
| **CORS giới hạn** | Chỉ cho phép origin cụ thể |
| **Không lộ API key** | Gemini API key chỉ gọi từ Backend, không bao giờ gửi xuống Frontend |
| **Rate limiting** | Sử dụng `express-rate-limit` cho API (100 requests/15 phút cho general API, 20 requests/phút cho AI) |
| **HTTP headers** | Sử dụng `helmet` để set security headers (X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, ...) |
| **File upload** | Giới hạn kích thước (5MB), chỉ cho phép định dạng ảnh (jpg, png) và audio (mp3) |
| **Data ownership** | User chỉ được truy cập dữ liệu của mình (kiểm tra `user_id` trong query) |

### Lý do lựa chọn
- spec.md (NFR-009, NFR-010, NFR-011, NFR-012) yêu cầu các biện pháp bảo mật.
- rate limiting ngăn brute-force và abuse API.
- helmet là chuẩn cho Express, set hơn 20 HTTP security headers.
- Kiểm tra data ownership đảm bảo user không xem được dữ liệu người khác.

### Các phương án đã cân nhắc
| Phương án | Mô tả | Lý do không chọn |
|-----------|-------|-----------------|
| Không rate limiting | Đơn giản hơn | Rủi ro brute-force, DDoS |
| Không helmet | Ít dependency hơn | Thiếu security headers, dễ bị tấn công clickjacking |
| UUID cho user ID | Ẩn số lượng user | BIGINT UNSIGNED đã đủ, không cần thiết cho MVP |

---

## 16. Tích hợp OpenAI API cho Chatbot AI

### Vấn đề cần quyết định
Cách tích hợp AI Assistant vào ứng dụng — chọn provider, cơ chế gọi API, quản lý context.

### Quyết định được chọn

#### Provider:
- Sử dụng **Google Gemini API** (Gemini 2.0 Flash) như đã được ghi trong `spec.md` (Assumption #7) và `architecture.md`.
- Cấu hình: `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_MAX_TOKENS`, `GEMINI_TEMPERATURE` trong `.env`.

#### Kiến trúc:
```
Frontend → POST /api/ai/chat → Backend → Gemini API → Backend → Frontend
```
- **Không gọi AI trực tiếp từ Frontend** (spec.md FR-041, NFR-009).
- Backend chịu trách nhiệm:
  1. Lưu message user vào `ai_messages`.
  2. Ghép context (lịch sử hội thoại + context hiện tại) vào prompt.
  3. Gọi Gemini API.
  4. Lưu response assistant vào `ai_messages`.
  5. Trả về response cho Frontend.

#### Quản lý context:
- Gửi lịch sử hội thoại (từ `ai_messages`) làm context cho Gemini.
- Giới hạn số message gửi đi (last N messages) để tránh vượt token limit.
- Có thể gửi thêm context về topic/vocabulary hiện tại (nếu có).

#### Xử lý lỗi:
- Timeout: 15 giây.
- Nếu Gemini API lỗi → trả về message thân thiện (spec.md FR-042).
- Retry tối đa 1 lần nếu gặp lỗi transient.

#### Rate limiting riêng:
- `/api/ai/chat` rate limit: **20 requests/phút/user** (tránh abuse API key).

### Lý do lựa chọn
- spec.md (FR-037–FR-042) và architecture.md (17.4) đã chọn Gemini làm provider.
- Gọi qua Backend đảm bảo API key không bị lộ.
- Lưu message vào DB giúp duy trì context xuyên phiên.
- Rate limiting riêng cho AI tránh chi phí không kiểm soát.

### Các phương án đã cân nhắc
| Phương án | Mô tả | Lý do không chọn |
|-----------|-------|-----------------|
| OpenAI GPT-4 | Provider khác | spec.md đã chọn Gemini, chi phí GPT-4 cao hơn |
| Frontend gọi trực tiếp Gemini | Đơn giản hơn | Lộ API key, vi phạm NFR-009 |
| Không lưu message (stateless) | Đơn giản, không cần DB | Mất context khi reload, không có lịch sử chat |
| WebSocket (socket.io) | Real-time streaming | Over-engineering; REST + polling/spinner đủ cho MVP |

---

## 17. Open Questions

Các điểm chưa rõ trong tài liệu hiện có, cần được làm rõ trước khi triển khai:

| STT | Câu hỏi | Liên quan đến tài liệu | Ảnh hưởng |
|-----|---------|----------------------|-----------|
| 1 | **Streak reset logic chi tiết?** Spec.md (FR-035) nói "reset Streak về 0 nếu bỏ lỡ một ngày". Cần xác định: reset sau bao nhiêu ngày không học? Có grace period không? | spec.md FR-034, FR-035, FR-036 | Ảnh hưởng đến logic streak trong User model |
| 2 | **Thuật toán SRS cụ thể?** Spec.md (Assumption #8) nói "SM-2 đơn giản hóa". Cần công thức tính `next_review_at` dựa trên `review_count` và `is_correct`. | spec.md Assumption #8, FR-024, FR-025 | Ảnh hưởng đến service learning và quiz |
| 3 | **Cơ chế tiếp tục Quiz giữa chừng?** Spec.md (FR-027) yêu cầu "tiếp tục Quiz từ câu chưa làm nếu thoát giữa chừng". Cần thiết kế cơ chế lưu trạng thái Quiz (session) — dùng `quiz_attempts` với status, hay thêm bảng riêng? | spec.md FR-027 | Ảnh hưởng đến database và quiz service |
| 4 | **Phạm vi streak update?** Khi nào streak được tăng? Chỉ khi học từ mới (FR-018), làm Quiz (FR-034), hay cả hai? Nếu cả hai, cần tránh double-count (FR-036). | spec.md FR-018, FR-034, FR-036 | Ảnh hưởng đến learning và quiz service |
| 5 | **Format upload file?** Admin upload audio/image. Lưu trên server local (`/uploads/`) hay cần cloud storage? architecture.md (17.3) đề cập "lưu vào thư mục static `/uploads/`", nhưng chưa rõ khi deploy lên production có dùng cloud storage (S3/Cloudinary) không. | architecture.md 6.1, spec.md 8.7 | Ảnh hưởng đến upload middleware và infra |
| 6 | **Seed data mẫu?** spec.md (Assumption #2, #5) giả định có 3 roadmap và data được seed sẵn. Cần seed data chi tiết cho từng roadmap (bao nhiêu topic? bao nhiêu vocabulary mỗi topic?). | spec.md Assumption #2, #5 | Ảnh hưởng đến kế hoạch phát triển và demo |
| 7 | **Cơ chế phục hồi streak?** spec.md (Edge Cases) đề cập "có cơ chế khôi phục streak (manual hoặc auto-recover)". Cần quyết định cách thức (admin manual, auto sau khi xác minh log). | spec.md Edge Cases | Ảnh hưởng đến admin feature và user service |
| 8 | **Quiz generation rules chi tiết?** spec.md (8.4) nói "tối đa 20 câu, ưu tiên review_count thấp". Cần thêm chi tiết: số lượng câu cụ thể, có bao gồm từ mastered nếu quá hạn? | spec.md 8.4 | Ảnh hưởng đến quiz service |
| 9 | **AI context gửi kèm?** spec.md (7.8) đề cập context object có thể gửi kèm `{ topic_id, vocabulary_id }`. Cần làm rõ: Frontend tự động gửi context từ trang hiện tại, hay user tự chọn? | spec.md 7.8 | Ảnh hưởng đến Frontend và AI integration |
| 10 | **Admin role — Làm sao tạo tài khoản admin đầu tiên?** Không có API register cho admin, và spec.md không đề cập seed admin account. Cần seed thủ công qua SQL hay tạo API đặc biệt? | spec.md 2.2, database.md | Ảnh hưởng đến deployment và seed script |
| 11 | **Cấu trúc bảng `user_vocabularies` — `last_study_date` nằm ở bảng `users` hay `user_vocabularies`?** Hiện tại `last_study_date` ở bảng `users` (dùng cho streak). Nhưng cần xác nhận: học mỗi từ có cần ghi nhận ngày học riêng không? | database.md 5.1 (users), 5.5 (user_vocabularies) | Ảnh hưởng đến streak logic |
| 12 | **Notification/Toast hiển thị bao lâu?** requirements.md (5.2) nói "tự động ẩn sau 3s". Cần xác nhận: có phân biệt loại toast (success/error/warning) với thời gian khác nhau không? | requirements.md 5.2 | Ảnh hưởng đến Frontend toast component |

---

> **Lưu ý:** Tài liệu này chỉ ghi lại các quyết định kỹ thuật (Technical Decisions) dựa trên phân tích các tài liệu hiện có. Mọi thay đổi về yêu cầu hoặc kiến trúc cần được cập nhật vào các tài liệu gốc (`requirements.md`, `spec.md`, `architecture.md`, `database.md`) trước, sau đó mới cập nhật `research.md` tương ứng.