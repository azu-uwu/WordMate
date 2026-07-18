# WordMate Constitution

## Core Principles

### I. Simplicity First (YAGNI)
WordMate là dự án MVP cá nhân hóa, không phải hệ thống doanh nghiệp quy mô lớn. Mọi quyết định kỹ thuật PHẢI ưu tiên giải pháp đơn giản nhất có thể đáp ứng yêu cầu, tránh over-engineering. Không được thêm thư viện, framework, hoặc tầng trừu tượng (abstraction layer) nếu không có nhu cầu rõ ràng đã được nêu trong spec/plan. Frontend PHẢI dùng Vanilla JavaScript (ES6+) + Bootstrap 5 + Tailwind CSS — không thêm framework nặng (React/Vue/Angular) trừ khi có amendment thay đổi nguyên tắc này. Backend PHẢI dùng Node.js (Express.js), Database PHẢI dùng SQLite.

### II. Separation of Concerns
Logic nghiệp vụ cốt lõi (thuật toán Spaced Repetition/SM-2, quy tắc chuyển trạng thái learning/mastered, tính Streak) PHẢI được tách biệt hoàn toàn khỏi tầng giao diện (UI/DOM manipulation). Logic này phải nằm trong các module/service độc lập, có thể test mà không cần khởi tạo giao diện hay trình duyệt đầy đủ. Điều này đảm bảo thuật toán SRS có thể được kiểm thử, sửa đổi, và tái sử dụng (ví dụ giữa web và mobile trong tương lai) mà không ảnh hưởng đến UI.

### III. Core-Flow Testing (NON-NEGOTIABLE cho luồng chính)
Không bắt buộc TDD nghiêm ngặt toàn dự án, nhưng các luồng nghiệp vụ cốt lõi sau đây PHẢI có test tự động trước khi được xem là hoàn thành: (1) Đăng ký/Đăng nhập, (2) Luồng học từ mới (Flashcard → Mastered/Continue → Bài tập viết → Lưu Sổ tay), (3) Thuật toán SRS cập nhật trạng thái từ sau Quiz, (4) Tính Streak (tăng/reset). Các tính năng phụ (Menu cá nhân, đổi lộ trình, cài đặt) có thể kiểm thử thủ công nếu thời gian hạn chế, nhưng phải được ghi chú rõ trong tasks.md.

### IV. Resilient External Integrations
Mọi tích hợp phụ thuộc dịch vụ bên ngoài (đặc biệt là AI Assistant qua API LLM) PHẢI có xử lý lỗi tường minh: timeout, rate-limit, lỗi mạng đều phải hiển thị thông báo thân thiện cho người dùng thay vì để ứng dụng treo hoặc crash (theo Edge Case đã định nghĩa trong spec.md). API key của dịch vụ AI PHẢI được lưu và sử dụng only ở backend (proxy pattern) — không bao giờ được lộ ra frontend. Backend PHẢI áp dụng rate-limiting cho endpoint AI để tránh lạm dụng/chi phí phát sinh ngoài kiểm soát.

### V. Offline-First Reliability
Vì ứng dụng cam kết hoạt động offline cho các tính năng học từ mới/flashcard (SC-007: 100% hoạt động offline khi đã cache), mọi thay đổi dữ liệu khi offline PHẢI được lưu cục bộ (IndexedDB/SQLite) trước, sau đó đồng bộ lên server theo cơ chế batch upsert khi có mạng trở lại. Xung đột dữ liệu khi đồng bộ (concurrent edit) PHẢI có chiến lược giải quyết rõ ràng (ví dụ: last-write-wins theo timestamp) được ghi trong plan.md, không được để mặc định không xử lý.

## Security & Data Requirements

- Mật khẩu người dùng PHẢI được hash bằng bcrypt (không lưu plaintext hay dùng thuật toán hash yếu như MD5/SHA1 trần).
- Xác thực PHẢI dùng JWT với access token (thời gian sống ngắn) + refresh token (thời gian sống dài hơn, có khả năng revoke).
- Toàn bộ input từ người dùng (đặc biệt là câu hỏi gửi tới AI Assistant, từ khóa tìm kiếm Sổ tay) PHẢI được validate/sanitize trước khi xử lý hoặc lưu database, để tránh injection.
- Không lưu trữ thông tin nhạy cảm (API key, secret) trong mã nguồn frontend hoặc commit vào git — PHẢI dùng biến môi trường (.env, không commit).

## Development Workflow

- Mỗi tính năng PHẢI đi qua đủ quy trình Speckit: specify → clarify (khuyến khích) → plan → tasks → implement, không bỏ qua bước plan đối với các thay đổi ảnh hưởng kiến trúc hoặc schema.
- Trước khi implement, PHẢI kiểm tra tasks.md đã được review là hợp lý về thứ tự phụ thuộc (dependency order) — đặc biệt các task liên quan schema database phải đi trước task dùng dữ liệu đó.
- Khi phát hiện độ phức tạp phát sinh vượt quá nguyên tắc Simplicity First (ví dụ cần thêm thư viện mới), PHẢI ghi rõ lý do (justification) trong plan.md tại phần Constitution Check, không được âm thầm thêm vào code.

## Governance

Bản Constitution này có quyền cao nhất, vượt trên mọi quyết định trong spec.md, plan.md, và tasks.md của từng feature. Khi có xung đột giữa một nguyên tắc MUST ở đây và một quyết định kỹ thuật khác, nguyên tắc trong Constitution PHẢI được ưu tiên — nếu cần thay đổi, phải sửa Constitution qua một lần chạy `/speckit-constitution` riêng, có ghi rõ lý do và version mới, không được diễn giải lại ngầm trong lúc plan/implement.

Mọi thay đổi (amendment) đối với Constitution PHẢI cập nhật số phiên bản theo semantic versioning: MAJOR khi loại bỏ/thay đổi ngược nguyên tắc cốt lõi, MINOR khi thêm nguyên tắc mới, PATCH khi chỉ sửa câu chữ/làm rõ nghĩa. Mọi lần chạy `/speckit-analyze` hoặc `/speckit-converge` PHẢI đối chiếu với bản Constitution mới nhất.

**Version**: 1.0.0 | **Ratified**: 2026-07-08 | **Last Amended**: 2026-07-08