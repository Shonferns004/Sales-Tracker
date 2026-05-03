const apiBase = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000').replace(/\/$/, '');

export async function syncCsv(leads) {
  const response = await fetch(`${apiBase}/api/csv/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leads }),
  });

  if (!response.ok) {
    throw new Error('Failed to sync CSV.');
  }
}

export function getCsvDownloadUrl() {
  return `${apiBase}/api/csv/download`;
}
