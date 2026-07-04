import { api } from '../lib/api';
import { ChatConversation, ChatMessage } from '../types';
import { getChats, saveChats } from './mockDb';

export const chatHistoryService = {
  getConversations: async (): Promise<ChatConversation[]> => {
    try {
      const response = await api.get('/chat/history');
      if (response.data) {
        const historyList = Array.isArray(response.data)
          ? response.data
          : (Array.isArray(response.data.history) ? response.data.history : null);
        if (historyList) {
          const filtered = historyList.filter((c: any) => c && c.id);
          if (filtered.length > 0) {
            saveChats(filtered);
            return filtered;
          }
        }
      }
      return getChats();
    } catch (error) {
      console.warn('Could not fetch chats via API, returning local storage conversations.', error);
      return getChats();
    }
  },

  getConversationById: async (id: string): Promise<ChatConversation | undefined> => {
    try {
      const response = await api.get('/chat/history');
      if (response.data) {
        const historyList = Array.isArray(response.data)
          ? response.data
          : (Array.isArray(response.data.history) ? response.data.history : []);
        const found = historyList.find((c: any) => c && c.id === id);
        if (found) return found;
      }
    } catch (error) {
      console.warn(`Could not get conversation ${id} via API, querying local store.`, error);
    }
    const list = getChats();
    return list.find(c => c.id === id);
  },

  createConversation: async (title: string, featureUsed: string = 'General AI'): Promise<ChatConversation> => {
    const list = getChats();
    const newChat: ChatConversation = {
      id: 'c_' + Math.random().toString(36).substr(2, 9),
      title,
      date: new Date().toISOString().split('T')[0],
      featureUsed,
      lastMessage: 'Conversation started.',
      messages: []
    };
    list.unshift(newChat);
    saveChats(list);

    try {
      await api.post('/chat/history', newChat);
    } catch (error) {
      console.warn('Could not create conversation thread via API, using local storage instead.', error);
    }

    return newChat;
  },

  addMessageToConversation: async (
    conversationId: string, 
    sender: 'user' | 'ai', 
    text: string,
    references?: string[]
  ): Promise<ChatMessage> => {
    const list = getChats();
    const index = list.findIndex(c => c.id === conversationId);
    if (index === -1) throw new Error('Conversation not found');
    
    const newMessage: ChatMessage = {
      id: 'msg_' + Math.random().toString(36).substr(2, 9),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      references
    };
    
    list[index].messages.push(newMessage);
    list[index].lastMessage = text.length > 60 ? text.substring(0, 57) + '...' : text;
    saveChats(list);

    try {
      const response = await api.post('/chat/history', list[index]);
      if (response && response.data) {
        const data = response.data;
        
        // Case 1: Backend returned full updated conversation with AI response
        if (data.messages && Array.isArray(data.messages)) {
          const aiMsgs = data.messages.filter((m: any) => m && m.sender === 'ai');
          if (aiMsgs.length > 0) {
            list[index] = data;
            saveChats(list);
            return newMessage;
          }
        }
        
        // Case 2: Backend returned direct text/answer
        const aiText = data.text || data.answer || data.response || data.ai_message;
        if (aiText && sender === 'user') {
          const aiMsg: ChatMessage = {
            id: 'msg_' + Math.random().toString(36).substr(2, 9),
            sender: 'ai',
            text: aiText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            references: data.references || []
          };
          list[index].messages.push(aiMsg);
          list[index].lastMessage = aiText.length > 60 ? aiText.substring(0, 57) + '...' : aiText;
          saveChats(list);
          
          await api.post('/chat/history', list[index]).catch(() => {});
        }
      }
    } catch (error) {
      console.warn(`Could not log chat message to API for ${conversationId}, applying local storage update.`, error);
    }

    return newMessage;
  },

  deleteConversation: async (id: string): Promise<boolean> => {
    // MongoDB documents can be deleted, but since the mock database uses array filtering
    // and we recreate/save active ones, the getConversations route handles it cleanly.
    const list = getChats();
    const filtered = list.filter(c => c.id !== id);
    saveChats(filtered);
    return true;
  }
};
