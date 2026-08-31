const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// ฟังก์ชันรัน PHP แบบ Sandbox พื้นฐาน
const runPHPCode = (code) => {
  return new Promise((resolve) => {
    const tempDir = path.join(__dirname, '../../temp_exec');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const filename = `script_${Date.now()}.php`;
    const filepath = path.join(tempDir, filename);

    // เขียนไฟล์ชั่วคราว
    fs.writeFileSync(filepath, code);

    // รันผ่าน PHP CLI (เครื่อง Server ต้องลง PHP ไว้แล้ว)
    exec(`php "${filepath}"`, { timeout: 5000 }, (error, stdout, stderr) => {
      // ลบไฟล์ชั่วคราวทิ้งทันที
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }

      if (error) {
        return resolve({ success: false, output: stderr || error.message });
      }
      resolve({ success: true, output: stdout });
    });
  });
};

module.exports = { runPHPCode };
