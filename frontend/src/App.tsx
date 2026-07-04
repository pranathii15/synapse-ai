import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Menu, 
  X, 
  Activity, 
  LogOut,
  Sparkles,
  ChevronLeft,
  Loader2
} from 'lucide-react';

// Import Types
import { 
  Project, TeamMember, Task, Document, Notification, ChatConversation, UserProfile, UserSettings 
} from './types';

// Import Services & Mock DB Getters/Setters
import { 
  getProjects, saveProjects,
  getTeam, saveTeam,
  getTasks, saveTasks,
  getDocuments, saveDocuments,
  getNotifications, saveNotifications,
  getChats, saveChats,
  getUserProfile, saveUserProfile,
  getSettings, saveSettings
} from './services/mockDb';

import { projectService } from './services/projectService';
import { taskService } from './services/taskService';
import { teamService } from './services/teamService';
import { documentService } from './services/documentService';
import { chatHistoryService } from './services/chatHistoryService';
import { authService } from './services/authService';
import { notificationService } from './services/notificationService';
import { summaryService } from './services/summaryService';

// Import Sub-Views & Layouts (Statically imported for immediate frame render)
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PublicWebsiteView from './components/PublicWebsiteView';
import CommandPalette from './components/CommandPalette';
import Logo from './components/Logo';

