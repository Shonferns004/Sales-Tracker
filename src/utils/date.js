export const today = () => new Date().toISOString().split('T')[0];

export function getStatus(dateStr) {
  if (!dateStr) return null;
  const currentDate = today();
  if (dateStr === currentDate) return 'today';
  if (dateStr > currentDate) return 'upcoming';
  return 'overdue';
}

export function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatDate(value) {
  return value || '-';
}
