# WordMate

> **Ứng dụng học từ vựng tiếng Anh thông minh và cá nhân hóa**

WordMate là nền tảng hỗ trợ người dùng học tiếng Anh thông qua lộ trình học tập, chủ đề từ vựng, Flashcard, bài tập viết, Quiz và phương pháp **Spaced Repetition**. Hệ thống đồng thời cung cấp **Sổ tay từ vựng**, theo dõi **Streak** và **WordMate AI** nhằm hỗ trợ người học trong quá trình học tập.

Hệ thống gồm hai nhóm người dùng chính:

* **Học viên (`user`)**: sử dụng các chức năng học tập và AI Assistant.
* **Quản trị viên (`admin`)**: quản lý dữ liệu Roadmap, Topic và Vocabulary thông qua Admin Dashboard.

---

## 1. Tính năng chính

### 👨‍🎓 Dành cho học viên

* Đăng ký và đăng nhập tài khoản.
* Quản lý thông tin cá nhân và mật khẩu.
* Chọn và thay đổi **Roadmap** học tập.
* Chọn **Topic** để học từ vựng.
* Học từ mới bằng:

  * Flashcard.
  * Bài tập viết từ vựng.
* Ôn tập từ vựng bằng **Quiz**.
* Ôn tập dựa trên cơ chế **Spaced Repetition**.
* Quản lý **Sổ tay từ vựng cá nhân**:

  * Xem các từ đã học.
  * Tìm kiếm từ.
  * Đưa từ đã thuộc trở lại danh sách luyện tập.
* Theo dõi **Streak** học tập.
* Sử dụng **WordMate AI Assistant** trên các trang học tập.
* Đăng xuất tài khoản.

Các quyền trên được xác định trong Software Specification của hệ thống.

### 🛠️ Dành cho quản trị viên

Admin Dashboard cho phép quản trị viên:

* Quản lý **Roadmaps**.
* Quản lý **Topics**.
* Quản lý **Vocabularies**.
* Thêm, xem, sửa, xóa dữ liệu.
* Quản lý trạng thái hiển thị (`is_active`).
* Quản lý thứ tự hiển thị (`sort_order`).

Admin không sử dụng giao diện học Flashcard, Quiz hoặc Sổ tay với vai trò người học.

### 🤖 WordMate AI

WordMate AI là trợ lý học tiếng Anh được tích hợp trực tiếp trong hệ thống.

AI có thể hỗ trợ:

* Giải thích từ vựng.
* Giải thích ngữ pháp.
* Cung cấp câu ví dụ.
* Giải thích nội dung Quiz.
* Hỗ trợ nội dung người dùng đang học.
* Sử dụng ngữ cảnh hiện tại như Topic, Vocabulary hoặc Quiz.
* Duy trì lịch sử hội thoại.

## AI chỉ được gọi thông qua Backend và có cơ chế giới hạn phạm vi câu hỏi liên quan đến việc học tiếng Anh/WordMate.

## 2. Kiến trúc hệ thống

WordMate sử dụng kiến trúc **Client – Server**:

```text
┌──────────────────────────────┐
│           User               │
│        Web Browser           │
└──────────────┬───────────────┘
               │ HTTP / REST API
               ▼
┌──────────────────────────────┐
│          Frontend            │
│      HTML / CSS / JS         │
│   Multi Page Application     │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│           Backend            │
│       Node.js / Express      │
│                              │
│ Routes → Middleware          │
│        → Controllers         │
│        → Services / Models   │
└───────────┬──────────┬───────┘
            │          │
            ▼          ▼
      ┌──────────┐  ┌───────────┐
      │  MySQL   │  │ Gemini API │
      │ Database │  │    AI      │
      └──────────┘  └───────────┘
```

Frontend là **Multi Page Application (MPA)** sử dụng HTML/CSS/JavaScript và giao tiếp với Backend thông qua REST API. Backend là ứng dụng Node.js/Express dạng monolithic, không sử dụng microservices.

---

## 3. Công nghệ sử dụng

| Thành phần       | Công nghệ                   |
| ---------------- | --------------------------- |
| Frontend         | HTML5, CSS3, JavaScript ES6 |
| User UI          | TailwindCSS                 |
| Admin UI         | Bootstrap                   |
| Backend          | Node.js, Express.js         |
| Database         | MySQL                       |
| Database Driver  | mysql2                      |
| Authentication   | JWT                         |
| Password Hashing | bcrypt                      |
| AI               | Gemini API                  |
| Environment      | dotenv                      |
| API              | REST API                    |

Backend sử dụng JWT cho xác thực stateless, bcrypt để bảo vệ mật khẩu và `mysql2` để kết nối MySQL bằng prepared statements.

---

## 4. Cấu trúc thư mục

```text
WordMate/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   │
│   ├── .env
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── pages/
│       │   ├── auth/
│       │   ├── dashboard/
│       │   ├── learn/
│       │   ├── quiz/
│       │   ├── notebook/
│       │   ├── profile/
│       │   └── admin/
│       │
│       ├── css/
│       ├── js/
│       └── components/
│
├── database/
│   └── schema.sql
│
└── docs/
    ├── requirements.md
    ├── spec.md
    ├── architecture.md
    ├── database.md
    ├── plan.md
    └── task.md
```

