import { api } from '../lib/api';
import { UserProfile } from '../types';
import { getUserProfile, saveUserProfile } from './mockDb';

export const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get('/profile');
      if (response.data) {
        saveUserProfile(response.data);
        return response.data;
      }
      return getUserProfile();
    } catch (error) {
      console.warn('Could not fetch user profile via API, using stored profile.', error);
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
      console.warn('Could not update profile via API, using local fallback.', error);
      const current = getUserProfile();
      const updated = { ...current, ...profile };
      saveUserProfile(updated);
      return updated;
    }
  }
};
