import { 
  Project, TeamMember, Task, Document, Notification, ChatConversation, UserProfile, UserSettings 
} from '../types';

// Helper to load/save state
const loadState = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(`synapse_ai_${key}`);
  return data ? JSON.parse(data) : defaultValue;
};

const saveState = <T>(key: string, data: T): void => {
  localStorage.setItem(`synapse_ai_${key}`, JSON.stringify(data));
};

// --- INITIAL DATA ---

const initialProjects: Project[] = [
  {
    id: 'p1',
    name: 'Project Athena: Customer Intelligence Hub',
    description: 'Developing a secure customer analytics platform powered by Gemini RAG, tracking cross-channel user sentiments and churn predictions.',
    status: 'In Progress',
    priority: 'High',
    progress: 68,
    teamSize: 4,
    tasksCount: 12,
    completedTasks: 8,
    dueDate: '2026-08-15',
    category: 'AI Analytics',
    aiSummary: 'Project Athena is progressing on schedule. Sentiment engine is fully completed. Key bottleneck is the multi-lingual pipeline, which has been flagged for priority attention in the upcoming sprint.'
  },
  {
    id: 'p2',
    name: 'Synapse Core: Enterprise LLM Fine-tuning',
    description: 'Fine-tuning domain-specific deep learning models for corporate legal and compliance documentation using context-aware reinforcement learning.',
    status: 'In Progress',
    priority: 'High',
    progress: 42,
    teamSize: 5,
    tasksCount: 15,
    completedTasks: 6,
    dueDate: '2026-09-30',
    category: 'Core AI Engineering',
    aiSummary: 'Pre-training data tokenization is complete. Current loss metrics align with our target threshold of 1.2. Recommend adding one more senior engineering resource to parallelize hyperparameter search.'
  },
  {
    id: 'p3',
    name: 'Project Horizon: Cloud Multi-Region Expansion',
    description: 'Automating zero-downtime distributed Kubernetes deployments across AP-East and EU-West clusters with multi-master database sync.',
    status: 'Planning',
    priority: 'Medium',
    progress: 15,
    teamSize: 3,
    tasksCount: 8,
    completedTasks: 1,
    dueDate: '2026-11-01',
    category: 'Cloud Infrastructure',
    aiSummary: 'Initial deployment configurations have been drafted. Security reviews are underway. Team assignment recommendations indicate a gap in multi-master DB setup experience.'
  },
  {
    id: 'p4',
    name: 'Aegis: Zero-Trust Security Gateway',
    description: 'Integrating client-side and server-side mutual TLS (mTLS) configurations with automated IP rotation and real-time anomaly log screening.',
    status: 'Completed',
    priority: 'High',
    progress: 100,
    teamSize: 4,
    tasksCount: 10,
    completedTasks: 10,
    dueDate: '2026-06-25',
    category: 'Cybersecurity',
    aiSummary: 'Aegis was successfully deployed on June 25th. Logs indicate zero penetration alerts and a 42% decrease in latency overhead compared to the old proxy system.'
  }
];

const initialTeam: TeamMember[] = [
  {
    id: 'm1',
    name: 'Sarah Jenkins',
    role: 'Lead AI Scientist',
    department: 'Research & Intelligence',
    skills: ['PyTorch', 'Transformer Architectures', 'LLM Fine-tuning', 'Vector DBs'],
    experience: '7 years at OpenAI',
    currentWorkload: 85,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    currentTask: 'Optimize loss metrics on legal LLM datasets'
  },
  {
    id: 'm2',
    name: 'Dr. Alex Rivera',
    role: 'Principal RAG Engineer',
    department: 'Applied AI Systems',
    skills: ['FAISS', 'LangChain', 'Python', 'FastAPI', 'Semantic Search'],
    experience: '9 years at Microsoft Azure AI',
    currentWorkload: 65,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    currentTask: 'Implement hierarchical hybrid search retrieval'
  },
  {
    id: 'm3',
    name: 'Maya Chen',
    role: 'Senior Cloud Architect',
    department: 'Infrastructure & DevOps',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'Multi-Region Architecture'],
    experience: '6 years at Google Cloud',
    currentWorkload: 40,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    currentTask: 'Configure multi-master DB synchronization'
  },
  {
    id: 'm4',
    name: 'Marcus Vance',
    role: 'Staff Full-Stack Engineer',
    department: 'Product Systems',
    skills: ['React', 'Next.js', 'Node.js', 'Tailwind', 'WebSockets'],
    experience: '8 years at Atlassian',
    currentWorkload: 90,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    currentTask: 'Complete real-time websocket dashboard widgets'
  },
  {
    id: 'm5',
    name: 'Elena Rostova',
    role: 'Principal Security Officer',
    department: 'Cybersecurity & Compliance',
    skills: ['mTLS', 'Zero-Trust Networks', 'OAuth 2.0', 'SIEM Logs'],
    experience: '11 years at CrowdStrike',
    currentWorkload: 50,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    currentTask: 'Review Kubernetes cluster security configuration'
  }
];

