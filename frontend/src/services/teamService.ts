import { api } from '../lib/api';
import { TeamMember } from '../types';
import { getTeam, saveTeam } from './mockDb';

export const teamService = {
  getTeam: async (): Promise<TeamMember[]> => {
    try {
      const response = await api.get('/teams');
      if (Array.isArray(response.data)) {
        saveTeam(response.data);
        return response.data;
      }
      return getTeam();
    } catch (error) {
      console.warn('Could not fetch teams via API, falling back to local database.', error);
      return getTeam();
    }
  },

  createMember: async (member: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
    try {
      const response = await api.post('/teams', member);
      if (response.data) {
        const list = getTeam();
        list.push(response.data);
        saveTeam(list);
        return response.data;
      }
    } catch (error) {
      console.warn('Could not create team member via API, creating locally instead.', error);
    }

    const list = getTeam();
    const newMember: TeamMember = {
      ...member,
      id: 'm_' + Math.random().toString(36).substr(2, 9)
    };
    list.push(newMember);
    saveTeam(list);
    return newMember;
  },

  updateWorkload: async (id: string, workload: number): Promise<TeamMember> => {
    try {
      const response = await api.put(`/teams/${id}`, { current_workload: workload });
      if (response.data) {
        const list = getTeam();
        const idx = list.findIndex(m => m.id === id);
        if (idx !== -1) {
          list[idx] = response.data;
          saveTeam(list);
        }
        return response.data;
      }
    } catch (error) {
      console.warn(`Could not update workload via API for ${id}, applying local fallback.`, error);
    }

    const list = getTeam();
    const index = list.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Team member not found');
    list[index].currentWorkload = workload;
    saveTeam(list);
    return list[index];
  },

  addMember: async (teamId: string, member: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
    try {
      const response = await api.post(`/teams/${teamId}/members`, member);
      return response.data;
    } catch (error) {
      console.warn(`Could not add member to team ${teamId} via API. Adding locally instead.`, error);
      return teamService.createMember(member);
    }
  },

  removeMember: async (teamId: string, memberId: string): Promise<void> => {
    try {
      await api.delete(`/teams/${teamId}/members/${memberId}`);
    } catch (error) {
      console.warn(`Could not remove member ${memberId} from team ${teamId} via API. Deleting locally instead.`, error);
    }
    const list = getTeam();
    const filtered = list.filter(m => m.id !== memberId);
    saveTeam(filtered);
  },

  updateTeam: async (id: string, updates: Partial<TeamMember>): Promise<TeamMember> => {
    try {
      const response = await api.put(`/teams/${id}`, updates);
      return response.data;
    } catch (error) {
      console.warn(`Could not update team member ${id} via API, using local fallback.`, error);
      const list = getTeam();
      const index = list.findIndex(m => m.id === id);
      if (index === -1) throw new Error('Team member not found');
      list[index] = { ...list[index], ...updates };
      saveTeam(list);
      return list[index];
    }
  },

  deleteTeam: async (id: string): Promise<void> => {
    try {
      await api.delete(`/teams/${id}`);
    } catch (error) {
      console.warn(`Could not delete team ${id} via API, using local fallback.`, error);
    }
    const list = getTeam();
    const filtered = list.filter(m => m.id !== id);
    saveTeam(filtered);
  }
};