Backend được tổ chức theo các tầng Route, Middleware, Controller, Service và Model nhằm tách biệt routing, authentication/authorization, business logic và truy cập dữ liệu.

---

## 5. Yêu cầu môi trường

Trước khi chạy project, cần cài đặt:

* **Node.js**
* **npm**
* **MySQL**
* Trình duyệt web hiện đại.

Ngoài ra, hệ thống AI yêu cầu một API key hợp lệ cho Gemini.

---

## 6. Cài đặt

### Bước 1: Clone project

```bash
git clone <repository-url>
cd WordMate
```

### Bước 2: Cấu hình Database

Tạo database MySQL:

```sql
CREATE DATABASE wordmate
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Sau đó import schema:

```text
database/schema.sql
```

Dữ liệu Roadmap, Topic và Vocabulary được thiết kế để được seed vào database khi khởi tạo hệ thống.

### Bước 3: Cài đặt Backend

```bash
cd backend
npm install
```

### Bước 4: Cấu hình biến môi trường

Tạo file:

```text
backend/.env
```

Cấu hình các biến cần thiết:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=wordmate

JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key

PORT=5000
```

> Không commit file `.env` lên Git vì file này chứa thông tin cấu hình và API key.

Các biến môi trường được sử dụng cho Database, JWT, Gemini API và port của Backend.

### Bước 5: Chạy Backend

```bash
npm start
```

Trong quá trình phát triển có thể sử dụng script development được cấu hình trong `package.json`.

Backend sẽ chạy trên port được cấu hình trong `.env`.

---

## 7. Luồng hoạt động chính

### Đăng nhập

```text
User
  ↓
Frontend Login
  ↓
POST /api/auth/login
  ↓
Auth Controller
  ↓
Kiểm tra tài khoản + bcrypt
  ↓
Tạo JWT
  ↓
Frontend lưu token
```

JWT được sử dụng để xác thực các request cần đăng nhập. Backend là stateless và không lưu session của người dùng.

### Học từ vựng

```text
Dashboard
   ↓
Chọn Roadmap
   ↓
Chọn Topic
   ↓
Learn
   ├── Flashcard
   └── Writing Exercise
          ↓
     Cập nhật tiến độ
```

### Ôn tập Quiz

```text
User
 ↓
Quiz
 ↓
Lấy các từ cần ôn
 ↓
Tạo câu hỏi
 ↓
User trả lời
 ↓
Chấm điểm
 ↓
Cập nhật trạng thái học
 ↓
Cập nhật lịch ôn tập / Streak
```

Hệ thống Quiz ưu tiên các từ mới, từ đang học hoặc những từ đã đến thời điểm ôn tập theo cơ chế Spaced Repetition.

### AI Assistant

```text
User
 ↓
AI Chat
 ↓
Frontend
 ↓
Backend
 ↓
Kiểm tra phạm vi câu hỏi
 ↓
Lấy context + lịch sử hội thoại
 ↓
Gemini API
 ↓
Backend
 ↓
Frontend
 ↓
AI Response
```

Frontend không gọi trực tiếp Gemini API. Request AI được xử lý qua Backend để kiểm soát authentication, context, conversation và phạm vi câu hỏi.

---

## 8. Bảo mật

WordMate áp dụng một số cơ chế bảo mật cơ bản:

* Mật khẩu được hash bằng **bcrypt** trước khi lưu Database.
* Authentication sử dụng **JWT**.
* Phân quyền dựa trên `role`.
* Admin API được bảo vệ bằng middleware phân quyền.
* Database sử dụng prepared statements.
* Gemini API key chỉ được lưu ở Backend thông qua biến môi trường.
* Frontend không truy cập trực tiếp Gemini API.
* Kiểm tra quyền sở hữu đối với các conversation của người dùng.

---

## 9. Tài liệu dự án

Các tài liệu thiết kế và phát triển được lưu trong thư mục `docs/`:

| Tài liệu          | Nội dung                  |
| ----------------- | ------------------------- |
| `requirements.md` | Yêu cầu sản phẩm          |
| `spec.md`         | Software Specification    |
| `architecture.md` | Kiến trúc hệ thống        |
| `database.md`     | Thiết kế cơ sở dữ liệu    |
| `plan.md`         | Kế hoạch triển khai       |
| `task.md`         | Danh sách task phát triển |

Các tài liệu này là cơ sở để triển khai và đảm bảo code bám sát phạm vi MVP của WordMate.

---

## 10. Phạm vi hệ thống

WordMate tập trung vào việc hỗ trợ học tiếng Anh thông qua:

**Học từ mới → Luyện tập → Ôn tập → Theo dõi tiến độ → Hỗ trợ bằng AI**

Hệ thống MVP không nhằm trở thành một nền tảng học ngoại ngữ đa kỹ năng toàn diện mà tập trung vào **từ vựng tiếng Anh và quá trình ôn tập từ vựng**.

---

## 11. Trạng thái dự án

**Project:** WordMate
**Type:** Web Application
**Architecture:** Client – Server
**Frontend:** Multi Page Application
**Backend:** Node.js + Express.js
**Database:** MySQL
**AI:** Gemini API

---

## 12. License

Project được phát triển phục vụ mục đích học tập và nghiên cứu.
