# Architecture Document - WordMate

## Overview

WordMate là nền tảng học từ vựng tiếng Anh cá nhân hóa tích hợp AI Assistant hỗ trợ học tập.

Hệ thống được xây dựng theo mô hình Client-Server với kiến trúc REST API.

Mục tiêu:

- Học từ vựng theo lộ trình
- Flashcard + Writing Exercise
- Quiz ôn tập theo SRS
- Sổ tay từ vựng cá nhân
- AI Assistant hỗ trợ học tập
- Theo dõi Streak

---

# High-Level Architecture

```mermaid
flowchart TD

User[User]

Frontend[React Frontend]

Backend[Node.js Express API]

DB[(MySQL Database)]

AI[OpenAI API]

User --> Frontend

Frontend --> Backend

Backend --> DB

Backend --> AI