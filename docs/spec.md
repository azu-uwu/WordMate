# Feature Specification: WordMate - Ứng dụng học từ vựng thông minh

**Feature Branch**: `[001-wordmate-vocabulary-app]`

**Created**: 2026-07-08

**Status**: Ready for Planning

**Input**: User description: "Tạo ra một nền tảng học từ vựng cá nhân hóa, giúp người dùng học từ mới theo lộ trình bài bản, ôn tập dựa trên các từ chưa thuộc, lưu trữ sổ tay từ vựng riêng và có sự hỗ trợ liên tục từ Trợ lý AI."

## Assumptions

- MVP không bao gồm Admin Panel.
- Dữ liệu Roadmap, Topic và Vocabulary được seed sẵn.
- Hệ thống yêu cầu kết nối Internet để sử dụng AI Assistant.
- Một Vocabulary chỉ thuộc một Topic trong phạm vi MVP.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Đăng ký/Đăng nhập & Onboarding (Priority: P1)

**Mô tả**: Người dùng mới đăng ký tài khoản, đăng nhập và trải qua quy trình onboarding chọn lộ trình học tập và chủ đề.

**Why this priority**: Đây là bước đầu tiên bắt buộc để người dùng truy cập vào hệ thống. Không có tài khoản thì không thể lưu trữ tiến độ học tập, sổ tay từ vựng, streak, v.v.

**Independent Test**: Có thể test độc lập bằng cách đăng ký tài khoản mới, đăng nhập, chọn lộ trình (Cơ bản/TOEIC/Phrasal verb & Idiom), chọn chủ đề và vào được trang chủ.

**Acceptance Scenarios**:
1. **Given** người dùng chưa có tài khoản, **When** họ đăng ký với email/password hợp lệ, **Then** tài khoản được tạo thành công và chuyển đến trang chọn lộ trình
2. **Given** người dùng đã có tài khoản, **When** họ đăng nhập đúng thông tin, **Then** được chuyển đến trang chủ (nếu đã onboarding) hoặc trang chọn lộ trình (nếu lần đầu)
3. **Given** người dùng mới đăng nhập lần đầu, **When** họ chọn lộ trình "TOEIC" và chủ đề "Part 1 - Photographs", **Then** hệ thống lưu lựa chọn và chuyển đến trang chủ với danh sách chủ đề TOEIC
4. **Given** người dùng đã onboarding xong, **When** họ đăng nhập lần sau, **Then** trực tiếp vào trang chủ với lộ trình bày lộ trình đã chọn

---

### User Story 2 - Học từ mới (Flashcard + Bài tập viết) (Priority: P1)

**Mô tả**: Người dùng chọn một chủ đề, học từ vựng qua flashcard (lật mặt trước/mặt sau), chọn "Mình đã thuộc từ này" để bỏ qua hoặc "Tiếp tục" để làm bài tập viết từ.

**Why this priority**: Đây là tính năng cốt lõi (core learning loop) của ứng dụng. Người dùng học từ mới, hệ thống ghi nhận mức độ thuộc/không thuộc để đưa vào ôn tập sau.

**Independent Test**: Có thể test độc lập bằng cách vào một chủ đề bất kỳ, lật flashcard, bấm "Mình đã thuộc từ này" (từ bị bỏ qua, không vào sổ tay), bấm "Tiếp tục" (làm bài viết, sau đó từ tự động lưu vào sổ tay).

