import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cityService } from '../../services/city.service';
import { Search, Star, DollarSign, Globe, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CitySearch() {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);
  const limit = 12;

  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await cityService.getAll({ search, country, page, limit, sortBy });
      setCities(res.data.data || []);
      setTotal(res.data.pagination?.total || 0);
    } catch { toast.error('Failed to load cities'); }
    finally { setLoading(false); }
  };

  const fetchSaved = async () => {
    try {
      const res = await cityService.getSaved();
      setSavedIds((res.data.data || []).map(s => s.cityId));
    } catch {}
  };

  useEffect(() => { fetchCities(); }, [search, country, sortBy, page]);
  useEffect(() => { fetchSaved(); }, []);

  const toggleSave = async (cityId, e) => {
    e.preventDefault();
    try {
      if (savedIds.includes(cityId)) {
        await cityService.unsave(cityId);
        setSavedIds(p => p.filter(id => id !== cityId));
        toast.success('Removed from saved');
      } else {
        await cityService.save(cityId);
        setSavedIds(p => [...p, cityId]);
        toast.success('Saved to favourites!');
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-3xl text-white">Explore Cities</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(226,232,240,0.5)' }}>{total} destinations worldwide</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(226,232,240,0.4)' }} />
          <input id="city-search" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-10" placeholder="Search cities..." />
        </div>
        <input id="country-filter" value={country} onChange={e => { setCountry(e.target.value); setPage(1); }}
          className="input-field sm:w-40" placeholder="Country..." />
        <select id="sort-by" value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-field sm:w-40">
          <option value="popularity">Most Popular</option>
          <option value="cost">Lowest Cost</option>
          <option value="name">A-Z</option>
        </select>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="glass rounded-2xl h-56 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cities.map((city, i) => (
            <motion.div key={city.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link to={`/cities/${city.id}`} className="relative rounded-2xl overflow-hidden card-hover block h-56">
                <img src={city.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'} alt={city.cityName} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,12,27,0.95) 0%, rgba(2,12,27,0.2) 60%)' }} />

                <button id={`save-city-${city.id}`} onClick={(e) => toggleSave(city.id, e)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center glass transition-transform hover:scale-110">
                  <Heart size={14} style={{ color: savedIds.includes(city.id) ? '#ff6b6b' : 'rgba(226,232,240,0.6)', fill: savedIds.includes(city.id) ? '#ff6b6b' : 'none' }} />
                </button>

                <div className="absolute top-3 left-3">
                  <span className="badge" style={{ background: 'rgba(255,217,61,0.25)', color: '#ffd93d', fontSize: '11px' }}>
                    ⭐ {city.popularityScore}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="font-bold text-white text-lg leading-tight">{city.cityName}</h3>
                  <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: 'rgba(226,232,240,0.6)' }}>
                    <Globe size={10} /> {city.countryName}
                  </div>
                  {city.costIndex && (
                    <div className="flex items-center gap-1 text-xs mt-1" style={{ color: '#4ecdc4' }}>
                      <DollarSign size={10} /> Cost index: {city.costIndex}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {total > limit && (
        <div className="flex justify-center gap-2">
          {[...Array(Math.ceil(total / limit))].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className="w-9 h-9 rounded-xl text-sm font-medium"
              style={{ background: page === i + 1 ? 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' : 'rgba(255,255,255,0.05)', color: 'white' }}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
