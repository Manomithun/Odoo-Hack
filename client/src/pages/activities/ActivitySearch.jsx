import { useEffect, useState } from 'react';
import { cityService } from '../../services/city.service';
import { Search, Tag, Clock, DollarSign, Star, Filter, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Sightseeing', 'Culture', 'Food', 'Nature', 'Experience', 'Adventure', 'Nightlife', 'Shopping'];
const CAT_COLORS = { Sightseeing: '#4ecdc4', Culture: '#a78bfa', Food: '#f97316', Nature: '#34d399', Experience: '#ff6b6b', Adventure: '#ffd93d', Nightlife: '#ec4899', Shopping: '#60a5fa' };

const CITIES_LIST = [
  { id: 'paris', name: 'Paris' }, { id: 'tokyo', name: 'Tokyo' }, { id: 'bali', name: 'Bali' },
  { id: 'rome', name: 'Rome' }, { id: 'barcelona', name: 'Barcelona' },
  { id: 'dubai', name: 'Dubai' }, { id: 'santorini', name: 'Santorini' }, { id: 'capetown', name: 'Cape Town' },
];

export default function ActivitySearch() {
  const [activities, setActivities] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [minRating, setMinRating] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    cityService.getAll({ limit: 50 }).then(r => {
      const cs = r.data.data || [];
      setCities(cs);
      if (cs.length > 0) loadActivities(cs[0].id, cs);
    }).catch(() => setLoading(false));
  }, []);

  const loadActivities = async (cityId, cs) => {
    setLoading(true);
    try {
      const res = await cityService.getActivities(cityId, { limit: 50 });
      const acts = (res.data.data || []).map(a => ({
        ...a,
        cityName: (cs || cities).find(c => c.id === cityId)?.cityName || '',
      }));
      setActivities(prev => {
        const existing = prev.filter(p => p.cityId !== cityId);
        return [...existing, ...acts];
      });
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (selectedCity && cities.length) loadActivities(selectedCity, cities);
    else if (!selectedCity && cities.length) {
      Promise.all(cities.slice(0, 4).map(c => cityService.getActivities(c.id, { limit: 10 }).then(r => (r.data.data || []).map(a => ({ ...a, cityName: c.cityName })))))
        .then(results => setActivities(results.flat()))
        .finally(() => setLoading(false));
    }
  }, [selectedCity]);

  const filtered = activities.filter(a => {
    const catMatch = category === 'All' || a.category === category;
    const searchMatch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.description?.toLowerCase().includes(search.toLowerCase());
    const costMatch = !maxCost || parseFloat(a.estimatedCost || 0) <= parseFloat(maxCost);
    const ratingMatch = !minRating || parseFloat(a.rating || 0) >= parseFloat(minRating);
    const cityMatch = !selectedCity || a.cityId === selectedCity;
    return catMatch && searchMatch && costMatch && ratingMatch && cityMatch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-white">Activities</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(226,232,240,0.5)' }}>{filtered.length} activities across {cities.length} cities</p>
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(226,232,240,0.4)' }} />
          <input id="activity-search" value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-11" placeholder="Search activities..." />
        </div>
        <select id="activity-city" value={selectedCity} onChange={e => setSelectedCity(e.target.value)} className="input-field sm:w-44">
          <option value="">All Cities</option>
          {cities.map(c => <option key={c.id} value={c.id}>{c.cityName}</option>)}
        </select>
        <button id="toggle-filters" onClick={() => setShowFilters(f => !f)}
          className="btn-secondary gap-2 flex-shrink-0">
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-4 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'rgba(226,232,240,0.5)' }}>Max Cost ($)</label>
            <input id="max-cost" type="number" value={maxCost} onChange={e => setMaxCost(e.target.value)}
              className="input-field w-28 text-sm" placeholder="Any" />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'rgba(226,232,240,0.5)' }}>Min Rating</label>
            <input id="min-rating" type="number" min="0" max="5" step="0.5" value={minRating} onChange={e => setMinRating(e.target.value)}
              className="input-field w-24 text-sm" placeholder="Any" />
          </div>
          <button onClick={() => { setMaxCost(''); setMinRating(''); setCategory('All'); setSearch(''); setSelectedCity(''); }}
            className="btn-ghost text-sm py-2">Clear All</button>
        </motion.div>
      )}

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button key={cat} id={`cat-${cat}`} onClick={() => setCategory(cat)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium flex-shrink-0 transition-all"
            style={{
              background: category === cat ? (cat === 'All' ? 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' : `${CAT_COLORS[cat] || '#4ecdc4'}20`) : 'rgba(255,255,255,0.05)',
              color: category === cat ? (cat === 'All' ? 'white' : CAT_COLORS[cat]) : 'rgba(226,232,240,0.5)',
              border: category === cat && cat !== 'All' ? `1px solid ${CAT_COLORS[cat]}30` : '1px solid transparent',
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Activity grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="glass rounded-2xl h-64 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Tag size={48} className="mx-auto mb-3 opacity-20" />
          <p style={{ color: 'rgba(226,232,240,0.4)' }}>No activities found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((activity, i) => (
            <motion.div key={activity.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="glass rounded-2xl overflow-hidden card-hover">
              {activity.imageUrl && (
                <div className="h-40 overflow-hidden relative">
                  <img src={activity.imageUrl} alt={activity.title} className="w-full h-full object-cover" />
                  {activity.category && (
                    <div className="absolute top-3 left-3 badge text-xs"
                      style={{ background: `${CAT_COLORS[activity.category] || '#4ecdc4'}25`, color: CAT_COLORS[activity.category] || '#4ecdc4', backdropFilter: 'blur(8px)' }}>
                      {activity.category}
                    </div>
                  )}
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-bold text-white text-sm leading-snug">{activity.title}</h3>
                  {activity.rating && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star size={11} fill="#ffd93d" style={{ color: '#ffd93d' }} />
                      <span className="text-xs font-bold" style={{ color: '#ffd93d' }}>{activity.rating}</span>
                    </div>
                  )}
                </div>

                {activity.cityName && (
                  <p className="text-xs mb-2" style={{ color: '#4ecdc4' }}>📍 {activity.cityName}</p>
                )}

                {activity.description && (
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: 'rgba(226,232,240,0.45)' }}>{activity.description}</p>
                )}

                <div className="flex items-center gap-3 text-xs" style={{ color: 'rgba(226,232,240,0.45)' }}>
                  {activity.durationHours && (
                    <span className="flex items-center gap-1"><Clock size={10} /> {activity.durationHours}h</span>
                  )}
                  {activity.estimatedCost != null && (
                    <span className="flex items-center gap-1 ml-auto font-bold" style={{ color: '#ffd93d' }}>
                      <DollarSign size={10} />{parseFloat(activity.estimatedCost).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
