# Review Task M1-T3 — Tạo Database Schema

**Người review**: Cline (AI Assistant)  
**Ngày**: 2026-07-29  
**File review**: `database/schema.sql`  
**Task gốc**: M1-T3 (docs/task.md, dòng 184–258)

---

## 1. Những phần đã đúng

### Database
- ✅ Đã tạo DATABASE `wordmate` với `CHARACTER SET utf8mb4` và `COLLATE utf8mb4_unicode_ci`.
- ✅ Sử dụng `USE wordmate;` để chọn database.

### Engine & Charset (tất cả 9 bảng)
- ✅ Tất cả 9 bảng đều có `ENGINE = InnoDB`.
- ✅ Tất cả 9 bảng đều có `DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci`.

### Bảng `users`
- ✅ Có đủ các cột: id, username, email, password, fullname, avatar, role, roadmap_id, streak, last_study_date, created_at, updated_at.
- ✅ `id` là `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`.
- ✅ `username` là `VARCHAR(50) NOT NULL` + UNIQUE INDEX.
- ✅ `email` là `VARCHAR(100) NOT NULL` + UNIQUE INDEX.
- ✅ `password` là `VARCHAR(255) NOT NULL`.
- ✅ `role` là `ENUM('user','admin') NOT NULL DEFAULT 'user'`.
- ✅ `streak` là `INT NOT NULL DEFAULT 0`.
- ✅ `last_study_date` là `DATE DEFAULT NULL`.
- ✅ `created_at` / `updated_at` với `DEFAULT CURRENT_TIMESTAMP` / `ON UPDATE CURRENT_TIMESTAMP`.
- ✅ INDEX trên `role` (idx_users_role).
- ✅ INDEX trên `roadmap_id` (idx_users_roadmap_id).

### Bảng `roadmaps`
- ✅ Có đủ các cột: id, name, description, image, is_active, sort_order, created_at, updated_at.
- ✅ `name` là `VARCHAR(255) NOT NULL`.
- ✅ `is_active` là `TINYINT(1) NOT NULL DEFAULT 1` (tương đương TRUE).
- ✅ `sort_order` là `INT NOT NULL DEFAULT 0`.

### Bảng `topics`
- ✅ Có đủ các cột: id, roadmap_id, name, description, image, sort_order, is_active, created_at, updated_at.
- ✅ `roadmap_id` là `BIGINT UNSIGNED NOT NULL`.
- ✅ `name` là `VARCHAR(255) NOT NULL`.
- ✅ INDEX trên `roadmap_id` (idx_topics_roadmap_id).
- ✅ FOREIGN KEY `fk_topics_roadmap` → `roadmaps(id)` với `ON DELETE CASCADE ON UPDATE CASCADE`.

### Bảng `vocabularies`
- ✅ Có đủ các cột: id, topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image, created_at, updated_at.
- ✅ `topic_id` là `BIGINT UNSIGNED NOT NULL`.
- ✅ `word` là `VARCHAR(255) NOT NULL`.
- ✅ `part_of_speech` là `ENUM('noun','verb','adjective','adverb','preposition','phrasal_verb','idiom','other')`.
- ✅ `meaning` là `TEXT NOT NULL`.
- ✅ UNIQUE INDEX `uk_vocabularies_topic_word` trên `(topic_id, word)`.
- ✅ INDEX trên `word` (idx_vocabularies_word).
- ✅ INDEX trên `topic_id` (idx_vocabularies_topic_id).
- ✅ FOREIGN KEY `fk_vocabularies_topic` → `topics(id)` với `ON DELETE CASCADE ON UPDATE CASCADE`.

### Bảng `user_vocabularies`
- ✅ Có đủ các cột: id, user_id, vocabulary_id, status, review_count, last_reviewed_at, next_review_at, created_at, updated_at.
- ✅ `user_id` là `BIGINT UNSIGNED NOT NULL`.
- ✅ `vocabulary_id` là `BIGINT UNSIGNED NOT NULL`.
- ✅ `status` là `ENUM('new','learning','mastered') NOT NULL DEFAULT 'new'`.
- ✅ `review_count` là `INT NOT NULL DEFAULT 0`.
- ✅ UNIQUE INDEX `uk_user_vocabularies` trên `(user_id, vocabulary_id)`.
- ✅ INDEX trên `user_id` (idx_user_vocabularies_user_id).
- ✅ INDEX trên `status` (idx_user_vocabularies_status).
- ✅ INDEX trên `next_review_at` (idx_user_vocabularies_next_review).
- ✅ FOREIGN KEY `fk_user_vocabularies_user` → `users(id)` với `ON DELETE CASCADE ON UPDATE CASCADE`.
- ✅ FOREIGN KEY `fk_user_vocabularies_vocabulary` → `vocabularies(id)` với `ON DELETE CASCADE ON UPDATE CASCADE`.

