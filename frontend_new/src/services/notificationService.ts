import { api } from '../lib/api';
import { Notification } from '../types';
import { getNotifications, saveNotifications } from './mockDb';

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await api.get('/notifications');
      if (response.data && response.data.notifications) {
        const rawString = response.data.notifications;
        const lines = rawString
          .split('\n')
          .map((line: string) => line.replace(/^[•\s\-\*]+/g, '').trim())
          .filter(Boolean);
          
        const mappedList: Notification[] = lines.map((line: string, idx: number) => {
          let title = 'AI Insight';
          let message = line;
          let priority: 'High' | 'Medium' | 'Low' = 'Medium';
          let category: Notification['category'] = 'AI';
          
          if (line.includes(':')) {
            const parts = line.split(':');
            title = parts[0].trim();
            message = parts.slice(1).join(':').trim();
          } else {
            const words = line.split(' ');
            if (words.length > 3) {
              title = words.slice(0, 3).join(' ') + '...';
            } else {
              title = line;
            }
          }
          
          const lower = line.toLowerCase();
          if (lower.includes('high') || lower.includes('imbalance') || lower.includes('warning') || lower.includes('critical')) {
            priority = 'High';
          } else if (lower.includes('low') || lower.includes('suggested') || lower.includes('recommend')) {
            priority = 'Low';
          }
          
          if (lower.includes('task')) {
            category = 'Task';
          } else if (lower.includes('project')) {
            category = 'Project';
          } else if (lower.includes('team') || lower.includes('workload')) {
            category = 'Team';
          }
          
          return {
            id: 'n_ai_' + idx,
            title,
            message,
            time: 'Just now',
            isRead: false,
            priority,
            category
          };
        });
        
        if (mappedList.length > 0) {
          saveNotifications(mappedList);
          return mappedList;
        }
      }
      return getNotifications();
    } catch (error) {
      console.warn('Could not fetch notifications via API, pulling from local storage.', error);
      return getNotifications();
    }
  },

  markAsRead: async (id: string): Promise<Notification> => {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      if (response.data) {
        const list = getNotifications();
        const index = list.findIndex(n => n.id === id);
        if (index !== -1) {
          list[index] = response.data;
          saveNotifications(list);
        }
        return response.data;
      }
    } catch (error) {
      console.warn(`Could not update notification ${id} status via API, using local fallback.`, error);
    }

    const list = getNotifications();
    const index = list.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Notification not found');
    list[index].isRead = true;
    saveNotifications(list);
    return list[index];
  },

  markAllAsRead: async (): Promise<Notification[]> => {
    try {
      const response = await api.put('/notifications/read-all');
      if (Array.isArray(response.data)) {
        saveNotifications(response.data);
        return response.data;
      }
    } catch (error) {
      console.warn('Could not mark all notifications read via API, falling back to local operations.', error);
    }

    const list = getNotifications();
    const updated = list.map(n => ({ ...n, isRead: true }));
    saveNotifications(updated);
    return updated;
  },

  deleteNotification: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/notifications/${id}`);
    } catch (error) {
      console.warn(`Could not delete notification ${id} via API, removing from local storage.`, error);
    }
    const list = getNotifications();
    const filtered = list.filter(n => n.id !== id);
    saveNotifications(filtered);
    return true;
  },

  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await api.get('/notifications/unread-count');
      if (typeof response.data === 'number') {
        return response.data;
      }
      if (response.data && typeof response.data.count === 'number') {
        return response.data.count;
      }
    } catch (error) {
      console.warn('Could not retrieve unread count via API, computing locally.', error);
    }
    const list = getNotifications();
    return list.filter(n => !n.isRead).length;
  }
};
