export function formatDateForApi(date) {
  if (date === null) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}T00:00:00`;
}

export function parseDateFromApi(dateString) {
  if (!dateString) {
    return null;
  }

  const [year, month, day] = dateString.split('T')[0].split('-').map(Number);

  return new Date(year, month - 1, day);
}
