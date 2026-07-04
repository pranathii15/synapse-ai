export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'Review';
export type ProjectPriority = 'High' | 'Medium' | 'Low';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  teamSize: number;
  tasksCount: number;
  completedTasks: number;
  dueDate: string;
  category: string;
  aiSummary: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  skills: string[];
  experience: string;
  currentWorkload: number; // percentage (e.g., 75)
  avatar: string;
  currentTask?: string;
  recommendationScore?: number;
  reason?: string;
}

export type TaskStatus = 'Todo' | 'In Progress' | 'Completed';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  code: string; // e.g. SYN-124
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assigneeId: string;
  progress: number;
  projectId: string;
}

export interface Document {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
  status: 'Processing' | 'Processed' | 'Failed';
  aiSummary: string;
  category: string;
  serverFilename?: string;
}

export type NotificationPriority = 'High' | 'Medium' | 'Low';

export interface Notification {
  id: string;
  title: string;
  description: string;
  priority: NotificationPriority;
  isRead: boolean;
  time: string;
  category: 'System' | 'AI' | 'Task' | 'Project' | 'Team';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  references?: string[];
}

export interface ChatConversation {
  id: string;
  title: string;
  date: string;
  featureUsed: string; // e.g. RAG, General, Meeting Summary
  lastMessage: string;
  messages: ChatMessage[];
}

export interface UserProfile {
  name: string;
  role: string;
  email: string;
  department: string;
  skills: string[];
  experience: string;
  currentWorkload: number;
  avatar: string;
}

export interface UserSettings {
  darkMode: boolean;
  language: 'English' | 'Spanish' | 'German' | 'French' | 'Japanese';
  notificationsEnabled: boolean;
  emailDigest: boolean;
  securityMfa: boolean;
  aiCreativity: 'Balanced' | 'Creative' | 'Precise';
  aiMaxTokens: number;
}
