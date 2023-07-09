const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Generate JWT token
function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email
  };

  // Sign the JWT token with the secret key and set expiration time
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
  return token;
}

// Authenticate user and generate token
function login(req, res) {
  const { username, password } = req.body;

  // Find the user with the given username
  User.findByUsername(username)
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare the provided password with the stored password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }

        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If the passwords match, generate a token
        const token = generateToken(user);
        res.json({ token });
      });
    })
    .catch(err => {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: 'Internal server error' });
    });
}


// Verify token middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify and decode the token
  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Store the decoded token payload in the request object
    req.user = decoded;
    next();
  });
}

module.exports = {
  login,
  verifyToken
};
