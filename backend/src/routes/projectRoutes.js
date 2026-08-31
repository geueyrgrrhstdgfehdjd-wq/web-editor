const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/:id', projectController.getProject);
router.post('/:id/save', projectController.saveProject);

module.exports = router;
