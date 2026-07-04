import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, 
  Search, 
  Calendar, 
  FileSpreadsheet, 
  RefreshCw, 
  ShieldAlert, 
  UserCheck, 
  CheckCircle2, 
  Info,
  Clock
} from 'lucide-react';

interface AuditLogsViewProps {
  onAddNotification?: (title: string, desc: string, priority: any, category: any) => void;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  userAvatar: string;
  action: string;
  category: 'Login' | 'Task' | 'Project' | 'Document' | 'Meeting' | 'Security' | 'Settings';
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  clientIp: string;
}

export default function AuditLogsView({ onAddNotification }: AuditLogsViewProps) {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  // Initial Seed Logs database
  const [logs, setLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-1',
      timestamp: '2026-07-03 11:30:15',
      user: 'Marcus Vance',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      action: 'User signed in using company account',
      category: 'Login',
      status: 'SUCCESS',
      clientIp: '192.168.1.104'
    },
    {
      id: 'log-2',
      timestamp: '2026-07-03 10:45:22',
      user: 'Elena Rostova',
      userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
      action: 'Configured secure connections for servers',
      category: 'Security',
      status: 'SUCCESS',
      clientIp: '192.168.4.15'
    },
    {
      id: 'log-3',
      timestamp: '2026-07-03 09:12:08',
      user: 'Dr. Alex Rivera',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
      action: 'Completed task: "SYN-102 Deploy Athena Sentiment Engine API"',
      category: 'Task',
      status: 'SUCCESS',
      clientIp: '172.16.89.5'
    },
    {
      id: 'log-4',
      timestamp: '2026-07-02 16:22:40',
      user: 'Sarah Jenkins',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
      action: 'Uploaded: "Q3_Strategic_AI_Roadmap.pdf" (Size: 4.2 MB)',
      category: 'Document',
      status: 'SUCCESS',
      clientIp: '10.0.12.80'
    },
    {
      id: 'log-5',
      timestamp: '2026-07-02 14:15:00',
      user: 'Marcus Vance',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      action: 'Altered global workspace settings: Multi-Factor Authentication (MFA) enabled',
      category: 'Settings',
      status: 'SUCCESS',
      clientIp: '192.168.1.104'
    },
    {
      id: 'log-6',
      timestamp: '2026-07-02 11:00:15',
      user: 'Maya Chen',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
      action: 'Scheduled: "Q3 Project Athena Launch Alignment Meeting"',
      category: 'Meeting',
      status: 'SUCCESS',
      clientIp: '192.168.9.12'
    },
    {
      id: 'log-7',
      timestamp: '2026-07-01 18:44:02',
      user: 'System Bot',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      action: 'Vulnerability scan detected 1 outdated kubernetes sub-dependency (Resolved)',
      category: 'Security',
      status: 'WARNING',
      clientIp: '127.0.0.1'
    }
  ]);

  const handleExport = () => {
    alert('Exporting verified workspace ledger files to secure corporate CSV target folder...');
    if (onAddNotification) {
      onAddNotification(
        'Audit Ledger Exported',
        'System audit trail exported to local client downloads register.',
        'Low',
        'System'
      );
    }
  };

  const filteredLogs = logs.filter(l => {
    const categoryPass = filterCategory === 'ALL' || l.category.toUpperCase() === filterCategory;
    const searchPass = searchQueryMatch(l, search);
    return categoryPass && searchPass;
  });

  function searchQueryMatch(log: AuditLogEntry, q: string) {
    if (!q) return true;
    const lq = q.toLowerCase();
    return log.user.toLowerCase().includes(lq) || 
           log.action.toLowerCase().includes(lq) || 
           log.category.toLowerCase().includes(lq);
  }

  const categories = ['ALL', 'LOGIN', 'TASK', 'PROJECT', 'DOCUMENT', 'MEETING', 'SECURITY', 'SETTINGS'];

  return (
    <div className="space-y-5 max-w-7xl mx-auto font-sans text-left">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1E293B] tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-600" /> Activity Log & Security History
          </h2>
          <p className="text-xs text-[#64748B]">A secure, detailed history of logins, tasks, documents, and system changes.</p>
        </div>

        <button 
          onClick={handleExport}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-indigo-600/10"
        >
          <FileSpreadsheet className="w-4 h-4" /> Export Activity Log
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
        {/* Category togglers */}
        <div className="flex flex-wrap gap-1.5 max-w-2xl select-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer border ${
                filterCategory === cat 
                  ? 'bg-indigo-600 text-white border-indigo-600 font-black' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 w-full md:w-64 transition-all">
          <Search className="w-4 h-4 text-[#64748B] shrink-0" />
          <input 
            type="text" 
            placeholder="Fuzzy search audit logs..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-[#1E293B] placeholder-[#64748B]/60 focus:outline-none w-full font-medium"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 select-none">
              <tr>
                <th className="px-5 py-3">Timestamp / Client IP</th>
                <th className="px-5 py-3">User Node</th>
                <th className="px-5 py-3">Action Description</th>
                <th className="px-5 py-3">Vector Node</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 font-medium select-none">
                    No matching ledger items found in database buffer.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(l => {
                  const statusColor = l.status === 'SUCCESS' 
                    ? 'text-emerald-500 bg-emerald-50 border-emerald-100' 
                    : l.status === 'WARNING' 
                      ? 'text-amber-500 bg-amber-50 border-amber-100' 
                      : 'text-rose-500 bg-rose-50 border-rose-100';

                  return (
                    <tr key={l.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-5 py-3.5 text-left whitespace-nowrap">
                        <span className="font-bold text-slate-800 block flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {l.timestamp}
                        </span>
                        <span className="text-[10px] text-indigo-500 font-mono font-bold mt-1 block">
                          {l.clientIp}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 text-left">
                          <img src={l.userAvatar} alt={l.user} referrerPolicy="no-referrer" className="w-6 h-6 rounded-full border border-slate-200 object-cover shrink-0" />
                          <span className="font-bold text-slate-800">{l.user}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 max-w-sm text-slate-600 leading-relaxed text-left font-normal">
                        {l.action}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wide">
                          {l.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] border font-sans font-black ${statusColor}`}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
