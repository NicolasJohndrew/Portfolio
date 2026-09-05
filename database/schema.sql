PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    link TEXT NULL,
    image_key TEXT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_sort_order
    ON projects(sort_order, id DESC);

-- Seed project. Safe to run once on a new database.
INSERT INTO projects (
    title,
    description,
    link,
    image_key,
    sort_order,
    created_at,
    updated_at
)
SELECT
    'Cantilena: Whispers of the Last Song',
    'A psychological horror adventure where a hearing-aid mechanic reshapes how players see, hear, explore, and survive a surreal opera world.',
    NULL,
    NULL,
    1,
    datetime('now'),
    datetime('now')
WHERE NOT EXISTS (
    SELECT 1
    FROM projects
    WHERE title = 'Cantilena: Whispers of the Last Song'
);
