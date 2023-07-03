const bcrypt = require('bcrypt');

// Dummy user data (replace with your actual user data or connect to a database)
const users = [
  { id: 1, username: 'john', password: '$2b$10$DKHjE8sPL6m1Tf02e1QFKuBdIuKKf54wZ7c.cWCUfTp4ZIkIiZDlG' } // Password: 'password'
];

function getUserByUsername(username) {
  return users.find(user => user.username === username);
}

async function comparePasswords(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

module.exports = {
  async login(req, res) {
    const { username, password } = req.body;

    // Check if the user exists
    const user = getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // User authentication successful
    // You can generate and return a JWT token here if desired
    res.status(200).json({ message: 'Login successful' });
  },

  async register(req, res) {
    const { username, password } = req.body;

    // Check if the user already exists
    if (getUserByUsername(username)) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user with hashed password
    const newUser = { id: users.length + 1, username, password: hashedPassword };
    users.push(newUser);

    // User registration successful
    res.status(201).json({ message: 'Registration successful' });
  }
};
