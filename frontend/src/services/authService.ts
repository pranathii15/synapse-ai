import { api } from '../lib/api';
import { UserProfile, UserSettings } from '../types';
import { getUserProfile, saveUserProfile, getSettings, saveSettings } from './mockDb';

export const authService = {
  login: async (email: string, password?: string): Promise<any> => {
    try {
      const response = await api.post('/login', { email, password: password || '123456' });
      const { token, access_token } = response.data;
      const jwt = token || access_token;
      console.log(response.data);
      if (jwt) {
        localStorage.setItem('synapse_token', jwt);
        localStorage.setItem('token', jwt);
        localStorage.setItem('synapse_jwt', jwt);
      }
      return response.data;
    } catch (error) {
      console.warn('Real API login failed, falling back to mock authentication token for sandbox demo.', error);
      // Fallback for mock testing if FastAPI is offline
      const jwt = 'mock_jwt_' + Math.random().toString(36).substring(2);
      localStorage.setItem('synapse_token', jwt);
      localStorage.setItem('token', jwt);
      localStorage.setItem('synapse_jwt', jwt);
      return { access_token: jwt, email };
    }
  },

  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get('/me');
      if (response.data) {
        saveUserProfile(response.data);
        return response.data;
      }
      return getUserProfile();
    } catch (error) {
      console.warn('Could not fetch real profile, using stored local profile data.', error);
      return getUserProfile();
    }
  },

  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const response = await api.put('/profile', profile);
      if (response.data) {
        saveUserProfile(response.data);
        return response.data;
      }
      const current = getUserProfile();
      const updated = { ...current, ...profile };
      saveUserProfile(updated);
      return updated;
    } catch (error) {
      console.warn('Could not update profile via API, applying local optimistic fallback.', error);
      const current = getUserProfile();
      const updated = { ...current, ...profile };
      saveUserProfile(updated);
      return updated;
    }
  },

  getSettings: async (): Promise<UserSettings> => {
    try {
      const response = await api.get('/settings');
      if (response.data) {
        saveSettings(response.data);
        return response.data;
      }
      return getSettings();
    } catch (error) {
      console.warn('Could not fetch settings via API, using stored settings.', error);
      return getSettings();
    }
  },

  updateSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    try {
      const response = await api.put('/settings', settings);
      if (response.data) {
        saveSettings(response.data);
        return response.data;
      }
      const current = getSettings();
      const updated = { ...current, ...settings };
      saveSettings(updated);
      return updated;
    } catch (error) {
      console.warn('Could not update settings via API, applying local fallback.', error);
      const current = getSettings();
      const updated = { ...current, ...settings };
      saveSettings(updated);
      return updated;
    }
  },

  logout: async (): Promise<boolean> => {
    localStorage.removeItem('synapse_token');
    localStorage.removeItem('token');
    localStorage.removeItem('synapse_jwt');
    try {
      await api.post('/logout');
    } catch (e) {
      console.log('Backend logout call skipped.');
    }
    return true;
  }
};
