import { apiUrl } from '../config.js';

async function parseJsonResponse(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text || 'Invalid JSON response');
  }
}

export async function submitEnrollment(payload) {
  const res = await fetch(apiUrl('/api/enroll'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await parseJsonResponse(res);
  if (!res.ok) {
    const err = new Error(data.error || 'Enrollment failed');
    err.details = data.details;
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function sendChatbotMessage(message) {
  const res = await fetch(apiUrl('/api/chatbot'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  const data = await parseJsonResponse(res);
  if (!res.ok) {
    throw new Error(data.error || 'Chatbot request failed');
  }
  return data;
}

export async function fetchEnrollmentStats() {
  const res = await fetch(apiUrl('/api/enroll/stats'));
  const data = await parseJsonResponse(res);
  if (!res.ok) {
    throw new Error(data.error || 'Failed to load stats');
  }
  return data;
}
