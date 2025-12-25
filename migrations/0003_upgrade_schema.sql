-- Migration 0003: Upgrade Schema for Analysis System
-- Adds: analysis_type, category, slug to tests
-- Creates: analysis_templates, result_reports tables
-- Adds unique constraints for upsert operations

-- ==========================================
-- Step 1: Add new columns to tests table
-- ==========================================

ALTER TABLE tests ADD COLUMN analysis_type TEXT NOT NULL DEFAULT 'direct';
ALTER TABLE tests ADD COLUMN category TEXT NOT NULL DEFAULT 'General';
ALTER TABLE tests ADD COLUMN slug TEXT;

-- Create unique index on slug (allowing NULL for migration)
CREATE UNIQUE INDEX IF NOT EXISTS idx_tests_slug ON tests(slug) WHERE slug IS NOT NULL;

-- ==========================================
-- Step 2: Create analysis_templates table
-- ==========================================

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

CREATE INDEX IF NOT EXISTS idx_analysis_templates_test ON analysis_templates(test_id);
CREATE INDEX IF NOT EXISTS idx_analysis_templates_level ON analysis_templates(test_id, level_label);

-- ==========================================
-- Step 3: Create result_reports table
-- ==========================================

CREATE TABLE IF NOT EXISTS result_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL UNIQUE,
    report_json TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_result_reports_session ON result_reports(session_id);

-- ==========================================
-- Step 4: Add risk_rules table for risk detection
-- ==========================================

CREATE TABLE IF NOT EXISTS risk_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER NOT NULL,
    condition_expr TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'warning',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_risk_rules_test ON risk_rules(test_id);

-- ==========================================
-- Step 5: Add unique constraints for upsert
-- ==========================================

-- Unique constraint on scales (test_id, name)
CREATE UNIQUE INDEX IF NOT EXISTS idx_scales_unique ON scales(test_id, name);

-- Unique constraint on questions (test_id, order_index)
CREATE UNIQUE INDEX IF NOT EXISTS idx_questions_unique ON questions(test_id, order_index);

-- Unique constraint on options (question_id, order_index)
CREATE UNIQUE INDEX IF NOT EXISTS idx_options_unique ON options(question_id, order_index);

-- ==========================================
-- Step 6: Update existing tests with slugs
-- ==========================================

UPDATE tests SET slug = 'phq-9', category = 'Depression' WHERE name LIKE '%PHQ%9%' OR name LIKE '%افسردگی%';
UPDATE tests SET slug = 'gad-7', category = 'Anxiety' WHERE name LIKE '%GAD%7%' OR name LIKE '%اضطراب%';
