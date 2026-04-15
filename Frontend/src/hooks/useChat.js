// hooks/useChat.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { sendMessage as sendChatMessage, getChatHistory, clearChatHistory, saveChatHistory } from '../services/chat';

// ─── Emotion Detection ───────────────────────────────────────────
export const detectEmotion = (messages) => {
  if (!messages || messages.length === 0) return 'neutral';
  const lastFew = messages.slice(-4).map(m => m.content?.toLowerCase() || '');
  const combined = lastFew.join(' ');
  if (/makasih|terima kasih|thanks|thank you/.test(combined)) return 'happy';
  if (/sedih|capek|lelah|kecewa|nangis/.test(combined)) return 'sad';
  if (/lucu|wkwk|haha|lol|ngakak|😂|😆/.test(combined)) return 'laugh';
  return 'neutral';
};

// ─── useChat Hook ─────────────────────────────────────────────────
const useChat = (character) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [emotion, setEmotion] = useState('neutral');
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Update emotion whenever messages change
  useEffect(() => {
    setEmotion(detectEmotion(messages));
  }, [messages]);

  // Load history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getChatHistory(character.id);
        if (history && history.length > 0) {
          setMessages(history);
        } else if (character.greeting) {
          setMessages([{
            id: `greeting_${Date.now()}`,
            role: 'assistant',
            content: character.greeting,
            timestamp: new Date().toISOString()
          }]);
        }
      } catch (error) {
        console.error('Load history error:', error);
      }
    };
    loadHistory();
  }, [character.id, character.greeting]);

  const sendMessage = useCallback(async (userInput) => {
    if (!userInput || !userInput.trim()) return;
    if (isLoading) return;

    const trimmedInput = userInput.trim();

    const userMessage = {
      id: `user_${Date.now()}_${Math.random()}`,
      role: 'user',
      content: trimmedInput,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      saveChatHistory(character.id, newMessages);
      return newMessages;
    });

    setIsLoading(true);

    try {
      const response = await sendChatMessage(character.id, trimmedInput);
      const aiMessage = {
        id: `ai_${Date.now()}_${Math.random()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => {
        const newMessages = [...prev, aiMessage];
        saveChatHistory(character.id, newMessages);
        return newMessages;
      });
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Maaf, aku sedang bermasalah. Coba lagi ya!',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => {
        const newMessages = [...prev, errorMessage];
        saveChatHistory(character.id, newMessages);
        return newMessages;
      });
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [character.id, isLoading]);

  const clearChat = useCallback(async () => {
    try {
      await clearChatHistory(character.id);
      setMessages([]);
      setEmotion('neutral');
    } catch (error) {
      console.error('Clear chat error:', error);
    }
  }, [character.id]);

  const newChat = useCallback(async () => {
    try {
      await clearChatHistory(character.id);
      setMessages([]);
      setEmotion('neutral');
    } catch (error) {
      console.error('New chat error:', error);
    }
  }, [character.id]);

  return {
    messages,
    sendMessage,
    isLoading,
    clearChat,
    newChat,
    emotion,
  };
};

export default useChat;