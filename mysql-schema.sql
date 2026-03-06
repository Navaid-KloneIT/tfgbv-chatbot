-- MySQL Database Schema for TFGBV Chatbot Admin Dashboard
-- Run this SQL in phpMyAdmin or MySQL CLI against the 'tfgbv' database

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  session_id CHAR(36) NOT NULL,
  mode ENUM('support', 'analyzer', 'bias-detector', 'feminist-lens', 'rewrite-engine') NOT NULL,
  role ENUM('user', 'assistant') NOT NULL,
  content TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  environment ENUM('development', 'production') NOT NULL DEFAULT 'production',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_chat_messages_session_id (session_id),
  INDEX idx_chat_messages_mode (mode),
  INDEX idx_chat_messages_environment (environment),
  INDEX idx_chat_messages_timestamp (timestamp DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert a default admin user (email: admin@uksfeminist.ai, password: Admin@123)
-- You should change this password after first login
INSERT IGNORE INTO admin_users (id, email, password_hash)
VALUES (UUID(), 'admin@uksfeminist.ai', '$2b$10$Rj7FSOz4eoA1lBlDt8tPXO3qwCrBmRAwpTJ3xj/RF10FcsJyknOyK');