**Acceptance Scenarios**:
1. **Given** người dùng ở trang chủ, **When** bấm vào chủ đề "TOEIC Part 1", **Then** hiển thị flashcard từ đầu tiên (mặt trước: từ tiếng Anh)
2. **Given** đang xem flashcard mặt trước, **When** bấm lật thẻ, **Then** hiển thị mặt sau (nghĩa tiếng Việt, phát âm, ví dụ)
3. **Given** đang xem mặt sau flashcard, **When** bấm "Mình đã thuộc từ này", **Then** từ được đánh dấu "mastered", không lưu vào sổ tay, chuyển sang từ tiếp theo
4. **Given** đang xem mặt sau flashcard, **When** bấm "Tiếp tục", **Then** hiển thị bài tập viết lại từ (gợi ý nghĩa/phát âm, người dùng gõ từ)
5. **Given** hoàn thành bài tập viết, **When** bấm nộp, **Then** từ tự động lưu vào "Sổ tay từ vựng" với trạng thái "đang ôn tập", chuyển từ tiếp theo
6. **Given** học hết từ trong chủ đề, **When** hoàn thành từ cuối, **Then** hiển thị màn hình tổng kết (số từ đã học, số từ đã thuộc, số từ đã lưu sổ tay)

---

### User Story 3 - Ôn tập (Quiz thông minh từ chưa thuộc) (Priority: P1)

**Mô tả**: Hệ thống tự động lọc các từ vựng mà người dùng chưa thuộc (đã làm bài tập viết nhưng chưa master) và tạo bài quiz trắc nghiệm để ôn tập.

**Why this priority**: Tính năng cốt lõi thứ 2 - spaced repetition/ôn tập thông minh dựa trên từ chưa thuộc. Giúp người dùng ghi nhớ lâu dài.

**Independent Test**: Có thể test độc lập bằng cách vào tab "Ôn tập", hệ thống tự tạo quiz từ các từ đang ở trạng thái "đang ôn tập" trong sổ tay, làm quiz, kiểm tra kết quả cập nhật trạng thái từ.

**Acceptance Scenarios**:
1. **Given** người dùng có 10 từ trong sổ tay trạng thái "đang ôn tập", **When** vào tab "Ôn tập", **Then** hệ thống tạo bài quiz 10 câu (mỗi từ 1 câu)
2. **Given** đang làm quiz, **When** trả lời đúng, **Then** từ đó tăng cấp độ nhớ (spaced repetition), có thể chuyển sang "mastered" nếu đủ điều kiện
3. **Given** đang làm quiz, **When** trả lời sai, **Then** từ giữ nguyên hoặc giảm cấp độ nhớ, hiển thị đáp án đúng và giải thích
4. **Given** hoàn thành quiz, **When** xem kết quả, **Then** hiển thị điểm số, số từ đã master, số từ cần ôn lại, cập nhật sổ tay

**Quiz Generation Rules**

- Mỗi phiên Quiz tối đa 20 câu hỏi.
- Nếu số lượng từ cần ôn tập nhỏ hơn 20 thì lấy toàn bộ.
- Nếu lớn hơn 20 thì ưu tiên:
  1. Các từ đã đến hạn ôn tập (next_review_date).
  2. Các từ có SRS level thấp hơn.
- Một từ chỉ xuất hiện tối đa một lần trong một phiên Quiz.

---

### User Story 4 - Sổ tay từ vựng cá nhân (Priority: P1)

**Mô tả**: Nơi lưu trữ toàn bộ từ vựng cá nhân, hiển thị tổng số từ đang ôn tập, danh sách chi tiết, có thanh tìm kiếm.

**Why this priority**: Nơi trung tâm quản lý từ vựng cá nhân, người dùng cần xem lại, tìm kiếm, quản lý từ vựng của mình.

**Independent Test**: Có thể test độc lập bằng cách vào tab "Sổ tay", kiểm tra hiển thị tổng số từ, danh sách từ, tìm kiếm từ khóa, xem chi tiết từ.

**Acceptance Scenarios**:
1. **Given** người dùng có từ trong sổ tay, **When** vào tab "Sổ tay từ vựng", **Then** hiển thị tổng số từ đang ôn tập và danh sách chi tiết (từ, nghĩa, trạng thái, cấp độ nhớ)
2. **Given** đang xem danh sách sổ tay, **When** gõ từ khóa vào thanh tìm kiếm, **Then** lọc danh sách real-time theo từ/nghĩa
3. **Given** bấm vào một từ trong sổ tay, **When** xem chi tiết, **Then** hiển thị đầy đủ: từ, nghĩa, phát âm, ví dụ, trạng thái (mastered/learning), lịch sử ôn tập, cấp độ SRS
4. **Given** từ ở trạng thái "mastered", **When** người dùng muốn ôn lại, **When** bấm nút "Ôn lại", **Then** từ chuyển về "learning" và đưa vào hàng đợi quiz

