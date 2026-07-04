import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  Sparkles, 
  Sliders, 
  Check, 
  X, 
  RefreshCw, 
  Users, 
  Bookmark, 
  TrendingUp,
  Brain,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { TeamMember } from '../types';
import { recommendationService, RecommendationResult } from '../services/recommendationService';

interface RecommendationsViewProps {
  team: TeamMember[];
}

export default function RecommendationsView({ team }: RecommendationsViewProps) {
  const [requirements, setRequirements] = useState(
    "Require a senior specialist to configure distributed Kubernetes node scaling, automated mTLS security configurations, and active failover routines across multi-region cloud clusters."
  );
  const [skills, setSkills] = useState('Kubernetes, mTLS, Zero-Trust Networks');
  const [experience, setExperience] = useState(7);
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendationResult[]>([]);

  const handleRecommend = () => {
    setLoading(true);
    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
    
    setTimeout(async () => {
      const recommendations = await recommendationService.getRecommendations(
        requirements,
        skillsArray,
        experience
      );
      setResults(recommendations);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none pb-12 font-sans text-left">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-2">
        <span>Home</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-600 font-bold">AI Recommendations</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Pane: Config parameters */}
      <div className="space-y-5 lg:col-span-1">
        <div className="text-left">
          <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">AI Recommendations</h2>
          <p className="text-xs text-[#64748B]">Locate resources matching project scope, skill needs, and workloads.</p>
        </div>

        <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm space-y-4 text-left">
          <div className="flex items-center gap-1.5 text-[#23395B] pb-3 border-b border-[#E5E7EB]">
            <Sliders className="w-4 h-4" />
            <span className="text-xs font-bold text-[#1E293B]">Staff Selection Metrics</span>
          </div>

          {/* Requirements textarea */}
          <div className="space-y-1 text-xs">
            <label className="text-[#1E293B] font-semibold">Project Requirements Overview</label>
            <textarea 
              rows={4}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Describe the operational goals of your project..." 
              className="w-full bg-white border border-[#E5E7EB] text-xs text-[#1E293B] p-3.5 rounded-xl focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 resize-none leading-relaxed transition-all placeholder-[#64748B]/50"
            />
          </div>

          {/* Required skills input */}
          <div className="space-y-1 text-xs">
            <label className="text-[#1E293B] font-semibold">Required Skills (Comma separated)</label>
            <input 
              type="text" 
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, TypeScript, Python" 
              className="w-full bg-white border border-[#E5E7EB] text-xs text-[#1E293B] px-3.5 py-2 rounded-xl focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 transition-all placeholder-[#64748B]/50"
            />
          </div>

          {/* Experience slider */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center text-[#64748B]">
              <label className="font-semibold text-[#1E293B]">Minimum Tenure Requirement</label>
              <span className="font-mono text-[#23395B] font-bold">{experience} Years</span>
            </div>
            <input 
              type="range" 
              min={2}
              max={12}
              value={experience}
              onChange={(e) => setExperience(Number(e.target.value))}
              className="w-full accent-[#23395B] h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <button 
            onClick={handleRecommend}
            disabled={loading || !skills.trim()}
            className="w-full py-2.5 bg-[#23395B] hover:bg-[#1E293B] disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running alignment queries...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Generate Recommendations</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Pane: Results Cards displaying recommended staff matches */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center gap-1.5 text-[#4F7CAC]">
          <Award className="w-4 h-4" />
          <h3 className="text-xs font-bold uppercase">Computed Alignment Candidates</h3>
        </div>

        {results.length > 0 ? (
          <div className="space-y-4">
            {results.slice(0, 5).map((rec, i) => (
              <motion.div 
                key={rec.member.id} 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl border border-[#E5E7EB] bg-white flex flex-col justify-between text-left space-y-4 hover:border-[#4F7CAC]/20 hover:shadow-md transition-all relative overflow-hidden group shadow-sm"
              >
                {/* Score badge top corner */}
                <div className="absolute top-0 right-0 p-3 bg-[#4F7CAC]/10 border-b border-l border-[#E5E7EB] rounded-bl-xl font-mono text-xs font-bold text-[#23395B]">
                  {rec.score}% Match Score
                </div>

                <div className="flex items-start gap-4 pr-24">
                  <img 
                    src={rec.member.avatar} 
                    alt={rec.member.name} 
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full border border-[#E5E7EB] bg-slate-50"
                  />
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-[#1E293B]">{rec.member.name}</h3>
                    <span className="text-[10px] text-[#64748B] block font-semibold">{rec.member.role} • {rec.member.department}</span>
                    <span className="text-[10px] text-[#64748B] block font-medium">Experience: {rec.member.experience}</span>
                  </div>
                </div>

                {/* Match explanations */}
                <div className="p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-xs text-[#1E293B] leading-relaxed">
                  <span className="text-[9px] font-mono text-[#23395B] block uppercase font-bold mb-1">AI Recommendation Context</span>
                  {rec.reason}
                </div>

                {/* Candidate tags and workloads */}
                <div className="flex flex-wrap gap-1">
                  {rec.member.skills.map((s, si) => (
                    <span 
                      key={si} 
                      className="text-[9px] bg-slate-100 border border-slate-200 text-[#64748B] px-2.5 py-0.5 rounded-full font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Workload and decision actions */}
                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#64748B]">
                  <span className="flex items-center gap-1 font-medium">
                    <Users className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Active Workload Allocation: {rec.member.currentWorkload}%</span>
                  </span>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        alert(`Staff member ${rec.member.name} has been securely assigned to the active project.`);
                        setResults(prev => prev.filter(r => r.member.id !== rec.member.id));
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#23395B] hover:bg-[#1E293B] text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <Check className="w-3 h-3" />
                      <span>Accept</span>
                    </button>
                    <button 
                      onClick={() => {
                        alert('Candidate rejected. Recalculating.');
                        setResults(prev => prev.filter(r => r.member.id !== rec.member.id));
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 border border-[#E5E7EB] text-[#1E293B] hover:bg-[#F7F8FA] bg-white rounded-xl text-[10px] font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <X className="w-3 h-3" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-[#E5E7EB] rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center p-6">
            <AlertCircle className="w-10 h-10 text-[#64748B] mb-3" />
            <p className="text-sm font-bold text-[#1E293B]">No active matches found</p>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto leading-relaxed font-normal">
              Define the requirements, list the technical skills, and click "Generate Recommendations" to find matching staff members.
            </p>
          </div>
        )}
      </div>

    </div>
    </div>
  );
}
