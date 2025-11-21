-- Add avatar_url column to users table
USE SI2025;

ALTER TABLE users ADD COLUMN avatar_url TEXT AFTER full_name;
