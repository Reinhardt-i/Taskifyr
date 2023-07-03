// Fetch tasks from the backend and render them on the page
async function fetchTasks() {
  const response = await fetch('/tasks');
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
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    taskItem.appendChild(taskTitle);
    taskItem.appendChild(taskDescription);
    taskItem.appendChild(deleteButton);

    taskList.appendChild(taskItem);
  });
}

// Add a new task to the backend and update the task list
function addTask(event) {
  event.preventDefault();

  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');

  const task = {
    title: titleInput.value,
    description: descriptionInput.value
  };

  return fetch('/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
    })
    .then(() => {
      titleInput.value = '';
      descriptionInput.value = '';
      return fetchTasks();
    })
    .catch(error => {
      console.error('Error adding task:', error);
    });
}


// Delete a task from the backend and update the task list
async function deleteTask(taskId) {
  await fetch(`/tasks/${taskId}`, {
    method: 'DELETE'
  });

  fetchTasks();
}

// Attach event listener to the form submission
const taskForm = document.getElementById('taskForm');
taskForm.addEventListener('submit', addTask);

// Initial fetch and render of tasks
fetchTasks();
