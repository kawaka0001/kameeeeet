-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  room_name VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  creator_token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  max_participants INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true
);

-- Index for faster room lookup
CREATE INDEX IF NOT EXISTS idx_room_name ON rooms(room_name);
CREATE INDEX IF NOT EXISTS idx_active_rooms ON rooms(is_active, created_at);
