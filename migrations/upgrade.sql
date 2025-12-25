-- Add missing columns only
ALTER TABLE tests ADD COLUMN slug TEXT;
ALTER TABLE tests ADD COLUMN analysis_type TEXT DEFAULT 'direct';

-- Create new tables
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

CREATE TABLE IF NOT EXISTS result_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL UNIQUE,
    report_json TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS risk_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER NOT NULL,
    condition_expr TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'warning',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);
