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
