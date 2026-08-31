const express = require('express');
const router = express.Router();
const runnerController = require('../controllers/runnerController');

router.post('/php', runnerController.executePHP);

module.exports = router;
