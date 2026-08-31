CREATE DATABASE IF NOT EXISTS web_ide_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE web_ide_db;

-- ตารางเก็บโปรเจกต์
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ตารางเก็บไฟล์โค้ดของแต่ละโปรเจกต์
CREATE TABLE IF NOT EXISTS project_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    file_type ENUM('html', 'css', 'js', 'php', 'sql') NOT NULL,
    content LONGTEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_file (project_id, file_type)
);

-- ใส่ข้อมูลตัวอย่างเริ่มต้น (Project ID: 1)
INSERT INTO projects (id, title) VALUES (1, 'My First Web Project');
INSERT INTO project_files (project_id, file_type, content) VALUES
(1, 'html', '<h1>Hello World!</h1>\n<button id="demoBtn">Click Me</button>'),
(1, 'css', 'h1 { color: #2563eb; font-family: sans-serif; }\nbutton { padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; }'),
(1, 'js', 'document.getElementById("demoBtn").addEventListener("click", () => {\n  alert("Button clicked!");\n});'),
(1, 'php', '<?php\necho "Hello from PHP execution server!";\n?>'),
(1, 'sql', 'SELECT * FROM projects;');
