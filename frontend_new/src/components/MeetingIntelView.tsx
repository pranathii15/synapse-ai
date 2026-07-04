import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Users, 
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Clock,
  Briefcase,
  FileText,
  ChevronRight,
  Save
} from 'lucide-react';
import { Task, TeamMember } from '../types';
import { meetingService, MeetingAnalysis } from '../services/meetingService';
import Button from './Button';

interface MeetingIntelProps {
  team: TeamMember[];
  onImportTasks: (extractedTasks: Omit<Task, 'id' | 'code'>[]) => void;
  onSaveMeeting?: (title: string, summary: string, minutes: string) => Promise<void> | void;
}

export default function MeetingIntelView({ team, onImportTasks, onSaveMeeting }: MeetingIntelProps) {
  const [transcript, setTranscript] = useState(
    "Sarah Jenkins: We need to resolve the document layout issues before July 20th. I will work on fixing the spacing and colors of the cards.\n\nDr. Alex Rivera: I will write the final testing scripts for the file search feature next week."
  );
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);

  const handleProcess = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    try {
      const res = await meetingService.analyzeTranscript(transcript);
      setAnalysis(res);
    } catch (err) {
      console.error('Error analyzing meeting transcript:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeeting = async () => {
    if (!analysis) return;
    setSaving(true);
    try {
      if (onSaveMeeting) {
        await onSaveMeeting(analysis.title, analysis.summary, analysis.minutes);
      } else {
        alert("Meeting minutes successfully logged!");
      }
    } catch (err) {
      console.warn("Error saving meeting:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleExportTasks = () => {
    if (!analysis) return;
    
    const tasksToExport = analysis.actionItems.map(item => {
      // Find default project id: e.g. p1
      return {
        title: item.description,
        description: `Extracted from automated transcription analysis: "${item.description}"`,
        status: 'Todo' as const,
        priority: item.priority,
        dueDate: item.dueDate,
        assigneeId: item.assigneeId,
        progress: 0,
        projectId: 'p1' // default link Project Athena
      };
    });

    onImportTasks(tasksToExport);
    alert(`Created ${tasksToExport.length} tasks successfully!`);
    setAnalysis(null);
    setTranscript('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none pb-12 font-sans text-left">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-2">
        <span>Home</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-600 font-bold">Meetings</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Transcript Inputs & Processing action triggers */}
        <div className="space-y-5">
          <div className="text-left">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Meetings</h2>
            <p className="text-xs text-slate-500 font-medium">Turn meeting transcripts into summaries and tasks.</p>
          </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Paste Meeting Transcript</span>
            <button 
              onClick={() => setTranscript('')}
              className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
              title="Clear text"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <textarea 
            rows={10}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Write your meeting notes or paste transcripts here..." 
            className="w-full bg-slate-50/50 border border-slate-200 text-xs text-slate-800 rounded-xl p-4 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 resize-none font-mono leading-relaxed transition-all placeholder-slate-400 font-medium"
          />

          <div className="flex items-center justify-between gap-4 pt-2">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">
              ~{transcript.split(/\s+/).filter(Boolean).length} words
            </span>

            <Button 
              onClick={handleProcess}
              disabled={loading || !transcript.trim()}
              variant="primary"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Preparing AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Generate Summary</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column: AI Extracted results (Minutes, Action items, Save options) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <h3 className="text-xs font-bold tracking-widest uppercase">Meeting Summary</h3>
        </div>

        {analysis ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-5 flex flex-col justify-between min-h-[460px] text-left shadow-xs">
            <div className="space-y-4">
              {/* Header Titles */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="text-left">
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{analysis.title}</h3>
                  <span className="text-[9px] text-indigo-500 font-bold block uppercase mt-0.5 tracking-wider">Summary Ready</span>
                </div>
                
                <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100/80 px-2.5 py-0.5 rounded-lg font-sans font-bold uppercase tracking-wider shrink-0">
                  Processed
                </span>
              </div>

              {/* Summary Paragraph */}
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Summary</span>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{analysis.summary}</p>
              </div>

              {/* Extracted Meeting Minutes */}
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Meeting Notes</span>
                <p className="text-xs text-slate-700 bg-slate-50/50 border border-slate-200 p-3.5 rounded-xl leading-relaxed whitespace-pre-line font-medium font-mono">
                  {analysis.minutes}
                </p>
              </div>

              {/* Extracted Action Items */}
              <div className="space-y-2">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Action Items</span>
                
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {analysis.actionItems.map((item, i) => (
                    <div 
                      key={i} 
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs flex items-center justify-between gap-3 shadow-xs hover:border-indigo-500/20 transition-colors"
                    >
                      <div className="space-y-1 text-left">
                        <span className="font-bold text-slate-800 block leading-snug">{item.description}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1 font-mono">
                            <Users className="w-3 h-3 text-slate-400" /> {item.assigneeName}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-400" /> Due {item.dueDate}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-lg shrink-0 uppercase tracking-wider border ${
                        item.priority === 'High' 
                          ? 'bg-rose-50 text-rose-600 border-rose-100/80' 
                          : 'bg-slate-100 text-slate-500 border-slate-200/80'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions for analysis */}
            <div className="pt-4 border-t border-slate-100 mt-5 flex justify-end gap-2.5 text-xs">
              <Button 
                onClick={() => setAnalysis(null)}
                variant="secondary"
                disabled={saving}
              >
                Cancel
              </Button>

              <Button 
                onClick={handleSaveMeeting}
                variant="outline"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Meeting</span>
                  </>
                )}
              </Button>

              <Button 
                onClick={handleExportTasks}
                disabled={saving}
              >
                Create Tasks
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center border border-slate-200 rounded-2xl bg-white shadow-xs flex flex-col items-center justify-center p-6">
            <div className="p-3 bg-slate-100 rounded-full text-slate-400 mb-2">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-500 font-bold max-w-xs leading-relaxed text-center">
              Paste meeting notes or transcripts and click "Generate Summary" to get summaries and tasks.
            </p>
          </div>
        )}
      </div>

    </div>
    </div>
  );
}
