const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const projectRoutes = require('./routes/projectRoutes');
const runnerRoutes = require('./routes/runnerRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// เสิร์ฟไฟล์ Static ของ Frontend
app.use(express.static(path.join(__dirname, '../../frontend/public')));
app.use('/src', express.static(path.join(__dirname, '../../frontend/src')));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/run', runnerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
