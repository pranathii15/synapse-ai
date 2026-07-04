import { api } from '../lib/api';
import { Task } from '../types';
import { getTasks, saveTasks, getProjects, saveProjects } from './mockDb';

export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    try {
      const response = await api.get('/tasks');
      if (Array.isArray(response.data)) {
        saveTasks(response.data);
        return response.data;
      }
      return getTasks();
    } catch (error) {
      console.warn('Could not fetch tasks via API, falling back to local database.', error);
      return getTasks();
    }
  },

  createTask: async (task: Omit<Task, 'id' | 'code'>): Promise<Task> => {
    try {
      const response = await api.post('/tasks', task);
      if (response.data) {
        const list = getTasks();
        list.push(response.data);
        saveTasks(list);
        return response.data;
      }
    } catch (error) {
      console.warn('Could not create task via API, creating locally instead.', error);
    }

    const list = getTasks();
    const codeNum = 100 + list.length + 1;
    const newTask: Task = {
      ...task,
      id: 't_' + Math.random().toString(36).substr(2, 9),
      code: `SYN-${codeNum}`
    };
    list.push(newTask);
    saveTasks(list);
    
    // Update task counts on parent project
    const projects = getProjects();
    const pIdx = projects.findIndex(p => p.id === task.projectId);
    if (pIdx !== -1) {
      projects[pIdx].tasksCount += 1;
      saveProjects(projects);
    }

    return newTask;
  },

  updateTaskStatus: async (id: string, status: Task['status']): Promise<Task> => {
    try {
      const response = await api.put(`/tasks/${id}/status`, { status });
      if (response.data) {
        const list = getTasks();
        const index = list.findIndex(t => t.id === id);
        if (index !== -1) {
          list[index] = response.data;
          saveTasks(list);
        }
        return response.data;
      }
    } catch (error) {
      console.warn(`Could not update task status for ${id} via API, applying local fallback.`, error);
    }

    const list = getTasks();
    const index = list.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    list[index].status = status;
    if (status === 'Completed') {
      list[index].progress = 100;
    } else if (status === 'In Progress' && list[index].progress === 100) {
      list[index].progress = 50;
    }
    const updated = list[index];
    saveTasks(list);

    // Update parent project metrics
    const projects = getProjects();
    const pIdx = projects.findIndex(p => p.id === updated.projectId);
    if (pIdx !== -1) {
      const projTasks = list.filter(t => t.projectId === updated.projectId);
      const completed = projTasks.filter(t => t.status === 'Completed').length;
      projects[pIdx].completedTasks = completed;
      projects[pIdx].progress = projTasks.length > 0 
        ? Math.round((completed / projTasks.length) * 100) 
        : 0;
      saveProjects(projects);
    }

    return updated;
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    try {
      const response = await api.put(`/tasks/${id}`, updates);
      if (response.data) {
        const list = getTasks();
        const index = list.findIndex(t => t.id === id);
        if (index !== -1) {
          list[index] = response.data;
          saveTasks(list);
        }
        return response.data;
      }
    } catch (error) {
      console.warn(`Could not update task ${id} via API, applying local fallback.`, error);
    }

    const list = getTasks();
    const index = list.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    const updated = { ...list[index], ...updates };
    list[index] = updated;
    saveTasks(list);
    return updated;
  },

  deleteTask: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.warn(`Could not delete task ${id} via API, performing local fallback.`, error);
    }
    const list = getTasks();
    const filtered = list.filter(t => t.id !== id);
    saveTasks(filtered);
  },

  getDailySummary: async (): Promise<string> => {
    try {
      const response = await api.get('/tasks/daily-summary');
      if (response.data && response.data.summary) {
        return response.data.summary;
      }
      return response.data;
    } catch (error) {
      console.warn('Could not generate daily summary via API, returning local fallback.', error);
      return "AI Daily Analysis: Today, 3 high-priority tasks are active across Teams. Sarah Jenkins is optimizing LLM loss metrics (SYN-201, 30% done). Alex Rivera is at 75% on FAISS indexing tests. Workloads are dense but stable. Standard delivery targets are safe.";
    }
  }
};
