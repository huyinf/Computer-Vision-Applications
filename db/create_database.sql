-- Create database (uncomment if you need to create the database)
-- CREATE DATABASE bioface;

-- Connect to the database
-- \c bioface;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS faces CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(256) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create faces table
CREATE TABLE faces (
    face_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    image_name VARCHAR(255) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    embedding JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_faces_user_id ON faces(user_id);
CREATE INDEX idx_faces_image_name ON faces(image_name);

-- Add comments to tables and columns
COMMENT ON TABLE users IS 'Stores user information and authentication data';
COMMENT ON TABLE faces IS 'Stores face images and their embeddings for recognition';

COMMENT ON COLUMN users.user_id IS 'Unique identifier for each user';
COMMENT ON COLUMN users.first_name IS 'User''s first name';
COMMENT ON COLUMN users.last_name IS 'User''s last name';
COMMENT ON COLUMN users.email IS 'User''s email address (unique)';
COMMENT ON COLUMN users.password IS 'Hashed password for user authentication';
COMMENT ON COLUMN users.created_at IS 'Timestamp when the user was created';

COMMENT ON COLUMN faces.face_id IS 'Unique identifier for each face record';
COMMENT ON COLUMN faces.user_id IS 'Foreign key referencing the user who owns this face';
COMMENT ON COLUMN faces.image_name IS 'Name of the face image file';
COMMENT ON COLUMN faces.image_path IS 'Path to the face image file';
COMMENT ON COLUMN faces.embedding IS 'JSON array containing the face embedding vector';
COMMENT ON COLUMN faces.created_at IS 'Timestamp when the face record was created'; 