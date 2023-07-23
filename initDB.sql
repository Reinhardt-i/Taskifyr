-- Create the Taskifyr database
CREATE DATABASE taskifyr;
USE taskifyr;

-- Create the users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- The default user with the username "admin1" and hashed password for "password1"
INSERT INTO users (username, password) VALUES ('admin1', '$2b$10$Gr3W3sz54NAGD5kpXkVutuJKcc64Yc/b21rF4CRjLbrBAMNCgzGve');

-- Create the tasks table
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  userId INT,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
