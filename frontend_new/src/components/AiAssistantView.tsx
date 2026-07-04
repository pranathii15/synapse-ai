import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  Trash2, 
  Sparkles, 
  Check, 
  Copy, 
  RefreshCw, 
  FileText, 
  Clock, 
  Plus, 
  Search,
  BookOpen,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { ChatConversation, ChatMessage } from '../types';
import { api } from '../lib/api';

interface AiAssistantViewProps {
  conversations: ChatConversation[];
  activeChat: ChatConversation | null;
  onSelectChat: (chat: ChatConversation) => void;
  onNewChat: (title: string) => void;
  onAddMessage: (chatId: string, sender: 'user' | 'ai', text: string, references?: string[]) => Promise<void>;
  onDeleteChat: (id: string) => void;
}

export default function AiAssistantView({
  conversations,
  activeChat,
  onSelectChat,
  onNewChat,
  onAddMessage,
  onDeleteChat
}: AiAssistantViewProps) {
  const [chatSearch, setChatSearch] = useState('');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const presets = [
    { title: 'File Search Tips', desc: 'How to search through documents effectively' },
    { title: 'Sarah\'s Tasks', desc: 'Summary of tasks assigned to Sarah Jenkins' },
    { title: 'Project Athena Status', desc: 'Milestones and upcoming deliverables' }
  ];

  // Search filter for chats list
  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(chatSearch.toLowerCase())
  );

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeChat) return;

    setInputText('');
    setLoading(true);

    // Add User Message (saves locally and POSTs to /chat/history)
    await onAddMessage(activeChat.id, 'user', text);

    // Wait a brief moment to allow the backend /chat/history to respond and append the AI reply if any
    await new Promise(resolve => setTimeout(resolve, 800));

    // Find the latest state of the active conversation to see if an AI message was appended
    const updatedConv = conversations.find(c => c.id === activeChat.id);
    const messages = updatedConv ? updatedConv.messages : [];
    const lastMessage = messages[messages.length - 1];

    if (lastMessage && lastMessage.sender === 'ai') {
      // Backend successfully generated and logged the AI reply!
      setLoading(false);
      return;
    }

    // High fidelity offline/storage-only fallback simulation
    let aiResponse = `I've checked the workspace for your query regarding "${text}". All your documents have been successfully indexed for search. You can ask me any questions about them, and I will find the answers for you.`;
    let refs: string[] = ['Q3_Strategic_AI_Roadmap.pdf'];

    const t = text.toLowerCase();
    if (t.includes('search') || t.includes('file')) {
      aiResponse = `To get the best search results, make sure your documents are in plain text or PDF format. I can search through thousands of pages in milliseconds to find exactly what you need.`;
      refs = ['Zero_Trust_Architecture_Spec.pdf', 'Q3_Strategic_AI_Roadmap.pdf'];
    } else if (t.includes('sarah')) {
      aiResponse = `According to the meeting notes, Sarah Jenkins has **2 tasks**:\n1. Update the document search styles and layout (Due July 20th).\n2. Sync with Elena Rostova on the final server security updates.`;
      refs = ['Employee_Onboarding_Handbook.pdf'];
    } else if (t.includes('meeting') || t.includes('minutes') || t.includes('transcript')) {
      aiResponse = `I've connected to the Meeting Intelligence system. You can upload any meeting transcript or notes in the Meetings tab to automatically extract minutes, summary, and action items, then assign tasks to your team members instantly.`;
      refs = ['Kickoff_Meeting_Minutes.txt'];
    } else if (t.includes('team') || t.includes('assign') || t.includes('recommend')) {
      aiResponse = `Our Team Staffing Assistant is fully integrated. In the Projects or Team Planner tabs, you can get intelligent recommendations matching developer skills and workloads to any incoming task. For example, Dr. Alex Rivera is currently at 40% workload and is prime for Python or system-level tasks.`;
      refs = ['Employee_Onboarding_Handbook.pdf'];
    }

    // Persist the AI response via onAddMessage (which calls POST /chat/history)
    await onAddMessage(activeChat.id, 'ai', aiResponse, refs);
    setLoading(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none pb-12 font-sans text-left">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
        <span>Home</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-600 font-bold">Ask AI</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Ask AI</h2>
          <p className="text-xs text-slate-500 font-medium">Have safe corporate sandboxed model dialogues with our agent.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white h-[600px] shadow-sm">
      
      {/* 1. Chat History Sidebar Panel */}
      <div className="border-r border-[#E5E7EB] bg-[#F7F8FA] p-4 flex flex-col justify-between hidden md:flex h-full overflow-hidden">
        <div className="space-y-4 flex flex-col h-full overflow-hidden">
          {/* Action Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1E293B]">Conversations</span>
            <button 
              onClick={() => onNewChat('AI Chat Thread #' + (conversations.length + 1))}
              className="p-1.5 hover:bg-slate-200 rounded-lg text-[#64748B] hover:text-[#1E293B] transition-colors cursor-pointer"
              title="New Thread"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search conversations */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-xl px-2.5 py-1.5 text-xs focus-within:border-[#4F7CAC] focus-within:ring-2 focus-within:ring-[#4F7CAC]/15 transition-all">
            <Search className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              className="bg-transparent text-[11px] text-[#1E293B] focus:outline-none w-full placeholder-[#64748B]/60"
            />
          </div>

          {/* Chats listing */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filteredConversations.map((c) => {
              const isSelected = activeChat?.id === c.id;
              return (
                <div 
                  key={c.id}
                  onClick={() => onSelectChat(c)}
                  className={`group p-2.5 rounded-xl text-left cursor-pointer transition-all flex items-center justify-between border ${
                    isSelected 
                      ? 'bg-[#4F7CAC]/10 border-[#4F7CAC]/20 text-[#23395B]' 
                      : 'hover:bg-white border-transparent text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  <div className="space-y-0.5 truncate flex-1 pr-1">
                    <span className="text-xs font-bold block truncate leading-tight">{c.title}</span>
                    <span className="text-[9px] text-[#64748B] block mt-0.5">{c.date} • {c.featureUsed}</span>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this conversation?')) {
                        onDeleteChat(c.id);
                      }
                    }}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-[#E76F51] rounded transition-all cursor-pointer"
                    title="Delete discussion"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Chat Workspace interface */}
      <div className="md:col-span-3 bg-white flex flex-col justify-between h-full overflow-hidden">
        
        {activeChat ? (
          <>
            {/* Header / Active Chat banner */}
            <div className="h-14 border-b border-[#E5E7EB] bg-[#F7F8FA] px-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-left">
                <div className="p-1.5 rounded-lg bg-[#4F7CAC]/10 border border-[#4F7CAC]/20">
                  <Bot className="w-4 h-4 text-[#4F7CAC]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#1E293B] leading-tight">{activeChat.title}</h3>
                  <span className="text-[9px] text-[#64748B] block leading-none">AI is ready to help</span>
                </div>
              </div>

              {/* Utility Panel */}
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => {
                    if (window.confirm('Clear all conversation messages?')) {
                      activeChat.messages = [];
                      onSelectChat({ ...activeChat });
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[#64748B] hover:text-[#1E293B] text-[10px] font-semibold border border-[#E5E7EB] transition-colors cursor-pointer shadow-xs"
                >
                  Clear Thread
                </button>
              </div>
            </div>

            {/* Chat list viewport */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              
              {/* If empty messages, show beautiful dashboard style welcome presets */}
              {activeChat.messages.length === 0 ? (
                <div className="py-8 text-center max-w-md mx-auto space-y-5">
                  <div className="w-10 h-10 rounded-full bg-[#4F7CAC]/10 flex items-center justify-center mx-auto text-[#4F7CAC]">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#1E293B]">Your AI Assistant</h3>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Ask questions about your projects, tasks, and documents, or summarize meeting notes instantly.
                    </p>
                  </div>

                  {/* Preset Buttons Grid */}
                  <div className="grid grid-cols-1 gap-2 text-left">
                    {presets.map((p, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleSend(p.title)}
                        className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] hover:border-[#4F7CAC]/30 hover:bg-white transition-all text-xs flex items-center justify-between group cursor-pointer hover:shadow-sm"
                      >
                        <div>
                          <span className="font-semibold text-[#1E293B] block">{p.title}</span>
                          <span className="text-[10px] text-[#64748B] mt-0.5 block">{p.desc}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#64748B] group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                activeChat.messages.map((m) => {
                  const isAi = m.sender === 'ai';
                  return (
                    <div 
                      key={m.id}
                      className={`flex gap-3 max-w-[85%] ${isAi ? 'self-start text-left' : 'ml-auto text-right justify-end'}`}
                    >
                      {isAi && (
                        <div className="w-7 h-7 rounded-lg bg-[#4F7CAC]/10 border border-[#4F7CAC]/15 flex items-center justify-center shrink-0 mt-1">
                          <Bot className="w-4 h-4 text-[#4F7CAC]" />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <div className={`p-3.5 rounded-2xl border ${
                          isAi 
                            ? 'bg-[#F7F8FA] border-[#E5E7EB] text-[#1E293B] rounded-tl-none' 
                            : 'bg-[#4F7CAC] border-[#23395B]/10 text-white rounded-tr-none'
                        } leading-relaxed text-[11.5px] whitespace-pre-line relative group shadow-xs`}>
                          {m.text}
                          
                          {/* Copy trigger floating */}
                          {isAi && (
                            <button 
                              onClick={() => handleCopy(m.text, m.id)}
                              className="absolute top-2 right-2 p-1.5 bg-white border border-[#E5E7EB] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[#64748B] hover:text-[#1E293B] shadow-xs"
                              title="Copy response"
                            >
                              {copiedId === m.id ? (
                                <Check className="w-3 h-3 text-[#3CB371]" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Sources/citations if they exist */}
                        {isAi && m.references && m.references.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 items-center pl-1">
                            <span className="text-[9px] text-[#64748B] font-semibold flex items-center gap-1">
                              <BookOpen className="w-3 h-3" /> Sources:
                            </span>
                            {m.references.map((r, ri) => (
                              <span 
                                key={ri} 
                                className="text-[9px] bg-[#23395B]/10 border border-[#23395B]/15 text-[#23395B] font-semibold px-2 py-0.5 rounded-full"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Loader */}
              {loading && (
                <div className="flex gap-3 self-start text-left max-w-[80%]">
                  <div className="w-7 h-7 rounded-lg bg-[#4F7CAC]/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-[#4F7CAC]" />
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] text-[#64748B] rounded-tl-none inline-flex items-center gap-1 text-[11px] shadow-xs">
                    <RefreshCw className="w-3 h-3 animate-spin text-[#4F7CAC]" />
                    <span>AI is searching...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Form input wrapper */}
            <div className="p-4 border-t border-[#E5E7EB] bg-[#F7F8FA]">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask SynapseAI anything..." 
                  className="flex-1 bg-white border border-[#E5E7EB] text-xs text-[#1E293B] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 transition-all placeholder-[#64748B]/60"
                  disabled={loading}
                />
                
                <button 
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="px-4 py-2.5 bg-[#23395B] hover:bg-[#1E293B] disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
            <Bot className="w-12 h-12 text-[#64748B]" />
            <h3 className="text-sm font-bold text-[#1E293B]">No chat selected</h3>
            <p className="text-xs text-[#64748B] max-w-xs text-center font-normal">
              Start a new conversation or select one from the sidebar.
            </p>
            <button 
              onClick={() => onNewChat('AI Chat Thread #1')}
              className="px-4 py-2 bg-[#23395B] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
            >
              Start New Chat
            </button>
          </div>
        )}

      </div>

    </div>
    </div>
  );
}
