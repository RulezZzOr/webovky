CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title_cs TEXT NOT NULL,
    summary_cs TEXT NOT NULL,
    content_cs TEXT NOT NULL,
    title_en TEXT,
    summary_en TEXT,
    content_en TEXT,
    image_url TEXT,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS posts_published_idx ON posts (published);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts (created_at DESC);
