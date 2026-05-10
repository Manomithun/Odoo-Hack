import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tripService, stopService, activityService } from '../../services/trip.service';
import { cityService } from '../../services/city.service';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, MapPin, Calendar, DollarSign, Package, BookOpen, Share2, Trash2, Star, Clock, Check } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TABS = ['Itinerary', 'Budget', 'Packing', 'Notes'];
const BUDGET_COLORS = ['#ff6b6b', '#4ecdc4', '#ffd93d', '#a78bfa', '#f97316'];

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [tab, setTab] = useState('Itinerary');
  const [loading, setLoading] = useState(true);
  const [addingStop, setAddingStop] = useState(false);
  const [cities, setCities] = useState([]);
  const [stopForm, setStopForm] = useState({ cityId: '', arrivalDate: '', departureDate: '', stopOrder: 0 });
  const [packingInput, setPackingInput] = useState({ itemName: '', category: 'General' });
  const [noteInput, setNoteInput] = useState({ title: '', content: '' });
  const [budgetInput, setBudgetInput] = useState({ category: 'Accommodation', amount: '', description: '' });
  const [cityActivities, setCityActivities] = useState({});
  const [shareLink, setShareLink] = useState(null);

  const fetchTrip = async () => {
    try {
      const res = await tripService.getById(id);
      setTrip(res.data.data);
    } catch { toast.error('Trip not found'); navigate('/trips'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTrip(); }, [id]);

  useEffect(() => {
    if (addingStop) {
      cityService.getAll({ limit: 100 }).then(r => setCities(r.data.data || []));
    }
  }, [addingStop]);

  // Load activities for each stop's city
  useEffect(() => {
    if (!trip) return;
    trip.tripStops?.forEach(async (stop) => {
      if (!cityActivities[stop.cityId]) {
        try {
          const r = await cityService.getActivities(stop.cityId, { limit: 20 });
          setCityActivities(prev => ({ ...prev, [stop.cityId]: r.data.data || [] }));
        } catch {}
      }
    });
  }, [trip?.tripStops?.length]);

  const handleAddStop = async () => {
    try {
      await tripService.addStop(id, { ...stopForm, stopOrder: (trip.tripStops?.length || 0) + 1 });
      toast.success('City stop added!');
      setAddingStop(false);
      setStopForm({ cityId: '', arrivalDate: '', departureDate: '', stopOrder: 0 });
      fetchTrip();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add stop'); }
  };

  const handleDeleteStop = async (stopId) => {
    if (!confirm('Remove this city stop?')) return;
    try {
      await stopService.delete(stopId);
      toast.success('Stop removed');
      fetchTrip();
    } catch { toast.error('Failed to remove stop'); }
  };

  const handleAddActivity = async (stopId, activityId) => {
    try {
      await stopService.addActivity(stopId, { activityId });
      toast.success('Activity added!');
      fetchTrip();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add activity'); }
  };

  const handleRemoveActivity = async (taId) => {
    try {
      await activityService.remove(taId);
      toast.success('Activity removed');
      fetchTrip();
    } catch { toast.error('Failed to remove activity'); }
  };

  const handleAddPacking = async () => {
    if (!packingInput.itemName) return;
    try {
      await tripService.addPackingItem(id, packingInput);
      setPackingInput({ itemName: '', category: 'General' });
      fetchTrip();
    } catch { toast.error('Failed to add item'); }
  };

  const handleTogglePacked = async (itemId, current) => {
    try {
      await tripService.updatePackingItem(itemId, { isPacked: !current });
      fetchTrip();
    } catch {}
  };

  const handleAddNote = async () => {
    if (!noteInput.content) return;
    try {
      await tripService.addNote(id, noteInput);
      setNoteInput({ title: '', content: '' });
      fetchTrip();
    } catch { toast.error('Failed to add note'); }
  };

  const handleAddBudget = async () => {
    if (!budgetInput.amount) return;
    try {
      await tripService.addBudget(id, { ...budgetInput, amount: Number(budgetInput.amount) });
      setBudgetInput({ category: 'Accommodation', amount: '', description: '' });
      fetchTrip();
    } catch { toast.error('Failed to add budget entry'); }
  };

  const handleShare = async () => {
    try {
      const res = await tripService.share(id);
      const token = res.data.data.shareToken;
      setShareLink(`${window.location.origin}/share/${token}`);
      navigator.clipboard.writeText(`${window.location.origin}/share/${token}`);
      toast.success('Share link copied!');
    } catch { toast.error('Failed to share trip'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-white">Loading trip...</div></div>;
  if (!trip) return null;

  const budgetByCategory = trip.budgets?.reduce((acc, b) => {
    acc[b.category] = (acc[b.category] || 0) + parseFloat(b.amount);
    return acc;
  }, {});
  const budgetChartData = Object.entries(budgetByCategory || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden h-64">
        <img src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'}
          alt={trip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,12,27,0.95) 0%, rgba(2,12,27,0.3) 100%)' }} />
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/trips')} className="btn-ghost glass p-2 rounded-xl">
              <ArrowLeft size={18} />
            </button>
            <button id="share-trip-btn" onClick={handleShare} className="btn-secondary gap-2">
              <Share2 size={14} /> Share
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge" style={{ background: trip.visibility === 'public' ? 'rgba(78,205,196,0.25)' : 'rgba(255,255,255,0.15)', color: trip.visibility === 'public' ? '#4ecdc4' : '#e2e8f0' }}>
                {trip.visibility}
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl text-white">{trip.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-sm" style={{ color: 'rgba(226,232,240,0.7)' }}>
                <Calendar size={13} /> {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
              </span>
              <span className="flex items-center gap-1 text-sm" style={{ color: '#ffd93d' }}>
                <DollarSign size={13} /> ${parseFloat(trip.totalEstimatedBudget || 0).toLocaleString()} budget
              </span>
            </div>
          </div>
        </div>
      </div>

      {shareLink && (
        <div className="glass rounded-xl p-3 flex items-center gap-3">
          <span className="text-sm flex-1 truncate" style={{ color: '#4ecdc4' }}>{shareLink}</span>
          <button onClick={() => { navigator.clipboard.writeText(shareLink); toast.success('Copied!'); }}
            className="btn-secondary text-xs py-1.5 px-3">Copy</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button key={t} id={`tab-${t.toLowerCase()}`} onClick={() => setTab(t)}
            className="flex-shrink-0 px-5 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: tab === t ? 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' : 'rgba(255,255,255,0.05)',
              color: 'white',
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* ITINERARY */}
        {tab === 'Itinerary' && (
          <motion.div key="itinerary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-xl text-white">{trip.tripStops?.length || 0} Cities</h2>
              <button id="add-stop-btn" onClick={() => setAddingStop(!addingStop)} className="btn-primary py-2">
                <Plus size={15} /> Add City
              </button>
            </div>

            {/* Add stop form */}
            <AnimatePresence>
              {addingStop && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="glass rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-white">Add a City Stop</h3>
                  <select id="stop-city" value={stopForm.cityId} onChange={e => setStopForm(p => ({ ...p, cityId: e.target.value }))}
                    className="input-field">
                    <option value="">Select a city...</option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.cityName}, {c.countryName}</option>)}
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'rgba(226,232,240,0.6)' }}>Arrival</label>
                      <input type="date" id="stop-arrival" value={stopForm.arrivalDate} onChange={e => setStopForm(p => ({ ...p, arrivalDate: e.target.value }))}
                        className="input-field" style={{ colorScheme: 'dark' }} />
                    </div>
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'rgba(226,232,240,0.6)' }}>Departure</label>
                      <input type="date" id="stop-departure" value={stopForm.departureDate} onChange={e => setStopForm(p => ({ ...p, departureDate: e.target.value }))}
                        className="input-field" style={{ colorScheme: 'dark' }} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button id="stop-save" onClick={handleAddStop} className="btn-primary flex-1 justify-center">Add Stop</button>
                    <button onClick={() => setAddingStop(false)} className="btn-ghost px-4">Cancel</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timeline */}
            {trip.tripStops?.length === 0 ? (
              <div className="text-center py-12">
                <MapPin size={48} className="mx-auto mb-3 opacity-20" />
                <p style={{ color: 'rgba(226,232,240,0.5)' }}>No cities added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trip.tripStops?.map((stop, i) => (
                  <motion.div key={stop.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className="glass rounded-2xl overflow-hidden">
                      <div className="relative h-32">
                        {stop.city?.imageUrl && <img src={stop.city.imageUrl} alt={stop.city?.cityName} className="w-full h-full object-cover" />}
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(2,12,27,0.95), rgba(2,12,27,0.4))' }} />
                        <div className="absolute inset-0 p-4 flex items-center">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                              style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' }}>{i + 1}</div>
                            <div>
                              <h3 className="font-bold text-white text-xl">{stop.city?.cityName}</h3>
                              <p className="text-sm" style={{ color: 'rgba(226,232,240,0.6)' }}>{stop.city?.countryName}</p>
                              <p className="text-xs mt-1" style={{ color: 'rgba(226,232,240,0.5)' }}>
                                {format(new Date(stop.arrivalDate), 'MMM d')} – {format(new Date(stop.departureDate), 'MMM d')}
                              </p>
                            </div>
                          </div>
                          <button onClick={() => handleDeleteStop(stop.id)} className="btn-ghost p-2" style={{ color: 'rgba(255,107,107,0.6)' }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Activities */}
                      <div className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(226,232,240,0.4)' }}>Activities</p>
                        {stop.tripActivities?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {stop.tripActivities.map(ta => (
                              <div key={ta.id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm"
                                style={{ background: 'rgba(78,205,196,0.1)', border: '1px solid rgba(78,205,196,0.2)' }}>
                                <span style={{ color: '#4ecdc4' }}>{ta.activity?.title}</span>
                                <button onClick={() => handleRemoveActivity(ta.id)} style={{ color: 'rgba(255,107,107,0.6)' }}>×</button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(cityActivities[stop.cityId] || []).filter(a => !stop.tripActivities?.some(ta => ta.activityId === a.id)).slice(0, 4).map(activity => (
                            <button key={activity.id} id={`add-activity-${activity.id}`}
                              onClick={() => handleAddActivity(stop.id, activity.id)}
                              className="flex items-center gap-2 p-2 rounded-xl text-left transition-all"
                              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(78,205,196,0.05)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                              <Plus size={12} style={{ color: '#4ecdc4' }} />
                              <span className="text-xs text-white truncate">{activity.title}</span>
                              <span className="text-xs ml-auto flex-shrink-0" style={{ color: '#ffd93d' }}>${activity.estimatedCost}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* BUDGET */}
        {tab === 'Budget' && (
          <motion.div key="budget" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Chart */}
              {budgetChartData.length > 0 && (
                <div className="glass rounded-2xl p-5">
                  <h3 className="font-bold text-white mb-4">Budget Breakdown</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={budgetChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {budgetChartData.map((_, i) => <Cell key={i} fill={BUDGET_COLORS[i % BUDGET_COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => `$${v}`} contentStyle={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="glass rounded-2xl p-5">
                <h3 className="font-bold text-white mb-4">Totals</h3>
                <div className="space-y-3">
                  {Object.entries(budgetByCategory || {}).map(([cat, amt], i) => (
                    <div key={cat} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: BUDGET_COLORS[i % BUDGET_COLORS.length] }} />
                        <span className="text-sm" style={{ color: 'rgba(226,232,240,0.7)' }}>{cat}</span>
                      </div>
                      <span className="font-bold text-white">${amt.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
                  <div className="flex justify-between">
                    <span className="font-bold text-white">Total</span>
                    <span className="font-bold text-xl" style={{ color: '#ffd93d' }}>${parseFloat(trip.totalEstimatedBudget || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add budget */}
            <div className="glass rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4">Add Budget Entry</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                <select id="budget-category" value={budgetInput.category} onChange={e => setBudgetInput(p => ({ ...p, category: e.target.value }))} className="input-field">
                  {['Accommodation', 'Food & Dining', 'Transport', 'Activities', 'Shopping', 'Healthcare', 'Other'].map(c => <option key={c}>{c}</option>)}
                </select>
                <input id="budget-amount" type="number" placeholder="Amount ($)" value={budgetInput.amount}
                  onChange={e => setBudgetInput(p => ({ ...p, amount: e.target.value }))} className="input-field" />
                <button id="add-budget-btn" onClick={handleAddBudget} className="btn-primary justify-center"><Plus size={15} /> Add</button>
              </div>
            </div>

            {/* Budget list */}
            <div className="space-y-2">
              {trip.budgets?.map((b, i) => (
                <div key={b.id} className="glass rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: BUDGET_COLORS[i % BUDGET_COLORS.length] }} />
                    <span className="text-sm" style={{ color: 'rgba(226,232,240,0.8)' }}>{b.category}</span>
                    {b.description && <span className="text-xs" style={{ color: 'rgba(226,232,240,0.4)' }}>· {b.description}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white">${parseFloat(b.amount).toLocaleString()}</span>
                    <button onClick={async () => { await tripService.deleteBudget(b.id); fetchTrip(); }}
                      className="p-1 rounded" style={{ color: 'rgba(255,107,107,0.5)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PACKING */}
        {tab === 'Packing' && (
          <motion.div key="packing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {trip.packingItems && (
              <div className="glass rounded-xl p-3 flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${trip.packingItems.length ? (trip.packingItems.filter(i => i.isPacked).length / trip.packingItems.length) * 100 : 0}%`, background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' }} />
                </div>
                <span className="text-sm font-medium text-white">
                  {trip.packingItems.filter(i => i.isPacked).length}/{trip.packingItems.length} packed
                </span>
              </div>
            )}

            <div className="flex gap-2">
              <input id="packing-item" value={packingInput.itemName} onChange={e => setPackingInput(p => ({ ...p, itemName: e.target.value }))}
                className="input-field flex-1" placeholder="Add item..." onKeyDown={e => e.key === 'Enter' && handleAddPacking()} />
              <select id="packing-category" value={packingInput.category} onChange={e => setPackingInput(p => ({ ...p, category: e.target.value }))} className="input-field w-36">
                {['General', 'Documents', 'Clothing', 'Electronics', 'Health', 'Toiletries'].map(c => <option key={c}>{c}</option>)}
              </select>
              <button id="add-packing-btn" onClick={handleAddPacking} className="btn-primary px-4"><Plus size={16} /></button>
            </div>

            <div className="space-y-2">
              {trip.packingItems?.map(item => (
                <div key={item.id} className="glass rounded-xl p-3 flex items-center gap-3">
                  <button id={`toggle-pack-${item.id}`} onClick={() => handleTogglePacked(item.id, item.isPacked)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ background: item.isPacked ? 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' : 'rgba(255,255,255,0.1)', border: item.isPacked ? 'none' : '2px solid rgba(255,255,255,0.2)' }}>
                    {item.isPacked && <Check size={13} className="text-white" />}
                  </button>
                  <span className="flex-1 text-sm" style={{ color: item.isPacked ? 'rgba(226,232,240,0.4)' : 'rgba(226,232,240,0.9)', textDecoration: item.isPacked ? 'line-through' : 'none' }}>
                    {item.itemName}
                  </span>
                  <span className="badge text-xs" style={{ background: 'rgba(78,205,196,0.1)', color: '#4ecdc4' }}>{item.category}</span>
                  <button onClick={async () => { await tripService.deletePackingItem(item.id); fetchTrip(); }}
                    className="p-1" style={{ color: 'rgba(255,107,107,0.5)' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* NOTES */}
        {tab === 'Notes' && (
          <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="glass rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-white">Add Note</h3>
              <input id="note-title" value={noteInput.title} onChange={e => setNoteInput(p => ({ ...p, title: e.target.value }))}
                className="input-field" placeholder="Note title (optional)" />
              <textarea id="note-content" value={noteInput.content} onChange={e => setNoteInput(p => ({ ...p, content: e.target.value }))}
                className="input-field h-24 resize-none" placeholder="Write your note..." />
              <button id="add-note-btn" onClick={handleAddNote} className="btn-primary"><Plus size={15} /> Add Note</button>
            </div>

            <div className="space-y-3">
              {trip.tripNotes?.map(note => (
                <div key={note.id} className="glass rounded-2xl p-5">
                  {note.title && <h4 className="font-bold text-white mb-2">{note.title}</h4>}
                  <p className="text-sm" style={{ color: 'rgba(226,232,240,0.8)' }}>{note.content}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs" style={{ color: 'rgba(226,232,240,0.4)' }}>{format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}</span>
                    <button onClick={async () => { await tripService.deleteNote(note.id); fetchTrip(); }}
                      className="p-1" style={{ color: 'rgba(255,107,107,0.5)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              {trip.tripNotes?.length === 0 && (
                <div className="text-center py-10">
                  <BookOpen size={40} className="mx-auto mb-2 opacity-20" />
                  <p style={{ color: 'rgba(226,232,240,0.5)' }}>No notes yet</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
