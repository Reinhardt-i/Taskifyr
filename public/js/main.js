// Fetch tasks from the backend and render them on the page
async function fetchTasks() {
    try {
      const response = await fetch('/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const tasks = await response.json();
  
      const taskList = document.getElementById('taskList');
      taskList.innerHTML = '';
  
      tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
  
        const taskTitle = document.createElement('span');
        taskTitle.textContent = task.title;
  
        const taskDescription = document.createElement('span');
        taskDescription.textContent = task.description;
  
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i> Delete';
        deleteButton.addEventListener('click', () => deleteTask(task.id));
  
        taskItem.appendChild(taskTitle);
        taskItem.appendChild(taskDescription);
        taskItem.appendChild(deleteButton);
  
        taskList.appendChild(taskItem);
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }
  
  // Function to delete a task
  async function deleteTask(taskId) {
    try {
      const response = await fetch(`/tasks/${taskId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      fetchTasks(); // Refresh the task list after deletion
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
  
  // Function to add a new task
  async function addTask(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
  
    if (title.trim() === '' || description.trim() === '') {
      alert('Please enter both title and description');
      return;
    }
  
    const taskData = { title, description };
    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
  
      document.getElementById('taskForm').reset(); // Reset the form
      fetchTasks(); // Refresh the task list after adding
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }
  
  // Event listener for form submission
  document.getElementById('taskForm').addEventListener('submit', addTask);
  
  // Initial fetch of tasks when the page loads
  fetchTasks();
  



// Function to show a small task creation popup
function showTaskPopup() {
  const taskPopup = document.getElementById('taskPopup');
  taskPopup.classList.add('show');
  setTimeout(() => {
      taskPopup.classList.remove('show');
  }, 3000);
}

// Event listener for form submission
document.getElementById('taskForm').addEventListener('submit', (event) => {
  event.preventDefault();
  addTask(event);
  showTaskPopup();
});


