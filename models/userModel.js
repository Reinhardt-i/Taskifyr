const pool = require('../db');

class User {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const values = [username];

    return new Promise((resolve, reject) => {
      pool.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve(null);
          } else {
            const { id, username, password } = results[0];
            const user = new User(id, username, password);
            resolve(user);
          }
        }
      });
    });
  }

  async save() {
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    const values = [this.username, this.password];

    return new Promise((resolve, reject) => {
      pool.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          this.id = results.insertId;
          resolve(this);
        }
      });
    });
  }
}

module.exports = User;
