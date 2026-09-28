const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getTasks() {
  if (!API_URL) {
    throw new Error(
      'API-adressen saknas. Ange EXPO_PUBLIC_API_URL i .env.local och ladda om appen.'
    );
  }

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Kunde inte hämta uppgifterna.');
  }

  return response.json();
}

export async function createTask(task) {
  if (!API_URL) {
    throw new Error(
      'API-adressen saknas. Ange EXPO_PUBLIC_API_URL i .env.local och ladda om appen.'
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
    throw new Error('Kunde inte skapa uppgiften.');
  }

  return response.json();
}

export async function updateTask(id, task) {
  if (!API_URL) {
    throw new Error(
      'API-adressen saknas. Ange EXPO_PUBLIC_API_URL i .env.local och ladda om appen.'
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
    throw new Error('Kunde inte uppdatera uppgiften.');
  }

  return response.json();
}

export async function deleteTask(id) {
  if (!API_URL) {
    throw new Error(
      'API-adressen saknas. Ange EXPO_PUBLIC_API_URL i .env.local och ladda om appen.'
    );
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Kunde inte ta bort uppgiften.');
  }
}