import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  X, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  Users,
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  AlertTriangle,
  Lightbulb,
  Search,
  Filter,
  Check,
  MoreHorizontal,
  Tag,
  ChevronDown,
  User,
  List,
  LayoutGrid,
  Trash2,
  Edit3,
  Paperclip,
  MessageSquare,
  TrendingUp,
  FolderKanban,
  Eye,
  Activity,
  CheckSquare,
  CornerDownRight,
  SlidersHorizontal,
  CalendarDays,
  Shield,
  Clock3,
  CheckSquare2,
  CalendarRange
} from 'lucide-react';
import { Task, TeamMember, Project, TaskStatus, TaskPriority } from '../types';
import Button from './Button';

interface TasksViewProps {
  tasks: Task[];
  team: TeamMember[];
  projects: Project[];
  onAddTask: (task: Omit<Task, 'id' | 'code'>) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
}

export default function TasksView({ 
  tasks: initialTasks, 
  team, 
  projects, 
  onAddTask, 
  onUpdateStatus 
}: TasksViewProps) {
  // State for active layout view
  const [viewMode, setViewMode] = useState<'board' | 'list' | 'calendar'>('board');
  
  // Tab-based navigation state
  const [activeTaskTab, setActiveTaskTab] = useState<'all' | 'my' | 'pending' | 'inprogress' | 'completed' | 'high'>('all');
  
  // Dialog / Drawer states
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDrawerEditing, setIsDrawerEditing] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | TaskStatus>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | TaskPriority>('All');
  const [projectFilter, setProjectFilter] = useState<string>('All');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority' | 'deadline' | 'project'>('newest');

  // Form states for creating a task
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAssignee, setNewAssignee] = useState(team[0]?.id || '');
  const [newProject, setNewProject] = useState(projects[0]?.id || '');
  const [newPriority, setNewPriority] = useState<TaskPriority>('Medium');
  const [newDueDate, setNewDueDate] = useState('2026-07-15');

  // Local overrides state to support live modifications of properties like description, progress, checklist, etc.
  const [localTasksOverride, setLocalTasksOverride] = useState<Record<string, Partial<Task>>>({});
  const [deletedTaskIds, setDeletedTaskIds] = useState<Set<string>>(new Set());

  // Interactive local comments thread mapped by Task ID
  const [taskComments, setTaskComments] = useState<Record<string, { id: string; author: string; avatar: string; text: string; time: string }[]>>({
    'SYN-101': [
      { id: '1', author: 'Dr. Alex Rivera', avatar: team[0]?.avatar || '', text: 'Initial bench tests are showing positive throughput improvements.', time: '2 hours ago' },
      { id: '2', author: 'AI Assistant', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&h=100&q=80', text: 'Velocity projection suggests completing 4 hours ahead of schedule.', time: '1 hour ago' }
    ],
    'SYN-201': [
      { id: '1', author: 'Dr. Alex Rivera', avatar: team[0]?.avatar || '', text: 'Database lock contention detected. Working to narrow down query logs.', time: '4 hours ago' }
    ]
  });
  const [newCommentText, setNewCommentText] = useState('');

  // Interactive local checklists mapped by Task ID
  const [taskChecklists, setTaskChecklists] = useState<Record<string, { id: string; text: string; checked: boolean }[]>>({
    'SYN-101': [
      { id: 'c1', text: 'Configure benchmark loops', checked: true },
      { id: 'c2', text: 'Generate performance profiles', checked: false },
      { id: 'c3', text: 'Review security telemetry logs', checked: false }
    ],
    'SYN-201': [
      { id: 'c1', text: 'Isolate connection pool driver', checked: true },
      { id: 'c2', text: 'Increase max active connections threshold', checked: false },
      { id: 'c3', text: 'Test reconnection retry logic under load', checked: false }
    ]
  });
  const [newCheckItemText, setNewCheckItemText] = useState('');

  // AI Insight detailed text expansion state
  const [activeAiInsight, setActiveAiInsight] = useState<{ title: string; desc: string; type: 'insight' | 'bottleneck' | 'suggestion' } | null>(null);

  // Apply local modifications & filter out deleted tasks
  const tasks = initialTasks
    .map(t => {
      const override = localTasksOverride[t.id];
      return override ? { ...t, ...override } : t;
    })
    .filter(t => !deletedTaskIds.has(t.id));

  // Pre-calculate statistics
  const totalCount = tasks.length;
  const todoCount = tasks.filter(t => t.status === 'Todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const pendingCount = todoCount + inProgressCount;
  const highPriorityCount = tasks.filter(t => t.priority === 'High').length;

  // Overdue: Due date before today (2026-07-03) and not Completed
  const todayStr = '2026-07-03';
  const overdueCount = tasks.filter(t => t.status !== 'Completed' && t.dueDate < todayStr).length;

  // Assigned to me: assume first team member's ID
  const meId = team.find(m => m.name.includes('Rivera'))?.id || team[0]?.id || '';
  const assignedToMeCount = tasks.filter(t => t.assigneeId === meId).length;

  // Filter and sort the final tasks list
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    const matchesProject = projectFilter === 'All' || task.projectId === projectFilter;
    const matchesAssignee = assigneeFilter === 'All' || task.assigneeId === assigneeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesAssignee;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return b.code.localeCompare(a.code);
    }
    if (sortBy === 'oldest') {
      return a.code.localeCompare(b.code);
    }
    if (sortBy === 'priority') {
      const priorityWeight = { High: 3, Medium: 2, Low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    if (sortBy === 'deadline') {
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (sortBy === 'project') {
      const projA = projects.find(p => p.id === a.projectId)?.name || '';
      const projB = projects.find(p => p.id === b.projectId)?.name || '';
      return projA.localeCompare(projB);
    }
    return 0;
  });

  // Pre-calculate tab-specific counts based on filteredTasks to keep in sync with active searches/filters
  const countAll = filteredTasks.length;
  const countMy = filteredTasks.filter(t => t.assigneeId === meId).length;
  const countPending = filteredTasks.filter(t => t.status === 'Todo' || t.status === 'In Progress').length;
  const countInProgress = filteredTasks.filter(t => t.status === 'In Progress').length;
  const countCompleted = filteredTasks.filter(t => t.status === 'Completed').length;
  const countHigh = filteredTasks.filter(t => t.priority === 'High').length;

  // Filter tasks based on selected tab navigation
  const displayTasks = filteredTasks.filter(task => {
    if (activeTaskTab === 'my') {
      return task.assigneeId === meId;
    }
    if (activeTaskTab === 'pending') {
      return task.status === 'Todo' || task.status === 'In Progress';
    }
    if (activeTaskTab === 'inprogress') {
      return task.status === 'In Progress';
    }
    if (activeTaskTab === 'completed') {
      return task.status === 'Completed';
    }
    if (activeTaskTab === 'high') {
      return task.priority === 'High';
    }
    return true; // 'all'
  });

  const hasActiveFilters = 
    searchQuery !== '' || 
    statusFilter !== 'All' || 
    priorityFilter !== 'All' || 
    projectFilter !== 'All' || 
    assigneeFilter !== 'All';

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setProjectFilter('All');
    setAssigneeFilter('All');
  };

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) {
      alert('Please fill out all required fields');
      return;
    }

    onAddTask({
      title: newTitle,
      description: newDesc,
      status: 'Todo',
      priority: newPriority,
      dueDate: newDueDate,
      assigneeId: newAssignee,
      progress: 0,
      projectId: newProject
    });

    // Reset fields
    setNewTitle('');
    setNewDesc('');
    setNewAssignee(team[0]?.id || '');
    setNewProject(projects[0]?.id || '');
    setNewPriority('Medium');
    setNewDueDate('2026-07-15');
    setIsCreateModalOpen(false);
  };

  // Helper to handle local changes
  const updateLocalTaskField = (taskId: string, field: keyof Task, value: any) => {
    setLocalTasksOverride(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value
      }
    }));
    
    // Also sync the drawer state in real time
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  // Local comment submit
  const handleAddComment = (taskId: string) => {
    if (!newCommentText.trim()) return;
    const author = 'Dr. Alex Rivera'; // Logged-in user mockup
    const avatar = team[0]?.avatar || '';
    
    const newComment = {
      id: Date.now().toString(),
      author,
      avatar,
      text: newCommentText,
      time: 'Just now'
    };

    setTaskComments(prev => ({
      ...prev,
      [taskId]: [...(prev[taskId] || []), newComment]
    }));
    setNewCommentText('');
  };

  // Local checklist interactions
  const handleToggleCheckItem = (taskId: string, itemId: string) => {
    setTaskChecklists(prev => {
      const items = prev[taskId] || [];
      const updated = items.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item);
      
      // Auto update progress based on checklist ratio
      const checkedCount = updated.filter(i => i.checked).length;
      const progressPercent = Math.round((checkedCount / updated.length) * 100);
      updateLocalTaskField(taskId, 'progress', progressPercent);

      return {
        ...prev,
        [taskId]: updated
      };
    });
  };

  const handleAddCheckItem = (taskId: string) => {
    if (!newCheckItemText.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      text: newCheckItemText,
      checked: false
    };

    setTaskChecklists(prev => {
      const updated = [...(prev[taskId] || []), newItem];
      
      // Recalculate progress
      const checkedCount = updated.filter(i => i.checked).length;
      const progressPercent = Math.round((checkedCount / updated.length) * 100);
      updateLocalTaskField(taskId, 'progress', progressPercent);

      return {
        ...prev,
        [taskId]: updated
      };
    });
    setNewCheckItemText('');
  };

  const handleDeleteTaskLocal = (taskId: string) => {
    setDeletedTaskIds(prev => {
      const updated = new Set(prev);
      updated.add(taskId);
      return updated;
    });
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  // Pre-configured list of checklists for dynamic fallback
  const getTaskChecklist = (taskId: string) => {
    if (taskChecklists[taskId]) {
      return taskChecklists[taskId];
    }
    return [
      { id: 'd1', text: 'Analyze specification logs', checked: false },
      { id: 'd2', text: 'Implement backend core components', checked: false },
      { id: 'd3', text: 'Review performance bottlenecks & unit test', checked: false }
    ];
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto select-none relative pb-16 font-sans text-left">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            <span>Workspace</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-indigo-600">Tasks</span>
          </div>
          <h2 className="text-2xl font-bold text-[#223B63] tracking-tight">Tasks</h2>
          <p className="text-xs text-[#6B7D94] font-medium mt-0.5">Track and manage your team's work efficiently.</p>
        </div>
        
        <div className="flex items-center gap-2.5">
          {/* Layout Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/40">
            <button 
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'board' ? 'bg-white text-[#223B63] shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              title="Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'list' ? 'bg-white text-[#223B63] shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'calendar' ? 'bg-white text-[#223B63] shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              title="Calendar View"
            >
              <CalendarDays className="w-4 h-4" />
            </button>
          </div>

          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            icon={Plus}
            size="sm"
            className="shadow-sm font-bold h-9"
          >
            New Task
          </Button>
        </div>
      </div>

      {/* 2. STATISTIC CARDS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
        {[
          { label: 'Total Tasks', value: totalCount, icon: FolderKanban, color: 'text-slate-600 bg-slate-50 border-slate-200/60' },
          { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-600 bg-amber-50/50 border-amber-100' },
          { label: 'In Progress', value: inProgressCount, icon: Activity, color: 'text-indigo-600 bg-indigo-50/40 border-indigo-100' },
          { label: 'Completed', value: completedCount, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50/40 border-emerald-100' },
          { label: 'High Priority', value: highPriorityCount, icon: AlertTriangle, color: 'text-rose-600 bg-rose-50/40 border-rose-100' },
          { label: 'Overdue', value: overdueCount, icon: AlertCircle, color: overdueCount > 0 ? 'text-red-700 bg-red-50 border-red-200' : 'text-slate-400 bg-slate-50/50 border-slate-200/30' },
          { label: 'Assigned to Me', value: assignedToMeCount, icon: User, color: 'text-teal-600 bg-teal-50/40 border-teal-100' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={idx}
              whileHover={{ y: -2 }}
              className={`p-3 rounded-2xl border flex flex-col justify-between transition-all shadow-xs ${stat.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-tight opacity-80 uppercase">{stat.label}</span>
                <Icon className="w-3.5 h-3.5 opacity-70" />
              </div>
              <span className="text-xl font-extrabold tracking-tight mt-2">{stat.value}</span>
            </motion.div>
          );
        })}
      </div>

      {/* 3. AI COMPACT INSIGHTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sprint Insight */}
        <div className="p-3.5 rounded-2xl border border-[#DCE6F4] bg-white hover:bg-slate-50/40 transition-colors flex items-start gap-3 h-[96px] text-left">
          <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div className="space-y-1 min-w-0">
            <span className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-widest block">🟣 Sprint Insight</span>
            <p className="text-[11px] text-[#4E6485] font-semibold line-clamp-2 leading-relaxed">
              Benchmarking metrics (SYN-101) is on track. High correlation to Aegis gateway completions.
            </p>
            <button 
              onClick={() => setActiveAiInsight({
                title: "Sprint Insight: SYN-101 Benchmarks",
                desc: "SYN-101 (Benchmarking metrics) is moving with high velocity. The AI agent recommends initializing early compliance audit cycles for Aegis gateway protocols to prevent downstream approval blocks.",
                type: "insight"
              })}
              className="text-[10px] font-extrabold text-indigo-600 hover:underline inline-flex items-center gap-0.5"
            >
              View Details <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Bottleneck */}
        <div className="p-3.5 rounded-2xl border border-[#DCE6F4] bg-white hover:bg-slate-50/40 transition-colors flex items-start gap-3 h-[96px] text-left">
          <div className="p-2 bg-amber-50 rounded-xl text-amber-600 shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="space-y-1 min-w-0">
            <span className="text-[9px] font-extrabold text-amber-600 uppercase tracking-widest block">🟠 Bottleneck</span>
            <p className="text-[11px] text-[#4E6485] font-semibold line-clamp-2 leading-relaxed">
              SYN-201 (Fix database connection) is at 30% progress. Assign Dr. Alex Rivera to assist.
            </p>
            <button 
              onClick={() => setActiveAiInsight({
                title: "Bottleneck Alert: SYN-201 DB Connection",
                desc: "SYN-201 (Fix database connection) has been stuck at 30% for over 48 hours. Dr. Alex Rivera's skillset directly aligns with database optimization; routing 15% of his bandwidth could clear this bottleneck instantly.",
                type: "bottleneck"
              })}
              className="text-[10px] font-extrabold text-amber-600 hover:underline inline-flex items-center gap-0.5"
            >
              View Details <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Suggestion */}
        <div className="p-3.5 rounded-2xl border border-[#DCE6F4] bg-white hover:bg-slate-50/40 transition-colors flex items-start gap-3 h-[96px] text-left">
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="space-y-1 min-w-0">
            <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-widest block">🟢 AI Suggestion</span>
            <p className="text-[11px] text-[#4E6485] font-semibold line-clamp-2 leading-relaxed">
              Rivera completes SYN-101 tomorrow morning, freeing bandwidth for pending pipeline.
            </p>
            <button 
              onClick={() => setActiveAiInsight({
                title: "AI Suggestion: Bandwidth Allocation",
                desc: "Predictive model forecasts SYN-101 completion tomorrow at 10:30 AM. Dr. Rivera can immediately assume ownership of SYN-201 or review open compliance drafts in the Aegis audit pipeline.",
                type: "suggestion"
              })}
              className="text-[10px] font-extrabold text-emerald-600 hover:underline inline-flex items-center gap-0.5"
            >
              View Details <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. SEARCH, FILTERS & SORT BAR (Sticky Toolbar) */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border border-[#DCE6F4] rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          
          {/* Search */}
          <div className="relative w-full max-w-xs shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search code, title or desc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white text-xs text-slate-800 placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#6F819C] font-semibold">Status:</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-700 focus:outline-none hover:bg-slate-100/60 cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#6F819C] font-semibold">Priority:</span>
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-700 focus:outline-none hover:bg-slate-100/60 cursor-pointer"
            >
              <option value="All">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Project Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#6F819C] font-semibold">Project:</span>
            <select 
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-700 focus:outline-none hover:bg-slate-100/60 cursor-pointer max-w-[140px] truncate"
            >
              <option value="All">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name.split(':')[0]}</option>
              ))}
            </select>
          </div>

          {/* Assignee Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#6F819C] font-semibold">Assignee:</span>
            <select 
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-700 focus:outline-none hover:bg-slate-100/60 cursor-pointer max-w-[140px] truncate"
            >
              <option value="All">All Members</option>
              {team.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 text-xs shrink-0">
          <span className="text-[#6F819C] font-semibold">Sort By:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-700 focus:outline-none hover:bg-slate-100/60 cursor-pointer"
          >
            <option value="newest">Newest Code</option>
            <option value="oldest">Oldest Code</option>
            <option value="priority">Priority</option>
            <option value="deadline">Deadline</option>
            <option value="project">Project Name</option>
          </select>
        </div>
      </div>

      {/* Active Filters Row */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-xs bg-slate-100/60 p-2.5 rounded-xl border border-slate-200/50">
          <span className="text-slate-500 font-semibold">Active Filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold">
              Query: "{searchQuery}"
              <X className="w-3 h-3 text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => setSearchQuery('')} />
            </span>
          )}
          {statusFilter !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold">
              Status: {statusFilter}
              <X className="w-3 h-3 text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => setStatusFilter('All')} />
            </span>
          )}
          {priorityFilter !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold">
              Priority: {priorityFilter}
              <X className="w-3 h-3 text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => setPriorityFilter('All')} />
            </span>
          )}
          {projectFilter !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold">
              Project: {projects.find(p => p.id === projectFilter)?.name.split(':')[0]}
              <X className="w-3 h-3 text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => setProjectFilter('All')} />
            </span>
          )}
          {assigneeFilter !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold">
              Assignee: {team.find(m => m.id === assigneeFilter)?.name}
              <X className="w-3 h-3 text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => setAssigneeFilter('All')} />
            </span>
          )}
          <button 
            onClick={handleClearFilters}
            className="text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer ml-auto text-[11px]"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* 5. PRIMARY CONTENT CONTAINER */}
      <div className="space-y-6">
        {/* Tab Navigation System */}
        <div className="bg-slate-100/80 p-1 rounded-xl border border-slate-200/50 flex items-center overflow-x-auto scrollbar-none gap-1 sm:gap-2 select-none">
          {[
            { id: 'all' as const, label: 'All Tasks', icon: '📋', count: countAll },
            { id: 'my' as const, label: 'My Tasks', icon: '📝', count: countMy },
            { id: 'pending' as const, label: 'Pending', icon: '⏳', count: countPending },
            { id: 'inprogress' as const, label: 'In Progress', icon: '🚀', count: countInProgress },
            { id: 'completed' as const, label: 'Completed', icon: '✅', count: countCompleted },
            { id: 'high' as const, label: 'High Priority', icon: '🔴', count: countHigh },
          ].map((tab) => {
            const isActive = activeTaskTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTaskTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap focus:outline-none ${
                  isActive 
                    ? 'text-white shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTaskTabHighlight"
                    className="absolute inset-0 bg-indigo-600 rounded-lg -z-10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] transition-colors ${
                  isActive 
                    ? 'bg-white/20 text-white font-extrabold' 
                    : 'bg-slate-200 text-slate-500 font-semibold'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {viewMode === 'board' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'Todo' as TaskStatus, label: 'Todo', color: 'bg-slate-100/50 border-slate-200 text-slate-500', dot: 'bg-slate-400' },
              { id: 'In Progress' as TaskStatus, label: 'In Progress', color: 'bg-blue-50/30 border-blue-100 text-[#223B63]', dot: 'bg-blue-500' },
              { id: 'Completed' as TaskStatus, label: 'Completed', color: 'bg-emerald-50/30 border-emerald-100 text-emerald-700', dot: 'bg-emerald-500' }
            ].map((col) => {
              const colTasks = displayTasks.filter(t => t.status === col.id);
              return (
                <div 
                  key={col.id}
                  className={`rounded-2xl border p-4 flex flex-col min-h-[550px] transition-all ${col.color}`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/40">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                      <span className="text-xs font-bold tracking-wider text-slate-600 uppercase">{col.label}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 border border-slate-200">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Tasks Scrollable Container */}
                  <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[600px] pr-1">
                    {colTasks.length === 0 ? (
                      <div className="py-16 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-white/50 font-semibold">
                        No tasks in this column
                      </div>
                    ) : (
                      colTasks.map((task) => {
                        const assignee = team.find(m => m.id === task.assigneeId);
                        const project = projects.find(p => p.id === task.projectId);
                        
                        return (
                          <motion.div
                            key={task.id}
                            layoutId={task.id}
                            onClick={() => setSelectedTask(task)}
                            whileHover={{ y: -3, scale: 1.01 }}
                            className="p-4 rounded-xl border border-[#DCE6F4] bg-white hover:border-indigo-500/40 cursor-pointer text-left transition-all space-y-3.5 group shadow-xs hover:shadow-md duration-300 relative"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono text-slate-400 font-bold tracking-widest bg-slate-50 px-1.5 py-0.5 rounded">
                                {task.code}
                              </span>
                              
                              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                                task.priority === 'High' 
                                  ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                                  : task.priority === 'Medium' 
                                  ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                                  : 'bg-slate-50 text-slate-500 border border-slate-100'
                              }`}>
                                {task.priority} Priority
                              </span>
                            </div>

                            <div>
                              <h4 className="text-xs font-bold text-[#223B63] group-hover:text-indigo-600 transition-colors line-clamp-1 leading-snug">
                                {task.title}
                              </h4>
                              <p className="text-[11px] text-[#4E6485] line-clamp-2 leading-relaxed font-semibold mt-1">
                                {task.description}
                              </p>
                            </div>

                            {/* Project Tag */}
                            {project && (
                              <div className="text-[9px] text-[#6F819C] font-extrabold uppercase tracking-wider truncate inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                                <Tag className="w-2.5 h-2.5 text-indigo-500" />
                                {project.name.split(':')[0]}
                              </div>
                            )}

                            {/* Estimated Time & Progress Bar */}
                            <div className="space-y-1.5 pt-1.5">
                              <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Clock3 className="w-3 h-3 text-slate-400" /> Est: 4h
                                </span>
                                <span>{task.progress}% Done</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    task.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-500'
                                  }`}
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>
                            </div>

                            {/* Card Footer Details */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 bg-white">
                              {assignee ? (
                                <div className="flex items-center gap-1.5">
                                  <img 
                                    src={assignee.avatar} 
                                    alt={assignee.name} 
                                    referrerPolicy="no-referrer"
                                    className="w-5 h-5 rounded-full border border-slate-200 bg-slate-50 shadow-2xs"
                                  />
                                  <span className="text-[10px] text-[#4E6485] font-bold">{assignee.name}</span>
                                </div>
                              ) : (
                                <div className="w-5" />
                              )}

                              {/* Task Movement & Delete controls */}
                              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <button 
                                  onClick={() => handleDeleteTaskLocal(task.id)}
                                  className="p-1 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors border border-transparent hover:border-rose-100 cursor-pointer mr-1"
                                  title="Delete Task"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                {col.id !== 'Todo' && (
                                  <button 
                                    onClick={() => {
                                      const prev = col.id === 'Completed' ? 'In Progress' : 'Todo';
                                      onUpdateStatus(task.id, prev);
                                    }}
                                    className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                                    title="Move Backward"
                                  >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {col.id !== 'Completed' && (
                                  <button 
                                    onClick={() => {
                                      const next = col.id === 'Todo' ? 'In Progress' : 'Completed';
                                      onUpdateStatus(task.id, next);
                                    }}
                                    className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                                    title="Move Forward"
                                  >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="bg-white border border-[#DCE6F4] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#DCE6F4] bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-[#6F819C]">
                    <th className="py-3.5 px-4">Task ID</th>
                    <th className="py-3.5 px-4">Title</th>
                    <th className="py-3.5 px-4">Project</th>
                    <th className="py-3.5 px-4">Assignee</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Progress</th>
                    <th className="py-3.5 px-4">Due Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {displayTasks.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-16 text-center text-[11px] text-slate-400 font-semibold bg-white">
                        No tasks match the filter criteria
                      </td>
                    </tr>
                  ) : (
                    displayTasks.map((task) => {
                      const assignee = team.find(m => m.id === task.assigneeId);
                      const project = projects.find(p => p.id === task.projectId);
                      
                      return (
                        <tr 
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className="hover:bg-slate-50/50 cursor-pointer transition-colors group"
                        >
                          <td className="py-4 px-4 font-mono font-bold text-slate-400 text-[10px] tracking-wider">
                            {task.code}
                          </td>
                          <td className="py-4 px-4 font-bold text-[#223B63] group-hover:text-indigo-600 transition-colors">
                            {task.title}
                          </td>
                          <td className="py-4 px-4 text-[#4E6485] font-semibold">
                            {project ? project.name.split(':')[0] : 'N/A'}
                          </td>
                          <td className="py-4 px-4">
                            {assignee ? (
                              <div className="flex items-center gap-1.5">
                                <img 
                                  src={assignee.avatar} 
                                  alt={assignee.name} 
                                  referrerPolicy="no-referrer"
                                  className="w-5 h-5 rounded-full border border-slate-200"
                                />
                                <span className="font-bold text-[#4E6485]">{assignee.name}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-medium">-</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-md ${
                              task.priority === 'High' 
                                ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                                : task.priority === 'Medium' 
                                ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                                : 'bg-slate-50 text-slate-500 border border-slate-100'
                            }`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-4 px-4 w-32">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
                                <span>{task.progress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    task.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-500'
                                  }`}
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-slate-500 font-bold font-mono text-[10px]">
                            {task.dueDate}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                              task.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : task.status === 'In Progress'
                                ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                : 'bg-slate-50 text-slate-500 border border-slate-200'
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${
                                task.status === 'Completed' ? 'bg-emerald-500' : task.status === 'In Progress' ? 'bg-indigo-500' : 'bg-slate-400'
                              }`} />
                              {task.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button 
                                onClick={() => handleDeleteTaskLocal(task.id)}
                                className="p-1 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors border border-transparent hover:border-rose-100 cursor-pointer"
                                title="Delete Task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              {task.status !== 'Todo' && (
                                <button 
                                  onClick={() => {
                                    const prev = task.status === 'Completed' ? 'In Progress' : 'Todo';
                                    onUpdateStatus(task.id, prev);
                                  }}
                                  className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {task.status !== 'Completed' && (
                                <button 
                                  onClick={() => {
                                    const next = task.status === 'Todo' ? 'In Progress' : 'Completed';
                                    onUpdateStatus(task.id, next);
                                  }}
                                  className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === 'calendar' && (() => {
          // Displaying Calendar for July 2026 (Since default task deadlines center around July 2026)
          const daysInMonth = 31;
          const startDayOffset = 3; // July 1, 2026 is a Wednesday (index 3)
          const days = [];
          
          for (let i = 0; i < startDayOffset; i++) {
            days.push(null);
          }
          for (let d = 1; d <= daysInMonth; d++) {
            days.push(d);
          }
          
          const getDayStr = (dayNum: number) => {
            return `2026-07-${dayNum.toString().padStart(2, '0')}`;
          };

          return (
            <div className="bg-white border border-[#DCE6F4] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                  <CalendarRange className="w-4.5 h-4.5 text-indigo-500" />
                  <h4 className="font-bold text-[#223B63] text-sm md:text-base">July 2026 Timeline</h4>
                </div>
                <div className="flex items-center gap-2.5 text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400" /> Todo</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> In Progress</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed</span>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2.5 text-center text-xs font-bold text-[#6F819C] py-1 border-b border-slate-50">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
              
              <div className="grid grid-cols-7 gap-2.5">
                {days.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="aspect-square bg-slate-50/30 rounded-xl border border-dashed border-slate-100" />;
                  }
                  
                  const dateStr = getDayStr(day);
                  const dayTasks = displayTasks.filter(t => t.dueDate === dateStr);
                  const isToday = day === 3; // July 3, 2026 is today
                  
                  return (
                    <div 
                      key={`day-${day}`} 
                      className={`min-h-[100px] p-2 rounded-xl border flex flex-col justify-between transition-all hover:bg-slate-50/80 ${
                        isToday ? 'bg-indigo-50/30 border-indigo-200' : 'bg-white border-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-bold ${isToday ? 'text-indigo-600 bg-indigo-100/50 w-5 h-5 rounded-full flex items-center justify-center font-extrabold' : 'text-slate-500'}`}>
                          {day}
                        </span>
                        {dayTasks.length > 0 && (
                          <span className="text-[9px] font-extrabold text-slate-400">
                            {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1 flex-1 overflow-y-auto max-h-[70px] pr-0.5">
                        {dayTasks.map(t => (
                          <div 
                            key={t.id}
                            onClick={() => setSelectedTask(t)}
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded truncate cursor-pointer transition-all hover:translate-x-0.5 ${
                              t.status === 'Completed' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                : t.status === 'In Progress'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                : 'bg-slate-50 text-slate-600 border border-slate-200'
                            }`}
                            title={`${t.code}: ${t.title}`}
                          >
                            {t.code}: {t.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

      {/* 6. TASK INSPECT RIGHT-SIDE DRAWER */}
      <AnimatePresence>
        {selectedTask && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedTask(null);
                setIsDrawerEditing(false);
              }}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 cursor-pointer"
            />

            {/* Slide-out Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-white border-l border-[#DCE6F4] shadow-2xl z-50 flex flex-col text-left"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-extrabold tracking-widest bg-indigo-50 text-indigo-600 px-2 py-1 rounded">
                    {selectedTask.code}
                  </span>
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Node Details</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsDrawerEditing(!isDrawerEditing)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      isDrawerEditing 
                        ? 'bg-indigo-600 text-white border-transparent' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {isDrawerEditing ? 'Done' : 'Edit Mode'}
                  </button>

                  <button 
                    onClick={() => {
                      setSelectedTask(null);
                      setIsDrawerEditing(false);
                    }}
                    className="p-1.5 hover:bg-slate-200/60 rounded-xl text-slate-400 hover:text-slate-800 transition-colors cursor-pointer border border-transparent"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                
                {/* Title & Description */}
                <div className="space-y-3">
                  {isDrawerEditing ? (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Title</label>
                      <input 
                        type="text"
                        value={selectedTask.title}
                        onChange={(e) => updateLocalTaskField(selectedTask.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 text-sm font-bold text-slate-800 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none"
                      />
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pt-1">Description</label>
                      <textarea
                        rows={3}
                        value={selectedTask.description}
                        onChange={(e) => updateLocalTaskField(selectedTask.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none resize-none"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-[#223B63] leading-snug">{selectedTask.title}</h3>
                      <p className="text-xs text-[#4E6485] leading-relaxed font-semibold">{selectedTask.description}</p>
                    </div>
                  )}
                </div>

                {/* Primary Metas Grid */}
                <div className="grid grid-cols-2 gap-3.5 text-xs border-y border-slate-50 py-5">
                  <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/40">
                    <span className="text-slate-400 font-bold block mb-1 uppercase text-[9px] tracking-wider">Sprint Status</span>
                    {isDrawerEditing ? (
                      <select 
                        value={selectedTask.status}
                        onChange={(e) => {
                          updateLocalTaskField(selectedTask.id, 'status', e.target.value);
                          onUpdateStatus(selectedTask.id, e.target.value as TaskStatus);
                        }}
                        className="font-bold bg-white border border-slate-200 rounded p-1 text-slate-800 w-full focus:outline-none"
                      >
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    ) : (
                      <span className={`font-extrabold uppercase text-[10px] inline-flex items-center gap-1.5 ${
                        selectedTask.status === 'Completed' ? 'text-emerald-600' : selectedTask.status === 'In Progress' ? 'text-indigo-600' : 'text-slate-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          selectedTask.status === 'Completed' ? 'bg-emerald-500' : selectedTask.status === 'In Progress' ? 'bg-indigo-500' : 'bg-slate-400'
                        }`} />
                        {selectedTask.status}
                      </span>
                    )}
                  </div>

                  <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/40">
                    <span className="text-slate-400 font-bold block mb-1 uppercase text-[9px] tracking-wider">Priority Level</span>
                    {isDrawerEditing ? (
                      <select 
                        value={selectedTask.priority}
                        onChange={(e) => updateLocalTaskField(selectedTask.id, 'priority', e.target.value)}
                        className="font-bold bg-white border border-slate-200 rounded p-1 text-slate-800 w-full focus:outline-none"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    ) : (
                      <span className={`font-extrabold uppercase text-[10px] ${
                        selectedTask.priority === 'High' ? 'text-rose-600' : selectedTask.priority === 'Medium' ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        {selectedTask.priority} Priority
                      </span>
                    )}
                  </div>

                  <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/40">
                    <span className="text-slate-400 font-bold block mb-1 uppercase text-[9px] tracking-wider">Due Date</span>
                    {isDrawerEditing ? (
                      <input 
                        type="date"
                        value={selectedTask.dueDate}
                        onChange={(e) => updateLocalTaskField(selectedTask.id, 'dueDate', e.target.value)}
                        className="font-bold bg-white border border-slate-200 rounded p-1 text-slate-800 w-full focus:outline-none"
                      />
                    ) : (
                      <span className="text-[#223B63] font-bold font-mono">{selectedTask.dueDate}</span>
                    )}
                  </div>

                  <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/40">
                    <span className="text-slate-400 font-bold block mb-1 uppercase text-[9px] tracking-wider">Project Association</span>
                    {isDrawerEditing ? (
                      <select 
                        value={selectedTask.projectId}
                        onChange={(e) => updateLocalTaskField(selectedTask.id, 'projectId', e.target.value)}
                        className="font-bold bg-white border border-slate-200 rounded p-1 text-slate-800 w-full focus:outline-none"
                      >
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name.split(':')[0]}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-indigo-600 font-extrabold uppercase tracking-wide truncate block">
                        {projects.find(p => p.id === selectedTask.projectId)?.name.split(':')[0] || 'Unassigned'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Control slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span className="uppercase text-[9px] tracking-wider text-slate-400">Task Completion Rate</span>
                    <span className="text-indigo-600 text-[11px] font-extrabold">{selectedTask.progress}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={0}
                    max={100}
                    value={selectedTask.progress}
                    onChange={(e) => updateLocalTaskField(selectedTask.id, 'progress', parseInt(e.target.value))}
                    className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Staff Assignment */}
                <div className="space-y-2">
                  <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider">Assigned Staff</span>
                  {isDrawerEditing ? (
                    <select 
                      value={selectedTask.assigneeId}
                      onChange={(e) => updateLocalTaskField(selectedTask.id, 'assigneeId', e.target.value)}
                      className="text-xs font-bold bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 w-full focus:outline-none"
                    >
                      {team.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                      ))}
                    </select>
                  ) : (() => {
                    const memberObj = team.find(m => m.id === selectedTask.assigneeId);
                    return memberObj ? (
                      <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/40 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={memberObj.avatar} 
                            alt={memberObj.name} 
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full border border-slate-200 bg-slate-100"
                          />
                          <div>
                            <span className="text-xs font-bold text-[#223B63] block">{memberObj.name}</span>
                            <span className="text-[10px] text-[#6B7D94] font-mono block uppercase mt-0.5">{memberObj.role}</span>
                          </div>
                        </div>

                        <span className="text-[9px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-0.5 rounded-lg font-bold uppercase tracking-wider">
                          Primary Owner
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs font-semibold text-slate-400 italic">No team member assigned</div>
                    );
                  })()}
                </div>

                {/* checklist Section */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider">Subtask Checklist</span>
                    <span className="text-[10px] text-[#6B7D94] font-bold">
                      {getTaskChecklist(selectedTask.id).filter(i => i.checked).length} of {getTaskChecklist(selectedTask.id).length} complete
                    </span>
                  </div>

                  <div className="space-y-2">
                    {getTaskChecklist(selectedTask.id).map(item => (
                      <div 
                        key={item.id}
                        onClick={() => handleToggleCheckItem(selectedTask.id, item.id)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-slate-50/75 transition-colors cursor-pointer text-xs font-semibold"
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                          item.checked ? 'bg-indigo-600 border-transparent text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`text-slate-700 ${item.checked ? 'line-through text-slate-400' : ''}`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Add Checkitem Form */}
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="Add subtask requirement..."
                      value={newCheckItemText}
                      onChange={(e) => setNewCheckItemText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddCheckItem(selectedTask.id);
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                    <Button 
                      onClick={() => handleAddCheckItem(selectedTask.id)}
                      size="sm"
                      className="h-8.5"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Attachments */}
                <div className="space-y-2.5">
                  <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider">Linked Assets & Attachments</span>
                  <div className="space-y-2">
                    {[
                      { name: 'synapse-architecture-v2.pdf', size: '1.8 MB', date: 'Jul 01, 2026' },
                      { name: 'aegis-compliance-profile.xlsx', size: '540 KB', date: 'Jul 02, 2026' }
                    ].map((file, fIdx) => (
                      <div key={fIdx} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/20 text-xs hover:border-indigo-500/10 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          <Paperclip className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="font-bold text-slate-700 truncate">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 font-bold text-[10px] text-slate-400">
                          <span>{file.size}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span>{file.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Comments Thread */}
                <div className="space-y-3 pt-2">
                  <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider">Discussion & Activity logs</span>
                  
                  <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                    {(taskComments[selectedTask.id] || []).length === 0 ? (
                      <div className="py-6 text-center text-[11px] text-slate-400 font-semibold bg-slate-50/30 border border-dashed border-slate-100 rounded-xl">
                        No team remarks posted yet. Initiate discussion below.
                      </div>
                    ) : (
                      (taskComments[selectedTask.id] || []).map(comm => (
                        <div key={comm.id} className="flex gap-2.5 text-xs">
                          <img 
                            src={comm.avatar} 
                            alt={comm.author} 
                            referrerPolicy="no-referrer"
                            className="w-6 h-6 rounded-full border border-slate-100 bg-slate-100 shrink-0"
                          />
                          <div className="space-y-1 bg-slate-50/80 p-2.5 rounded-2xl rounded-tl-none flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-[#223B63]">{comm.author}</span>
                              <span className="text-[9px] text-slate-400 font-bold">{comm.time}</span>
                            </div>
                            <p className="text-slate-600 font-semibold leading-relaxed text-[11px]">
                              {comm.text}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment Input */}
                  <div className="flex gap-2 pt-2.5">
                    <input 
                      type="text" 
                      placeholder="Post a response or progress note..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(selectedTask.id);
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                    <Button 
                      onClick={() => handleAddComment(selectedTask.id)}
                      size="sm"
                      className="h-8.5"
                    >
                      Post
                    </Button>
                  </div>
                </div>

                {/* Timeline History */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider">Task Audit Timeline</span>
                  <div className="space-y-4 pl-2 text-xs">
                    <div className="relative pl-4 border-l border-indigo-100 pb-2">
                      <div className="absolute -left-[5.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white" />
                      <div className="font-bold text-slate-700">Started Development phase</div>
                      <p className="text-[10px] text-slate-400 font-medium">Assigned staff Rivera initialized benchmarks. Jul 02, 2026</p>
                    </div>
                    <div className="relative pl-4 border-l border-transparent">
                      <div className="absolute -left-[5.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white" />
                      <div className="font-bold text-slate-500">Node logged in registry</div>
                      <p className="text-[10px] text-slate-400 font-medium">Auto-generated via system deployment template. Jun 30, 2026</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/40 shrink-0 flex items-center justify-between gap-3 text-xs">
                <Button 
                  onClick={() => handleDeleteTaskLocal(selectedTask.id)}
                  variant="danger"
                  icon={Trash2}
                  size="sm"
                >
                  Delete Task
                </Button>

                <div className="flex gap-2.5">
                  {selectedTask.status !== 'Todo' && (
                    <Button 
                      onClick={() => {
                        const prev = selectedTask.status === 'Completed' ? 'In Progress' : 'Todo';
                        onUpdateStatus(selectedTask.id, prev);
                        updateLocalTaskField(selectedTask.id, 'status', prev);
                      }}
                      variant="secondary"
                      size="sm"
                    >
                      Move Back
                    </Button>
                  )}

                  {selectedTask.status !== 'Completed' && (
                    <Button 
                      onClick={() => {
                        const next = selectedTask.status === 'Todo' ? 'In Progress' : 'Completed';
                        onUpdateStatus(selectedTask.id, next);
                        updateLocalTaskField(selectedTask.id, 'status', next);
                      }}
                      size="sm"
                    >
                      Move Forward
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 7. AI INSIGHT FULL VIEW MODAL */}
      <AnimatePresence>
        {activeAiInsight && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveAiInsight(null)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs cursor-pointer"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white border border-[#DCE6F4] rounded-2xl p-6 shadow-2xl z-10 text-left space-y-4"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">SynapseAI Action Hub</span>
                </div>
                <button 
                  onClick={() => setActiveAiInsight(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${
                  activeAiInsight.type === 'insight' ? 'text-indigo-600' : activeAiInsight.type === 'bottleneck' ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {activeAiInsight.type === 'insight' ? 'Purple Sprint Insight' : activeAiInsight.type === 'bottleneck' ? 'Orange Bottleneck Alert' : 'Green Automation Suggestion'}
                </span>
                <h4 className="text-sm font-bold text-[#223B63] leading-snug">{activeAiInsight.title}</h4>
                <p className="text-xs text-[#4E6485] leading-relaxed font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {activeAiInsight.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button 
                  onClick={() => setActiveAiInsight(null)}
                  size="sm"
                >
                  Dismiss Insight
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. CREATE TASK MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-slate-900/25 backdrop-blur-xs cursor-pointer"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white border border-[#DCE6F4] rounded-2xl p-6 shadow-2xl z-10 text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <CheckSquare2 className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-bold text-[#223B63]">Log New Project Task</span>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-xs">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">Task Title *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Audit training loop logs" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-800 focus:outline-none transition-all placeholder-slate-400 font-semibold"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">Description *</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Provide developer details, log scopes, error benchmarks..." 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-800 focus:outline-none resize-none transition-all placeholder-slate-400 font-semibold"
                  />
                </div>

                {/* Assignee & Project */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">Assign Staff</label>
                    <select 
                      value={newAssignee}
                      onChange={(e) => setNewAssignee(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-800 focus:outline-none transition-all font-semibold cursor-pointer"
                    >
                      {team.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">Align Project</label>
                    <select 
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-800 focus:outline-none transition-all font-semibold cursor-pointer"
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name.split(':')[0]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Priority & Due Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">Priority</label>
                    <select 
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-800 focus:outline-none transition-all font-semibold cursor-pointer"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">Due Date</label>
                    <input 
                      type="date" 
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-800 focus:outline-none transition-all font-semibold cursor-pointer"
                    />
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <Button 
                    type="button"
                    variant="secondary"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                  >
                    Confirm Logging
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
