import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AmbientBackground from './AmbientBackground';
import Logo from './Logo';
import ToggleSwitch from './ToggleSwitch';
import { 
  Terminal, 
  ArrowRight, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Briefcase, 
  Mail, 
  FileText, 
  Bot, 
  Video, 
  Award, 
  HelpCircle, 
  Lock, 
  Cpu, 
  Users, 
  ArrowUpRight, 
  Clock, 
  Globe,
  UploadCloud,
  ChevronDown,
  X,
  MapPin,
  Compass,
  Building,
  Activity,
  Dna,
  Shield,
  Zap,
  Cloud,
  Triangle,
  Atom,
  Layers,
  Box,
  Server,
  Network,
  Component
} from 'lucide-react';

interface PublicWebsiteViewProps {
    onLogin: (email: string, password: string) => void;
}

export default function PublicWebsiteView({ onLogin }: PublicWebsiteViewProps) {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiHistory, setAiHistory] = useState<Array<{ q: string; a: string }>>([
    { 
      q: 'What is SynapseAI?', 
      a: 'SynapseAI is an Enterprise AI Workspace that aggregates your company\'s projects, tasks, documents, and meetings into a single unified workspace. Backed by local vector embeddings and isolated FAISS clusters, it ensures highly secure semantic search, automated meeting minutes extraction, and automated cross-team recommendations.' 
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Interactive landing page "Ask SynapseAI" states
  const [homeAiQuestion, setHomeAiQuestion] = useState('');
  const [homeAiAnswer, setHomeAiAnswer] = useState<string | null>(null);
  const [homeAiLoading, setHomeAiLoading] = useState(false);
  const [homeCurrentQ, setHomeCurrentQ] = useState<string | null>(null);

  const getAnswerForQuestion = (question: string): string => {
    const q = question.toLowerCase();
    if (q.includes('what does synapseai do') || q.includes('what is synapseai') || q.includes('workspace')) {
      return "SynapseAI is a friendly, secure workspace for your team. It brings together projects, tasks, documents, and meetings. It has easy AI search, smart AI recommendations for team staffing, and automatic meeting summaries.";
    } else if (q.includes('product') || q.includes('suite')) {
      return "Our main workspace features include: our easy-to-use Dashboard, AI Document Search, AI Meeting Summaries, and an AI Planner to match the right team members with the right projects.";
    } else if (q.includes('meeting intelligence') || q.includes('transcript')) {
      return "Our Meeting Summarizer lets you upload transcripts or meeting notes. It automatically transcribes speech, extracts key summaries and action items, and lets you create tasks for team members with a single click.";
    } else if (q.includes('document ai') || q.includes('semantic search') || q.includes('rag')) {
      return "Our AI Document Search lets you upload files like specifications, PDFs, and team policies. It prepares your document for reading and opens a friendly chat where you can ask questions. You can search your documents with AI to get direct answers instantly, saving you from reading hundreds of pages.";
    } else if (q.includes('internship') || q.includes('graduate') || q.includes('career') || q.includes('apply')) {
      return "We offer robust internships and graduate programs! Currently open roles include: AI Software Engineer Intern, Backend Developer (Go/Rust), and Graduate Machine Learning Researcher. Applications are processed via our sandbox application portal under the Careers section.";
    } else if (q.includes('technolog')) {
      return "We build our application using modern technologies like React, TypeScript, and Tailwind CSS. All of your AI interactions are processed through a secure server proxy using advanced and secure Gemini API models, keeping your data private.";
    } else if (q.includes('security') || q.includes('privacy') || q.includes('compliance')) {
      return "Security is our core foundation. We enforce strict data encryption, standard compliance guidelines, and multi-factor hardware security. No corporate datasets are ever leaked, cached, or used for public model training.";
    } else if (q.includes('values') || q.includes('mission') || q.includes('ethics')) {
      return "Our mission is to establish trusted, secure, and human-aligned AI workspaces. Our core values are: Technical Excellence, Strict Customer Confidentiality, Inclusive Team Architectures, and Responsible AI Innovation.";
    } else if (q.includes('industr')) {
      return "We primarily serve high-security, compliance-heavy industries including Biotech research, FinTech transaction processing, Legal compliance auditing, and Cloud engineering divisions.";
    } else if (q.includes('offices') || q.includes('where')) {
      return "SynapseAI is a remote-first enterprise with global physical workspace hubs in San Francisco, CA, Zurich, Switzerland, and Singapore.";
    }
    return "I am SynapseAI's friendly assistant! That's a great question. Our platform lets you search your documents, meeting notes, and team files securely in real-time. We use secure servers to ensure your company information remains strictly private.";
  };

  const handleHomeAsk = (questionText: string) => {
    if (!questionText.trim()) return;
    setHomeAiLoading(true);
    setHomeCurrentQ(questionText);
    setHomeAiAnswer(null);
    
    setTimeout(() => {
      const ans = getAnswerForQuestion(questionText);
      setHomeAiAnswer(ans);
      setHomeAiLoading(false);
      setHomeAiQuestion('');
    }, 750);
  };
  
  // Careers States
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', resumeName: '', coverLetter: '' });
  const [isApplying, setIsApplying] = useState(false);
  const [resumeDragging, setResumeDragging] = useState(false);

  // Contact States
  const [contactForm, setContactForm] = useState({ name: '', email: '', company: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Login Modal
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('pranathi@example.com');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [rememberMe, setRememberMe] = useState(true);

  const faqRef = useRef<HTMLDivElement>(null);

  // FAQ Toggle
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const mockPredefinedQuestions = [
    'What does SynapseAI do?',
    'What products do you provide?',
    'How does Meeting Intelligence work?',
    'How does Document AI work?',
    'What internships are available?',
    'What security standards do you follow?',
    'What technologies do you use?'
  ];

  const handleAskPublicAi = (question: string) => {
    if (!question.trim()) return;
    setAiLoading(true);
    
    setTimeout(() => {
      let answer = "I'm SynapseAI's Enterprise Advocate. That's an excellent question! Our semantic engine indexes your compliance files, meeting recordings, and Slack transcripts locally in real time. We deploy sandboxed LLM containers behind a secure corporate proxy to keep your intellectual property isolated and strictly private.";
      
      const q = question.toLowerCase();
      if (q.includes('what does synapseai do') || q.includes('what is synapseai')) {
        answer = "SynapseAI is a next-generation Enterprise AI Workspace. It unifies project management, team resourcing, tasks, docs, and meetings. It has active semantic search, AI recommendations for staffing, automatic meeting summaries, and an isolated vector space for RAG queries.";
      } else if (q.includes('products')) {
        answer = "Our main suite includes: Synapse Core (SaaS Dashboard), Synapse Document AI (semantic indexers & FAISS RAG), Synapse Meeting Intelligence (whisper transcriptions, summarization, action item extraction), and Synapse Team Allocator (AI skill matching and resource optimization).";
      } else if (q.includes('meeting intelligence') || q.includes('transcript')) {
        answer = "Synapse Meeting Intelligence allows you to paste kickoff transcripts or hook up recordings. It automatically transcribes speech, extracts key technical summary paragraphs, isolates critical milestones, and generates new system tasks assigned directly to team members with one click.";
      } else if (q.includes('document ai') || q.includes('semantic search') || q.includes('rag')) {
        answer = "Document AI parses specifications, PDFs, and legal drafts. It breaks files into chunks, ingests high-fidelity embeddings into isolated FAISS databases, and opens a dedicated semantic chat. Users can run RAG (Retrieval-Augmented Generation) queries to extract exact statistics without reading hundreds of pages.";
      } else if (q.includes('internship') || q.includes('graduate') || q.includes('career') || q.includes('apply')) {
        answer = "We offer robust internships and graduate programs! Currently open roles include: AI Software Engineer Intern, Backend Developer (Go/Rust), and Graduate Machine Learning Researcher. Applications are processed via our sandbox application portal under the Careers section.";
      } else if (q.includes('technolog')) {
        answer = "We build using modern React, TypeScript, and Tailwind CSS on the frontend. Our high-performance backend leverages Go and Python. For AI vector operations, we rely on isolated FAISS indexes, local transformers, and the advanced enterprise Gemini API models proxy.";
      } else if (q.includes('security') || q.includes('privacy') || q.includes('compliance')) {
        answer = "Security is our core foundation. We enforce strict TLS 1.3 encryption, SOC 2 Type II compliance standards, static data isolation, and multi-factor hardware keys. No enterprise datasets are ever leaked, cached, or utilized for public model training.";
      } else if (q.includes('values') || q.includes('mission') || q.includes('ethics')) {
        answer = "Our mission is to establish trusted, secure, and human-aligned AI workspaces. Our core values are: Technical Excellence, Strict Customer Confidentiality, Inclusive Team Architectures, and Responsible AI Innovation.";
      } else if (q.includes('industr')) {
        answer = "We primarily serve high-security, compliance-heavy industries including Biotech research, FinTech transaction processing, Legal compliance auditing, and Cloud engineering divisions.";
      } else if (q.includes('offices') || q.includes('where')) {
        answer = "SynapseAI is a remote-first enterprise with global physical workspace hubs in San Francisco, CA, Zurich, Switzerland, and Singapore.";
      }

      setAiHistory(prev => [...prev, { q: question, a: answer }]);
      setAiLoading(false);
      setAiQuestion('');
    }, 700);
  };

  // Careers data
  const jobs = [
    { 
      id: 'ai-eng',
      title: 'AI Systems Engineer', 
      type: 'Full-time', 
      location: 'San Francisco, CA / Hybrid', 
      dept: 'Engineering',
      desc: 'Build and optimize secure AI document search pipelines and fast indexes for our customers.',
      req: ['Degree in Computer Science or equivalent experience', '2+ years working with AI models and secure document indexers', 'Experience with Go or Python programming languages'],
      salary: '$180k - $240k + Equity'
    },
    { 
      id: 'se-grad',
      title: 'Graduate Software Engineer (Full-Stack)', 
      type: 'Full-time', 
      location: 'Zurich, Switzerland / Hybrid', 
      dept: 'Engineering',
      desc: 'Join our cohort to build beautiful, responsive web applications leveraging React, Tailwind CSS, and Node.js.',
      req: ['BSc or MSc in Computer Science or related engineering discipline', 'Proficiency in TypeScript, React, and modern CSS modules', 'Strong analytical foundation and passion for UI engineering'],
      salary: '$110k - $145k'
    },
    { 
      id: 'ai-intern',
      title: 'AI Research & Applications Intern', 
      type: 'Internship (6 Months)', 
      location: 'Remote (US / Europe)', 
      dept: 'Applied Research',
      desc: 'Help test AI document search systems, explore open-source AI models, and design better prompts for our AI assistant.',
      req: ['Currently enrolled in a Computer Science or Math program', 'Experience writing clean Python code', 'Familiarity with AI search or language processing basics'],
      salary: '$8,000 / month'
    },
    { 
      id: 'fed',
      title: 'Senior Frontend Architect', 
      type: 'Full-time', 
      location: 'Remote (Global)', 
      dept: 'Design & UX',
      desc: 'Lead the design and frontend engineering of SynapseAI\'s unified workspace UI, focusing on state optimization and responsiveness.',
      req: ['5+ years shipping high-fidelity SaaS web applications', 'Expertise in React 18, Vite, Tailwind CSS, and Framer Motion', 'Obsessive attention to layouts, negative space, and typographic scale'],
      salary: '$170k - $220k'
    }
  ];

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);
    setTimeout(() => {
      alert(`Application submitted successfully! Our talent acquisition team will review your resume for the ${selectedJob.title} position.`);
      setApplyForm({ name: '', email: '', resumeName: '', coverLetter: '' });
      setIsApplying(false);
      setSelectedJob(null);
    }, 1000);
  };

  const handleResumeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setResumeDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setApplyForm(prev => ({ ...prev, resumeName: e.dataTransfer.files[0].name }));
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', company: '', message: '' });
    }, 2000);
  };

  const handleDemoLogin = () => {
    const normalizedEmail = (loginEmail || '').trim() || 'pranathi@example.com';
    const normalizedPassword = (loginPassword || '').trim() && loginPassword !== '••••••••' ? loginPassword : '123456';

    setIsLoginModalOpen(false);
    onLogin(normalizedEmail, normalizedPassword);
  };

  return (
    <div className="min-h-screen bg-white text-[#1E293B] font-sans flex flex-col justify-between overflow-x-hidden select-none text-left relative">
      <AmbientBackground />
      
      {/* Navbar Section */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="flex items-center justify-center shrink-0">
              <Logo size={40} strokeColor="#3E5BFF" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-sans font-bold text-[#23395B] text-base tracking-tight leading-tight">SynapseAI</span>
              <span className="text-[9.5px] text-[#4F7CAC] font-bold uppercase tracking-wider">Enterprise AI Workspace</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {[
              { id: 'home', label: 'Home' },
              { id: 'features', label: 'Features' },
              { id: 'solutions', label: 'Solutions' },
              { id: 'about', label: 'About' },
              { id: 'careers', label: 'Careers' },
              { id: 'public-ai', label: 'Public AI' },
              { id: 'contact', label: 'Contact' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#23395B]/10 text-[#23395B] font-bold' 
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F7F8FA]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setActiveTab('public-ai')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#4F7CAC] hover:text-[#23395B] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Talk to AI</span>
            </button>

            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4.5 py-2 text-xs font-bold text-white bg-[#23395B] hover:bg-[#1E293B] border border-[#23395B] rounded-xl cursor-pointer transition-all shadow-md shadow-slate-900/10 flex items-center gap-1.5"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          
          {/* HOME PAGE (LANDING PAGE FLOW) */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16 md:space-y-24 pb-20"
            >
              {/* Hero Section */}
              <section className="relative overflow-hidden pt-16 md:pt-24 pb-20 px-4 md:px-8 max-w-4xl mx-auto text-center flex items-center justify-center min-h-[50vh]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#4F7CAC]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#3CB371]/5 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto space-y-6">
                  <h1 className="font-sans font-bold text-4xl sm:text-5xl md:text-6xl text-[#23395B] tracking-tight leading-tight">
                    Enterprise AI <span className="text-[#4F7CAC]">Workspace</span>
                  </h1>
                  
                  <p className="text-base sm:text-lg md:text-xl text-[#64748B] leading-relaxed max-w-2xl mx-auto font-normal">
                    One intelligent platform to manage documents, projects, meetings, teams, and enterprise AI collaboration. Securely sandbox your operational intelligence.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <button 
                      onClick={() => setIsLoginModalOpen(true)}
                      className="px-6 py-3.5 rounded-xl bg-[#23395B] hover:bg-[#1E293B] text-white text-xs font-bold transition-all shadow-lg shadow-[#23395B]/15 cursor-pointer flex items-center gap-2 hover:-translate-y-0.5"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => setActiveTab('public-ai')}
                      className="px-6 py-3.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#CBD5E1] hover:bg-[#F7F8FA] text-[#1E293B] text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2 hover:-translate-y-0.5"
                    >
                      <Bot className="w-4 h-4 text-[#4F7CAC]" />
                      <span>Talk to AI</span>
                    </button>

                    <button 
                      onClick={() => alert('Launching product deep dive video player...')}
                      className="px-5 py-3.5 text-[#64748B] hover:text-[#23395B] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 hover:bg-slate-100 rounded-xl"
                    >
                      <Video className="w-4 h-4 text-[#64748B]" />
                      <span>Watch Demo</span>
                    </button>
                  </div>
                </div>
              </section>



              {/* Highlights Capabilities / Features Section */}
              <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="text-xs font-bold text-[#4F7CAC] uppercase">Enterprise Capabilities</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#23395B] tracking-tight">
                    Secure AI Integrations Designed for Productivity
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Every tool works inside a unified sandbox protecting your operational data.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm space-y-3 hover:border-[#4F7CAC]/40 hover:shadow-md transition-all">
                    <div className="p-2.5 bg-[#4F7CAC]/10 border border-[#4F7CAC]/15 rounded-xl text-[#4F7CAC] w-fit">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#1E293B]">AI Document Search</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                      Upload project plans, notes, and company policies. Use our secure AI assistant to find direct answers with clear document page sources.
                    </p>
                  </div>

                  <div className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm space-y-3 hover:border-[#4F7CAC]/40 hover:shadow-md transition-all">
                    <div className="p-2.5 bg-[#23395B]/10 border border-[#23395B]/15 rounded-xl text-[#23395B] w-fit">
                      <Video className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#1E293B]">Meeting Intelligence</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                      Convert meetings transcripts into structured briefs. Automatically extract technical action points and issue tasks directly to team members.
                    </p>
                  </div>

                  <div className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm space-y-3 hover:border-[#4F7CAC]/40 hover:shadow-md transition-all">
                    <div className="p-2.5 bg-[#3CB371]/10 border border-[#3CB371]/15 rounded-xl text-[#3CB371] w-fit">
                      <Award className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#1E293B]">AI Team Recommendations</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                      Eliminate staffing guesswork. Our skill alignment models suggest ideal engineers based on actual workloads and project technical requirements.
                    </p>
                  </div>
                </div>
              </section>

              {/* Experience SynapseAI AI Assistant Section */}
              <section className="bg-gradient-to-b from-white to-[#F7F8FA] py-16 border-t border-[#E5E7EB]">
                <div className="max-w-4xl mx-auto px-4 md:px-8 text-center space-y-8">
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-[#4F7CAC] uppercase tracking-wider">Interactive Sandbox</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#23395B] tracking-tight">
                      Experience SynapseAI AI Assistant
                    </h2>
                    <p className="text-sm text-[#64748B] max-w-xl mx-auto font-normal">
                      Get instant, enterprise-grade answers about our company, products, careers, and secure AI workspace technology directly from our live demonstration model.
                    </p>
                  </div>

                  <div className="glass-panel p-6 md:p-8 rounded-3xl border border-[#E5E7EB] bg-white shadow-xl max-w-3xl mx-auto space-y-6">
                    {/* Interactive Input Form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleHomeAsk(homeAiQuestion);
                      }}
                      className="space-y-4"
                    >
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={homeAiQuestion}
                          onChange={(e) => setHomeAiQuestion(e.target.value)}
                          placeholder="Ask about our products, internships, AI features..."
                          className="w-full bg-[#F7F8FA] border border-[#E5E7EB] text-sm rounded-2xl pl-4 pr-28 py-3.5 text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/10 transition-all placeholder-[#64748B]/55 font-normal shadow-inner"
                        />
                        <button
                          type="submit"
                          disabled={homeAiLoading || !homeAiQuestion.trim()}
                          className="absolute right-2 px-4 py-2 rounded-xl bg-[#23395B] hover:bg-[#1E293B] text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Ask AI</span>
                        </button>
                      </div>
                    </form>

                    {/* AI Response Area / Animated Typing Indicator */}
                    <AnimatePresence mode="wait">
                      {homeAiLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="p-5 bg-[#F7F8FA] border border-[#E5E7EB] rounded-2xl text-left space-y-3"
                        >
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-[#4F7CAC] animate-bounce" />
                            <span className="text-[11px] text-[#4F7CAC] font-bold block uppercase tracking-wider">Advocate AI is typing...</span>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-slate-200 rounded w-11/12 animate-pulse"></div>
                            <div className="h-3 bg-slate-200 rounded w-full animate-pulse"></div>
                            <div className="h-3 bg-slate-200 rounded w-4/5 animate-pulse"></div>
                          </div>
                        </motion.div>
                      ) : homeAiAnswer ? (
                        <motion.div
                          key="answer"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-5 bg-[#4F7CAC]/5 border border-[#4F7CAC]/15 rounded-2xl text-left space-y-3 shadow-inner"
                        >
                          <div className="flex justify-between items-center pb-2 border-b border-[#4F7CAC]/10">
                            <div className="flex items-center gap-2">
                              <Bot className="w-4 h-4 text-[#23395B]" />
                              <span className="text-[11px] text-[#23395B] font-bold block uppercase tracking-wider">SynapseAI Response</span>
                            </div>
                            <button 
                              onClick={() => { setHomeAiAnswer(null); setHomeCurrentQ(null); }}
                              className="text-xs text-[#64748B] hover:text-[#23395B] font-semibold transition-colors"
                            >
                              Clear response
                            </button>
                          </div>
                          {homeCurrentQ && (
                            <p className="text-xs font-bold text-[#23395B] bg-[#23395B]/5 px-3 py-1.5 rounded-lg w-fit">
                              Q: "{homeCurrentQ}"
                            </p>
                          )}
                          <p className="text-xs md:text-sm text-[#1E293B] leading-relaxed font-normal">
                            {homeAiAnswer}
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-5 border border-dashed border-[#E5E7EB] rounded-2xl text-center text-xs text-[#64748B] font-normal py-8"
                        >
                          Choose a suggested question below or type your own question in the input box to test our secure enterprise model.
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Suggested Chips */}
                    <div className="space-y-3 text-left pt-2">
                      <span className="text-xs text-[#64748B] font-semibold block uppercase tracking-wider">Suggested Questions:</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'What does SynapseAI do?',
                          'What internships are available?',
                          'How does Meeting Intelligence work?',
                          'Tell me about your AI Workspace.',
                          'What technologies do you use?'
                        ].map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => handleHomeAsk(q)}
                            className="text-xs bg-[#F7F8FA] hover:bg-[#4F7CAC]/10 hover:text-[#23395B] border border-[#E5E7EB] hover:border-[#4F7CAC]/30 text-[#1E293B] px-3.5 py-1.5 rounded-xl text-left font-medium transition-all cursor-pointer hover:-translate-y-0.5 shadow-sm"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Products Section */}
              <section className="bg-[#F7F8FA] py-16 border-y border-[#E5E7EB]">
                <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <span className="text-xs font-bold text-[#4F7CAC] uppercase">Product Suite</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#23395B] tracking-tight">Our Core Ecosystem</h2>
                    <p className="text-xs text-[#64748B]">Tailored modules that execute perfectly on their own and beautifully together.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
                    {[
                      { title: 'Synapse Core', desc: 'Secure web workspace and custom charts matching task burndowns with absolute fidelity.', badge: 'Standard UI' },
                      { title: 'Synapse Doc AI', desc: 'Secure document search engine supporting PDF, DOCX, and text file uploads.', badge: 'AI Search' },
                      { title: 'Synapse Meeting Intel', desc: 'Transcript summarizer, audio minutes parser, and one-click task extraction pipelines.', badge: 'Video/Audio' },
                      { title: 'Synapse Recommendations', desc: 'Mathematical workload-to-skill score matches. Prevents team burnouts.', badge: 'Roster AI' }
                    ].map((prod) => (
                      <div key={prod.title} className="p-5 bg-white border border-[#E5E7EB] rounded-2xl flex flex-col justify-between shadow-sm min-h-[200px]">
                        <div className="space-y-2">
                          <span className="text-[9px] bg-slate-100 border border-slate-200 text-[#64748B] px-2.5 py-0.5 rounded-full font-bold">
                            {prod.badge}
                          </span>
                          <h4 className="text-sm font-bold text-[#1E293B] pt-1">{prod.title}</h4>
                          <p className="text-[11.5px] text-[#64748B] leading-relaxed font-normal">{prod.desc}</p>
                        </div>
                        <button 
                          onClick={() => setActiveTab('public-ai')}
                          className="text-[10.5px] font-bold text-[#4F7CAC] hover:text-[#23395B] pt-3 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Ask AI about {prod.title}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Security Blueprint section */}
              <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E76F51]/10 border border-[#E76F51]/20 text-[10px] font-bold text-[#E76F51]">
                    <Lock className="w-3.5 h-3.5" />
                    <span>MILITARY GRADE DATA ISOLATION</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#23395B] tracking-tight">
                    Your Intelligence Remains Wholly Yours
                  </h2>
                  <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                    We never leak operational data to open-source models. Your documents, chat histories, and meeting briefings are stored in strictly isolated containers secured by active OAuth protocols and hardware MFA gates.
                  </p>

                  <div className="space-y-3.5">
                    {[
                      'SOC 2 Type II Compliance Framework',
                      'Strict local file indexing without cloud exposure',
                      'TLS 1.3 encryption on transit and AES-256 at rest',
                      'Regular independent corporate security pen-testing'
                    ].map((pt) => (
                      <div key={pt} className="flex items-center gap-2 text-xs text-[#1E293B] font-semibold">
                        <ShieldCheck className="w-4 h-4 text-[#3CB371] shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#23395B] p-6 md:p-8 rounded-3xl text-white space-y-6 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#3CB371]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Security Architecture Matrix</span>
                  </div>

                  <div className="space-y-4 text-xs font-mono text-left bg-slate-900/40 p-4.5 rounded-2xl border border-white/10">
                    <div>
                      <span className="text-gray-400 block">[SYSTEM LOG 00:46:18]</span>
                      <span className="text-[#3CB371]">✔ TLS Tunnel Handshake Complete (1.3 Strict)</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">[ENCRYPTION KEY ROTATION]</span>
                      <span className="text-[#3CB371]">✔ AES-256 Symmetric Nodes Refreshed</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">[AI DOCUMENT STORAGE]</span>
                      <span className="text-[#3CB371]">✔ Secured Document Index Active</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Trusted By Redesigned Premium Marquee Section */}
              <section className="max-w-7xl mx-auto px-4 md:px-8 my-20 md:my-28">
                {/* Elegant Title */}
                <div className="text-center space-y-2 mb-8">
                  <h3 className="text-base md:text-lg font-bold text-[#223B63] tracking-normal font-sans">
                    Trusted by Teams Building the Future
                  </h3>
                  <div className="w-12 h-0.5 bg-[#3E5BFF] mx-auto rounded-full" />
                </div>

                {/* Premium Glass Card */}
                <div 
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    borderColor: 'rgba(209, 220, 236, 0.9)'
                  }}
                  className="relative overflow-hidden rounded-[28px] border backdrop-blur-[16px] shadow-[0_20px_60px_rgba(32,62,110,0.08)] py-12 px-10 text-center transition-all duration-300 ease-out hover:shadow-[0_24px_70px_rgba(32,62,110,0.12)] hover:-translate-y-[2px]"
                >
                  {/* Marquee Container with Left & Right Fading Masks */}
                  <div 
                    style={{ background: 'radial-gradient(circle at center, rgba(74,128,255,0.06), transparent 70%), rgba(59,130,246,0.04)' }}
                    className="relative overflow-hidden w-full rounded-[18px] p-6 marquee-container"
                  >
                    {/* Fading Masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-r from-white/95 via-white/40 to-transparent pointer-events-none z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-l from-white/95 via-white/40 to-transparent pointer-events-none z-10" />

                    {/* Infinite Marquee Track */}
                    <div className="animate-marquee flex gap-8 md:gap-14 items-center">
                      {/* First set of logos */}
                      {[
                        { name: 'Acme Corp', icon: Box },
                        { name: 'Globex Systems', icon: Globe },
                        { name: 'Initech', icon: Layers },
                        { name: 'Umbrella Biotech', icon: Dna },
                        { name: 'Wayne Group', icon: Shield },
                        { name: 'NovaTech', icon: Zap },
                        { name: 'CloudNest', icon: Cloud },
                        { name: 'Future Labs', icon: Atom },
                        { name: 'Vertex AI', icon: Triangle },
                        { name: 'QuantumSoft', icon: Component },
                        { name: 'DataForge', icon: Server },
                        { name: 'Skyline Systems', icon: Building }
                      ].map((co, idx) => {
                        const IconComponent = co.icon;
                        return (
                          <div 
                            key={`co-1-${idx}`} 
                            className="group flex items-center gap-2 px-4.5 py-2.5 rounded-xl border border-transparent hover:border-[#DCE7F5] hover:bg-white/95 opacity-75 hover:opacity-100 hover:scale-[1.08] hover:-translate-y-[3px] hover:shadow-[0_0_20px_rgba(59,130,246,0.18)] transition-all duration-300 cursor-pointer select-none text-[#60748F] hover:text-[#223B63] shrink-0"
                          >
                            <IconComponent className="w-4 h-4 text-[#60748F] group-hover:text-[#3E5BFF] transition-colors duration-300" />
                            <span className="font-sans font-semibold text-xs tracking-tight">{co.name}</span>
                          </div>
                        );
                      })}

                      {/* Second set of duplicate logos for seamless looping */}
                      {[
                        { name: 'Acme Corp', icon: Box },
                        { name: 'Globex Systems', icon: Globe },
                        { name: 'Initech', icon: Layers },
                        { name: 'Umbrella Biotech', icon: Dna },
                        { name: 'Wayne Group', icon: Shield },
                        { name: 'NovaTech', icon: Zap },
                        { name: 'CloudNest', icon: Cloud },
                        { name: 'Future Labs', icon: Atom },
                        { name: 'Vertex AI', icon: Triangle },
                        { name: 'QuantumSoft', icon: Component },
                        { name: 'DataForge', icon: Server },
                        { name: 'Skyline Systems', icon: Building }
                      ].map((co, idx) => {
                        const IconComponent = co.icon;
                        return (
                          <div 
                            key={`co-2-${idx}`} 
                            className="group flex items-center gap-2 px-4.5 py-2.5 rounded-xl border border-transparent hover:border-[#DCE7F5] hover:bg-white/95 opacity-75 hover:opacity-100 hover:scale-[1.08] hover:-translate-y-[3px] hover:shadow-[0_0_20px_rgba(59,130,246,0.18)] transition-all duration-300 cursor-pointer select-none text-[#60748F] hover:text-[#223B63] shrink-0"
                          >
                            <IconComponent className="w-4 h-4 text-[#60748F] group-hover:text-[#3E5BFF] transition-colors duration-300" />
                            <span className="font-sans font-semibold text-xs tracking-tight">{co.name}</span>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>
              </section>

              {/* Bottom Call to Action banner */}
              <section className="max-w-6xl mx-auto px-4 md:px-8 my-20 md:my-28">
                <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#23395B] to-[#4F7CAC] text-white text-center relative overflow-hidden shadow-xl space-y-5">
                  <div className="absolute inset-0 bg-slate-950/5 pointer-events-none" />
                  <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Ready to Transform Your Workspace?</h2>
                    <p className="text-xs text-white/80 leading-relaxed font-normal max-w-xl mx-auto">
                      Join teams using SynapseAI to manage projects, documents, meetings, and AI-powered collaboration—all in one secure workspace.
                    </p>
                    <div className="flex justify-center gap-3 pt-3">
                      <button 
                        onClick={() => setIsLoginModalOpen(true)}
                        className="px-5 py-3 rounded-xl bg-white text-[#23395B] hover:bg-slate-100 text-xs font-bold cursor-pointer transition-all shadow-md"
                      >
                        Get Started
                      </button>
                      <button 
                        onClick={() => setActiveTab('contact')}
                        className="px-5 py-3 rounded-xl bg-transparent border border-white/20 hover:bg-white/10 text-white text-xs font-bold cursor-pointer transition-all"
                      >
                        Contact Sales
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              <section ref={faqRef} className="max-w-4xl mx-auto px-4 md:px-8 space-y-8 my-20 md:my-28">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-[#23395B] tracking-tight">Frequently Asked Questions</h2>
                  <p className="text-xs text-[#64748B]">Clear answers about our enterprise operations, models, and integration.</p>
                </div>

                <div className="space-y-3.5">
                  {[
                    { q: 'Is our corporate data used to train public AI models?', a: 'Absolutely not. SynapseAI operates fully isolated secure systems. No data, files, or meeting notes are ever used for model training.' },
                    { q: 'How does the AI Document Search process large PDF files?', a: 'Our system analyzes documents by breaking them into smaller sections. When you ask a question, the AI reads the relevant sections to give you precise, accurate answers with direct references.' },
                    { q: 'Can we integrate SynapseAI with our existing login systems?', a: 'Yes. SynapseAI fits directly with Okta, Google Workspace, and company sign-in systems, allowing you to easily manage user permissions.' },
                    { q: 'How does the meeting summary feature work?', a: 'Our system uses secure, advanced language models optimized for quickly summarizing transcripts and automatically identifying tasks.' }
                  ].map((faq, i) => (
                    <div 
                      key={i} 
                      className="border border-[#E5E7EB] rounded-2xl bg-white p-4.5 text-left cursor-pointer transition-all hover:bg-[#F7F8FA]"
                      onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    >
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-xs font-bold text-[#1E293B]">{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-[#64748B] shrink-0 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`} />
                      </div>
                      
                      <AnimatePresence>
                        {faqOpen === i && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="overflow-hidden text-[11.5px] text-[#64748B] leading-relaxed font-normal border-t border-[#E5E7EB]/50 pt-2"
                          >
                            {faq.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* FEATURES PAGE */}
          {activeTab === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-12"
            >
              <div className="text-left space-y-2">
                <span className="text-xs font-bold text-[#4F7CAC] uppercase">Platform Specifications</span>
                <h1 className="text-3xl font-bold text-[#23395B] tracking-tight">Enterprise AI Capabilities</h1>
                <p className="text-xs text-[#64748B] max-w-2xl">
                  An in-depth look at the visual, mathematical, and cryptographic systems supporting your team sandbox.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm space-y-3.5">
                  <div className="p-2.5 bg-[#4F7CAC]/10 rounded-xl text-[#4F7CAC] w-fit">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1E293B]">Secure AI Document Search</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                    When you upload documents, our system reads them securely. You can ask questions in the chat panel to get instant answers with direct page references.
                  </p>
                </div>

                <div className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm space-y-3.5">
                  <div className="p-2.5 bg-[#23395B]/10 rounded-xl text-[#23395B] w-fit">
                    <Video className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1E293B]">Automated Action Item Extraction</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                    Forget manual meeting note taking. Copy transcript audio audits into the meeting analyzer. It extracts executive insights, organizes tasks, and pre-allocates them to developers automatically based on workload metrics.
                  </p>
                </div>

                <div className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm space-y-3.5">
                  <div className="p-2.5 bg-[#3CB371]/10 rounded-xl text-[#3CB371] w-fit">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1E293B]">Smart Team Staffing</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                    Our planning assistant suggests the best team members for each project based on their skills and current workload, helping you balance tasks and prevent burnout.
                  </p>
                </div>

                <div className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm space-y-3.5">
                  <div className="p-2.5 bg-[#E76F51]/10 rounded-xl text-[#E76F51] w-fit">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1E293B]">Isolated Cryptographic Sandboxes</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                    All dialog transcripts and file uploads are secured behind hardware multi-factor gates, encrypted locally, and stored with strict compliance constraints, allowing auditors complete visibility without data leaks.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* PRODUCTS PAGE */}
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-12 text-left"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#4F7CAC] uppercase">Modular Architecture</span>
                <h1 className="text-3xl font-bold text-[#23395B] tracking-tight">Our Core Products</h1>
                <p className="text-xs text-[#64748B] max-w-xl">
                  Select and scale separate Synapse modules designed to harmonize perfectly under your secure SSO banner.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { title: 'Synapse Core', tag: 'Main Dashboard', desc: 'Your main workspace. View task boards, project timelines, task lists, and team workloads in a clean, simple layout.', features: ['Simple task boards and calendars', 'Unified activity feed', 'Clean real-time productivity charts'] },
                  { title: 'Synapse Document AI', tag: 'AI Document Search', desc: 'Upload documents, reports, or policies. Open a secure chat with your documents to ask questions and get instant answers with page numbers.', features: ['Easy and direct search', 'Isolated and secure document vault', 'Complete page references'] },
                  { title: 'Synapse Meeting Summaries', tag: 'Meeting Summarizer', desc: 'Upload meeting transcripts. Automatically summarizes who said what, lists key milestones, and creates tasks you can assign with one click.', features: ['Automatic summary of meetings', 'Direct task creation', 'Accurate transcript integration'] },
                  { title: 'Synapse Team Planner', tag: 'AI Team Planner', desc: 'Compares open tasks with team members\' skills and current schedules. Recommends the best team members for each job and helps balance workloads.', features: ['Team workload safety guards', 'Skills-to-task mapping', 'Easy approval workflows'] }
                ].map((p, idx) => (
                  <div key={p.title} className="p-6 md:p-8 bg-white border border-[#E5E7EB] rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center shadow-sm">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] bg-[#4F7CAC]/15 text-[#23395B] px-2.5 py-0.5 rounded-full font-bold">
                          {p.tag}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#23395B]">{p.title}</h3>
                      <p className="text-xs text-[#64748B] leading-relaxed font-normal">{p.desc}</p>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
                        {p.features.map(f => (
                          <span key={f} className="flex items-center gap-1.5 text-[11px] text-[#1E293B] font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#3CB371]" /> {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="lg:col-span-4 text-left lg:text-right">
                      <button 
                        onClick={() => setActiveTab('public-ai')}
                        className="px-5 py-2.5 bg-[#23395B] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                      >
                        Ask AI about {p.title}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SOLUTIONS PAGE */}
          {activeTab === 'solutions' && (
            <motion.div
              key="solutions"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-12 text-left"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#4F7CAC] uppercase">Configured for High Performance</span>
                <h1 className="text-3xl font-bold text-[#23395B] tracking-tight">Tailored Solutions</h1>
                <p className="text-xs text-[#64748B] max-w-xl">
                  Discover how SynapseAI aligns perfectly with specific departments, roles, and enterprise security needs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'For Engineering Leaders', desc: 'Keep projects on schedule. Assign tasks based on team members\' skills, and prevent burnout by checking real-time workload charts.', icon: Cpu },
                  { title: 'For Operations & HR Managers', desc: 'Manage team planning easily. Find and onboard interns, set up simple team roles, and use AI recommendations to plan projects smoothly.', icon: Users },
                  { title: 'For Compliance & Audit Teams', desc: 'Review conversation logs, secure document searches, and transcript histories. Enforce secure logins and industry safety guidelines.', icon: ShieldCheck }
                ].map((sol) => {
                  const Icon = sol.icon;
                  return (
                    <div key={sol.title} className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm space-y-4 hover:border-[#4F7CAC]/40 hover:shadow-md transition-all">
                      <div className="p-3 bg-[#4F7CAC]/10 rounded-xl text-[#4F7CAC] w-fit">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-[#1E293B]">{sol.title}</h3>
                      <p className="text-xs text-[#64748B] leading-relaxed font-normal">{sol.desc}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ABOUT PAGE */}
          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-12 text-left"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#4F7CAC] uppercase">Our Principles</span>
                <h1 className="text-3xl font-bold text-[#23395B] tracking-tight">Mission, Vision & Core Values</h1>
                <p className="text-xs text-[#64748B] max-w-xl">
                  Learn about our dedication to responsible AI workspaces, customer confidentiality, and technical craft.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-[#23395B] uppercase tracking-wider">Our Mission</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                    To deliver secure, easy-to-use, and beautifully designed AI workspaces that help teams collaborate better while keeping full control of their own data.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-[#23395B] uppercase tracking-wider">Our Vision</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                    To become the trusted global standard for secure team planning, allowing companies to use advanced AI tools easily without sharing private information with public servers.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-[#F7F8FA] border border-[#E5E7EB] rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-[#23395B] uppercase">Responsible AI & Ethics Charter</h3>
                <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                  SynapseAI stands for safety, ethics, and transparency. We design our AI systems to be clear and understandable, secure all uploaded files, and provide visible reasoning behind every AI recommendation.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs font-semibold text-[#23395B]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3CB371]" /> Integrity First
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3CB371]" /> Strict Containment
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#3CB371]" /> Active Accountability
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CAREERS PAGE */}
          {activeTab === 'careers' && (
            <motion.div
              key="careers"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-12 text-left"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#4F7CAC] uppercase">Build the Future of Enterprise AI</span>
                <h1 className="text-3xl font-bold text-[#23395B] tracking-tight">Open Opportunities</h1>
                <p className="text-xs text-[#64748B] max-w-xl">
                  Discover internships, graduate initiatives, and senior engineering roles with unmatched corporate benefits and high ownership.
                </p>
              </div>

              {/* Benefits Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-[#4F7CAC]/5 border border-[#4F7CAC]/15 rounded-2xl">
                <div>
                  <span className="text-xs font-bold text-[#23395B] block">Premium Global Care</span>
                  <span className="text-[11px] text-[#64748B] block mt-1 font-normal">Comprehensive health benefits, dental, vision, and mental wellness models.</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#23395B] block">Absolute Flexibility</span>
                  <span className="text-[11px] text-[#64748B] block mt-1 font-normal">Remote-first configurations, quarterly division retreats, and physical hub credits.</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#23395B] block">Craft & Growth Credits</span>
                  <span className="text-[11px] text-[#64748B] block mt-1 font-normal">Annual books, hardware setups, and learning budgets to foster technical excellence.</span>
                </div>
              </div>

              {/* Job listings */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Active Role Openings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <div key={job.id} className="p-6 bg-white border border-[#E5E7EB] rounded-2xl flex flex-col justify-between shadow-sm hover:border-[#4F7CAC]/30 transition-all min-h-[220px]">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-3">
                          <h4 className="text-sm font-bold text-[#1E293B]">{job.title}</h4>
                          <span className="text-[9.5px] bg-[#23395B]/10 text-[#23395B] px-2.5 py-0.5 rounded-full font-bold">
                            {job.type}
                          </span>
                        </div>
                        <span className="text-[10.5px] text-[#64748B] font-semibold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {job.location} • {job.dept}
                        </span>
                        <p className="text-xs text-[#64748B] leading-relaxed font-normal">{job.desc}</p>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-[#E5E7EB]/60 mt-4">
                        <span className="text-xs font-mono font-bold text-[#23395B]">{job.salary}</span>
                        <button 
                          onClick={() => setSelectedJob(job)}
                          className="px-4 py-1.5 bg-[#23395B] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* PUBLIC AI ASSISTANT VIEW */}
          {activeTab === 'public-ai' && (
            <motion.div
              key="public-ai"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
            >
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#4F7CAC]/10 flex items-center justify-center text-[#4F7CAC]">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold text-[#23395B] uppercase tracking-wider">Public Advocate</span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-[#23395B] tracking-tight">Public AI Portal</h1>
                <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                  Inquire about SynapseAI\'s features, technologies, compliance structures, remote culture, and active job opportunities.
                </p>

                {/* Predefined prompt chips */}
                <div className="space-y-2 pt-2">
                  <span className="text-[9px] text-[#64748B] uppercase font-bold tracking-wider block">Recommended Queries:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {mockPredefinedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleAskPublicAi(q)}
                        className="text-[10px] bg-white border border-[#E5E7EB] hover:border-[#4F7CAC]/40 hover:bg-[#F7F8FA] text-[#1E293B] px-2.5 py-1 rounded-xl text-left font-medium transition-all cursor-pointer block"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat thread */}
              <div className="lg:col-span-8 flex flex-col h-[520px] border border-[#E5E7EB] bg-white rounded-3xl p-5 shadow-sm justify-between">
                
                {/* Scrollable container */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 text-xs">
                  {aiHistory.map((h, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-end">
                        <span className="bg-[#23395B] text-white px-3.5 py-2 rounded-2xl max-w-[85%] text-left font-medium inline-block leading-relaxed shadow-sm">
                          {h.q}
                        </span>
                      </div>
                      <div className="flex gap-2.5">
                        <div className="w-6.5 h-6.5 rounded bg-[#4F7CAC]/10 flex items-center justify-center text-[#4F7CAC] shrink-0 mt-0.5">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-[#F7F8FA] border border-[#E5E7EB] text-[#1E293B] px-3.5 py-2 rounded-2xl max-w-[85%] text-left inline-block leading-relaxed shadow-xs font-normal">
                          {h.a}
                        </div>
                      </div>
                    </div>
                  ))}

                  {aiLoading && (
                    <div className="flex gap-2.5">
                      <div className="w-6.5 h-6.5 rounded bg-[#4F7CAC]/10 flex items-center justify-center text-[#4F7CAC] shrink-0 mt-0.5 animate-bounce">
                        <Bot className="w-4 h-4" />
                      </div>
                      <span className="bg-[#F7F8FA] text-[#64748B] px-3 py-1.5 rounded-xl text-[10.5px] inline-flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 bg-[#4F7CAC] rounded-full animate-pulse" />
                        <span>Searching enterprise indexes...</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Input form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAskPublicAi(aiQuestion);
                  }}
                  className="flex gap-2 pt-3 border-t border-[#E5E7EB]"
                >
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="Ask SynapseAI (e.g., How does Document AI work?)"
                    className="flex-1 bg-white border border-[#E5E7EB] text-xs rounded-xl px-3 py-2 text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 transition-all placeholder-[#64748B]/50 font-normal"
                  />
                  
                  <button
                    type="submit"
                    disabled={aiLoading || !aiQuestion.trim()}
                    className="p-2 bg-[#23395B] hover:bg-[#1E293B] text-white rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>
            </motion.div>
          )}

          {/* CONTACT PAGE */}
          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 text-left"
            >
              <div className="md:col-span-5 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#4F7CAC] uppercase">Enterprise Trial</span>
                  <h1 className="text-2xl md:text-3xl font-bold text-[#23395B] tracking-tight font-sans">Contact Sales</h1>
                  <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                    Ready to scale a sandboxed workspace for your product engineering or compliance team?
                  </p>
                </div>

                <div className="space-y-4 text-xs font-semibold text-[#1E293B]">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4.5 h-4.5 text-[#4F7CAC]" />
                    <span>sales@synapse.ai</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Building className="w-4.5 h-4.5 text-[#4F7CAC]" />
                    <span>San Francisco HQ • Zurich R&D Hub</span>
                  </div>
                </div>
              </div>

              {/* Form container */}
              <div className="md:col-span-7 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm">
                {contactSubmitted ? (
                  <div className="py-12 text-center space-y-3.5">
                    <CheckCircle2 className="w-10 h-10 text-[#3CB371] mx-auto animate-bounce" />
                    <h3 className="text-sm font-bold text-[#1E293B]">Message Logged Safely</h3>
                    <p className="text-xs text-[#64748B] max-w-sm mx-auto font-normal">
                      Thank you! An Enterprise Advocate will review your details and reach out within 2 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-xs text-left">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[#1E293B] font-semibold">Your Name</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[#1E293B] font-semibold">Corporate Email</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[#1E293B] font-semibold">Company Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.company}
                        onChange={(e) => setContactForm(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[#1E293B] font-semibold">Brief Operational Requirements</label>
                      <textarea
                        rows={3}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 transition-all resize-none font-normal"
                        placeholder="e.g. Ingesting internal technical spec sheets with isolated FAISS RAG..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#23395B] hover:bg-[#1E293B] text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer text-center"
                    >
                      Send Ingress Request
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#23395B] text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-left">
          
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-md">
                <Logo size={24} strokeColor="#3E5BFF" />
              </div>
              <span className="font-sans font-bold text-white text-sm tracking-tight">SynapseAI</span>
            </div>
            <p className="text-slate-400 font-normal leading-relaxed">
              Unified Enterprise AI Workspace sandboxing your operational intelligence with high fidelity, zero-leak configurations, and SOC 2 Type II assurance models.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-200 uppercase tracking-wider block">Products</span>
            <button onClick={() => { setActiveTab('products'); }} className="text-slate-400 hover:text-white block font-medium">Synapse Core</button>
            <button onClick={() => { setActiveTab('products'); }} className="text-slate-400 hover:text-white block font-medium">Synapse Document AI</button>
            <button onClick={() => { setActiveTab('products'); }} className="text-slate-400 hover:text-white block font-medium">Meeting Intelligence</button>
            <button onClick={() => { setActiveTab('products'); }} className="text-slate-400 hover:text-white block font-medium">Roster Analytics</button>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-200 uppercase tracking-wider block">Company</span>
            <button onClick={() => setActiveTab('about')} className="text-slate-400 hover:text-white block font-medium">About Mission</button>
            <button onClick={() => setActiveTab('about')} className="text-slate-400 hover:text-white block font-medium">Ethics Charter</button>
            <button onClick={() => setActiveTab('careers')} className="text-slate-400 hover:text-white block font-medium">Careers</button>
            <button onClick={() => setActiveTab('contact')} className="text-slate-400 hover:text-white block font-medium">Contact Hub</button>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-200 uppercase tracking-wider block">Security Credentials</span>
            <div className="flex items-center gap-1 text-slate-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#3CB371]" /> SOC 2 Type II
            </div>
            <div className="flex items-center gap-1 text-slate-400 font-semibold">
              <Lock className="w-4 h-4 text-[#3CB371]" /> TLS 1.3 Strict Enforced
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              Cluster: active_us_east_42<br />
              Secure Ingress Proxy Active
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4.5 border-t border-slate-800 text-center text-slate-500 text-[10.5px]">
          © {new Date().getFullYear()} SynapseAI, Inc. All Rights Reserved. Fully sandboxed mock environment.
        </div>
      </footer>

      {/* JOB APPLICATION MODAL */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
            />

            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-lg bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-2xl z-10 text-left"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E7EB] mb-4">
                <div>
                  <span className="text-[10px] text-[#4F7CAC] font-bold block uppercase tracking-wider">APPLY FOR POSITION</span>
                  <span className="text-sm font-bold text-[#1E293B]">{selectedJob.title}</span>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="p-1.5 hover:bg-[#F7F8FA] rounded-lg text-[#64748B] hover:text-[#1E293B] transition-all cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[#1E293B] font-semibold">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={applyForm.name}
                      onChange={(e) => setApplyForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 transition-all"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#1E293B] font-semibold">Email Endpoint</label>
                    <input
                      type="email"
                      required
                      value={applyForm.email}
                      onChange={(e) => setApplyForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 transition-all"
                      placeholder="jane.doe@example.com"
                    />
                  </div>
                </div>

                {/* Resume Upload Box */}
                <div className="space-y-1.5">
                  <label className="text-[#1E293B] font-semibold">Upload PDF Resume</label>
                  
                  <div
                    onDragOver={(e) => { e.preventDefault(); setResumeDragging(true); }}
                    onDragLeave={() => setResumeDragging(false)}
                    onDrop={handleResumeDrop}
                    onClick={() => alert('Launching local native file select sandbox...')}
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[100px] relative ${
                      resumeDragging 
                        ? 'border-[#4F7CAC] bg-[#4F7CAC]/5' 
                        : 'border-[#E5E7EB] bg-slate-50 hover:bg-[#F7F8FA] hover:border-[#4F7CAC]'
                    }`}
                  >
                    <UploadCloud className="w-6 h-6 text-[#64748B] mb-1.5" />
                    {applyForm.resumeName ? (
                      <span className="text-xs font-bold text-[#3CB371]">{applyForm.resumeName} (Buffered)</span>
                    ) : (
                      <>
                        <span className="text-[11px] font-bold text-[#1E293B]">Drag & drop resume PDF or click to browse</span>
                        <span className="text-[9.5px] text-[#64748B] mt-0.5">Max file size: 10MB</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#1E293B] font-semibold">Cover Note or Tenure Biography</label>
                  <textarea
                    rows={3}
                    value={applyForm.coverLetter}
                    onChange={(e) => setApplyForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 transition-all resize-none font-normal"
                    placeholder="Describe your background and passion for secure systems..."
                  />
                </div>

                <div className="pt-4 border-t border-[#E5E7EB] flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#1E293B] hover:bg-[#F7F8FA] font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-4 py-2 rounded-xl bg-[#23395B] hover:bg-[#1E293B] text-white font-bold cursor-pointer transition-all shadow-sm"
                  >
                    {isApplying ? 'Uploading Application...' : 'Submit Application'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
            />

            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-sm z-10 flex flex-col items-center"
            >
              {/* Brand Logo above login card */}
              <div className="flex flex-col items-center mb-5 text-center select-none bg-slate-900/40 p-4.5 rounded-2xl border border-white/5 backdrop-blur-md w-full">
                <Logo size={52} strokeColor="#3E5BFF" className="mb-2" />
                <h2 className="text-lg font-bold text-white tracking-tight">SynapseAI</h2>
                <p className="text-[9.5px] text-indigo-300 font-bold tracking-widest uppercase">Enterprise AI Workspace</p>
              </div>

              {/* Login Card */}
              <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-2xl text-left relative">
                <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E7EB] mb-4">
                  <div className="flex flex-col text-left">
                    <h3 className="text-base font-bold text-[#1E293B]">Welcome Back</h3>
                    <p className="text-[11px] text-[#64748B] font-medium">Sign in to continue</p>
                  </div>
                  <button 
                    onClick={() => setIsLoginModalOpen(false)}
                    className="p-1.5 hover:bg-[#F7F8FA] rounded-lg text-[#64748B] hover:text-[#1E293B] transition-colors cursor-pointer self-start"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleDemoLogin();
                  }}
                  className="space-y-4 text-xs"
                >
                  <div className="space-y-1.5">
                    <label className="text-[#1E293B] font-semibold">Email Address</label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] transition-all font-medium"
                      placeholder="name@company.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[#1E293B] font-semibold">Password</label>
                      <button 
                        type="button"
                        onClick={() => alert('Password reset links can be requested from your organization IT administrator.')}
                        className="text-[10px] font-bold text-[#4F7CAC] hover:text-[#23395B] cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-xs text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] transition-all font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-2.5 py-1">
                    <ToggleSwitch 
                      checked={rememberMe}
                      onChange={setRememberMe}
                      id="remember_me"
                    />
                    <label htmlFor="remember_me" className="text-[11px] text-[#64748B] font-bold select-none cursor-pointer">
                      Remember Me
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#23395B] hover:bg-[#1E293B] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-slate-900/10 cursor-pointer text-center"
                  >
                    Sign In
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