### Bảng `quiz_attempts`
- ✅ Có đủ các cột: id, user_id, score, total_questions, correct_answers, duration, created_at.
- ✅ `user_id` là `BIGINT UNSIGNED NOT NULL`.
- ✅ INDEX trên `user_id` (idx_quiz_attempts_user_id).
- ✅ FOREIGN KEY `fk_quiz_attempts_user` → `users(id)` với `ON DELETE CASCADE ON UPDATE CASCADE`.

### Bảng `quiz_answers`
- ✅ Có đủ các cột: id, quiz_attempt_id, vocabulary_id, user_answer, correct_answer, is_correct, created_at.
- ✅ `quiz_attempt_id` là `BIGINT UNSIGNED NOT NULL`.
- ✅ `vocabulary_id` là `BIGINT UNSIGNED NOT NULL`.
- ✅ INDEX trên `quiz_attempt_id` (idx_quiz_answers_quiz_attempt_id).
- ✅ FOREIGN KEY `fk_quiz_answers_attempt` → `quiz_attempts(id)` với `ON DELETE CASCADE ON UPDATE CASCADE`.
- ✅ FOREIGN KEY `fk_quiz_answers_vocabulary` → `vocabularies(id)` với `ON DELETE CASCADE ON UPDATE CASCADE`.

### Bảng `ai_conversations`
- ✅ Có đủ các cột: id, user_id, title, created_at, updated_at.
- ✅ `user_id` là `BIGINT UNSIGNED NOT NULL`.
- ✅ INDEX trên `user_id` (idx_ai_conversations_user_id).
- ✅ FOREIGN KEY `fk_ai_conversations_user` → `users(id)` với `ON DELETE CASCADE ON UPDATE CASCADE`.

### Bảng `ai_messages`
- ✅ Có đủ các cột: id, conversation_id, role, content, created_at.
- ✅ `conversation_id` là `BIGINT UNSIGNED NOT NULL`.
- ✅ `role` là `ENUM('user','assistant') NOT NULL`.
- ✅ `content` là `TEXT NOT NULL`.
- ✅ INDEX trên `conversation_id` (idx_ai_messages_conversation_id).
- ✅ FOREIGN KEY `fk_ai_messages_conversation` → `ai_conversations(id)` với `ON DELETE CASCADE ON UPDATE CASCADE`.

### Unique Constraints (Acceptance Criteria #4)
- ✅ `UNIQUE(username)` — uk_users_username
- ✅ `UNIQUE(email)` — uk_users_email
- ✅ `UNIQUE(user_id, vocabulary_id)` — uk_user_vocabularies
- ✅ `UNIQUE(topic_id, word)` — uk_vocabularies_topic_word

### Indexes (Acceptance Criteria #5)
- ✅ INDEX trên `email` (uk_users_email là UNIQUE INDEX)
- ✅ INDEX trên `role` (idx_users_role)
- ✅ INDEX trên `roadmap_id` (idx_users_roadmap_id)
- ✅ INDEX trên `topic_id` (idx_vocabularies_topic_id, idx_topics_roadmap_id)
- ✅ INDEX trên `word` (idx_vocabularies_word)
- ✅ INDEX trên `user_id` (idx_user_vocabularies_user_id, idx_quiz_attempts_user_id, idx_ai_conversations_user_id)
- ✅ INDEX trên `status` (idx_user_vocabularies_status)
- ✅ INDEX trên `next_review_at` (idx_user_vocabularies_next_review)
- ✅ INDEX trên `conversation_id` (idx_ai_messages_conversation_id)
- ✅ INDEX trên `quiz_attempt_id` (idx_quiz_answers_quiz_attempt_id)

---

## 2. Những điểm khác biệt

### 2.1. Thiếu FOREIGN KEY trên `users.roadmap_id`

- **Bảng**: `users`
- **Cột**: `roadmap_id`
- **Yêu cầu trong Task**: `roadmap_id (FK → roadmaps.id, nullable)` — dòng 207 của task.md
- **Hiện tại**: Chỉ có INDEX `idx_users_roadmap_id(roadmap_id)`, **không có** ràng buộc FOREIGN KEY.
- **Mức độ ảnh hưởng**: **Critical**
- **Khuyến nghị sửa**: Thêm `CONSTRAINT fk_users_roadmap FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE SET NULL ON UPDATE CASCADE` (vì roadmap_id là nullable, nên dùng `ON DELETE SET NULL` thay vì `CASCADE`).

### 2.2. Kiểu dữ liệu `users.roadmap_id` không khớp với khóa chính tham chiếu

