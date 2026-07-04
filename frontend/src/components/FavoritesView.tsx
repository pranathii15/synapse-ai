import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Star, 
  Trash2, 
  FolderKanban, 
  CheckSquare, 
  FileText, 
  MessageSquare, 
  Video, 
  Search, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Project, Task, Document } from '../types';

interface FavoritesViewProps {
  projects: Project[];
  tasks: Task[];
  documents: Document[];
  setCurrentTab: (tab: string) => void;
  onAddNotification?: (title: string, desc: string, priority: any, category: any) => void;
}

interface FavoriteItem {
  id: string;
  title: string;
  type: 'project' | 'task' | 'document' | 'chat' | 'meeting';
  subLabel: string;
  associatedId: string;
}

export default function FavoritesView({
  projects,
  tasks,
  documents,
  setCurrentTab,
  onAddNotification
}: FavoritesViewProps) {
  const [search, setSearch] = useState('');
  
  // Initial seed favorites list
  const [favoritesList, setFavoritesList] = useState<FavoriteItem[]>([
    { id: 'fav-1', title: 'Strategic Roadmap 2026', type: 'project', subLabel: 'Strategic • 65% Completed', associatedId: 'p1' },
    { id: 'fav-2', title: 'Model fine-tuning error rate check', type: 'task', subLabel: 'SYN-102 • Sarah Jenkins', associatedId: 't1' },
    { id: 'fav-3', title: 'Q3_Strategic_AI_Roadmap.pdf', type: 'document', subLabel: 'PDF • 4.2 MB • Sarah Jenkins', associatedId: 'd1' },
    { id: 'fav-4', title: 'Secure website server setup', type: 'document', subLabel: 'YAML • 42 KB • Elena Rostova', associatedId: 'd2' },
    { id: 'fav-5', title: 'Q3 Launch Sync Call Recording', type: 'meeting', subLabel: 'Video Lobby • Completed July 3', associatedId: 'm1' }
  ]);

  const handleRemoveFavorite = (favId: string, title: string) => {
    setFavoritesList(prev => prev.filter(f => f.id !== favId));
    if (onAddNotification) {
      onAddNotification(
        'Favorite Removed',
        `"${title}" was removed from your saved bookmarks.`,
        'Low',
        'System'
      );
    }
  };

  const handleNavigate = (fav: FavoriteItem) => {
    if (fav.type === 'project') {
      setCurrentTab('projects');
    } else if (fav.type === 'task') {
      setCurrentTab('tasks');
    } else if (fav.type === 'document') {
      setCurrentTab('documents');
    } else if (fav.type === 'meeting') {
      setCurrentTab('meeting-intel');
    } else {
      setCurrentTab('dashboard');
    }
  };

  const getIcon = (type: FavoriteItem['type']) => {
    switch (type) {
      case 'project': return FolderKanban;
      case 'task': return CheckSquare;
      case 'document': return FileText;
      case 'meeting': return Video;
      default: return MessageSquare;
    }
  };

  const filtered = favoritesList.filter(f => 
    f.title.toLowerCase().includes(search.toLowerCase()) || 
    f.subLabel.toLowerCase().includes(search.toLowerCase()) ||
    f.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-7xl mx-auto font-sans text-left pb-12">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1E293B] tracking-tight flex items-center gap-2">
            <Star className="w-5 h-5 text-indigo-600 fill-indigo-600 animate-pulse" /> Saved Bookmarks
          </h2>
          <p className="text-xs text-[#64748B]">Your personal list of saved projects, tasks, documents, and meetings.</p>
        </div>

        {/* Search bookmarks */}
        <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 w-full sm:w-64">
          <Search className="w-4 h-4 text-[#64748B] shrink-0" />
          <input 
            type="text" 
            placeholder="Search bookmarks..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-[#1E293B] placeholder-[#64748B]/60 focus:outline-none w-full font-medium"
          />
        </div>
      </div>

      {/* Favorites list display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 bg-white border border-[#E5E7EB] rounded-3xl p-16 text-center text-slate-400 font-medium">
            <Sparkles className="w-10 h-10 mx-auto text-slate-300 mb-2.5 animate-bounce" />
            No bookmarked assets found. Pin documents, chats, or tasks to compile favorites.
          </div>
        ) : (
          filtered.map(fav => {
            const Icon = getIcon(fav.type);
            const badgeColor = fav.type === 'project' 
              ? 'bg-blue-50 text-blue-700 border-blue-200' 
              : fav.type === 'task' 
                ? 'bg-amber-50 text-amber-700 border-amber-200' 
                : fav.type === 'document' 
                  ? 'bg-purple-50 text-purple-700 border-purple-200' 
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200';

            return (
              <div 
                key={fav.id}
                className="bg-white border border-[#E5E7EB] hover:border-indigo-100 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all hover:shadow-md hover:shadow-indigo-500/5 cursor-pointer text-left group"
                onClick={() => handleNavigate(fav)}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${badgeColor}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  
                  <div className="truncate text-left">
                    <span className="text-xs font-black text-slate-800 block truncate group-hover:text-indigo-600 transition-colors leading-tight">
                      {fav.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-semibold mt-0.5 truncate uppercase font-mono">
                      {fav.type} • {fav.subLabel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Remove Fav */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(fav.id, fav.title);
                    }}
                    className="p-1.5 hover:bg-rose-50 border border-slate-150 hover:border-rose-100 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button 
                    className="p-1.5 hover:bg-slate-50 border border-slate-150 hover:border-indigo-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                    title="Navigate to parent tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
