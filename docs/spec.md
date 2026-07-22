# Software Specification: WordMate - Ứng dụng học từ vựng thông minh

**Version**: 1.0
**Created**: 2026-07-08
**Last Updated**: 2026-07-22
**Status**: Approved

---

## 1. Tổng quan (Overview)

WordMate là nền tảng học từ vựng tiếng Anh cá nhân hóa, giúp người dùng học từ mới theo lộ trình bài bản, ôn tập theo phương pháp lặp lại ngắt quãng (Spaced Repetition), lưu trữ sổ tay từ vựng riêng, có sự hỗ trợ liên tục từ Trợ lý AI và hệ thống Quản trị viên tinh gọn.

---

## 2. User Roles & Permissions

### 2.1. Học viên (`role = 'user'`)

Người học tiếng Anh ở mọi cấp độ (Cơ bản, luyện thi TOEIC, Phrasal Verb & Idiom).

**Quyền:**
- Đăng ký / Đăng nhập tài khoản
- Quản lý thông tin cá nhân (hồ sơ, mật khẩu)
- Chọn / Đổi lộ trình học tập
- Chọn chủ đề và học từ vựng qua Flashcard + Bài tập viết
- Làm bài Quiz ôn tập từ vựng
- Quản lý Sổ tay từ vựng cá nhân (xem, tìm kiếm, ôn lại từ)
- Xem chuỗi ngày học liên tiếp (Streak)
- Sử dụng Trợ lý AI trên mọi trang
- Đăng xuất tài khoản

### 2.2. Quản trị viên (`role = 'admin'`)
Quản trị viên chịu trách nhiệm quản lý dữ liệu và vận hành hệ thống.

**Quyền:**
- Đăng nhập hệ thống quản trị.
- Quản lý Roadmaps (CRUD).
- Quản lý Topics (CRUD).
- Quản lý Vocabularies (CRUD).
- Quản lý trạng thái hiển thị (`is_active`).
- Quản lý thứ tự hiển thị (`sort_order`).
- Truy cập Admin Dashboard.

**Không thuộc phạm vi của Admin:**
- Không sử dụng giao diện học Flashcard.
- Không làm Quiz.
- Không sử dụng Sổ tay từ vựng.
- Không sử dụng AI Assistant dưới vai trò người học.

---

## 3. Functional Requirements (FR)

### 3.1. Authentication & Account Management

| Mã | Mô tả | Mức độ |
|----|-------|--------|
| FR-001 | Hệ thống PHẢI cho phép người dùng đăng ký tài khoản mới bằng email và mật khẩu. Tài khoản mới được khởi tạo với `role = 'user'` mặc định và `streak = 0`. | MUST |
| FR-002 | Hệ thống PHẢI cho phép người dùng đăng nhập bằng email và mật khẩu đã đăng ký. | MUST |
| FR-003 | Hệ thống PHẢI xác thực người dùng qua JWT (JSON Web Token) cho mọi API yêu cầu xác thực. | MUST |
| FR-004 | Hệ thống PHẢI phân quyền truy cập dựa trên `role` (user/admin). API quản trị chỉ cho phép `role = 'admin'`. | MUST |
| FR-005 | Hệ thống PHẢI cho phép người dùng đổi mật khẩu. | MUST |
| FR-006 | Hệ thống PHẢI cho phép người dùng đăng xuất. | MUST |
| FR-007 | Hệ thống PHẢI kiểm tra validation đầu vào: email đúng định dạng, password tối thiểu 8 ký tự, không cho phép trùng email. | MUST |

### 3.2. Onboarding (Chọn lộ trình & Chủ đề)

| Mã | Mô tả | Mức độ |
|----|-------|--------|
| FR-008 | Hệ thống PHẢI bắt buộc người dùng mới chọn Lộ trình học tập (Cơ bản, TOEIC, Phrasal Verb & Idiom) tại lần đăng nhập đầu tiên. | MUST |
| FR-009 | Hệ thống PHẢI hiển thị danh sách Chủ đề (Topics) thuộc Lộ trình đã chọn để người dùng chọn học. | MUST |
| FR-010 | Hệ thống PHẢI cho phép người dùng đổi Lộ trình học tập bất kỳ lúc nào trong trang Profile/Cài đặt. | MUST |
| FR-011 | Hệ thống PHẢI tự động cập nhật danh sách Chủ đề trên trang chủ khi người dùng đổi Lộ trình. | MUST |
| FR-012 | Hệ thống PHẢI giữ nguyên từ vựng trong Sổ tay khi người dùng đổi Lộ trình (chỉ thay đổi danh sách Chủ đề hiển thị). | MUST |

### 3.3. Học từ vựng (Flashcard + Luyện viết)

