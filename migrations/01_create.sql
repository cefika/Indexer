CREATE TABLE IF NOT EXISTS announcements_info (
  id SERIAL PRIMARY KEY,
  scheme_id TEXT NOT NULL,
  stealth_address TEXT NOT NULL,
  caller TEXT NOT NULL,
  R TEXT NOT NULL,
  metadata TEXT NOT NULL,
  chain_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS meta_addresses (
  id TEXT PRIMARY KEY,
  meta_address TEXT NOT NULL,
  chain_name TEXT NOT NULL
);