const initialTasks: Task[] = [
  {
    id: 't1',
    code: 'SYN-101',
    title: 'Benchmarking FAISS Vector Indexing Metrics',
    description: 'Measure and compare retrieval speed versus recall accuracy for IVFFlat versus HNSW index structures using 1M customer query embeddings.',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2026-07-10',
    assigneeId: 'm2',
    progress: 75,
    projectId: 'p1'
  },
  {
    id: 't2',
    code: 'SYN-102',
    title: 'Deploy Athena Sentiment Engine API',
    description: 'Expose FastAPI endpoints for real-time text analysis, securing routes with standard JWT scopes.',
    status: 'Completed',
    priority: 'Medium',
    dueDate: '2026-06-30',
    assigneeId: 'm2',
    progress: 100,
    projectId: 'p1'
  },
  {
    id: 't3',
    code: 'SYN-201',
    title: 'Configure Hyperparameters for Legal LLM',
    description: 'Tune temperature, top_p, and penalties on the custom legal fine-tuning datasets to minimize hallucination rates.',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2026-07-20',
    assigneeId: 'm1',
    progress: 30,
    projectId: 'p2'
  },
  {
    id: 't4',
    code: 'SYN-202',
    title: 'Build Legal Dataset Tokenizer Pipeline',
    description: 'Process and clean 45,000 corporate agreement records into chunks suitable for LLM fine-tuning.',
    status: 'Completed',
    priority: 'High',
    dueDate: '2026-06-15',
    assigneeId: 'm1',
    progress: 100,
    projectId: 'p2'
  },
  {
    id: 't5',
    code: 'SYN-301',
    title: 'Draft Multi-Region Deployment Blueprint',
    description: 'Draft initial infrastructure blueprints using Terraform for multi-region active-active clusters.',
    status: 'Todo',
    priority: 'Medium',
    dueDate: '2026-07-28',
    assigneeId: 'm3',
    progress: 10,
    projectId: 'p3'
  },
  {
    id: 't6',
    code: 'SYN-401',
    title: 'Audit Kubernetes mTLS Configurations',
    description: 'Validate certificate authority signing cycles and automated certificate updates in core cluster.',
    status: 'Completed',
    priority: 'High',
    dueDate: '2026-06-20',
    assigneeId: 'm5',
    progress: 100,
    projectId: 'p4'
  }
];

const initialDocuments: Document[] = [
  {
    id: 'd1',
    name: 'Q3_Strategic_AI_Roadmap.pdf',
    size: '4.2 MB',
    type: 'PDF',
    uploadDate: '2026-06-28',
    status: 'Processed',
    aiSummary: 'This document defines the corporate roadmap for Q3 2026. The primary objectives are: 1. Launching Synapse Core LLM into production. 2. Upgrading multi-region security architecture (Project Aegis). 3. Expanding analytics pipelines across 4 cross-channel hubs. Highly recommended for AI-focused teams to review timeline alignments.',
    category: 'Strategic'
  },
  {
    id: 'd2',
    name: 'Zero_Trust_Architecture_Spec.pdf',
    size: '8.1 MB',
    type: 'PDF',
    uploadDate: '2026-06-15',
    status: 'Processed',
    aiSummary: 'A comprehensive technical specification outlining the mTLS authentication protocols, IP rotation tables, and ingress security measures for Project Aegis. Outlines specific compliance requirements under SOC2 Type II.',
    category: 'Technical Specs'
  },
  {
    id: 'd3',
    name: 'Employee_Onboarding_Handbook.pdf',
    size: '2.5 MB',
    type: 'PDF',
    uploadDate: '2026-05-10',
    status: 'Processed',
    aiSummary: 'Standard operational manual outlining internal team workflows, expense reimbursement processes, and secure workstation setup protocols. Non-technical but essential for HR and team alignments.',
    category: 'HR & Operations'
  }
];

const initialNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'High Resource Workload Warning',
    description: 'Marcus Vance is currently at 90% utilization due to high dashboard task assignments.',
    priority: 'High',
    isRead: false,
    time: '2026-07-03T08:30:00Z',
    category: 'Team'
  },
  {
    id: 'n2',
    title: 'AI Summary Generated for Athena',
    description: 'Gemini Agent has successfully summarized the daily developer check-ins and predicted a 2-day delivery acceleration.',
    priority: 'Low',
    isRead: false,
    time: '2026-07-02T16:45:00Z',
    category: 'AI'
  },
  {
    id: 'n3',
    title: 'Project Athena Sprint Milestone',
    description: 'Task SYN-102 (Deploy Athena Sentiment Engine) was completed by Dr. Alex Rivera.',
    priority: 'Medium',
    isRead: true,
    time: '2026-06-30T11:00:00Z',
    category: 'Project'
  },
  {
    id: 'n4',
    title: 'System Patch Completed',
    description: 'Vulnerability scanner upgraded successfully. Database read indexes refreshed across all development clusters.',
    priority: 'Low',
    isRead: true,
    time: '2026-06-29T04:15:00Z',
    category: 'System'
  }
];