---

### User Story 5 - Tính năng Streak (Chuỗi ngày học) (Priority: P2)

**Mô tả**: Hiển thị trên trang chủ chuỗi số ngày học liên tiếp, thúc đẩy động lực học hàng ngày.

**Why this priority**: Tính năng gamification quan trọng để retain user, nhưng không phải core learning loop.

**Independent Test**: Có thể test độc lập bằng cách mock date, kiểm tra streak tăng khi học liên tiếp, reset khi bỏ lỡ ngày.

**Acceptance Scenarios**:
1. **Given** người dùng học hôm nay (hoàn thành ít nhất 1 từ), **When** vào trang chủ, **Then** streak hiển thị tăng 1 so với hôm qua
2. **Given** người dùng không học hôm qua, **When** học hôm nay, **Then** streak reset về 1
3. **Given** streak > 0, **When** hiển thị trang chủ, **Then** hiển thị số ngày streak và icon lửa/khuyến khích

**Streak Rules**
- Một ngày được tính là "đã học" khi người dùng hoàn thành ít nhất một trong các hoạt động:
  - Hoàn thành học một từ mới.
  - Hoàn thành ít nhất một câu hỏi Quiz.
- Streak tăng thêm 1 nếu người dùng học ở ngày kế tiếp.
- Nếu bỏ lỡ một ngày liên tiếp, streak reset về 1 khi quay lại học.
- Mỗi ngày chỉ được tính một lần vào streak.

---

### User Story 6 - Trợ lý AI (Universal AI Assistant) (Priority: P1)

**Mô tả**: Popup chat AI cố định góc màn hình, xuất hiện trên mọi trang, hỗ trợ giải đáp ngữ pháp, ngữ cảnh, ví dụ từ vựng.

**Why this priority**: Tính năng độc đáo (USP) của sản phẩm - AI assistant hỗ trợ xuyên suốt hành trình học tập.

**Independent Test**: Có thể test độc lập bằng cách bấm icon AI ở bất kỳ trang nào, nhập câu hỏi, nhận phản hồi AI.

**Acceptance Scenarios**:
1. **Given** người dùng ở bất kỳ trang nào (Trang chủ, Học bài, Sổ tay, Ôn tập), **When** bấm icon AI góc màn hình, **Then** popup chat mở ra
2. **Given** popup chat AI mở, **When** người dùng hỏi "Phân biệt 'make' vs 'do'", **Then** AI trả lời giải thích ngữ pháp, ví dụ
3. **Given** đang học từ "decision", **When** hỏi AI "Cho ví dụ dùng 'decision'", **Then** AI trả lời có ngữ cảnh từ đang học (context-aware)
4. **Given** popup AI mở, **When** bấm đóng, **Then** popup thu nhỏ về icon, giữ lịch sử chat session hiện tại

---

### User Story 7 - Menu Trang cá nhân & Đổi lộ trình (Priority: P2)

**Mô tả**: Icon avatar góc trên trái, bấm vào hiện menu: Cài đặt tài khoản, Lộ trình học tập (cho phép đổi lộ trình bất kỳ lúc nào).

**Why this priority**: Cần thiết cho quản lý tài khoản và linh hoạt đổi lộ trình, nhưng không phải core learning loop.

**Independent Test**: Có thể test độc lập bằng cách bấm avatar, vào cài đặt đổi mật khẩu, vào lộ trình đổi từ TOEIC sang Phrasal verb, kiểm tra trang chủ cập nhật danh sách chủ đề.

