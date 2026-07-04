import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Hash, 
  MessageSquare, 
  Send, 
  Search, 
  Smile, 
  Paperclip, 
  Pin, 
  Users, 
  Volume2, 
  ChevronRight, 
  FileText, 
  Download, 
  MoreVertical, 
  CornerDownRight, 
  UserPlus, 
  Flame, 
  ThumbsUp, 
  Check, 
  Heart,
  Eye,
  CheckCheck,
  SearchCode
} from 'lucide-react';
import { TeamMember } from '../types';

interface TeamChatViewProps {
  team: TeamMember[];
  onAddNotification?: (title: string, desc: string, priority: any, category: any) => void;
}

interface ChatChannel {
  id: string;
  name: string;
  type: 'channel' | 'dm' | 'project';
  description?: string;
  unreadCount: number;
  membersCount?: number;
  avatar?: string;
  presence?: string;
}

interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  text: string;
  timestamp: string;
  file?: {
    name: string;
    size: string;
    type: string;
  };
  reactions: { emoji: string; count: number; users: string[] }[];
  isPinned?: boolean;
  replies?: ChatMessage[];
}

export default function TeamChatView({ team, onAddNotification }: TeamChatViewProps) {
  // Mock Channels & DMs
  const [channels, setChannels] = useState<ChatChannel[]>([
    { id: 'ch-general', name: 'general-announcements', type: 'channel', description: 'Company-wide announcements, updates, and general team posts.', unreadCount: 0, membersCount: 15 },
    { id: 'ch-athena', name: 'project-athena', type: 'project', description: 'Team chat for the new Athena feature and AI document search settings.', unreadCount: 2, membersCount: 5 },
    { id: 'ch-sprint', name: 'core-sprint-scrum', type: 'channel', description: 'Daily team updates, project blockers, and task status updates.', unreadCount: 0, membersCount: 8 },
    { id: 'ch-infra', name: 'cloud-infrastructure', type: 'project', description: 'Server connection security and cloud setup coordination.', unreadCount: 1, membersCount: 4 },
    
    // DMs
    { id: 'dm-sarah', name: 'Sarah Jenkins', type: 'dm', unreadCount: 0, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', presence: 'Online' },
    { id: 'dm-alex', name: 'Dr. Alex Rivera', type: 'dm', unreadCount: 1, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120', presence: 'Busy' },
    { id: 'dm-maya', name: 'Maya Chen', type: 'dm', unreadCount: 0, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120', presence: 'Away' },
    { id: 'dm-elena', name: 'Elena Rostova', type: 'dm', unreadCount: 0, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120', presence: 'Offline' }
  ]);

  const [activeChat, setActiveChat] = useState<ChatChannel>(channels[0]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'ch-general': [
      {
        id: 'g-1',
        senderName: 'Sarah Jenkins',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
        senderRole: 'Lead AI Developer',
        text: 'Hello everyone! Today we successfully completed updating our document search model. Error rates are extremely low and the speed has doubled!',
        timestamp: '9:30 AM',
        reactions: [{ emoji: '🔥', count: 4, users: ['Marcus Vance', 'Alex Rivera', 'Maya Chen'] }],
        isPinned: true,
        replies: [
          {
            id: 'g-r1',
            senderName: 'Dr. Alex Rivera',
            senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
            senderRole: 'Lead Software Engineer',
            text: 'Amazing results, Sarah! Will check out the updated search features and test them tomorrow.',
            timestamp: '9:35 AM',
            reactions: []
          }
        ]
      },
      {
        id: 'g-2',
        senderName: 'Elena Rostova',
        senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
        senderRole: 'Lead Security Engineer',
        text: 'A quick reminder that server security updates are scheduled for tonight at 11:00 PM UTC. Expect a brief interruption of about 2 minutes.',
        timestamp: '11:15 AM',
        reactions: [{ emoji: '👍', count: 2, users: ['Sarah Jenkins', 'Marcus Vance'] }],
        isPinned: false
      }
    ],
    'ch-athena': [
      {
        id: 'a-1',
        senderName: 'Dr. Alex Rivera',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
        senderRole: 'Lead Software Engineer',
        text: 'I uploaded the current Athena design specs. Check out the project roadmap and user access rules.',
        timestamp: '1:10 PM',
        file: { name: 'Athena_API_v2_Manifest.pdf', size: '1.4 MB', type: 'PDF' },
        reactions: [{ emoji: '❤️', count: 1, users: ['Marcus Vance'] }],
        isPinned: true
      },
      {
        id: 'a-2',
        senderName: 'Marcus Vance',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
        senderRole: 'Staff Full-Stack Engineer',
        text: 'Looks solid Alex. Integrating the React axios headers now to pass bearer tokens correctly.',
        timestamp: '2:22 PM',
        reactions: [{ emoji: '👍', count: 1, users: ['Alex Rivera'] }]
      }
    ]
  });

  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeThreadMsg, setActiveThreadMsg] = useState<ChatMessage | null>(null);
  const [threadText, setThreadText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  const msgEndRef = useRef<HTMLDivElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to message bottom
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChat]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThreadMsg]);

  // Simulate remote team typing when switching channels
  useEffect(() => {
    setTypingUser(null);
    setIsTyping(false);
    if (activeChat.id === 'ch-athena') {
      const timer = setTimeout(() => {
        setTypingUser('Dr. Alex Rivera');
        setIsTyping(true);
      }, 2500);
      return () => clearTimeout(timer);
    } else if (activeChat.id === 'dm-sarah') {
      const timer = setTimeout(() => {
        setTypingUser('Sarah Jenkins');
        setIsTyping(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeChat]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      senderName: 'Marcus Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      senderRole: 'Staff Full-Stack Engineer',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    };

    const updated = { ...messages };
    if (!updated[activeChat.id]) updated[activeChat.id] = [];
    updated[activeChat.id] = [...updated[activeChat.id], newMessage];

    setMessages(updated);
    setMessageText('');

    // Trigger local AI auto reply if DM
    if (activeChat.type === 'dm') {
      setIsTyping(true);
      setTypingUser(activeChat.name);
      setTimeout(() => {
        setIsTyping(false);
        const reply: ChatMessage = {
          id: `reply-${Date.now()}`,
          senderName: activeChat.name,
          senderAvatar: activeChat.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
          senderRole: 'Synapse Staff',
          text: `Got your note regarding: "${messageText}". Let's synchronize on this further during the daily scrum or via Project Athena dashboard files.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactions: [{ emoji: '👍', count: 1, users: ['Marcus Vance'] }]
        };
        const activeMsgs = updated[activeChat.id] || [];
        updated[activeChat.id] = [...activeMsgs, reply];
        setMessages({ ...updated });
        if (onAddNotification) {
          onAddNotification(
            `New Message from ${activeChat.name}`,
            `Marcus: "${reply.text.substring(0, 50)}..."`,
            'Medium',
            'Team'
          );
        }
      }, 3000);
    }
  };

  const handleSendThreadMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadText.trim() || !activeThreadMsg) return;

    const newReply: ChatMessage = {
      id: `tr-${Date.now()}`,
      senderName: 'Marcus Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      senderRole: 'Staff Full-Stack Engineer',
      text: threadText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    };

    // Append to existing replies
    const updated = { ...messages };
    const chatList = updated[activeChat.id] || [];
    const index = chatList.findIndex(m => m.id === activeThreadMsg.id);
    if (index !== -1) {
      const target = chatList[index];
      const replies = target.replies || [];
      target.replies = [...replies, newReply];
      chatList[index] = { ...target };
      updated[activeChat.id] = [...chatList];
      setMessages(updated);
      setActiveThreadMsg({ ...target });
    }
    setThreadText('');
  };

  const handleAddReaction = (msgId: string, emoji: string) => {
    const updated = { ...messages };
    const chatList = updated[activeChat.id] || [];
    const index = chatList.findIndex(m => m.id === msgId);
    if (index !== -1) {
      const msg = chatList[index];
      const reactions = [...msg.reactions];
      const existing = reactions.find(r => r.emoji === emoji);
      
      if (existing) {
        if (existing.users.includes('Marcus Vance')) {
          // remove reaction
          existing.count -= 1;
          existing.users = existing.users.filter(u => u !== 'Marcus Vance');
        } else {
          existing.count += 1;
          existing.users.push('Marcus Vance');
        }
      } else {
        reactions.push({ emoji, count: 1, users: ['Marcus Vance'] });
      }

      msg.reactions = reactions.filter(r => r.count > 0);
      chatList[index] = { ...msg };
      updated[activeChat.id] = [...chatList];
      setMessages(updated);
    }
  };

  const togglePinMessage = (msgId: string) => {
    const updated = { ...messages };
    const chatList = updated[activeChat.id] || [];
    const index = chatList.findIndex(m => m.id === msgId);
    if (index !== -1) {
      const msg = chatList[index];
      msg.isPinned = !msg.isPinned;
      chatList[index] = { ...msg };
      updated[activeChat.id] = [...chatList];
      setMessages(updated);
      if (onAddNotification) {
        onAddNotification(
          msg.isPinned ? 'Message Pinned' : 'Message Unpinned',
          `A conversation highlight was cataloged into the pinned register of #${activeChat.name}.`,
          'Low',
          'Project'
        );
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const mockFileMsg: ChatMessage = {
        id: `f-${Date.now()}`,
        senderName: 'Marcus Vance',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
        senderRole: 'Staff Full-Stack Engineer',
        text: `Uploaded a shared workspace resource.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        file: {
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.type.split('/')[1]?.toUpperCase() || 'FILE'
        },
        reactions: []
      };

      const updated = { ...messages };
      if (!updated[activeChat.id]) updated[activeChat.id] = [];
      updated[activeChat.id] = [...updated[activeChat.id], mockFileMsg];
      setMessages(updated);

      if (onAddNotification) {
        onAddNotification(
          'Chat Asset Discovered',
          `New file "${file.name}" was shared directly within #${activeChat.name} sprint node.`,
          'Medium',
          'Task'
        );
      }
    }
  };

  const handleSelectChannel = (ch: ChatChannel) => {
    setActiveChat(ch);
    // Clear unread
    setChannels(prev => prev.map(item => item.id === ch.id ? { ...item, unreadCount: 0 } : item));
    setActiveThreadMsg(null);
  };

  const currentMessages = messages[activeChat.id] || [];
  const filteredMessages = currentMessages.filter(m => {
    const pinsPass = showPinnedOnly ? m.isPinned : true;
    const searchPass = searchQuery ? m.text.toLowerCase().includes(searchQuery.toLowerCase()) || m.senderName.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return pinsPass && searchPass;
  });

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8.5rem)] flex bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl text-left font-sans">
      
      {/* 1. Slack Style Navigation Left Sidebar */}
      <div className="w-64 border-r border-slate-100 bg-[#0F172A] text-slate-300 flex flex-col shrink-0 select-none">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white flex items-center gap-1.5">
              Slack Enterprise Grid
            </span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              m4_marcus_vance
            </span>
          </div>
          <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer" title="Invite User">
            <UserPlus className="w-4 h-4" />
          </button>
        </div>

        {/* Channels scroll container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          
          {/* CHANNELS SECTION */}
          <div>
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500 px-2.5 mb-1.5">
              <span>Sprint Channels</span>
              <span className="text-indigo-400 text-xs hover:text-indigo-300 cursor-pointer">+</span>
            </div>
            <div className="space-y-0.5">
              {channels.filter(c => c.type === 'channel').map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSelectChannel(c)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                    activeChat.id === c.id 
                      ? 'bg-indigo-600 text-white font-bold' 
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Hash className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{c.name}</span>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* PROJECT CHATS SECTION */}
          <div>
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500 px-2.5 mb-1.5">
              <span>Project Hubs</span>
              <span className="text-indigo-400 text-xs hover:text-indigo-300 cursor-pointer">+</span>
            </div>
            <div className="space-y-0.5">
              {channels.filter(c => c.type === 'project').map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSelectChannel(c)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                    activeChat.id === c.id 
                      ? 'bg-indigo-600 text-white font-bold' 
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Hash className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{c.name}</span>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* DIRECT MESSAGES SECTION */}
          <div>
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500 px-2.5 mb-1.5">
              <span>Direct Messages</span>
              <span className="text-indigo-400 text-xs hover:text-indigo-300 cursor-pointer">+</span>
            </div>
            <div className="space-y-0.5">
              {channels.filter(c => c.type === 'dm').map(c => {
                const presenceColor = c.presence === 'Online' ? 'bg-emerald-500' : c.presence === 'Busy' ? 'bg-rose-500' : c.presence === 'Away' ? 'bg-amber-400' : 'bg-slate-600';
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelectChannel(c)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      activeChat.id === c.id 
                        ? 'bg-indigo-600 text-white font-bold' 
                        : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="relative">
                        <img src={c.avatar} alt={c.name} referrerPolicy="no-referrer" className="w-5 h-5 rounded-full object-cover border border-slate-700 shrink-0" />
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-1 ring-[#0F172A] ${presenceColor}`} />
                      </div>
                      <span className="truncate">{c.name}</span>
                    </div>
                    {c.unreadCount > 0 && (
                      <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                        {c.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Presence Footer indicator */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/40 flex items-center gap-2.5 text-xs">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120" referrerPolicy="no-referrer" alt="Marcus" className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0F172A]" />
          </div>
          <div className="flex flex-col text-left truncate">
            <span className="font-bold text-white text-[11px] leading-tight">Marcus Vance</span>
            <span className="text-[9px] text-slate-500 truncate">Staff Full-Stack</span>
          </div>
        </div>
      </div>

      {/* 2. Chat Feed Center Section */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex-1 flex flex-col bg-white relative transition-all duration-150 ${dragOver ? 'bg-indigo-50/20' : ''}`}
      >
        {/* Chat Feed Header bar */}
        <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4.5">
          <div className="flex items-center gap-2 text-slate-800">
            {activeChat.type === 'dm' ? (
              <div className="relative">
                <img src={activeChat.avatar} alt={activeChat.name} referrerPolicy="no-referrer" className="w-6 h-6 rounded-full object-cover border border-slate-200" />
                <span className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ring-1 ring-white ${activeChat.presence === 'Online' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              </div>
            ) : (
              <Hash className="w-5 h-5 text-slate-500 shrink-0" />
            )}
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-2">
                {activeChat.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium line-clamp-1">
                {activeChat.description || `${activeChat.presence || 'Online'} • Synapse AI team communication secure thread`}
              </span>
            </div>
          </div>

          {/* Search messages, pins, bookmarks */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 w-44 focus-within:w-52 transition-all">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-[10px] text-slate-700 placeholder-slate-400 focus:outline-none w-full font-medium"
              />
            </div>

            <button 
              onClick={() => setShowPinnedOnly(!showPinnedOnly)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                showPinnedOnly ? 'bg-amber-50 border-amber-200 text-amber-600' : 'hover:bg-slate-50 border-slate-200 text-slate-400'
              }`}
              title="Filter pinned messages"
            >
              <Pin className="w-3.5 h-3.5" />
              {showPinnedOnly && <span className="text-[9px] font-bold">Pinned</span>}
            </button>
          </div>
        </div>

        {/* Drag Over Overlay */}
        <AnimatePresence>
          {dragOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-indigo-600/10 backdrop-blur-sm border-2 border-dashed border-indigo-500 z-10 flex flex-col items-center justify-center pointer-events-none text-indigo-600"
            >
              <Paperclip className="w-10 h-10 animate-bounce mb-2" />
              <span className="text-xs font-bold">Drop your document here to share with team</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages list feed scroll area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {filteredMessages.length === 0 ? (
            <div className="py-24 text-center text-slate-400 text-xs font-medium">
              {showPinnedOnly ? 'No pinned dialogue items found.' : `This is the start of #${activeChat.name} workspace history.`}
            </div>
          ) : (
            filteredMessages.map((m) => (
              <div key={m.id} className="flex gap-3 hover:bg-slate-50/70 p-2 rounded-2xl group transition-all duration-100">
                <img 
                  src={m.senderAvatar} 
                  alt={m.senderName} 
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200" 
                />
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-slate-800 leading-tight">{m.senderName}</span>
                    <span className="text-[9px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.2 rounded-md uppercase">
                      {m.senderRole}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">
                      {m.timestamp}
                    </span>
                    {m.isPinned && (
                      <span className="text-[9px] text-amber-500 font-bold flex items-center gap-0.5 ml-2">
                        <Pin className="w-2.5 h-2.5" /> Pinned
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-normal text-left">{m.text}</p>

                  {/* Render Shared Files if any */}
                  {m.file && (
                    <div className="mt-2 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between max-w-sm">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="truncate text-left">
                          <span className="text-xs font-bold text-slate-800 block truncate">{m.file.name}</span>
                          <span className="text-[9px] text-slate-400 block font-semibold uppercase font-mono">{m.file.size} • {m.file.type}</span>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Reactions Bar */}
                  {m.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.reactions.map((r, rIdx) => {
                        const hasReacted = r.users.includes('Marcus Vance');
                        return (
                          <button
                            key={rIdx}
                            onClick={() => handleAddReaction(m.id, r.emoji)}
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold transition-colors cursor-pointer ${
                              hasReacted ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
                            }`}
                            title={`Reacted by: ${r.users.join(', ')}`}
                          >
                            <span>{r.emoji}</span>
                            <span>{r.count}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Hover Actions Menu (Slack style) */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 border border-slate-200 bg-white rounded-lg p-0.5 shadow-md absolute right-8 mt-[-2.2rem] transition-opacity duration-150 z-20">
                    {['👍', '🔥', '❤️', '👏'].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => handleAddReaction(m.id, emoji)}
                        className="w-6 h-6 hover:bg-slate-50 rounded flex items-center justify-center text-xs cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <button 
                      onClick={() => togglePinMessage(m.id)}
                      className="w-6 h-6 hover:bg-slate-50 rounded flex items-center justify-center text-slate-400 hover:text-amber-500 cursor-pointer" 
                      title="Pin Message"
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setActiveThreadMsg(m)}
                      className="w-6 h-6 hover:bg-slate-50 rounded flex items-center justify-center text-slate-400 hover:text-indigo-600 cursor-pointer" 
                      title="Reply in Thread"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thread Replies counter */}
                  {m.replies && m.replies.length > 0 && (
                    <button
                      onClick={() => setActiveThreadMsg(m)}
                      className="mt-2.5 flex items-center gap-1.5 text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>{m.replies.length} {m.replies.length === 1 ? 'reply' : 'replies'} • Last reply today</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={msgEndRef} />
        </div>

        {/* Typing indicators */}
        <AnimatePresence>
          {isTyping && typingUser && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-4.5 py-1 text-[10px] text-slate-500 font-semibold italic flex items-center gap-1.5 select-none"
            >
              <div className="flex gap-0.5">
                <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
              <span>{typingUser} is typing...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messaging Box input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex gap-2">
          <button type="button" className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0">
            <Paperclip className="w-4.5 h-4.5" />
          </button>
          
          <input
            type="text"
            placeholder={`Message #${activeChat.name}... (Press Enter to transmit)`}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl px-4 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800"
          />

          <button 
            type="submit"
            disabled={!messageText.trim()}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition-colors shrink-0 flex items-center justify-center cursor-pointer shadow-sm shadow-indigo-600/10"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>

      {/* 3. Thread side panel (Slack-style progressive disclosure) */}
      <AnimatePresence>
        {activeThreadMsg && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '340px', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="border-l border-slate-100 bg-slate-50/50 flex flex-col shrink-0 h-full overflow-hidden"
          >
            {/* Thread Header */}
            <div className="h-14 border-b border-slate-100 bg-white flex items-center justify-between px-4">
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800">Thread Replies</span>
                <span className="text-[9px] text-slate-400 font-medium">#{activeChat.name} workspace highlights</span>
              </div>
              <button 
                onClick={() => setActiveThreadMsg(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Parent message inspector */}
            <div className="p-4 bg-white border-b border-slate-100 space-y-2 text-left select-none">
              <div className="flex gap-2.5">
                <img src={activeThreadMsg.senderAvatar} alt={activeThreadMsg.senderName} referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                <div>
                  <span className="text-[11px] font-bold text-slate-800 block leading-tight">{activeThreadMsg.senderName}</span>
                  <span className="text-[8px] text-slate-400 font-bold block mt-0.5 uppercase">{activeThreadMsg.senderRole}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-150 leading-relaxed">
                {activeThreadMsg.text}
              </p>
            </div>

            {/* Thread Replies list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {!activeThreadMsg.replies || activeThreadMsg.replies.length === 0 ? (
                <div className="py-12 text-center text-[10px] text-slate-400 font-semibold select-none">
                  No replies logged. Start the discussion thread.
                </div>
              ) : (
                activeThreadMsg.replies.map((rep) => (
                  <div key={rep.id} className="flex gap-2.5 hover:bg-slate-100/50 p-1.5 rounded-xl transition-all">
                    <img src={rep.senderAvatar} alt={rep.senderName} referrerPolicy="no-referrer" className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-200" />
                    <div className="flex-1 space-y-0.5 text-left">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[10px] font-bold text-slate-800">{rep.senderName}</span>
                        <span className="text-[8px] text-slate-400 font-semibold">{rep.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed">{rep.text}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={threadEndRef} />
            </div>

            {/* Reply thread input box */}
            <form onSubmit={handleSendThreadMessage} className="p-3 bg-white border-t border-slate-100 flex gap-1.5">
              <input
                type="text"
                placeholder="Reply to thread..."
                value={threadText}
                onChange={(e) => setThreadText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
              />
              <button 
                type="submit"
                disabled={!threadText.trim()}
                className="p-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg transition-colors shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
