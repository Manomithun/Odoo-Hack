import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripService } from '../../services/trip.service';
import { ArrowLeft, Plus, Trash2, BookOpen, MapPin, Calendar, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const MOODS = ['✈️ Excited', '😊 Happy', '😌 Relaxed', '🤩 Amazed', '😴 Tired', '🤔 Thoughtful'];

export default function TripNotes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', content: '', tripStopId: '', mood: '' });
  const [filter, setFilter] = useState('all');

  const fetchData = async () => {
    try {
      const res = await tripService.getById(id);
      setTrip(res.data.data);
      setNotes(res.data.data.tripNotes || []);
    } catch { toast.error('Trip not found'); navigate('/trips'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleAdd = async () => {
    if (!form.content.trim()) return toast.error('Note content is required');
    try {
      await tripService.addNote(id, { title: form.title, content: form.content, tripStopId: form.tripStopId || undefined });
      setForm({ title: '', content: '', tripStopId: '', mood: '' });
      toast.success('Note saved! 📓');
      fetchData();
    } catch { toast.error('Failed to save note'); }
  };

  const handleDelete = async (noteId) => {
    if (!confirm('Delete this note?')) return;
    try { await tripService.deleteNote(noteId); fetchData(); toast.success('Note deleted'); }
    catch { toast.error('Failed to delete'); }
  };

  const filteredNotes = filter === 'all' ? notes : notes.filter(n => n.tripStopId === filter);

  if (loading) return <div className="flex items-center justify-center h-64 text-white">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(`/trips/${id}`)} className="w-9 h-9 glass rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} style={{ color: 'rgba(226,232,240,0.7)' }} />
        </button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-2xl text-white">Trip Journal</h1>
          <p className="text-sm" style={{ color: 'rgba(226,232,240,0.5)' }}>{trip?.title} · {notes.length} entries</p>
        </div>
      </div>

      {/* Add note form */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={16} style={{ color: '#4ecdc4' }} />
          <h3 className="font-bold text-white">Add Journal Entry</h3>
        </div>

        {/* Mood selector */}
        <div>
          <p className="text-xs mb-2" style={{ color: 'rgba(226,232,240,0.5)' }}>How are you feeling?</p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map(mood => (
              <button key={mood} id={`mood-${mood}`} onClick={() => setForm(p => ({ ...p, mood: p.mood === mood ? '' : mood }))}
                className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                style={{ background: form.mood === mood ? 'rgba(78,205,196,0.2)' : 'rgba(255,255,255,0.05)', color: form.mood === mood ? '#4ecdc4' : 'rgba(226,232,240,0.6)', border: form.mood === mood ? '1px solid rgba(78,205,196,0.3)' : '1px solid transparent' }}>
                {mood}
              </button>
            ))}
          </div>
        </div>

        <input id="note-title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
          className="input-field" placeholder="Entry title (optional)..." />

        <textarea id="note-content" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
          className="input-field resize-none" style={{ minHeight: '100px' }}
          placeholder="Write about your day, thoughts, or memories..." />

        {/* Link to a city stop */}
        {trip?.tripStops?.length > 0 && (
          <select id="note-stop" value={form.tripStopId} onChange={e => setForm(p => ({ ...p, tripStopId: e.target.value }))} className="input-field">
            <option value="">📍 Not linked to a city</option>
            {trip.tripStops.map(s => (
              <option key={s.id} value={s.id}>📍 {s.city?.cityName}, {s.city?.countryName}</option>
            ))}
          </select>
        )}

        <button id="add-note-btn" onClick={handleAdd} className="btn-primary">
          <Plus size={15} /> Save Entry
        </button>
      </div>

      {/* Filter by city */}
      {trip?.tripStops?.length > 0 && notes.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setFilter('all')} id="filter-all-notes"
            className="px-3 py-1.5 rounded-xl text-xs flex-shrink-0 transition-all"
            style={{ background: filter === 'all' ? 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' : 'rgba(255,255,255,0.06)', color: 'white' }}>
            All ({notes.length})
          </button>
          {trip.tripStops.map(s => (
            <button key={s.id} onClick={() => setFilter(s.id)} id={`filter-stop-${s.id}`}
              className="px-3 py-1.5 rounded-xl text-xs flex-shrink-0 transition-all"
              style={{ background: filter === s.id ? 'rgba(78,205,196,0.2)' : 'rgba(255,255,255,0.06)', color: filter === s.id ? '#4ecdc4' : 'rgba(226,232,240,0.5)' }}>
              {s.city?.cityName} ({notes.filter(n => n.tripStopId === s.id).length})
            </button>
          ))}
        </div>
      )}

      {/* Notes list */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen size={48} className="mx-auto mb-3 opacity-20" />
          <p style={{ color: 'rgba(226,232,240,0.4)' }}>No journal entries yet. Start writing!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredNotes.map((note, i) => {
              const linkedStop = trip?.tripStops?.find(s => s.id === note.tripStopId);
              return (
                <motion.div key={note.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ delay: i * 0.07 }}
                  className="glass rounded-2xl p-5">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      {note.title && <h3 className="font-bold text-white text-lg mb-0.5">{note.title}</h3>}
                      <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: 'rgba(226,232,240,0.4)' }}>
                        <span className="flex items-center gap-1"><Calendar size={10} /> {format(new Date(note.createdAt), 'EEEE, MMM d · h:mm a')}</span>
                        {linkedStop && (
                          <span className="flex items-center gap-1" style={{ color: '#4ecdc4' }}>
                            <MapPin size={10} /> {linkedStop.city?.cityName}
                          </span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(note.id)} id={`delete-note-${note.id}`}
                      className="p-1.5 rounded-lg transition-all flex-shrink-0"
                      style={{ color: 'rgba(255,107,107,0.5)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.1)'; e.currentTarget.style.color = '#ff6b6b'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,107,107,0.5)'; }}>
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="h-px mb-3" style={{ background: 'rgba(255,255,255,0.05)' }} />

                  {/* Content */}
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(226,232,240,0.75)' }}>{note.content}</p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
