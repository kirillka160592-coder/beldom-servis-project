CREATE TABLE media_library (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    filename VARCHAR(255),
    label VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);