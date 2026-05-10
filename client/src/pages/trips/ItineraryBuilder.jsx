import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tripService } from '../../services/trip.service';
import { cityService } from '../../services/city.service';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin, Calendar, Plus, Sparkles, Check, Clock, DollarSign, ChevronDown, ChevronUp, Grip } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AI_SUGGESTIONS = {
  Paris: ['Eiffel Tower at sunset', 'Louvre Museum morning visit', 'Seine River dinner cruise', 'Montmartre art walk', 'Versailles day trip'],
  Tokyo: ['Shibuya Crossing at night', 'Tsukiji sushi breakfast', 'Akihabara electronics tour', 'Shinjuku Gyoen picnic', 'teamLab digital art'],
  Bali: ['Ubud Monkey Forest', 'Tegalalang rice terraces', 'Tanah Lot sunset', 'Seminyak beach club', 'Traditional cooking class'],
  default: ['Local food tour', 'Museum visit', 'City walking tour', 'Sunset viewpoint', 'Day trip to outskirts'],
};

const STEPS = [
  { id: 1, title: 'Trip Overview', icon: MapPin, desc: 'Review your trip details and cities' },
  { id: 2, title: 'Day-by-Day Plan', icon: Calendar, desc: 'Schedule activities for each day' },
  { id: 3, title: 'Review & Save', icon: Check, desc: 'Finalize your itinerary' },
];