const initialChats: ChatConversation[] = [
  {
    id: 'c1',
    title: 'FAISS Clustering Performance Tuning',
    date: '2026-07-02',
    featureUsed: 'Semantic Search',
    lastMessage: 'Awesome. I will implement HNSW indexing to solve this retrieval speed issue.',
    messages: [
      {
        id: 'm1_1',
        sender: 'user',
        text: 'I am seeing some latency spikes when performing semantic searches on the 1 million query dataset in Project Athena. How can I optimize FAISS retrieval speeds?',
        timestamp: '10:30 AM'
      },
      {
        id: 'm1_2',
        sender: 'ai',
        text: 'FAISS retrieval latency spikes on large datasets are usually caused by using a flat vector index (like IVF-Flat) with inadequate clustering parameters or insufficient memory. Let\'s optimize this:\n\n1. **Index Selection**: Upgrade from `IndexFlatIP` or `IndexIVFFlat` to **HNSW32 (Hierarchical Navigable Small World)**. HNSW indexes build graph links which reduce search complexity from O(N) to O(log N).\n2. **Parameter Tuning**: Set `nprobe` to a smaller value (e.g., 8 or 16) if you keep IVF. This searches fewer clusters while maintaining high precision.\n3. **Quantization**: Consider using `Product Quantization (PQ)` to compress vectors into smaller bytes, reducing RAM bandwidth bottlenecks by 4x to 8x.',
        timestamp: '10:32 AM',
        references: ['Zero_Trust_Architecture_Spec.pdf', 'Q3_Strategic_AI_Roadmap.pdf']
      },
      {
        id: 'm1_3',
        sender: 'user',
        text: 'Awesome. I will implement HNSW indexing to solve this retrieval speed issue.',
        timestamp: '10:35 AM'
      }
    ]
  },
  {
    id: 'c2',
    title: 'Meeting Intel Action Items Sync',
    date: '2026-06-30',
    featureUsed: 'Meeting Intelligence',
    lastMessage: 'Yes, tasks have been successfully linked to Project Athena.',
    messages: [
      {
        id: 'm2_1',
        sender: 'user',
        text: 'Analyze the transcript from the Q3 kickoff meeting and list the key actions for Sarah.',
        timestamp: '3:15 PM'
      },
      {
        id: 'm2_2',
        sender: 'ai',
        text: 'Based on the kickoff transcript, Sarah Jenkins has been assigned **2 critical tasks**:\n- **Task 1**: Tune fine-tuning hyperparameter grids on legal datasets (Due July 20).\n- **Task 2**: Lead cross-team alignment on model safety guardrails with Elena.\n\nI have automatically generated these draft tasks and queued them for import.',
        timestamp: '3:16 PM'
      }
    ]
  }
];

const initialUserProfile: UserProfile = {
  name: 'Marcus Vance',
  role: 'Staff Full-Stack Engineer',
  email: 'm.vance@synapse.ai',
  department: 'Product Systems',
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Node.js', 'Python', 'FastAPI'],
  experience: '8 years of building cloud-native corporate dashboards (ex-Atlassian, ex-Stripe)',
  currentWorkload: 90,
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'
};

const initialSettings: UserSettings = {
  darkMode: true,
  language: 'English',
  notificationsEnabled: true,
  emailDigest: true,
  securityMfa: true,
  aiCreativity: 'Balanced',
  aiMaxTokens: 2048
};

// --- DATA INITIALIZER ---

export const getProjects = (): Project[] => loadState('projects', initialProjects);
export const saveProjects = (p: Project[]) => saveState('projects', p);

export const getTeam = (): TeamMember[] => loadState('team', initialTeam);
export const saveTeam = (t: TeamMember[]) => saveState('team', t);

export const getTasks = (): Task[] => loadState('tasks', initialTasks);
export const saveTasks = (t: Task[]) => saveState('tasks', t);

export const getDocuments = (): Document[] => loadState('documents', initialDocuments);
export const saveDocuments = (d: Document[]) => saveState('documents', d);

export const getNotifications = (): Notification[] => loadState('notifications', initialNotifications);
export const saveNotifications = (n: Notification[]) => saveState('notifications', n);

export const getChats = (): ChatConversation[] => loadState('chats', initialChats);
export const saveChats = (c: ChatConversation[]) => saveState('chats', c);

export const getUserProfile = (): UserProfile => loadState('profile', initialUserProfile);
export const saveUserProfile = (p: UserProfile) => saveState('profile', p);

export const getSettings = (): UserSettings => loadState('settings', initialSettings);
export const saveSettings = (s: UserSettings) => saveState('settings', s);
