PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS site_content (
    content_key TEXT PRIMARY KEY,
    content_value TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_skills_category_sort
    ON skills(category, sort_order, id);

CREATE TABLE IF NOT EXISTS experience (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization TEXT NOT NULL,
    title TEXT NOT NULL,
    period TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_experience_sort
    ON experience(sort_order, id);

INSERT OR IGNORE INTO site_content (content_key, content_value, updated_at) VALUES
('general.siteName', 'Johnny Nicolas', datetime('now')),
('general.brandMark', 'JN', datetime('now')),
('general.brandSubline', 'GAME DEV // PH', datetime('now')),
('general.availabilityText', 'Open to opportunities', datetime('now')),
('general.footerText', '© 2026 Johnny Andrew Nicolas', datetime('now')),
('general.footerTechText', 'BUILT WITH C# / BLAZOR WASM', datetime('now')),
('hero.eyebrowPrefix', 'PLAYER 01', datetime('now')),
('hero.eyebrowText', 'GAME PROGRAMMER + DEVELOPER', datetime('now')),
('hero.headingLine1', 'BUILDING WORLDS', datetime('now')),
('hero.headingLine2', 'PLAYERS REMEMBER.', datetime('now')),
('hero.description', 'I turn mechanics, atmosphere, and narrative into interactive experiences—from gameplay systems in Unity to experimental worlds in Godot.', datetime('now')),
('hero.primaryCtaLabel', 'Explore games', datetime('now')),
('hero.primaryCtaHref', '#games', datetime('now')),
('hero.secondaryCtaLabel', 'Player profile', datetime('now')),
('hero.secondaryCtaHref', '#profile', datetime('now')),
('hero.meta1Label', 'PRIMARY ENGINE', datetime('now')),
('hero.meta1Value', 'UNITY', datetime('now')),
('hero.meta2Label', 'LANGUAGE', datetime('now')),
('hero.meta2Value', 'C#', datetime('now')),
('hero.meta3Label', 'ALT ENGINE', datetime('now')),
('hero.meta3Value', 'GODOT', datetime('now')),
('hero.visualTopLeft', 'LIVE BUILD', datetime('now')),
('hero.visualTopRight', 'v01.26', datetime('now')),
('hero.visualBottomLabel', 'CREATIVE MODE', datetime('now')),
('hero.visualBottomValue', 'ACTIVE', datetime('now')),
('hero.floatingTag1', 'GAMEPLAY SYSTEMS', datetime('now')),
('hero.floatingTag2', 'LEVEL DESIGN', datetime('now')),
('hero.scrollLabel', 'SCROLL TO ENTER', datetime('now')),
('projects.sectionLabel', '01 / SELECTED GAMES', datetime('now')),
('projects.heading', 'Choose your next world.', datetime('now')),
('projects.intro', 'Gameplay experiments, narrative systems, and interactive projects built with intention.', datetime('now')),
('projects.kickerLeft', 'FEATURED BUILD', datetime('now')),
('projects.kickerRight', 'GAME DEV', datetime('now')),
('projects.linkLabel', 'Launch project', datetime('now')),
('projects.emptyLinkLabel', 'Build link incoming', datetime('now')),
('about.sectionLabel', '02 / PLAYER PROFILE', datetime('now')),
('about.headingLine1', 'Creative by instinct.', datetime('now')),
('about.headingLine2', 'Technical by craft.', datetime('now')),
('about.paragraph1', 'Passionate and creative game developer with hands-on experience in Unity and Godot, focused on building game mechanics and clear, engaging digital experiences.', datetime('now')),
('about.paragraph2', 'My background also spans video production and UI/UX, giving me a wider lens on pacing, composition, presentation, and how players experience an interface.', datetime('now')),
('about.highlight1Title', 'Unity', datetime('now')),
('about.highlight1Subtitle', 'C# development', datetime('now')),
('about.highlight2Title', 'Godot', datetime('now')),
('about.highlight2Subtitle', 'GDScript development', datetime('now')),
('about.highlight3Title', '2026', datetime('now')),
('about.highlight3Subtitle', 'BS EMC · Game Development', datetime('now')),
('about.highlight4Title', 'Play.', datetime('now')),
('about.highlight4Subtitle', 'Prototype. Test. Improve.', datetime('now')),
('skills.sectionLabel', '03 / LOADOUT', datetime('now')),
('skills.heading', 'Tools in the inventory.', datetime('now')),
('experience.sectionLabel', '04 / EXPERIENCE LOG', datetime('now')),
('contact.sectionLabel', '05 / START A NEW QUEST', datetime('now')),
('contact.headingLine1', 'Have a world', datetime('now')),
('contact.headingLine2', 'worth building?', datetime('now')),
('contact.description', 'Available for game development opportunities, creative collaborations, and projects where code meets experience.', datetime('now')),
('contact.email', 'johndrewherreranicolas@gmail.com', datetime('now')),
('contact.location', 'San Jose del Monte, Bulacan · Philippines', datetime('now'));

INSERT INTO skills (category, name, sort_order)
SELECT 'Programming', 'C#', 1
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category = 'Programming' AND name = 'C#');
INSERT INTO skills (category, name, sort_order)
SELECT 'Programming', 'Java', 2
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category = 'Programming' AND name = 'Java');
INSERT INTO skills (category, name, sort_order)
SELECT 'Programming', 'GDScript', 3
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category = 'Programming' AND name = 'GDScript');
INSERT INTO skills (category, name, sort_order)
SELECT 'Game engines', 'Unity', 1
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category = 'Game engines' AND name = 'Unity');
INSERT INTO skills (category, name, sort_order)
SELECT 'Game engines', 'Godot', 2
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category = 'Game engines' AND name = 'Godot');
INSERT INTO skills (category, name, sort_order)
SELECT 'Creative tools', 'Figma', 1
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category = 'Creative tools' AND name = 'Figma');
INSERT INTO skills (category, name, sort_order)
SELECT 'Creative tools', 'Premiere Pro', 2
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category = 'Creative tools' AND name = 'Premiere Pro');
INSERT INTO skills (category, name, sort_order)
SELECT 'Creative tools', 'CapCut', 3
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category = 'Creative tools' AND name = 'CapCut');

INSERT INTO experience (organization, title, period, description, sort_order)
SELECT
    'INC Museum',
    'Video Editor / LED Wall Video Editor',
    'DEC 2025 — JUL 2026',
    'Produced and optimized video content for exhibits, presentations, and large-format LED displays while collaborating with the creative team on visual execution.',
    1
WHERE NOT EXISTS (
    SELECT 1 FROM experience
    WHERE organization = 'INC Museum' AND title = 'Video Editor / LED Wall Video Editor'
);

INSERT INTO experience (organization, title, period, description, sort_order)
SELECT
    'New Era University',
    'BS Entertainment & Multimedia Computing',
    '2022 — 2026',
    'Specialized in Game Development with practical work across programming, interactive systems, creative production, and game design.',
    2
WHERE NOT EXISTS (
    SELECT 1 FROM experience
    WHERE organization = 'New Era University' AND title = 'BS Entertainment & Multimedia Computing'
);