- **Bảng**: `users`
- **Cột**: `roadmap_id`
- **Yêu cầu trong Task**: Là FK tham chiếu đến `roadmaps.id` (có kiểu `BIGINT UNSIGNED`).
- **Hiện tại**: `roadmap_id BIGINT DEFAULT NULL` — kiểu `BIGINT` (có dấu), không phải `BIGINT UNSIGNED`.
- **Mức độ ảnh hưởng**: **Critical** (sẽ gây lỗi `Cannot add foreign key constraint` khi cố gắng thêm FK vì kiểu dữ liệu không khớp).
- **Khuyến nghị sửa**: Đổi thành `BIGINT UNSIGNED DEFAULT NULL`.

---

## 3. Những điểm còn thiếu

### 3.1. FOREIGN KEY `users.roadmap_id → roadmaps.id`

Như đã nêu ở mục 2.1, ràng buộc FK này hoàn toàn không có trong schema.

---

## 4. Những điểm thừa (nếu có)

Các index bổ sung không nằm trong yêu cầu của Task M1-T3 nhưng không gây hại và có thể có lợi cho hiệu suất truy vấn:

| Bảng | Index thêm | Ghi chú |
|------|-----------|---------|
| `roadmaps` | `idx_roadmaps_is_active` | Có thể hữu ích cho filter |
| `roadmaps` | `idx_roadmaps_sort_order` | Có thể hữu ích cho sort |
| `topics` | `idx_topics_sort_order` | Có thể hữu ích cho sort |
| `topics` | `idx_topics_is_active` | Có thể hữu ích cho filter |
| `vocabularies` | `idx_vocabularies_part_of_speech` | Có thể hữu ích cho filter |
| `user_vocabularies` | `idx_user_vocabularies_vocabulary_id` | Có thể hữu ích cho JOIN |
| `quiz_attempts` | `idx_quiz_attempts_created_at` | Có thể hữu ích cho sort |
| `quiz_answers` | `idx_quiz_answers_vocabulary_id` | Có thể hữu ích cho JOIN |
| `ai_messages` | `idx_ai_messages_role` | Có thể hữu ích cho filter |

**Mức độ ảnh hưởng**: Minor (không ảnh hưởng đến tính đúng đắn của schema).

Ngoài ra:
- `quiz_attempts.score` dùng `DECIMAL(5,2)` thay vì `INT` như task ngầm định — đây là cải tiến tốt, không phải lỗi.
- `quiz_attempts.duration` có `NOT NULL DEFAULT 0` — task không chỉ rõ, nhưng đây là giá trị mặc định hợp lý.

---

## 5. Đánh giá

### Mức độ hoàn thành: **90%**

**Chi tiết**:
- 9/9 bảng đã được tạo đầy đủ ✅
- ENGINE, CHARSET, COLLATE đúng cho tất cả bảng ✅
- 9/10 FOREIGN KEY đã được định nghĩa (thiếu 1) ❌
- 4/4 UNIQUE constraints đã được định nghĩa ✅
- 10/10 INDEX theo yêu cầu đã được định nghĩa ✅
- Kiểu dữ liệu của `users.roadmap_id` không khớp với khóa tham chiếu ❌

### Đối chiếu Acceptance Criteria

| # | Tiêu chí | Kết quả |
|---|---------|---------|
| 1 | Script tạo database và 9 bảng thành công | ✅ Đạt |
| 2 | Tất cả bảng ENGINE=InnoDB, CHARSET=utf8mb4 | ✅ Đạt |
| 3 | Foreign key đầy đủ: ON DELETE CASCADE, ON UPDATE CASCADE | ❌ **Không đạt** (thiếu FK `users.roadmap_id`) |
| 4 | Unique constraint trên email, username, user_id+vocabulary_id, topic_id+word | ✅ Đạt |
| 5 | Index trên các cột: email, role, roadmap_id, topic_id, word, user_id, status, next_review_at, conversation_id, quiz_attempt_id | ✅ Đạt |

---

## 6. Kết luận

**Task M1-T3 chưa đạt yêu cầu.**

### Các điểm cần sửa

1. **Thêm FOREIGN KEY** cho `users.roadmap_id` tham chiếu đến `roadmaps(id)`:
   - Sử dụng `ON DELETE SET NULL ON UPDATE CASCADE` (vì cột cho phép NULL).
   
2. **Sửa kiểu dữ liệu** của `users.roadmap_id` từ `BIGINT` thành `BIGINT UNSIGNED` để khớp với kiểu của `roadmaps.id`.

> **Lưu ý**: Theo yêu cầu của task, tôi **không được tự ý sửa** file `database/schema.sql`. Các điểm cần sửa chỉ được liệt kê ở trên để developer thực hiện.