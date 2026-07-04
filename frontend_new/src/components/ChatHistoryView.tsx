import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Search, 
  Trash2, 
  MessageSquare, 
  Bot, 
  ChevronRight, 
  Clock, 
  Calendar,
  X,
  Sparkles
} from 'lucide-react';
import { ChatConversation } from '../types';

interface ChatHistoryViewProps {
  conversations: ChatConversation[];
  onSelectChat: (chat: ChatConversation) => void;
  onDeleteChat: (id: string) => void;
  setCurrentTab: (tab: string) => void;
}

export default function ChatHistoryView({
  conversations,
  onSelectChat,
  onDeleteChat,
  setCurrentTab
}: ChatHistoryViewProps) {
  const [search, setSearch] = useState('');
  const [selectedHistChat, setSelectedHistChat] = useState<ChatConversation | null>(null);

  // Search filter
  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.featureUsed.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none pb-12 font-sans text-left">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-2">
        <span>Home</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-600 font-bold">AI History</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left 2 columns: Audit Logs Table */}
      <div className="lg:col-span-2 space-y-5">
        <div className="text-left">
          <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">AI History</h2>
          <p className="text-xs text-[#64748B]">Review, audit, or clear past model dialogue transcripts.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 w-full md:w-80 transition-all focus-within:border-[#4F7CAC] focus-within:ring-2 focus-within:ring-[#4F7CAC]/15">
            <Search className="w-4 h-4 text-[#64748B] shrink-0" />
            <input 
              type="text" 
              placeholder="Search AI history..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs text-[#1E293B] placeholder-[#64748B]/60 focus:outline-none w-full"
            />
          </div>

          <span className="text-[10px] text-[#64748B] font-mono font-semibold">
            Transcripts are TLS 1.3 client-encrypted
          </span>
        </div>

        {/* History Table/List */}
        <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white text-xs shadow-sm">
          {filteredConversations.length === 0 ? (
            <div className="py-20 text-center text-[#64748B] font-medium">
              No AI conversations yet
            </div>
          ) : (
            <div className="divide-y divide-[#E5E7EB]">
              {filteredConversations.map((c) => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedHistChat(c)}
                  className={`py-3 flex items-center justify-between gap-4 hover:bg-[#F7F8FA] px-2.5 rounded-xl cursor-pointer transition-colors ${
                    selectedHistChat?.id === c.id ? 'bg-[#4F7CAC]/10 text-[#1E293B]' : 'text-[#1E293B]'
                  }`}
                >
                  <div className="flex items-start gap-3 truncate text-left">
                    <MessageSquare className="w-4.5 h-4.5 text-[#64748B] mt-0.5 shrink-0" />
                    <div className="truncate space-y-1">
                      <span className="font-bold text-[#1E293B] block truncate">{c.title}</span>
                      <p className="text-[10px] text-[#64748B] truncate pr-4 font-normal">{c.lastMessage}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-mono">
                    <span className="text-[9px] bg-[#4F7CAC]/10 text-[#23395B] px-2.5 py-0.5 rounded-full border border-[#4F7CAC]/15 font-sans font-bold">
                      {c.featureUsed}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-semibold hidden sm:inline-block">
                      {c.date}
                    </span>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Completely erase this conversation from the encrypted secure log database?')) {
                          onDeleteChat(c.id);
                          if (selectedHistChat?.id === c.id) setSelectedHistChat(null);
                          alert('Transcripts successfully deleted.');
                        }
                      }}
                      className="p-1.5 hover:bg-red-50 hover:text-[#E76F51] text-[#64748B] rounded transition-all cursor-pointer"
                      title="Erase dialogue log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Right Column: Dialogue Transcripts Inspector Panel */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 text-[#23395B]">
          <History className="w-4 h-4" />
          <h3 className="text-xs font-bold uppercase">Log Dialogue Inspector</h3>
        </div>

        {selectedHistChat ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4 flex flex-col h-[500px] text-left shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#4F7CAC] font-bold uppercase">Transcripts Verified</span>
                <h3 className="text-xs font-bold text-[#1E293B] line-clamp-1">{selectedHistChat.title}</h3>
              </div>
              
              <button 
                onClick={() => setSelectedHistChat(null)}
                className="p-1 hover:bg-[#F7F8FA] rounded-lg text-[#64748B] hover:text-[#1E293B] transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Conversation Messages Lists */}
            <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
              {selectedHistChat.messages.length === 0 ? (
                <p className="text-center text-[#64748B] font-medium py-12">No messages saved in dialogue cache.</p>
              ) : (
                selectedHistChat.messages.map((m) => {
                  const isAi = m.sender === 'ai';
                  return (
                    <div 
                      key={m.id} 
                      className={`flex gap-2.5 max-w-[90%] ${isAi ? 'self-start text-left' : 'ml-auto text-right justify-end'}`}
                    >
                      {isAi && (
                        <div className="w-6 h-6 rounded bg-[#4F7CAC]/10 border border-[#4F7CAC]/15 flex items-center justify-center text-[#4F7CAC] shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className={`p-2.5 rounded-xl border ${
                          isAi 
                            ? 'bg-[#F7F8FA] border-[#E5E7EB] text-[#1E293B] rounded-tl-none font-normal' 
                            : 'bg-[#4F7CAC] border-none text-white rounded-tr-none font-medium'
                        } leading-relaxed text-[11px] shadow-xs`}>
                          {m.text}
                        </div>
                        <span className="text-[8px] text-[#64748B] font-semibold block pl-1">
                          {m.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] flex gap-2">
              <button 
                onClick={() => {
                  onSelectChat(selectedHistChat);
                  setCurrentTab('ai-assistant');
                }}
                className="w-full py-2 bg-[#23395B] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer text-center shadow-xs"
              >
                Re-open Active Chat Thread
              </button>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center border border-[#E5E7EB] bg-white rounded-2xl shadow-sm p-6 text-left">
            <p className="text-xs text-[#64748B] max-w-xs mx-auto text-center font-medium leading-relaxed">
              Select any past discussion node from the logs to inspect full dialogue records and models leveraged.
            </p>
          </div>
        )}
      </div>

    </div>
    </div>
  );
}
