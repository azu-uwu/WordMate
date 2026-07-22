# WordMate Database Design

**Project:** WordMate – Intelligent Vocabulary Learning System

**Database:** MySQL 8.0+

**Engine:** InnoDB

**Character Set:** utf8mb4

**Collation:** utf8mb4_unicode_ci

---

# 1. Mục đích

Tài liệu này mô tả thiết kế cơ sở dữ liệu của hệ thống WordMate.

Database được thiết kế theo nguyên tắc chuẩn hóa (Third Normal Form - 3NF), đảm bảo:

- Không dư thừa dữ liệu.
- Dễ mở rộng.
- Dễ bảo trì.
- Hỗ trợ tốt cho việc phát triển Backend bằng Node.js + Express.
- Phù hợp với hệ thống học từ vựng cá nhân hóa.

---

# 2. Công nghệ sử dụng

| Thành phần | Công nghệ |
|------------|-----------|
| Database | MySQL 8.0+ |
| Storage Engine | InnoDB |
| Character Set | utf8mb4 |
| Collation | utf8mb4_unicode_ci |

---

# 3. Nguyên tắc thiết kế

Database được thiết kế theo các nguyên tắc sau:

- Chuẩn hóa dữ liệu theo 3NF.
- Mỗi bảng chỉ lưu một loại dữ liệu.
- Sử dụng khóa chính (Primary Key) dạng BIGINT UNSIGNED AUTO_INCREMENT.
- Sử dụng khóa ngoại (Foreign Key) để đảm bảo tính toàn vẹn dữ liệu.
- Tất cả quan hệ đều sử dụng:

```
ON DELETE CASCADE
ON UPDATE CASCADE
```

- Các trường thời gian sử dụng TIMESTAMP.
- Toàn bộ bảng đều sử dụng InnoDB.
- Toàn bộ dữ liệu Unicode sử dụng utf8mb4.

---

# 4. Danh sách bảng

Hệ thống gồm 9 bảng chính.

| STT | Bảng | Chức năng |
|-----|------|-----------|
|1|users|Quản lý tài khoản người dùng|
|2|roadmaps|Quản lý lộ trình học|
|3|topics|Quản lý chủ đề|
|4|vocabularies|Kho từ vựng hệ thống|
|5|user_vocabularies|Tiến trình học của từng người dùng|
|6|quiz_attempts|Lịch sử làm Quiz|
|7|quiz_answers|Chi tiết từng câu trả lời|
|8|ai_conversations|Cuộc hội thoại AI|
|9|ai_messages|Tin nhắn AI|

---

# 5. Mô tả chi tiết từng bảng

---

## 5.1 users

### Mục đích

Lưu thông tin tài khoản của người dùng và quản trị viên.

### Quan hệ

- Một User thuộc một Roadmap hiện tại.
- Một User có nhiều User Vocabulary.
- Một User có nhiều Quiz Attempt.
- Một User có nhiều AI Conversation.

### Các trường

| Trường | Mô tả |
|---------|------|
|id|Khóa chính|
|username|Tên đăng nhập|
|email|Email đăng nhập|
|password|Mật khẩu đã mã hóa BCrypt|
|fullname|Họ và tên|
|avatar|Ảnh đại diện|
|role|Phân quyền (user/admin)|
|roadmap_id|Lộ trình hiện tại|
|streak|Chuỗi ngày học liên tiếp|
|last_study_date|Ngày học gần nhất|
|created_at|Ngày tạo|
|updated_at|Ngày cập nhật|

### Quy tắc

- Username duy nhất.
- Email duy nhất.
- Password luôn được mã hóa.
- Role mặc định là user.

---

## 5.2 roadmaps

### Mục đích

Lưu các lộ trình học của hệ thống.

Ví dụ:

- Basic English
- TOEIC
- Phrasal Verb & Idiom

### Quan hệ

Một Roadmap có nhiều Topic.

### Các trường

| Trường | Mô tả |
|---------|------|
|id|Khóa chính|
|name|Tên lộ trình|
|description|Mô tả|
|image|Ảnh minh họa|
|is_active|Trạng thái hoạt động|
|sort_order|Thứ tự hiển thị|
|created_at|Ngày tạo|
|updated_at|Ngày cập nhật|

---

## 5.3 topics

### Mục đích

Lưu danh sách các chủ đề thuộc từng Roadmap.

Ví dụ:

Roadmap TOEIC

- Business
- Meeting
- Travel

### Quan hệ

- Một Topic thuộc một Roadmap.
- Một Topic có nhiều Vocabulary.

### Các trường

| Trường | Mô tả |
|---------|------|
|id|Khóa chính|
|roadmap_id|Thuộc Roadmap nào|
|name|Tên chủ đề|
|description|Mô tả|
|image|Ảnh minh họa|
|sort_order|Thứ tự hiển thị|
|is_active|Trạng thái|
|created_at|Ngày tạo|
|updated_at|Ngày cập nhật|

---

## 5.4 vocabularies

### Mục đích

Lưu kho từ vựng của hệ thống.

Đây là dữ liệu gốc do Admin quản lý.

### Quan hệ

Một Vocabulary thuộc một Topic.

### Các trường

