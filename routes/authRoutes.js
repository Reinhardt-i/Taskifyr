const express = require('express');
const router = express.Router();

// Authentication routes
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  // Handle login logic
  // Authenticate user, set session, etc.
  res.redirect('/tasks');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  // Handle registration logic
  // Create new user, store in database, etc.
  res.redirect('/login');
});

router.get('/logout', (req, res) => {
  // Handle logout logic
  // Destroy session, clear cookies, etc.
  res.redirect('/login');
});


const authController = require('./authController');
// Route for user login
router.post('/login', authController.login);

module.exports = router;