**Acceptance Scenarios**:
1. **Given** người dùng ở trang chủ, **When** bấm avatar góc trên trái, **Then** hiển thị menu: Cài đặt tài khoản, Lộ trình học tập
2. **Given** vào "Lộ trình học tập", **When** chọn "Phrasal verb & Idiom", **Then** hệ thống cập nhật lộ trình, trang chủ load danh sách chủ đề Phrasal verb
3. **Given** vào "Cài đặt tài khoản", **When** đổi mật khẩu/đăng xuất, **Then** cập nhật thành công/chuyển về trang đăng nhập

---

### Edge Cases

- **Given** người dùng học từ mới nhưng đóng app giữa chừng (chưa bấm "Tiếp tục" hay "Mình đã thuộc"), **When** mở lại app, **Then** từ đó vẫn ở trạng thái "đang học", tiếp tục từ chỗ dừng
- **Given** người dùng làm quiz ôn tập nhưng thoát giữa chừng, **When** vào lại ôn tập, **Then** quiz tiếp tục từ câu chưa làm hoặc tạo mới tùy logic SRS
- **Given** người dùng đổi lộ trình khi đang có từ vựng trong sổ tay của lộ trình cũ, **When** đổi lộ trình, **Then** sổ tay giữ nguyên từ vựng cũ, chỉ danh sách chủ đề trang chủ thay đổi
- **Given** AI Assistant bị lỗi API/timeout, **When** người dùng hỏi, **Then** hiển thị thông báo lỗi thân thiện, gợi ý thử lại sau
- **Given** streak bị reset do lỗi hệ thống/đổi múi giờ, **When** phát hiện, **Then** có cơ chế khôi phục streak (manual review hoặc auto-recover dựa trên log học tập)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI cho phép người dùng đăng ký tài khoản mới bằng email/mật khẩu
- **FR-002**: Hệ thống PHẢI cho phép người dùng đăng nhập bằng email/mật khẩu đã đăng ký
- **FR-003**: Hệ thống PHẢI bắt buộc người dùng mới chọn lộ trình học tập (Cơ bản, TOEIC, Phrasal verb & Idiom) tại lần đăng nhập đầu tiên
- **FR-004**: Hệ thống PHẢI cho phép người dùng chọn chủ đề học tập trong lộ trình đã chọn
- **FR-005**: Hệ thống PHẢI hiển thị flashcard từ vựng (mặt trước: từ gốc, mặt sau: nghĩa/phát âm/ ví dụ) khi học bài
- **FR-006**: Hệ thống PHẢI cung cấp 2 lựa chọn sau flashcard: "Mình đã thuộc từ này" (bỏ qua, đánh dấu mastered) và "Tiếp tục" (chuyển sang bài tập viết)
- **FR-007**: Hệ thống PHẢI cung cấp bài tập viết lại từ dựa trên gợi ý nghĩa/phát âm khi người dùng chọn "Tiếp tục"
- **FR-008**: Hệ thống PHẢI tự động lưu từ vựng vào Sổ tay từ vựng cá nhân với trạng thái "đang ôn tập" sau khi hoàn thành bài tập viết
- **FR-009**: Hệ thống PHẢI tự động lọc các từ vựng trạng thái "đang ôn tập" để tạo bài Quiz ôn tập
- **FR-010**: Hệ thống PHẢI tạo bài Quiz trắc nghiệm thông minh (multiple choice, điền từ, v.v.) cho các từ cần ôn tập
- **FR-011**: Hệ thống PHẢI cập nhật trạng thái từ vựng (mastered/learning) dựa trên kết quả Quiz theo thuật toán Spaced Repetition (SRS)
Một từ được chuyển sang trạng thái "mastered" khi:

SRS Level >= 5
hoặc
Khoảng cách ôn tập (interval_days) >= 30 ngày.

