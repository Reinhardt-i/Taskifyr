const express = require('express');
const router = express.Router();
const taskController = require('../BE - controllers/taskController');
const authController = require('../BE - controllers/authController');

// Task routes
router.get('/', taskController.getAllTasks);
router.get('/create', authController.authenticateToken, taskController.renderCreateTaskPage);
router.post('/', authController.authenticateToken, taskController.createTask);
router.get('/:id', authController.authenticateToken, taskController.getTaskById);
router.post('/:id', authController.authenticateToken, taskController.updateTask);
router.post('/:id/delete', authController.authenticateToken, taskController.deleteTask);

module.exports = router;
