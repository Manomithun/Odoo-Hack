import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tripService } from '../../services/trip.service';
import { motion } from 'framer-motion';
import { Plus, Search, Calendar, MapPin, DollarSign, Trash2, Map, Clock, CheckCircle } from 'lucide-react';
import { format, isPast, isFuture, isWithinInterval } from 'date-fns';
import toast from 'react-hot-toast';

const TABS = [
  { key: 'all', label: 'All Trips', icon: Map },
  { key: 'ongoing', label: 'Ongoing', icon: Clock },
  { key: 'upcoming', label: 'Upcoming', icon: Calendar },
  { key: 'completed', label: 'Completed', icon: CheckCircle },
];

function classifyTrip(trip) {
  const now = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  if (isWithinInterval(now, { start, end })) return 'ongoing';
  if (isFuture(start)) return 'upcoming';
  return 'completed';
}

export default function TripsList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9;

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await tripService.getAll({ page, limit, search });
      setTrips(res.data.data || []);
      setTotal(res.data.pagination?.total || 0);
    } catch { toast.error('Failed to load trips'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTrips(); }, [page, search]);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!confirm('Delete this trip? This cannot be undone.')) return;
    try { await tripService.delete(id); toast.success('Trip deleted'); fetchTrips(); }
    catch { toast.error('Failed to delete'); }
  };

  const filtered = activeTab === 'all' ? trips : trips.filter(t => classifyTrip(t) === activeTab);

  const counts = {
    all: trips.length,
    ongoing: trips.filter(t => classifyTrip(t) === 'ongoing').length,
    upcoming: trips.filter(t => classifyTrip(t) === 'upcoming').length,
    completed: trips.filter(t => classifyTrip(t) === 'completed').length,
  };

  const STATUS_STYLES = {
    ongoing: { bg: 'rgba(78,205,196,0.15)', color: '#4ecdc4', label: 'Ongoing' },
    upcoming: { bg: 'rgba(167,139,250,0.15)', color: '#a78bfa', label: 'Upcoming' },
    completed: { bg: 'rgba(255,255,255,0.08)', color: 'rgba(226,232,240,0.5)', label: 'Completed' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">My Trips</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(226,232,240,0.5)' }}>{total} adventures planned</p>
        </div>
        <Link to="/trips/new" id="create-trip-btn" className="btn-primary"><Plus size={16} /> New Trip</Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(226,232,240,0.4)' }} />
        <input id="trip-search" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="input-field pl-11" placeholder="Search your trips..." />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} id={`tab-${key}`} onClick={() => setActiveTab(key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium flex-shrink-0 transition-all"
            style={{
              background: activeTab === key ? 'linear-gradient(135deg, rgba(255,107,107,0.2), rgba(78,205,196,0.2))' : 'rgba(255,255,255,0.05)',
              color: activeTab === key ? 'white' : 'rgba(226,232,240,0.5)',
              border: activeTab === key ? '1px solid rgba(78,205,196,0.3)' : '1px solid transparent',
            }}>
            <Icon size={14} />
            {label}
            <span className="px-1.5 py-0.5 rounded-md text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>{counts[key]}</span>
          </button>
        ))}
      </div>

      {/* Trip grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="glass rounded-2xl h-64 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Map size={56} className="mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-bold text-white mb-2">No {activeTab !== 'all' ? activeTab : ''} trips</h3>
          <p className="mb-5" style={{ color: 'rgba(226,232,240,0.4)' }}>
            {activeTab === 'all' ? 'Start planning your first adventure!' : `No ${activeTab} trips found.`}
          </p>
          {activeTab === 'all' && (
            <Link to="/trips/new" className="btn-primary inline-flex"><Plus size={15} /> Create Trip</Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((trip, i) => {
            const status = classifyTrip(trip);
            const style = STATUS_STYLES[status];
            const days = Math.round((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000);
            return (
              <motion.div key={trip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Link to={`/trips/${trip.id}`} className="glass rounded-2xl overflow-hidden card-hover block group">
                  {/* Cover */}
                  <div className="h-44 relative overflow-hidden">
                    <img src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600'}
                      alt={trip.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,12,27,0.95) 0%, transparent 55%)' }} />
                    {/* Status badge */}
                    <div className="absolute top-3 left-3 badge" style={{ background: style.bg, color: style.color }}>
                      {style.label}
                    </div>
                    <div className="absolute top-3 right-3 badge" style={{ background: trip.visibility === 'public' ? 'rgba(78,205,196,0.2)' : 'rgba(0,0,0,0.4)', color: trip.visibility === 'public' ? '#4ecdc4' : 'rgba(226,232,240,0.6)' }}>
                      {trip.visibility}
                    </div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="font-bold text-white text-lg leading-tight">{trip.title}</h3>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm" style={{ color: 'rgba(226,232,240,0.55)' }}>
                      <span className="flex items-center gap-1.5"><Calendar size={12} /> {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-sm" style={{ color: 'rgba(226,232,240,0.55)' }}>
                        <MapPin size={12} /> {trip._count?.tripStops || 0} cities · {days} days
                      </span>
                      <span className="font-bold" style={{ color: '#ffd93d' }}>
                        ${parseFloat(trip.totalEstimatedBudget || 0).toLocaleString()}
                      </span>
                    </div>

                    {/* City pills */}
                    {trip.tripStops?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {trip.tripStops.slice(0, 3).map(s => (
                          <span key={s.id} className="badge text-xs" style={{ background: 'rgba(78,205,196,0.08)', color: '#4ecdc4' }}>
                            {s.city?.cityName}
                          </span>
                        ))}
                        {trip.tripStops.length > 3 && (
                          <span className="badge text-xs" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(226,232,240,0.4)' }}>
                            +{trip.tripStops.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Progress bar for ongoing */}
                    {status === 'ongoing' && (
                      <div>
                        <div className="flex justify-between text-xs mb-1" style={{ color: 'rgba(226,232,240,0.4)' }}>
                          <span>Trip progress</span>
                          <span>{Math.round(((new Date() - new Date(trip.startDate)) / (new Date(trip.endDate) - new Date(trip.startDate))) * 100)}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div className="h-full rounded-full" style={{
                            width: `${Math.min(100, Math.round(((new Date() - new Date(trip.startDate)) / (new Date(trip.endDate) - new Date(trip.startDate))) * 100))}%`,
                            background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)'
                          }} />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <Link to={`/trips/${trip.id}/itinerary`} id={`itinerary-${trip.id}`}
                        onClick={e => e.stopPropagation()}
                        className="flex-1 text-center py-1.5 text-xs rounded-lg font-medium transition-all"
                        style={{ background: 'rgba(78,205,196,0.1)', color: '#4ecdc4', border: '1px solid rgba(78,205,196,0.2)' }}>
                        Itinerary
                      </Link>
                      <button id={`delete-trip-${trip.id}`} onClick={(e) => handleDelete(trip.id, e)}
                        className="px-3 py-1.5 rounded-lg text-xs transition-all"
                        style={{ color: 'rgba(255,107,107,0.5)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.08)'; e.currentTarget.style.color = '#ff6b6b'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,107,107,0.5)'; }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {total > limit && (
        <div className="flex justify-center gap-2 pt-2">
          {[...Array(Math.ceil(total / limit))].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className="w-9 h-9 rounded-xl text-sm font-medium transition-all"
              style={{ background: page === i + 1 ? 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' : 'rgba(255,255,255,0.06)', color: 'white' }}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
