import { api } from '../lib/api';
import { UserProfile, UserSettings } from '../types';
import { getUserProfile, saveUserProfile, getSettings, saveSettings } from './mockDb';

const persistToken = (token: string) => {
  localStorage.setItem('synapse_token', token);
  localStorage.setItem('token', token);
  localStorage.setItem('synapse_jwt', token);
  sessionStorage.setItem('synapse_token', token);
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('synapse_jwt', token);
};

export const authService = {
  login: async (email: string, password?: string): Promise<any> => {
    const normalizedEmail = (email || 'pranathi@example.com').trim() || 'pranathi@example.com';
    const normalizedPassword = password && password !== '••••••••' ? password : '123456';

    const response = await api.post('/login', { email: normalizedEmail, password: normalizedPassword });
    const payload = response.data || {};
    const jwt = payload.access_token || payload.token;

    if (jwt) {
      persistToken(jwt);
    }

    return {
      ...payload,
      access_token: payload.access_token || jwt,
      token: payload.token || jwt,
    };
  },

  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get('/me');
      const profile = response.data?.user || response.data;
      if (profile) {
        saveUserProfile(profile);
        return profile as UserProfile;
      }
      return getUserProfile();
    } catch (error) {
      console.warn('Could not fetch real profile, using stored local profile data.', error);
      return getUserProfile();
    }
  },

  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    const current = getUserProfile();
    const updated = { ...current, ...profile };
    saveUserProfile(updated);
    return updated;
  },

  getSettings: async (): Promise<UserSettings> => {
    return getSettings();
  },

  updateSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    const current = getSettings();
    const updated = { ...current, ...settings };
    saveSettings(updated);
    return updated;
  },

  logout: async (): Promise<boolean> => {
    localStorage.removeItem('synapse_token');
    localStorage.removeItem('token');
    localStorage.removeItem('synapse_jwt');
    sessionStorage.removeItem('synapse_token');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('synapse_jwt');
    try {
      await api.post('/logout');
    } catch (e) {
      console.log('Backend logout call skipped.');
    }
    return true;
  }
};
