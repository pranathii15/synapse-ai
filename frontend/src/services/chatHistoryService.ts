import { api } from '../lib/api';
import { ChatConversation, ChatMessage } from '../types';
import { getChats, saveChats } from './mockDb';

export const chatHistoryService = {
  getConversations: async (): Promise<ChatConversation[]> => {
    return getChats();
  },

  getConversationById: async (id: string): Promise<ChatConversation | undefined> => {
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
    return newChat;
  },

  addMessageToConversation: async (
    conversationId: string, 
    sender: 'user' | 'ai', 
    text: string,
    references?: string[]
  ): Promise<ChatMessage> => {
    // Save to backend chat history
    try {
      await api.post('/chat/history', { 
        conversation_id: conversationId,
        sender, 
        text, 
        references 
      });
    } catch (error) {
      console.warn(`Could not save chat message to backend, using local fallback.`, error);
    }

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
    return newMessage;
  },

  deleteConversation: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/chats/${id}`);
    } catch (error) {
      console.warn(`Could not delete chat session ${id} via API, performing local fallback.`, error);
    }
    const list = getChats();
    const filtered = list.filter(c => c.id !== id);
    saveChats(filtered);
    return true;
  }
};