| Trường | Mô tả |
|---------|------|
|id|Khóa chính|
|topic_id|Thuộc Topic|
|word|Từ vựng|
|pronunciation|Phiên âm|
|part_of_speech|Loại từ|
|meaning|Nghĩa tiếng Việt|
|example|Ví dụ|
|example_meaning|Dịch ví dụ|
|audio|Đường dẫn file phát âm|
|image|Ảnh minh họa|
|created_at|Ngày tạo|
|updated_at|Ngày cập nhật|

### Loại từ

- noun
- verb
- adjective
- adverb
- preposition
- phrasal_verb
- idiom
- other

---

## 5.5 user_vocabularies

### Mục đích

Lưu tiến trình học của từng người dùng.

Đây là bảng quan trọng nhất trong hệ thống.

Mỗi User sẽ có trạng thái học riêng cho từng Vocabulary.

### Quan hệ

- Thuộc User.
- Thuộc Vocabulary.

### Các trường

| Trường | Mô tả |
|---------|------|
|id|Khóa chính|
|user_id|Người học|
|vocabulary_id|Từ vựng|
|status|Trạng thái học|
|review_count|Số lần ôn tập|
|last_reviewed_at|Lần ôn gần nhất|
|next_review_at|Lần ôn tiếp theo|
|created_at|Ngày tạo|
|updated_at|Ngày cập nhật|

### Trạng thái

| Giá trị | Ý nghĩa |
|----------|---------|
|new|Chưa học|
|learning|Đang học|
|mastered|Đã thuộc|

---

## 5.6 quiz_attempts

### Mục đích

Lưu mỗi lần người dùng làm bài Quiz.

### Quan hệ

- Thuộc User.
- Có nhiều Quiz Answer.

### Các trường

| Trường | Mô tả |
|---------|------|
|id|Khóa chính|
|user_id|Người làm Quiz|
|score|Điểm|
|total_questions|Tổng số câu|
|correct_answers|Số câu đúng|
|duration|Thời gian làm bài|
|created_at|Ngày tạo|

---

## 5.7 quiz_answers

### Mục đích

Lưu từng câu trả lời trong một lần làm Quiz.

### Quan hệ

- Thuộc Quiz Attempt.
- Thuộc Vocabulary.

### Các trường

| Trường | Mô tả |
|---------|------|
|id|Khóa chính|
|quiz_attempt_id|Lần làm Quiz|
|vocabulary_id|Từ vựng|
|user_answer|Đáp án người dùng|
|correct_answer|Đáp án đúng|
|is_correct|Đúng/Sai|
|created_at|Ngày tạo|

---

## 5.8 ai_conversations

### Mục đích

Lưu danh sách các cuộc hội thoại AI.

### Quan hệ

- Thuộc User.
- Có nhiều AI Message.

### Các trường

| Trường | Mô tả |
|---------|------|
|id|Khóa chính|
|user_id|Người dùng|
|title|Tiêu đề hội thoại|
|created_at|Ngày tạo|
|updated_at|Ngày cập nhật|

---

## 5.9 ai_messages

### Mục đích

Lưu từng tin nhắn trong cuộc hội thoại AI.

### Quan hệ

Thuộc AI Conversation.

### Các trường

| Trường | Mô tả |
|---------|------|
|id|Khóa chính|
|conversation_id|Cuộc hội thoại|
|role|user hoặc assistant|
|content|Nội dung|
|created_at|Ngày tạo|

---

# 6. Quan hệ giữa các bảng

```
Roadmaps
    │
    └────────── Topics
                    │
                    └────────── Vocabularies
                                     │
                                     ├──────── User_Vocabularies
                                     │
                                     └──────── Quiz_Answers

Users
    │
    ├──────── User_Vocabularies
    │
    ├──────── Quiz_Attempts
    │             │
    │             └──────── Quiz_Answers
    │
    └──────── AI_Conversations
                  │
                  └──────── AI_Messages
```

---

# 7. Luồng dữ liệu

## Học từ mới

User

↓

Roadmap

↓

Topic

↓

Vocabulary

↓

User Vocabulary

↓

Learning / Mastered

---

## Quiz

User

↓

Quiz Attempt

↓

Quiz Answers

↓

Kết quả

---

## AI

User

↓

Conversation

↓

Messages

---

# 8. Chiến lược Index

Hệ thống tạo Index cho:

- Username
- Email
- Role
- Roadmap
- Topic
- Word
- Status
- Next Review
- User ID
- Conversation ID

Mục tiêu:

- Tăng tốc tìm kiếm.
- Giảm thời gian truy vấn.
- Tối ưu Dashboard và Quiz.

---

# 9. Tính toàn vẹn dữ liệu

Database sử dụng:

- PRIMARY KEY
- FOREIGN KEY
- UNIQUE INDEX
- INDEX
- ENUM
- ON DELETE CASCADE
- ON UPDATE CASCADE

để đảm bảo tính nhất quán của dữ liệu.

---

# 10. Khả năng mở rộng

Thiết kế hiện tại cho phép bổ sung các tính năng sau mà không cần thay đổi nhiều cấu trúc cơ sở dữ liệu:

- Leaderboard
- Hệ thống thông báo
- Spaced Repetition nâng cao
- AI Recommendation
- Learning Analytics
- Teacher Dashboard
- Classroom
- Nhiều dạng Quiz
- Thống kê học tập