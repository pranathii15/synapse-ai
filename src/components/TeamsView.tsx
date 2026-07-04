import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Sparkles, 
  Award, 
  Brain, 
  Clock, 
  X, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Sliders,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { TeamMember } from '../types';
import { recommendationService, RecommendationResult } from '../services/recommendationService';
import Button from './Button';

interface TeamsViewProps {
  team: TeamMember[];
  onCreateMember?: (member: Omit<TeamMember, 'id'>) => void;
  onUpdateMember?: (id: string, updates: Partial<TeamMember>) => void;
  onDeleteMember?: (id: string) => void;
}

export default function TeamsView({ 
  team,
  onCreateMember,
  onUpdateMember,
  onDeleteMember
}: TeamsViewProps) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  
  // Recommendations Panel State
  const [showRecs, setShowRecs] = useState(false);
  const [requiredSkills, setRequiredSkills] = useState('React, TypeScript, CSS');
  const [experienceYears, setExperienceYears] = useState(6);
  const [recsLoading, setRecsLoading] = useState(false);
  const [recResults, setRecResults] = useState<RecommendationResult[]>([]);

  // Create Member Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberDept, setNewMemberDept] = useState('Applied AI Systems');
  const [newMemberSkills, setNewMemberSkills] = useState('');
  const [newMemberExp, setNewMemberExp] = useState('');
  const [newMemberWorkload, setNewMemberWorkload] = useState(50);
  const [newMemberAvatar, setNewMemberAvatar] = useState('');
  const [newMemberTask, setNewMemberTask] = useState('');

  // Edit Member Modal State
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editMemberName, setEditMemberName] = useState('');
  const [editMemberRole, setEditMemberRole] = useState('');
  const [editMemberDept, setEditMemberDept] = useState('');
  const [editMemberSkills, setEditMemberSkills] = useState('');
  const [editMemberExp, setEditMemberExp] = useState('');
  const [editMemberWorkload, setEditMemberWorkload] = useState(50);
  const [editMemberAvatar, setEditMemberAvatar] = useState('');
  const [editMemberTask, setEditMemberTask] = useState('');

  const departments = ['All', 'Research & Intelligence', 'Applied AI Systems', 'Infrastructure & DevOps', 'Product Systems', 'Cybersecurity & Compliance'];

  // Filter roster
  const filteredTeam = team.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.role.toLowerCase().includes(search.toLowerCase()) ||
                          m.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesDept = deptFilter === 'All' || m.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleGenerateRecommendations = async () => {
    setRecsLoading(true);
    // Parse skill terms
    const skillsArray = requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
    
    // Simulate API Delay
    setTimeout(async () => {
      const results = await recommendationService.getRecommendations(
        'Custom query',
        skillsArray,
        experienceYears
      );
      setRecResults(results);
      setRecsLoading(false);
    }, 800);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateMember) return;

    onCreateMember({
      name: newMemberName,
      role: newMemberRole,
      department: newMemberDept,
      skills: newMemberSkills.split(',').map(s => s.trim()).filter(Boolean),
      experience: newMemberExp || '3 years',
      currentWorkload: Number(newMemberWorkload),
      avatar: newMemberAvatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=facearea&facepad=2`,
      currentTask: newMemberTask || undefined
    });

    // Reset fields
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberDept('Applied AI Systems');
    setNewMemberSkills('');
    setNewMemberExp('');
    setNewMemberWorkload(50);
    setNewMemberAvatar('');
    setNewMemberTask('');
    setIsCreateOpen(false);
  };

  const startEditingMember = (member: TeamMember) => {
    setEditingMember(member);
    setEditMemberName(member.name);
    setEditMemberRole(member.role);
    setEditMemberDept(member.department);
    setEditMemberSkills(member.skills.join(', '));
    setEditMemberExp(member.experience);
    setEditMemberWorkload(member.currentWorkload);
    setEditMemberAvatar(member.avatar);
    setEditMemberTask(member.currentTask || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !onUpdateMember) return;

    onUpdateMember(editingMember.id, {
      name: editMemberName,
      role: editMemberRole,
      department: editMemberDept,
      skills: editMemberSkills.split(',').map(s => s.trim()).filter(Boolean),
      experience: editMemberExp,
      currentWorkload: Number(editMemberWorkload),
      avatar: editMemberAvatar,
      currentTask: editMemberTask || undefined
    });

    setEditingMember(null);
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (!onDeleteMember) return;
    if (confirm(`Are you sure you want to delete team member "${name}"?`)) {
      onDeleteMember(id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none relative pb-12 font-sans text-left">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
        <span>Home</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-600 font-bold">Teams</span>
      </div>

      {/* Top action header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Teams</h2>
          <p className="text-xs text-slate-500 font-medium">View team availability, active workloads, and skill sets.</p>
        </div>
        
        <div className="flex items-center gap-2.5">
          <Button 
            onClick={() => {
              setShowRecs(true);
              handleGenerateRecommendations();
            }}
            variant="secondary"
            className="text-xs flex items-center gap-1.5 border border-slate-200"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>AI Team Recommendation</span>
          </Button>

          {onCreateMember && (
            <Button 
              onClick={() => setIsCreateOpen(true)}
              variant="primary"
              className="text-xs flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-white" />
              <span>Add Member</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full md:w-80 transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search roster by skills (e.g. mTLS, PyTorch)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full font-semibold"
          />
        </div>

        {/* Dept Selector */}
        <div className="text-xs w-full md:w-auto">
          <select 
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full md:w-64 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
          >
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeam.map((m) => {
          const isOverloaded = m.currentWorkload >= 80;
          return (
            <motion.div
              key={m.id}
              whileHover={{ y: -3 }}
              className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between group relative"
            >
              {/* Header Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={m.avatar} 
                    alt={m.name} 
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full border border-slate-200 object-cover bg-slate-100 animate-fade-in"
                  />
                  <div className="text-left">
                    <h3 className="text-xs font-bold text-slate-800 leading-tight">{m.name}</h3>
                    <span className="text-[10px] text-slate-400 font-bold font-mono block mt-0.5 uppercase tracking-wider">{m.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9px] bg-slate-50 border border-slate-200/85 text-slate-500 px-2 py-0.5 rounded font-bold font-mono uppercase tracking-wider">
                    {m.experience.split(' at ')[0]}
                  </span>
                  
                  {(onUpdateMember || onDeleteMember) && (
                    <div className="flex items-center gap-0.5 bg-slate-50 border border-slate-150 p-0.5 rounded-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      {onUpdateMember && (
                        <button 
                          onClick={() => startEditingMember(m)}
                          className="p-1 hover:bg-white rounded-md text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                          title="Edit Member"
                        >
                          <Sliders className="w-3 h-3" />
                        </button>
                      )}
                      {onDeleteMember && (
                        <button 
                          onClick={() => handleDeleteMember(m.id, m.name)}
                          className="p-1 hover:bg-white rounded-md text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Member"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Department */}
              <div className="text-left mb-3">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block font-sans">
                  {m.department}
                </span>
              </div>

              {/* Current active task info */}
              {m.currentTask && (
                <div className="p-2.5 rounded-xl bg-slate-50/50 border border-slate-200 text-left mb-4">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Current Assignment</span>
                  <span className="text-xs text-slate-700 font-bold block mt-0.5 line-clamp-1">
                    {m.currentTask}
                  </span>
                </div>
              )}

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1 mb-4 h-16 overflow-y-auto content-start">
                {m.skills.map((skill, i) => (
                  <span 
                    key={i} 
                    className="text-[9px] bg-indigo-50 border border-indigo-100/80 text-indigo-600 font-bold px-2 py-0.5 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Workload */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Utilization Rate</span>
                  <span className={`font-bold ${
                    isOverloaded ? 'text-rose-500' : 'text-emerald-500'
                  }`}>
                    {m.currentWorkload}%
                  </span>
                </div>
                
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOverloaded ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${m.currentWorkload}%` }}
                  />
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* Sliding Recommendations Drawer */}
      <AnimatePresence>
        {showRecs && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRecs(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 cursor-pointer"
            />

            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 h-screen w-full sm:w-[500px] bg-white border-l border-slate-200 p-6 shadow-2xl z-50 flex flex-col justify-between overflow-y-auto text-left"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                    <span className="text-sm font-bold text-slate-800">AI Resource Recs Console</span>
                  </div>
                  <button 
                    onClick={() => setShowRecs(false)}
                    className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search / filter sliders */}
                <div className="space-y-4 p-4 rounded-xl bg-slate-50/50 border border-slate-200">
                  <div className="space-y-1.5 text-xs text-left">
                    <label className="text-slate-700 font-bold">Required Skills (Comma separated)</label>
                    <input 
                      type="text" 
                      value={requiredSkills}
                      onChange={(e) => setRequiredSkills(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs text-left">
                    <div className="flex justify-between items-center text-slate-500 font-bold">
                      <label className="text-slate-700">Min Experience Years</label>
                      <span className="text-indigo-600 font-mono">{experienceYears} Years</span>
                    </div>
                    <input 
                      type="range" 
                      min={2}
                      max={12}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div className="pt-2">
                    <Button 
                      onClick={handleGenerateRecommendations}
                      disabled={recsLoading}
                      className="w-full"
                    >
                      {recsLoading ? 'Analyzing Staff Profiles...' : 'Find Best Team Members'}
                    </Button>
                  </div>
                </div>

                {/* Recommendations Results list */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-[9px]">Matching Team Members</span>
                    {recsLoading && <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />}
                  </div>

                  <div className="space-y-3">
                    {recResults.map((rec, i) => (
                      <div 
                        key={rec.member.id} 
                        className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 hover:border-indigo-500/20 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <img 
                              src={rec.member.avatar} 
                              alt={rec.member.name} 
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-full bg-slate-100"
                            />
                            <div className="text-left">
                              <span className="text-xs font-bold text-slate-800 block">{rec.member.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold font-mono block uppercase">{rec.member.role}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold text-indigo-600 font-mono">
                              {rec.score}% match
                            </span>
                            <span className="text-[9px] text-slate-400 block font-mono">Workload: {rec.member.currentWorkload}%</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed text-left bg-slate-50/50 p-2.5 rounded-lg border border-slate-200">
                          {rec.reason}
                        </p>

                        <div className="flex gap-2 justify-end pt-1">
                          <button 
                            onClick={() => {
                              alert(`Accepted ${rec.member.name} for the project assignment.`);
                              setShowRecs(false);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold cursor-pointer transition-all shadow-xs"
                          >
                            Accept & Assign
                          </button>
                          <button 
                            onClick={() => {
                              alert('Rejected recommendation. Recalculating.');
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 bg-white text-[10px] font-bold cursor-pointer transition-all"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="pt-6 border-t border-slate-100 mt-6">
                <Button 
                  onClick={() => setShowRecs(false)}
                  variant="secondary"
                  className="w-full"
                >
                  Close Console
                </Button>
              </div>
            </motion.div>
          </>
        )}

        {isCreateOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 cursor-pointer"
            />

            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 h-screen w-full sm:w-[500px] bg-white border-l border-slate-200 p-6 shadow-2xl z-50 flex flex-col justify-between overflow-y-auto text-left"
            >
              <form onSubmit={handleCreateSubmit} className="space-y-6 flex flex-col h-full justify-between pb-6 font-sans">
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="text-sm font-bold text-slate-800">Add Team Member</span>
                    <button 
                      type="button"
                      onClick={() => setIsCreateOpen(false)}
                      className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Name */}
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold block mb-1 uppercase text-[10px] tracking-wider">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/10 transition-all"
                      placeholder="e.g. Liam Foster"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold block mb-1 uppercase text-[10px] tracking-wider">Role *</label>
                    <input 
                      type="text" 
                      required
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/10 transition-all"
                      placeholder="e.g. Senior Machine Learning Engineer"
                    />
                  </div>

                  {/* Department */}
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold block mb-1 uppercase text-[10px] tracking-wider">Department</label>
                    <select 
                      value={newMemberDept}
                      onChange={(e) => setNewMemberDept(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    >
                      {departments.filter(d => d !== 'All').map(d => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Skills */}
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold block mb-1 uppercase text-[10px] tracking-wider">Skills (Comma separated) *</label>
                    <input 
                      type="text" 
                      required
                      value={newMemberSkills}
                      onChange={(e) => setNewMemberSkills(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/10 transition-all"
                      placeholder="e.g. Python, NLP, PyTorch, Jax"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Experience */}
                    <div className="space-y-1 text-xs">
                      <label className="text-slate-500 font-bold block mb-1 uppercase text-[10px] tracking-wider">Experience (text)</label>
                      <input 
                        type="text" 
                        value={newMemberExp}
                        onChange={(e) => setNewMemberExp(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/10 transition-all"
                        placeholder="e.g. 5 years at Meta"
                      />
                    </div>

                    {/* Workload */}
                    <div className="space-y-1 text-xs">
                      <label className="text-slate-500 font-bold block mb-1 uppercase text-[10px] tracking-wider">Utilization Rate (%)</label>
                      <input 
                        type="number" 
                        min={0}
                        max={100}
                        value={newMemberWorkload}
                        onChange={(e) => setNewMemberWorkload(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/10 transition-all"
                      />
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold block mb-1 uppercase text-[10px] tracking-wider">Avatar Image URL (Optional)</label>
                    <input 
                      type="text" 
                      value={newMemberAvatar}
                      onChange={(e) => setNewMemberAvatar(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/10 transition-all"
                      placeholder="https://..."
                    />
                  </div>

                  {/* Current Task */}
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold block mb-1 uppercase text-[10px] tracking-wider">Current Active Task (Optional)</label>
                    <input 
                      type="text" 
                      value={newMemberTask}
                      onChange={(e) => setNewMemberTask(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/10 transition-all"
                      placeholder="e.g. Fine-tune legal dataset loss metrics"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => setIsCreateOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="text-xs"
                  >
                    Add Member
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}

        {editingMember && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingMember(null)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 cursor-pointer"
            />

            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 h-screen w-full sm:w-[500px] bg-white border-l border-slate-200 p-6 shadow-2xl z-50 flex flex-col justify-between overflow-y-auto text-left"
            >
              <form onSubmit={handleEditSubmit} className="space-y-6 flex flex-col h-full justify-between pb-6 font-sans">
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="text-sm font-bold text-slate-800">Edit Member Profile</span>
                    <button 
                      type="button"
                      onClick={() => setEditingMember(null)}
                      className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Name */}
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold block mb-1 uppercase text-[10px] tracking-wider">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={editMemberName}
                      onChange={(e) => setEditMemberName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold block mb-1 uppercase text-[10px] tracking-wider">Role *</label>
                    <input 
                      type="text" 
                      required
                      value={editMemberRole}
                      onChange={(e) => setEditMemberRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>

                  {/* Department */}
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold block mb-1 uppercase text-[10px] tracking-wider">Department</label>
                    <select 
                      value={editMemberDept}
                      onChange={(e) => setEditMemberDept(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    >
                      {departments.filter(d => d !== 'All').map(d => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Skills */}
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold block mb-1 uppercase text-[10px] tracking-wider">Skills (Comma separated) *</label>
                    <input 
                      type="text" 
                      required
                      value={editMemberSkills}
                      onChange={(e) => setEditMemberSkills(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Experience */}
                    <div className="space-y-1 text-xs">
                      <label className="text-slate-500 font-bold block mb-1 uppercase text-[10px] tracking-wider">Experience (text)</label>
                      <input 
                        type="text" 
                        value={editMemberExp}
                        onChange={(e) => setEditMemberExp(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/10 transition-all"
                      />
                    </div>

                    {/* Workload */}
                    <div className="space-y-1 text-xs">
                      <label className="text-slate-500 font-bold block mb-1 uppercase text-[10px] tracking-wider">Utilization Rate (%)</label>
                      <input 
                        type="number" 
                        min={0}
                        max={100}
                        value={editMemberWorkload}
                        onChange={(e) => setEditMemberWorkload(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/10 transition-all"
                      />
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold block mb-1 uppercase text-[10px] tracking-wider">Avatar Image URL (Optional)</label>
                    <input 
                      type="text" 
                      value={editMemberAvatar}
                      onChange={(e) => setEditMemberAvatar(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>

                  {/* Current Task */}
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold block mb-1 uppercase text-[10px] tracking-wider">Current Active Task (Optional)</label>
                    <input 
                      type="text" 
                      value={editMemberTask}
                      onChange={(e) => setEditMemberTask(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => setEditingMember(null)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="text-xs"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
