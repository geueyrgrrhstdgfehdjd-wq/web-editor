import { fetchProject, saveProject, runPHP } from './api.js';
import { renderWebPreview, renderConsoleOutput } from './preview.js';

let editor;
let currentTab = 'html';

// ข้อมูลเริ่มต้นสำรอง (กันพิมพ์ไม่ได้กรณีไม่มี Database)
let projectFiles = {
  html: '<h1>สวัสดีครับ! 👋</h1>\n<p>พิมพ์แก้ไขโค้ดตรงนี้ได้เลย</p>\n<button id="btn">คลิกทดสอบ</button>',
  css: 'h1 { color: #2563eb; font-family: sans-serif; }\nbutton { padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; }',
  js: 'document.getElementById("btn").addEventListener("click", () => {\n  alert("ทำงานได้ปกติแล้วครับ!");\n});',
  php: '<?php\necho "Hello from PHP Execution!";\n?>',
  sql: 'SELECT * FROM projects;'
};

const languageMap = {
  html: 'html',
  css: 'css',
  js: 'javascript',
  php: 'php',
  sql: 'sql'
};

// ตั้งค่าที่อยู่ CDN ของ Monaco Editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.38.0/min/vs' }});

require(['vs/editor/editor.main'], async () => {
  
  // 1. สร้าง Editor ขึ้นมาก่อนทันที (การันตีว่าพิมพ์ได้แน่นอน 100%)
  editor = monaco.editor.create(document.getElementById('editorContainer'), {
    value: projectFiles[currentTab],
    language: languageMap[currentTab],
    theme: 'vs-dark',
    automaticLayout: true,
    fontSize: 14,
    scrollBeyondLastLine: false
  });

  // 2. พยายามดึงข้อมูลจาก Backend API
  try {
    const res = await fetchProject(1);
    if (res && res.success && res.data && Object.keys(res.data).length > 0) {
      projectFiles = { ...projectFiles, ...res.data };
      editor.setValue(projectFiles[currentTab] || '');
    }
  } catch (err) {
    console.warn("ไม่สามารถติดต่อ Backend ได้ ใช้ข้อมูลชั่วคราวในเครื่องแทน:", err);
  }

  // 3. เมื่อพิมพ์ ให้เซฟข้อมูลลงในMemoryทันที
  editor.onDidChangeModelContent(() => {
    projectFiles[currentTab] = editor.getValue();
  });

  // Render ครั้งแรก
  renderWebPreview(projectFiles);
});

// ฟังก์ชันสลับแท็บ
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const targetBtn = e.currentTarget;
    const selectedType = targetBtn.getAttribute('data-type');

    if (!selectedType || !editor) return;

    // เซฟแท็บเดิม
    projectFiles[currentTab] = editor.getValue();
    currentTab = selectedType;

    // เปลี่ยนสีไฮไลต์ปุ่ม
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('bg-gray-700', 'text-white');
      b.classList.add('text-gray-300');
    });
    targetBtn.classList.add('bg-gray-700', 'text-white');

    // เปลี่ยนภาษา และ ใส่โค้ดใหม่ลงใน Editor
    const model = editor.getModel();
    monaco.editor.setModelLanguage(model, languageMap[currentTab]);
    editor.setValue(projectFiles[currentTab] || '');
  });
});

// ปุ่มบันทึก (Save)
document.getElementById('saveBtn').addEventListener('click', async () => {
  if (!editor) return;
  projectFiles[currentTab] = editor.getValue();
  
  const statusEl = document.getElementById('saveStatus');
  statusEl.innerText = 'กำลังบันทึก...';

  try {
    const res = await saveProject(1, projectFiles);
    if (res.success) {
      statusEl.innerText = 'บันทึกสำเร็จ 🟢';
    } else {
      statusEl.innerText = 'บันทึกไม่สำเร็จ 🔴';
    }
  } catch (err) {
    statusEl.innerText = 'บันทึกในเครื่องแล้ว (No DB) 🟡';
  }

  setTimeout(() => statusEl.innerText = 'พร้อมใช้งาน', 2500);
});

// ปุ่มรัน (Run)
document.getElementById('runBtn').addEventListener('click', async () => {
  if (!editor) return;
  projectFiles[currentTab] = editor.getValue();

  if (currentTab === 'php') {
    renderConsoleOutput('กำลังส่งโค้ด PHP ไปประมวลผลที่ Server...');
    try {
      const res = await runPHP(projectFiles.php);
      renderConsoleOutput(res.output || 'ไม่มีผลลัพธ์ส่งกลับมา');
    } catch (err) {
      renderConsoleOutput('เกิดข้อผิดพลาด: ไม่สามารถเชื่อมต่อ PHP Server ได้');
    }
  } else {
    renderWebPreview(projectFiles);
  }
});