| Mã | Mô tả | Mức độ |
|----|-------|--------|
| FR-013 | Hệ thống PHẢI hiển thị Flashcard với mặt trước: `word`, `pronunciation`, `audio`, `image`; mặt sau: `part_of_speech`, `meaning`, `example`, `example_meaning`. | MUST |
| FR-014 | Hệ thống PHẢI hỗ trợ hiệu ứng lật thẻ (flip animation) khi người dùng bấm vào Flashcard hoặc phím `Space`. | MUST |
| FR-015 | Hệ thống PHẢI cung cấp 2 lựa chọn sau khi xem mặt sau Flashcard: "Đã thuộc" (mastered) và "Tiếp tục" (chuyển sang luyện viết). | MUST |
| FR-016 | Khi người dùng bấm "Đã thuộc", hệ thống PHẢI tạo/cập nhật bản ghi `user_vocabularies` với `status = 'mastered'`, tăng `review_count` và chuyển sang từ tiếp theo. | MUST |
| FR-017 | Khi người dùng bấm "Tiếp tục", hệ thống PHẢI chuyển sang bài tập luyện viết: người dùng nhập từ dựa vào gợi ý nghĩa/ví dụ. | MUST |
| FR-018 | Khi hoàn thành bài tập luyện viết, hệ thống PHẢI lưu/cập nhật `user_vocabularies` với `status = 'learning'`, tính toán `next_review_at`, cập nhật `last_study_date` và tăng `streak`. | MUST |
| FR-019 | Hệ thống PHẢI hiển thị màn hình tổng kết khi học hết từ trong Chủ đề (số từ đã học, số từ đã thuộc, số từ đã lưu Sổ tay). | MUST |
| FR-020 | Hệ thống PHẢI hỗ trợ phím tắt: `Space` (lật thẻ), `ArrowRight` (Đã thuộc), `ArrowLeft` (Tiếp tục/Chưa thuộc). | SHOULD |

### 3.4. Quiz Ôn tập

| Mã | Mô tả | Mức độ |
|----|-------|--------|
| FR-021 | Hệ thống PHẢI tự động lọc từ vựng từ `user_vocabularies` có `status IN ('new', 'learning')` hoặc `next_review_at <= NOW()` để tạo bài Quiz. | MUST |
| FR-022 | Hệ thống PHẢI tạo bài Quiz trắc nghiệm (multiple choice, điền từ, v.v.) từ danh sách từ đã lọc. | MUST |
| FR-023 | Hệ thống PHẢI lưu chi tiết lượt làm Quiz vào bảng `quiz_attempts` và chi tiết từng câu trả lời vào `quiz_answers`. | MUST |
| FR-024 | Khi trả lời đúng, hệ thống PHẢI cập nhật thông tin ôn tập của từ vựng theo thuật toán Spaced Repetition bằng cách cập nhật `review_count`, `last_reviewed_at` và tính toán lại `next_review_at`. | MUST |
| FR-025 | Khi trả lời sai, hệ thống PHẢI hiển thị đáp án đúng và giải thích, đồng thời cập nhật lại `review_count` và `next_review_at` theo quy tắc Spaced Repetition. | MUST |
| FR-026 | Hệ thống PHẢI hiển thị màn hình kết quả sau khi hoàn thành Quiz: điểm số, số từ đã master, số từ cần ôn lại. | MUST |
| FR-027 | Hệ thống PHẢI cho phép người dùng tiếp tục Quiz từ câu chưa làm nếu thoát giữa chừng. | SHOULD |

### 3.5. Sổ tay từ vựng (Vocabulary Notebook)

| Mã | Mô tả | Mức độ |
|----|-------|--------|
| FR-028 | Hệ thống PHẢI hiển thị Sổ tay từ vựng cá nhân với danh sách từ được phân loại theo `status`: `new` → `learning` → `mastered`. | MUST |
| FR-029 | Hệ thống PHẢI hiển thị tổng số từ đang ôn tập. | MUST |
| FR-030 | Hệ thống PHẢI cung cấp thanh tìm kiếm nhanh (search bar) lọc danh sách theo từ gốc (`word`). | MUST |
| FR-031 | Hệ thống PHẢI hiển thị chi tiết từ vựng khi bấm vào một từ: `word`, `meaning`, `pronunciation`, `part_of_speech`, `example`, `example_meaning`, `status`, `review_count`, lịch sử ôn tập. | MUST |
| FR-032 | Hệ thống PHẢI cho phép người dùng bấm "Ôn lại" để chuyển từ `mastered` về `learning` và đưa vào hàng đợi Quiz. | MUST |

### 3.6. Streak (Chuỗi ngày học)

| Mã | Mô tả | Mức độ |
|----|-------|--------|
| FR-033 | Hệ thống PHẢI hiển thị chuỗi ngày học liên tiếp (Streak) trên trang chủ. | MUST |
| FR-034 | Hệ thống PHẢI tăng Streak khi người dùng hoàn thành ít nhất một hoạt động học tập trong ngày (học từ mới hoặc làm Quiz). | MUST |
| FR-035 | Hệ thống PHẢI reset Streak về 0 nếu người dùng bỏ lỡ một ngày liên tiếp. | MUST |
| FR-036 | Hệ thống PHẢI đảm bảo mỗi ngày chỉ được tính một lần vào Streak. | MUST |

### 3.7. Trợ lý AI (AI Assistant)

| Mã | Mô tả | Mức độ |
|----|-------|--------|
| FR-037 | Hệ thống PHẢI hiển thị popup chat AI cố định góc dưới màn hình trên TẤT CẢ các trang giao diện người học. | MUST |
| FR-038 | Hệ thống PHẢI cho phép người dùng gửi tin nhắn và nhận phản hồi từ AI. | MUST |
| FR-039 | Hệ thống PHẢI lưu lịch sử trò chuyện theo từng phiên (`ai_conversations`) và từng tin nhắn (`ai_messages`) với `role = 'user'` hoặc `role = 'assistant'`. | MUST |
| FR-040 | Hệ thống PHẢI cho phép người dùng chọn hoặc tạo hội thoại mới. | MUST |
| FR-041 | Hệ thống PHẢI gọi API LLM thông qua Backend (không gọi trực tiếp từ Frontend). | MUST |
| FR-042 | Hệ thống PHẢI hiển thị thông báo lỗi thân thiện khi AI bị lỗi API hoặc timeout. | MUST |

