const Task = require('../models/Task');

// Controller method to get all tasks for a user
exports.getAllTasks = (req, res) => {
  const userId = req.user.id;

  // Find all tasks for the user
  Task.getAllTasks(userId)
    .then(tasks => res.status(200).json(tasks))
    .catch(err => {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({ message: 'Internal server error' });
    });
};



// Controller method to create a new task
exports.createTask = (req, res) => {
  const userId = req.user.id;
  const { title, description } = req.body;

  // Create a new task with the provided title, description, and user ID
  const newTask = new Task({
    title,
    description,
    user: userId
  });

  // Save the new task to the database
  newTask.save((err, task) => {
    if (err) {
      console.error('Error creating task:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    return res.status(201).json(task);
  });
};


// Controller method to update an existing task
exports.updateTask = (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const { title, description, completed } = req.body;

  // Find the task by ID and user ID
  Task.findOne({ _id: taskId, user: userId }, (err, task) => {
    if (err) {
      console.error('Error fetching task:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Check if task exists
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update the task properties
    task.title = title;
    task.description = description;
    task.completed = completed;

    // Save the updated task
    task.save((err, updatedTask) => {
      if (err) {
        console.error('Error updating task:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      return res.status(200).json(updatedTask);
    });
  });

  Task.findOneAndUpdate({ _id: taskId, user: userId }, { title, description }, { new: true })
    .then(updatedTask => {
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json(updatedTask);
    })
    .catch(err => {
      console.error('Error updating task:', err);
      res.status(500).json({ message: 'Internal server error' });
    });

};


// Controller method to delete a task
exports.deleteTask = (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  // Find the task by ID and user ID
  Task.findOne({ _id: taskId, user: userId }, (err, task) => {
    if (err) {
      console.error('Error fetching task:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Check if task exists
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Delete the task
    task.remove((err) => {
      if (err) {
        console.error('Error deleting task:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      return res.status(204).json({ message: 'Task deleted successfully' });
    });
  });

  // Find the task by ID and user ID
  Task.findOneAndDelete({ _id: taskId, user: userId })
  .then(deletedTask => {
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(204).json({ message: 'Task deleted successfully' });
  })
  .catch(err => {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Internal server error' });
  });


};

