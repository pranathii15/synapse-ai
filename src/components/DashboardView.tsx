import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderKanban, 
  CheckSquare, 
  FileText, 
  Video, 
  MessageSquare, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Sparkles,
  ArrowUpRight,
  PlusCircle,
  Search,
  Users,
  Send,
  TrendingUp,
  BellRing,
  Lightbulb,
  ArrowRightCircle,
  Activity,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { Project, Task, Document, ChatConversation, Notification, TeamMember } from '../types';
import Button from './Button';
import { summaryService } from '../services/summaryService';
import { recommendationService } from '../services/recommendationService';

interface DashboardViewProps {
  projects: Project[];
  tasks: Task[];
  documents: Document[];
  chats: ChatConversation[];
  notifications: Notification[];
  team: TeamMember[];
  setCurrentTab: (tab: string) => void;
}

export default function DashboardView({
  projects,
  tasks,
  documents,
  chats,
  notifications,
  team = [],
  setCurrentTab
}: DashboardViewProps) {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [aiWorkspaceInput, setAiWorkspaceInput] = useState('');
  const [aiResponseText, setAiResponseText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [progressViewMode, setProgressViewMode] = useState<'metrics' | 'gantt'>('metrics');

  // States for collapsible dashboard sections, loaded from sessionStorage for persistence in current session
  const [isMyTasksExpanded, setIsMyTasksExpanded] = useState(() => {
    const val = sessionStorage.getItem('dashboard_my_tasks_expanded');
    return val !== 'false';
  });

  const [isMeetingsExpanded, setIsMeetingsExpanded] = useState(() => {
    const val = sessionStorage.getItem('dashboard_meetings_expanded');
    return val !== 'false';
  });

  const toggleMyTasks = () => {
    setIsMyTasksExpanded(prev => {
      const next = !prev;
      sessionStorage.setItem('dashboard_my_tasks_expanded', String(next));
      return next;
    });
  };

  const toggleMeetings = () => {
    setIsMeetingsExpanded(prev => {
      const next = !prev;
      sessionStorage.setItem('dashboard_meetings_expanded', String(next));
      return next;
    });
  };

  // Calculations
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = tasks.filter(t => t.status !== 'Completed');
  const highPriorityPendingTasks = pendingTasks.filter(t => t.priority === 'High');

  // Today's Date
  const formattedDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  // Quick Actions configuration
  const quickActions = [
    { label: 'Create Project', icon: FolderKanban, tab: 'projects', desc: 'Start a new project', color: 'text-indigo-600 bg-indigo-50/75 border-indigo-100' },
    { label: 'Upload Document', icon: FileText, tab: 'documents', desc: 'Upload PDF or text files', color: 'text-sky-600 bg-sky-50/75 border-sky-100' },
    { label: 'Ask AI', icon: Sparkles, tab: 'ai-assistant', desc: 'Chat with AI assistant', color: 'text-emerald-600 bg-emerald-50/75 border-emerald-100' },
    { label: 'Meeting Minutes', icon: Video, tab: 'meeting-intel', desc: 'Create meeting summaries', color: 'text-amber-600 bg-amber-50/75 border-amber-100' },
    { label: 'Create Task', icon: CheckSquare, tab: 'tasks', desc: 'Add a new task', color: 'text-violet-600 bg-violet-50/75 border-violet-100' },
    { label: 'Team Planner', icon: Users, tab: 'teams', desc: 'Manage team and planning', color: 'text-teal-600 bg-teal-50/75 border-teal-100' }
  ];

  // Today's Priorities - Meetings schedule (linked to dynamic hosts)
  const todaysMeetings = [
    { time: '10:00 AM', title: 'Sprint Kickoff & Team Alignment', host: team[0]?.name || 'Sarah Jenkins', type: 'Engineering' },
    { time: '1:30 PM', title: 'Security Audit & Server Connection Check', host: team[4]?.name || 'Elena Rostova', type: 'Security' },
    { time: '4:00 PM', title: 'Q2 Deliverable Finalization Review', host: team[3]?.name || 'Marcus Vance', type: 'Product' }
  ];

  // States for live AI integrations
  const [liveDailySummary, setLiveDailySummary] = useState<string>('Querying automated daily report analysis from neural engine...');
  const [liveTomorrowPlanner, setLiveTomorrowPlanner] = useState<string>('Constructing tomorrow\'s task plan and milestones from active sprint...');
  const [livePendingReminders, setLivePendingReminders] = useState<string>('Scanning digital workspace logs for pending action items...');
  const [liveRecommendation, setLiveRecommendation] = useState<string>('Analyzing team member workloads and matching optimal engineering staff...');

  useEffect(() => {
    let active = true;
    const fetchLiveAiData = async () => {
      try {
        const [daily, tomorrow, pendingScans] = await Promise.all([
          summaryService.generateDailySummary().catch(() => ''),
          summaryService.getTomorrowPlanner().catch(() => ''),
          summaryService.getPendingReminders().catch(() => '')
        ]);
        
        if (!active) return;
        if (daily) setLiveDailySummary(daily);
        if (tomorrow) setLiveTomorrowPlanner(tomorrow);
        if (pendingScans) setLivePendingReminders(pendingScans);

        // Fetch staff recommendations for the first project
        if (projects.length > 0) {
          const firstProj = projects[0];
          const recs = await recommendationService.getRecommendations(
            firstProj.description,
            firstProj.category ? [firstProj.category] : [],
            1
          ).catch(() => []);
          
          if (!active) return;
          if (recs && recs.length > 0) {
            const best = recs[0];
            setLiveRecommendation(`Recommended: ${best.member.name} (${best.member.role}) for ${firstProj.name}. Match Score: ${best.score}%. Reason: ${best.reason}`);
          } else {
            setLiveRecommendation('Current staffing assignments are balanced. No primary bottlenecks detected.');
          }
        } else {
          setLiveRecommendation('Create an active project workspace to generate real-time staffing recommendations.');
        }
      } catch (err) {
        console.warn('Could not complete full backend neural sync', err);
      }
    };

    fetchLiveAiData();
    return () => {
      active = false;
    };
  }, [projects]);

  // AI Suggestion list (connected to actual backend responses)
  const aiSuggestions = [
    { 
      title: '📋 Daily Summary Analysis', 
      desc: liveDailySummary, 
      tab: 'meeting-intel',
      buttonText: 'Analyze Standups'
    },
    { 
      title: '🔮 Tomorrow Planner', 
      desc: liveTomorrowPlanner, 
      tab: 'tasks',
      buttonText: 'Schedule Tasks'
    },
    { 
      title: '⏳ Pending Reminders Scan', 
      desc: livePendingReminders, 
      tab: 'notifications',
      buttonText: 'View All Alerts'
    },
    { 
      title: '👥 Team Recommendation Assistant', 
      desc: liveRecommendation, 
      tab: 'teams',
      buttonText: 'Manage Team staff'
    }
  ];

  // AI input helper chips (dynamically linked to real projects)
  const helperChips = [
    "Summarize yesterday's meeting",
    "Generate today's report",
    "Recommend team members",
    "Find pending tasks",
    projects.length > 0 ? `Summarize ${projects[0].name.split(':')[0]}` : "Summarize active projects"
  ];

  // Timeline Activity Feed data - generated dynamically from live backend records
  const timelineActivities = (() => {
    const list: { time: string; user: string; action: string; project: string }[] = [];

    // 1. Add document upload activities
    documents.forEach((doc, idx) => {
      const times = ['15 mins ago', '2 hours ago', 'Yesterday', '3 days ago', '4 days ago'];
      const timeStr = times[idx % times.length];
      const uploader = team[idx % team.length]?.name || 'System';
      list.push({
        time: timeStr,
        user: uploader,
        action: `uploaded document "${doc.name}"`,
        project: doc.category || 'Workspace'
      });
    });

    // 2. Add project status updates
    projects.forEach((proj, idx) => {
      const times = ['1 hour ago', 'Yesterday', '3 days ago', '5 days ago'];
      const timeStr = times[idx % times.length];
      list.push({
        time: timeStr,
        user: 'System',
        action: `updated initiative status to "${proj.status}"`,
        project: proj.name
      });
    });

    // 3. Add task status updates
    tasks.slice(0, 5).forEach((task, idx) => {
      const times = ['30 mins ago', '4 hours ago', '2 days ago', '4 days ago'];
      const timeStr = times[idx % times.length];
      const assignee = team.find(m => m.id === task.assigneeId)?.name || 'Team member';
      list.push({
        time: timeStr,
        user: assignee,
        action: `marked task "${task.title}" as ${task.status}`,
        project: projects.find(p => p.id === task.projectId)?.name || 'General'
      });
    });

    if (list.length === 0) {
      return [
        { time: 'Just now', user: 'System', action: 'initialized workspace telemetry feed', project: 'Core' }
      ];
    }

    return list.slice(0, 5);
  })();

  // Prepare simple compact chart data (Keep only one compact project progress chart as per request)
  const compactChartData = projects.map(p => ({
    name: p.name.length > 10 ? `${p.name.substring(0, 10)}...` : p.name,
    Progress: p.progress
  }));

  const handleAskWorkspaceAi = async (text: string) => {
    if (!text.trim()) return;
    setAiLoading(true);
    setAiResponseText(null);
    try {
      const t = text.toLowerCase();
      let resp = '';
      
      if (t.includes('meeting') || t.includes('daily') || t.includes('report') || t.includes('scrum') || t.includes('today')) {
        resp = await summaryService.generateDailySummary();
      } else if (t.includes('tomorrow') || t.includes('plan') || t.includes('planner')) {
        resp = await summaryService.getTomorrowPlanner();
      } else if (t.includes('pending') || t.includes('reminders') || t.includes('reminder') || t.includes('tasks')) {
        resp = await summaryService.getPendingReminders();
      } else if (t.includes('team') || t.includes('member') || t.includes('recommend') || t.includes('staff')) {
        if (projects.length > 0) {
          const firstProj = projects[0];
          const recs = await recommendationService.getRecommendations(
            text,
            firstProj.category ? [firstProj.category] : [],
            3
          );
          if (recs && recs.length > 0) {
            resp = `AI Staff Alignment Recommendation: We recommend ${recs[0].member.name} (${recs[0].member.role}) with a match score of ${recs[0].score}%. Reason: ${recs[0].reason}`;
          } else {
            resp = "I ran the recommendation analysis but found no candidate matching those exact parameters at the moment.";
          }
        } else {
          resp = "I recommend checking your Team Planner tab. Dr. Alex Rivera has 40% workload capacity, making him a great choice for new incoming tasks.";
        }
      } else if (t.includes('project') || t.includes('summary') || t.includes('alpha') || t.includes('athena')) {
        const match = projects.find(p => t.includes(p.name.toLowerCase())) || projects[0];
        if (match) {
          resp = await summaryService.generateProjectSummary(match.id);
        } else {
          resp = "No active projects found. Please create a project to generate an AI summary.";
        }
      } else {
        const daily = await summaryService.generateDailySummary();
        resp = `Here is your workspace overview:\n\n${daily}`;
      }
      
      setAiResponseText(resp);
    } catch (error) {
      console.warn('Real API query error, using sandbox response.', error);
      setAiResponseText("I've checked the workspace but encountered an issue connecting to the live analyzer. Please verify your connection status.");
    } finally {
      setAiLoading(false);
    }
  };

  // Search filter matching
  const filteredTasks = pendingTasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-14 max-w-7xl mx-auto select-none pb-16 font-sans text-left">
      
      {/* PAGE TITLE & SEARCH HERO */}
      <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">All systems running smoothly</span>
          </div>
          <h1 className="text-2xl font-bold text-[#223B63] tracking-tight">
            Welcome Back 👋
          </h1>
          <p className="text-xs text-[#6B7D94] flex items-center gap-1.5 font-semibold">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Let's get your work started.</span>
          </p>
        </div>

        {/* Global mini lookup */}
        <div className="relative w-full md:max-w-xs shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-semibold text-slate-700"
          />
        </div>
      </motion.div>

      {/* 1. TODAY'S OVERVIEW SECTION */}
      <div className="space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg md:text-xl">📊</span>
            <h3 className="text-base md:text-lg font-bold text-[#223B63] font-sans">Today's Overview</h3>
          </div>
          <p className="text-xs text-[#6B7D94] font-semibold">Your workspace status and key updates for today.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { label: 'Active Projects', value: projects.length, sub: 'Active and on track', icon: FolderKanban, tab: 'projects' },
            { label: 'Pending Tasks', value: pendingTasks.length, sub: 'Assigned to team', icon: CheckSquare, tab: 'tasks' },
            { label: 'Uploaded Documents', value: documents.length, sub: 'Indexed for search', icon: FileText, tab: 'documents' },
            { label: 'Meetings', value: todaysMeetings.length + documents.filter(d => d.category?.toLowerCase() === 'meetings' || d.category?.toLowerCase() === 'meeting' || d.name?.toLowerCase().includes('minutes')).length, sub: 'Summaries ready', icon: Video, tab: 'meeting-intel' },
            { label: 'Unread Alerts', value: notifications.filter(n=>!n.isRead).length, sub: 'New system alerts', icon: BellRing, tab: 'notifications' },
            { label: 'AI History', value: chats.length, sub: 'Saved conversations', icon: MessageSquare, tab: 'chat-history' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                onClick={() => setCurrentTab(item.tab)}
                whileHover={{ y: -2 }}
                className="premium-card premium-card-hover p-4 space-y-2.5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold tracking-tight line-clamp-1">{item.label}</span>
                  <Icon className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xl font-bold text-slate-800 block leading-none">{item.value}</span>
                  <span className="text-[9px] text-slate-400 block font-bold font-mono tracking-tight">{item.sub}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 2. OPERATIONAL QUICK ACTIONS */}
      <div className="space-y-5">
        <div className="space-y-1">
          <h3 className="text-sm md:text-base font-bold text-[#223B63]">Quick Actions</h3>
          <p className="text-xs text-[#6B7D94] font-semibold">Perform key tasks and trigger automated workflows instantly.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {quickActions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <motion.button
                key={act.label}
                onClick={() => setCurrentTab(act.tab)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -2 }}
                className="premium-card premium-card-hover p-4 text-left group flex flex-col h-full"
              >
                <div className={`p-2.5 rounded-xl w-fit mb-3.5 border transition-transform group-hover:scale-105 ${act.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors block leading-tight">
                  {act.label}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block leading-tight font-semibold">
                  {act.desc}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* COMMUNICATION CENTER WIDGET */}
      <div className="space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg md:text-xl">💬</span>
            <h3 className="text-sm md:text-base font-bold text-[#223B63]">Communication Center</h3>
          </div>
          <p className="text-xs text-[#6B7D94] font-semibold">Monitor real-time team threads, sync statuses, and upcoming collaborative video calls.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats overview & main actions card */}
          <div className="premium-card p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Sync Dashboard</span>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-3 text-center space-y-1">
                  <span className="text-xl font-extrabold text-indigo-600 block">{notifications.filter(n => !n.isRead).length}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block font-mono">Unread</span>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3 text-center space-y-1">
                  <span className="text-xl font-extrabold text-emerald-600 block">{todaysMeetings.length}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block font-mono">Meetings</span>
                </div>
                <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-3 text-center space-y-1">
                  <span className="text-xl font-extrabold text-rose-500 block">{tasks.filter(t => t.status !== 'Completed' && t.priority === 'High').length}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block font-mono">Missed</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button 
                onClick={() => setCurrentTab('messages')} 
                variant="secondary" 
                size="sm" 
                className="rounded-xl text-xs font-bold py-2.5"
              >
                Open Messages
              </Button>
              <Button 
                onClick={() => setCurrentTab('calls')} 
                variant="primary" 
                size="sm" 
                className="rounded-xl text-xs font-bold py-2.5"
              >
                Start Meeting
              </Button>
            </div>
          </div>

          {/* Online Team Members List */}
          <div className="premium-card p-6 lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Online Teammates</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                ● {team.filter(m => m.currentWorkload !== 0).length || team.length} Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {team.slice(0, 4).map((emp, i) => {
                const colors: Record<string, string> = {
                  'Online': 'bg-emerald-500',
                  'In Meeting': 'bg-rose-500',
                  'Working Remotely': 'bg-[#4F7DFF]',
                  'Busy': 'bg-amber-500'
                };
                const statuses = ['Online', 'In Meeting', 'Working Remotely', 'Busy'];
                const status = emp.currentWorkload > 80 ? 'Busy' : emp.currentWorkload > 60 ? 'In Meeting' : statuses[i % statuses.length];
                return (
                  <div key={emp.id || i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-slate-100/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img src={emp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'} alt="" className="w-8.5 h-8.5 rounded-lg object-cover" />
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${colors[status] || 'bg-slate-400'}`} />
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-bold text-slate-700 block leading-tight">{emp.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold truncate block leading-tight mt-0.5">{emp.role}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setCurrentTab('messages')} 
                      size="xs" 
                      variant="outline" 
                      className="rounded-lg text-[9px] px-2.5 py-1 shrink-0 font-bold"
                    >
                      Chat
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. MY TASKS SECTION */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm md:text-base font-bold text-[#223B63]">My Tasks</h3>
            <p className="text-xs text-[#6B7D94] font-semibold">Active workspace tasks assigned to you or waiting for action.</p>
          </div>
          <button 
            onClick={toggleMyTasks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#4E6485] bg-white hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none select-none shrink-0"
          >
            {isMyTasksExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-indigo-500" />
                <span>Collapse</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />
                <span>Expand</span>
              </>
            )}
          </button>
        </div>
        
        <AnimatePresence initial={false}>
          {isMyTasksExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="premium-card p-6 md:p-8 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">Task List</span>
                    <span className="text-[10px] bg-rose-50 border border-rose-100 text-rose-600 px-2.5 py-0.5 rounded-full font-bold">
                      {filteredTasks.length} pending
                    </span>
                  </div>

                  <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                    {filteredTasks.length === 0 ? (
                      <span className="text-xs text-slate-400 block py-10 font-semibold text-center">Backlog empty. All tasks shipped!</span>
                    ) : (
                      filteredTasks.slice(0, 4).map((t) => (
                        <div key={t.id} className="text-xs p-4 md:p-5 bg-slate-50 border border-slate-100 rounded-xl flex items-start justify-between gap-4 hover:bg-slate-100/50 transition-colors">
                          <div className="space-y-1.5 min-w-0">
                            <span className="font-bold text-[#223B63] text-sm block line-clamp-1">{t.title}</span>
                            <span className="text-[11px] text-[#6F819C] font-mono font-bold block">{t.code} • Due {t.dueDate}</span>
                          </div>
                          <span className={`text-[10px] px-2.5 py-1 rounded-md font-extrabold uppercase shrink-0 ${
                            t.priority === 'High' ? 'bg-rose-50 border border-rose-100 text-rose-500' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {t.priority}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setCurrentTab('tasks')}
                  className="w-full mt-4 h-10 font-bold"
                >
                  View All Tasks in Workspace
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. MEETINGS SECTION */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm md:text-base font-bold text-[#223B63]">Upcoming Meetings</h3>
            <p className="text-xs text-[#6B7D94] font-semibold">Your sync schedule and strategic conversations lined up for today.</p>
          </div>
          <button 
            onClick={toggleMeetings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#4E6485] bg-white hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none select-none shrink-0"
          >
            {isMeetingsExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-indigo-500" />
                <span>Collapse</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />
                <span>Expand</span>
              </>
            )}
          </button>
        </div>
        
        <AnimatePresence initial={false}>
          {isMeetingsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="premium-card p-6 md:p-8 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">Scheduled Syncs</span>
                    <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-600 px-2.5 py-0.5 rounded-full font-bold">
                      {todaysMeetings.length} Scheduled
                    </span>
                  </div>

                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                    {todaysMeetings.map((m, idx) => (
                      <div key={idx} className="p-5 border border-slate-200/80 rounded-2xl bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-500/20 transition-all">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2.5 text-xs font-mono">
                            <span className="text-indigo-600 font-extrabold flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg">
                              <Clock className="w-3.5 h-3.5" /> {m.time}
                            </span>
                            <span className="text-[#6F819C] font-bold bg-slate-100 px-2.5 py-1 rounded-lg">{m.type}</span>
                          </div>
                          <h4 className="font-bold text-[#223B63] text-sm md:text-base">{m.title}</h4>
                          <span className="text-xs text-[#4E6485] font-semibold block">Host: {m.host}</span>
                        </div>
                        <Button variant="secondary" size="sm" className="shrink-0 self-start md:self-auto font-bold h-9">
                          Join Session
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setCurrentTab('meeting-intel')}
                  className="w-full mt-2 h-10 font-bold"
                >
                  Access Meeting Summaries & Transcripts
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. ACTIVITY STREAM */}
      <div className="space-y-5">
        <div className="space-y-1">
          <h3 className="text-sm md:text-base font-bold text-[#223B63]">Activity Stream</h3>
          <p className="text-xs text-[#6B7D94] font-semibold">Real-time collaboration timeline and actions taken by your team.</p>
        </div>
        
        <div className="premium-card p-6 md:p-8 space-y-6">
          <div className="relative border-l-2 border-slate-100 ml-4 pl-8 space-y-8 py-2">
            {timelineActivities.map((act, i) => (
              <div key={i} className="relative group">
                <div className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1.5">
                    <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                      <span className="font-bold text-[#223B63]">{act.user}</span> {act.action}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#6F819C] font-bold uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded-md">
                      {act.project}
                    </span>
                  </div>
                  
                  <div className="text-xs text-slate-400 font-mono font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                    <span>{act.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. AI RECOMMENDATIONS */}
      <div className="space-y-5">
        <div className="space-y-1">
          <h3 className="text-sm md:text-base font-bold text-[#223B63]">AI Recommendations & Insights</h3>
          <p className="text-xs text-[#6B7D94] font-semibold">Proactive intelligence tips designed to optimize project bandwidth and clear bottlenecks.</p>
        </div>
        
        <div className="premium-card p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiSuggestions.map((s, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-2xl border border-indigo-50/50 bg-gradient-to-br from-indigo-50/20 to-slate-50/40 hover:from-indigo-50/30 hover:to-slate-50/60 transition-all flex flex-col justify-between min-h-[160px] shadow-2xs hover:shadow-xs group"
              >
                <div className="space-y-2">
                  <span className="font-extrabold text-[#223B63] text-sm md:text-base block leading-tight group-hover:text-indigo-600 transition-colors">
                    {s.title}
                  </span>
                  <p className="text-xs text-[#4E6485] leading-relaxed font-semibold">
                    {s.desc}
                  </p>
                </div>
                
                <button
                  onClick={() => setCurrentTab(s.tab)}
                  className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1.5 cursor-pointer self-start bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 px-3.5 py-1.5 rounded-xl transition-all"
                >
                  <span>{s.buttonText || 'Assign Team Members'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
       {/* 7. PROJECT PROGRESS */}
      <div className="space-y-5">
        <div className="space-y-1">
          <h3 className="text-sm md:text-base font-bold text-[#223B63]">Project Progress</h3>
          <p className="text-xs text-[#6B7D94] font-semibold">Current completion metrics across all active workspace initiatives.</p>
        </div>
        
        <div className="premium-card p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 w-fit">
              <button 
                onClick={() => setProgressViewMode('metrics')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${progressViewMode === 'metrics' ? 'bg-white text-indigo-600 shadow-3xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Completion Metrics
              </button>
              <button 
                onClick={() => setProgressViewMode('gantt')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${progressViewMode === 'gantt' ? 'bg-white text-indigo-600 shadow-3xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Milestone Gantt Timeline
              </button>
            </div>
            
            <button 
              onClick={() => setCurrentTab('projects')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer bg-slate-50 border border-slate-100 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>View Projects Hub</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full text-xs min-h-[260px] pt-4">
            {progressViewMode === 'metrics' ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={compactChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#6F819C" fontSize={11} tickLine={false} axisLine={false} className="font-bold" />
                  <YAxis stroke="#6F819C" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} className="font-bold font-mono" />
                  <Tooltip cursor={{ fill: '#F8FAFC' }} />
                  <Bar dataKey="Progress" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="space-y-5 pt-2">
                {/* Gantt Timeline headers */}
                <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                  <div className="col-span-4 text-left">Initiative / Milestone Task</div>
                  <div className="col-span-2 text-left">Timeline</div>
                  <div className="col-span-6 text-left">Progress & Calendar Schedule</div>
                </div>

                <div className="space-y-4">
                  {tasks.slice(0, 4).map((task, idx) => {
                    const progressVal = task.progress || 45;
                    const colorSchemes = [
                      { bg: 'bg-indigo-600', text: 'text-indigo-600', fill: 'bg-indigo-100' },
                      { bg: 'bg-emerald-500', text: 'text-emerald-600', fill: 'bg-emerald-100' },
                      { bg: 'bg-amber-500', text: 'text-amber-600', fill: 'bg-amber-100' },
                      { bg: 'bg-sky-500', text: 'text-sky-600', fill: 'bg-sky-100' }
                    ];
                    const scheme = colorSchemes[idx % colorSchemes.length];

                    return (
                      <div key={task.id} className="grid grid-cols-12 gap-2 items-center text-xs py-1">
                        {/* Task info */}
                        <div className="col-span-4 text-left space-y-0.5 min-w-0 pr-2">
                          <span className="font-bold text-slate-800 truncate block">{task.title}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-slate-400 font-bold">{task.code}</span>
                            <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase ${
                              task.priority === 'High' ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>

                        {/* Due Date & Span */}
                        <div className="col-span-2 text-left">
                          <span className="font-mono text-[9px] font-bold text-slate-400 block uppercase">Due Date</span>
                          <span className="font-mono text-[10px] font-bold text-slate-700 block">{task.dueDate}</span>
                        </div>

                        {/* Gantt Bar with slider progress */}
                        <div className="col-span-6 flex items-center gap-4">
                          <div className="flex-1 bg-slate-100 h-4 rounded-full relative overflow-hidden shadow-inner">
                            {/* Gantt bar starting offset block simulation */}
                            <div 
                              className={`absolute top-0 bottom-0 rounded-full ${scheme.bg} opacity-90 flex items-center justify-end pr-2.5 transition-all`}
                              style={{ 
                                left: `${idx * 12}%`, 
                                width: `${Math.min(100 - (idx * 12), progressVal)}%` 
                              }}
                            >
                              <span className="text-[8px] text-white font-extrabold leading-none">{progressVal}%</span>
                            </div>
                          </div>
                          
                          {/* Mini status indicator */}
                          <div className="w-20 text-right shrink-0">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${
                              progressVal === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                            }`}>
                              {progressVal === 100 ? 'Completed' : 'Active'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* 8. ASK SYNAPSEAI */}
      <div className="space-y-5">
        <div className="space-y-1">
          <h3 className="text-sm md:text-base font-bold text-[#223B63]">Ask SynapseAI</h3>
          <p className="text-xs text-[#6B7D94] font-semibold">Leverage natural language AI query tools to search your entire digital workspace workspace.</p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-8 md:p-10 border border-indigo-150 bg-gradient-to-br from-white to-indigo-50/10 space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-500">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#223B63]">Ask SynapseAI Anything</h3>
                <p className="text-xs text-[#6F819C] font-semibold">Instant project intelligence, summaries, and smart recommendations on demand.</p>
              </div>
            </div>
            <span className="text-[10px] bg-indigo-100/50 border border-indigo-200/50 text-indigo-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              AI Co-Pilot Live
            </span>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input 
                type="text"
                value={aiWorkspaceInput}
                onChange={(e) => setAiWorkspaceInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAskWorkspaceAi(aiWorkspaceInput);
                }}
                placeholder="How can SynapseAI accelerate your workflow today? Ask about projects, tasks, transcripts..."
                className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl pl-5 pr-14 py-4.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-800 font-semibold placeholder-slate-400 shadow-2xs"
              />
              <button
                onClick={() => handleAskWorkspaceAi(aiWorkspaceInput)}
                disabled={aiLoading || !aiWorkspaceInput.trim()}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Prompt suggestions chips UNDER the input box */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Suggested Prompts</span>
              <div className="flex flex-wrap gap-2">
                {helperChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      setAiWorkspaceInput(chip);
                      handleAskWorkspaceAi(chip);
                    }}
                    className="text-xs bg-white border border-slate-200 hover:border-indigo-500/40 text-slate-600 hover:text-indigo-600 px-3.5 py-2 rounded-xl transition-all cursor-pointer font-bold shadow-2xs"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Output Container */}
            <AnimatePresence mode="wait">
              {aiLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-5 bg-slate-50 border border-slate-150 rounded-xl flex items-center gap-3 text-xs text-slate-500 font-semibold"
                >
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-indigo-600 animate-spin" />
                  <span>Retrieving context and preparing response...</span>
                </motion.div>
              )}

              {aiResponseText && !aiLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2.5 text-xs md:text-sm"
                >
                  <span className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-indigo-500" /> SynapseAI
                  </span>
                  <p className="text-slate-700 leading-relaxed font-semibold">{aiResponseText}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
