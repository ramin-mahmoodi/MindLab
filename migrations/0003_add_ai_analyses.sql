-- 0003_add_ai_analyses.sql
-- Add table for storing AI analysis results

CREATE TABLE IF NOT EXISTS ai_analyses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL UNIQUE,
  analysis_text TEXT NOT NULL,
  model TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ai_analyses_session_id ON ai_analyses(session_id);
