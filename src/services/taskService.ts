import { api } from '../lib/api';
import { Task } from '../types';
import { getTasks, saveTasks, getProjects, saveProjects } from './mockDb';

export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    try {
      const response = await api.get('/tasks');
      if (Array.isArray(response.data)) {
        const mapped: Task[] = response.data.map((t: any, idx: number) => {
          let status: Task['status'] = 'Todo';
          if (t.status === 'Completed') status = 'Completed';
          else if (t.status === 'In Progress') status = 'In Progress';

          return {
            id: t.task_id || t._id || t.id || `t_api_${idx}`,
            code: t.code || `SYN-${200 + idx}`,
            title: t.title || 'Untitled Task',
            description: t.description || '',
            status: status,
            priority: (t.priority === 'High' || t.priority === 'Medium' || t.priority === 'Low') ? t.priority : 'Medium',
            dueDate: t.dueDate || t.due_date || new Date().toISOString().split('T')[0],
            assigneeId: t.assigned_to || t.assigneeId || 'unassigned',
            progress: t.progress !== undefined ? t.progress : (status === 'Completed' ? 100 : (status === 'In Progress' ? 50 : 0)),
            projectId: t.project_id || t.projectId || ''
          };
        });
        saveTasks(mapped);
        return mapped;
      }
      return getTasks();
    } catch (error) {
      console.warn('Could not fetch tasks via API, falling back to local database.', error);
      return getTasks();
    }
  },

  createTask: async (task: Omit<Task, 'id' | 'code'>): Promise<Task> => {
    try {
      const response = await api.post('/tasks', {
        title: task.title,
        description: task.description,
        project_id: task.projectId
      });
      if (response.data && (response.data.task_id || response.data._id || response.data.id)) {
        const taskId = response.data.task_id || response.data._id || response.data.id;
        const list = getTasks();
        const codeNum = 100 + list.length + 1;
        const newTask: Task = {
          ...task,
          id: taskId,
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
      const backendStatus = status === 'Todo' ? 'Pending' : status;
      const response = await api.put(`/tasks/${id}/status`, { status: backendStatus });
      if (response.data) {
        const list = getTasks();
        const index = list.findIndex(t => t.id === id);
        const existing = list.find(t => t.id === id);
        if (existing) {
          existing.status = status;
          existing.progress = status === 'Completed' ? 100 : (status === 'In Progress' ? 50 : 0);
          if (index !== -1) {
            list[index] = existing;
            saveTasks(list);
          }
          return existing;
        }
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
      const payload: any = {};
      if (updates.title) payload.title = updates.title;
      if (updates.description) payload.description = updates.description;
      if (updates.status) payload.status = updates.status === 'Todo' ? 'Pending' : updates.status;

      const response = await api.put(`/tasks/${id}`, payload);
      
      if (updates.assigneeId) {
        await api.put(`/tasks/${id}/assign`, { assigned_to: updates.assigneeId }).catch(err => {
          console.warn('Could not update assignee on backend', err);
        });
      }

      if (response.data) {
        const list = getTasks();
        const index = list.findIndex(t => t.id === id);
        const existing = list.find(t => t.id === id);
        const updated = { ...existing, ...updates, id } as Task;
        if (index !== -1) {
          list[index] = updated;
          saveTasks(list);
        }
        return updated;
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
      const response = await api.get('/daily-summary');
      if (response.data && response.data.daily_summary) {
        return response.data.daily_summary;
      }
      return response.data?.summary || response.data;
    } catch (error) {
      console.warn('Could not generate daily summary via API, returning local fallback.', error);
      return "AI Daily Analysis: Today, 3 high-priority tasks are active across Teams. Sarah Jenkins is optimizing LLM loss metrics (SYN-201, 30% done). Alex Rivera is at 75% on FAISS indexing tests. Workloads are dense but stable. Standard delivery targets are safe.";
    }
  }
};
