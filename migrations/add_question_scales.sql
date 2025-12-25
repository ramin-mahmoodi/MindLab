-- Add question_scales table
CREATE TABLE IF NOT EXISTS question_scales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    scale_id INTEGER NOT NULL,
    weight REAL DEFAULT 1.0,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (scale_id) REFERENCES scales(id) ON DELETE CASCADE,
    UNIQUE(question_id, scale_id)
);
