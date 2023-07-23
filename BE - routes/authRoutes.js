const express = require('express');
const router = express.Router();
const authController = require('./authController');

// Authentication routes
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', authController.login);

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', authController.register);

router.get('/logout', authController.logout);

module.exports = router;