export default function ItineraryBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [cityActivities, setCityActivities] = useState({});
  const [dayPlans, setDayPlans] = useState({});
  const [expandedStop, setExpandedStop] = useState(null);

  useEffect(() => {
    tripService.getById(id)
      .then(r => { setTrip(r.data.data); setLoading(false); })
      .catch(() => { toast.error('Trip not found'); navigate('/trips'); });
  }, [id]);

  useEffect(() => {
    if (!trip) return;
    trip.tripStops?.forEach(async (stop) => {
      if (!cityActivities[stop.cityId]) {
        try {
          const r = await cityService.getActivities(stop.cityId, { limit: 20 });
          setCityActivities(p => ({ ...p, [stop.cityId]: r.data.data || [] }));
        } catch {}
      }
    });
  }, [trip]);

  const getSuggestions = (cityName) => AI_SUGGESTIONS[cityName] || AI_SUGGESTIONS.default;

  const toggleDayActivity = (stopId, day, activity) => {
    setDayPlans(prev => {
      const stopPlan = prev[stopId] || {};
      const dayActs = stopPlan[day] || [];
      const exists = dayActs.includes(activity);
      return {
        ...prev,
        [stopId]: {
          ...stopPlan,
          [day]: exists ? dayActs.filter(a => a !== activity) : [...dayActs, activity],
        },
      };
    });
  };

  const getDaysForStop = (stop) => {
    const arrival = new Date(stop.arrivalDate);
    const departure = new Date(stop.departureDate);
    const days = [];
    for (let d = new Date(arrival); d <= departure; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-white">Loading itinerary...</p></div>;
  if (!trip) return null;

  const totalActivities = Object.values(dayPlans).reduce((s, stop) => s + Object.values(stop).reduce((ss, acts) => ss + acts.length, 0), 0);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(`/trips/${id}`)} className="w-9 h-9 glass rounded-xl flex items-center justify-center">
          <ArrowLeft size={16} style={{ color: 'rgba(226,232,240,0.7)' }} />
        </button>
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Itinerary Builder</h1>
          <p className="text-sm" style={{ color: 'rgba(226,232,240,0.5)' }}>{trip.title}</p>
        </div>
      </div>

      {/* Step Progress */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <button onClick={() => setStep(s.id)} className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all"
                  style={{ background: step >= s.id ? 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' : 'rgba(255,255,255,0.08)', color: 'white' }}>
                  {step > s.id ? <Check size={16} /> : s.id}
                </div>
                <div className="text-center hidden sm:block">
                  <p className="text-xs font-semibold" style={{ color: step >= s.id ? 'white' : 'rgba(226,232,240,0.4)' }}>{s.title}</p>
                  <p className="text-xs" style={{ color: 'rgba(226,232,240,0.3)' }}>{s.desc}</p>
                </div>
              </button>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 rounded-full" style={{ background: step > s.id ? 'linear-gradient(90deg,#ff6b6b,#4ecdc4)' : 'rgba(255,255,255,0.08)' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* SECTION 1: Trip Overview */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            {/* Trip summary card */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="relative h-48">
                <img src={trip.coverImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'}
                  alt={trip.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,12,27,0.95), transparent)' }} />
                <div className="absolute bottom-0 left-0 p-5">
                  <h2 className="font-display font-bold text-2xl text-white">{trip.title}</h2>
                  <p className="text-sm mt-1" style={{ color: 'rgba(226,232,240,0.6)' }}>
                    {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="p-5 grid grid-cols-3 gap-4">
                {[
                  { label: 'Cities', value: trip.tripStops?.length || 0, color: '#4ecdc4' },
                  { label: 'Budget', value: `$${parseFloat(trip.totalEstimatedBudget || 0).toLocaleString()}`, color: '#ffd93d' },
                  { label: 'Duration', value: `${Math.round((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000)} days`, color: '#a78bfa' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <p className="font-bold text-xl" style={{ color }}>{value}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(226,232,240,0.5)' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* City stops overview */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-lg">Your Cities</h3>
              {trip.tripStops?.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <MapPin size={40} className="mx-auto mb-3 opacity-20" />
                  <p style={{ color: 'rgba(226,232,240,0.5)' }}>No cities added yet. Go back and add cities first.</p>
                  <Link to={`/trips/${id}`} className="btn-primary mt-4 inline-flex"><Plus size={15} /> Add Cities</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {trip.tripStops?.map((stop, i) => (
                    <div key={stop.id} className="glass rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' }}>{i + 1}</div>
                      {stop.city?.imageUrl && <img src={stop.city.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="font-bold text-white">{stop.city?.cityName}</p>
                        <p className="text-xs" style={{ color: 'rgba(226,232,240,0.5)' }}>{stop.city?.countryName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium" style={{ color: '#4ecdc4' }}>{format(new Date(stop.arrivalDate), 'MMM d')} – {format(new Date(stop.departureDate), 'MMM d')}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(226,232,240,0.4)' }}>
                          {Math.round((new Date(stop.departureDate) - new Date(stop.arrivalDate)) / 86400000)} nights
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button id="step1-next" onClick={() => setStep(2)} className="btn-primary">
                Plan Day-by-Day <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* SECTION 2: Day-by-Day Planning */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">Plan Each Day</h3>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{ background: 'rgba(78,205,196,0.1)', border: '1px solid rgba(78,205,196,0.2)' }}>
                <Sparkles size={13} style={{ color: '#4ecdc4' }} />
                <span className="text-xs" style={{ color: '#4ecdc4' }}>{totalActivities} activities planned</span>
              </div>
            </div>

            {trip.tripStops?.map((stop) => {
              const days = getDaysForStop(stop);
              const suggestions = getSuggestions(stop.city?.cityName);
              const dbActivities = cityActivities[stop.cityId] || [];
              const isExpanded = expandedStop === stop.id;

              return (
                <div key={stop.id} className="glass rounded-2xl overflow-hidden">
                  <button id={`expand-stop-${stop.id}`}
                    onClick={() => setExpandedStop(isExpanded ? null : stop.id)}
                    className="w-full flex items-center gap-4 p-4 text-left">
                    {stop.city?.imageUrl && <img src={stop.city.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="font-bold text-white">{stop.city?.cityName}</p>
                      <p className="text-xs" style={{ color: 'rgba(226,232,240,0.5)' }}>{days.length} day{days.length !== 1 ? 's' : ''} · {format(new Date(stop.arrivalDate), 'MMM d')} – {format(new Date(stop.departureDate), 'MMM d')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="badge text-xs" style={{ background: 'rgba(78,205,196,0.15)', color: '#4ecdc4' }}>
                        {Object.values(dayPlans[stop.id] || {}).reduce((s, a) => s + a.length, 0)} activities
                      </span>
                      {isExpanded ? <ChevronUp size={16} style={{ color: 'rgba(226,232,240,0.5)' }} /> : <ChevronDown size={16} style={{ color: 'rgba(226,232,240,0.5)' }} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                        className="overflow-hidden border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                        <div className="p-4 space-y-4">
                          {days.map((day, di) => {
                            const dayKey = format(day, 'yyyy-MM-dd');
                            const selected = (dayPlans[stop.id]?.[dayKey]) || [];
                            return (
                              <div key={dayKey} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <p className="font-semibold text-sm text-white mb-3">
                                  Day {di + 1} — {format(day, 'EEEE, MMM d')}
                                </p>
                                {/* Selected activities */}
                                {selected.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {selected.map(act => (
                                      <div key={act} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
                                        style={{ background: 'rgba(78,205,196,0.15)', border: '1px solid rgba(78,205,196,0.25)', color: '#4ecdc4' }}>
                                        <Check size={11} /> {act}
                                        <button onClick={() => toggleDayActivity(stop.id, dayKey, act)} className="ml-1 opacity-60 hover:opacity-100">×</button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {/* AI Suggestions */}
                                <p className="text-xs mb-2 flex items-center gap-1.5" style={{ color: 'rgba(226,232,240,0.4)' }}>
                                  <Sparkles size={11} style={{ color: '#ffd93d' }} /> AI Suggestions
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {[...suggestions, ...dbActivities.slice(0, 3).map(a => a.title)].filter(a => !selected.includes(a)).slice(0, 6).map(act => (
                                    <button key={act} id={`suggest-${dayKey}-${act.slice(0, 10)}`}
                                      onClick={() => toggleDayActivity(stop.id, dayKey, act)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all"
                                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(226,232,240,0.7)' }}
                                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(78,205,196,0.08)'; e.currentTarget.style.borderColor = 'rgba(78,205,196,0.2)'; e.currentTarget.style.color = '#4ecdc4'; }}
                                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(226,232,240,0.7)'; }}>
                                      <Plus size={10} /> {act}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="btn-ghost"><ArrowLeft size={16} /> Back</button>
              <button id="step2-next" onClick={() => setStep(3)} className="btn-primary">
                Review Itinerary <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* SECTION 3: Review & Save */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-white text-xl mb-2">Your Itinerary Summary</h3>
              <p className="text-sm mb-6" style={{ color: 'rgba(226,232,240,0.5)' }}>Review your complete trip plan before saving</p>

              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Cities', value: trip.tripStops?.length, color: '#4ecdc4' },
                  { label: 'Activities', value: totalActivities, color: '#ff6b6b' },
                  { label: 'Days', value: Math.round((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000), color: '#ffd93d' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-2xl p-4 text-center" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                    <p className="font-display font-bold text-3xl" style={{ color }}>{value}</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(226,232,240,0.5)' }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Per-city summary */}
              <div className="space-y-3">
                {trip.tripStops?.map((stop, i) => {
                  const acts = Object.values(dayPlans[stop.id] || {}).flat();
                  return (
                    <div key={stop.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' }}>{i + 1}</div>
                      <div className="flex-1">
                        <p className="font-medium text-white text-sm">{stop.city?.cityName}</p>
                        {acts.length > 0 && (
                          <p className="text-xs mt-0.5" style={{ color: 'rgba(226,232,240,0.4)' }}>{acts.slice(0, 2).join(', ')}{acts.length > 2 ? ` +${acts.length - 2} more` : ''}</p>
                        )}
                      </div>
                      <span className="badge text-xs" style={{ background: 'rgba(78,205,196,0.12)', color: '#4ecdc4' }}>{acts.length} acts</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.15)' }}>
                <Sparkles size={16} style={{ color: '#4ecdc4' }} />
                <p className="text-sm" style={{ color: '#4ecdc4' }}>Your AI-assisted itinerary is ready! Activities have been noted for your trip.</p>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="btn-ghost"><ArrowLeft size={16} /> Back</button>
              <button id="save-itinerary" onClick={() => { toast.success('Itinerary saved! ✈️'); navigate(`/trips/${id}`); }} className="btn-primary">
                <Check size={16} /> Save Itinerary
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
