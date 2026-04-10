// frontend/src/services/chat.js
import api from './api';

const STORAGE_KEY = 'mirei_chat_history';

// Kirim pesan ke backend
export const sendMessage = async (characterId, userMessage) => {
  try {
    const response = await api.post('/chat', {
      characterId: characterId,
      message: userMessage
    });
    
    // Debug: lihat response dari backend
    console.log('Backend response:', response);
    
    // 🔥 PERBAIKAN: Backend mengembalikan { success, message, provider, ... }
    if (response && response.success && response.message) {
      return { reply: response.message };
    } 
    // Fallback untuk format lama (jika ada)
    else if (response && response.reply) {
      return { reply: response.reply };
    } 
    else {
      console.error('Unknown response format:', response);
      return { reply: 'Maaf, terjadi kesalahan format response.' };
    }
  } catch (error) {
    console.error('API Error:', error);
    
    // Fallback ke mock kalau backend error
    return fallbackMockResponse(userMessage);
  }
};

// Fallback mock response (kalau backend offline)
const fallbackMockResponse = (userMessage) => {
  const lowerMsg = userMessage.toLowerCase();
  let reply = 'Maaf, server sedang sibuk. Coba lagi ya!';
  
  if (lowerMsg.includes('halo') || lowerMsg.includes('hai')) {
    reply = 'Halo juga! Maaf server sedang maintenance. Coba lagi nanti ya!';
  } else {
    reply = 'Maaf, aku sedang tidak bisa terhubung ke server. Silakan coba lagi.';
  }
  
  return { reply };
};

// Ambil history chat dari localStorage
export const getChatHistory = async (characterId) => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${characterId}`);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Get history error:', error);
    return null;
  }
};

// Simpan history ke localStorage
export const saveChatHistory = (characterId, messages) => {
  try {
    const limitedMessages = messages.slice(-50);
    localStorage.setItem(`${STORAGE_KEY}_${characterId}`, JSON.stringify(limitedMessages));
  } catch (error) {
    console.error('Save history error:', error);
  }
};

// Clear history
export const clearChatHistory = async (characterId) => {
  try {
    localStorage.removeItem(`${STORAGE_KEY}_${characterId}`);
  } catch (error) {
    console.error('Clear history error:', error);
  }
};