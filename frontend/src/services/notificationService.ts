import { api } from '../lib/api';
import { Notification } from '../types';
import { getNotifications, saveNotifications } from './mockDb';

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await api.get('/notifications');
      if (Array.isArray(response.data)) {
        saveNotifications(response.data);
        return response.data;
      }
      return getNotifications();
    } catch (error) {
      console.warn('Could not fetch notifications via API, pulling from local storage.', error);
      return getNotifications();
    }
  },

  markAsRead: async (id: string): Promise<Notification> => {
    // No backend endpoint for marking notifications as read, using local storage
    const list = getNotifications();
    const index = list.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Notification not found');
    list[index].isRead = true;
    saveNotifications(list);
    return list[index];
  },

  markAllAsRead: async (): Promise<Notification[]> => {
    // No backend endpoint for marking all notifications as read, using local storage

    const list = getNotifications();
    const updated = list.map(n => ({ ...n, isRead: true }));
    saveNotifications(updated);
    return updated;
  },

  deleteNotification: async (id: string): Promise<boolean> => {
    // No backend endpoint for deleting notifications, using local storage
    const list = getNotifications();
    const filtered = list.filter(n => n.id !== id);
    saveNotifications(filtered);
    return true;
  },

  getUnreadCount: async (): Promise<number> => {
    // No backend endpoint for unread count, computing locally
    const list = getNotifications();
    return list.filter(n => !n.isRead).length;
  }
};
