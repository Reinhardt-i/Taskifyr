const mysql = require('mysql');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'uroot',
  password: 'Database02%',
  database: 'taskifyr',
});

// Export the pool to be used in other modules
module.exports = pool;
