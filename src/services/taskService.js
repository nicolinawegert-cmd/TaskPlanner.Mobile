const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getTasks() {
  if (!API_URL) {
    throw new Error(
      'API URL is missing. Set EXPO_PUBLIC_API_URL in .env.local and reload the app.'
    );
  }

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Could not load tasks.');
  }

  return response.json();
}

export async function createTask(task) {
  if (!API_URL) {
    throw new Error(
      'API URL is missing. Set EXPO_PUBLIC_API_URL in .env.local and reload the app.'
    );
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error('Could not create the task.');
  }

  return response.json();
}

export async function updateTask(id, task) {
  if (!API_URL) {
    throw new Error(
      'API URL is missing. Set EXPO_PUBLIC_API_URL in .env.local and reload the app.'
    );
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error('Could not update the task.');
  }

  return response.json();
}

export async function deleteTask(id) {
  if (!API_URL) {
    throw new Error(
      'API URL is missing. Set EXPO_PUBLIC_API_URL in .env.local and reload the app.'
    );
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Could not delete the task.');
  }
}
