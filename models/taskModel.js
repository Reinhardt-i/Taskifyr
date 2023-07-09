const pool = require('../db');

class Task {
  constructor(id, title, description, createdBy) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdAt = new Date();
    this.createdBy = createdBy;
  }

  static async getAllTasks(userId) {
    const query = 'SELECT * FROM tasks WHERE createdBy = ?';
    const values = [userId];

    return new Promise((resolve, reject) => {
      pool.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const tasks = results.map(row => new Task(row.id, row.title, row.description, row.createdBy));
          resolve(tasks);
        }
      });
    });
  }

  // Add other methods for getTaskById, createTask, updateTask, deleteTask
  // Similar to the getAllTasks method, but with different SQL queries
}

module.exports = Task;