Khi ở trạng thái mastered, từ sẽ không xuất hiện trong Quiz thông thường.
Người dùng vẫn có thể đưa từ trở lại trạng thái learning bằng chức năng "Ôn lại".
- **FR-012**: Hệ thống PHẢI hiển thị Sổ tay từ vựng với: tổng số từ đang ôn tập, danh sách chi tiết (từ, nghĩa, trạng thái, cấp độ SRS)
- **FR-013**: Hệ thống PHẢI cung cấp thanh tìm kiếm (search bar) lọc real-time từ vựng trong Sổ tay theo từ/nghĩa
- **FR-014**: Hệ thống PHẢI hiển thị chi tiết từ vựng khi bấm vào từ trong Sổ tay (nghĩa, phát âm, ví dụ, trạng thái, lịch sử SRS)
- **FR-015**: Hệ thống PHẢI cho phép người dùng bấm "Ôn lại" để chuyển từ "mastered" về "learning" và đưa vào hàng đợi quiz
- **FR-016**: Hệ thống PHẢI hiển thị Streak (chuỗi ngày học liên tiếp) trên trang chủ, tăng khi học hàng ngày, reset khi bỏ lỡ
- **FR-017**: Hệ thống PHẢI hiển thị icon Trợ lý AI (popup chat) cố định góc màn hình trên TẤT CẢ các trang
- **FR-018**: Hệ thống PHẢI cho phép người dùng chat với AI để hỏi ngữ pháp, ngữ cảnh, ví dụ từ vựng, có context-aware (nhận biết từ đang học)
AI Assistant ghi nhớ tối đa 10 tin nhắn gần nhất trong một phiên chat.
Nếu người dùng đang học một từ hoặc một chủ đề cụ thể, hệ thống sẽ tự động truyền ngữ cảnh đó cho AI.
Khi người dùng đóng trình duyệt hoặc kết thúc phiên đăng nhập, ngữ cảnh chat được lưu lại để xem lịch sử nhưng không bắt buộc nạp lại toàn bộ vào lần chat tiếp theo.
- **FR-019**: Hệ thống PHẢI hiển thị icon Avatar/Trang cá nhân cố định góc trên bên trái trên các trang chính
- **FR-020**: Hệ thống PHẢI cung cấp menu Trang cá nhân gồm: Cài đặt tài khoản (thông tin, mật khẩu, đăng xuất), Lộ trình học tập (xem/đổi lộ trình)
- **FR-021**: Hệ thống PHẢI tự động cập nhật danh sách chủ đề trang chủ khi người dùng đổi lộ trình

### Key Entities

- **User**: Người dùng hệ thống. Thuộc tính: id, email, password_hash, current_roadmap (basic/toeic/phrasal), streak_count, last_study_date, created_at, updated_at
- **Roadmap**: Lộ trình học tập. Thuộc tính: id, code (basic/toeic/phrasal), name, description, order
- **Topic**: Chủ đề/Đề tài học tập thuộc một lộ trình. Thuộc tính: id, roadmap_id, name, description, order, word_count
- **Vocabulary**: Từ vựng thuộc một chủ đề. Thuộc tính: id, topic_id, word, meaning, pronunciation, example, audio_url, image_url, difficulty
- **UserVocabulary**: Từ vựng cá nhân của user (Sổ tay). Thuộc tính: id, user_id, vocabulary_id, status (learning/mastered), srs_level (0-5), next_review_date, review_count, correct_count, created_at, updated_at
- **StudySession**: Phiên học tập. Thuộc tính: id, user_id, topic_id, started_at, completed_at, words_studied, words_mastered, words_continued
- **QuizSession**: Phiên ôn tập. Thuộc tính: id, user_id, started_at, completed_at, total_questions, correct_answers, score
- **QuizAnswer**: Câu trả lời quiz. Thuộc tính: id, quiz_session_id, user_vocabulary_id, user_answer, correct_answer, is_correct, response_time_ms
- **AIChatSession**: Phiên chat AI. Thuộc tính: id, user_id, started_at, context_topic_id (nullable), context_vocabulary_id (nullable)
- **AIChatMessage**: Tin nhắn chat AI. Thuộc tính: id, session_id, role (user/assistant), content, tokens_used, created_at
- **UserSettings**: Cài đặt người dùng. Thuộc tính: user_id, notifications_enabled, sound_enabled, theme (light/dark), auto_play_audio

