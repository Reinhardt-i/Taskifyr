const express = require('express');
const router = express.Router();

// Task routes
router.get('/', (req, res) => {
  // Fetch tasks from the database
  const tasks = [
    { id: 1, title: 'Task 1', description: 'This is task 1' },
    { id: 2, title: 'Task 2', description: 'This is task 2' },
    { id: 3, title: 'Task 3', description: 'This is task 3' }
  ];

  res.render('index', { tasks });
});

router.get('/tasks/create', (req, res) => {
  res.render('create');
});

router.post('/tasks', (req, res) => {
  // Handle task creation logic
  // Create new task, store in database, etc.
  res.redirect('/tasks');
});

router.get('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  // Fetch task from the database based on taskId
  const task = { id: taskId, title: `Task ${taskId}`, description: `This is task ${taskId}` };

  res.render('detail', { task });
});

router.post('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  // Handle task update logic
  // Update task in the database, etc.
  res.redirect(`/tasks/${taskId}`);
});

router.post('/tasks/:id/delete', (req, res) => {
  const taskId = req.params.id;
  // Handle task deletion logic
  // Delete task from the database, etc.
  res.redirect('/tasks');
});


const taskController = require('./taskController');
const authController = require('./authController');

// Protected route - requires token authentication
router.get('/tasks', authController.verifyToken, taskController.getTasks);
router.post('/tasks', authController.verifyToken, taskController.createTask);

router.put('/tasks/:id', authController.authenticateToken, taskController.updateTask);
router.delete('/tasks/:id', authController.authenticateToken, taskController.deleteTask);



module.exports = router;
