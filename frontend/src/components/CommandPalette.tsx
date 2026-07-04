import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Terminal, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  FileText, 
  Video, 
  Settings, 
  Bell, 
  Bot, 
  Sparkles, 
  Calendar, 
  Activity, 
  ShieldAlert, 
  Command,
  ArrowRight,
  LogOut
} from 'lucide-react';
import { Project, Task, TeamMember, Document } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  tasks: Task[];
  team: TeamMember[];
  documents: Document[];
  setCurrentTab: (tab: string) => void;
  onAddTask?: (task: any) => void;
  onAddNotification?: (title: string, desc: string, priority: any, category: any) => void;
  onLogout?: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  projects,
  tasks,
  team,
  documents,
  setCurrentTab,
  onAddTask,
  onAddNotification,
  onLogout
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Debounce the query search calculations
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 120);
    return () => clearTimeout(handler);
  }, [query]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('synapse_recent_searches');
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch (e) {
          setRecentSearches([]);
        }
      }
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const saveToRecent = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('synapse_recent_searches', JSON.stringify(updated));
  };

  // Helper to render matched highlighted letters
  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-indigo-500/30 text-indigo-200 rounded-[2px] px-0.5">{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  // Command items compilation
  const getFilteredItems = () => {
    const items: any[] = [];

    // 1. Navigation items
    const navigations = [
      { type: 'nav', id: 'dashboard', label: 'Go to Dashboard', icon: Activity, keywords: 'home dashboard start index overview' },
      { type: 'nav', id: 'analytics', label: 'Go to Analytics', icon: Activity, keywords: 'charts graphs productivity trends metrics' },
      { type: 'nav', id: 'projects', label: 'Go to Projects', icon: FolderKanban, keywords: 'projects portfolio strategic' },
      { type: 'nav', id: 'teams', label: 'Go to Teams', icon: Users, keywords: 'teams roster employee list members' },
      { type: 'nav', id: 'tasks', label: 'Go to Tasks', icon: CheckSquare, keywords: 'tasks tickets backlog kanban' },
      { type: 'nav', id: 'documents', label: 'Go to Documents', icon: FileText, keywords: 'documents pdf uploads files' },
      { type: 'nav', id: 'ai-assistant', label: 'Go to AI Assistant', icon: Bot, keywords: 'ai assistant chat help support' },
      { type: 'nav', id: 'meeting-intel', label: 'Go to Meetings', icon: Video, keywords: 'meetings video room calls schedule' },
      { type: 'nav', id: 'calendar', label: 'Go to Calendar', icon: Calendar, keywords: 'calendar planner deadlines agenda' },
      { type: 'nav', id: 'admin-panel', label: 'Go to Admin Panel', icon: ShieldAlert, keywords: 'admin logs security users' },
      { type: 'nav', id: 'audit-logs', label: 'Go to Audit Logs', icon: Terminal, keywords: 'audit logs tracking logins' },
      { type: 'nav', id: 'favorites', label: 'Go to Pinned Favorites', icon: Sparkles, keywords: 'bookmarks favorites starred' },
      { type: 'nav', id: 'settings', label: 'Go to Settings', icon: Settings, keywords: 'settings profile config mfa theme' }
    ];

    items.push(...navigations);

    // 2. Project items
    projects.forEach(p => {
      items.push({
        type: 'project',
        id: p.id,
        label: `Project: ${p.name}`,
        subLabel: `${p.status} • Progress: ${p.progress}%`,
        icon: FolderKanban,
        keywords: p.name + ' ' + p.description + ' ' + p.category,
        action: () => setCurrentTab('projects')
      });
    });

    // 3. Tasks items
    tasks.forEach(t => {
      items.push({
        type: 'task',
        id: t.id,
        label: `Task: ${t.code} - ${t.title}`,
        subLabel: `Priority: ${t.priority} • Status: ${t.status}`,
        icon: CheckSquare,
        keywords: t.title + ' ' + t.description + ' ' + t.code,
        action: () => setCurrentTab('tasks')
      });
    });

    // 4. Documents items
    documents.forEach(d => {
      items.push({
        type: 'doc',
        id: d.id,
        label: `Doc: ${d.name}`,
        subLabel: `${d.type} • ${d.size} • Verified`,
        icon: FileText,
        keywords: d.name + ' ' + d.category,
        action: () => setCurrentTab('documents')
      });
    });

    // 5. Team members items
    team.forEach(m => {
      items.push({
        type: 'team',
        id: m.id,
        label: `Team Member: ${m.name}`,
        subLabel: `${m.role} • ${m.department}`,
        icon: Users,
        keywords: m.name + ' ' + m.role + ' ' + m.department,
        action: () => setCurrentTab('teams')
      });
    });

    // 6. Quick AI commands
    items.push(
      {
        type: 'action',
        id: 'ai-health',
        label: 'Run Workspace Health Check',
        subLabel: 'View workspace activity and check if everything is running smoothly',
        icon: Sparkles,
        keywords: 'health diagnostic ai analysis action report check',
        action: () => {
          setCurrentTab('analytics');
          if (onAddNotification) {
            onAddNotification(
              'Workspace Health Checked',
              'The AI Assistant completed a check of the workspace. Everything is running smoothly.',
              'Low',
              'AI'
            );
          }
        }
      },
      {
        type: 'action',
        id: 'quick-task',
        label: 'Quick Action: Log Standard Sprint Ticket',
        subLabel: 'Logs automated SYN task inside the sprint ledger',
        icon: CheckSquare,
        keywords: 'create task log ticket fast action',
        action: () => {
          setCurrentTab('tasks');
          if (onAddTask) {
            onAddTask({
              title: 'Automated Diagnostic Assessment Task',
              description: 'Created instantly via Ctrl+K command pipeline triggers.',
              status: 'Todo',
              priority: 'Medium',
              dueDate: new Date().toISOString().split('T')[0],
              assigneeId: 'm4',
              progress: 0,
              projectId: 'p1'
            });
          }
        }
      },
      {
        type: 'action',
        id: 'sign-out',
        label: 'Sign Out / Logout',
        subLabel: 'Safely terminate your active secure enterprise session',
        icon: LogOut,
        keywords: 'logout signout terminate session exit escape leave',
        action: () => {
          if (onLogout) onLogout();
        }
      }
    );

    if (!query) {
      const recentItems = recentSearches.map(s => ({
        type: 'recent',
        id: `recent-${s}`,
        label: `Recent: ${s}`,
        subLabel: 'Click to re-populate search',
        icon: Search,
        action: () => {
          setQuery(s);
          setTimeout(() => inputRef.current?.focus(), 50);
        }
      }));
      items.unshift(...recentItems);
      return items.slice(0, 8); // show initial top items or recents
    }

    const cleanQuery = query.toLowerCase();
    return items.filter(item => 
      item.label.toLowerCase().includes(cleanQuery) || 
      (item.subLabel && item.subLabel.toLowerCase().includes(cleanQuery)) ||
      (item.keywords && item.keywords.toLowerCase().includes(cleanQuery))
    );
  };

  const filtered = getFilteredItems();

  // Keyboard navigation inside menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          triggerAction(filtered[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex]);

  // Keep selected item visible in scrolling container
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        const container = scrollContainerRef.current;
        const elemTop = activeEl.offsetTop;
        const elemBottom = elemTop + activeEl.clientHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;

        if (elemTop < containerTop) {
          container.scrollTop = elemTop;
        } else if (elemBottom > containerBottom) {
          container.scrollTop = elemBottom - container.clientHeight;
        }
      }
    }
  }, [selectedIndex]);

  const triggerAction = (item: any) => {
    if (query.trim() && item.type !== 'recent') {
      saveToRecent(query);
    }
    if (item.type === 'nav') {
      setCurrentTab(item.id);
    } else if (item.action) {
      item.action();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-left font-sans"
          >
            {/* Command search input */}
            <div className="flex items-center gap-3 px-4.5 py-4 border-b border-slate-800 bg-slate-900/50">
              <Command className="w-5 h-5 text-indigo-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search anything, execute tasks, trigger AI models... (Esc to close)"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent border-none text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-400 font-bold px-2 py-0.5 rounded-md shrink-0 uppercase select-none">
                Linear Style
              </span>
            </div>

            {/* Results list */}
            <div 
              ref={scrollContainerRef}
              className="max-h-[380px] overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
            >
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 font-medium select-none">
                  No matching enterprise nodes found for "{query}"
                </div>
              ) : (
                filtered.map((item, index) => {
                  const Icon = item.icon || Terminal;
                  const isSelected = selectedIndex === index;
                  return (
                    <button
                      key={`${item.type}-${item.id}`}
                      onClick={() => triggerAction(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-100 text-left cursor-pointer group ${
                        isSelected 
                          ? 'bg-indigo-600 text-white' 
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className={`p-1.5 rounded-lg shrink-0 ${
                          isSelected ? 'bg-indigo-500/50 text-white' : 'bg-slate-800 text-indigo-400 group-hover:text-white'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <span className="text-xs font-semibold block leading-tight">{highlightMatch(item.label, query)}</span>
                          {item.subLabel && (
                            <span className={`text-[10px] block mt-0.5 font-medium truncate ${
                              isSelected ? 'text-indigo-200' : 'text-slate-500 group-hover:text-slate-400'
                            }`}>
                              {highlightMatch(item.subLabel, query)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Hotkey indicator or Action hint */}
                      <div className="flex items-center gap-2 shrink-0 font-mono text-[9px] select-none font-bold">
                        <span className={`px-2 py-0.5 rounded ${
                          isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'
                        } uppercase tracking-wider`}>
                          {item.type}
                        </span>
                        {isSelected && (
                          <ArrowRight className="w-3.5 h-3.5 text-white animate-pulse" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer with helpful tips */}
            <div className="px-4.5 py-3 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between text-[10px] text-slate-500 select-none">
              <div className="flex items-center gap-4">
                <span>↑↓ to navigate</span>
                <span>↵ to execute</span>
                <span>esc to close</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Indexed: {projects.length + tasks.length + team.length + documents.length + 10} corporate entries</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
