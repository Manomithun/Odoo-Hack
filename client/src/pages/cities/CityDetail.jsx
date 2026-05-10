import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cityService } from '../../services/city.service';
import { ArrowLeft, Star, DollarSign, Clock, Tag, Globe, Heart, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [city, setCity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    Promise.all([
      cityService.getById(id),
      cityService.getActivities(id, { limit: 50 }),
    ]).then(([cityRes, actsRes]) => {
      setCity(cityRes.data.data);
      setActivities(actsRes.data.data || []);
    }).catch(() => { toast.error('City not found'); navigate('/cities'); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64 text-white">Loading...</div>;
  if (!city) return null;

  const categories = [...new Set(activities.map(a => a.category).filter(Boolean))];
  const filtered = filter ? activities.filter(a => a.category === filter) : activities;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden h-72">
        <img src={city.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'} alt={city.cityName} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,12,27,0.95) 0%, rgba(2,12,27,0.2) 100%)' }} />
        <button onClick={() => navigate('/cities')} className="absolute top-5 left-5 btn-ghost glass p-2 rounded-xl">
          <ArrowLeft size={18} />
        </button>
        <div className="absolute bottom-0 left-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge" style={{ background: 'rgba(255,217,61,0.2)', color: '#ffd93d' }}>⭐ {city.popularityScore}</span>
            {city.costIndex && <span className="badge" style={{ background: 'rgba(78,205,196,0.2)', color: '#4ecdc4' }}>Cost: {city.costIndex}/100</span>}
          </div>
          <h1 className="font-display font-bold text-5xl text-white">{city.cityName}</h1>
          <div className="flex items-center gap-2 mt-2" style={{ color: 'rgba(226,232,240,0.7)' }}>
            <Globe size={14} /> <span>{city.countryName}{city.region && ` · ${city.region}`}</span>
          </div>
          {city.description && <p className="text-sm mt-2 max-w-lg" style={{ color: 'rgba(226,232,240,0.6)' }}>{city.description}</p>}
        </div>
      </div>

      {/* Activities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-2xl text-white">{city._count?.activities || activities.length} Activities</h2>
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            <button onClick={() => setFilter('')}
              className="badge px-4 py-2 cursor-pointer transition-all"
              style={{ background: !filter ? 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' : 'rgba(255,255,255,0.08)', color: 'white' }}>
              All
            </button>
            {categories.map(cat => (
              <button key={cat} id={`filter-${cat}`} onClick={() => setFilter(cat)}
                className="badge px-4 py-2 cursor-pointer transition-all"
                style={{ background: filter === cat ? 'rgba(78,205,196,0.2)' : 'rgba(255,255,255,0.08)', color: filter === cat ? '#4ecdc4' : 'rgba(226,232,240,0.7)' }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((activity, i) => (
            <motion.div key={activity.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="glass rounded-2xl overflow-hidden card-hover">
              {activity.imageUrl && (
                <img src={activity.imageUrl} alt={activity.title} className="w-full h-36 object-cover" />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-white leading-tight">{activity.title}</h3>
                  {activity.rating && (
                    <div className="flex items-center gap-1 flex-shrink-0 text-xs" style={{ color: '#ffd93d' }}>
                      <Star size={11} fill="#ffd93d" /> {activity.rating}
                    </div>
                  )}
                </div>
                {activity.description && (
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: 'rgba(226,232,240,0.5)' }}>{activity.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs" style={{ color: 'rgba(226,232,240,0.5)' }}>
                  {activity.category && (
                    <span className="flex items-center gap-1">
                      <Tag size={10} /> {activity.category}
                    </span>
                  )}
                  {activity.durationHours && (
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> {activity.durationHours}h
                    </span>
                  )}
                  {activity.estimatedCost && (
                    <span className="flex items-center gap-1 ml-auto font-bold" style={{ color: '#ffd93d' }}>
                      <DollarSign size={10} /> ${activity.estimatedCost}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
