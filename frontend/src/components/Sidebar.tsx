import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import Logo from './Logo';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  CheckSquare, 
  FileText, 
  Bot, 
  Video, 
  Award, 
  Bell, 
  History, 
  User, 
  Settings as SettingsIcon, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Terminal,
  Activity,
  Calendar,
  MessageSquare,
  Phone,
  Star,
  ShieldCheck,
  ListCollapse
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  unreadNotifications: number;
  onLogout?: () => void;
  currentRole?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  isAi?: boolean;
  badge?: number;
  isLogout?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const tooltipsMap: Record<string, string> = {
  'dashboard': '🏠 Home',
  'projects': '📁 Projects',
  'teams': '👥 Team',
  'tasks': '✅ Tasks',
  'documents': '📄 Document Library',
  'ai-assistant': '🤖 Ask AI',
  'meeting-intel': '🎥 Meetings',
  'recommendations': '⭐ AI Recommendations',
  'notifications': '🔔 Notifications',
  'chat-history': '🕘 AI History',
  'profile': '👤 My Profile',
  'settings': '⚙️ Settings',
  'logout': '🚪 Logout'
};

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  collapsed, 
  setCollapsed,
  unreadNotifications,
  onLogout,
  currentRole = 'Super Admin'
}: SidebarProps) {
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isTapExpanded, setIsTapExpanded] = useState(false);

  const isExpanded = isHovered || isTapExpanded;

  // Sync internal state to parent state
  useEffect(() => {
    setCollapsed(!isExpanded);
  }, [isExpanded, setCollapsed]);

  // Click outside listener for tablet/tap expand modes
  useEffect(() => {
    if (!isTapExpanded) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setIsTapExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isTapExpanded]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 250); // wait approximately 250ms
  };

  const handleSidebarClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      setIsTapExpanded(true);
      e.stopPropagation();
    }
  };

  const shouldReduceMotion = useReducedMotion();
  const transitionConfig = shouldReduceMotion 
    ? { duration: 0 } 
    : { duration: 0.28, ease: 'easeInOut' };

  // Construct dynamic menu sections based on role permissions
  const sections: MenuSection[] = [
    {
      title: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
        { id: 'projects', label: 'Projects', icon: FolderKanban },
        { id: 'teams', label: 'Teams', icon: Users },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 3 },
        { id: 'calls', label: 'Calls', icon: Phone }
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { id: 'documents', label: 'Document Library', icon: FileText },
        { id: 'ai-assistant', label: 'Ask AI', icon: Bot, isAi: true },
        { id: 'meeting-intel', label: 'Meetings', icon: Video },
        { id: 'recommendations', label: 'AI Recommendations', icon: Award }
      ]
    },
    {
      title: 'System & History',
      items: [
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
        { id: 'chat-history', label: 'AI History', icon: History }
      ]
    },
    {
      title: 'Personal',
      items: [
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
        { id: 'logout', label: 'Sign Out', icon: LogOut, isLogout: true }
      ]
    }
  ];

  const handleItemClick = (item: MenuItem) => {
    if (item.isLogout) {
      if (onLogout) {
        onLogout();
      }
    } else {
      setCurrentTab(item.id);
      setIsTapExpanded(false); // Close tap-expanded mode on tablet upon choosing an item
    }
  };

  const mainSections = sections.filter(s => s.title !== 'Personal');
  const personalSection = sections.find(s => s.title === 'Personal');

  return (
    <motion.div 
      ref={sidebarRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleSidebarClick}
      animate={{ width: isExpanded ? '260px' : '72px' }}
      transition={transitionConfig}
      className="hidden md:flex flex-col h-screen bg-[#0F172A] border-r border-slate-800 text-slate-300 select-none relative z-20 shrink-0 shadow-2xl overflow-hidden cursor-pointer"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800 justify-start overflow-hidden">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            className="shrink-0 flex items-center justify-center w-11 h-11"
          >
            <Logo size={40} strokeColor="#3E5BFF" />
          </motion.div>
          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div 
                key="brand-info"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={transitionConfig}
                className="flex flex-col text-left overflow-hidden whitespace-nowrap"
              >
                <span className="font-sans font-bold text-white text-sm tracking-tight leading-tight">SynapseAI</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Enterprise Workspace</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Links with Section Groups */}
      <div className="flex-1 overflow-y-auto py-5 px-3.5 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {mainSections.map((section, sIdx) => (
          <div key={section.title} className="space-y-1.5">
            {/* Section Header */}
            {isExpanded ? (
              <motion.h3 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3.5 mb-2.5 select-none"
              >
                {section.title}
              </motion.h3>
            ) : (
              sIdx > 0 && <div className="border-t border-slate-800/60 my-3 mx-2" />
            )}

            {/* Section Items */}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 relative group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                      isActive 
                        ? 'text-white bg-indigo-600 shadow-lg shadow-indigo-600/25 font-semibold' 
                        : 'hover:bg-slate-800/50 hover:text-white text-slate-400'
                    }`}
                  >
                    {/* Active Indicator Pulse background */}
                    {isActive && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl -z-10 shadow-lg shadow-indigo-600/30"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}

                    <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive 
                          ? 'text-white' 
                          : 'text-slate-400 group-hover:text-slate-200'
                      } ${item.isAi ? 'text-teal-400' : ''}`} />
                      {item.isAi && !isActive && (
                        <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      )}
                      {!isExpanded && item.badge && item.badge > 0 ? (
                        <span className="absolute -top-1.5 -right-1.5 px-1 py-0.5 rounded-full text-[8px] font-extrabold bg-rose-500 text-white leading-none min-w-[14px] text-center shadow-md">
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                    
                    <AnimatePresence mode="wait">
                      {isExpanded && (
                        <motion.span 
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -5 }}
                          transition={transitionConfig}
                          className="truncate text-left text-xs font-semibold whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Notification badge */}
                    {isExpanded && item.badge && item.badge > 0 ? (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500 text-white leading-none min-w-[16px] text-center"
                      >
                        {item.badge}
                      </motion.span>
                    ) : null}

                    {/* Tooltip for collapsed mode */}
                    {!isExpanded && (
                      <div className="absolute left-16 bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold rounded-lg py-1.5 px-3 ml-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap shadow-2xl z-50">
                        {tooltipsMap[item.id] || item.label}
                        {item.badge && item.badge > 0 ? ` (${item.badge})` : ''}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Bottom Section (Settings, Profile & Logout) */}
      <div className="p-3.5 border-t border-slate-800 space-y-1 bg-[#0F172A] shrink-0">
        {personalSection?.items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id && !item.isLogout;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleItemClick(item)}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 relative group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                isActive 
                  ? 'text-white bg-indigo-600 shadow-lg shadow-indigo-600/25 font-semibold' 
                  : item.isLogout
                    ? 'hover:bg-red-500/10 hover:text-red-400 text-slate-400'
                    : 'hover:bg-slate-800/50 hover:text-white text-slate-400'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl -z-10 shadow-lg shadow-indigo-600/30"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive 
                    ? 'text-white' 
                    : item.isLogout 
                      ? 'text-red-400/80 group-hover:text-red-400' 
                      : 'text-slate-400 group-hover:text-slate-200'
                }`} />
              </div>

              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={transitionConfig}
                    className="truncate text-left text-xs font-semibold whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip for collapsed mode */}
              {!isExpanded && (
                <div className="absolute left-16 bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold rounded-lg py-1.5 px-3 ml-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap shadow-2xl z-50">
                  {tooltipsMap[item.id] || item.label}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* System Status Footer */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={transitionConfig}
            className="p-4 border-t border-slate-800 flex items-center justify-between shrink-0 bg-[#0F172A]"
          >
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-sans font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Secure Enterprise Environment</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
