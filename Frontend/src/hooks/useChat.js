// hooks/useChat.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { sendMessage as sendChatMessage, getChatHistory, clearChatHistory, saveChatHistory } from '../services/chat';

const useChat = (character) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Load history saat pertama kali
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getChatHistory(character.id);
        
        if (history && history.length > 0) {
          setMessages(history);
        } else if (character.greeting) {
          setMessages([
            {
              id: `greeting_${Date.now()}`,
              role: 'assistant',
              content: character.greeting,
              timestamp: new Date().toISOString()
            }
          ]);
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

    // Tambah pesan user
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
      // Panggil service chat (sudah direname jadi sendChatMessage)
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
      setMessages([
        {
          id: `greeting_${Date.now()}`,
          role: 'assistant',
          content: character.greeting,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Clear chat error:', error);
    }
  }, [character.id, character.greeting]);

  return {
    messages,
    sendMessage,
    isLoading,
    clearChat
  };
};

export default useChat;