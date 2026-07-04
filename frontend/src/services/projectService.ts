import { api } from '../lib/api';
import { Project } from '../types';
import { getProjects, saveProjects } from './mockDb';

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    try {
      const response = await api.get('/projects');
      if (Array.isArray(response.data)) {
        saveProjects(response.data);
        return response.data;
      }
      return getProjects();
    } catch (error) {
      console.warn('Could not fetch projects via API, falling back to local database.', error);
      return getProjects();
    }
  },

  createProject: async (project: Omit<Project, 'id' | 'progress' | 'completedTasks' | 'aiSummary'>): Promise<Project> => {
    try {
      const response = await api.post('/projects', project);
      if (response.data) {
        const list = getProjects();
        list.push(response.data);
        saveProjects(list);
        return response.data;
      }
    } catch (error) {
      console.warn('Could not create project via API, creating locally instead.', error);
    }
    
    // Fallback logic
    const list = getProjects();
    const newProject: Project = {
      ...project,
      id: 'p_' + Math.random().toString(36).substr(2, 9),
      progress: 0,
      completedTasks: 0,
      aiSummary: `AI Summary Drafted for ${project.name}: Project is currently in planning phase. Required skills and initial deliverables have been identified. Active recommendation vectors have been indexed.`
    };
    list.push(newProject);
    saveProjects(list);
    return newProject;
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
    try {
      const response = await api.put(`/projects/${id}`, updates);
      if (response.data) {
        const list = getProjects();
        const index = list.findIndex(p => p.id === id);
        if (index !== -1) {
          list[index] = response.data;
          saveProjects(list);
        }
        return response.data;
      }
    } catch (error) {
      console.warn(`Could not update project ${id} via API, applying local update fallback.`, error);
    }

    const list = getProjects();
    const index = list.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found');
    const updated = { ...list[index], ...updates };
    list[index] = updated;
    saveProjects(list);
    return updated;
  },

  deleteProject: async (id: string): Promise<void> => {
    try {
      await api.delete(`/projects/${id}`);
    } catch (error) {
      console.warn(`Could not delete project ${id} via API, performing local delete fallback.`, error);
    }
    const list = getProjects();
    const filtered = list.filter(p => p.id !== id);
    saveProjects(filtered);
  },

  getAiSummary: async (id: string): Promise<string> => {
    try {
      const response = await api.post(`/projects/${id}/summary`);
      if (response.data && response.data.summary) {
        return response.data.summary;
      }
      return response.data || 'No summary text received';
    } catch (error) {
      console.warn(`Could not generate AI project summary via API, returning local mock summary.`, error);
      const list = getProjects();
      const project = list.find(p => p.id === id);
      return project ? project.aiSummary : 'No project data found for AI summary generation.';
    }
  }
};
