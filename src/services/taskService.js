import { File } from 'expo-file-system';
import { fetch as expoFetch } from 'expo/fetch';

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

export function getTaskFileUrl(fileName) {
  if (!API_URL) {
    throw new Error(
      'API URL is missing. Set EXPO_PUBLIC_API_URL in .env.local and reload the app.'
    );
  }

  return new URL(
    `/uploads/${encodeURIComponent(fileName)}`,
    API_URL
  ).toString();
}

export async function uploadTaskFile(id, file) {
  if (!API_URL) {
    throw new Error(
      'API URL is missing. Set EXPO_PUBLIC_API_URL in .env.local and reload the app.'
    );
  }

  const uploadFile = new File(file.uri);
  const formData = new FormData();

  formData.append('file', uploadFile);

  const response = await expoFetch(`${API_URL}/${id}/file`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Could not upload the file. Please try again.');
  }

  return response.json();
}
