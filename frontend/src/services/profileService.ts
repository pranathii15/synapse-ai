import { api } from '../lib/api';
import { UserProfile } from '../types';
import { getUserProfile, saveUserProfile } from './mockDb';

export const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get('/me');
      const profile = response.data?.user || response.data;
      if (profile) {
        saveUserProfile(profile as UserProfile);
        return profile as UserProfile;
      }
      return getUserProfile();
    } catch (error) {
      console.warn('Could not fetch user profile via API, using stored profile.', error);
      return getUserProfile();
    }
  },

  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    const current = getUserProfile();
    const updated = { ...current, ...profile };
    saveUserProfile(updated);
    return updated;
  }
};
