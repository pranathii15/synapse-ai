import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, MessageSquare, Pin, Phone, Video, Send, Paperclip, Smile, 
  Trash2, Copy, Reply, ArrowRight, MoreVertical, ShieldCheck, CheckCheck, 
  Sparkles, FileText, Link as LinkIcon, Calendar, User, Info, MessageCircle, 
  X, Mic, Image, FileDown, Volume2, Globe, ListCollapse, CheckSquare
} from 'lucide-react';
import Button from './Button';

// Mock Team Members
const MOCK_EMPLOYEES = [
  {
    id: 'm1',
    name: 'Sarah Jenkins',
    role: 'Lead AI Scientist',
    department: 'Research & Intelligence',
    skills: ['PyTorch', 'Transformer Architectures', 'LLM Fine-tuning', 'Vector DBs'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    status: 'Online',
    email: 'sarah.j@synapse.ai',
    recentText: 'Are the loss metrics finalized yet?'
  },
  {
    id: 'm2',
    name: 'Dr. Alex Rivera',
    role: 'Principal RAG Engineer',
    department: 'Applied AI Systems',
    skills: ['FAISS', 'LangChain', 'Python', 'FastAPI', 'Semantic Search'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    status: 'In Meeting',
    email: 'alex.r@synapse.ai',
    recentText: 'I just finished testing the hybrid RAG pipeline!'
  },
  {
    id: 'm3',
    name: 'Maya Chen',
    role: 'Senior Cloud Architect',
    department: 'Infrastructure & DevOps',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'Multi-Region Architecture'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    status: 'Working Remotely',
    email: 'maya.c@synapse.ai',
    recentText: 'Multi-region DB replication lag is under 12ms.'
  },
  {
    id: 'm4',
    name: 'Marcus Vance',
    role: 'Staff Full-Stack Engineer',
    department: 'Product Systems',
    skills: ['React', 'Next.js', 'Node.js', 'Tailwind', 'WebSockets'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    status: 'Busy',
    email: 'marcus.v@synapse.ai',
    recentText: 'Vite & Tailwind config polished successfully!'
  },
  {
    id: 'm5',
    name: 'Elena Rostova',
    role: 'Principal Security Officer',
    department: 'Cybersecurity & Compliance',
    skills: ['mTLS', 'Zero-Trust Networks', 'OAuth 2.0', 'SIEM Logs'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    status: 'Away',
    email: 'elena.r@synapse.ai',
    recentText: 'Security audit is complete with zero alerts.'
  }
];

// Mock Channel Groups
const MOCK_CHANNELS = [
  { id: 'c-general', name: 'general', type: 'channel', description: 'Company-wide general discussions' },
  { id: 'c-announcements', name: 'announcements', type: 'announcements', description: 'Important business announcements' },
  { id: 'c-engineering', name: 'engineering', type: 'channel', description: 'AI, React, Kubernetes technical talks' },
  { id: 'c-hr', name: 'hr', type: 'channel', description: 'People operations & workplace culture' },
  { id: 'c-sales', name: 'sales', type: 'channel', description: 'Enterprise deal telemetry and accounts' },
  { id: 'c-management', name: 'management', type: 'channel', description: 'SaaS leadership and sprint boards' }
];

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  avatar: string;
  text: string;
  timestamp: string;
  isPinned?: boolean;
  replyTo?: string;
  attachment?: {
    name: string;
    type: 'image' | 'pdf' | 'voice' | 'link';
    size?: string;
    url?: string;
  };
}

const INITIAL_MESSAGES: Record<string, Message[]> = {
  'm1': [
    { id: '1', senderId: 'm1', senderName: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', text: 'Hi team, let’s sync up on the Project Athena loss curves.', timestamp: '10:14 AM' },
    { id: '2', senderId: 'me', senderName: 'Super Admin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120', text: 'Sure! Did Alex finalize the hybrid embeddings retrieval setup?', timestamp: '10:16 AM' },
    { id: '3', senderId: 'm1', senderName: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', text: 'Yes, Alex is seeing massive semantic improvements. Let me share the current draft report below.', timestamp: '10:17 AM', isPinned: true },
    { 
      id: '4', 
      senderId: 'm1', 
      senderName: 'Sarah Jenkins', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', 
      text: 'Here is the draft document.', 
      timestamp: '10:18 AM',
      attachment: { name: 'athena_loss_metrics_q3.pdf', type: 'pdf', size: '2.4 MB' }
    }
  ],
  'm2': [
    { id: '1', senderId: 'm2', senderName: 'Dr. Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120', text: 'Hey there! Hybrid RAG integration tests look solid.', timestamp: 'Yesterday' },
    { id: '2', senderId: 'me', senderName: 'Super Admin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120', text: 'Awesome news, Alex! What is our semantic search recall latency?', timestamp: 'Yesterday' },
    { id: '3', senderId: 'm2', senderName: 'Dr. Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120', text: 'It average 24ms, down from 80ms! Hybrid re-ranking via BGE-reranker worked magic.', timestamp: 'Yesterday' }
  ],
  'c-general': [
    { id: '1', senderId: 'm1', senderName: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', text: 'Welcome everyone to the SynapseAI high-performance workspace!', timestamp: 'Wednesday' },
    { id: '2', senderId: 'm3', senderName: 'Maya Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120', text: 'Glad to be here! Setting up AP-East multi-master Kubernetes clustering today.', timestamp: 'Wednesday' },
    { id: '3', senderId: 'm4', senderName: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120', text: 'Let’s make sure we standardize our card margins to 24px per SaaS branding guidelines.', timestamp: 'Wednesday' }
  ]
};

interface MessagesViewProps {
  onStartCall?: (type: 'voice' | 'video', user: any) => void;
}

export default function MessagesView({ onStartCall }: MessagesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState('m1'); // default to Sarah
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState('');
  const [typing, setTyping] = useState<boolean>(false);
  
  // AI Overlay Panel States
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiActionType, setAiActionType] = useState<'summary' | 'notes' | 'tasks' | 'reply' | 'translate' | 'search'>('summary');
  const [aiResponseText, setAiResponseText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Message Options Context/Reply State
  const [replyMessageId, setReplyMessageId] = useState<string | null>(null);

  // References
  const messageEndRef = useRef<HTMLDivElement>(null);

  const activeEmployee = MOCK_EMPLOYEES.find(e => e.id === activeId);
  const activeChannel = MOCK_CHANNELS.find(c => c.id === activeId);
  
  const currentChatName = activeEmployee ? activeEmployee.name : (activeChannel ? `#${activeChannel.name}` : 'Conversation');
  const currentChatAvatar = activeEmployee ? activeEmployee.avatar : '';
  const currentChatRole = activeEmployee ? activeEmployee.role : 'Group Channel';
  const currentChatDept = activeEmployee ? activeEmployee.department : (activeChannel ? activeChannel.description : '');

  useEffect(() => {
    // Scroll to bottom on load
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, messages]);

  // Handle Send Message
  const handleSendMessage = (textOverride?: string, customAttachment?: Message['attachment']) => {
    const textToSend = textOverride || inputVal;
    if (!textToSend.trim() && !customAttachment) return;

    const newMsg: Message = {
      id: Math.random().toString(),
      senderId: 'me',
      senderName: 'Super Admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      replyTo: replyMessageId ? replyMessageId : undefined,
      attachment: customAttachment
    };

    const chatHistory = messages[activeId] || [];
    setMessages({
      ...messages,
      [activeId]: [...chatHistory, newMsg]
    });

    if (!textOverride) setInputVal('');
    setReplyMessageId(null);

    // Simulate real reply typing indicator
    if (activeEmployee) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        const replyText = getMockReply(activeId, textToSend);
        const autoReply: Message = {
          id: Math.random().toString(),
          senderId: activeId,
          senderName: activeEmployee.name,
          avatar: activeEmployee.avatar,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => ({
          ...prev,
          [activeId]: [...(prev[activeId] || []), autoReply]
        }));
      }, 2500);
    }
  };

  const getMockReply = (id: string, sentText: string): string => {
    if (id === 'm1') return "That sounds perfect! Let's align on a video call to detail those loss metrics further. Let me know when you're ready.";
    if (id === 'm2') return "Agreed! The BGE model makes full use of context windows. I will write a quick task card for maya as well.";
    return "Acknowledged! Synapse AI node is online. Let me run a test compile loop on this.";
  };

  // Quick AI Assistant Inside Messages
  const handleAiAction = (type: 'summary' | 'notes' | 'tasks' | 'reply' | 'translate' | 'search') => {
    setAiActionType(type);
    setAiDrawerOpen(true);
    setAiLoading(true);

    const chatHistory = messages[activeId] || [];
    const conversationText = chatHistory.map(m => `${m.senderName}: ${m.text}`).join('\n');

    setTimeout(() => {
      setAiLoading(false);
      if (type === 'summary') {
        setAiResponseText(
          `### 🤖 Conversation Summary\n\n` +
          `The discussion focuses on the implementation and benchmarking of Project Athena's intelligence hub. ` +
          `Key developments include **Alex's hybrid RAG search optimizations** reducing recall latency from 80ms down to **24ms**.\n\n` +
          `**Key Themes:**\n` +
          `- FAISS index benchmark results.\n` +
          `- High-accuracy loss metrics draft PDF shared.\n` +
          `- Request to align on scheduled video call soon.`
        );
      } else if (type === 'notes') {
        setAiResponseText(
          `### 📝 Meeting Notes & Action Items\n\n` +
          `**Date/Time:** July 3, 2026\n` +
          `**Participants:** ${currentChatName}, Super Admin\n\n` +
          `**Decisions Made:**\n` +
          `- BGE-reranker adopted for multi-lingual pipelines.\n` +
          `- Standardized card spacing is locked at 24px across panels.\n\n` +
          `**Next Steps:**\n` +
          `- **@Alex Rivera**: Verify hybrid retrieval on 1M customer dataset.\n` +
          `- **@Super Admin**: Review shared PDF draft report on loss metrics.`
        );
      } else if (type === 'tasks') {
        setAiResponseText(
          `### 🚀 Suggested Tasks to Assign\n\n` +
          `We extracted these actionable items based on the conversation history:\n\n` +
          `1. **[SYN-401] Review Athena Loss Report**\n` +
          `   - **Assignee:** Super Admin\n` +
          `   - **Priority:** High\n` +
          `   - **Context:** Inspect draft pdf shared by Sarah.\n\n` +
          `2. **[SYN-402] Validate Multi-Region lag thresholds**\n` +
          `   - **Assignee:** Maya Chen\n` +
          `   - **Priority:** Medium\n` +
          `   - **Target:** Verify lag keeps under 12ms limit.`
        );
      } else if (type === 'reply') {
        setAiResponseText(
          `### 💬 Suggested Smart Replies\n\n` +
          `Click any options to send directly:\n\n` +
          `- *Option 1 (Professional)*: "Excellent work on this, Sarah! Let's schedule a Zoom/Meet briefing this afternoon to lock in the next deployment cycle."\n` +
          `- *Option 2 (Casual)*: "Thanks for sharing! Looks great, I'll review the metrics PDF right away and get back to you."`
        );
      } else if (type === 'translate') {
        setAiResponseText(
          `### 🌐 Real-time Translation (Spanish)\n\n` +
          `*Translated Last Message:*\n` +
          `**Original:** "Yes, Alex is seeing massive semantic improvements. Let me share the current draft report below."\n\n` +
          `**Spanish:** "Sí, Alex está viendo mejoras semánticas masivas. Permítanme compartir el informe preliminar actual a continuación."`
        );
      } else if (type === 'search') {
        setAiResponseText(
          `### 🔍 AI Semantic Query Search\n\n` +
          `Search term: **"Metrics"**\n` +
          `Found 2 relevant matching text logs:\n\n` +
          `- **Sarah Jenkins [10:17 AM]:** "...Athena loss metrics curves..."\n` +
          `- **Sarah Jenkins [10:18 AM]:** "athena_loss_metrics_q3.pdf"`
        );
      }
    }, 1500);
  };

  // Message operations
  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Message copied to clipboard!');
  };

  const pinMessage = (msgId: string) => {
    const updated = (messages[activeId] || []).map(m => m.id === msgId ? { ...m, isPinned: !m.isPinned } : m);
    setMessages({ ...messages, [activeId]: updated });
  };

  const deleteMessage = (msgId: string) => {
    const updated = (messages[activeId] || []).filter(m => m.id !== msgId);
    setMessages({ ...messages, [activeId]: updated });
  };

  const handleStartCallTrigger = (type: 'voice' | 'video') => {
    if (onStartCall && activeEmployee) {
      onStartCall(type, activeEmployee);
    } else {
      alert(`Initiating simulated ${type} call to ${currentChatName}...`);
    }
  };

  const chatHistory = messages[activeId] || [];

  return (
    <div className="h-[calc(100vh-100px)] flex gap-6 overflow-hidden">
      
      {/* 1. LEFT PANEL - Recent Chats & Employee Directory */}
      <div className="w-80 shrink-0 flex flex-col bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        
        {/* Search */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Workspace Chats</h3>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:bg-white">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search chat or channel..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs outline-none w-full placeholder-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Scrollable list of Chats / Channels */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-4">
          
          {/* Channels Group */}
          <div className="space-y-1">
            <div className="px-3 py-1 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Group Channels</span>
              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-mono text-[9px]">{MOCK_CHANNELS.length}</span>
            </div>
            {MOCK_CHANNELS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(channel => {
              const isActive = activeId === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveId(channel.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                    isActive ? 'bg-indigo-50/70 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className={`text-sm font-bold ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>#</span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold truncate ${isActive ? 'text-indigo-800' : 'text-slate-700'}`}>
                      {channel.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate font-semibold leading-tight">{channel.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pinned / Recent Direct Chats */}
          <div className="space-y-1">
            <div className="px-3 py-1 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Direct Messages</span>
              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-mono text-[9px]">{MOCK_EMPLOYEES.length}</span>
            </div>
            {MOCK_EMPLOYEES.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())).map(emp => {
              const isActive = activeId === emp.id;
              const statusColors: Record<string, string> = {
                'Online': 'bg-emerald-500',
                'In Meeting': 'bg-rose-500',
                'Working Remotely': 'bg-[#4F7DFF]',
                'Busy': 'bg-amber-500',
                'Away': 'bg-slate-400'
              };
              
              return (
                <button
                  key={emp.id}
                  onClick={() => setActiveId(emp.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all cursor-pointer relative group ${
                    isActive ? 'bg-indigo-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusColors[emp.status] || 'bg-slate-300'}`} />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start">
                      <p className={`text-xs font-bold truncate ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>{emp.name}</p>
                      <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">{emp.status === 'Working Remotely' ? 'Remote' : emp.status}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate font-semibold leading-tight">{emp.role}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{emp.recentText}</p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* 2. CENTER PANEL - Rich Active Chat conversation stream */}
      <div className="flex-1 flex flex-col bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs relative">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            {currentChatAvatar ? (
              <img src={currentChatAvatar} alt={currentChatName} className="w-10 h-10 rounded-xl object-cover border border-slate-200/50 shadow-sm" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">#</div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-slate-800">{currentChatName}</h4>
                {activeEmployee && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{currentChatRole} • {currentChatDept}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeEmployee && (
              <>
                <Button onClick={() => handleStartCallTrigger('voice')} size="sm" variant="secondary" className="px-3.5 rounded-xl text-xs gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Audio</span>
                </Button>
                <Button onClick={() => handleStartCallTrigger('video')} size="sm" variant="primary" className="px-3.5 rounded-xl text-xs gap-1">
                  <Video className="w-3.5 h-3.5 text-white" />
                  <span>Call Video</span>
                </Button>
              </>
            )}

            {/* AI Assistant Quick trigger */}
            <div className="h-6 w-[1px] bg-slate-200 mx-1" />
            <Button onClick={() => handleAiAction('summary')} size="sm" variant="outline" className="px-3 rounded-xl hover:bg-slate-100/50 gap-1 border-indigo-100 bg-indigo-50/20">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span className="text-indigo-600 text-xs font-bold">SynapseAI</span>
            </Button>
          </div>
        </div>

        {/* AI Suggestions Chip Bar */}
        <div className="bg-indigo-50/40 border-b border-indigo-100/50 px-4 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" /> AI Suggestions:
          </span>
          <button onClick={() => handleAiAction('summary')} className="px-2.5 py-1 rounded-lg bg-white border border-indigo-100/60 text-[10px] font-bold text-slate-600 hover:border-indigo-400 hover:text-indigo-700 transition-all shadow-2xs whitespace-nowrap cursor-pointer">
            ✨ Summarize chat
          </button>
          <button onClick={() => handleAiAction('notes')} className="px-2.5 py-1 rounded-lg bg-white border border-indigo-100/60 text-[10px] font-bold text-slate-600 hover:border-indigo-400 hover:text-indigo-700 transition-all shadow-2xs whitespace-nowrap cursor-pointer">
            📝 Create action items
          </button>
          <button onClick={() => handleAiAction('tasks')} className="px-2.5 py-1 rounded-lg bg-white border border-indigo-100/60 text-[10px] font-bold text-slate-600 hover:border-indigo-400 hover:text-indigo-700 transition-all shadow-2xs whitespace-nowrap cursor-pointer">
            ✅ Extract task tickets
          </button>
          <button onClick={() => handleAiAction('reply')} className="px-2.5 py-1 rounded-lg bg-white border border-indigo-100/60 text-[10px] font-bold text-slate-600 hover:border-indigo-400 hover:text-indigo-700 transition-all shadow-2xs whitespace-nowrap cursor-pointer">
            💬 Generate smart replies
          </button>
          <button onClick={() => handleAiAction('translate')} className="px-2.5 py-1 rounded-lg bg-white border border-indigo-100/60 text-[10px] font-bold text-slate-600 hover:border-indigo-400 hover:text-indigo-700 transition-all shadow-2xs whitespace-nowrap cursor-pointer">
            🌐 Translate to Spanish
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20">
          
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-xs font-bold text-slate-500">No messages yet</p>
              <p className="text-[11px] text-slate-400 max-w-xs mt-1">Start chatting with {currentChatName} below to sync project communications.</p>
            </div>
          ) : (
            chatHistory.map((msg) => {
              const isMe = msg.senderId === 'me';
              return (
                <div key={msg.id} className={`flex gap-3.5 items-start relative group ${isMe ? 'flex-row-reverse' : ''}`}>
                  
                  {/* Avatar */}
                  <img src={msg.avatar} alt={msg.senderName} className="w-8 h-8 rounded-lg object-cover border border-slate-200/50 shrink-0" />
                  
                  {/* Message body & Attachment block */}
                  <div className="space-y-1.5 max-w-[70%]">
                    <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[11px] font-bold text-slate-700">{msg.senderName}</span>
                      <span className="text-[9px] text-slate-400 font-mono font-medium">{msg.timestamp}</span>
                      {msg.isPinned && (
                        <Pin className="w-2.5 h-2.5 text-amber-500 rotate-45" />
                      )}
                    </div>

                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed border relative ${
                      isMe 
                        ? 'bg-indigo-600 text-white border-transparent rounded-tr-none shadow-sm shadow-indigo-600/10' 
                        : 'bg-white text-slate-700 border-slate-200/60 rounded-tl-none shadow-2xs'
                    }`}>
                      <p>{msg.text}</p>

                      {/* Attachment Rendering */}
                      {msg.attachment && (
                        <div className={`mt-3 p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                          isMe ? 'bg-indigo-700/50 border-white/15 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}>
                          <div className="flex items-center gap-2.5 min-w-0">
                            {msg.attachment.type === 'pdf' && <FileText className="w-5 h-5 text-rose-400 shrink-0" />}
                            {msg.attachment.type === 'image' && <Image className="w-5 h-5 text-emerald-400 shrink-0" />}
                            {msg.attachment.type === 'voice' && <Volume2 className="w-5 h-5 text-amber-400 shrink-0" />}
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold truncate">{msg.attachment.name}</p>
                              {msg.attachment.size && <p className="text-[9px] opacity-60 font-mono">{msg.attachment.size}</p>}
                            </div>
                          </div>
                          <button className="p-1 hover:bg-slate-100/20 rounded cursor-pointer">
                            <FileDown className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bubble Floating Menu */}
                  <div className={`absolute -top-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-slate-200 shadow-lg rounded-xl p-1 flex items-center gap-1 z-10 ${
                    isMe ? 'left-0 right-auto' : 'right-0'
                  }`}>
                    <button onClick={() => setReplyMessageId(msg.id)} title="Reply" className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
                      <Reply className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => pinMessage(msg.id)} title="Pin message" className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-amber-500 rounded-lg cursor-pointer">
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => copyMessage(msg.text)} title="Copy" className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteMessage(msg.id)} title="Delete" className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {typing && (
            <div className="flex gap-3 items-center text-slate-400">
              <img src={currentChatAvatar} alt="" className="w-6 h-6 rounded-lg object-cover" />
              <div className="flex items-center gap-1.5 bg-slate-100/55 border border-slate-200/50 py-2 px-3 rounded-xl rounded-tl-none">
                <span className="text-[10px] font-bold text-slate-500">{currentChatName} is typing</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}

          <div ref={messageEndRef} />
        </div>

        {/* Input Bar with attachments */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2.5 shrink-0">
          
          {/* Reply Context Bar */}
          {replyMessageId && (
            <div className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 flex justify-between items-center text-[11px] text-slate-600">
              <div className="flex items-center gap-2 truncate">
                <Reply className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Replying to message ID: <strong className="font-mono">{replyMessageId}</strong></span>
              </div>
              <button onClick={() => setReplyMessageId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handleSendMessage('', { name: 'analytics_dump.png', type: 'image', size: '1.8 MB' })} 
                title="Share Image" 
                className="p-2 hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer transition-colors"
              >
                <Image className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleSendMessage('', { name: 'sprint_kickoff.mp3', type: 'voice', size: '25 sec' })} 
                title="Send Voice Recording" 
                className="p-2 hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer transition-colors"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleSendMessage('', { name: 'compliance_report_draft.pdf', type: 'pdf', size: '1.2 MB' })} 
                title="Attach Document" 
                className="p-2 hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 flex items-center gap-2 focus-within:border-indigo-500 transition-all focus-within:ring-2 focus-within:ring-indigo-500/10 shadow-3xs">
              <input 
                type="text" 
                placeholder={`Type a secure message to ${currentChatName}...`} 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="bg-transparent text-xs outline-none w-full placeholder-slate-400 font-medium"
              />
              <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <Smile className="w-4.5 h-4.5" />
              </button>
            </div>

            <Button onClick={() => handleSendMessage()} variant="primary" className="p-2.5 rounded-xl shrink-0">
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>

      </div>

      {/* 3. RIGHT PANEL - Contact / Group Chat Information Drawer */}
      <div className="w-80 shrink-0 flex flex-col bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Workspace Intelligence</h4>
          <Info className="w-4 h-4 text-slate-400" />
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Active Profile Header */}
          <div className="text-center space-y-2">
            {currentChatAvatar ? (
              <img src={currentChatAvatar} alt="" className="w-20 h-20 rounded-2xl mx-auto object-cover border-2 border-indigo-100 shadow-sm" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-3xl mx-auto">#</div>
            )}
            <div className="space-y-0.5">
              <h5 className="text-sm font-bold text-slate-800">{currentChatName}</h5>
              <p className="text-xs text-slate-400 font-semibold">{currentChatRole}</p>
            </div>
            {activeEmployee && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                ● {activeEmployee.status}
              </span>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            
            {/* Quick Actions calling trigger */}
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => handleStartCallTrigger('voice')} size="sm" variant="secondary" className="rounded-xl text-[10px] p-2 bg-slate-50">
                📞 Audio Call
              </Button>
              <Button onClick={() => handleStartCallTrigger('video')} size="sm" variant="secondary" className="rounded-xl text-[10px] p-2 bg-slate-50">
                🎥 Video Sync
              </Button>
            </div>

            {/* Department info */}
            <div className="space-y-1.5 text-xs text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Details</span>
              <div className="space-y-1 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Department:</span>
                  <span className="text-slate-700 font-bold">{currentChatDept || 'Engineering'}</span>
                </div>
                {activeEmployee && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Email:</span>
                      <span className="text-indigo-600 font-bold font-mono text-[10px] truncate max-w-[140px]">{activeEmployee.email}</span>
                    </div>
                    <div className="space-y-1.5 mt-2 pt-2 border-t border-slate-200/50">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Key Expertise:</span>
                      <div className="flex flex-wrap gap-1">
                        {activeEmployee.skills.slice(0, 3).map((s, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md text-[9px] font-bold">{s}</span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Shared Files & Links lists */}
            <div className="space-y-3 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Shared Files</span>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="text-[10px] font-bold text-slate-700 truncate">athena_loss_metrics_q3.pdf</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 shrink-0">2.4 MB</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <Image className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-[10px] font-bold text-slate-700 truncate">vector_space_recall.png</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 shrink-0">1.8 MB</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Shared Links</span>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <LinkIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="text-[10px] font-bold text-indigo-600 underline truncate">github.com/synapse/core</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* AI Intelligence Drawer Overlay Panel */}
      <AnimatePresence>
        {aiDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiDrawerOpen(false)}
              className="fixed inset-0 bg-black z-[100] cursor-pointer"
            />
            {/* Slide in drawer panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-96 bg-white border-l border-slate-200/80 shadow-2xl z-[110] flex flex-col overflow-hidden font-sans"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-indigo-50/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                  <span className="font-bold text-xs text-indigo-900 uppercase tracking-widest">SynapseAI Communications</span>
                </div>
                <button onClick={() => setAiDrawerOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500 gap-3">
                    <div className="relative flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-600 animate-spin" />
                      <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse absolute" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest animate-pulse">Running semantic query engine...</span>
                  </div>
                ) : (
                  <div className="space-y-4 prose prose-slate max-w-none">
                    <div className="text-xs text-slate-700 leading-relaxed space-y-4">
                      {/* Formatted Text output */}
                      <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/50 space-y-3 font-medium">
                        {aiResponseText.split('\n\n').map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    </div>

                    {/* Copier & actions */}
                    <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                      <Button onClick={() => copyMessage(aiResponseText)} size="sm" variant="secondary" className="w-full text-xs font-bold rounded-xl justify-center gap-1.5">
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy AI response</span>
                      </Button>
                      
                      {aiActionType === 'reply' && (
                        <Button 
                          onClick={() => {
                            setInputVal("Excellent work on this, Sarah! Let's schedule a Zoom/Meet briefing this afternoon to lock in the next deployment cycle.");
                            setAiDrawerOpen(false);
                          }} 
                          size="sm" 
                          variant="primary" 
                          className="w-full text-xs font-bold rounded-xl justify-center"
                        >
                          Use Professional Option 1
                        </Button>
                      )}

                      {aiActionType === 'tasks' && (
                        <Button 
                          onClick={() => {
                            alert("Extracted tasks synced and assigned successfully to Project Athena tickets!");
                            setAiDrawerOpen(false);
                          }} 
                          size="sm" 
                          variant="success" 
                          className="w-full text-xs font-bold rounded-xl justify-center"
                        >
                          Deploy extracted tasks to JIRA/Tasks board
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
