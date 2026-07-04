import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Video, 
  FileText, 
  Cpu, 
  ArrowUpRight,
  Sparkles,
  Calendar,
  Layers,
  Clock
} from 'lucide-react';
import { Project, Task, Document, ChatConversation } from '../types';

interface AnalyticsViewProps {
  projects: Project[];
  tasks: Task[];
  documents: Document[];
  chats: ChatConversation[];
}

export default function AnalyticsView({
  projects,
  tasks,
  documents,
  chats
}: AnalyticsViewProps) {
  const [activeSegment, setActiveSegment] = useState<'all' | 'workspace' | 'ai'>('all');

  // Chart 1: Project Progress Index
  const projectChartData = projects.map(p => ({
    name: p.name.length > 15 ? `${p.name.substring(0, 15)}...` : p.name,
    Progress: p.progress,
    Tasks: p.tasksCount,
    Completed: p.completedTasks
  }));

  // Chart 2: Department Workload Distribution
  const workloadChartData = [
    { name: 'Research', Workload: 85, Staff: 4, Efficiency: 92 },
    { name: 'Applied AI', Workload: 65, Staff: 6, Efficiency: 88 },
    { name: 'DevOps', Workload: 40, Staff: 3, Efficiency: 95 },
    { name: 'Product', Workload: 90, Staff: 5, Efficiency: 84 },
    { name: 'Security', Workload: 50, Staff: 3, Efficiency: 98 }
  ];

  // Chart 3: Task Completion Trend (Mocked for professional look)
  const taskCompletionTrend = [
    { week: 'Wk 21', Completed: 12, Active: 18 },
    { week: 'Wk 22', Completed: 19, Active: 15 },
    { week: 'Wk 23', Completed: 24, Active: 20 },
    { week: 'Wk 24', Completed: 35, Active: 14 },
    { week: 'Wk 25', Completed: 48, Active: 10 }
  ];

  // Chart 4: Meeting Analytics
  const meetingAnalytics = [
    { month: 'Feb', Minutes: 240, ActionItems: 14, Summaries: 6 },
    { month: 'Mar', Minutes: 480, ActionItems: 28, Summaries: 12 },
    { month: 'Apr', Minutes: 360, ActionItems: 19, Summaries: 9 },
    { month: 'May', Minutes: 600, ActionItems: 42, Summaries: 18 },
    { month: 'Jun', Minutes: 720, ActionItems: 55, Summaries: 24 }
  ];

  // Chart 5: Document AI Extraction & Embedding Segments
  const docAnalytics = [
    { name: 'Technical Specs', Chunks: 120, Documents: 4 },
    { name: 'Strategic', Chunks: 45, Documents: 2 },
    { name: 'HR & Operations', Chunks: 85, Documents: 3 },
    { name: 'Compliance Docs', Chunks: 160, Documents: 5 }
  ];

  // Chart 6: AI Usage Metrics
  const aiUsageData = [
    { name: 'Document RAG', value: 42 },
    { name: 'Meeting summaries', value: 28 },
    { name: 'Workspace assistant', value: 30 }
  ];

  const COLORS = ['#4F7CAC', '#23395B', '#7FB7E8', '#3CB371'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none pb-12 font-sans text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">Enterprise Intelligence Analytics</h2>
          <p className="text-xs text-[#64748B]">
            In-depth audit and real-time visualization of your team workloads, project progressions, and AI metrics.
          </p>
        </div>

        {/* View Segment Selector */}
        <div className="flex items-center gap-1 bg-white border border-[#E5E7EB] rounded-xl p-1 self-start">
          <button
            onClick={() => setActiveSegment('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSegment === 'all' 
                ? 'bg-[#23395B] text-white shadow-sm' 
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            All Analytics
          </button>
          <button
            onClick={() => setActiveSegment('workspace')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSegment === 'workspace' 
                ? 'bg-[#23395B] text-white shadow-sm' 
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            Workspace & Tasks
          </button>
          <button
            onClick={() => setActiveSegment('ai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSegment === 'ai' 
                ? 'bg-[#23395B] text-white shadow-sm' 
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            AI & Semantic RAG
          </button>
        </div>
      </div>

      {/* Top Level KPIs for Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm space-y-1">
          <span className="text-[10px] text-[#64748B] font-bold uppercase block tracking-wider">Overall Success Index</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1E293B]">91.4%</span>
            <span className="text-[10px] text-[#3CB371] font-bold flex items-center">
              <TrendingUp className="w-3 h-3" /> +1.2%
            </span>
          </div>
          <span className="text-[10px] text-[#64748B] block font-medium">Sprint velocity is optimal</span>
        </div>

        <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm space-y-1">
          <span className="text-[10px] text-[#64748B] font-bold uppercase block tracking-wider">Active Staff Allocation</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1E293B]">64% Avg</span>
            <span className="text-[10px] text-[#3CB371] font-bold flex items-center">
              Balanced
            </span>
          </div>
          <span className="text-[10px] text-[#64748B] block font-medium">No critical hotspots detected</span>
        </div>

        <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm space-y-1">
          <span className="text-[10px] text-[#64748B] font-bold uppercase block tracking-wider">Meeting Minutes Summarized</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1E293B]">2,400+</span>
            <span className="text-[10px] text-[#4F7CAC] font-bold">
              42 Meetings
            </span>
          </div>
          <span className="text-[10px] text-[#64748B] block font-medium">138 Action items generated</span>
        </div>

        <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm space-y-1">
          <span className="text-[10px] text-[#64748B] font-bold uppercase block tracking-wider">RAG Latency Threshold</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#23395B]">182ms</span>
            <span className="text-[10px] text-[#3CB371] font-bold">Excellent</span>
          </div>
          <span className="text-[10px] text-[#64748B] block font-medium">Embedding index responses cached</span>
        </div>
      </div>

      {/* Main Charts Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 1: Project Progress Index (Visible in ALL or WORKSPACE) */}
        {(activeSegment === 'all' || activeSegment === 'workspace') && (
          <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm flex flex-col h-[360px] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#4F7CAC]" />
                  <span>Project Completion Dynamics</span>
                </h3>
                <p className="text-[11px] text-[#64748B]">Completion progress vs total and finalized task metrics</p>
              </div>
              <span className="text-[10px] font-mono text-[#4F7CAC] font-bold bg-[#4F7CAC]/10 px-2 py-0.5 rounded-full">
                Real-time
              </span>
            </div>
            
            <div className="flex-1 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderColor: '#E5E7EB',
                      borderRadius: '8px',
                      color: '#1E293B',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }} 
                  />
                  <Legend verticalAlign="top" height={36} iconSize={8} iconType="circle" />
                  <Bar dataKey="Progress" name="Progress %" fill="#4F7CAC" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="Tasks" name="Total Tasks" fill="#23395B" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="Completed" name="Completed Tasks" fill="#3CB371" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 2: Department Workload (Visible in ALL or WORKSPACE) */}
        {(activeSegment === 'all' || activeSegment === 'workspace') && (
          <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm flex flex-col h-[360px] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#23395B]" />
                  <span>Departmental Allocation & Productivity</span>
                </h3>
                <p className="text-[11px] text-[#64748B]">Allocation percentage compared with relative operational efficiency</p>
              </div>
            </div>

            <div className="flex-1 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={workloadChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderColor: '#E5E7EB',
                      borderRadius: '8px',
                      color: '#1E293B',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }} 
                  />
                  <Legend verticalAlign="top" height={36} iconSize={8} iconType="circle" />
                  <defs>
                    <linearGradient id="colorWorkload" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F7CAC" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#4F7CAC" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3CB371" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#3CB371" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" name="Allocation %" dataKey="Workload" stroke="#4F7CAC" strokeWidth={2} fillOpacity={1} fill="url(#colorWorkload)" />
                  <Area type="monotone" name="Efficiency %" dataKey="Efficiency" stroke="#3CB371" strokeWidth={2} fillOpacity={1} fill="url(#colorEfficiency)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 3: Task Completion Rate (Visible in ALL or WORKSPACE) */}
        {(activeSegment === 'all' || activeSegment === 'workspace') && (
          <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm flex flex-col h-[360px] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#3CB371]" />
                  <span>Sprint Burnup Metric</span>
                </h3>
                <p className="text-[11px] text-[#64748B]">Accumulated completed tasks versus active scope across weeks</p>
              </div>
            </div>

            <div className="flex-1 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={taskCompletionTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="week" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderColor: '#E5E7EB',
                      borderRadius: '8px',
                      color: '#1E293B',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }} 
                  />
                  <Legend verticalAlign="top" height={36} iconSize={8} iconType="circle" />
                  <Line type="monotone" name="Completed Tasks" dataKey="Completed" stroke="#3CB371" strokeWidth={3} activeDot={{ r: 6 }} />
                  <Line type="monotone" name="Active Backlog" dataKey="Active" stroke="#23395B" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 4: Meeting Analytics (Visible in ALL or AI) */}
        {(activeSegment === 'all' || activeSegment === 'ai') && (
          <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm flex flex-col h-[360px] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#23395B]" />
                  <span>Meeting Intelligence Metrics</span>
                </h3>
                <p className="text-[11px] text-[#64748B]">Total transcription minutes analyzed, action items, and summaries</p>
              </div>
            </div>

            <div className="flex-1 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={meetingAnalytics} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderColor: '#E5E7EB',
                      borderRadius: '8px',
                      color: '#1E293B',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }} 
                  />
                  <Legend verticalAlign="top" height={36} iconSize={8} iconType="circle" />
                  <Bar dataKey="Minutes" name="Minutes Analyzed" fill="#4F7CAC" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="ActionItems" name="Action Items" fill="#E76F51" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Summaries" name="Auto Summaries" fill="#3CB371" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 5: Document Analytics (Chunks & Indexed Embeddings) (Visible in ALL or AI) */}
        {(activeSegment === 'all' || activeSegment === 'ai') && (
          <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm flex flex-col h-[360px] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#4F7CAC]" />
                  <span>Document FAISS Ingestion Logs</span>
                </h3>
                <p className="text-[11px] text-[#64748B]">Total segmented vector chunks generated by document category</p>
              </div>
            </div>

            <div className="flex-1 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={docAnalytics} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis type="number" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={9} tickLine={false} width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderColor: '#E5E7EB',
                      borderRadius: '8px',
                      color: '#1E293B',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }} 
                  />
                  <Legend verticalAlign="top" height={36} iconSize={8} iconType="circle" />
                  <Bar dataKey="Chunks" name="Vector Chunks" fill="#7FB7E8" radius={[0, 4, 4, 0]} barSize={14} />
                  <Bar dataKey="Documents" name="Indexed Files" fill="#23395B" radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 6: AI Assistant Request Distribution (Visible in ALL or AI) */}
        {(activeSegment === 'all' || activeSegment === 'ai') && (
          <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm flex flex-col h-[360px] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[#3CB371]" />
                  <span>AI Sub-model Call Distribution</span>
                </h3>
                <p className="text-[11px] text-[#64748B]">Relative usage volume across different workspace AI sub-systems</p>
              </div>
            </div>

            <div className="flex-grow flex items-center justify-center text-xs">
              <div className="w-1/2 h-full min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={aiUsageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {aiUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend details */}
              <div className="w-1/2 space-y-3 pl-4">
                {aiUsageData.map((d, idx) => (
                  <div key={d.name} className="flex items-start gap-2 text-left">
                    <div className="w-3 h-3 rounded-full mt-0.5" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <div>
                      <span className="font-semibold text-[#1E293B] block">{d.name}</span>
                      <span className="text-[10px] text-[#64748B]">{d.value}% of model query allocations</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
