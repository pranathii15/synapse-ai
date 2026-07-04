import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  Video, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Compass
} from 'lucide-react';
import { Project, Task } from '../types';

interface CalendarViewProps {
  projects: Project[];
  tasks: Task[];
  onAddNotification?: (title: string, desc: string, priority: any, category: any) => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  type: 'meeting' | 'task_deadline' | 'milestone' | 'event';
  date: string; // YYYY-MM-DD
  time?: string;
  associatedId?: string; // Project/Task Id
  priority: 'High' | 'Medium' | 'Low';
  attendees?: string[];
  description?: string;
}

export default function CalendarView({ projects, tasks, onAddNotification }: CalendarViewProps) {
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 3)); // Match current time: July 3, 2026
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [newEventModal, setNewEventModal] = useState(false);
  
  // New event form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<CalendarEvent['type']>('meeting');
  const [newDateStr, setNewDateStr] = useState('2026-07-03');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newPriority, setNewPriority] = useState<CalendarEvent['priority']>('Medium');
  const [newDesc, setNewDesc] = useState('');

  // Initial Seed Events combined with dynamic Tasks/Projects
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>([
    {
      id: 'e1',
      title: 'Q3 Product Kickoff & AI Strategy Sync',
      type: 'meeting',
      date: '2026-07-03',
      time: '11:00 AM - 12:30 PM',
      priority: 'High',
      attendees: ['Sarah Jenkins', 'Marcus Vance', 'Dr. Alex Rivera', 'Elena Rostova'],
      description: 'Reviewing our custom legal fine-tuning hyperparameters grid and roadmap deliverables for AP-East deployment clusters.'
    },
    {
      id: 'e2',
      title: 'Aegis Security mTLS Infrastructure Rollout',
      type: 'milestone',
      date: '2026-07-03',
      time: '11:00 PM - 11:30 PM',
      priority: 'High',
      attendees: ['Elena Rostova', 'Maya Chen'],
      description: 'Simulating zero-trust validation keys and updating Docker certificates inside kubernetes namespaces.'
    },
    {
      id: 'e3',
      title: 'Daily Standup / Kanban Progress Sweep',
      type: 'meeting',
      date: '2026-07-06',
      time: '10:00 AM - 10:30 AM',
      priority: 'Low',
      attendees: ['Entire Roster'],
      description: 'Review blockers on Project Athena NLP models and database index updates.'
    },
    {
      id: 'e4',
      title: 'Microsoft Azure AI Partnership Review',
      type: 'meeting',
      date: '2026-07-15',
      time: '2:00 PM - 3:00 PM',
      priority: 'Medium',
      attendees: ['Marcus Vance', 'Dr. Alex Rivera'],
      description: 'Demonstrating FAISS retrieval speeds on multi-region dataset sandboxes.'
    }
  ]);

  // Aggregate static events, task due dates, and project due dates
  const getAllEvents = (): CalendarEvent[] => {
    const list = [...customEvents];

    // Map tasks to calendar deadlines
    tasks.forEach(t => {
      list.push({
        id: `task-dl-${t.id}`,
        title: `Deadline: SYN-${t.id.substring(1)} - ${t.title}`,
        type: 'task_deadline',
        date: t.dueDate,
        priority: t.priority,
        description: t.description,
        associatedId: t.projectId
      });
    });

    // Map projects to calendar milestones
    projects.forEach(p => {
      list.push({
        id: `proj-dl-${p.id}`,
        title: `Milestone: ${p.name} Target Launch`,
        type: 'milestone',
        date: p.dueDate,
        priority: p.priority,
        description: p.description
      });
    });

    return list;
  };

  const events = getAllEvents();

  // Helper date calculators
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleAddCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEv: CalendarEvent = {
      id: `custom-e-${Date.now()}`,
      title: newTitle,
      type: newType,
      date: newDateStr,
      time: newTime,
      priority: newPriority,
      attendees: ['Marcus Vance', 'Sarah Jenkins'],
      description: newDesc
    };

    setCustomEvents([...customEvents, newEv]);
    setNewEventModal(false);
    
    // reset form
    setNewTitle('');
    setNewDesc('');

    if (onAddNotification) {
      onAddNotification(
        'Calendar Event Created',
        `New event "${newTitle}" was logged for ${newDateStr} inside the enterprise planner.`,
        'Low',
        'System'
      );
    }
  };

  // Render Month Grid
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const cells = [];

    // Pad first empty days
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`pad-${i}`} className="min-h-[85px] bg-slate-50/45 border border-slate-100 p-1.5 select-none opacity-40" />);
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      const isToday = d === 3 && month === 6 && year === 2026; // July 3, 2026 is today

      cells.push(
        <div 
          key={`day-${d}`} 
          className={`min-h-[90px] bg-white border border-slate-100 hover:bg-slate-50/50 p-1.5 flex flex-col text-left transition-colors relative cursor-pointer ${
            isToday ? 'bg-indigo-50/30' : ''
          }`}
          onClick={() => {
            setNewDateStr(dateStr);
            setNewEventModal(true);
          }}
        >
          <span className={`text-[10px] font-bold inline-flex items-center justify-center w-5 h-5 rounded-full ${
            isToday ? 'bg-indigo-600 text-white font-black' : 'text-slate-500'
          }`}>
            {d}
          </span>

          <div className="flex-1 overflow-y-auto space-y-1 mt-1 pr-0.5 scrollbar-thin scrollbar-thumb-slate-200">
            {dayEvents.slice(0, 3).map(e => {
              const colorClasses = e.type === 'meeting' 
                ? 'bg-blue-50 text-blue-700 border-blue-100' 
                : e.type === 'task_deadline' 
                  ? 'bg-amber-50 text-amber-700 border-amber-100' 
                  : e.type === 'milestone' 
                    ? 'bg-purple-50 text-purple-700 border-purple-100' 
                    : 'bg-indigo-50 text-indigo-700 border-indigo-100';

              return (
                <div 
                  key={e.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedEvent(e);
                  }}
                  className={`px-1.5 py-0.5 rounded-md border text-[9px] font-bold leading-none truncate ${colorClasses}`}
                  title={e.title}
                >
                  {e.title}
                </div>
              );
            })}
            {dayEvents.length > 3 && (
              <span className="text-[8px] text-slate-400 font-bold block pl-1">+{dayEvents.length - 3} more</span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col flex-1">
        <div className="grid grid-cols-7 border-b border-slate-200 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 pb-2.5">
          {dayLabels.map(label => <div key={label}>{label}</div>)}
        </div>
        <div className="grid grid-cols-7 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden mt-1 gap-px">
          {cells}
        </div>
      </div>
    );
  };

  // Render Agenda View
  const renderAgendaView = () => {
    // Sort events by date ascending
    const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));

    return (
      <div className="p-1 space-y-4 flex-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block px-1 select-none">
          Active Workspace Agenda List
        </span>
        
        {sortedEvents.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-12">No registered events inside agenda scope.</p>
        ) : (
          <div className="space-y-2.5">
            {sortedEvents.map(e => {
              const colorClasses = e.type === 'meeting' 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : e.type === 'task_deadline' 
                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                  : e.type === 'milestone' 
                    ? 'bg-purple-50 text-purple-700 border-purple-200' 
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200';

              return (
                <div 
                  key={e.id}
                  onClick={() => setSelectedEvent(e)}
                  className={`p-3.5 rounded-2xl border bg-white hover:bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-colors text-left ${colorClasses}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black tracking-tight block">{e.title}</span>
                      <span className="text-[8px] font-bold uppercase border border-current px-2 rounded-full scale-90">
                        {e.type}
                      </span>
                    </div>
                    {e.description && (
                      <p className="text-[10px] text-slate-500 max-w-xl font-medium leading-relaxed">{e.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 shrink-0" /> {e.date}
                    </span>
                    {e.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 shrink-0" /> {e.time}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto select-none pb-12 font-sans text-left">
      
      {/* Left 2 columns: Calendar Engine wrapper */}
      <div className="lg:col-span-2 space-y-5 flex flex-col">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">Interactive Calendar Module</h2>
            <p className="text-xs text-[#64748B]">Orchestrate sprint task due dates, launch timelines, and meeting lobbies.</p>
          </div>

          <button 
            onClick={() => setNewEventModal(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer shadow-md shadow-indigo-600/10"
          >
            <Plus className="w-4 h-4" /> Schedule Event
          </button>
        </div>

        {/* View Switcher Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
          {/* Calendar controls */}
          <div className="flex items-center gap-3 select-none">
            <button onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-black text-slate-800">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={handleNextMonth} className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle buttons Month/Agenda */}
          <div className="flex border border-slate-200 bg-slate-50 rounded-xl p-0.5 text-[10px] font-bold">
            <button 
              onClick={() => setCurrentView('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'month' ? 'bg-white text-indigo-600 shadow-sm font-black' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Month Grid
            </button>
            <button 
              onClick={() => setCurrentView('agenda')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'agenda' ? 'bg-white text-indigo-600 shadow-sm font-black' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Agenda View
            </button>
          </div>
        </div>

        {/* Dynamic viewport */}
        <div className="p-4 rounded-3xl border border-[#E5E7EB] bg-white shadow-sm flex flex-col flex-1 min-h-[480px]">
          {currentView === 'month' ? renderMonthView() : renderAgendaView()}
        </div>
      </div>

      {/* Right Column: Event Details Inspector & Legend */}
      <div className="space-y-5">
        
        {/* Active Selected Event Details */}
        <div className="flex items-center gap-1.5 text-[#23395B]">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold uppercase">Planner Inspector</h3>
        </div>

        {selectedEvent ? (
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 space-y-4.5 text-left shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3.5">
              <div>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  selectedEvent.type === 'meeting' 
                    ? 'bg-blue-50 text-blue-600 border-blue-100' 
                    : selectedEvent.type === 'task_deadline' 
                      ? 'bg-amber-50 text-amber-600 border-amber-100' 
                      : 'bg-purple-50 text-purple-600 border-purple-100'
                }`}>
                  {selectedEvent.type}
                </span>
                <h3 className="text-xs font-bold text-[#1E293B] mt-2 leading-tight">{selectedEvent.title}</h3>
              </div>
              
              <button 
                onClick={() => setSelectedEvent(null)}
                className="p-1 hover:bg-[#F7F8FA] rounded-lg text-[#64748B] hover:text-[#1E293B] transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600">
              {selectedEvent.description && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">Outline Description</span>
                  <p className="font-medium text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">{selectedEvent.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 font-mono text-[10px] font-bold">
                <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[8px] text-slate-400 uppercase tracking-wide">Due Date</span>
                  <span className="text-slate-700 block">{selectedEvent.date}</span>
                </div>
                <div className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[8px] text-slate-400 uppercase tracking-wide">Time Block</span>
                  <span className="text-slate-700 block">{selectedEvent.time || 'All Day Event'}</span>
                </div>
              </div>

              {selectedEvent.attendees && (
                <div className="space-y-1 pt-1.5">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">Invited Roster ({selectedEvent.attendees.length})</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedEvent.attendees.map(a => (
                      <span key={a} className="bg-indigo-50/60 border border-indigo-100/50 text-indigo-600 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedEvent.type === 'meeting' && (
              <div className="pt-3 border-t border-[#E5E7EB]">
                <button 
                  onClick={() => alert('Launching Teams VoIP workspace meeting room...')}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer text-center shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" /> Enter Teams Video Room
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 text-center border border-[#E5E7EB] bg-white rounded-3xl shadow-sm p-6 text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2 select-none">Calendar Legend</span>
            <div className="space-y-2.5 text-[11px] font-bold text-slate-600 select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-blue-500 shrink-0" />
                <span>VoIP Video Meetings & Syncs</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-amber-500 shrink-0" />
                <span>Tasks & Action Deadlines</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-purple-500 shrink-0" />
                <span>Strategic Roadmap Milestones</span>
              </div>
            </div>
            
            <div className="border-t border-slate-100 mt-4 pt-4 text-center">
              <p className="text-[10px] text-[#64748B] font-medium leading-relaxed">
                Click any day slot on the grid to create or catalog standard meeting placeholders.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Event Modal Backdrop */}
      <AnimatePresence>
        {newEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setNewEventModal(false)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 w-full max-w-md space-y-4"
            >
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Schedule Enterprise Event</h3>
              
              <form onSubmit={handleAddCustomEvent} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 block">Event Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Athena Sprint Check-in"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white outline-none font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block">Event Type</label>
                    <select 
                      value={newType} 
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white outline-none font-medium"
                    >
                      <option value="meeting">Video Meeting</option>
                      <option value="milestone">Milestone</option>
                      <option value="event">Corporate Event</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block">Priority</label>
                    <select 
                      value={newPriority} 
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white outline-none font-medium"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block">Target Date</label>
                    <input 
                      type="date" 
                      value={newDateStr}
                      onChange={(e) => setNewDateStr(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white outline-none font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block">Time Block</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 10:00 AM - 11:00 AM"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 block">Outline Outline Description</label>
                  <textarea 
                    placeholder="Agenda items and details..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:bg-white outline-none font-medium resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setNewEventModal(false)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer text-center shadow-md shadow-indigo-600/10"
                  >
                    Catalog Event
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
