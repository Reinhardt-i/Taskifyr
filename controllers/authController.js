const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

exports.register = (req, res) => {
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
};

exports.login = (req, res) => {
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
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);

      // Return the JWT to the client
      return res.status(200).json({ token });
    });
  });
};

exports.authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token not found' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};
