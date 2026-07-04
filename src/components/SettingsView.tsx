import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2,
  Eye, 
  Bell, 
  Cpu, 
  Globe, 
  Lock, 
  Sliders, 
  ChevronRight,
  Info,
  Trash2,
  Key,
  Download,
  Upload,
  Laptop,
  Smartphone,
  MapPin,
  AlertCircle,
  Sparkles,
  Palette,
  ChevronDown,
  LockKeyhole,
  Activity,
  LogOut,
  Settings,
  RefreshCw,
  Clock,
  EyeOff
} from 'lucide-react';
import { UserSettings } from '../types';
import ToggleSwitch from './ToggleSwitch';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

// Custom hook to automatically persist extra settings in localStorage
function usePersistedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(`synapse_opt_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(`synapse_opt_${key}`, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default function SettingsView({ settings, onUpdateSettings }: SettingsViewProps) {
  // Mobile detector
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Category tracking
  const [activeTab, setActiveTab] = useState<'appearance' | 'workspace' | 'ai' | 'notifications' | 'security' | 'language' | 'advanced'>('appearance');
  // Expanded accordions for mobile view
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>('appearance');

  // Helper to toggle accordion
  const handleAccordionClick = (id: string) => {
    setExpandedAccordion(expandedAccordion === id ? null : id);
  };

  // --- STATE FOR DETAILED SETTINGS ---

  // 🎨 Appearance
  const [themeColor, setThemeColor] = usePersistedState<string>('themeColor', 'Classic Blue');
  const [compactMode, setCompactMode] = usePersistedState<boolean>('compactMode', false);
  const [reduceAnimations, setReduceAnimations] = usePersistedState<boolean>('reduceAnimations', false);
  const [fontSize, setFontSize] = usePersistedState<'Small' | 'Medium' | 'Large'>('fontSize', 'Medium');

  // 🏢 Workspace
  const [workspaceName, setWorkspaceName] = usePersistedState<string>('workspaceName', 'SynapseAI Global');
  const [autoSave, setAutoSave] = usePersistedState<boolean>('autoSave', true);
  const [defaultDashboard, setDefaultDashboard] = usePersistedState<string>('defaultDashboard', 'Core Dashboard');

  // 🤖 AI Preferences
  const [enableSuggestions, setEnableSuggestions] = usePersistedState<boolean>('enableSuggestions', true);
  const [enableSmartRecs, setEnableSmartRecs] = usePersistedState<boolean>('enableSmartRecs', true);
  const [aiAutoSummary, setAiAutoSummary] = usePersistedState<boolean>('aiAutoSummary', true);
  const [meetingIntel, setMeetingIntel] = usePersistedState<boolean>('meetingIntel', true);
  const [docAnalysis, setDocAnalysis] = usePersistedState<boolean>('docAnalysis', true);

  // 🔔 Notifications
  const [desktopNotif, setDesktopNotif] = usePersistedState<boolean>('desktopNotif', true);
  const [taskReminders, setTaskReminders] = usePersistedState<boolean>('taskReminders', true);
  const [meetingReminders, setMeetingReminders] = usePersistedState<boolean>('meetingReminders', true);
  const [aiAlerts, setAiAlerts] = usePersistedState<boolean>('aiAlerts', false);
  const [projectUpdates, setProjectUpdates] = usePersistedState<boolean>('projectUpdates', true);

  // 🔒 Security
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordUpdatedMessage, setPasswordUpdatedMessage] = useState('');
  
  const [sessions, setSessions] = useState([
    { id: '1', device: 'MacBook Pro 16"', browser: 'Google Chrome (macOS)', ip: '192.168.1.104', location: 'San Francisco, CA', active: true },
    { id: '2', device: 'iPhone 15 Pro', browser: 'Safari Mobile', ip: '172.56.21.90', location: 'San Francisco, CA', active: false },
    { id: '3', device: 'Linux Workstation', browser: 'Firefox Developer Edition', ip: '10.0.4.5', location: 'Cloud Compute Instance', active: false }
  ]);
  const [loginHistory, setLoginHistory] = useState([
    { id: '101', date: '2026-07-03 07:12:45', action: 'Successful MFA login', ip: '192.168.1.104' },
    { id: '102', date: '2026-07-02 18:30:12', action: 'Session token refreshed', ip: '192.168.1.104' },
    { id: '103', date: '2026-07-01 09:15:22', action: 'Authorized new device API client', ip: '172.56.21.90' }
  ]);
  const [dataSharing, setDataSharing] = usePersistedState<boolean>('dataSharing', true);
  const [telemetry, setTelemetry] = usePersistedState<boolean>('telemetry', false);

  // 🌐 Language & Region
  const [region, setRegion] = usePersistedState<string>('region', 'United States');
  const [timezone, setTimezone] = usePersistedState<string>('timezone', 'America/Los_Angeles (PST) (UTC-8)');
  const [dateFormat, setDateFormat] = usePersistedState<string>('dateFormat', 'YYYY-MM-DD');

  // ⚙️ Advanced
  const [devMode, setDevMode] = usePersistedState<boolean>('devMode', false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyVal, setApiKeyVal] = useState('sk_synapse_916016535370_aistudio_live_v1');

  // Preset choices
  const languages: UserSettings['language'][] = ['English', 'Spanish', 'German', 'French', 'Japanese'];
  const creativities: UserSettings['aiCreativity'][] = ['Precise', 'Balanced', 'Creative'];
  const colorThemes = ['Classic Blue', 'Emerald Green', 'Violet Spark', 'Solar Orange'];
  const fontSizes = ['Small', 'Medium', 'Large'];
  const regions = ['United States', 'Europe (UK)', 'Europe (Germany)', 'Asia Pacific (Japan)', 'Americas (Brazil)'];
  const timezones = [
    'America/Los_Angeles (PST) (UTC-8)',
    'America/New_York (EST) (UTC-5)',
    'Europe/London (GMT) (UTC+0)',
    'Europe/Berlin (CET) (UTC+1)',
    'Asia/Tokyo (JST) (UTC+9)'
  ];
  const dateFormats = ['YYYY-MM-DD', 'MM/DD/YYYY', 'DD-MM-YYYY'];
  const dashboards = ['Core Dashboard', 'Meeting Intelligence', 'Analytics Portal', 'AI Chat Arena'];

  const handleUpdate = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    onUpdateSettings({ [key]: value });
  };

  const handlePasswordResetAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordCurrent || !passwordNew || !passwordConfirm) {
      alert('Please fill out all password fields.');
      return;
    }
    if (passwordNew !== passwordConfirm) {
      alert('New password and password confirmation do not match.');
      return;
    }
    setPasswordUpdatedMessage('Password updated successfully. Session re-verified.');
    setPasswordCurrent('');
    setPasswordNew('');
    setPasswordConfirm('');
    setTimeout(() => setPasswordUpdatedMessage(''), 5000);
  };

  const revokeSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to restore all custom and factory settings to enterprise defaults?')) {
      onUpdateSettings({
        darkMode: true,
        language: 'English',
        notificationsEnabled: true,
        emailDigest: true,
        securityMfa: true,
        aiCreativity: 'Balanced',
        aiMaxTokens: 2048
      });
      setThemeColor('Classic Blue');
      setCompactMode(false);
      setReduceAnimations(false);
      setFontSize('Medium');
      setWorkspaceName('SynapseAI Global');
      setAutoSave(true);
      setDefaultDashboard('Core Dashboard');
      setEnableSuggestions(true);
      setEnableSmartRecs(true);
      setAiAutoSummary(true);
      setMeetingIntel(true);
      setDocAnalysis(true);
      setDesktopNotif(true);
      setTaskReminders(true);
      setMeetingReminders(true);
      setAiAlerts(false);
      setProjectUpdates(true);
      setDataSharing(true);
      setTelemetry(false);
      setRegion('United States');
      setTimezone('America/Los_Angeles (PST) (UTC-8)');
      setDateFormat('YYYY-MM-DD');
      setDevMode(false);
      alert('All settings and interface behaviors have been reset to factory defaults.');
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      settings,
      preferences: {
        themeColor, compactMode, reduceAnimations, fontSize, workspaceName, autoSave, defaultDashboard,
        enableSuggestions, enableSmartRecs, aiAutoSummary, meetingIntel, docAnalysis, desktopNotif,
        taskReminders, meetingReminders, aiAlerts, projectUpdates, dataSharing, telemetry, region,
        timezone, dateFormat, devMode
      }
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `synapse_enterprise_config_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportSettingsMock = () => {
    alert('Import engine verified. Choose a valid synapse workspace profile JSON backup to overwrite policies.');
  };

  const handleClearCache = () => {
    if (window.confirm('Clear all local workspace cache? This will reset your local states and refresh the application.')) {
      localStorage.clear();
      alert('Workspace cache wiped successfully. Re-syncing active core session...');
      window.location.reload();
    }
  };

  // Nav categories definition
  const categories = [
    { id: 'appearance', label: 'Appearance', icon: Eye, color: 'text-indigo-500' },
    { id: 'workspace', label: 'Workspace', icon: Building2, color: 'text-blue-500' },
    { id: 'ai', label: 'AI Preferences', icon: Cpu, color: 'text-emerald-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-amber-500' },
    { id: 'security', label: 'Security', icon: Lock, color: 'text-rose-500' },
    { id: 'language', label: 'Language & Region', icon: Globe, color: 'text-teal-500' },
    { id: 'advanced', label: 'Advanced', icon: Sliders, color: 'text-orange-500' }
  ];

  // Render components dynamically based on category ID
  const renderCategoryContent = (categoryId: string) => {
    switch (categoryId) {
      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-500" />
                <span>Visual Configuration & Themes</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Control layout styles, color values, and canvas mode.</p>
            </div>

            <div className="space-y-4">
              {/* Dark Canvas Theme */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5 flex-1 pr-4 text-xs text-left">
                  <span className="font-bold text-slate-800 dark:text-white block">Dark Canvas Theme</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Toggle the dark display scheme immediately across all sidebars, boards, and chats.</span>
                </div>
                <ToggleSwitch 
                  checked={settings.darkMode}
                  onChange={(val) => handleUpdate('darkMode', val)}
                />
              </div>

              {/* Theme Color selector (future support) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs text-left">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-white block">Theme Accent Color</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Choose color scheme highlights (classic blue or brand styles).</span>
                </div>
                <select 
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs font-bold focus:outline-none focus:border-[#4F7DFF] transition-all cursor-pointer min-w-[140px]"
                >
                  {colorThemes.map(theme => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>
              </div>

              {/* Compact Mode Switch */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5 flex-1 pr-4 text-xs text-left">
                  <span className="font-bold text-slate-800 dark:text-white block">Compact Mode</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Reduces spacing, header margins, and table density to fit more info.</span>
                </div>
                <ToggleSwitch 
                  checked={compactMode}
                  onChange={setCompactMode}
                />
              </div>

              {/* Reduce Animations */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5 flex-1 pr-4 text-xs text-left">
                  <span className="font-bold text-slate-800 dark:text-white block">Reduce System Animations</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Suppresses smooth panel sliding and complex transitions for fast rendering.</span>
                </div>
                <ToggleSwitch 
                  checked={reduceAnimations}
                  onChange={setReduceAnimations}
                />
              </div>

              {/* Font Size Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs text-left">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-white block">Base Font Sizing</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Adjust standard reading bounds for logs, tasks, and notes.</span>
                </div>
                <select 
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value as any)}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs font-bold focus:outline-none focus:border-[#4F7DFF] transition-all cursor-pointer min-w-[140px]"
                >
                  {fontSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 'workspace':
        return (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span>Workspace Information & Standards</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Set corporate naming, automated saves, and defaults.</p>
            </div>

            <div className="space-y-4">
              {/* Workspace Name Input */}
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs text-left space-y-2">
                <label className="font-bold text-slate-800 dark:text-white block">Workspace Name</label>
                <input 
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Workspace Name"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs font-bold focus:outline-none focus:border-[#4F7DFF] transition-all"
                />
              </div>

              {/* Auto Save Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5 flex-1 pr-4 text-xs text-left">
                  <span className="font-bold text-slate-800 dark:text-white block">Automated Document Auto Save</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Instantly saves draft edits and notes changes to secure workspace files.</span>
                </div>
                <ToggleSwitch 
                  checked={autoSave}
                  onChange={setAutoSave}
                />
              </div>

              {/* Default Landing Dashboard Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs text-left">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-white block">Default Landing Dashboard</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Select default system workspace view displayed upon loading active sessions.</span>
                </div>
                <select 
                  value={defaultDashboard}
                  onChange={(e) => setDefaultDashboard(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs font-bold focus:outline-none focus:border-[#4F7DFF] transition-all cursor-pointer min-w-[160px]"
                >
                  {dashboards.map(db => (
                    <option key={db} value={db}>{db}</option>
                  ))}
                </select>
              </div>

              {/* Workspace details card */}
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] border-b border-slate-100/80 dark:border-slate-800/80 pb-2">
                  <span className="text-slate-400 font-bold">Workspace ID</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">ws_9160_synapse_ae8f</span>
                </div>
                <div className="flex items-center justify-between text-[11px] border-b border-slate-100/80 dark:border-slate-800/80 pb-2">
                  <span className="text-slate-400 font-bold">Billing Cluster</span>
                  <span className="font-mono text-[#4F7DFF] font-bold">Synapse Pro Enterprise</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-bold">Connected Nodes</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">3 Gateways Active</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <span>AI Preferences & Intelligent Agents</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Optimize machine learning parameters and agent suggestions.</p>
            </div>

            <div className="space-y-4">
              {/* Enable AI Suggestions Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5 flex-1 pr-4 text-xs text-left">
                  <span className="font-bold text-slate-800 dark:text-white block">Enable Real-Time AI Suggestions</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Provides real-time auto-completion prompts inside team discussion threads.</span>
                </div>
                <ToggleSwitch 
                  checked={enableSuggestions}
                  onChange={setEnableSuggestions}
                />
              </div>

              {/* Enable Smart Recommendations */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5 flex-1 pr-4 text-xs text-left">
                  <span className="font-bold text-slate-800 dark:text-white block">Enable Smart Recommendations</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Suggests optimal project members for tasks based on workload analytics.</span>
                </div>
                <ToggleSwitch 
                  checked={enableSmartRecs}
                  onChange={setEnableSmartRecs}
                />
              </div>

              {/* AI Response Style Selection */}
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs text-left space-y-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-white block">AI Generative Style (Model Temperature)</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Control token variance. Creative allows speculative answers; Precise enforces deterministic compliance.</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {creativities.map((style) => {
                    const isSelected = settings.aiCreativity === style;
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => handleUpdate('aiCreativity', style)}
                        className={`py-2 rounded-xl border font-bold text-xs text-center transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#4F7DFF] border-[#4F7DFF] text-white shadow-md shadow-blue-500/10' 
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slider for Maximum token bound */}
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3 text-xs text-left">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 dark:text-white block">Maximum Response Tokens</span>
                    <span className="text-[10px] text-slate-400 block font-medium">Binds the ceiling of content chunk lengths on generative results.</span>
                  </div>
                  <span className="font-mono text-[#4F7DFF] font-bold text-xs shrink-0">{settings.aiMaxTokens} tokens</span>
                </div>

                <input 
                  type="range" 
                  min={1024}
                  max={4096}
                  step={512}
                  value={settings.aiMaxTokens}
                  onChange={(e) => handleUpdate('aiMaxTokens', Number(e.target.value))}
                  className="w-full accent-[#4F7DFF] cursor-pointer mt-1"
                />
              </div>

              {/* AI Auto Summary Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5 flex-1 pr-4 text-xs text-left">
                  <span className="font-bold text-slate-800 dark:text-white block">Auto Generative Project Summaries</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Allows models to automatically evaluate progress vectors and write dashboard briefs.</span>
                </div>
                <ToggleSwitch 
                  checked={aiAutoSummary}
                  onChange={setAiAutoSummary}
                />
              </div>

              {/* Meeting Intelligence Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5 flex-1 pr-4 text-xs text-left">
                  <span className="font-bold text-slate-800 dark:text-white block">Meeting Intelligence Agent</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Generates transcripts, actionable milestones, and followups from audio streams.</span>
                </div>
                <ToggleSwitch 
                  checked={meetingIntel}
                  onChange={setMeetingIntel}
                />
              </div>

              {/* Document Analysis Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5 flex-1 pr-4 text-xs text-left">
                  <span className="font-bold text-slate-800 dark:text-white block">Document Analysis & Embeddings</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Enables immediate multi-format indexing on uploaded corporate file attachments.</span>
                </div>
                <ToggleSwitch 
                  checked={docAnalysis}
                  onChange={setDocAnalysis}
                />
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Notification Settings & Channels</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Configure system-wide dispatch routes and summary alerts.</p>
            </div>

            <div className="space-y-4">
              {/* Real-time Notifications */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5 flex-1 pr-4 text-xs text-left">
                  <span className="font-bold text-slate-800 dark:text-white block">Real-Time In-App Alerts</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Triggers instant visual badges inside the top system header for team updates.</span>
                </div>
                <ToggleSwitch 
                  checked={settings.notificationsEnabled}
                  onChange={(val) => handleUpdate('notificationsEnabled', val)}
                />
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5 flex-1 pr-4 text-xs text-left">
                  <span className="font-bold text-slate-800 dark:text-white block">Weekly Summary Email digest</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Enables email dispatch summarization of completed boards and assigned milestones.</span>
                </div>
                <ToggleSwitch 
                  checked={settings.emailDigest}
                  onChange={(val) => handleUpdate('emailDigest', val)}
                />
              </div>

              {/* Desktop Notifications */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5 flex-1 pr-4 text-xs text-left">
                  <span className="font-bold text-slate-800 dark:text-white block">Browser Native Desktop Banners</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Request browser prompt permissions to trigger system background popups.</span>
                </div>
                <ToggleSwitch 
                  checked={desktopNotif}
                  onChange={setDesktopNotif}
                />
              </div>

              {/* Task Reminders */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5 flex-1 pr-4 text-xs text-left">
                  <span className="font-bold text-slate-800 dark:text-white block">Task & Backlog Reminders</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Receive notification triggers 24 hours prior to active task due dates.</span>
                </div>
                <ToggleSwitch 
                  checked={taskReminders}
                  onChange={setTaskReminders}
                />
              </div>

              {/* Meeting Reminders */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5 flex-1 pr-4 text-xs text-left">
                  <span className="font-bold text-slate-800 dark:text-white block">Meeting Schedule Alerts</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Alerts before meeting streams begin inside scheduled channels.</span>
                </div>
                <ToggleSwitch 
                  checked={meetingReminders}
                  onChange={setMeetingReminders}
                />
              </div>

              {/* AI Alerts */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5 flex-1 pr-4 text-xs text-left">
                  <span className="font-bold text-slate-800 dark:text-white block">AI Insight Notifications</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Alerts on newly indexed smart recommendations or automated audit summary generation.</span>
                </div>
                <ToggleSwitch 
                  checked={aiAlerts}
                  onChange={setAiAlerts}
                />
              </div>

              {/* Project Updates */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5 flex-1 pr-4 text-xs text-left">
                  <span className="font-bold text-slate-800 dark:text-white block">Project Roadmap Status Updates</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Trigger alerts immediately when a tracked milestone is completed, review pending, or blocked.</span>
                </div>
                <ToggleSwitch 
                  checked={projectUpdates}
                  onChange={setProjectUpdates}
                />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-500" />
                <span>Security Policies & Identity</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Review active session sessions, cryptographic settings, and authentication keys.</p>
            </div>

            <div className="space-y-6">
              {/* Password Change Form */}
              <form onSubmit={handlePasswordResetAction} className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-4 text-xs text-left">
                <h4 className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                  <LockKeyhole className="w-4 h-4 text-rose-400" />
                  <span>Update Account Password</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Current Password</label>
                    <input 
                      type="password"
                      value={passwordCurrent}
                      onChange={(e) => setPasswordCurrent(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">New Password</label>
                    <input 
                      type="password"
                      value={passwordNew}
                      onChange={(e) => setPasswordNew(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Confirm Password</label>
                    <input 
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {passwordUpdatedMessage && (
                  <p className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">{passwordUpdatedMessage}</p>
                )}

                <div className="flex justify-end pt-1">
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-[11px] rounded-xl transition-all cursor-pointer border border-transparent"
                  >
                    Commit Password Change
                  </button>
                </div>
              </form>

              {/* Two-Factor Authentication Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5 flex-1 pr-4 text-xs text-left">
                  <span className="font-bold text-slate-800 dark:text-white block">Two-Factor Hardware Token Verification (2FA)</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Verify login requests via physical hardware tokens or trusted authenticator app codes.</span>
                </div>
                <ToggleSwitch 
                  checked={settings.securityMfa}
                  onChange={(val) => handleUpdate('securityMfa', val)}
                />
              </div>

              {/* Session Management Card */}
              <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-4 text-xs text-left">
                <h4 className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                  <Activity className="w-4 h-4 text-rose-400" />
                  <span>Session Management & Active Devices</span>
                </h4>

                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-950/20">
                      <div className="flex items-center gap-3">
                        {session.device.includes('iPhone') ? (
                          <Smartphone className="w-5 h-5 text-slate-400 shrink-0" />
                        ) : (
                          <Laptop className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 dark:text-white">{session.device}</span>
                            {session.active && (
                              <span className="text-[9px] font-extrabold bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-md uppercase tracking-wider">Current</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium flex items-center gap-2">
                            <span>{session.browser}</span>
                            <span>•</span>
                            <span className="font-mono">{session.ip}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{session.location}</span>
                          </p>
                        </div>
                      </div>

                      {!session.active && (
                        <button 
                          onClick={() => revokeSession(session.id)}
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 font-bold text-[10px] rounded-lg transition-all cursor-pointer border border-rose-500/20"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Login History */}
              <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-4 text-xs text-left">
                <h4 className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Audit Logs & Login History</span>
                </h4>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loginHistory.map((log) => (
                    <div key={log.id} className="py-2.5 flex items-center justify-between text-[11px]">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{log.action}</span>
                        <p className="text-[10px] text-slate-400 font-medium font-mono">{log.ip}</p>
                      </div>
                      <span className="text-slate-400 font-mono font-medium">{log.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Controls */}
              <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-4 text-xs text-left">
                <h4 className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                  <Info className="w-4 h-4 text-teal-400" />
                  <span>Workspace Privacy Controls</span>
                </h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 dark:text-white">Anonymized Document Data Sharing</span>
                      <p className="text-[10px] text-slate-400">Share indexed file summaries securely to optimize corporate pipeline embeddings.</p>
                    </div>
                    <ToggleSwitch 
                      checked={dataSharing}
                      onChange={setDataSharing}
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 dark:text-white">Diagnostic & Telemetry Console Logs</span>
                      <p className="text-[10px] text-slate-400">Permits background reporting of system telemetry and indexing durations.</p>
                    </div>
                    <ToggleSwitch 
                      checked={telemetry}
                      onChange={setTelemetry}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-500" />
                <span>Language & Regional Settings</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Control translation vectors, local zones, and formats.</p>
            </div>

            <div className="space-y-4 text-xs text-left">
              {/* Language Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-white block">Default Workspace Language</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Re-renders labels, dates, and chats based on local files.</span>
                </div>
                <select 
                  value={settings.language}
                  onChange={(e) => handleUpdate('language', e.target.value as UserSettings['language'])}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs font-bold focus:outline-none focus:border-[#4F7DFF] transition-all cursor-pointer min-w-[150px]"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              {/* Region Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-white block">System Region</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Determines locale parameters and regulatory compliance parameters.</span>
                </div>
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs font-bold focus:outline-none focus:border-[#4F7DFF] transition-all cursor-pointer min-w-[150px]"
                >
                  {regions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Time Zone Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-white block">Time Zone Offset</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Resolves times on task deadlines, meetings, and activity logs.</span>
                </div>
                <select 
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs font-bold focus:outline-none focus:border-[#4F7DFF] transition-all cursor-pointer max-w-[240px] sm:min-w-[220px]"
                >
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              {/* Date Format Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-white block">Preferred Date Format</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Applies formatting structures on active dashboard tables.</span>
                </div>
                <select 
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs font-bold focus:outline-none focus:border-[#4F7DFF] transition-all cursor-pointer min-w-[150px]"
                >
                  {dateFormats.map(df => (
                    <option key={df} value={df}>{df}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-orange-500" />
                <span>Advanced Console & Workspace Debug</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Access developer modes, export workspace backups, or reset policies.</p>
            </div>

            <div className="space-y-6 text-xs text-left">
              {/* Developer Mode */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="space-y-0.5 flex-1 pr-4">
                  <span className="font-bold text-slate-800 dark:text-white block">Developer Sandbox Mode</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Enables advanced logging parameters and telemetry terminals inside workspace views.</span>
                </div>
                <ToggleSwitch 
                  checked={devMode}
                  onChange={setDevMode}
                />
              </div>

              {/* API Keys (Future support) */}
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-white block">Workspace API Credentials</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Integration credential key for developer access (read-only scopes).</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input 
                      type={showApiKey ? "text" : "password"}
                      value={apiKeyVal}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-slate-600 dark:text-slate-300 select-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(apiKeyVal);
                      alert('API Key copied to clipboard.');
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl transition-all border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              {/* Import / Export & Resets */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-4">
                <h4 className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                  <Settings className="w-4 h-4 text-orange-400" />
                  <span>Workspace Utilities & Safe Wipes</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/10 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 dark:text-white block">Workspace Backups</span>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Export all settings, workspace preferences, and active theme structures into a local synapse profile JSON backup.</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button 
                        type="button"
                        onClick={handleExportData}
                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-[10px] font-bold rounded-xl transition-all border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Backup</span>
                      </button>
                      <button 
                        type="button"
                        onClick={handleImportSettingsMock}
                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-[10px] font-bold rounded-xl transition-all border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Import profile</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/10 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 dark:text-white block">Workspace Cache Reset</span>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Force sync the database state, reload indexed models, and clear cached storage buckets safely.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={handleClearCache}
                      className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 text-[10px] font-bold rounded-xl transition-all border border-rose-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Wipe Workspace Cache</span>
                    </button>
                  </div>
                </div>

                {/* Reset Factor Defaults */}
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 dark:text-white block">Restore System Factory Defaults</span>
                    <p className="text-[10px] text-slate-400">Reverts theme modes, AI limits, notifications, and language offsets instantly back to Synapse default configurations.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={handleResetSettings}
                    className="py-2.5 px-5 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 text-[10px] font-bold rounded-xl transition-all border border-rose-500/20 cursor-pointer shrink-0 text-center flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset All Preferences</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none text-left pb-16 font-sans">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <span>Home</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-600 dark:text-slate-300 font-extrabold">Settings</span>
      </div>

      {/* Top Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Enterprise Settings</span>
              <span className="text-[10px] font-extrabold bg-[#4F7DFF]/10 text-[#4F7DFF] dark:bg-[#4F7DFF]/20 px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-[#4F7DFF]/15">
                PRO SUITE
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure corporate workspace policies, models, theme configurations, notifications, and telemetry compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Settings Panel layout */}
      {isMobile ? (
        /* ==========================================
           MOBILE ACCORDION LAYOUT
           ========================================== */
        <div className="space-y-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isExpanded = expandedAccordion === cat.id;
            return (
              <div 
                key={cat.id} 
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => handleAccordionClick(cat.id)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-850/40 transition-all select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-slate-50 dark:bg-slate-950 ${cat.color} border border-slate-100 dark:border-slate-800`}>
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <span className="text-xs font-black text-slate-800 dark:text-white">{cat.label}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-100 dark:border-slate-800/80"
                    >
                      <div className="p-5">
                        {renderCategoryContent(cat.id)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : (
        /* ==========================================
           DESKTOP/TABLET TWO-COLUMN GRID LAYOUT
           ========================================== */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar Panel */}
          <div className="md:col-span-1 space-y-1 text-left">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <button 
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTab(cat.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                    isActive 
                      ? 'bg-[#4F7DFF]/10 border-[#4F7DFF]/20 text-[#4F7DFF] dark:text-white dark:bg-[#4F7DFF]/20 shadow-xs font-black' 
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40 border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#4F7DFF]' : 'text-slate-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Details View Panel */}
          <div className="md:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="p-6 rounded-[24px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm min-h-[300px]"
              >
                {renderCategoryContent(activeTab)}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      )}

    </div>
  );
}
