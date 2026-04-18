// hooks/useChat.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { sendMessage as sendChatMessage, getChatHistory, clearChatHistory, saveChatHistory, getSessionMessages } from '../services/chat';

export const detectEmotion = (messages) => {
  if (!messages || messages.length === 0) return 'neutral';
  const combined = messages.slice(-4).map(m => m.content?.toLowerCase() || '').join(' ');
  if (/makasih|terima kasih|thanks/.test(combined)) return 'happy';
  if (/sedih|capek|lelah|kecewa|nangis/.test(combined)) return 'sad';
  if (/lucu|wkwk|haha|lol|ngakak/.test(combined)) return 'laugh';
  return 'neutral';
};

const useChat = (character) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [emotion, setEmotion] = useState('neutral');
  const [sessionId, setSessionId] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    setEmotion(detectEmotion(messages));
  }, [messages]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getChatHistory(character.id);
        if (history && history.length > 0) {
          setMessages(history);
        }
      } catch (error) {
        console.error('Load history error:', error);
      }
    };
    loadHistory();
  }, [character.id]);

  const sendMessage = useCallback(async (userInput) => {
    if (!userInput?.trim() || isLoading) return;
    const trimmedInput = userInput.trim();

    const userMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: trimmedInput,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => {
      const next = [...prev, userMessage];
      saveChatHistory(character.id, next);
      return next;
    });
    setIsLoading(true);

    try {
      const response = await sendChatMessage(character.id, trimmedInput, sessionId);
      if (response.sessionId && !sessionId) setSessionId(response.sessionId);

      const aiMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => {
        const next = [...prev, aiMessage];
        saveChatHistory(character.id, next);
        return next;
      });
    } catch (error) {
      setMessages(prev => [...prev, {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Maaf, aku sedang bermasalah. Coba lagi ya!',
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [character.id, isLoading, sessionId]);

  const loadSession = useCallback(async (sid) => {
    const msgs = await getSessionMessages(sid);
    if (msgs && msgs.length > 0) {
      setMessages(msgs.map((m, i) => ({
        id: `hist_${i}`,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      })));
      setSessionId(sid);
    }
  }, []);

  const clearChat = useCallback(async () => {
    await clearChatHistory(character.id);
    setMessages([]);
    setSessionId(null);
    setEmotion('neutral');
  }, [character.id]);

  const newChat = useCallback(async () => {
    await clearChatHistory(character.id);
    setMessages([]);
    setSessionId(null);
    setEmotion('neutral');
  }, [character.id]);

  return { messages, sendMessage, isLoading, clearChat, newChat, emotion, sessionId, loadSession };
};

export default useChat;
