import { fetchProject, saveProject, runPHP } from './api.js';
import { renderWebPreview, renderConsoleOutput } from './preview.js';

let editor;
let currentTab = 'html';
let projectFiles = { html: '', css: '', js: '', php: '', sql: '' };

const languageMap = {
  html: 'html',
  css: 'css',
  js: 'javascript',
  php: 'php',
  sql: 'sql'
};

// โหลด Monaco Editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.38.0/min/vs' }});
require(['vs/editor/editor.main'], async () => {
  
  // ดึงข้อมูลไฟล์โปรเจกต์ ID 1 จาก Backend
  const res = await fetchProject(1);
  if (res.success) {
    projectFiles = { ...projectFiles, ...res.data };
  }

  editor = monaco.editor.create(document.getElementById('editorContainer'), {
    value: projectFiles[currentTab],
    language: languageMap[currentTab],
    theme: 'vs-dark',
    automaticLayout: true
  });

  // คอยอัปเดตโค้ดเข้า Memory ตัวแปรเมื่อพิมพ์
  editor.onDidChangeModelContent(() => {
    projectFiles[currentTab] = editor.getValue();
  });

  // แสดงผลเบื้องต้น
  renderWebPreview(projectFiles);
});

// Event สลับแท็บไฟล์
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    projectFiles[currentTab] = editor.getValue();
    
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('bg-gray-700', 'text-white');
      b.classList.add('text-gray-300');
    });

    e.target.classList.add('bg-gray-700', 'text-white');
    currentTab = e.target.dataset.type;

    monaco.editor.setModelLanguage(editor.getModel(), languageMap[currentTab]);
    editor.setValue(projectFiles[currentTab] || '');
  });
});

// กดปุ่ม Save
document.getElementById('saveBtn').addEventListener('click', async () => {
  projectFiles[currentTab] = editor.getValue();
  const statusEl = document.getElementById('saveStatus');
  statusEl.innerText = 'กำลังบันทึก...';

  const res = await saveProject(1, projectFiles);
  if (res.success) {
    statusEl.innerText = 'บันทึกสำเร็จ 🟢';
    setTimeout(() => statusEl.innerText = 'พร้อมใช้งาน', 2000);
  }
});

// กดปุ่ม Run
document.getElementById('runBtn').addEventListener('click', async () => {
  projectFiles[currentTab] = editor.getValue();

  if (currentTab === 'php') {
    renderConsoleOutput('Running PHP Code...');
    const res = await runPHP(projectFiles.php);
    renderConsoleOutput(res.output);
  } else {
    renderWebPreview(projectFiles);
  }
});
