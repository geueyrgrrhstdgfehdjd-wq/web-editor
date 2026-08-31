export const renderWebPreview = (files) => {
  const iframe = document.getElementById('previewFrame');
  const consoleOut = document.getElementById('consoleOutput');
  
  iframe.classList.remove('hidden');
  consoleOut.classList.add('hidden');

  const fullHTML = `
    <!DOCTYPE html>
    <html>
    <head><style>${files.css || ''}</style></head>
    <body>
      ${files.html || ''}
      <script>${files.js || ''}<\/script>
    </body>
    </html>
  `;

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(fullHTML);
  doc.close();
};

export const renderConsoleOutput = (text) => {
  const iframe = document.getElementById('previewFrame');
  const consoleOut = document.getElementById('consoleOutput');

  iframe.classList.add('hidden');
  consoleOut.classList.remove('hidden');
  consoleOut.textContent = text;
};
