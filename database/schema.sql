-- ============================================================
-- WordMate Database Schema
-- MySQL 8.0+ / MariaDB 10.3+
-- Engine: InnoDB
-- Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ============================================================

CREATE DATABASE IF NOT EXISTS wordmate
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE wordmate;

-- ============================================================
-- 1. users
-- Thông tin tài khoản người dùng.
-- ============================================================
CREATE TABLE users (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(50)     NOT NULL,
    email           VARCHAR(100)    NOT NULL,
    password        VARCHAR(255)    NOT NULL,
    fullname        VARCHAR(100)    DEFAULT NULL,
    avatar          VARCHAR(255)    DEFAULT NULL,
    role            ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    roadmap_id      BIGINT          DEFAULT NULL,
    streak          INT             NOT NULL DEFAULT 0,
    last_study_date DATE            DEFAULT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX uk_users_username (username),
    UNIQUE INDEX uk_users_email    (email),
    INDEX idx_users_role           (role),
    INDEX idx_users_roadmap_id     (roadmap_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================================
-- 2. roadmaps
-- Lộ trình học tập (Basic, TOEIC, Phrasal Verb, ...).
-- ============================================================
CREATE TABLE roadmaps (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255)    NOT NULL,
    description     TEXT            DEFAULT NULL,
    image           VARCHAR(255)    DEFAULT NULL,
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    sort_order      INT             NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_roadmaps_is_active  (is_active),
    INDEX idx_roadmaps_sort_order (sort_order)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================================
-- 3. topics
-- Chủ đề / bài học trong một Roadmap.
-- Quan hệ: Roadmap 1 ---- n Topic
-- ============================================================
CREATE TABLE topics (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    roadmap_id      BIGINT UNSIGNED NOT NULL,
    name            VARCHAR(255)    NOT NULL,
    description     TEXT            DEFAULT NULL,
    image           VARCHAR(255)    DEFAULT NULL,
    sort_order      INT             NOT NULL DEFAULT 0,
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_topics_roadmap_id (roadmap_id),
    INDEX idx_topics_sort_order (sort_order),
    INDEX idx_topics_is_active  (is_active),

    CONSTRAINT fk_topics_roadmap
        FOREIGN KEY (roadmap_id) REFERENCES roadmaps (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================================
-- 4. vocabularies
-- Từ vựng thuộc một Topic.
-- Quan hệ: Topic 1 ---- n Vocabulary
-- ============================================================
CREATE TABLE vocabularies (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    topic_id        BIGINT UNSIGNED NOT NULL,
    word            VARCHAR(255)    NOT NULL,
    pronunciation   VARCHAR(255)    DEFAULT NULL,
    part_of_speech  ENUM('noun', 'verb', 'adjective', 'adverb',
                         'preposition', 'phrasal_verb', 'idiom', 'other')
                                    NOT NULL DEFAULT 'other',
    meaning         TEXT            NOT NULL,
    example         TEXT            DEFAULT NULL,
    example_meaning TEXT            DEFAULT NULL,
    audio           VARCHAR(255)    DEFAULT NULL,
    image           VARCHAR(255)    DEFAULT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX uk_vocabularies_topic_word (topic_id, word),
    INDEX idx_vocabularies_word             (word),
    INDEX idx_vocabularies_topic_id         (topic_id),
    INDEX idx_vocabularies_part_of_speech   (part_of_speech),

    CONSTRAINT fk_vocabularies_topic
        FOREIGN KEY (topic_id) REFERENCES topics (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================================
-- 5. user_vocabularies
-- Trạng thái học từ vựng của mỗi người dùng (Spaced Repetition).
-- Quan hệ: Users 1 ---- n User_Vocabularies
--          Vocabularies 1 ---- n User_Vocabularies
-- ============================================================
CREATE TABLE user_vocabularies (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    vocabulary_id   BIGINT UNSIGNED NOT NULL,
    status          ENUM('new', 'learning', 'mastered')
                                    NOT NULL DEFAULT 'new',
    review_count    INT             NOT NULL DEFAULT 0,
    last_reviewed_at TIMESTAMP      NULL DEFAULT NULL,
    next_review_at  TIMESTAMP       NULL DEFAULT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX uk_user_vocabularies (user_id, vocabulary_id),
    INDEX idx_user_vocabularies_user_id        (user_id),
    INDEX idx_user_vocabularies_vocabulary_id  (vocabulary_id),
    INDEX idx_user_vocabularies_status         (status),
    INDEX idx_user_vocabularies_next_review    (next_review_at),

    CONSTRAINT fk_user_vocabularies_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_user_vocabularies_vocabulary
        FOREIGN KEY (vocabulary_id) REFERENCES vocabularies (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================================
-- 6. quiz_attempts
-- Một lần làm Quiz của người dùng.
-- Quan hệ: Users 1 ---- n Quiz_Attempts
-- ============================================================
CREATE TABLE quiz_attempts (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    score           DECIMAL(5,2)    NOT NULL DEFAULT 0.00,
    total_questions INT             NOT NULL DEFAULT 0,
    correct_answers INT             NOT NULL DEFAULT 0,
    duration        INT             NOT NULL DEFAULT 0 COMMENT 'Thời gian làm bài (giây)',
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_quiz_attempts_user_id    (user_id),
    INDEX idx_quiz_attempts_created_at (created_at),

    CONSTRAINT fk_quiz_attempts_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================================
-- 7. quiz_answers
-- Chi tiết từng câu trả lời trong một Quiz.
-- Quan hệ: Quiz_Attempts 1 ---- n Quiz_Answers
--          Vocabularies   1 ---- n Quiz_Answers
-- ============================================================
CREATE TABLE quiz_answers (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    quiz_attempt_id BIGINT UNSIGNED NOT NULL,
    vocabulary_id   BIGINT UNSIGNED NOT NULL,
    user_answer     VARCHAR(255)    NOT NULL,
    correct_answer  VARCHAR(255)    NOT NULL,
    is_correct      TINYINT(1)      NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_quiz_answers_quiz_attempt_id (quiz_attempt_id),
    INDEX idx_quiz_answers_vocabulary_id   (vocabulary_id),

    CONSTRAINT fk_quiz_answers_attempt
        FOREIGN KEY (quiz_attempt_id) REFERENCES quiz_attempts (id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_quiz_answers_vocabulary
        FOREIGN KEY (vocabulary_id) REFERENCES vocabularies (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================================
-- 8. ai_conversations
-- Cuộc hội thoại AI của người dùng.
-- Quan hệ: Users 1 ---- n AI_Conversations
-- ============================================================
CREATE TABLE ai_conversations (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    title           VARCHAR(255)    DEFAULT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_ai_conversations_user_id (user_id),

    CONSTRAINT fk_ai_conversations_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================================
-- 9. ai_messages
-- Tin nhắn trong một cuộc hội thoại AI.
-- Quan hệ: AI_Conversations 1 ---- n AI_Messages
-- ============================================================
CREATE TABLE ai_messages (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT UNSIGNED NOT NULL,
    role            ENUM('user', 'assistant')
                                    NOT NULL,
    content         TEXT            NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_ai_messages_conversation_id (conversation_id),
    INDEX idx_ai_messages_role            (role),

    CONSTRAINT fk_ai_messages_conversation
        FOREIGN KEY (conversation_id) REFERENCES ai_conversations (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;