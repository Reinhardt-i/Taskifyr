require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'FE - public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'FE - public', 'login.html'));
});


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
const authRoutes = require('./BE - routes/authRoutes');
const taskRoutes = require('./BE - routes/taskRoutes');
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);


app.get('/', (req, res) => {
  // You can send a response or render an HTML page here
  res.send('Welcome to Taskifyr!');
});


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
