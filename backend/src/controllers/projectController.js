const db = require('../config/db');

// ดึงข้อมูลโค้ดทั้งหมดของโปรเจกต์
exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const [files] = await db.query(
      'SELECT file_type, content FROM project_files WHERE project_id = ?',
      [id]
    );

    const projectData = {};
    files.forEach(f => projectData[f.file_type] = f.content);

    res.json({ success: true, data: projectData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// บันทึกโค้ดลงฐานข้อมูล
exports.saveProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { files } = req.body; // { html: '...', css: '...', js: '...', php: '...', sql: '...' }

    for (const [type, content] of Object.entries(files)) {
      await db.query(
        `INSERT INTO project_files (project_id, file_type, content) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE content = VALUES(content)`,
        [id, type, content]
      );
    }

    res.json({ success: true, message: 'บันทึกโปรเจกต์เรียบร้อยแล้ว' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
