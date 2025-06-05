-- CertifyPro Database Initialization Script

-- Drop tables if they exist to avoid conflicts
DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS templates;
DROP TABLE IF EXISTS students;

-- Create students table
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  courses JSON DEFAULT NULL COMMENT 'JSON array of course names',
  addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create templates table
CREATE TABLE templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  thumbnail LONGTEXT COMMENT 'Base64 encoded image data',
  placeholders JSON DEFAULT NULL COMMENT 'JSON array of placeholder objects with name, key, x, y coordinates',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create certificates table
CREATE TABLE certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  certificateId VARCHAR(50) NOT NULL UNIQUE COMMENT 'Unique identifier for certificate verification',
  templateId INT NOT NULL,
  studentId INT NOT NULL,
  courseName VARCHAR(255) NOT NULL,
  completionDate DATE NOT NULL,
  instructorName VARCHAR(255) DEFAULT NULL,
  certificateData LONGTEXT COMMENT 'Generated certificate data (base64 encoded)',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (templateId) REFERENCES templates(id) ON DELETE RESTRICT,
  FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create index for faster certificate verification
CREATE INDEX idx_certificate_id ON certificates(certificateId);

-- Add sample data (optional - for testing purposes)

-- Sample students
INSERT INTO students (name, email, courses) VALUES
('John Doe', 'john.doe@example.com', '["Web Development", "UI/UX Design"]'),
('Jane Smith', 'jane.smith@example.com', '["Data Science", "Machine Learning"]'),
('Bob Johnson', 'bob.johnson@example.com', '["Mobile App Development"]');

-- Note: Template data would typically be added through the application interface
-- as it involves uploading files and converting them to base64