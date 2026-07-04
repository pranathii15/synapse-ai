import { api } from '../lib/api';
import { Project, ProjectPriority, ProjectStatus } from '../types';

const mapBackendStatus = (status: string | undefined): ProjectStatus => {
  if (!status) return 'Planning';
  const normalized = status.toLowerCase();
  if (normalized === 'active' || normalized === 'in progress') return 'In Progress';
  if (normalized === 'completed') return 'Completed';
  if (normalized === 'review') return 'Review';
  if (normalized === 'planning') return 'Planning';
  return 'In Progress';
};

const mapBackendProject = (project: any): Project => ({
  id: project._id || project.id || '',
  name: project.title || project.name || 'Untitled Project',
  description: project.description || '',
  status: mapBackendStatus(project.status),
  priority: (project.priority || 'Medium') as ProjectPriority,
  progress: Number(project.progress ?? 0),
  teamSize: Number(project.teamSize ?? 3),
  tasksCount: Number(project.tasksCount ?? 0),
  completedTasks: Number(project.completedTasks ?? 0),
  dueDate: project.dueDate || '',
  category: project.category || 'General',
  aiSummary: project.aiSummary || `Project ${project.title || project.name || ''} was loaded from the backend.`
});

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(mapBackendProject);
  },

  createProject: async (project: Omit<Project, 'id' | 'progress' | 'completedTasks' | 'aiSummary'>): Promise<Project> => {
    const payload = {
      title: project.name,
      description: project.description,
    };

    const response = await api.post('/projects', payload);
    const createdId = response.data?.project_id;

    return {
      id: createdId || `p_${Math.random().toString(36).slice(2, 11)}`,
      name: project.name,
      description: project.description,
      status: mapBackendStatus(project.status),
      priority: project.priority,
      progress: 0,
      teamSize: project.teamSize,
      tasksCount: project.tasksCount,
      completedTasks: 0,
      dueDate: project.dueDate,
      category: project.category,
      aiSummary: `Project ${project.name} was created successfully.`
    };
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
    const payload: { title?: string; description?: string } = {};
    if (updates.name) payload.title = updates.name;
    if (updates.description) payload.description = updates.description;

    await api.put(`/projects/${id}`, payload);

    const projects = await projectService.getProjects();
    const updated = projects.find((project) => project.id === id);
    if (!updated) {
      throw new Error('Updated project not found');
    }
    return updated;
  },

  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  searchProjects: async (keyword: string): Promise<Project[]> => {
    const response = await api.get('/projects/search', {
      params: { keyword }
    });
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(mapBackendProject);
  },

  attachFile: async (projectId: string, filename: string): Promise<void> => {
    await api.put(`/projects/${projectId}/attach`, { filename });
  }
};
