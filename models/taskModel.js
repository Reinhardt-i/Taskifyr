let tasks = [];

class Task {
  constructor(id, title, description, createdBy) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdAt = new Date();
    this.createdBy = createdBy;
  }
}

function getAllTasks() {
  return tasks;
}

function getTaskById(id) {
  return tasks.find(task => task.id === id);
}

function createTask(title, description, createdBy) {
  const id = tasks.length + 1;
  const newTask = new Task(id, title, description, createdBy);
  tasks.push(newTask);
  return newTask;
}

function updateTask(id, title, description) {
  const task = getTaskById(id);
  if (task) {
    task.title = title;
    task.description = description;
    return task;
  }
  return null;
}

function deleteTask(id) {
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1) {
    const deletedTask = tasks.splice(index, 1);
    return deletedTask[0];
  }
  return null;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