### 3.8. Admin Dashboard

| Mã | Mô tả | Mức độ |
|----|-------|--------|
| FR-043 | Hệ thống PHẢI cung cấp giao diện Admin Dashboard riêng biệt, tách biệt với giao diện học viên. | MUST |
| FR-044 | Hệ thống PHẢI chặn truy cập Admin Dashboard nếu `role != 'admin'` (trả về 403 Forbidden). | MUST |
| FR-045 | Hệ thống PHẢI cho phép Admin CRUD (Thêm, Xem, Sửa, Xóa) Lộ trình (Roadmaps) với các trường: `name`, `description`, `is_active`, `sort_order`. | MUST |
| FR-046 | Hệ thống PHẢI cho phép Admin CRUD Chủ đề (Topics) thuộc một Lộ trình với các trường: `name`, `description`, `is_active`, `sort_order`. | MUST |
| FR-047 | Hệ thống PHẢI cho phép Admin CRUD Từ vựng (Vocabularies) với đầy đủ trường: `word`, `pronunciation`, `part_of_speech`, `meaning`, `example`, `example_meaning`, `audio`, `image`, gắn với `topic_id`. | MUST |
| FR-048 | Hệ thống PHẢI cho phép Admin bật/tắt hiển thị (is_active) của Lộ trình và Chủ đề. | MUST |
| FR-049 | Hệ thống PHẢI cho phép Admin sắp xếp thứ tự (sort_order) của Lộ trình và Chủ đề. | MUST |

### 3.9. UI/UX

| Mã | Mô tả | Mức độ |
|----|-------|--------|
| FR-050 | Hệ thống PHẢI hiển thị hiệu ứng Skeleton Loading hoặc Spinner cho mọi thao tác chờ API. | MUST |
| FR-051 | Hệ thống PHẢI hiển thị Toast Notification cho phản hồi thao tác, tự động ẩn sau 3 giây, không dùng `alert()`. | MUST |
| FR-052 | Hệ thống PHẢI hiển thị icon Avatar/Trang cá nhân cố định góc trên bên trái trên các trang chính. | MUST |
| FR-053 | Hệ thống PHẢI cung cấp menu Trang cá nhân gồm: Cài đặt tài khoản (đổi mật khẩu, đăng xuất), Lộ trình học tập (xem/đổi lộ trình). | MUST |

---

## 4. Non-functional Requirements (NFR)

