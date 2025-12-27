-- 0002_add_missing_tables.sql
-- Add missing tables for analysis and reporting

-- Add slug column to tests table if not exists
-- Note: Using IF NOT EXISTS style for SQLite compatibility

-- Analysis templates table
CREATE TABLE IF NOT EXISTS analysis_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_id INTEGER NOT NULL,
  scale_id INTEGER,
  level_label TEXT NOT NULL,
  title TEXT,
  summary TEXT,
  details TEXT,
  recommendations TEXT,
  disclaimer TEXT,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
  FOREIGN KEY (scale_id) REFERENCES scales(id) ON DELETE SET NULL
);

-- Risk rules table
CREATE TABLE IF NOT EXISTS risk_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_id INTEGER NOT NULL,
  condition_expr TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'warning',
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- Result reports table (stores JSON analysis reports)
CREATE TABLE IF NOT EXISTS result_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL UNIQUE,
  report_json TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_analysis_templates_test_id ON analysis_templates(test_id);
CREATE INDEX IF NOT EXISTS idx_risk_rules_test_id ON risk_rules(test_id);
CREATE INDEX IF NOT EXISTS idx_result_reports_session_id ON result_reports(session_id);
