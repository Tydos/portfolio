CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  github_username VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'viewer'
    CHECK (role IN ('viewer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS photographs (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL DEFAULT 'nature',
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  size_bytes_input INTEGER NOT NULL,
  size_bytes_optimized INTEGER NOT NULL,
  s3_key_original VARCHAR(512) NOT NULL,
  s3_key_thumb VARCHAR(512) NOT NULL,
  s3_key_medium VARCHAR(512) NOT NULL,
  cdn_url_original VARCHAR(2048) NOT NULL,
  cdn_url_thumb VARCHAR(2048) NOT NULL,
  cdn_url_medium VARCHAR(2048) NOT NULL,
  uploaded_by INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photographs_category ON photographs(category);
CREATE INDEX IF NOT EXISTS idx_photographs_created_at ON photographs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photographs_uploaded_by ON photographs(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_photographs_category_created ON photographs(category, created_at DESC);