| Mã | Mô tả | Mức độ |
|----|-------|--------|
| NFR-001 | Hệ thống PHẢI sử dụng màu chủ đạo Indigo-600 (#4F46E5) cho giao diện học viên (Tailwind CSS). | MUST |
| NFR-002 | Hệ thống PHẢI sử dụng tông màu tối trung tính (Slate/Dark) cho giao diện Admin (Bootstrap). | MUST |
| NFR-003 | Mã màu trạng thái: Success = Emerald-500 (#10B981), Warning = Amber-500 (#F59E0B), Danger = Rose-500 (#F43F5E). | MUST |
| NFR-004 | Font chữ chủ đạo: Inter / Roboto / system-ui, đảm bảo hiển thị chuẩn ký tự phiên âm IPA. | MUST |
| NFR-005 | Thời gian phản hồi AI Assistant KHÔNG ĐƯỢC vượt quá 3 giây cho 95% requests. | MUST |
| NFR-006 | Thời gian tải trang (cold start) KHÔNG ĐƯỢC vượt quá 3 giây trên thiết bị trung bình. | MUST |
| NFR-007 | Password PHẢI được hash bằng bcrypt trước khi lưu vào database. | MUST |
| NFR-008 | JWT Access Token có thời hạn tối đa 24 giờ. | MUST |
| NFR-009 | API AI chỉ được gọi thông qua Backend (không exposed API key ra Frontend). | MUST |
| NFR-010 | Người dùng chỉ được truy cập dữ liệu thuộc tài khoản của mình. | MUST |
| NFR-011 | Hệ thống PHẢI sử dụng Prepared Statements để chống SQL Injection. | MUST |
| NFR-012 | Hệ thống PHẢI hỗ trợ Chrome, Firefox, Safari, Edge phiên bản mới nhất 2 năm. | MUST |
| NFR-013 | Giao diện PHẢI bằng tiếng Việt, nội dung từ vựng Anh-Việt. | MUST |
| NFR-014 | Hệ thống PHẢI sử dụng định dạng JSON thống nhất cho mọi API response. | MUST |
| NFR-015 | Hệ thống PHẢI trả về HTTP Status Code chính xác: 200 (thành công), 201 (tạo mới), 400 (sai dữ liệu), 401 (chưa đăng nhập), 403 (không quyền), 404 (không tìm thấy), 409 (trùng dữ liệu), 500 (lỗi máy chủ). | MUST |

---

## 5. User Stories & Acceptance Criteria

### 5.1. Priority P0 (Must-have - Core Learning Loop)

#### US-01: Đăng ký tài khoản
**Vai trò**: Học viên
**Mô tả**: Người dùng mới muốn đăng ký tài khoản để sử dụng ứng dụng.

**Acceptance Criteria:**
1. **Given** người dùng chưa có tài khoản và truy cập trang đăng ký, **When** họ nhập email hợp lệ, password >= 8 ký tự và xác nhận password, **Then** hệ thống tạo tài khoản thành công với `role = 'user'`, `streak = 0` và chuyển đến trang chọn Lộ trình.
2. **Given** người dùng nhập email đã tồn tại, **When** họ bấm đăng ký, **Then** hệ thống trả về lỗi 409 và thông báo email đã được sử dụng.
3. **Given** người dùng nhập password < 8 ký tự, **When** họ bấm đăng ký, **Then** hệ thống trả về lỗi 400 và thông báo password phải tối thiểu 8 ký tự.
4. **Given** người dùng nhập email không đúng định dạng, **When** họ bấm đăng ký, **Then** hệ thống trả về lỗi 400 và thông báo email không hợp lệ.

#### US-02: Đăng nhập
**Vai trò**: Học viên
**Mô tả**: Người dùng đã có tài khoản muốn đăng nhập vào hệ thống.

**Acceptance Criteria:**
1. **Given** người dùng đã có tài khoản, **When** họ nhập đúng email và password, **Then** hệ thống xác thực thành công, trả về JWT token và chuyển đến trang chủ (nếu đã chọn Lộ trình) hoặc trang chọn Lộ trình (nếu lần đầu).
2. **Given** người dùng nhập sai email hoặc password, **When** họ bấm đăng nhập, **Then** hệ thống trả về lỗi 401 và thông báo "Email hoặc mật khẩu không đúng".
3. **Given** người dùng chưa đăng nhập, **When** họ truy cập API yêu cầu xác thực, **Then** hệ thống trả về lỗi 401.

#### US-03: Học từ vựng qua Flashcard
**Vai trò**: Học viên
**Mô tả**: Người dùng chọn một Chủ đề để học từ vựng qua Flashcard và bài tập luyện viết.

**Acceptance Criteria:**
1. **Given** người dùng ở trang chủ, **When** họ bấm vào một Chủ đề, **Then** hiển thị Flashcard từ đầu tiên với mặt trước (word, pronunciation, audio, image).
2. **Given** đang xem mặt trước Flashcard, **When** bấm vào thẻ hoặc phím `Space`, **Then** thẻ lật sang mặt sau (part_of_speech, meaning, example, example_meaning).
3. **Given** đang xem mặt sau Flashcard, **When** bấm "Đã thuộc", **Then** hệ thống tạo/cập nhật `user_vocabularies` với `status = 'mastered'`, tăng `review_count`, chuyển sang từ tiếp theo.
4. **Given** đang xem mặt sau Flashcard, **When** bấm "Tiếp tục", **Then** chuyển sang bài tập luyện viết: hiển thị gợi ý (nghĩa/ví dụ), người dùng gõ từ.
5. **Given** hoàn thành bài tập luyện viết, **When** bấm nộp bài, **Then** hệ thống lưu `user_vocabularies` với `status = 'learning'`, cập nhật `last_study_date`, tăng `streak`, chuyển sang từ tiếp theo.
6. **Given** học hết từ trong Chủ đề, **When** hoàn thành từ cuối, **Then** hiển thị màn hình tổng kết (số từ đã học, số từ đã thuộc, số từ đã lưu Sổ tay).

#### US-04: Làm Quiz ôn tập
**Vai trò**: Học viên
**Mô tả**: Người dùng làm bài Quiz trắc nghiệm để ôn tập các từ chưa thuộc.

**Acceptance Criteria:**
1. **Given** người dùng có từ trong `user_vocabularies` với `status IN ('new', 'learning')` hoặc `next_review_at <= NOW()`, **When** vào tab "Ôn tập", **Then** hệ thống tự động tạo bài Quiz từ danh sách các từ này.
2. **Given** đang làm Quiz, **When** trả lời đúng, **Then** hệ thống cập nhật SRS: tăng `review_count`, cập nhật `last_reviewed_at` và `next_review_at`.
3. **Given** đang làm Quiz, **When** trả lời sai, **Then** hệ thống hiển thị đáp án đúng và giải thích, reset `review_count` về 0 và cập nhật `next_review_at` về ngày hiện tại.
4. **Given** hoàn thành Quiz, **When** xem kết quả, **Then** hiển thị điểm số, số từ đã master, số từ cần ôn lại, lưu dữ liệu vào `quiz_attempts` và `quiz_answers`.
5. **Given** người dùng thoát Quiz giữa chừng, **When** vào lại "Ôn tập", **Then** Quiz tiếp tục từ câu chưa làm.

### 5.2. Priority P1 (Important)

#### US-05: Quản lý Sổ tay từ vựng
**Vai trò**: Học viên
**Mô tả**: Người dùng xem, tìm kiếm và quản lý từ vựng cá nhân trong Sổ tay.

**Acceptance Criteria:**
1. **Given** người dùng có từ trong Sổ tay, **When** vào tab "Sổ tay từ vựng", **Then** hiển thị tổng số từ đang ôn tập và danh sách chi tiết (word, meaning, status, review_count) được phân loại theo `status`.
2. **Given** đang xem danh sách Sổ tay, **When** gõ từ khóa vào thanh tìm kiếm, **Then** lọc danh sách real-time theo `word`.
3. **Given** bấm vào một từ trong Sổ tay, **When** xem chi tiết, **Then** hiển thị đầy đủ: word, meaning, pronunciation, part_of_speech, example, example_meaning, status, review_count, lịch sử ôn tập.
4. **Given** từ ở trạng thái `mastered`, **When** bấm "Ôn lại", **Then** từ chuyển về `learning` và đưa vào hàng đợi Quiz.

#### US-06: Trợ lý AI
**Vai trò**: Học viên
**Mô tả**: Người dùng sử dụng Trợ lý AI để hỏi về ngữ pháp, ngữ cảnh, ví dụ từ vựng.

**Acceptance Criteria:**
1. **Given** người dùng ở bất kỳ trang nào, **When** bấm icon AI góc màn hình, **Then** popup chat mở ra.
2. **Given** popup chat AI mở, **When** người dùng nhập câu hỏi và gửi, **Then** AI trả lời phản hồi, lưu vào `ai_conversations` và `ai_messages`.
3. **Given** người dùng muốn tạo cuộc hội thoại mới, **When** bấm "Hội thoại mới", **Then** hệ thống tạo phiên chat mới.
4. **Given** popup AI mở, **When** bấm đóng, **Then** popup thu nhỏ về icon, lịch sử chat session hiện tại được lưu.
5. **Given** AI bị lỗi API hoặc timeout, **When** người dùng gửi câu hỏi, **Then** hiển thị thông báo lỗi thân thiện, gợi ý thử lại sau.

#### US-07: Admin CRUD Lộ trình & Chủ đề
**Vai trò**: Quản trị viên
**Mô tả**: Admin quản lý danh sách Lộ trình và Chủ đề học tập.

**Acceptance Criteria:**
1. **Given** admin đăng nhập và vào Admin Dashboard, **When** vào mục "Roadmaps", **Then** hiển thị danh sách Lộ trình với các trường: name, description, is_active, sort_order.
2. **Given** admin ở mục "Roadmaps", **When** bấm "Thêm mới" và nhập đầy đủ thông tin, **Then** Lộ trình mới được tạo và hiển thị trong danh sách.
3. **Given** admin ở mục "Roadmaps", **When** bấm "Sửa" trên một Lộ trình và cập nhật thông tin, **Then** Lộ trình được cập nhật.
4. **Given** admin ở mục "Roadmaps", **When** bấm "Xóa" trên một Lộ trình, **Then** Lộ trình bị xóa (hoặc ẩn nếu có ràng buộc dữ liệu).
5. **Given** admin ở mục "Topics", **When** thêm Chủ đề mới, **Then** Chủ đề phải được gắn với một Lộ trình cụ thể.
6. **Given** người dùng có `role != 'admin'`, **When** truy cập route Admin, **Then** nhận lỗi 403 Forbidden.

#### US-08: Admin CRUD Từ vựng
**Vai trò**: Quản trị viên
**Mô tả**: Admin quản lý kho từ vựng toàn hệ thống.

**Acceptance Criteria:**
1. **Given** admin vào mục "Vocabularies", **When** xem danh sách, **Then** hiển thị danh sách từ vựng kèm Chủ đề và Lộ trình tương ứng.
2. **Given** admin bấm "Thêm mới", **When** nhập đầy đủ: word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image và chọn topic_id, **Then** từ vựng mới được tạo.
3. **Given** admin bấm "Sửa" trên một từ, **When** cập nhật thông tin, **Then** từ vựng được cập nhật.
4. **Given** admin bấm "Xóa" trên một từ, **When** xác nhận xóa, **Then** từ vựng bị xóa khỏi hệ thống.

### 5.3. Priority P2 (Nice-to-have)

#### US-09: Xem & Đổi Lộ trình
**Vai trò**: Học viên
**Mô tả**: Người dùng xem thông tin cá nhân và đổi Lộ trình học tập.

**Acceptance Criteria:**
1. **Given** người dùng ở trang chủ, **When** bấm avatar góc trên trái, **Then** hiển thị menu: Cài đặt tài khoản, Lộ trình học tập.
2. **Given** vào "Lộ trình học tập", **When** chọn Lộ trình khác, **Then** hệ thống cập nhật `roadmap_id` của user, trang chủ load danh sách Chủ đề mới.
3. **Given** vào "Cài đặt tài khoản", **When** đổi mật khẩu thành công, **Then** hiển thị thông báo thành công.
4. **Given** vào "Cài đặt tài khoản", **When** bấm "Đăng xuất", **Then** chuyển về trang đăng nhập, xóa JWT token.

#### US-10: Streak (Chuỗi ngày học)
**Vai trò**: Học viên
**Mô tả**: Người dùng xem chuỗi ngày học liên tiếp để duy trì động lực.

**Acceptance Criteria:**
1. **Given** người dùng học hôm nay (hoàn thành học từ mới hoặc Quiz), **When** vào trang chủ, **Then** streak hiển thị tăng 1 so với hôm qua.
2. **Given** người dùng không học hôm qua, **When** học hôm nay, **Then** streak reset về 1.
3. **Given** streak > 0, **When** hiển thị trang chủ, **Then** hiển thị số ngày streak và icon khuyến khích.

---

## 6. Business Rules

### 6.1. Spaced Repetition (SRS) Rules

- Một từ chuyển sang trạng thái `mastered` khi:
  - `review_count >= 5` hoặc
- Khi ở trạng thái `mastered`, từ không tự động xuất hiện trong Quiz thông thường.
- Người dùng có thể đưa từ từ `mastered` về `learning` bằng chức năng "Ôn lại".

### 6.2. Quiz Generation Rules

- Mỗi phiên Quiz tối đa 20 câu hỏi.
- Nếu số lượng từ cần ôn tập nhỏ hơn 20 thì lấy toàn bộ.
- Nếu lớn hơn 20 thì ưu tiên:
  1. Các từ đã đến hạn ôn tập (`next_review_at <= NOW()`).
  2. Các từ có `review_count` thấp hơn.
- Một từ chỉ xuất hiện tối đa một lần trong một phiên Quiz.

### 6.3. Streak Rules

- Một ngày được tính là "đã học" khi người dùng hoàn thành ít nhất một trong các hoạt động:
  - Hoàn thành học một từ mới (bài tập luyện viết).
  - Hoàn thành ít nhất một câu hỏi Quiz.
- Streak tăng thêm 1 nếu người dùng học ở ngày kế tiếp.
- Nếu bỏ lỡ một ngày liên tiếp, streak reset về 0 khi quay lại học.
- Mỗi ngày chỉ được tính một lần vào streak.

### 6.4. AI Assistant Rules

- AI Assistant chỉ được gọi thông qua Backend (API key lưu ở Backend).
- Backend ghi nhớ tối đa 10 tin nhắn gần nhất trong một phiên chat để duy trì ngữ cảnh.
- Nếu người dùng đang học một từ hoặc một Chủ đề cụ thể, hệ thống tự động truyền ngữ cảnh đó cho AI.
- Lịch sử chat được lưu lại để xem nhưng không bắt buộc nạp lại toàn bộ vào lần chat tiếp theo.

### 6.5. Admin Access Rules

- Tất cả route `/api/admin/*` đều phải kiểm tra `req.user.role === 'admin'`.
- Nếu không phải admin, trả về 403 Forbidden.
- Admin Dashboard giao diện riêng biệt, không lẫn với giao diện học viên.

### 6.6. Data Integrity Rules

- Username/Email không được để trống.
- Email đúng định dạng.
- Password tối thiểu 8 ký tự.
- Các khóa ngoại (`roadmap_id`, `topic_id`, `vocabulary_id`) phải tồn tại trong cơ sở dữ liệu.
- Không cho phép tạo dữ liệu trùng với các trường có ràng buộc UNIQUE.
- Các thao tác cập nhật nhiều bảng phải sử dụng Transaction.

---

## 7. Input/Output Data Specifications

### 7.1. Đăng ký

| Thành phần | Chi tiết |
|------------|----------|
| **Input** | `email` (string, email format), `password` (string, min 8 chars), `confirm_password` (string) |
| **Output (success)** | `{ success: true, message: "Đăng ký thành công", data: { user_id, email } }` |
| **Output (error)** | `{ success: false, message: "Email đã tồn tại" }` (409) hoặc `{ success: false, message: "Validation failed" }` (400) |

### 7.2. Đăng nhập

| Thành phần | Chi tiết |
|------------|----------|
| **Input** | `email` (string), `password` (string) |
| **Output (success)** | `{ success: true, data: { token, user: { id, email, role, roadmap_id, streak } } }` |
| **Output (error)** | `{ success: false, message: "Email hoặc mật khẩu không đúng" }` (401) |

### 7.3. Chọn/Đổi Lộ trình

| Thành phần | Chi tiết |
|------------|----------|
| **Input** | `roadmap_id` (integer) |
| **Output (success)** | `{ success: true, data: { user_id, roadmap_id } }` |
| **Output (error)** | `{ success: false, message: "Roadmap không tồn tại" }` (404) |

### 7.4. Học Flashcard

| Thành phần | Chi tiết |
|------------|----------|
| **Input (bắt đầu)** | `topic_id` (integer) |
| **Output** | `{ success: true, data: { session_id, vocabulary: [{ id, word, pronunciation, audio_url, image_url, part_of_speech, meaning, example, example_meaning }] } }` |
| **Input (đã thuộc)** | `vocabulary_id` (integer), `session_id` (integer) |
| **Output (đã thuộc)** | `{ success: true, data: { status: "mastered", next_vocabulary } }` |
| **Input (tiếp tục)** | `vocabulary_id` (integer), `session_id` (integer) |
| **Output (tiếp tục)** | `{ success: true, data: { prompt: { meaning, example }, vocabulary_id } }` |

### 7.5. Luyện viết

| Thành phần | Chi tiết |
|------------|----------|
| **Input** | `vocabulary_id` (integer), `session_id` (integer), `user_input` (string) |
| **Output (success)** | `{ success: true, data: { is_correct, status: "learning", next_vocabulary, streak_updated } }` |
| **Output (error)** | `{ success: false, message: "Từ không đúng" }` |

### 7.6. Quiz

| Thành phần | Chi tiết |
|------------|----------|
| **Input (bắt đầu)** | Không có input (hệ thống tự lọc từ) |
| **Output (bắt đầu)** | `{ success: true, data: { quiz_id, questions: [{ id, vocabulary_id, word, meaning, options[], correct_answer }] } }` |
| **Input (trả lời)** | `quiz_id` (integer), `question_id` (integer), `user_answer` (string) |
| **Output (trả lời)** | `{ success: true, data: { is_correct, correct_answer, explanation, review_count_updated } }` |
| **Input (hoàn thành)** | `quiz_id` (integer) |
| **Output (hoàn thành)** | `{ success: true, data: { score, total_questions, correct_answers, words_mastered, words_to_review } }` |

### 7.7. Sổ tay từ vựng

| Thành phần | Chi tiết |
|------------|----------|
| **Input** | `search` (string, optional), `status` (string, optional), `page` (integer, optional) |
| **Output** | `{ success: true, data: { total, items: [{ id, word, meaning, pronunciation, part_of_speech, example, example_meaning, status, review_count, next_review_at }] } }` |

### 7.8. AI Assistant

| Thành phần | Chi tiết |
|------------|----------|
| **Input** | `message` (string), `conversation_id` (integer, optional), `context` (object, optional: { topic_id, vocabulary_id }) |
| **Output** | `{ success: true, data: { conversation_id, reply: "string", role: "assistant" } }` |

### 7.9. Admin - CRUD Roadmaps

| Thành phần | Chi tiết |
|------------|----------|
| **Input (create)** | `name` (string), `description` (string), `is_active` (boolean), `sort_order` (integer) |
| **Input (update)** | `name` (string, optional), `description` (string, optional), `is_active` (boolean, optional), `sort_order` (integer, optional) |
| **Output** | `{ success: true, data: { id, name, description, is_active, sort_order } }` |

### 7.10. Admin - CRUD Topics

| Thành phần | Chi tiết |
|------------|----------|
| **Input (create)** | `roadmap_id` (integer), `name` (string), `description` (string), `is_active` (boolean), `sort_order` (integer) |
| **Output** | `{ success: true, data: { id, roadmap_id, name, description, is_active, sort_order } }` |

### 7.11. Admin - CRUD Vocabularies

| Thành phần | Chi tiết |
|------------|----------|
| **Input (create)** | `topic_id` (integer), `word` (string), `pronunciation` (string), `part_of_speech` (string), `meaning` (string), `example` (string), `example_meaning` (string), `audio` (file/url), `image` (file/url) |
| **Output** | `{ success: true, data: { id, topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio_url, image_url } }` |

---

## 8. Business Flows

### 8.1. Luồng Đăng ký / Đăng nhập

```
1. Người dùng truy cập trang Đăng ký / Đăng nhập
2. [Đăng ký]:
   a. Nhập email, password, confirm password
   b. Hệ thống validate dữ liệu đầu vào (email format, password >= 8 chars, confirm match)
   c. Hệ thống kiểm tra email đã tồn tại chưa
   d. Nếu chưa tồn tại: hash password bằng bcrypt, tạo user với role='user', streak=0
   e. Trả về JWT token, chuyển đến trang chọn Lộ trình (Onboarding)
3. [Đăng nhập]:
   a. Nhập email, password
   b. Hệ thống kiểm tra email có tồn tại không
   c. So sánh password với password_hash (bcrypt)
   d. Nếu đúng: tạo JWT token, kiểm tra roadmap_id của user
      - Nếu roadmap_id = null: chuyển đến trang chọn Lộ trình
      - Nếu roadmap_id != null: chuyển đến trang chủ
4. [Đăng xuất]:
   a. Xóa JWT token (Frontend)
   b. Chuyển về trang đăng nhập
```

### 8.2. Luồng Chọn Roadmap (Onboarding & Đổi Lộ trình)

```
1. Hệ thống hiển thị danh sách Lộ trình có sẵn (Cơ bản, TOEIC, Phrasal Verb & Idiom)
2. Người dùng chọn một Lộ trình
3. Hệ thống cập nhật roadmap_id trong bảng users
4. Hệ thống load danh sách Chủ đề thuộc Lộ trình đã chọn
5. Chuyển đến trang chủ với danh sách Chủ đề tương ứng
```

### 8.3. Luồng Chọn Topic & Học Flashcard

```
1. Trang chủ hiển thị danh sách Chủ đề thuộc Lộ trình hiện tại
2. Người dùng bấm vào một Chủ đề
3. Hệ thống tạo StudySession mới
4. Hiển thị Flashcard từ đầu tiên:
   - Mặt trước: word, pronunciation, audio, image
   - Người dùng bấm/lật thẻ (Space) → mặt sau: part_of_speech, meaning, example, example_meaning
5. Người dùng chọn:
   a. "Đã thuộc" (ArrowRight):
      - Tạo/cập nhật user_vocabularies: status = 'mastered', tăng review_count
      - Chuyển sang từ tiếp theo
   b. "Tiếp tục" (ArrowLeft):
      - Chuyển sang bài tập luyện viết
6. Bài tập luyện viết:
   - Hiển thị gợi ý (nghĩa, ví dụ)
   - Người dùng gõ từ cần học
   - Hệ thống kiểm tra kết quả
   - Lưu user_vocabularies: status = 'learning', tính next_review_at
   - Cập nhật last_study_date, tăng streak
   - Chuyển sang từ tiếp theo
7. Khi hết từ: hiển thị màn hình tổng kết
```

### 8.4. Luồng Quiz Ôn tập

```
1. Người dùng vào tab "Ôn tập"
2. Hệ thống truy vấn user_vocabularies:
   - status IN ('new', 'learning')
   - hoặc next_review_at <= NOW()
3. Hệ thống tạo QuizSession mới
4. Áp dụng Quiz Generation Rules (tối đa 20 câu, ưu tiên `review_count` thấp)
5. Hiển thị từng câu hỏi trắc nghiệm:
   - Người dùng chọn đáp án
   - Hệ thống kiểm tra và phản hồi ngay:
     * Đúng: cập nhật SRS (tăng `review_count`, cập nhật `last_reviewed_at`, tính toán `next_review_at`)
     * Sai: hiển thị đáp án đúng, reset `review_count` về 0, cập nhật `next_review_at` về ngày hiện tại
6. Lưu chi tiết vào quiz_answers
7. Khi hoàn thành:
   - Cập nhật QuizSession (total_questions, correct_answers, score)
   - Hiển thị kết quả: điểm số, từ đã master, từ cần ôn lại
```

### 8.5. Luồng Sổ tay từ vựng (Vocabulary Notebook)

```
1. Người dùng vào tab "Sổ tay từ vựng"
2. Hệ thống truy vấn user_vocabularies của user hiện tại
3. Hiển thị:
   - Tổng số từ đang ôn tập
   - Danh sách từ phân loại theo status (new/learning/mastered)
   - Mỗi từ: word, meaning, status, review_count
4. Người dùng có thể:
   a. Tìm kiếm: gõ từ khóa → lọc real-time theo word
   b. Bấm vào từ → xem chi tiết (word, meaning, pronunciation, part_of_speech, example, example_meaning, status, review_count, next_review_at)
   c. Bấm "Ôn lại" trên từ mastered → chuyển về learning, đưa vào hàng đợi Quiz
```

### 8.6. Luồng AI Assistant

```
1. Icon AI cố định góc dưới màn hình trên mọi trang
2. Người dùng bấm icon → popup chat mở ra
3. Hệ thống kiểm tra phiên chat hiện tại (ai_conversations)
   - Nếu chưa có: tạo phiên mới
   - Nếu có: load lịch sử tin nhắn
4. Người dùng nhập câu hỏi → gửi lên Backend
5. Backend:
   - Lấy context (từ/Chủ đề đang học nếu có)
   - Ghép vào prompt
   - Gọi LLM API
   - Lưu tin nhắn user + assistant vào ai_messages
   - Trả về phản hồi cho Frontend
6. Frontend hiển thị phản hồi trong popup chat
7. Người dùng đóng popup → thu nhỏ về icon, lưu lịch sử
```

### 8.7. Luồng Admin Dashboard

```
1. Admin đăng nhập với tài khoản có role = 'admin'
2. Hệ thống kiểm tra role, cho phép truy cập route Admin
3. Admin Dashboard hiển thị với các menu:
   a. Quản lý Roadmaps
   b. Quản lý Topics
   c. Quản lý Vocabularies
4. [Roadmaps]:
   - Danh sách: tên, mô tả, trạng thái, thứ tự
   - CRUD: Thêm, Sửa, Xóa, Bật/tắt is_active, Sắp xếp sort_order
5. [Topics]:
   - Danh sách thuộc Roadmap: tên, mô tả, trạng thái, thứ tự
   - CRUD: Thêm (gắn roadmap_id), Sửa, Xóa, Bật/tắt is_active, Sắp xếp sort_order
6. [Vocabularies]:
   - Danh sách: từ, phát âm, loại từ, nghĩa, Chủ đề, Lộ trình
   - CRUD: Thêm (đầy đủ trường, gắn topic_id), Sửa, Xóa
   - Upload file: audio (mp3), image (jpg/png) → lưu vào /uploads/
7. Người dùng không phải admin → 403 Forbidden
```

---

## 9. Edge Cases

| Tình huống | Cách xử lý |
|------------|------------|
| Người dùng học từ mới nhưng đóng app giữa chừng (chưa bấm "Đã thuộc" hay "Tiếp tục") | Từ đó vẫn ở trạng thái "đang học", tiếp tục từ chỗ dừng khi mở lại |
| Người dùng làm Quiz nhưng thoát giữa chừng | Quiz tiếp tục từ câu chưa làm khi vào lại |
| Người dùng đổi Lộ trình khi đang có từ vựng trong Sổ tay của Lộ trình cũ | Sổ tay giữ nguyên từ vựng cũ, chỉ danh sách Chủ đề trang chủ thay đổi |
| AI Assistant bị lỗi API/timeout | Hiển thị thông báo lỗi thân thiện, gợi ý thử lại sau |
| Streak bị reset do lỗi hệ thống/đổi múi giờ | Có cơ chế khôi phục streak (manual hoặc auto-recover dựa trên log học tập) |
| Người dùng chưa có từ nào để ôn tập | Hiển thị thông báo "Chưa có từ cần ôn tập, hãy học từ mới!" |
| Upload file ảnh/âm thanh thất bại | Hiển thị lỗi, cho phép thử lại, không làm mất dữ liệu các trường khác |

---

## 10. Assumptions

| STT | Giả định |
|-----|----------|
| 1 | Người dùng mục tiêu: Người học tiếng Anh mọi cấp độ (cơ bản, TOEIC, phrasal verb/idiom), chủ yếu dùng mobile/web |
| 2 | Dữ liệu Roadmap, Topic và Vocabulary được seed sẵn trong cơ sở dữ liệu khi khởi tạo ứng dụng |
| 3 | Hệ thống yêu cầu kết nối Internet để sử dụng AI Assistant |
| 4 | Một Vocabulary chỉ thuộc một Topic trong phạm vi MVP |
| 5 | MVP bao gồm 3 lộ trình: Cơ bản, TOEIC, Phrasal verb & Idiom |
| 6 | Giao diện bằng tiếng Việt, nội dung từ vựng Anh-Việt |
| 7 | AI Integration sử dụng API LLM (Gemini) thông qua Backend |
| 8 | SRS Algorithm sử dụng thuật toán SM-2 (SuperMemo 2) đơn giản hóa |