---
## Security Requirements

- Password phải được hash bằng bcrypt.
- JWT Access Token có thời hạn tối đa 24 giờ.
- API AI chỉ được gọi thông qua Backend.
- Người dùng chỉ được truy cập dữ liệu thuộc tài khoản của mình.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Người dùng mới hoàn thành onboarding (đăng ký → chọn lộ trình → chọn chủ đề) trong **dưới 2 phút**
- **SC-002**: Người dùng học được **ít nhất 10 từ/phiên** trung bình (session completion rate > 70%)
- **SC-003**: Tỷ lệ từ vựng chuyển từ "learning" sang "mastered" sau 3 lần ôn tập (SRS) **> 80%**
- **SC-004**: Streak retention: **> 40%** người dùng duy trì streak ≥ 7 ngày
- **SC-005**: AI Assistant response time **< 3 giây** cho 95% requests
- **SC-006**: App load time (cold start) **< 3 giây** trên thiết bị trung bình
- **SC-007**: User satisfaction (NPS) **> 40** sau 1 tháng sử dụng
- **SC-008**: Daily Active Users (DAU) / Monthly Active Users (MAU) ratio **> 20%**

---

## Assumptions

- **Target users**: Người học tiếng Anh mọi cấp độ (cơ bản, TOEIC, phrasal verb/idiom), chủ yếu dùng mobile/web
- **Tech stack**: Frontend: HTML + JavaScript + Bootstrap + Tailwind CSS; Backend: Node.js; Database: SQLite (local-first, sync later)
- **AI Integration**: Sử dụng API LLM (OpenAI/Anthropic/Gemini) cho AI Assistant, API key lưu ở backend
- **Authentication**: Email/password với JWT token, password hash bằng bcrypt
- **Data storage**: SQLite local-first (IndexedDB/WebSQL cho web, SQLite native cho mobile), sync lên server khi online
- **SRS Algorithm**: Sử dụng thuật toán SM-2 (SuperMemo 2) đơn giản hóa cho spaced repetition
- **Deployment**: Frontend deploy static (Netlify/Vercel), Backend deploy Node.js (Railway/Render/VPS), SQLite file-based
- **Scope**: MVP chỉ bao gồm 3 lộ trình: Cơ bản, TOEIC, Phrasal verb & Idiom. Không có leaderboard, không có social features
- **Browser support**: Chrome, Firefox, Safari, Edge phiên bản mới nhất 2 năm
- **Language**: Giao diện tiếng Việt, nội dung từ vựng Anh-Việt
- **Data seeding**: Dữ liệu từ vựng (vocabulary, topics, roadmaps) được seed sẵn trong SQLite khi init app
- - **Administration**: MVP không bao gồm giao diện quản trị (Admin Panel). Dữ liệu Roadmap, Topic và Vocabulary được seed sẵn trong cơ sở dữ liệu. Việc quản lý dữ liệu được thực hiện trực tiếp bởi nhóm phát triển trong giai đoạn MVP.

---

## Technical Architecture Overview

### Frontend Architecture
- **Framework**: Vanilla JavaScript (ES6+) với Module pattern
- **UI Library**: Bootstrap 5 + Tailwind CSS (utility-first)
- **State Management**: Custom lightweight store (Pub/Sub pattern) + LocalStorage/IndexedDB cache
- **Routing**: Hash-based router (SPA) hoặc native navigation
- **Offline Support**: Service Worker + IndexedDB cache cho vocabulary data, flashcards, quiz questions
- **AI Chat**: WebSocket hoặc polling đến backend proxy cho LLM API

### Backend Architecture
- **Runtime**: Node.js (Express.js hoặc Fastify)
- **Database**: SQLite (better-sqlite3 hoặc Prisma ORM)
- **Auth**: JWT (access token + refresh token), bcrypt password hashing
- **API**: RESTful API cho CRUD, WebSocket cho AI chat streaming
- **Sync**: Endpoint đồng bộ dữ liệu offline (batch upsert UserVocabulary, StudySession, QuizSession)
- **AI Proxy**: Backend proxy request đến LLM API (ẩn API key, rate limiting, context injection)

