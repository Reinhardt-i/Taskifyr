require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;

const taskController = require('./controllers/taskController');
const authController = require('./controllers/authController');

// Middleware to parse incoming JSON data
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Create a MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'uroot',
  password: 'Database02%',
  database: 'taskifyr'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// User Registration Endpoint
app.post('/register', authController.register);

// User Login Endpoint
app.post('/login', authController.login);

// Token Validation Middleware
const authenticateToken = authController.authenticateToken;

// Protected Route Example
app.get('/protected', authenticateToken, (req, res) => {
  // Access the authenticated user's information using req.user
  const userId = req.user.id;
  const username = req.user.username;

  // Perform operations for the protected route

  return res.status(200).json({ message: 'Protected route accessed successfully' });
});

// Routes for tasks
app.get('/tasks', taskController.getAllTasks);
app.post('/tasks', authenticateToken, taskController.createTask);
app.put('/tasks/:id', authenticateToken, taskController.updateTask);
app.delete('/tasks/:id', authenticateToken, taskController.deleteTask);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
