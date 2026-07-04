import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UploadCloud, 
  Search, 
  FileText, 
  Trash2, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  RefreshCw,
  Sparkle,
  BookOpen,
  CornerDownLeft
} from 'lucide-react';
import { Document } from '../types';
import Button from './Button';

interface DocumentsViewProps {
  documents: Document[];
  onUpload: (name: string, size: number, category: string) => void;
  onDelete: (id: string) => void;
  onAskRag: (docId: string, question: string) => Promise<{ answer: string; references: string[] }>;
}

const SUGGESTIONS = [
  "Summarize this PDF",
  "Explain this section",
  "Extract action items",
  "Find deadlines",
  "Generate meeting notes"
];

const ZOOM_LEVELS = [75, 90, 100, 110, 125, 150];

export default function DocumentsView({ 
  documents, 
  onUpload, 
  onDelete,
  onAskRag
}: DocumentsViewProps) {
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(documents[0] || null);
  const [isDragging, setIsDragging] = useState(false);
  
  // RAG Chat States
  const [ragQuestion, setRagQuestion] = useState('');
  const [ragHistory, setRagHistory] = useState<Array<{ q: string; a: string; ref: string[] }>>([]);
  const [ragLoading, setRagLoading] = useState(false);
  const [categoryInput, setCategoryInput] = useState('Technical Specs');
  
  // Custom states for collapsible & resizable AI Assistant
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAiPanelCollapsed, setIsAiPanelCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Remember width using sessionStorage to persist across navigations
  const [aiPanelWidth, setAiPanelWidth] = useState(() => {
    const stored = sessionStorage.getItem('ai_panel_width');
    return stored ? parseInt(stored, 10) : 360;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const mobileChatBottomRef = useRef<HTMLDivElement>(null);
  const docScrollContainerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Filtered list of documents
  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase()) || 
    doc.category.toLowerCase().includes(search.toLowerCase()) ||
    doc.aiSummary.toLowerCase().includes(search.toLowerCase())
  );

  // Sync scroll on chat history additions
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    mobileChatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ragHistory.length, ragLoading]);

  // Clean chat states when target document changes
  useEffect(() => {
    setRagHistory([]);
    setRagQuestion('');
    setIsMobileDrawerOpen(false);
    setCurrentPage(1);
  }, [selectedDoc?.id]);

  // Handle Drag and Drop for Upload
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onUpload(file.name, file.size, categoryInput);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUpload(file.name, file.size, categoryInput);
    }
  };

  // Submit Q&A search query
  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragQuestion.trim() || !selectedDoc) return;

    const q = ragQuestion;
    setRagQuestion('');
    setRagLoading(true);
    setIsAiPanelCollapsed(false);

    try {
      const res = await onAskRag(selectedDoc.id, q);
      setRagHistory(prev => [...prev, { q, a: res.answer, ref: res.references }]);
    } catch (err) {
      alert('Unable to process the document search. Please try again.');
    } finally {
      setRagLoading(false);
    }
  };

  // Handle suggestion chips
  const handleSuggestionClick = async (prompt: string) => {
    if (!selectedDoc || ragLoading) return;
    setRagLoading(true);
    setIsAiPanelCollapsed(false);

    try {
      const res = await onAskRag(selectedDoc.id, prompt);
      setRagHistory(prev => [...prev, { q: prompt, a: res.answer, ref: res.references }]);
    } catch (err) {
      alert('Unable to process the document search. Please try again.');
    } finally {
      setRagLoading(false);
    }
  };

  // Zoom control handlers
  const handleZoomOut = () => {
    const idx = ZOOM_LEVELS.indexOf(zoom);
    if (idx > 0) {
      setZoom(ZOOM_LEVELS[idx - 1]);
    }
  };

  const handleZoomIn = () => {
    const idx = ZOOM_LEVELS.indexOf(zoom);
    if (idx < ZOOM_LEVELS.length - 1) {
      setZoom(ZOOM_LEVELS[idx + 1]);
    }
  };

  // Drag-to-resize right panel left-edge mouse handler
  const handleWidthResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = aiPanelWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = startX - moveEvent.clientX; // dragging left increases width
      const newWidth = Math.max(300, Math.min(500, startWidth + deltaX));
      setAiPanelWidth(newWidth);
      sessionStorage.setItem('ai_panel_width', String(newWidth));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Document scroll tracking to update page indicator
  const handleDocScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    
    let activePage = 1;
    let minDiff = Infinity;
    
    pageRefs.current.forEach((el, idx) => {
      if (el) {
        const offsetTop = el.offsetTop - container.offsetTop;
        const diff = Math.abs(offsetTop - scrollTop);
        if (diff < minDiff) {
          minDiff = diff;
          activePage = idx + 1;
        }
      }
    });
    
    setCurrentPage(activePage);
  };

  // Scroll to a specific page
  const scrollToPage = (pageNum: number) => {
    if (pageNum < 1 || pageNum > 3) return;
    const ref = pageRefs.current[pageNum - 1];
    if (ref && docScrollContainerRef.current) {
      docScrollContainerRef.current.scrollTo({
        top: ref.offsetTop - docScrollContainerRef.current.offsetTop,
        behavior: 'smooth'
      });
      setCurrentPage(pageNum);
    }
  };

  // Sliced document sections simulating pages
  const docPages = selectedDoc ? [
    {
      pageNum: 1,
      title: "1. Executive Summary & Overview",
      content: selectedDoc.aiSummary || "This official business report outlines the active deliverables, department guidelines, and strategic directions."
    },
    {
      pageNum: 2,
      title: "2. Strategic Objective & Alignment Matrix",
      content: `The primary framework in this strategic analysis outlines major roadmap milestones and team capacity indices. Formulated specifically to optimize workflow loops and eliminate structural latency across organizational boundaries, this documentation serves as a blueprint for technical alignment.

Our core methodology focuses on minimizing operational overhead and ensuring that cross-functional workflows remain fluid, transparent, and resilient under varying production profiles. Milestones are synchronised on a bi-weekly cycle to enforce clean integration bounds.`
    },
    {
      pageNum: 3,
      title: "3. Technical Requirements & Quality Guidelines",
      content: `All services and database interactions defined in this project must adhere strictly to standard deployment and scaling configurations. Testing coverages are evaluated continuously, and container profiles must prioritize secure sandboxing models.

Key Objectives:
• Complete design audits and containerized security scans on day zero.
• Refine staging deployment pipelines prior to standard sync locks.
• Monitor real-time memory allocations and telemetry thresholds under standard stress profiles.`
    }
  ] : [];

  // Zoom-based typography and layout scaling helper
  const getZoomStyles = () => {
    switch (zoom) {
      case 75: return { fontSize: '0.8rem', maxWidth: '600px', padding: '1.5rem' };
      case 90: return { fontSize: '0.9rem', maxWidth: '660px', padding: '2rem' };
      case 100: return { fontSize: '1rem', maxWidth: '720px', padding: '2.5rem' };
      case 110: return { fontSize: '1.08rem', maxWidth: '780px', padding: '3rem' };
      case 125: return { fontSize: '1.18rem', maxWidth: '840px', padding: '3.5rem' };
      case 150: return { fontSize: '1.3rem', maxWidth: '940px', padding: '4rem' };
      default: return { fontSize: '1rem', maxWidth: '720px', padding: '2.5rem' };
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto select-none pb-8 font-sans text-left">
      {/* Hidden file selector trigger */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden" 
        accept=".pdf,.doc,.docx,.txt"
      />

      {/* Top Breadcrumb toolbar */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
        <div className="flex items-center gap-1.5">
          <span>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className={selectedDoc ? "text-slate-400" : "text-slate-600 font-bold"}>Document Library</span>
          {selectedDoc && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-600 font-bold">{selectedDoc.name}</span>
            </>
          )}
        </div>
        
        {selectedDoc && (
          <button 
            onClick={() => setSelectedDoc(null)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            ← Back to Library List
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!selectedDoc ? (
          /* ====================================================================
             LIBRARY GRID: Main list of files with upload dropzone
             ==================================================================== */
          <motion.div
            key="library-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left 2 Columns: Table & Drag & Drop */}
            <div className="lg:col-span-2 space-y-5">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="text-left">
                  <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Document Library</h2>
                  <p className="text-xs text-slate-500 font-medium">Upload, organize, and query your secure enterprise docs using SynapseAI.</p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Upload Category:</span>
                  <select 
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none transition-all font-semibold"
                  >
                    <option>Technical Specs</option>
                    <option>Strategic</option>
                    <option>HR & Operations</option>
                    <option>Compliance Docs</option>
                  </select>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden group ${
                  isDragging 
                    ? 'border-indigo-500 bg-indigo-50/30' 
                    : 'border-slate-300 bg-white hover:border-indigo-500/40 hover:bg-slate-50/50 shadow-xs'
                }`}
              >
                <UploadCloud className={`w-8 h-8 mb-2 group-hover:scale-105 transition-transform ${
                  isDragging ? 'text-indigo-600 animate-bounce' : 'text-slate-400 group-hover:text-indigo-600'
                }`} />
                <span className="text-xs font-bold text-slate-700">Drag and drop files to upload or click to browse</span>
                <span className="text-[10px] text-slate-400 mt-1 font-semibold">Supported formats: PDF, TXT, DOCX (Max 15MB)</span>
              </div>

              {/* Table section */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full max-w-xs transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input 
                      type="text" 
                      placeholder="Search documents..." 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full font-semibold"
                    />
                  </div>
                  
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">
                    Total Storage: {documents.length > 0 ? (documents.length * 2.4).toFixed(1) : 0} MB
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                        <th className="py-3 font-semibold">Document Name</th>
                        <th className="py-3 font-semibold">Category</th>
                        <th className="py-3 font-semibold">Size</th>
                        <th className="py-3 font-semibold">Uploaded</th>
                        <th className="py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDocs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400 font-semibold">
                            No matching documents found
                          </td>
                        </tr>
                      ) : (
                        filteredDocs.map((doc) => (
                          <tr 
                            key={doc.id}
                            onClick={() => setSelectedDoc(doc)}
                            className="hover:bg-slate-50/50 transition-colors cursor-pointer text-slate-700"
                          >
                            <td className="py-3.5 font-semibold flex items-center gap-2 pr-4 max-w-xs">
                              <FileText className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-indigo-600" />
                              <span className="truncate font-bold" title={doc.name}>{doc.name}</span>
                            </td>
                            <td className="py-3">
                              <span className="text-[10px] px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 font-bold">
                                {doc.category}
                              </span>
                            </td>
                            <td className="py-3 text-slate-500 font-semibold font-mono">{doc.size}</td>
                            <td className="py-3 text-slate-500 font-semibold font-mono">{doc.uploadDate}</td>
                            <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete "${doc.name}"?`)) {
                                    onDelete(doc.id);
                                  }
                                }}
                                className="p-1 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-400 transition-all cursor-pointer inline-flex items-center border border-transparent hover:border-rose-100"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Library Sidebar Guide */}
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Sparkle className="w-5 h-5 text-indigo-500 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-widest">AI Document Assistant</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  Select any document in the list to trigger the immersive <strong className="text-indigo-600">Reader Mode</strong>. Once in Reader Mode, you can:
                </p>
                <div className="space-y-2.5 text-xs text-slate-500 font-semibold">
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-500">📖</span>
                    <span>Read your document side-by-side with a conversational chat panel.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-500">🤖</span>
                    <span>Ask document-specific questions and retrieve precise AI summaries.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-500">📏</span>
                    <span>Resize and collapse the bottom chat workspace on desktop to fit your reading preferences.</span>
                  </div>
                </div>
                
                {documents.length > 0 && (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="w-full font-bold h-9 mt-2"
                    onClick={() => setSelectedDoc(documents[0])}
                  >
                    Open Reader Mode
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ====================================================================
             IMMERSIVE READER WORKSPACE: Collapsible left list, main viewer, bottom chat
             ==================================================================== */
          <motion.div
            key="reader-workspace"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={`h-[calc(100vh-140px)] flex bg-white border border-slate-200 rounded-2xl overflow-hidden relative shadow-sm ${
              isFullscreen ? 'fixed inset-0 h-screen w-screen z-50 rounded-none border-none' : ''
            }`}
          >
            {/* 1. Collapsible Left Sidebar: Document Switcher */}
            <AnimatePresence initial={false}>
              {isSidebarOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="border-r border-slate-200 h-full flex flex-col bg-slate-50/50 shrink-0 overflow-hidden text-left"
                >
                  {/* Sidebar Header */}
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Document Library</span>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-extrabold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      + Upload
                    </button>
                  </div>

                  {/* Sidebar Search */}
                  <div className="p-3 border-b border-slate-200 bg-white shrink-0">
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 transition-all">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Filter list..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full font-semibold"
                      />
                    </div>
                  </div>

                  {/* Scrollable File List */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredDocs.map((doc) => {
                      const isSelected = selectedDoc.id === doc.id;
                      return (
                        <button
                          key={doc.id}
                          onClick={() => setSelectedDoc(doc)}
                          className={`w-full flex items-start gap-2.5 p-3 rounded-xl transition-all cursor-pointer text-left ${
                            isSelected 
                              ? 'bg-white border border-indigo-100/80 shadow-xs' 
                              : 'hover:bg-slate-100/50 border border-transparent'
                          }`}
                        >
                          <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <div className="min-w-0 flex-1">
                            <span className={`block text-xs truncate leading-tight font-bold ${isSelected ? 'text-slate-800' : 'text-slate-600'}`}>
                              {doc.name}
                            </span>
                            <span className="block text-[9px] text-slate-400 font-mono mt-1">
                              {doc.category} • {doc.size}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                    {filteredDocs.length === 0 && (
                      <span className="text-[11px] text-slate-400 block text-center py-6 font-semibold">No other files</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2. Main Split-Screen Work Area */}
            <div className="flex-1 h-full flex flex-row overflow-hidden relative">
              
              {/* ====================================================================
                 LEFT SIDE: Document Viewer (visually dominates, taking up 70% space)
                 ==================================================================== */}
              <div className="flex-1 h-full flex flex-col overflow-hidden bg-slate-100/40 relative">
                
                {/* 2.A Sticky Viewer Toolbar */}
                <div className="h-14 border-b border-slate-200 px-4 flex items-center justify-between bg-white shrink-0 z-10 shadow-3xs">
                  {/* Left Side: Navigation / Document Switcher triggers */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => {
                        setIsFullscreen(false);
                        setSelectedDoc(null);
                      }}
                      className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1 border border-slate-200"
                      title="Back to library list"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Close</span>
                    </button>
                    
                    <button
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1 border border-slate-200"
                      title={isSidebarOpen ? "Collapse File Switcher" : "Expand File Switcher"}
                    >
                      {isSidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{isSidebarOpen ? "Hide List" : "Show List"}</span>
                    </button>

                    <div className="h-4 w-px bg-slate-200 hidden sm:block" />

                    {/* Page Navigator */}
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => scrollToPage(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="p-1 hover:bg-slate-50 border border-slate-200 rounded-md text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
                        title="Previous Page"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] font-bold text-slate-600 px-1.5 min-w-[70px] text-center bg-slate-50 border border-slate-200 py-0.5 rounded-md">
                        {currentPage} / {docPages.length}
                      </span>
                      <button 
                        onClick={() => scrollToPage(currentPage + 1)}
                        disabled={currentPage >= docPages.length}
                        className="p-1 hover:bg-slate-50 border border-slate-200 rounded-md text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
                        title="Next Page"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Middle Area: Zoom Controls */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-0.5 rounded-lg">
                    <button
                      onClick={handleZoomOut}
                      disabled={zoom <= ZOOM_LEVELS[0]}
                      className="p-1 hover:bg-white rounded-md text-slate-500 disabled:opacity-40 transition-colors cursor-pointer"
                      title="Zoom Out"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-bold text-slate-600 min-w-[42px] text-center select-none font-mono">
                      {zoom}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
                      className="p-1 hover:bg-white rounded-md text-slate-500 disabled:opacity-40 transition-colors cursor-pointer"
                      title="Zoom In"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Right Area: Document details & Fullscreen toggler */}
                  <div className="flex items-center gap-2">
                    <span className="hidden lg:inline-block text-[10px] bg-slate-100 border border-slate-200 text-slate-600 font-bold px-2.5 py-1 rounded-md max-w-[150px] truncate uppercase tracking-wider">
                      {selectedDoc.category}
                    </span>
                    
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer border border-slate-200"
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Reader"}
                    >
                      {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* 2.B Independent Scrolling Document Container */}
                <div 
                  ref={docScrollContainerRef}
                  onScroll={handleDocScroll}
                  className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth scrollbar-thin space-y-6"
                >
                  <div className="max-w-3xl mx-auto space-y-8 pb-16">
                    {docPages.map((page, idx) => (
                      <div
                        key={page.pageNum}
                        ref={el => { pageRefs.current[idx] = el; }}
                        style={getZoomStyles()}
                        className="w-full bg-white border border-slate-200/80 shadow-md rounded-[20px] transition-all duration-200 mx-auto min-h-[500px] flex flex-col justify-between"
                      >
                        {/* Page Header Watermark */}
                        <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider border-b border-slate-100 pb-3 mb-6 select-none">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3 h-3 text-indigo-500" />
                            {selectedDoc.name}
                          </span>
                          <span>Page {page.pageNum} of {docPages.length}</span>
                        </div>

                        {/* Page Content */}
                        <div className="flex-1 flex flex-col justify-start">
                          {page.pageNum === 1 && (
                            <div className="mb-6">
                              <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" /> 
                                SynapseAI Verified summary
                              </span>
                              <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight leading-tight mt-2.5 mb-1">
                                {selectedDoc.name}
                              </h1>
                              <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wide">
                                SIZE: {selectedDoc.size} • DATE: {selectedDoc.uploadDate}
                              </p>
                            </div>
                          )}

                          <h2 className="text-xs md:text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider border-l-2 border-indigo-500 pl-2">
                            {page.title}
                          </h2>
                          
                          <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line text-left">
                            {page.content}
                          </p>
                        </div>

                        {/* Page Footer Watermark */}
                        <div className="border-t border-slate-100 mt-8 pt-3 flex justify-between items-center text-[9px] text-slate-400 font-mono font-bold uppercase select-none">
                          <span>CONFIDENTIAL • SYNAPSE WORKSPACE</span>
                          <span>PAGE {page.pageNum}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* ====================================================================
                 RIGHT SIDE: Professional Companion AI Panel (Collapsible & Resizable)
                 ==================================================================== */}
              <div className="hidden md:flex shrink-0 h-full relative z-20">
                
                {/* Visual Resizable Drag Border Handle */}
                {!isAiPanelCollapsed && (
                  <div 
                    onMouseDown={handleWidthResizeMouseDown}
                    className="w-1 bg-slate-200/50 hover:bg-indigo-500 active:bg-indigo-600 cursor-col-resize transition-all h-full absolute left-0 top-0 z-30 flex items-center justify-center group"
                    title="Drag to resize Ask AI Panel"
                  >
                    <div className="w-1.5 h-8 bg-slate-300 rounded-full group-hover:bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}

                {/* Main Right panel view */}
                <motion.div
                  animate={{ 
                    width: isAiPanelCollapsed ? 44 : aiPanelWidth 
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  className="h-full bg-white border-l border-slate-200 flex flex-col overflow-hidden relative shadow-lg"
                >
                  {isAiPanelCollapsed ? (
                    /* 2.C1 COLLAPSED VERTICAL TAB STRIP */
                    <button
                      onClick={() => setIsAiPanelCollapsed(false)}
                      className="w-full h-full bg-slate-50/50 hover:bg-indigo-50/30 flex flex-col items-center pt-5 gap-6 cursor-pointer transition-colors"
                      title="Expand AI Assistant Panel"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                      <div className="flex items-center gap-1 [writing-mode:vertical-lr] font-bold text-[11px] text-indigo-600 tracking-widest whitespace-nowrap">
                        <span>▶ ASK AI ABOUT THIS DOCUMENT</span>
                      </div>
                    </button>
                  ) : (
                    /* 2.C2 FULLY EXPANDED AI ASSISTANT SIDE PANEL */
                    <div className="flex-1 flex flex-col h-full overflow-hidden text-left bg-white">
                      
                      {/* Panel Title & Subtitle Header */}
                      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 mt-0.5 shrink-0">
                            <Sparkle className="w-4 h-4 text-indigo-500 animate-pulse" />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-slate-800 tracking-tight leading-none uppercase">
                              Ask AI About This Document
                            </h3>
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">
                              Ask questions, summarize pages, explain concepts or extract key information.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setIsAiPanelCollapsed(true)}
                          className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
                          title="Collapse Panel"
                        >
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>

                      {/* Content Area containing either compact welcome card or full conversation scroll */}
                      <div className="flex-1 flex flex-col overflow-hidden relative">
                        {ragHistory.length === 0 && !ragLoading ? (
                          /* COMPACT EMPTY STATE WELCOME CARD (Max height: 120px) */
                          <div className="p-4 bg-indigo-50/30 border-b border-slate-100 space-y-3 shrink-0" style={{ maxHeight: '120px' }}>
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <span className="text-xs">🤖</span>
                              <span className="text-xs font-bold text-slate-800">🤖 Ask AI about this document</span>
                            </div>
                            
                            {/* Suggestion Chips */}
                            <div className="flex flex-wrap gap-1.5 overflow-y-auto max-h-[60px] scrollbar-none">
                              {SUGGESTIONS.map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => handleSuggestionClick(s)}
                                  className="text-[9px] bg-white hover:bg-indigo-50/60 border border-indigo-100/60 text-indigo-600 font-bold px-2.5 py-1 rounded-full transition-all whitespace-nowrap cursor-pointer hover:border-indigo-300"
                                >
                                  • {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* FULL INDEPENDENT SCROLLABLE CONVERSATION AREA */
                          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin bg-slate-50/20">
                            {ragHistory.map((h, idx) => (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-2.5"
                              >
                                {/* User Speech Bubble */}
                                <div className="flex items-start justify-end">
                                  <span className="bg-indigo-600 text-white px-3.5 py-2 rounded-2xl text-left inline-block max-w-[85%] leading-relaxed shadow-3xs font-semibold">
                                    {h.q}
                                  </span>
                                </div>

                                {/* AI Speech Bubble */}
                                <div className="flex items-start justify-start">
                                  <div className="bg-white border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-2xl text-left inline-block max-w-[85%] leading-relaxed shadow-3xs font-medium space-y-2">
                                    <p className="whitespace-pre-line">{h.a}</p>
                                    <div className="flex flex-wrap gap-1 items-center mt-2 border-t border-slate-100 pt-1.5">
                                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mr-1">
                                        Sources:
                                      </span>
                                      {h.ref.map((r, rIdx) => (
                                        <span key={rIdx} className="text-[9px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md font-mono font-bold text-slate-500">
                                          {r}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}

                            {/* Typing Indicator */}
                            {ragLoading && (
                              <div className="flex items-start justify-start">
                                <span className="bg-white border border-slate-200 text-slate-400 px-3 py-2 rounded-2xl inline-flex items-center gap-1.5 text-[10px] shadow-3xs font-semibold">
                                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
                                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.15s]" />
                                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.3s]" />
                                  <span>AI is reading pages...</span>
                                </span>
                              </div>
                            )}

                            <div ref={chatBottomRef} />
                          </div>
                        )}

                        {/* Sticky Input area pinned at the bottom */}
                        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
                          {/* Continuous Followup Quick suggestions chips above input bar */}
                          {ragHistory.length > 0 && (
                            <div className="mb-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider shrink-0">Quick Ask:</span>
                              {SUGGESTIONS.slice(2).map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => handleSuggestionClick(s)}
                                  className="text-[9px] bg-slate-50 border border-slate-100 text-indigo-600 font-bold px-2 py-0.5 rounded-full transition-colors whitespace-nowrap cursor-pointer shrink-0"
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          )}

                          <form onSubmit={handleAsk} className="flex gap-2">
                            <input 
                              type="text" 
                              value={ragQuestion}
                              onChange={(e) => setRagQuestion(e.target.value)}
                              placeholder="Ask anything about this document..." 
                              className="flex-1 bg-slate-50 border border-slate-200 text-[11px] text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder-slate-400 font-semibold"
                            />
                            <button 
                              type="submit"
                              disabled={ragLoading || !ragQuestion.trim()}
                              className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer shrink-0 shadow-3xs"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </form>

                          {ragHistory.length > 0 && (
                            <div className="mt-2 flex justify-between items-center text-[9px] text-slate-400">
                              <span>SynapseAI Model V3</span>
                              <button
                                onClick={() => setRagHistory([])}
                                className="text-slate-400 hover:text-rose-500 font-bold flex items-center gap-1"
                              >
                                <RefreshCw className="w-2.5 h-2.5" />
                                <span>Reset Chat</span>
                              </button>
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  )}
                </motion.div>
              </div>

            </div>

            {/* ====================================================================
               MOBILE ASSISTANT INTERACTION (Floating Action Trigger & Bottom Sheet)
               ==================================================================== */}
            {/* Mobile Floating Action Button Launcher */}
            <div className="md:hidden fixed bottom-6 right-6 z-40">
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg font-bold text-xs cursor-pointer focus:outline-none transition-transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-teal-300 animate-pulse" />
                <span>Ask AI</span>
                {ragHistory.length > 0 && (
                  <span className="bg-white text-indigo-600 rounded-full px-1.5 py-0.5 text-[9px] font-extrabold leading-none">
                    {ragHistory.length}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Overlay Slide-up Bottom Sheet */}
            <AnimatePresence>
              {isMobileDrawerOpen && (
                <>
                  {/* Gray backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 md:hidden cursor-pointer"
                  />

                  {/* Sliding Sheet Panel */}
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 260 }}
                    className="fixed bottom-0 inset-x-0 bg-white rounded-t-[20px] z-50 shadow-2xl md:hidden border-t border-slate-200 flex flex-col overflow-hidden max-h-[85vh]"
                  >
                    {/* Visual drag handle bar */}
                    <div className="h-6 flex items-center justify-center shrink-0 border-b border-slate-100 bg-slate-50/50">
                      <div className="w-10 h-1 bg-slate-200 rounded-full" />
                    </div>

                    {/* Sheet Header */}
                    <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 shrink-0">
                      <div className="flex items-center gap-1.5 text-indigo-600">
                        <Sparkles className="w-4 h-4 animate-pulse text-indigo-500" />
                        <span className="text-xs font-extrabold uppercase tracking-wider">AI Assistant Reader</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {ragHistory.length > 0 && (
                          <button
                            onClick={() => setRagHistory([])}
                            className="text-[10px] text-rose-500 font-bold"
                          >
                            Clear
                          </button>
                        )}
                        <button
                          onClick={() => setIsMobileDrawerOpen(false)}
                          className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>

                    {/* Mobile Sheet Content (Messages / Compact state) */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-left bg-slate-50/30">
                      {ragHistory.length === 0 && !ragLoading ? (
                        <div className="py-10 text-center space-y-4">
                          <div className="p-3 bg-slate-100 rounded-full text-indigo-500 inline-block">
                            <Sparkles className="w-6 h-6 animate-pulse" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-800 text-sm">Ask anything about this document</h4>
                            <p className="text-slate-500 leading-relaxed text-[11px] max-w-xs mx-auto">
                              Ask questions, summarize key points or request specific action items.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 gap-2 pt-4">
                            {SUGGESTIONS.map((s) => (
                              <button
                                key={s}
                                onClick={() => handleSuggestionClick(s)}
                                className="text-[11px] bg-white border border-slate-200 hover:border-indigo-500 text-slate-700 font-semibold px-3.5 py-2.5 rounded-xl transition-all cursor-pointer text-left flex items-center gap-2"
                              >
                                <span className="text-indigo-500">✨</span>
                                <span>{s}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* Message List */
                        <div className="space-y-4 pb-4">
                          {ragHistory.map((h, idx) => (
                            <div key={idx} className="space-y-2">
                              <div className="flex items-start justify-end">
                                <span className="bg-indigo-600 text-white px-3.5 py-2 rounded-2xl text-left inline-block max-w-[85%] leading-relaxed shadow-xs font-semibold">
                                  {h.q}
                                </span>
                              </div>
                              <div className="flex items-start justify-start">
                                <div className="bg-white border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-2xl text-left inline-block max-w-[85%] leading-relaxed shadow-xs font-medium space-y-1">
                                  <p className="whitespace-pre-line">{h.a}</p>
                                  <p className="text-[9px] font-bold text-indigo-400 mt-2 uppercase tracking-wider block border-t border-slate-100 pt-1">
                                    Sources: {h.ref.join(', ')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}

                          {ragLoading && (
                            <div className="flex items-start justify-start">
                              <span className="bg-white border border-slate-200 text-slate-400 px-3 py-2 rounded-2xl inline-flex items-center gap-1.5 text-[10px] shadow-xs font-semibold">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce animate-duration-300" />
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce animate-duration-300 [animation-delay:0.1s]" />
                                <span>Analyzing document...</span>
                              </span>
                            </div>
                          )}

                          <div ref={mobileChatBottomRef} />
                        </div>
                      )}
                    </div>

                    {/* Mobile Sheet Input Sticky bar */}
                    <form onSubmit={handleAsk} className="p-3 border-t border-slate-200 flex gap-2 shrink-0 bg-white">
                      <input 
                        type="text" 
                        value={ragQuestion}
                        onChange={(e) => setRagQuestion(e.target.value)}
                        placeholder="Ask about this document..." 
                        className="flex-1 bg-slate-50 border border-slate-200 text-[11px] text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 font-semibold"
                      />
                      <button 
                        type="submit"
                        disabled={ragLoading || !ragQuestion.trim()}
                        className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>

                  </motion.div>
                </>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
