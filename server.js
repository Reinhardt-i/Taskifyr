const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const app = express();
const port = 3000;

const taskController = require('./controllers/taskController');
const authController = require('./controllers/authController');

// Middleware to parse incoming JSON data
app.use(bodyParser.json());



// const pool = require('./db');
// app.get('/tasks', (req, res) => {
//   const query = 'SELECT * FROM tasks';

//   pool.query(query, (error, results) => {
//     if (error) {
//       console.error(error);
//       res.status(500).json({ error: 'An error occurred while fetching tasks' });
//     } else {
//       // Process the results
//       res.json(results);
//     }
//   });
// });



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
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check if the username already exists in the database
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error checking username in the database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      // Insert the new user into the database
      db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
        if (err) {
          console.error('Error inserting user into the database:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }

        return res.status(201).json({ message: 'User registered successfully' });
      });
    });
  });
});


// User Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check if the username exists in the database
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error checking username in the database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign({ id: user.id, username: user.username }, 'your_secret_key');

      // Return the JWT to the client
      return res.status(200).json({ token });
    });
  });
});


// Token Validation Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token not found' });
  }

  jwt.verify(token, 'your_secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};


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
app.post('/tasks', authController.authenticateToken, taskController.createTask);
app.put('/tasks/:id', authController.authenticateToken, taskController.updateTask);
app.delete('/tasks/:id', authController.authenticateToken, taskController.deleteTask);


// Routes for authentication
app.post('/register', authController.register);
app.post('/login', authController.login);


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


