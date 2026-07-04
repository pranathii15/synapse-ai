import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Search, 
  ChevronDown, 
  User, 
  Settings, 
  Terminal, 
  Menu,
  X,
  Sparkles,
  Building2,
  Check,
  ShieldAlert,
  Sliders,
  LogOut
} from 'lucide-react';
import { UserProfile, Notification } from '../types';

interface HeaderProps {
  profile: UserProfile;
  unreadCount: number;
  onMenuClick: () => void;
  setCurrentTab: (tab: string) => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  wsStatus: 'Connected' | 'Reconnecting' | 'Offline';
  setWsStatus: (status: 'Connected' | 'Reconnecting' | 'Offline') => void;
  currentRole: string;
  onLogout?: () => void;
}

const WORKSPACES = [
  { id: 'synapse-prod', name: 'Synapse Enterprise', type: 'Production Cluster', color: 'bg-indigo-600' },
  { id: 'horizon-dev', name: 'Horizon Workspace', type: 'Staging Sandbox', color: 'bg-amber-500' },
  { id: 'athena-rand', name: 'Athena Research', type: 'Experimental Lab', color: 'bg-emerald-500' }
];

export default function Header({ 
  profile, 
  unreadCount, 
  onMenuClick, 
  setCurrentTab,
  notifications,
  onMarkRead,
  wsStatus = 'Connected',
  setWsStatus,
  currentRole = 'Super Admin',
  onLogout
}: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState(WORKSPACES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const activeNotifications = notifications.slice(0, 4);

  const handleToggleConnection = () => {
    if (wsStatus === 'Connected') {
      setWsStatus('Reconnecting');
    } else if (wsStatus === 'Reconnecting') {
      setWsStatus('Offline');
    } else {
      setWsStatus('Connected');
    }
  };

  return (
    <header className="sticky top-0 h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-30 select-none">
      
      {/* Left side: Workspace Selector & Mobile menu */}
      <div className="flex items-center gap-3">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </motion.button>

        {/* Workspace Selector (Enterprise-grade) */}
        <div className="relative">
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              setWorkspaceOpen(!workspaceOpen);
              setNotifOpen(false);
              setProfileOpen(false);
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-xs text-left"
          >
            <div className={`w-2.5 h-2.5 rounded-full ${activeWorkspace.color}`} />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 tracking-tight leading-none flex items-center gap-1.5">
                {activeWorkspace.name}
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                {activeWorkspace.type}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform group-hover:text-slate-600" />
          </motion.button>

          <AnimatePresence>
            {workspaceOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setWorkspaceOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block px-2.5 mb-2.5 select-none">
                    Select Directory
                  </span>
                  <div className="space-y-1">
                    {WORKSPACES.map((ws) => (
                      <button
                        key={ws.id}
                        onClick={() => {
                          setActiveWorkspace(ws);
                          setWorkspaceOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${
                          activeWorkspace.id === ws.id 
                            ? 'bg-slate-50 font-bold text-slate-800' 
                            : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3 text-left">
                          <div className={`w-2 h-2 rounded-full ${ws.color}`} />
                          <div>
                            <span className="block font-semibold">{ws.name}</span>
                            <span className="text-[9px] text-slate-400 font-medium block">{ws.type}</span>
                          </div>
                        </div>
                        {activeWorkspace.id === ws.id && (
                          <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Global Search Bar (with focus animations and shortcuts indicator) */}
        <div className="hidden lg:block relative ml-4">
          <motion.div 
            animate={{ width: searchFocused ? '320px' : '260px' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`flex items-center gap-2 bg-slate-50 border rounded-xl px-3 py-2 transition-all duration-200 ${
              searchFocused 
                ? 'border-indigo-500 ring-2 ring-indigo-500/15 bg-white' 
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <Search className={`w-4 h-4 shrink-0 transition-colors ${searchFocused ? 'text-indigo-600' : 'text-slate-400'}`} />
            <input 
              type="text" 
              placeholder="Search workspaces & documents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full font-medium"
            />
            {searchQuery ? (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-[9px] font-bold text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 bg-white select-none">
                ⌘K
              </span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-3">
        
        {/* Interactive WebSockets Connection Status Controller */}
        <button 
          onClick={handleToggleConnection}
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black transition-all cursor-pointer ${
            wsStatus === 'Connected' 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100/60' 
              : wsStatus === 'Reconnecting' 
                ? 'bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100/60 animate-pulse' 
                : 'bg-rose-50 border-rose-100 text-rose-700 hover:bg-rose-100/60'
          }`}
          title="Click to manually cycle WebSockets states"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${
            wsStatus === 'Connected' 
              ? 'bg-emerald-500' 
              : wsStatus === 'Reconnecting' 
                ? 'bg-amber-500 animate-spin' 
                : 'bg-rose-500'
          }`} />
          <span>WebSocket: {wsStatus}</span>
        </button>

        {/* Current Active RBAC Role Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-600">
          <span>Role: {currentRole}</span>
        </div>

        {/* Notification Bell with animated icon & trigger */}
        <div className="relative">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
              setWorkspaceOpen(false);
            }}
            className={`p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-all relative cursor-pointer ${
              notifOpen ? 'bg-slate-100 text-slate-800' : ''
            }`}
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-2 ring-white" />
            )}
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <span className="text-xs font-bold text-slate-800">Operational System Alerts</span>
                    <button 
                      onClick={() => {
                        setCurrentTab('notifications');
                        setNotifOpen(false);
                      }}
                      className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      View All Alerts
                    </button>
                  </div>

                  {activeNotifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 font-medium">
                      All systems green. No outstanding actions.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {activeNotifications.map((n) => (
                        <button 
                          key={n.id} 
                          onClick={() => {
                            onMarkRead(n.id);
                            setNotifOpen(false);
                            setCurrentTab('notifications');
                          }}
                          className={`w-full p-3 rounded-xl text-left transition-all border ${
                            n.isRead ? 'border-transparent bg-slate-50/50 opacity-60' : 'border-indigo-100 bg-indigo-50/45'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-xs font-bold ${
                              n.priority === 'High' ? 'text-rose-500' : n.priority === 'Medium' ? 'text-amber-500' : 'text-indigo-600'
                            }`}>
                              {n.title}
                            </span>
                            {!n.isRead && (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 font-medium">{n.description}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown with premium transition & micro-interactions */}
        <div className="relative">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
              setWorkspaceOpen(false);
            }}
            className="flex items-center gap-2.5 hover:bg-slate-50 p-1 rounded-xl transition-all border border-transparent hover:border-slate-100 cursor-pointer"
          >
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full border border-slate-200 shadow-xs shrink-0 object-cover"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">{profile.name}</span>
              <span className="text-[10px] text-slate-400 font-bold tracking-tight">{profile.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50"
                >
                  <div className="flex flex-col items-center border-b border-slate-100 pb-3.5 mb-3 text-center">
                    <img 
                      src={profile.avatar} 
                      alt={profile.name} 
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full border border-slate-200 shadow-md mb-2 object-cover"
                    />
                    <span className="text-xs font-bold text-slate-800">{profile.name}</span>
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full mt-1.5">
                      {profile.department}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium mt-1">{profile.email}</span>
                  </div>

                  <div className="space-y-1">
                    <button 
                      onClick={() => {
                        setCurrentTab('profile');
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer text-left font-bold"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentTab('settings');
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer text-left font-bold"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Settings</span>
                    </button>

                    <button 
                      onClick={() => {
                        setProfileOpen(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer text-left font-bold"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                    
                    <div className="border-t border-slate-100 my-2 pt-2">
                      <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold px-3 select-none">
                        <span>Session Status</span>
                        <span className="text-emerald-500 uppercase">ACTIVE SECURITY</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
