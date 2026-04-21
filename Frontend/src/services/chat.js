// frontend/src/services/chat.js
const API_BASE = 'http://localhost:3000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('mirei_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Kirim pesan ke backend
export const sendMessage = async (characterId, userMessage, sessionId) => {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        ...(sessionId ? { 'x-session-id': sessionId } : {}),
      },
      body: JSON.stringify({ message: userMessage, sessionId }),
    });
    const data = await res.json();
    if (data.success) {
      return { reply: data.message, sessionId: data.sessionId };
    }
    return { reply: 'Maaf, terjadi kesalahan.', sessionId };
  } catch (err) {
    console.error('Chat API error:', err);
    return { reply: 'Maaf, server tidak bisa dihubungi.', sessionId };
  }
};

// Ambil semua sesi riwayat chat user
export const getChatSessions = async () => {
  try {
    const res = await fetch(`${API_BASE}/chat/sessions`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    return data.success ? data.sessions : [];
  } catch (err) {
    console.error('Get sessions error:', err);
    return [];
  }
};

// Ambil pesan dalam satu sesi
export const getSessionMessages = async (sessionId) => {
  try {
    const res = await fetch(`${API_BASE}/chat/sessions/${sessionId}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    return data.success ? data.messages : [];
  } catch (err) {
    console.error('Get session messages error:', err);
    return [];
  }
};

// Hapus satu sesi
export const deleteSession = async (sessionId) => {
  try {
    await fetch(`${API_BASE}/chat/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  } catch (err) {
    console.error('Delete session error:', err);
  }
};

// Hapus semua sesi
export const deleteAllSessions = async () => {
  try {
    await fetch(`${API_BASE}/chat/sessions`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  } catch (err) {
    console.error('Delete all sessions error:', err);
  }
};

// localStorage fallback (untuk guest / tidak login)
const STORAGE_KEY = 'mirei_chat_history';

export const getChatHistory = async (characterId) => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${characterId}`);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
};

export const saveChatHistory = (characterId, messages) => {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${characterId}`, JSON.stringify(messages.slice(-50)));
  } catch {}
};

export const clearChatHistory = async (characterId) => {
  try {
    localStorage.removeItem(`${STORAGE_KEY}_${characterId}`);
  } catch {}
};