### Database Schema (SQLite)

```sql
-- Users
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  current_roadmap_id INTEGER DEFAULT 1,
  streak_count INTEGER DEFAULT 0,
  last_study_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Roadmaps
CREATE TABLE roadmaps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL, -- 'basic', 'toeic', 'phrasal'
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0
);

-- Topics
CREATE TABLE topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  roadmap_id INTEGER NOT NULL REFERENCES roadmaps(id),
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0
);

-- Vocabulary (master data)
CREATE TABLE vocabulary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL REFERENCES topics(id),
  word TEXT NOT NULL,
  meaning TEXT NOT NULL,
  pronunciation TEXT,
  example TEXT,
  audio_url TEXT,
  image_url TEXT,
  difficulty INTEGER DEFAULT 1, -- 1-5
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User Vocabulary (Sổ tay cá nhân + SRS)
CREATE TABLE user_vocabulary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  vocabulary_id INTEGER NOT NULL REFERENCES vocabulary(id),
  status TEXT DEFAULT 'learning', -- 'learning', 'mastered'
  srs_level INTEGER DEFAULT 0, -- 0-5 (SM-2)
  ease_factor REAL DEFAULT 2.5,
  interval_days INTEGER DEFAULT 0,
  next_review_date DATE,
  review_count INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  last_reviewed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, vocabulary_id)
);

-- Study Sessions
CREATE TABLE study_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  topic_id INTEGER NOT NULL REFERENCES topics(id),
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  words_studied INTEGER DEFAULT 0,
  words_mastered INTEGER DEFAULT 0,
  words_continued INTEGER DEFAULT 0
);

-- Quiz Sessions
CREATE TABLE quiz_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  score REAL DEFAULT 0
);

-- Quiz Answers
CREATE TABLE quiz_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_session_id INTEGER NOT NULL REFERENCES quiz_sessions(id),
  user_vocabulary_id INTEGER NOT NULL REFERENCES user_vocabulary(id),
  user_answer TEXT,
  correct_answer TEXT,
  is_correct BOOLEAN DEFAULT 0,
  response_time_ms INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AI Chat Sessions
CREATE TABLE ai_chat_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  context_topic_id INTEGER REFERENCES topics(id),
  context_vocabulary_id INTEGER REFERENCES vocabulary(id),
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AI Chat Messages
CREATE TABLE ai_chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL REFERENCES ai_chat_sessions(id),
  role TEXT NOT NULL, -- 'user', 'assistant'
  content TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User Settings
CREATE TABLE user_settings (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  notifications_enabled BOOLEAN DEFAULT 1,
  sound_enabled BOOLEAN DEFAULT 1,
  theme TEXT DEFAULT 'light', -- 'light', 'dark', 'system'
  auto_play_audio BOOLEAN DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_user_vocab_user_status ON user_vocabulary(user_id, status);
CREATE INDEX idx_user_vocab_next_review ON user_vocabulary(user_id, next_review_date);
CREATE INDEX idx_vocab_topic ON vocabulary(topic_id);
CREATE INDEX idx_topics_roadmap ON topics(roadmap_id);
CREATE INDEX idx_study_sessions_user ON study_sessions(user_id, started_at);
CREATE INDEX idx_quiz_sessions_user ON quiz_sessions(user_id, started_at);
CREATE INDEX idx_ai_chat_sessions_user ON ai_chat_sessions(user_id, started_at);
```

### API Endpoints

#### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Đăng xuất (revoke refresh token)

#### User & Profile
- `GET /api/user/profile` - Lấy profile user
- `PUT /api/user/profile` - Cập nhật profile
- `PUT /api/user/password` - Đổi mật khẩu
- `GET /api/user/streak` - Lấy streak info
- `PUT /api/user/roadmap` - Đổi lộ trình học tập