// Lazy load high-payload enterprise panels for optimal asset streaming
const DashboardView = lazy(() => import('./components/DashboardView'));
const ProjectsView = lazy(() => import('./components/ProjectsView'));
const TeamsView = lazy(() => import('./components/TeamsView'));
const TasksView = lazy(() => import('./components/TasksView'));
const DocumentsView = lazy(() => import('./components/DocumentsView'));
const AiAssistantView = lazy(() => import('./components/AiAssistantView'));
const MeetingIntelView = lazy(() => import('./components/MeetingIntelView'));
const RecommendationsView = lazy(() => import('./components/RecommendationsView'));
const NotificationsView = lazy(() => import('./components/NotificationsView'));
const ChatHistoryView = lazy(() => import('./components/ChatHistoryView'));
const ProfileView = lazy(() => import('./components/ProfileView'));
const SettingsView = lazy(() => import('./components/SettingsView'));
const AnalyticsView = lazy(() => import('./components/AnalyticsView'));
const TeamChatView = lazy(() => import('./components/TeamChatView'));
const MessagesView = lazy(() => import('./components/MessagesView'));
const CallsView = lazy(() => import('./components/CallsView'));
const CalendarView = lazy(() => import('./components/CalendarView'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const AuditLogsView = lazy(() => import('./components/AuditLogsView'));
const FavoritesView = lazy(() => import('./components/FavoritesView'));

// Unified loading fallback styled with smooth modern glassmorphism
const ViewSuspense = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
      <p className="text-xs font-semibold tracking-wider uppercase text-slate-600 animate-pulse">Syncing Neural Core...</p>
    </div>
  }>
    {children}
  </Suspense>
);

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showSignOutModal, setShowSignOutModal] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  // Navigation & Layout States
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Toast Notification System
  const [activeToast, setActiveToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setActiveToast({ message, type });
  };

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  // Enterprise Advanced SaaS States
  const [currentRole, setCurrentRole] = useState<string>('Super Admin');
  const [wsStatus, setWsStatus] = useState<'Connected' | 'Reconnecting' | 'Offline'>('Connected');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);

  // Listen for global Command Palette hotkey (Ctrl + K / Cmd + K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Core Data States (instantiated from mockDb)
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chats, setChats] = useState<ChatConversation[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [projectLoading, setProjectLoading] = useState<boolean>(false);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [projectSearchLoading, setProjectSearchLoading] = useState<boolean>(false);
  const [projectSearchError, setProjectSearchError] = useState<string | null>(null);

  // Selected Active Chat State
  const [activeChat, setActiveChat] = useState<ChatConversation | null>(null);

  // Sync the applied theme instantly with the document element.
  useEffect(() => {
    const isDarkMode = settings?.darkMode ?? false;
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
  }, [settings?.darkMode]);

  // Load all data from API services
  const loadAllData = async () => {
    setProjectLoading(true);
    setProjectError(null);

    let projs: Project[] = [];
    try {
      projs = await projectService.getProjects();
      setProjects(projs);
    } catch (error) {
      console.error('Could not load projects from backend.', error);
      setProjectError('Unable to load projects at this time.');
      setProjects([]);
    }

    try {
      const [tm, tsk, docs, notifs, conversations, userProf, userSettings] = await Promise.all([
        teamService.getTeam(),
        taskService.getTasks(),
        documentService.getDocuments(),
        notificationService.getNotifications(),
        chatHistoryService.getConversations(),
        authService.getProfile(),
        authService.getSettings()
      ]);

      setTeam(tm);
      setTasks(tsk);
      setDocuments(docs);
      setNotifications(notifs);
      setChats(conversations);
      if (conversations.length > 0 && !activeChat) {
        setActiveChat(conversations[0]);
      }
      setProfile(userProf);
      setSettings(userSettings);
    } catch (error) {
      console.error('Failed to reload supplementary backend datasets, loading local store values.', error);
      setTeam(getTeam());
      setTasks(getTasks());
      setDocuments(getDocuments());
      setNotifications(getNotifications());
      const chatList = getChats();
      setChats(chatList);
      if (chatList.length > 0 && !activeChat) {
        setActiveChat(chatList[0]);
      }
      setProfile(getUserProfile());
      setSettings(getSettings());
    } finally {
      setProjectLoading(false);
    }
  };

  // Initial Load & Token Validation (Auto Redirect / Protected Routes)
  useEffect(() => {
    const checkSessionAndLoad = async () => {
      const token = localStorage.getItem('synapse_token') || localStorage.getItem('token') || localStorage.getItem('synapse_jwt');
      if (token) {
        setIsLoggedIn(true);
        await loadAllData();
      } else {
        // even if not logged in, fetch local stores so UI has placeholders ready
        setProjects(getProjects());
        setTeam(getTeam());
        setTasks(getTasks());
        setDocuments(getDocuments());
        setNotifications(getNotifications());
        setChats(getChats());
        setProfile(getUserProfile());
        setSettings(getSettings());
      }
    };
    checkSessionAndLoad();
  }, []);

  // Login handler
  const handleLogin = async (email?: string, password?: string) => {
    try {
      await authService.login(email || "pranathi@example.com",password || "123456");
      setIsLoggedIn(true);
      await loadAllData();
    } catch (error) {
      alert('Login failed. Please check your email and password and try again.');
    }
  };

  // Logout handler (opens confirmation dialog)
  const handleLogout = () => {
    setShowSignOutModal(true);
  };

  // Confirm logout and execute cleanup in order
  const confirmLogout = async () => {
    setIsSigningOut(true);
    
    // Simulate slight delay for excellent, professional visual feedback (loading state)
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    try {
      // 1. Clear authentication token & user session (backend support)
      await authService.logout();
      
      // 2. Clear localStorage/sessionStorage values related to authentication
      localStorage.removeItem('synapse_token');
      localStorage.removeItem('token');
      localStorage.removeItem('synapse_jwt');
      sessionStorage.removeItem('synapse_token');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('synapse_jwt');
      
      // 3. Reset user state
      setIsLoggedIn(false);
      setProfile(null);
      setSettings(null);
      setCurrentTab('dashboard');
      
      // 4. Close any open drawers or modals
      setMobileMenuOpen(false);
      setCommandPaletteOpen(false);
      setShowSignOutModal(false);
      
      // 5. Display a success toast
      showToast('Successfully signed out.', 'success');
    } catch (error) {
      console.warn('Authentication logout encountered an error:', error);
      // Fallback clean-up to ensure security
      localStorage.removeItem('synapse_token');
      localStorage.removeItem('token');
      localStorage.removeItem('synapse_jwt');
      sessionStorage.removeItem('synapse_token');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('synapse_jwt');
      
      setIsLoggedIn(false);
      setProfile(null);
      setSettings(null);
      setCurrentTab('dashboard');
      setMobileMenuOpen(false);
      setCommandPaletteOpen(false);
      setShowSignOutModal(false);
      showToast('Successfully signed out.', 'success');
    } finally {
      setIsSigningOut(false);
    }
  };

  // --- REACTIVE STATE SYNCHRONIZERS ---

  // Project Creation Handler
  const handleCreateProject = async (newProjData: Omit<Project, 'id' | 'progress' | 'completedTasks' | 'aiSummary'>) => {
    const created = await projectService.createProject(newProjData);
    await loadAllData();
    showToast(`Project "${created.name}" created successfully!`, 'success');
    handleAddNotification(
      'New Project Created',
      `Project "${created.name}" has been created successfully. You can now assign team members to it.`,
      'Medium',
      'Project'
    );
  };

  const handleSearchProjects = async (keyword: string) => {
    setProjectSearchLoading(true);
    setProjectSearchError(null);

    if (!keyword.trim()) {
      await loadAllData();
      setProjectSearchLoading(false);
      return;
    }

    try {
      const results = await projectService.searchProjects(keyword);
      setProjects(results);
    } catch (error) {
      console.error('Project search failed.', error);
      setProjectSearchError('Search failed. Please try again.');
    } finally {
      setProjectSearchLoading(false);
    }
  };

  // Task Creation Handler
  const handleAddTask = async (newTaskData: Omit<Task, 'id' | 'code'>) => {
    const created = await taskService.createTask(newTaskData);
    await loadAllData();
    showToast(`Task assigned successfully!`, 'success');
    handleAddNotification(
      'New Task Assigned',
      `Task "${created.title}" has been successfully added to your task list.`,
      'Low',
      'Task'
    );
  };

  // Task Status Update Handler (Kanban Move)
  const handleUpdateTaskStatus = async (taskId: string, status: Task['status']) => {
    await taskService.updateTaskStatus(taskId, status);
    await loadAllData();
  };

  // Document Ingestion Handler
  const handleUploadDocument = async (name: string, sizeBytes: number, category: string) => {
    const created = await documentService.uploadDocument(name, sizeBytes, category);
    await loadAllData();
    showToast(`Document uploaded and indexed successfully!`, 'success');
    handleAddNotification(
      'Document Uploaded Successfully',
      `Document "${name}" has been uploaded and indexed for AI search.`,
      'Medium',
      'AI'
    );
  };

  // Document Deletion Handler
  const handleDeleteDocument = async (id: string) => {
    const list = getDocuments();
    const docToDelete = list.find(d => d.id === id);
    const filtered = list.filter(d => d.id !== id);
    saveDocuments(filtered);
    setDocuments(filtered);
    showToast(`Document "${docToDelete?.name || 'File'}" deleted.`, 'info');
  };

  // Ask RAG (Returns answers & references)
  const handleAskRag = async (docId: string, question: string) => {
    return documentService.askRag(docId, question);
  };

  // AI Chat Messages Submissions
  const handleAddChatMessage = async (
    chatId: string, 
    sender: 'user' | 'ai', 
    text: string, 
    references?: string[]
  ) => {
    await chatHistoryService.addMessageToConversation(chatId, sender, text, references);
    const refreshedChats = getChats();
    setChats(refreshedChats);
    const active = refreshedChats.find(c => c.id === chatId);
    if (active) {
      setActiveChat(active);
    }
  };

  // Creating brand new conversation log
  const handleNewChat = async (title: string) => {
    const created = await chatHistoryService.createConversation(title, 'General AI');
    const list = getChats();
    setChats(list);
    setActiveChat(created);
    setCurrentTab('ai-assistant');
  };

  // Erasing conversations
  const handleDeleteChat = async (id: string) => {
    await chatHistoryService.deleteConversation(id);
    const list = getChats();
    setChats(list);
    if (activeChat?.id === id) {
      setActiveChat(list[0] || null);
    }
  };

  // Notification Badge clearance Handlers
  const handleMarkNotificationRead = async (id: string) => {
    await notificationService.markAsRead(id);
    await loadAllData();
  };

  const handleMarkAllNotificationsRead = async () => {
    await notificationService.markAllAsRead();
    await loadAllData();
  };

  const handleDeleteNotification = async (id: string) => {
    await notificationService.deleteNotification(id);
    await loadAllData();
  };

  // Global Dynamic Notification Adder
  const handleAddNotification = (
    title: string, 
    description: string, 
    priority: Notification['priority'],
    category: Notification['category']
  ) => {
    const list = getNotifications();
    const newNotif: Notification = {
      id: 'n_' + Math.random().toString(36).substr(2, 9),
      title,
      description,
      priority,
      isRead: false,
      time: new Date().toISOString(),
      category
    };
    list.unshift(newNotif);
    saveNotifications(list);
    setNotifications(list);
  };

  // Meeting Action Items Ingress Link
  const handleImportMeetingTasks = async (extractedTasks: Omit<Task, 'id' | 'code'>[]) => {
    for (const task of extractedTasks) {
      await taskService.createTask(task);
    }
    await loadAllData();
    showToast(`Imported ${extractedTasks.length} tasks from kickoff transcript!`, 'success');
    handleAddNotification(
      'Action Items Imported',
      `Successfully loaded ${extractedTasks.length} action milestones from kickoff transcript audit.`,
      'High',
      'Task'
    );
  };

  // Profile Updates
  const handleUpdateProfile = async (updatedProfile: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = await authService.updateProfile(updatedProfile);
    setProfile(updated);
    showToast("Profile updated successfully!", "success");
    
    // Sync roster if staff member profile changes
    const teamList = await teamService.getTeam();
    const idx = teamList.findIndex(m => m.id === 'm4'); // Marcus Vance id
    if (idx !== -1) {
      await teamService.updateTeam('m4', {
        name: updated.name,
        role: updated.role,
        skills: updated.skills
      });
    }
    await loadAllData();
  };

  // Settings Updates
  const handleUpdateSettings = async (updatedSettings: Partial<UserSettings>) => {
    if (!settings) return;
    const updated = await authService.updateSettings(updatedSettings);
    setSettings(updated);
    await loadAllData();
    showToast("Workspace preferences updated!", "success");
  };

  // Calculating unread alarms count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isLoggedIn) {
    return <PublicWebsiteView onLogin={handleLogin} />;
  }

  if (!profile || !settings) {
    return (
      <div className="h-screen w-screen bg-[#F7F8FA] flex flex-col items-center justify-center text-[#64748B] font-sans text-xs gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-indigo-500/20 border-t-indigo-600 animate-spin absolute" />
          <Logo size={40} strokeColor="#3E5BFF" />
        </div>
        <span className="font-semibold text-[#1E293B] mt-1 tracking-wide">Syncing Enterprise AI Workspace Session...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1E293B] font-sans flex overflow-hidden">
      
      {/* 1. Persistent Collapsible Left Sidebar */}
      <Sidebar 
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setMobileMenuOpen(false);
        }}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        unreadNotifications={unreadCount}
        onLogout={handleLogout}
        currentRole={currentRole}
      />

      {/* Mobile Drawer Menu Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#1E293B]/20 backdrop-blur-sm z-40 md:hidden cursor-pointer"
            />
            
            {/* Drawer Sliding body */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 left-0 w-64 bg-[#23395B] border-r border-[#23395B]/10 z-50 p-4 flex flex-col justify-between md:hidden"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-md">
                      <Logo size={24} strokeColor="#3E5BFF" />
                    </div>
                    <span className="font-sans font-bold text-white tracking-tight">SynapseAI</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 hover:bg-white/10 rounded text-gray-300 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Menu Options */}
                <div className="space-y-1">
                  {[
                    { id: 'dashboard', label: 'Home' },
                    { id: 'projects', label: 'Projects' },
                    { id: 'teams', label: 'Teams' },
                    { id: 'tasks', label: 'Tasks' },
                    { id: 'messages', label: 'Messages', badge: 3 },
                    { id: 'calls', label: 'Calls' },
                    { id: 'documents', label: 'Document Library' },
                    { id: 'ai-assistant', label: 'Ask AI' },
                    { id: 'meeting-intel', label: 'Meetings' },
                    { id: 'recommendations', label: 'AI Recommendations' },
                    { id: 'notifications', label: 'Notifications', badge: unreadCount },
                    { id: 'chat-history', label: 'AI History' },
                    { id: 'profile', label: 'My Profile' },
                    { id: 'settings', label: 'Settings' },
                    { id: 'logout', label: 'Sign Out' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'logout') {
                          handleLogout();
                        } else {
                          setCurrentTab(item.id);
                        }
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer block ${
                        item.id === 'logout'
                          ? 'text-rose-300 hover:text-white hover:bg-rose-500/10 mt-2 border-t border-white/5 pt-3'
                          : currentTab === item.id 
                            ? 'bg-white text-[#23395B]' 
                            : 'text-[#7FB7E8]/80 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{item.label}</span>
                        {item.badge && item.badge > 0 ? (
                          <span className="px-1.5 py-0.5 rounded-full bg-[#E76F51] text-[9px] font-mono font-bold text-white">
                            {item.badge}
                          </span>
                        ) : null}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status footer mobile */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 font-sans">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3CB371] animate-pulse" />
                  <span>Enterprise Environment</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Right Content Space: Top navigation bar + active viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* 2. Top Navigation Header Bar */}
        <Header 
          profile={profile}
          unreadCount={unreadCount}
          onMenuClick={() => setMobileMenuOpen(true)}
          setCurrentTab={setCurrentTab}
          notifications={notifications}
          onMarkRead={handleMarkNotificationRead}
          wsStatus={wsStatus}
          setWsStatus={setWsStatus}
          currentRole={currentRole}
          onLogout={handleLogout}
        />

        {/* 3. Main Dynamic Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#F7F8FA] relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <ViewSuspense>
                {currentTab === 'dashboard' && (
                  <DashboardView 
                    projects={projects}
                    tasks={tasks}
                    documents={documents}
                    chats={chats}
                    notifications={notifications}
                    setCurrentTab={setCurrentTab}
                  />
                )}

                {currentTab === 'analytics' && (
                  <AnalyticsView 
                    projects={projects}
                    tasks={tasks}
                    documents={documents}
                    chats={chats}
                  />
                )}

                {currentTab === 'projects' && (
                  <ProjectsView 
                    projects={projects}
                    onCreateProject={handleCreateProject}
                    onSearchProjects={handleSearchProjects}
                    projectLoading={projectLoading}
                    searchLoading={projectSearchLoading}
                    searchError={projectSearchError || projectError}
                  />
                )}

                {currentTab === 'teams' && (
                  <TeamsView 
                    team={team}
                  />
                )}

                {currentTab === 'tasks' && (
                  <TasksView 
                    tasks={tasks}
                    team={team}
                    projects={projects}
                    onAddTask={handleAddTask}
                    onUpdateStatus={handleUpdateTaskStatus}
                  />
                )}

                {currentTab === 'documents' && (
                  <DocumentsView 
                    documents={documents}
                    onUpload={handleUploadDocument}
                    onDelete={handleDeleteDocument}
                    onAskRag={handleAskRag}
                  />
                )}

                {currentTab === 'ai-assistant' && (
                  <AiAssistantView 
                    conversations={chats}
                    activeChat={activeChat}
                    onSelectChat={setActiveChat}
                    onNewChat={handleNewChat}
                    onAddMessage={handleAddChatMessage}
                    onDeleteChat={handleDeleteChat}
                  />
                )}

                {currentTab === 'meeting-intel' && (
                  <MeetingIntelView 
                    team={team}
                    onImportTasks={handleImportMeetingTasks}
                  />
                )}

                {currentTab === 'recommendations' && (
                  <RecommendationsView 
                    team={team}
                  />
                )}

                {currentTab === 'notifications' && (
                  <NotificationsView 
                    notifications={notifications}
                    onMarkRead={handleMarkNotificationRead}
                    onMarkAllRead={handleMarkAllNotificationsRead}
                    onDelete={handleDeleteNotification}
                  />
                )}

                {currentTab === 'chat-history' && (
                  <ChatHistoryView 
                    conversations={chats}
                    onSelectChat={setActiveChat}
                    onDeleteChat={handleDeleteChat}
                    setCurrentTab={setCurrentTab}
                  />
                )}

                {currentTab === 'profile' && (
                  <ProfileView 
                    profile={profile}
                    onUpdate={handleUpdateProfile}
                  />
                )}

                {currentTab === 'settings' && (
                  <SettingsView 
                    settings={settings}
                    onUpdateSettings={handleUpdateSettings}
                  />
                )}

                {currentTab === 'messages' && (
                  <MessagesView 
                    onStartCall={(type, user) => {
                      setCurrentTab('calls');
                    }}
                  />
                )}

                {currentTab === 'calls' && (
                  <CallsView />
                )}

                {currentTab === 'team-chat' && (
                  <TeamChatView 
                    team={team}
                    onAddNotification={handleAddNotification}
                  />
                )}

                {currentTab === 'calendar' && (
                  <CalendarView 
                    projects={projects}
                    tasks={tasks}
                    onAddNotification={handleAddNotification}
                  />
                )}

                {currentTab === 'admin-panel' && (
                  <AdminPanel 
                    team={team}
                    currentRole={currentRole}
                    onSetRole={setCurrentRole}
                    onAddNotification={handleAddNotification}
                  />
                )}

                {currentTab === 'audit-logs' && (
                  <AuditLogsView 
                    onAddNotification={handleAddNotification}
                  />
                )}

                {currentTab === 'favorites' && (
                  <FavoritesView 
                    projects={projects}
                    tasks={tasks}
                    documents={documents}
                    setCurrentTab={setCurrentTab}
                    onAddNotification={handleAddNotification}
                  />
                )}
              </ViewSuspense>
            </motion.div>
          </AnimatePresence>

        </main>
      </div>

      {/* Global Linear-Style Command Palette Trigger (Ctrl + K) */}
      <CommandPalette 
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        projects={projects}
        tasks={tasks}
        team={team}
        documents={documents}
        setCurrentTab={setCurrentTab}
        onAddTask={handleAddTask}
        onAddNotification={handleAddNotification}
        onLogout={handleLogout}
      />

      {/* Premium Toast Notifications Overlay */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 text-white shadow-xl backdrop-blur-md border border-white/10 max-w-sm text-left font-sans"
          >
            {activeToast.type === 'success' && (
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs shrink-0">✓</span>
            )}
            {activeToast.type === 'error' && (
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 font-extrabold text-xs shrink-0">✕</span>
            )}
            {activeToast.type === 'info' && (
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4F7DFF]/20 text-[#4F7DFF] font-extrabold text-xs shrink-0">i</span>
            )}
            <div className="space-y-0.5 min-w-0 pr-2">
              <span className="text-[9px] font-bold tracking-wider uppercase opacity-40 block">{activeToast.type}</span>
              <span className="text-xs font-bold block leading-tight">{activeToast.message}</span>
            </div>
            <button 
              onClick={() => setActiveToast(null)} 
              className="text-white/40 hover:text-white ml-auto cursor-pointer p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign Out Confirmation Dialog */}
      <AnimatePresence>
        {showSignOutModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSigningOut) setShowSignOutModal(false);
              }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-left font-sans"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Sign Out
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Are you sure you want to sign out of SynapseAI?
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  disabled={isSigningOut}
                  onClick={() => setShowSignOutModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSigningOut}
                  onClick={confirmLogout}
                  className="flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed min-w-[90px]"
                >
                  {isSigningOut ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                      Signing Out...
                    </>
                  ) : (
                    'Sign Out'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
