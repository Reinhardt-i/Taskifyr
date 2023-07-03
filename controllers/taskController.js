// Import dependencies
const Task = require('../models/Task');

// Controller function to create a new task
const createTask = async (req, res) => {
  try {
    // Retrieve task data from the request body
    const { title, description } = req.body;

    // Create a new task
    const newTask = new Task({ title, description });

    // Save the task to the database
    const savedTask = await newTask.save();

    // Return the saved task as the response
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to get all tasks
const getAllTasks = async (req, res) => {
  try {
    // Retrieve all tasks from the database
    const tasks = await Task.find();

    // Return the tasks as the response
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to get a single task by ID
const getTaskById = async (req, res) => {
  try {
    // Retrieve the task ID from the request parameters
    const { id } = req.params;

    // Find the task by ID in the database
    const task = await Task.findById(id);

    // Check if the task exists
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Return the task as the response
    res.status(200).json(task);
  } catch (error) {
    console.error('Error retrieving task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to update a task by ID
const updateTaskById = async (req, res) => {
  try {
    // Retrieve the task ID from the request parameters
    const { id } = req.params;

    // Retrieve task data from the request body
    const { title, description } = req.body;

    // Find the task by ID in the database and update its data
    const updatedTask = await Task.findByIdAndUpdate(id, { title, description }, { new: true });

    // Check if the task exists
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Return the updated task as the response
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to delete a task by ID
const deleteTaskById = async (req, res) => {
  try {
    // Retrieve the task ID from the request parameters
    const { id } = req.params;

    // Find the task by ID in the database and delete it
    const deletedTask = await Task.findByIdAndDelete(id);

    // Check if the task exists
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Return a success message as the response
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Export the controller functions
module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
};
