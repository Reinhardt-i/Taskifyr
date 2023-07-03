const pool = require('../db');

class Task {
  constructor(id, title, description, userId) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.userId = userId;
  }

  static async getAll() {
    const query = 'SELECT * FROM tasks';

    return new Promise((resolve, reject) => {
      pool.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const tasks = results.map((row) => {
            const { id, title, description, userId } = row;
            return new Task(id, title, description, userId);
          });
          resolve(tasks);
        }
      });
    });
  }

  async save() {
    const query = 'INSERT INTO tasks (title, description, userId) VALUES (?, ?, ?)';
    const values = [this.title, this.description, this.userId];

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

  async update() {
    const query = 'UPDATE tasks SET title = ?, description = ? WHERE id = ?';
    const values = [this.title, this.description, this.id];

    return new Promise((resolve, reject) => {
      pool.query(query, values, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async delete() {
    const query = 'DELETE FROM tasks WHERE id = ?';
    const values = [this.id];

    return new Promise((resolve, reject) => {
      pool.query(query, values, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = Task;
