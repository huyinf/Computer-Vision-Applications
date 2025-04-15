import psycopg2
from flask_bcrypt import Bcrypt

# Create Bcrypt object
bcrypt = Bcrypt()

# Configure PostgreSQL connection
db_config = {
    'dbname': 'bioface',
    'user': 'postgres',
    'password': '123',
    'host': 'localhost',
    'port': '5432'
}

# Connect to PostgreSQL
try:
    conn = psycopg2.connect(**db_config)
    cursor = conn.cursor()
    print("Connected to PostgreSQL successfully!")
except Exception as e:
    print(f"Connection error: {e}")
    exit()

# Create users table
try:
    cursor.execute("""
    DROP TABLE IF EXISTS faces CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    
    CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(256) NOT NULL,  # Store hashed password
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    print("users table created successfully!")
except Exception as e:
    print(f"Error creating users table: {e}")

# Create faces table
try:
    cursor.execute("""
    CREATE TABLE faces (
        face_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        image_name VARCHAR(255) NOT NULL,
        image_path VARCHAR(255) NOT NULL,
        embedding JSONB NOT NULL, # Store embeddings as JSON
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    print("faces table created successfully!")
except Exception as e:
    print(f"Error creating faces table: {e}")

# Close connection
cursor.close()
conn.close()
print("Database setup completed.")
