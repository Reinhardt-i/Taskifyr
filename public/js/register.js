document.getElementById('registerForm').addEventListener('submit', register);

async function register(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const userData = { username, password };
  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to register');
    }

    alert('Registered successfully! Please login.');
    window.location.href = '/login';
  } catch (error) {
    console.error('Error registering:', error);
  }
}
