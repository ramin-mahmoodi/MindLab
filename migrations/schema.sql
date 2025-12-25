-- MindLab Complete Database Schema
-- Run this file to create all tables from scratch

-- ==========================================
-- Core Tables
-- ==========================================

-- Tests table
CREATE TABLE IF NOT EXISTS tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    warning TEXT,
    slug TEXT UNIQUE,
    category TEXT NOT NULL DEFAULT 'General',
    analysis_type TEXT NOT NULL DEFAULT 'direct',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Scales for tests (subscales)
CREATE TABLE IF NOT EXISTS scales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    UNIQUE(test_id, name)
);

-- Questions
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    UNIQUE(test_id, order_index)
);

-- Question to Scale mapping
CREATE TABLE IF NOT EXISTS question_scales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    scale_id INTEGER NOT NULL,
    weight REAL DEFAULT 1.0,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (scale_id) REFERENCES scales(id) ON DELETE CASCADE,
    UNIQUE(question_id, scale_id)
);

-- Options for questions
CREATE TABLE IF NOT EXISTS options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    order_index INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Cutoffs for interpretation
CREATE TABLE IF NOT EXISTS cutoffs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scale_id INTEGER NOT NULL,
    min_score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    label TEXT NOT NULL,
    description TEXT,
    FOREIGN KEY (scale_id) REFERENCES scales(id) ON DELETE CASCADE
);

-- ==========================================
-- User Session Tables
-- ==========================================

-- User test sessions
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_uid TEXT NOT NULL,
    test_id INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    finished_at TEXT,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- User answers
CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    option_id INTEGER NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE CASCADE,
    UNIQUE(session_id, question_id)
);

-- Results per scale
CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    scale_id INTEGER NOT NULL,
    score REAL NOT NULL,
    interpretation TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (scale_id) REFERENCES scales(id) ON DELETE CASCADE
);

-- ==========================================
-- Analysis System Tables
-- ==========================================

-- Analysis templates for interpretations
CREATE TABLE IF NOT EXISTS analysis_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER NOT NULL,
    scale_id INTEGER,
    level_label TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    details TEXT NOT NULL,
    recommendations TEXT NOT NULL,
    disclaimer TEXT NOT NULL DEFAULT 'این نتیجه جایگزین ارزیابی تخصصی توسط روان‌شناس یا روان‌پزشک نیست.',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    FOREIGN KEY (scale_id) REFERENCES scales(id) ON DELETE CASCADE
);

-- Result reports (stores full JSON report)
CREATE TABLE IF NOT EXISTS result_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL UNIQUE,
    report_json TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

-- Risk rules for safety detection
CREATE TABLE IF NOT EXISTS risk_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER NOT NULL,
    condition_expr TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'warning',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- ==========================================
-- Indexes for Performance
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_uid);
CREATE INDEX IF NOT EXISTS idx_sessions_test ON sessions(test_id);
CREATE INDEX IF NOT EXISTS idx_answers_session ON answers(session_id);
CREATE INDEX IF NOT EXISTS idx_questions_test ON questions(test_id);
CREATE INDEX IF NOT EXISTS idx_options_question ON options(question_id);
CREATE INDEX IF NOT EXISTS idx_scales_test ON scales(test_id);
CREATE INDEX IF NOT EXISTS idx_results_session ON results(session_id);
CREATE INDEX IF NOT EXISTS idx_analysis_templates_test ON analysis_templates(test_id);
CREATE INDEX IF NOT EXISTS idx_risk_rules_test ON risk_rules(test_id);
CREATE INDEX IF NOT EXISTS idx_tests_slug ON tests(slug);
