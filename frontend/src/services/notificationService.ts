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
