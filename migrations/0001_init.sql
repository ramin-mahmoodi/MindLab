-- 0001_init.sql
-- Psychology Tests Platform - D1 Schema

-- Tests table
CREATE TABLE IF NOT EXISTS tests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  warning TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Scales table (scoring dimensions for each test)
CREATE TABLE IF NOT EXISTS scales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- Options table (answer choices)
CREATE TABLE IF NOT EXISTS options (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Question to Scale mapping (many-to-many)
CREATE TABLE IF NOT EXISTS question_scale_map (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL,
  scale_id INTEGER NOT NULL,
  weight REAL DEFAULT 1.0,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (scale_id) REFERENCES scales(id) ON DELETE CASCADE,
  UNIQUE(question_id, scale_id)
);

-- Cutoffs table (score interpretation ranges)
CREATE TABLE IF NOT EXISTS cutoffs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scale_id INTEGER NOT NULL,
  min_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  FOREIGN KEY (scale_id) REFERENCES scales(id) ON DELETE CASCADE
);

-- Sessions table (user test attempts)
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_id INTEGER NOT NULL,
  user_uid TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  finished_at TEXT,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- Answers table (user responses)
CREATE TABLE IF NOT EXISTS answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  option_id INTEGER NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  answered_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE CASCADE,
  UNIQUE(session_id, question_id)
);

-- Results table (calculated scores per scale)
CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  scale_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  interpretation TEXT,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (scale_id) REFERENCES scales(id) ON DELETE CASCADE,
  UNIQUE(session_id, scale_id)
);

-- User profiles table (optional)
CREATE TABLE IF NOT EXISTS user_profiles (
  user_uid TEXT PRIMARY KEY,
  display_name TEXT,
  email TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_questions_test_id ON questions(test_id);
CREATE INDEX IF NOT EXISTS idx_options_question_id ON options(question_id);
CREATE INDEX IF NOT EXISTS idx_scales_test_id ON scales(test_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_uid ON sessions(user_uid);
CREATE INDEX IF NOT EXISTS idx_sessions_test_id ON sessions(test_id);
CREATE INDEX IF NOT EXISTS idx_answers_session_id ON answers(session_id);
CREATE INDEX IF NOT EXISTS idx_results_session_id ON results(session_id);
CREATE INDEX IF NOT EXISTS idx_cutoffs_scale_id ON cutoffs(scale_id);
