import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Search, 
  Trash2, 
  CheckCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  X,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Notification, NotificationPriority } from '../types';

interface NotificationsViewProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
}

export default function NotificationsView({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDelete
}: NotificationsViewProps) {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  // Filter
  const filteredNotifs = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                          n.description.toLowerCase().includes(search.toLowerCase()) ||
                          n.category.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || n.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none pb-12 font-sans text-left">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
        <span>Home</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-600 font-bold">Notifications</span>
      </div>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">Notifications</h2>
          <p className="text-xs text-[#64748B]">Review login updates, team workload alerts, and system notifications.</p>
        </div>

        <button 
          onClick={() => {
            onMarkAllRead();
            alert('Marked all system alerts as cleared.');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#1E293B] transition-all cursor-pointer shadow-xs self-start"
        >
          <CheckCheck className="w-4 h-4 text-[#3CB371]" />
          <span>Mark All as Cleared</span>
        </button>
      </div>

      {/* Filter and Search actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
        {/* Search Input */}
        <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 w-full md:w-80 transition-all focus-within:border-[#4F7CAC] focus-within:ring-2 focus-within:ring-[#4F7CAC]/15">
          <Search className="w-4 h-4 text-[#64748B] shrink-0" />
          <input 
            type="text" 
            placeholder="Search notifications..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-[#1E293B] placeholder-[#64748B]/60 focus:outline-none w-full"
          />
        </div>

        {/* Priority Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['All', 'High', 'Medium', 'Low'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                priorityFilter === p 
                  ? 'bg-[#4F7CAC]/15 border border-[#4F7CAC]/25 text-[#23395B]' 
                  : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F7F8FA] border border-transparent'
              }`}
            >
              {p} Priority
            </button>
          ))}
        </div>
      </div>

      {/* Alerts lists */}
      {filteredNotifs.length === 0 ? (
        <div className="py-20 text-center border border-[#E5E7EB] bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center p-6">
          <Bell className="w-8 h-8 text-[#64748B] mb-2" />
          <p className="text-sm font-bold text-[#1E293B]">No notifications</p>
          <p className="text-xs text-[#64748B] mt-1 font-medium">No notifications matching your parameters were logged.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifs.map((n) => {
            const isHigh = n.priority === 'High';
            const isMedium = n.priority === 'Medium';
            const isUnread = !n.isRead;
            
            return (
              <motion.div 
                key={n.id}
                layoutId={n.id}
                onClick={() => onMarkRead(n.id)}
                className={`p-4 rounded-2xl border transition-all text-left flex items-start justify-between gap-4 cursor-pointer relative overflow-hidden shadow-sm ${
                  isUnread 
                    ? 'bg-[#4F7CAC]/5 border-[#4F7CAC]/25' 
                    : 'bg-[#F7F8FA]/60 border-[#E5E7EB] opacity-80 hover:opacity-100'
                }`}
              >
                {/* Visual Unread Glow band */}
                {isUnread && (
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#4F7CAC]" />
                )}

                <div className="flex items-start gap-3">
                  {/* Priority icon indicators */}
                  <div className={`p-2 rounded-xl mt-0.5 shrink-0 border ${
                    isHigh 
                      ? 'bg-[#E76F51]/10 border-[#E76F51]/15 text-[#E76F51]' 
                      : isMedium 
                      ? 'bg-[#F4B942]/10 border-[#F4B942]/15 text-[#F4B942]' 
                      : 'bg-[#4F7CAC]/10 border-[#4F7CAC]/15 text-[#4F7CAC]'
                  }`}>
                    {isHigh ? (
                      <ShieldAlert className="w-4 h-4 animate-pulse" />
                    ) : isMedium ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Info className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#1E293B] leading-snug">{n.title}</span>
                      <span className="text-[9px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full font-sans text-[#64748B] font-semibold">
                        {n.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-relaxed font-normal">{n.description}</p>
                    
                    <div className="flex items-center gap-1.5 text-[9px] text-[#64748B] pt-1.5 font-semibold">
                      <Clock className="w-3 h-3 text-[#64748B]" />
                      <span>{new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.time).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Operations */}
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {isUnread && (
                    <button 
                      onClick={() => onMarkRead(n.id)}
                      className="px-2.5 py-1.5 bg-white border border-[#E5E7EB] hover:bg-[#F7F8FA] text-[#64748B] hover:text-[#1E293B] rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-xs"
                    >
                      Mark read
                    </button>
                  )}
                  
                  <button 
                    onClick={() => {
                      onDelete(n.id);
                      alert('Erased alert message.');
                    }}
                    className="p-1 hover:bg-red-50 hover:text-[#E76F51] rounded text-[#64748B] transition-colors cursor-pointer"
                    title="Delete log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
}