#### Roadmaps & Topics
- `GET /api/roadmaps` - Danh sách lộ trình
- `GET /api/roadmaps/:id/topics` - Danh sách chủ đề theo lộ trình
- `GET /api/topics/:id` - Chi tiết chủ đề
- `GET /api/topics/:id/vocabulary` - Danh sách từ vựng trong chủ đề

#### Learning (Học từ mới)
- `POST /api/learning/session/start` - Bắt đầu phiên học (topic_id)
- `POST /api/learning/session/complete` - Hoàn thành phiên học
- `POST /api/learning/word/mastered` - Đánh dấu từ đã thuộc (bỏ qua)
- `POST /api/learning/word/continue` - Chuyển sang bài tập viết (lưu vào sổ tay)

#### Vocabulary Notebook (Sổ tay)
- `GET /api/vocabulary/notebook` - Danh sách từ vựng cá nhân (có filter, search, pagination)
- `GET /api/vocabulary/notebook/:id` - Chi tiết từ vựng
- `POST /api/vocabulary/notebook/:id/relearn` - Ôn lại từ (mastered → learning)

#### Quiz/Review (Ôn tập)
- `POST /api/quiz/session/start` - Bắt đầu quiz (tự động lấy từ cần ôn)
- `POST /api/quiz/answer` - Gửi câu trả lời
- `POST /api/quiz/session/complete` - Hoàn thành quiz, cập nhật SRS

#### AI Assistant
- `POST /api/ai/chat` - Gửi tin nhắn, nhận phản hồi (streaming hoặc non-streaming)
- `GET /api/ai/history` - Lịch sử chat
- `DELETE /api/ai/session/:id` - Xóa phiên chat

### SRS Algorithm (SM-2 Simplified)

## MVP Scope

### Bắt buộc hoàn thành

- Đăng ký / Đăng nhập
- Chọn lộ trình
- Chọn chủ đề
- Flashcard
- Bài tập viết từ
- Quiz ôn tập
- Sổ tay từ vựng
- Streak
- AI Assistant
- Đổi lộ trình

### Không thuộc MVP

- Leaderboard
- Social Features
- Push Notification
- Multi-device Sync
- Community Sharing

```javascript
// Khi user trả lời quiz cho một từ
function updateSRS(userVocab, isCorrect, responseTimeMs) {
  if (isCorrect) {
    userVocab.correct_count++;
    userVocab.review_count++;
    
    if (userVocab.srs_level === 0) {
      userVocab.interval_days = 1;
      userVocab.srs_level = 1;
    } else if (userVocab.srs_level === 1) {
      userVocab.interval_days = 6;
      userVocab.srs_level = 2;
    } else {
      // SM-2 formula simplified
      userVocab.ease_factor = Math.max(1.3, userVocab.ease_factor + 0.1);
      userVocab.interval_days = Math.round(userVocab.interval_days * userVocab.ease_factor);
      userVocab.srs_level = Math.min(5, userVocab.srs_level + 1);
    }
    
    // Check if mastered (level 5 hoặc interval > 30 days)
    if (userVocab.srs_level >= 5 || userVocab.interval_days >= 30) {
      userVocab.status = 'mastered';
    }
  } else {
    // Sai: reset về srs_level nhưng giữ nguyên ease_factor hoặc giảm nhẹ
    userVocab.srs_level = 0;
    userVocab.interval_days = 0; // Ôn tập lại ngay trong ngày hoặc phiên tiếp theo
    userVocab.ease_factor = Math.max(1.3, userVocab.ease_factor - 0.2);
    userVocab.status = 'learning';
  }
  
  // Tính toán ngày tiếp theo cần ôn tập
  let nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + userVocab.interval_days);
  userVocab.next_review_date = nextDate.toISOString().split('T')[0];
  userVocab.last_reviewed_at = new Date().toISOString();
  userVocab.updated_at = new Date().toISOString();
  
  return userVocab;
}