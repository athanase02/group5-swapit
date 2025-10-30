CREATE DATABASE IF NOT EXISTS attendance_system;
USE attendance_system;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'faculty', 'intern') DEFAULT 'student'
);

CREATE TABLE sessions (
  session_id INT AUTO_INCREMENT PRIMARY KEY,
  course_name VARCHAR(100),
  session_date DATE,
  session_type ENUM('lecture','lab') DEFAULT 'lecture',
  comment TEXT
);

CREATE TABLE attendance (
  attendance_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  session_id INT,
  status ENUM('Present','Absent','Late') DEFAULT 'Absent',
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (session_id) REFERENCES sessions(session_id)
);

INSERT INTO users (username, password, role) VALUES
('athanase', MD5('12345'), 'student'),
('prof_mensah', MD5('teach123'), 'faculty');

INSERT INTO sessions (course_name, session_date, session_type, comment) VALUES
('Web Technologies', '2025-10-10', 'lecture', 'Intro to PHP and MySQL'),
('Web Technologies', '2025-10-15', 'lab', 'Bring your laptops and XAMPP');

INSERT INTO attendance (user_id, session_id, status) VALUES
(1, 1, 'Present'),
(1, 2, 'Absent');