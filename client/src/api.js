const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
export async function sendMessage(userId, message) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, message })
  });
  return res.json();
}
export async function fetchHistory(userId) {
  const res = await fetch(`${API_BASE}/chat/history/${userId}`);
  return res.json();
}
