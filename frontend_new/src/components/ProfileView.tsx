import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Briefcase, 
  MapPin, 
  ShieldCheck, 
  Edit, 
  Plus, 
  X, 
  Lock, 
  Activity, 
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdate: (profile: Partial<UserProfile>) => void;
}

export default function ProfileView({ profile, onUpdate }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [editName, setEditName] = useState(profile.name);
  const [editRole, setEditRole] = useState(profile.role);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editDept, setEditDept] = useState(profile.department);
  const [editExp, setEditExp] = useState(profile.experience);
  
  // New Skill tag state
  const [newSkill, setNewSkill] = useState('');
  
  // Password state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      name: editName,
      role: editRole,
      email: editEmail,
      department: editDept,
      experience: editExp
    });
    setIsEditing(false);
    alert('Corporate profile nodes updated successfully.');
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (profile.skills.includes(newSkill.trim())) return;
    
    onUpdate({
      skills: [...profile.skills, newSkill.trim()]
    });
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onUpdate({
      skills: profile.skills.filter(s => s !== skillToRemove)
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      alert('Please fill out all fields');
      return;
    }
    alert('Security credentials rotated. TLS secret keys flushed.');
    setOldPassword('');
    setNewPassword('');
    setIsPasswordModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none text-left pb-12 font-sans">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
        <span>Home</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-600 font-bold">My Profile</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">My Profile</h2>
          <p className="text-xs text-slate-500 font-medium">Manage your personal profile, credentials, and expertise.</p>
        </div>
      </div>

      {/* Top Profile Badge Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 md:p-8 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4F7CAC]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <img 
            src={profile.avatar} 
            alt={profile.name} 
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded-full border-2 border-[#4F7CAC]/20 shadow-sm shrink-0 object-cover bg-slate-100"
          />

          <div className="space-y-3 flex-1 text-center md:text-left">
            <div className="space-y-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h1 className="text-xl font-bold text-[#1E293B] tracking-tight">{profile.name}</h1>
                <span className="self-center md:self-start px-2.5 py-0.5 rounded-full bg-[#3CB371]/10 text-[#3CB371] border border-[#3CB371]/15 text-[9px] font-sans font-bold uppercase tracking-wider">
                  Active Security Clearance
                </span>
              </div>
              <p className="text-xs text-[#4F7CAC] font-bold font-mono uppercase tracking-wider">{profile.role} • {profile.department}</p>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed max-w-xl font-normal">
              {profile.experience}
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs text-[#64748B] justify-center md:justify-start font-medium">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#64748B]" />
                <span>{profile.email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Product Division</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Workloads & Skills */}
        <div className="space-y-6 md:col-span-1">
          {/* Workload Card */}
          <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white space-y-3 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#4F7CAC]">
              <Activity className="w-4 h-4" />
              <span className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">Resource Workload</span>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#64748B]">Current Allocation</span>
                <span className="text-[#1E293B] font-mono font-bold">{profile.currentWorkload}%</span>
              </div>
              
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#23395B] to-[#4F7CAC] rounded-full"
                  style={{ width: `${profile.currentWorkload}%` }}
                />
              </div>

              <span className="text-[10px] text-[#64748B] leading-normal block font-medium">
                Workloads over 85% block direct scheduling models.
              </span>
            </div>
          </div>

          {/* Skills Tag Editor */}
          <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#4F7CAC]">
                <Award className="w-4 h-4" />
                <span className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">Technical Skills</span>
              </div>
            </div>

            {/* Current Skills list */}
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map(s => (
                <span 
                  key={s} 
                  className="text-[9px] bg-[#4F7CAC]/10 border border-[#4F7CAC]/15 text-[#23395B] px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold"
                >
                  <span>{s}</span>
                  <button 
                    onClick={() => handleRemoveSkill(s)}
                    className="hover:text-[#E76F51] transition-colors cursor-pointer text-[10px]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill form */}
            <form onSubmit={handleAddSkill} className="flex gap-1.5 pt-2 border-t border-[#E5E7EB]">
              <input 
                type="text" 
                placeholder="Add skill (e.g. PyTorch)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 bg-white border border-[#E5E7EB] rounded-xl text-xs px-2.5 py-1.5 text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 transition-all placeholder-[#64748B]/50"
              />
              <button 
                type="submit"
                className="p-1.5 bg-[#23395B] hover:bg-[#1E293B] text-white rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Profile Edits & Change password */}
        <div className="space-y-6 md:col-span-2">
          
          <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-white space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-1.5">
                <Edit className="w-4.5 h-4.5 text-[#4F7CAC]" />
                <span className="text-xs font-bold text-[#1E293B]">Edit Employee Profile Details</span>
              </div>

              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F7F8FA] border border-[#E5E7EB] text-[10px] text-[#1E293B] font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  Edit Profile Fields
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[#1E293B] font-semibold">Full Name</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[#1E293B] font-semibold">Email Node</label>
                    <input 
                      type="email" 
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[#1E293B] font-semibold">Designated Role</label>
                    <input 
                      type="text" 
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#1E293B] font-semibold">Corporate Department</label>
                    <input 
                      type="text" 
                      value={editDept}
                      onChange={(e) => setEditDept(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#1E293B] font-semibold">Professional Tenure Biography</label>
                  <textarea 
                    rows={3}
                    value={editExp}
                    onChange={(e) => setEditExp(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 resize-none leading-relaxed transition-all"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(profile.name);
                      setEditRole(profile.role);
                      setEditEmail(profile.email);
                      setEditDept(profile.department);
                      setEditExp(profile.experience);
                    }}
                    className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#1E293B] hover:bg-[#F7F8FA] bg-white font-semibold cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#23395B] hover:bg-[#1E293B] text-white font-semibold cursor-pointer transition-all shadow-xs"
                  >
                    Confirm Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs text-[#1E293B]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[#64748B] font-bold block uppercase text-[9px] tracking-wider">Verify Name</span>
                    <span className="font-bold text-[#1E293B] text-sm block mt-0.5">{profile.name}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[#64748B] font-bold block uppercase text-[9px] tracking-wider">Communication Endpoint</span>
                    <span className="font-bold text-[#1E293B] text-sm block mt-0.5">{profile.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <span className="text-[#64748B] font-bold block uppercase text-[9px] tracking-wider">Access Level Roster</span>
                    <span className="font-bold text-[#1E293B] text-sm block mt-0.5">{profile.role}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[#64748B] font-bold block uppercase text-[9px] tracking-wider">Functional Business Unit</span>
                    <span className="font-bold text-[#1E293B] text-sm block mt-0.5">{profile.department}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Security Credentials Rotation Card */}
          <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3 text-left">
              <div className="p-2.5 bg-[#E76F51]/10 border border-[#E76F51]/15 rounded-xl text-[#E76F51] shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1E293B] block">Rotate Security Credentials</span>
                <span className="text-[11px] text-[#64748B] block mt-0.5 font-normal">Flush TLS sessions and rotate workspace credentials safely.</span>
              </div>
            </div>

            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#E76F51]/10 border border-[#E76F51]/25 text-[#E76F51] hover:bg-[#E76F51] hover:text-white transition-all text-xs font-bold cursor-pointer shrink-0"
            >
              Rotate Key
            </button>
          </div>

        </div>
      </div>

      {/* Password Rotation Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasswordModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
            />

            <motion.div 
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              className="relative w-full max-w-sm bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-2xl z-10 text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-4">
                <span className="text-sm font-bold text-[#1E293B]">Rotate Session Passwords</span>
                <button 
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="p-1.5 hover:bg-[#F7F8FA] rounded-lg text-[#64748B] hover:text-[#1E293B] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[#1E293B] font-semibold">Current Secure Password</label>
                  <input 
                    type="password" 
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#1E293B] font-semibold">New Secure Passphrase</label>
                  <input 
                    type="password" 
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl p-2.5 text-[#1E293B] focus:outline-none focus:border-[#4F7CAC] focus:ring-2 focus:ring-[#4F7CAC]/15 transition-all"
                  />
                </div>

                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-2.5">
                  <button 
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#1E293B] hover:bg-[#F7F8FA] bg-white transition-all cursor-pointer font-semibold"
                  >
                    Cancel
                  </button>
                  
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#E76F51] hover:bg-[#d95536] text-white font-bold cursor-pointer transition-all shadow-sm"
                  >
                    Rotate Passphrase
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
