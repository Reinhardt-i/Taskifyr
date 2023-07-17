const pool = require('../db');

class Task {
  constructor(id, title, description) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdAt = new Date();
  }

  static async getAllTasks() {
    const query = 'SELECT * FROM tasks';

    return new Promise((resolve, reject) => {
      pool.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const tasks = results.map(row => new Task(row.id, row.title, row.description));
          resolve(tasks);
        }
      });
    });
  }

  static async getTaskById(id) {
    const query = 'SELECT * FROM tasks WHERE id = ?';
    const values = [id];

    return new Promise((resolve, reject) => {
      pool.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve(null);
          } else {
            const { id, title, description } = results[0];
            const task = new Task(id, title, description);
            resolve(task);
          }
        }
      });
    });
  }

  static async createTask(title, description) {
    const query = 'INSERT INTO tasks (title, description) VALUES (?, ?)';
    const values = [title, description];

    return new Promise((resolve, reject) => {
      pool.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const id = results.insertId;
          const task = new Task(id, title, description);
          resolve(task);
        }
      });
    });
  }

  static async updateTask(id, title, description) {
    const query = 'UPDATE tasks SET title = ?, description = ? WHERE id = ?';
    const values = [title, description, id];

    return new Promise((resolve, reject) => {
      pool.query(query, values, (error) => {
        if (error) {
          reject(error);
        } else {
          const task = new Task(id, title, description);
          resolve(task);
        }
      });
    });
  }

  static async deleteTask(id) {
    const query = 'DELETE FROM tasks WHERE id = ?';
    const values = [id];

    return new Promise((resolve, reject) => {
      pool.query(query, values, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }
}

module.exports = Task;
