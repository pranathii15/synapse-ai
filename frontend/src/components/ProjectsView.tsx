import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Clock, 
  Tag, 
  Sparkles, 
  X, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  ArrowRight,
  ChevronRight,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Project, ProjectPriority, ProjectStatus } from '../types';
import Button from './Button';

interface ProjectsViewProps {
  projects: Project[];
  onCreateProject: (project: Omit<Project, 'id' | 'progress' | 'completedTasks' | 'aiSummary'>) => void;
  onSearchProjects?: (keyword: string) => void;
  projectLoading?: boolean;
  searchLoading?: boolean;
  searchError?: string | null;
}

export default function ProjectsView({ projects, onCreateProject, onSearchProjects, projectLoading = false, searchLoading = false, searchError = null }: ProjectsViewProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Create Project Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Core AI Engineering');
  const [newPriority, setNewPriority] = useState<ProjectPriority>('Medium');
  const [newStatus, setNewStatus] = useState<ProjectStatus>('Planning');
  const [newDueDate, setNewDueDate] = useState('2026-08-30');
  const [newTeamSize, setNewTeamSize] = useState(3);
  const [newTasksCount, setNewTasksCount] = useState(10);

  const statuses = ['All', 'Planning', 'In Progress', 'Completed', 'Review'];

  // Filters
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase()) ||
                          p.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDesc) {
      alert('Please fill out all required fields');
      return;
    }
    
    onCreateProject({
      name: newName,
      description: newDesc,
      status: newStatus,
      priority: newPriority,
      dueDate: newDueDate,
      category: newCategory,
      teamSize: Number(newTeamSize),
      tasksCount: Number(newTasksCount)
    });

    // Reset Form
    setNewName('');
    setNewDesc('');
    setNewCategory('Core AI Engineering');
    setNewPriority('Medium');
    setNewStatus('Planning');
    setNewDueDate('2026-08-30');
    setNewTeamSize(3);
    setNewTasksCount(10);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none relative pb-12 font-sans text-left">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
        <span>Home</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-600 font-bold">Projects</span>
        {selectedProject && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-600 font-bold">Project Details</span>
          </>
        )}
      </div>

      {/* Top action header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Projects</h2>
          <p className="text-xs text-slate-500 font-medium">Create, track, and manage your team projects and progress.</p>
        </div>
        
        <Button 
          onClick={() => setIsModalOpen(true)}
          icon={Plus}
          size="sm"
          className="self-start sm:self-auto shadow-sm"
        >
          Create Project
        </Button>
      </div>

      {projectLoading ? (
        <div className="premium-card p-10 text-center border border-slate-200 bg-white rounded-3xl shadow-sm">
          <Loader2 className="mx-auto w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-sm font-semibold text-slate-700">Loading projects from backend…</p>
          <p className="text-xs text-slate-500 mt-2">Please wait while we sync your project workspace.</p>
        </div>
      ) : (
        <>
          {/* Filter Options and Search */}
          <div className="premium-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (onSearchProjects) {
                  onSearchProjects(search);
                }
              }}
              className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 w-full md:w-80 transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:bg-white"
            >
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none w-full font-semibold"
              />
              <Button type="submit" variant="secondary" className="text-[11px] py-2 px-3">
                Search
              </Button>
            </form>
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                    statusFilter === s 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10 font-bold' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {searchLoading && (
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
              <span>Searching projects…</span>
            </div>
          )}
          {searchError && (
            <p className="text-[11px] text-rose-600 mt-2">{searchError}</p>
          )}
        </>
      )}

      {/* Projects Grid */}
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                statusFilter === s 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10 font-bold' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="premium-card py-20 text-center border-2 border-dashed border-slate-200/60 p-8 max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h4 className="text-sm font-bold text-slate-800">No projects yet</h4>
          <p className="text-xs text-slate-500 mt-1 mb-5">Try adjusting your directory filters or create a brand new enterprise project to align workloads.</p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            icon={Plus}
            size="sm"
          >
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((p) => {
            return (
              <motion.div
                key={p.id}
                onClick={() => setSelectedProject(p)}
                whileHover={{ y: -3 }}
                className="premium-card premium-card-hover p-5 relative group flex flex-col justify-between"
              >
                <div>
                  {/* Floating tags */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
                      {p.category}
                    </span>
                    
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                      p.priority === 'High' 
                        ? 'bg-rose-50 border-rose-100 text-rose-500' 
                        : p.priority === 'Medium' 
                        ? 'bg-amber-50 border-amber-100 text-amber-500' 
                        : 'bg-indigo-50 border-indigo-100 text-indigo-500'
                    }`}>
                      {p.priority} Priority
                    </span>
                  </div>

                  {/* Name & Desc */}
                  <div className="space-y-1 mb-4">
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                      {p.description}
                    </p>
                  </div>
                </div>

                <div>
                  {/* Progress bar */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-400">Milestone Progress</span>
                      <span className="text-slate-800">{p.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-200">
                      <div 
                        className="bg-gradient-to-r from-indigo-600 to-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Details Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-bold">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.teamSize} staff</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Due {p.dueDate}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-indigo-600 group-hover:translate-x-1 transition-transform">
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Project Details Drawer (Sliding Sidebar panel) */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 cursor-pointer"
            />
            
            {/* Sliding Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 240 }}
              className="fixed top-0 right-0 h-screen w-full sm:w-[480px] bg-white border-l border-slate-200 p-6 shadow-2xl z-50 flex flex-col justify-between overflow-y-auto text-left"
            >
              <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Project Inspector</span>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="p-1.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Identity info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600">
                      {selectedProject.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-500">
                      {selectedProject.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 tracking-tight">{selectedProject.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">{selectedProject.description}</p>
                </div>

                {/* Progress Bar & Status */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400">Completion Metrics</span>
                    <span className="text-slate-800">{selectedProject.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-600 to-indigo-500 h-full rounded-full"
                      style={{ width: `${selectedProject.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold pt-1">
                    <span>TASKS COMPLETED: {selectedProject.completedTasks}</span>
                    <span>TOTAL DELIVERABLES: {selectedProject.tasksCount}</span>
                  </div>
                </div>

                {/* AI Project Summary Panel */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <h4 className="text-[11px] font-bold tracking-widest uppercase">AI Project Summary</h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-50/45 border border-indigo-100/80 text-xs text-slate-600 leading-relaxed font-semibold space-y-2.5">
                    <p>{selectedProject.aiSummary}</p>
                    <div className="pt-2.5 border-t border-indigo-100 flex justify-between items-center text-[10px] text-slate-400 font-bold">
                      <span>REFRESHED: 1 hour ago</span>
                      <span className="text-indigo-600 uppercase">On Track</span>
                    </div>
                  </div>
                </div>

                {/* Detail Metrics */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <span className="text-slate-400 font-bold block mb-1 uppercase text-[9px]">Priority Level</span>
                    <span className={`font-bold ${
                      selectedProject.priority === 'High' ? 'text-rose-500' : 'text-slate-700'
                    }`}>{selectedProject.priority} Priority</span>
                  </div>
                  
                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <span className="text-slate-400 font-bold block mb-1 uppercase text-[9px]">Milestone Due Date</span>
                    <span className="text-slate-700 font-bold">{selectedProject.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6">
                <Button 
                  onClick={() => setSelectedProject(null)}
                  className="w-full"
                >
                  Confirm Inspection Settings
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/25 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl z-10 overflow-hidden text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">Initiate New Enterprise Project</span>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5 text-xs text-left">
                  <label className="text-slate-700 font-bold">Project Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Project Orion: Multilingual Sentiment Model" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-800 focus:outline-none transition-all placeholder-slate-400 font-semibold"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5 text-xs text-left">
                  <label className="text-slate-700 font-bold">Project Description *</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Describe the technical goals, pipeline constraints, or security measures..." 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-800 focus:outline-none resize-none transition-all placeholder-slate-400 font-semibold"
                  />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1.5 text-xs text-left">
                    <label className="text-slate-700 font-bold">Category</label>
                    <select 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-800 focus:outline-none transition-all font-semibold"
                    >
                      <option>Core AI Engineering</option>
                      <option>AI Analytics</option>
                      <option>Cloud Infrastructure</option>
                      <option>Cybersecurity</option>
                      <option>HR & Operations</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-1.5 text-xs text-left">
                    <label className="text-slate-700 font-bold">Priority</label>
                    <select 
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as ProjectPriority)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-800 focus:outline-none transition-all font-semibold"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Status */}
                  <div className="space-y-1.5 text-xs text-left">
                    <label className="text-slate-700 font-bold">Initial Status</label>
                    <select 
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as ProjectStatus)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-800 focus:outline-none transition-all font-semibold"
                    >
                      <option>Planning</option>
                      <option>In Progress</option>
                      <option>Review</option>
                    </select>
                  </div>

                  {/* Due Date */}
                  <div className="space-y-1.5 text-xs text-left">
                    <label className="text-slate-700 font-bold">Due Date</label>
                    <input 
                      type="date" 
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-800 focus:outline-none transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Team Size */}
                  <div className="space-y-1.5 text-xs text-left">
                    <label className="text-slate-700 font-bold">On-staff Team Size</label>
                    <input 
                      type="number" 
                      min={1}
                      max={20}
                      value={newTeamSize}
                      onChange={(e) => setNewTeamSize(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-800 focus:outline-none transition-all font-semibold"
                    />
                  </div>

                  {/* Tasks Count */}
                  <div className="space-y-1.5 text-xs text-left">
                    <label className="text-slate-700 font-bold">Initial Tasks Count</label>
                    <input 
                      type="number" 
                      min={1}
                      max={50}
                      value={newTasksCount}
                      onChange={(e) => setNewTasksCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-800 focus:outline-none transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <Button 
                    type="button"
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                  >
                    Confirm Generation
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
