// Import necessary modules and dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create an instance of Express
const app = express();

// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_database_username',
  password: 'your_database_password',
  database: 'your_database_name'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Define the registration endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Validate the request body
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check if the username is already taken
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error executing database query:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'Username is already taken' });
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
          console.error('Error executing database query:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }

        return res.status(201).json({ message: 'User registered successfully' });
      });
    });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});



/**
 * 
 * 1. API endpoint that allows users to register by providing a username and password -
 * 
 *      The /register endpoint is defined as a POST request handler. It receives the username and password 
 * from the request body. It then validates the request body, checks if the username is already taken in the database, 
 * and inserts the new user into the database if everything is valid.
 * 
 *      Replace 'your_database_username', 'your_database_password', and 'your_database_name' 
 * with actual MySQL database credentials.
 * 
 */