import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Building2, 
  ShieldAlert, 
  Terminal, 
  Cpu, 
  Database, 
  Compass, 
  Lock, 
  Fingerprint, 
  HardDrive, 
  ToggleLeft, 
  CheckCircle, 
  UserCheck, 
  Search, 
  Settings,
  Activity,
  Heart
} from 'lucide-react';
import { TeamMember, UserProfile } from '../types';

interface AdminPanelProps {
  team: TeamMember[];
  currentRole: string;
  onSetRole: (role: string) => void;
  onAddNotification?: (title: string, desc: string, priority: any, category: any) => void;
}

interface ActiveSession {
  id: string;
  userName: string;
  email: string;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
}

export default function AdminPanel({
  team,
  currentRole,
  onSetRole,
  onAddNotification
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'system' | 'security'>('users');
  const [userSearch, setUserSearch] = useState('');
  
  // Simulated System Telemetry Metrics
  const systemMetrics = {
    cpuUsage: 12.4,
    ramUsage: 4.8, // GB
    dbConnections: 14,
    latencyMs: 18,
    activeNodes: 4,
    storageUsed: 62.1, // %
    storageGb: 485,
    aiRequestsCompleted: 45802
  };

  // Mock Active Session metrics
  const activeSessions: ActiveSession[] = [
    { id: 's1', userName: 'Marcus Vance', email: 'm.vance@synapse.ai', device: 'MacBook Pro • Safari 19', location: 'San Jose, CA', ip: '192.168.1.104', lastActive: 'Active Now' },
    { id: 's2', userName: 'Sarah Jenkins', email: 's.jenkins@synapse.ai', device: 'Linux Workstation • Chrome', location: 'Seattle, WA', ip: '10.0.4.15', lastActive: '2 min ago' },
    { id: 's3', userName: 'Dr. Alex Rivera', email: 'a.rivera@synapse.ai', device: 'iPad Pro • Chrome iOS', location: 'Miami, FL', ip: '172.16.54.9', lastActive: '12 min ago' }
  ];

  // Role details
  const ROLES = ['Super Admin', 'Admin', 'Manager', 'Employee', 'Guest'];

  const filteredTeam = team.filter(m => 
    m.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    m.role.toLowerCase().includes(userSearch.toLowerCase()) ||
    m.department.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleRoleSwap = (role: string) => {
    onSetRole(role);
    if (onAddNotification) {
      onAddNotification(
        'RBAC Privilege Level Shift',
        `Current session authority shifted successfully to "${role}". Menu layouts and views adjusted.`,
        'High',
        'System'
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto select-none pb-12 font-sans text-left">
      
      {/* Sidebar Controls inside panel */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-xs font-bold uppercase tracking-wider">Admin Console</h3>
        </div>

        {/* View Switchers */}
        <div className="flex flex-col gap-1 rounded-2xl bg-white border border-slate-200 p-2 shadow-sm text-xs font-bold text-slate-600">
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-colors ${
              activeTab === 'users' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" /> User & Role Management
          </button>
          
          <button 
            onClick={() => setActiveTab('system')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-colors ${
              activeTab === 'system' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50'
            }`}
          >
            <Cpu className="w-4 h-4" /> System Health & Activity
          </button>

          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-colors ${
              activeTab === 'security' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50'
            }`}
          >
            <Fingerprint className="w-4 h-4" /> Security Logs & MFA
          </button>
        </div>

        {/* Dynamic Simulator Control: Instantly Swap Simulated Roles */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-[#0F172A] p-4.5 space-y-3.5 text-slate-300 shadow-xl">
          <div className="flex items-center gap-2 text-white border-b border-slate-800 pb-2">
            <UserCheck className="w-4.5 h-4.5 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wide text-indigo-400">User Role Switcher</span>
          </div>
          
          <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
            Swap user roles to test how permissions and features change for different employees.
          </p>

          <div className="space-y-1">
            {ROLES.map(role => {
              const isActive = currentRole === role;
              return (
                <button
                  key={role}
                  onClick={() => handleRoleSwap(role)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-all cursor-pointer flex items-center justify-between ${
                    isActive 
                      ? 'bg-indigo-600 text-white' 
                      : 'hover:bg-slate-800/60 text-slate-400'
                  }`}
                >
                  <span>{role}</span>
                  {isActive && (
                    <CheckCircle className="w-3.5 h-3.5 text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Admin Data Area */}
      <div className="lg:col-span-3 space-y-5">
        
        {/* VIEW 1: User & Role management */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none">Employee List</h2>
                <p className="text-xs text-slate-400 mt-1">Manage team members, roles, and departments.</p>
              </div>

              {/* Fuzzy search roster */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 w-60">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Filter users or skills..." 
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full"
                />
              </div>
            </div>

            {/* User List Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-600">
                  <thead className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 select-none">
                    <tr>
                      <th className="px-5 py-3">Member</th>
                      <th className="px-5 py-3">Department</th>
                      <th className="px-5 py-3">Privileges</th>
                      <th className="px-5 py-3 text-right">Workload</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredTeam.map(m => (
                      <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5 flex items-center gap-3">
                          <img src={m.avatar} alt={m.name} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0" />
                          <div className="flex flex-col text-left">
                            <span className="font-bold text-slate-800">{m.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{m.role}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold uppercase text-[9px]">
                            {m.department}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 px-2.5 py-0.5 rounded-full font-bold text-[9px]">
                            {m.id === 'm1' || m.id === 'm5' ? 'Admin' : m.id === 'm4' ? 'Super Admin' : 'Employee'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono font-bold">
                          <span className={m.currentWorkload >= 80 ? 'text-rose-500' : 'text-slate-600'}>
                            {m.currentWorkload}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: System Telemetry */}
        {activeTab === 'system' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none">System Health & Activity Check</h2>
              <p className="text-xs text-slate-400 mt-1">Real-time stats showing how our server is performing.</p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm text-left flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block select-none">Response Speed</span>
                  <span className="text-xl font-black text-slate-800 font-mono leading-none">{systemMetrics.latencyMs} ms</span>
                  <span className="text-[9px] text-emerald-500 font-bold block mt-1">Stable</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm text-left flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block select-none">Active Connections</span>
                  <span className="text-xl font-black text-slate-800 font-mono leading-none">{systemMetrics.dbConnections}</span>
                  <span className="text-[9px] text-indigo-500 font-bold block mt-1">Database Connected</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm text-left flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-xl text-purple-600 shrink-0">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block select-none">AI Document Storage</span>
                  <span className="text-xl font-black text-slate-800 font-mono leading-none">{systemMetrics.storageUsed}%</span>
                  <span className="text-[9px] text-purple-500 font-bold block mt-1">Healthy</span>
                </div>
              </div>
            </div>

            {/* Docker container system diagnostics logs */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-4 text-slate-300 font-mono text-[10px] shadow-lg text-left">
              <span className="text-indigo-400 font-bold block border-b border-slate-800 pb-2 mb-2 select-none">System Activity Logs</span>
              <div className="space-y-1.5 overflow-y-auto max-h-48 pr-1">
                <p><span className="text-slate-500">2026-07-03 11:32:04</span> [SYSTEM] Server is up and running on port 3000</p>
                <p><span className="text-slate-500">2026-07-03 11:32:05</span> [DATABASE] Connected to database successfully</p>
                <p><span className="text-slate-500">2026-07-03 11:32:09</span> [AI] AI models loaded and ready to help</p>
                <p><span className="text-slate-500">2026-07-03 11:35:12</span> [SECURITY] Secure connection established with user</p>
                <p className="text-emerald-400"><span className="text-slate-500">2026-07-03 11:46:14</span> [HEALTH] Regular health check completed. All systems running smoothly.</p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: Security & Session tracking */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none">Security Center & Active sessions</h2>
              <p className="text-xs text-slate-400 mt-1">Track active TLS sessions, verify multi-factor configurations, and clear stale login logs.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-600">
                  <thead className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase border-b border-slate-200 select-none">
                    <tr>
                      <th className="px-5 py-3">Secure Host Session</th>
                      <th className="px-5 py-3">Client Endpoint IP</th>
                      <th className="px-5 py-3">Host Device Specs</th>
                      <th className="px-5 py-3 text-right">Activity Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {activeSessions.map(sess => (
                      <tr key={sess.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5 text-left">
                          <span className="font-bold text-slate-800 block">{sess.userName}</span>
                          <span className="text-[10px] text-slate-400 block">{sess.email}</span>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-[10px] font-bold text-indigo-600">
                          {sess.ip}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">
                          {sess.device}
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-emerald-500">
                          {sess.lastActive}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
