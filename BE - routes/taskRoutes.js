const express = require('express');
const router = express.Router();
const taskController = require('./taskController');
const authController = require('./authController');

// Task routes
router.get('/', taskController.getAllTasks);
router.get('/create', taskController.renderCreateTaskPage);
router.post('/', taskController.createTask);
router.get('/:id', taskController.getTaskById);
router.post('/:id', taskController.updateTask);
router.post('/:id/delete', taskController.deleteTask);

module.exports = router;
