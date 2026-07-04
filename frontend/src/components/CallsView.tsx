import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, Video, VideoOff, Mic, MicOff, ScreenShare, Square, 
  Hand, MessageSquare, Users, Settings, LogOut, Search, Clock, 
  PhoneCall, PhoneIncoming, PhoneOutgoing, ShieldCheck, Play, 
  X, Sparkles, UserCheck, Plus, Check, Volume2, PlayCircle, Star
} from 'lucide-react';
import Button from './Button';

// Mock employee contacts
const CONTACTS = [
  { id: 'm1', name: 'Sarah Jenkins', role: 'Lead AI Scientist', dept: 'Research', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', status: 'Online', isFav: true },
  { id: 'm2', name: 'Dr. Alex Rivera', role: 'Principal RAG Engineer', dept: 'Applied AI', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120', status: 'In Meeting', isFav: true },
  { id: 'm3', name: 'Maya Chen', role: 'Senior Cloud Architect', dept: 'DevOps', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120', status: 'Remote', isFav: false },
  { id: 'm4', name: 'Marcus Vance', role: 'Staff Full-Stack Engineer', dept: 'Product', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120', status: 'Busy', isFav: true },
  { id: 'm5', name: 'Elena Rostova', role: 'Principal Security Officer', dept: 'Security', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120', status: 'Away', isFav: false }
];

// Call History logs
const CALL_HISTORY = [
  { id: 'h1', name: 'Dr. Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120', type: 'outgoing', duration: '14 min 20 sec', time: '10:30 AM Today' },
  { id: 'h2', name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', type: 'incoming', duration: '5 min 12 sec', time: 'Yesterday 3:15 PM' },
  { id: 'h3', name: 'Maya Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120', type: 'missed', duration: '0 sec', time: 'Jul 1, 9:02 AM' }
];

// Upcoming Meetings lists
const UPCOMING_MEETINGS = [
  { id: 'mt1', title: 'Synapse Core LLM Daily Alignment', time: '11:00 AM (in 30 mins)', host: 'Sarah Jenkins', code: 'SYN-ALIGN-22', duration: '30 mins' },
  { id: 'mt2', title: 'AP-East Multi-region Infrastructure Walkthrough', time: '2:30 PM Today', host: 'Maya Chen', code: 'SYN-INFRA-89', duration: '45 mins' }
];

export default function CallsView() {
  const [activeCallState, setActiveCallState] = useState<'idle' | 'voice' | 'video'>('idle');
  const [currentCallUser, setCurrentCallUser] = useState<any>(null);
  
  // Call controls states
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [sharingScreen, setSharingScreen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [raisedHand, setRaisedHand] = useState(false);
  const [blurBackground, setBlurBackground] = useState(false);
  const [captions, setCaptions] = useState(false);
  const [currentViewMode, setCurrentViewMode] = useState<'gallery' | 'speaker'>('gallery');
  
  // Tabs and lists
  const [searchQuery, setSearchQuery] = useState('');
  const [callTimer, setCallTimer] = useState(0);

  // In-call drawers
  const [chatOpen, setChatOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Sarah Jenkins', text: 'Hey team, presenting the loss metrics draft now.', time: '11:03 AM' },
    { sender: 'Super Admin', text: 'Perfect! Checking the Kubernetes deployment alongside.', time: '11:04 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Call timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeCallState !== 'idle') {
      setCallTimer(0);
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeCallState]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = (type: 'voice' | 'video', user: any) => {
    setCurrentCallUser(user);
    setActiveCallState(type);
  };

  const endCall = () => {
    setActiveCallState('idle');
    setCurrentCallUser(null);
    setMuted(false);
    setCameraOff(false);
    setSharingScreen(false);
    setRecording(false);
    setRaisedHand(false);
    setCallTimer(0);
  };

  const handleSendInCallChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages([
      ...chatMessages,
      { sender: 'Super Admin', text: chatInput, time: 'Now' }
    ]);
    setChatInput('');
  };

  // Filtered contacts
  const filteredContacts = CONTACTS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-100px)] relative overflow-hidden font-sans">
      
      <AnimatePresence mode="wait">
        {activeCallState === 'idle' ? (
          
          /* ========================================================
             1. CALLS HOME DASHBOARD VIEW
             ======================================================== */
          <motion.div 
            key="calls-home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-y-auto"
          >
            
            {/* Left and Center 2 Columns */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Header Action Row */}
              <div className="premium-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1.5 text-left">
                  <h3 className="text-base font-bold text-[#223B63] flex items-center gap-2">
                    <Video className="w-5 h-5 text-indigo-600" />
                    <span>Instant Call & Video Hub</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">Start or schedule an encrypted WebRTC voice/video conference.</p>
                </div>
                
                <div className="flex gap-2.5 w-full sm:w-auto">
                  <Button onClick={() => startCall('video', CONTACTS[0])} variant="primary" className="flex-1 sm:flex-none text-xs font-bold rounded-xl gap-2 px-5 py-3">
                    <Plus className="w-4 h-4" />
                    <span>Start Instant Meeting</span>
                  </Button>
                </div>
              </div>

              {/* Upcoming Meetings & Quick Call Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Upcoming Meetings List */}
                <div className="premium-card p-5 space-y-4 text-left">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-500" /> Upcoming Synapse Syncs
                    </span>
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono">Today</span>
                  </div>

                  <div className="space-y-3.5">
                    {UPCOMING_MEETINGS.map(m => (
                      <div key={m.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-100 transition-all space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{m.title}</h4>
                          <span className="text-[9px] text-slate-400 font-mono font-bold uppercase shrink-0 ml-2">{m.duration}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">Host: **{m.host}** • Code: <code className="bg-slate-100 px-1 rounded font-mono font-bold text-slate-600">{m.code}</code></p>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-100/50">
                          <span className="text-[10px] text-indigo-600 font-bold">{m.time}</span>
                          <Button onClick={() => startCall('video', CONTACTS.find(c => c.name === m.host) || CONTACTS[0])} size="xs" variant="primary" className="rounded-lg text-[9px] px-2.5 py-1">
                            Join Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call History */}
                <div className="premium-card p-5 space-y-4 text-left">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <PhoneCall className="w-4 h-4 text-emerald-500" /> Recent Call Log
                    </span>
                  </div>

                  <div className="space-y-3">
                    {CALL_HISTORY.map(h => (
                      <div key={h.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-3">
                          <img src={h.avatar} alt={h.name} className="w-9 h-9 rounded-xl object-cover border border-slate-100" />
                          <div className="text-left">
                            <p className="text-xs font-bold text-slate-700">{h.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {h.type === 'outgoing' && <PhoneOutgoing className="w-3 h-3 text-indigo-500" />}
                              {h.type === 'incoming' && <PhoneIncoming className="w-3 h-3 text-emerald-500" />}
                              {h.type === 'missed' && <X className="w-3 h-3 text-rose-500" />}
                              <span className="text-[9px] text-slate-400 font-medium">{h.time}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-mono font-medium">{h.duration}</span>
                          <button onClick={() => startCall('voice', CONTACTS[0])} className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors cursor-pointer">
                            <Phone className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Searchable Team Directory Grid */}
              <div className="premium-card p-6 space-y-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-800">Team Directory ({CONTACTS.length} active)</span>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Click any teammate to initiate voice or premium video conference.</p>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full sm:w-60 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search teammates..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-xs outline-none w-full placeholder-slate-400 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredContacts.map(c => (
                    <div key={c.id} className="p-4 border border-slate-200/80 rounded-2xl bg-white hover:border-indigo-150 hover:shadow-xs transition-all flex flex-col justify-between h-full text-left space-y-3 relative group">
                      <div className="flex gap-3">
                        <div className="relative shrink-0">
                          <img src={c.avatar} alt={c.name} className="w-11 h-11 rounded-xl object-cover border border-slate-200/50 shadow-2xs" />
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            c.status === 'Online' ? 'bg-emerald-500' : c.status === 'In Meeting' ? 'bg-rose-500' : 'bg-amber-400'
                          }`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{c.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold truncate leading-tight">{c.role}</p>
                          <p className="text-[9px] text-[#4F7DFF] font-bold uppercase tracking-wider mt-0.5">{c.dept}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-slate-100">
                        <button onClick={() => startCall('voice', c)} className="flex-1 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 py-1.5 rounded-lg text-[10px] font-bold border border-slate-100 flex items-center justify-center gap-1 transition-colors cursor-pointer">
                          <Phone className="w-3 h-3" />
                          <span>Voice</span>
                        </button>
                        <button onClick={() => startCall('video', c)} className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
                          <Video className="w-3 h-3" />
                          <span>Video</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right sidebar Column - Favorites & Controls */}
            <div className="space-y-6">
              
              {/* Starred Favorite Contacts */}
              <div className="premium-card p-5 space-y-4 text-left">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500" /> Favorite Teammates
                  </span>
                </div>

                <div className="space-y-3.5">
                  {CONTACTS.filter(c => c.isFav).map(c => (
                    <div key={c.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-xl object-cover border border-slate-100" />
                        <div>
                          <p className="text-xs font-bold text-slate-700">{c.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{c.role}</p>
                        </div>
                      </div>

                      <div className="flex gap-1.5">
                        <button onClick={() => startCall('voice', c)} className="p-1.5 bg-slate-50 hover:bg-indigo-50 text-indigo-600 rounded-lg cursor-pointer border border-slate-100">
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => startCall('video', c)} className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg cursor-pointer">
                          <Video className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Encryption Banner */}
              <div className="premium-card p-5 bg-indigo-600 text-white text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-15">
                  <ShieldCheck className="w-24 h-24 rotate-12" />
                </div>
                <div className="relative space-y-3 z-10">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold text-xs">✓</span>
                  <h4 className="text-sm font-bold">End-to-End Encryption</h4>
                  <p className="text-[11px] leading-relaxed text-indigo-100">
                    All audio and video meetings on SynapseAI are secured with dynamic DTLS-SRTP AES-256 handshake. Media streams bypass databases entirely.
                  </p>
                </div>
              </div>

            </div>

          </motion.div>
        ) : (
          
          /* ========================================================
             2. IMMERSIVE IN-CALL VIEW (VOICE OR VIDEO SCREEN)
             ======================================================== */
          <motion.div 
            key="active-call"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950 text-white z-[200] flex flex-col h-screen font-sans"
          >
            
            {/* Top Bar Call metadata & indicator */}
            <div className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-slate-900 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs shadow-md">S</div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">Synapse Secure Session</span>
                    <span className="bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-md text-[8px] tracking-widest uppercase">Encrypted</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold">{currentCallUser?.name || 'Workspace Broadcast'} • {formatTimer(callTimer)}</p>
                </div>
              </div>

              {/* Timer indicator and speaker stats */}
              <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SECURE WEB-RTC</span>
                </div>
                {recording && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span>REC ON</span>
                  </div>
                )}
                {activeCallState === 'video' && (
                  <div className="flex bg-white/5 p-0.5 rounded-xl border border-white/10">
                    <button 
                      onClick={() => setCurrentViewMode('gallery')}
                      className={`px-3 py-1 rounded-lg text-[10px] cursor-pointer ${currentViewMode === 'gallery' ? 'bg-indigo-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                    >
                      Gallery View
                    </button>
                    <button 
                      onClick={() => setCurrentViewMode('speaker')}
                      className={`px-3 py-1 rounded-lg text-[10px] cursor-pointer ${currentViewMode === 'speaker' ? 'bg-indigo-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                    >
                      Speaker View
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Main Interactive Call Panel Area */}
            <div className="flex-1 flex overflow-hidden relative">
              
              {/* Call Canvas viewport */}
              <div className="flex-1 p-6 flex flex-col justify-center items-center bg-slate-950 relative overflow-hidden">
                
                {activeCallState === 'video' ? (
                  
                  /* A. VIDEO CALL VIEW GRID */
                  <div className="w-full h-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center">
                    
                    {/* Member 1 Box (Speaker Tile / Stock avatar) */}
                    <div className="relative h-full min-h-[220px] rounded-3xl overflow-hidden border border-white/10 bg-slate-900 group flex items-center justify-center">
                      <img src={currentCallUser?.avatar || CONTACTS[0].avatar} alt="" className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 text-left">
                        <span className="text-xs font-bold block">{currentCallUser?.name || 'Host'}</span>
                        <span className="text-[10px] text-slate-300 font-semibold">{currentCallUser?.role || 'Lead Analyst'}</span>
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1.5 rounded-lg border border-white/5">
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[9px] font-bold">Active Audio</span>
                      </div>
                    </div>

                    {/* Member 2 Box (My Local Camera Feed or simulated screen share) */}
                    <div className="relative h-full min-h-[220px] rounded-3xl overflow-hidden border border-white/10 bg-slate-900 flex items-center justify-center">
                      {cameraOff ? (
                        <div className="text-center space-y-2">
                          <div className="w-16 h-16 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xl mx-auto border border-indigo-500/20">ME</div>
                          <p className="text-xs text-slate-400 font-medium">Your camera is turned off</p>
                        </div>
                      ) : sharingScreen ? (
                        /* Simulated Presentation slides */
                        <div className="w-full h-full bg-slate-950 p-6 flex flex-col justify-between text-left border-2 border-emerald-500/30">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">Presentation Stream</span>
                            <h4 className="text-xs font-bold">Project Athena Sentiment curves.xlsx</h4>
                          </div>
                          
                          {/* Graph representation */}
                          <div className="h-28 flex items-end justify-between px-6 gap-2">
                            <span className="w-full bg-indigo-500 h-[60%] rounded-t-lg" />
                            <span className="w-full bg-indigo-500 h-[85%] rounded-t-lg" />
                            <span className="w-full bg-indigo-500 h-[45%] rounded-t-lg" />
                            <span className="w-full bg-indigo-500 h-[95%] rounded-t-lg" />
                          </div>

                          <span className="text-[9px] text-slate-500 font-bold self-end uppercase">Shared by Super Admin</span>
                        </div>
                      ) : (
                        <>
                          {/* Simulated selfie feed */}
                          <img 
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120" 
                            alt="" 
                            className={`w-full h-full object-cover opacity-85 ${blurBackground ? 'blur-md' : ''}`} 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 text-left">
                            <span className="text-xs font-bold block">Super Admin (You)</span>
                            <span className="text-[10px] text-slate-300 font-semibold">AP-East Infrastructure Controller</span>
                          </div>
                        </>
                      )}
                    </div>

                  </div>
                ) : (
                  
                  /* B. VOICE CALL VIEW CANVAS */
                  <div className="text-center space-y-6 max-w-sm">
                    <div className="relative">
                      {/* Avatar ripple effects */}
                      <span className="absolute -inset-4 rounded-full bg-indigo-500/10 animate-ping" />
                      <span className="absolute -inset-8 rounded-full bg-indigo-500/5 animate-ping" style={{ animationDelay: '500ms' }} />
                      
                      <img 
                        src={currentCallUser?.avatar || CONTACTS[0].avatar} 
                        alt="" 
                        className="w-28 h-28 rounded-3xl mx-auto object-cover border-4 border-indigo-500/20 shadow-2xl relative z-10" 
                      />
                    </div>

                    <div className="space-y-1.5 relative z-10">
                      <h4 className="text-base font-bold">{currentCallUser?.name}</h4>
                      <p className="text-xs text-slate-400 font-semibold">{currentCallUser?.role} • {currentCallUser?.dept}</p>
                      <span className="inline-block bg-white/10 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
                        Voice call in progress
                      </span>
                    </div>
                  </div>
                )}

                {/* Simulated live captions subtitles block */}
                {captions && (
                  <div className="absolute bottom-24 bg-black/60 border border-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl max-w-lg text-center text-xs text-slate-200">
                    <p className="font-bold text-indigo-400 text-[10px] mb-0.5">{currentCallUser?.name || 'Sarah Jenkins'}:</p>
                    <p className="font-medium">"I am reviewing the legal compliance dataset loss weights. Our next training checkpoint completes in 4 hours."</p>
                  </div>
                )}

              </div>

              {/* Chat Panel Sidebar */}
              <AnimatePresence>
                {chatOpen && (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 320, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="border-l border-white/10 bg-slate-900 shrink-0 flex flex-col h-full overflow-hidden"
                  >
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-950">
                      <span className="text-xs font-bold text-slate-200">Meeting Chat</span>
                      <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className="text-left space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-indigo-400">{msg.sender}</span>
                            <span className="text-[8px] text-slate-500 font-mono">{msg.time}</span>
                          </div>
                          <p className="text-xs text-slate-300 bg-white/5 border border-white/5 p-2.5 rounded-xl leading-relaxed font-medium">{msg.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 border-t border-white/10 bg-slate-950 flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Type a meeting chat..." 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendInCallChat()}
                        className="bg-white/5 border border-white/10 text-xs rounded-xl px-3 py-2 outline-none w-full text-white placeholder-slate-500"
                      />
                      <Button onClick={handleSendInCallChat} variant="primary" className="p-2 rounded-xl">
                        Send
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Participants list Panel Sidebar */}
              <AnimatePresence>
                {participantsOpen && (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 280, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="border-l border-white/10 bg-slate-900 shrink-0 flex flex-col h-full overflow-hidden"
                  >
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-950">
                      <span className="text-xs font-bold text-slate-200">Teammates Syncing</span>
                      <button onClick={() => setParticipantsOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120" alt="" className="w-7 h-7 rounded-lg object-cover" />
                          <span className="text-xs font-bold text-slate-300">Super Admin (You)</span>
                        </div>
                        <span className="text-[8px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0">Presenter</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={currentCallUser?.avatar || CONTACTS[0].avatar} alt="" className="w-7 h-7 rounded-lg object-cover" />
                          <span className="text-xs font-bold text-slate-300">{currentCallUser?.name || 'Sarah Jenkins'}</span>
                        </div>
                        <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0">Active</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Bottom Controls Bar */}
            <div className="h-20 border-t border-white/10 px-8 flex items-center justify-between bg-slate-900 shrink-0">
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setChatOpen(!chatOpen)} 
                  title="Meeting Chat"
                  className={`p-3 rounded-xl cursor-pointer border ${chatOpen ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30' : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white'}`}
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                </button>
                <button 
                  onClick={() => setParticipantsOpen(!participantsOpen)} 
                  title="Active members"
                  className={`p-3 rounded-xl cursor-pointer border ${participantsOpen ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30' : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white'}`}
                >
                  <Users className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Main controls (Mute, camera, end, screen share, hand, blur, caption) */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setMuted(!muted)} 
                  className={`p-3.5 rounded-2xl cursor-pointer ${muted ? 'bg-rose-600 text-white' : 'bg-white/10 hover:bg-white/15 text-slate-200'}`}
                  title={muted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {activeCallState === 'video' && (
                  <>
                    <button 
                      onClick={() => setCameraOff(!cameraOff)} 
                      className={`p-3.5 rounded-2xl cursor-pointer ${cameraOff ? 'bg-rose-600 text-white' : 'bg-white/10 hover:bg-white/15 text-slate-200'}`}
                      title={cameraOff ? 'Turn camera on' : 'Turn camera off'}
                    >
                      {cameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </button>
                    <button 
                      onClick={() => setSharingScreen(!sharingScreen)} 
                      className={`p-3.5 rounded-2xl cursor-pointer ${sharingScreen ? 'bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/15 text-slate-200'}`}
                      title={sharingScreen ? 'Stop sharing screen' : 'Share screen'}
                    >
                      <ScreenShare className="w-5 h-5" />
                    </button>
                  </>
                )}

                <button 
                  onClick={() => setRecording(!recording)} 
                  className={`p-3.5 rounded-2xl cursor-pointer ${recording ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-white/10 hover:bg-white/15 text-slate-200'}`}
                  title="Record Session"
                >
                  <Square className="w-4 h-4 fill-current shrink-0" />
                </button>

                <button 
                  onClick={() => setRaisedHand(!raisedHand)} 
                  className={`p-3.5 rounded-2xl cursor-pointer ${raisedHand ? 'bg-amber-600 text-white' : 'bg-white/10 hover:bg-white/15 text-slate-200'}`}
                  title="Raise hand"
                >
                  <Hand className="w-5 h-5" />
                </button>

                {activeCallState === 'video' && (
                  <button 
                    onClick={() => setBlurBackground(!blurBackground)} 
                    className={`p-3.5 rounded-2xl cursor-pointer ${blurBackground ? 'bg-indigo-600 text-white' : 'bg-white/10 hover:bg-white/15 text-slate-200'}`}
                    title="Toggle background blur"
                  >
                    <Sparkles className="w-5 h-5" />
                  </button>
                )}

                <button 
                  onClick={() => setCaptions(!captions)} 
                  className={`p-3.5 rounded-2xl cursor-pointer ${captions ? 'bg-indigo-600 text-white' : 'bg-white/10 hover:bg-white/15 text-slate-200'}`}
                  title="Toggle live transcription"
                >
                  <span>CC</span>
                </button>

                <div className="h-8 w-[1px] bg-white/10 mx-1" />

                <button 
                  onClick={endCall} 
                  className="bg-rose-600 hover:bg-rose-700 text-white p-3.5 rounded-2xl flex items-center justify-center cursor-pointer font-bold shadow-lg shadow-rose-600/20"
                  title="Leave Call / Terminate Sync"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              {/* Status block / Quick link */}
              <div className="text-right hidden md:block">
                <span className="text-[10px] text-slate-400 font-bold block">Encrypted Codec</span>
                <span className="text-[11px] font-mono font-bold text-[#4F7DFF]">OPUS/H264 @ 4.2Mbps</span>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
