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
}

export default function TeamsView({ team }: TeamsViewProps) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  
  // Recommendations Panel State
  const [showRecs, setShowRecs] = useState(false);
  const [requiredSkills, setRequiredSkills] = useState('React, TypeScript, CSS');
  const [experienceYears, setExperienceYears] = useState(6);
  const [recsLoading, setRecsLoading] = useState(false);
  const [recResults, setRecResults] = useState<RecommendationResult[]>([]);

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
        
        <Button 
          onClick={() => {
            setShowRecs(true);
            handleGenerateRecommendations();
          }}
          variant="primary"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>AI Team Recommendation</span>
        </Button>
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
              className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between"
            >
              {/* Header Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={m.avatar} 
                    alt={m.name} 
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full border border-slate-200 object-cover bg-slate-100"
                  />
                  <div className="text-left">
                    <h3 className="text-xs font-bold text-slate-800 leading-tight">{m.name}</h3>
                    <span className="text-[10px] text-slate-400 font-bold font-mono block mt-0.5 uppercase tracking-wider">{m.role}</span>
                  </div>
                </div>

                <span className="text-[9px] bg-slate-50 border border-slate-200/85 text-slate-500 px-2 py-0.5 rounded font-bold font-mono uppercase tracking-wider">
                  {m.experience.split(' at ')[0]}
                </span>
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
      </AnimatePresence>

    </div>
  );
}
