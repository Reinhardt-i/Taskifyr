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
            const { id, title, description, createdBy } = results[0];
            const task = new Task(id, title, description, createdBy);
            resolve(task);
          }
        }
      });
    });
  }
  
  static async createTask(title, description, createdBy) {
    const query = 'INSERT INTO tasks (title, description, createdBy) VALUES (?, ?, ?)';
    const values = [title, description, createdBy];
  
    return new Promise((resolve, reject) => {
      pool.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const id = results.insertId;
          const task = new Task(id, title, description, createdBy);
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
          resolve();
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
          resolve();
        }
      });
    });
  }
  

}

module.exports = Task;
