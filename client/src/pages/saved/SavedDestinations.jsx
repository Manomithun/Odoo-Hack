import { useEffect, useState } from 'react';
import { cityService } from '../../services/city.service';
import { Link } from 'react-router-dom';
import { Heart, Globe, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function SavedDestinations() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cityService.getSaved()
      .then(res => setSaved(res.data.data || []))
      .catch(() => toast.error('Failed to load saved destinations'))
      .finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (cityId) => {
    try {
      await cityService.unsave(cityId);
      setSaved(p => p.filter(s => s.cityId !== cityId));
      toast.success('Removed from saved');
    } catch { toast.error('Failed to remove'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-3xl text-white">Saved Places</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(226,232,240,0.5)' }}>{saved.length} destinations saved</p>
      </div>
      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="glass rounded-2xl h-56 animate-pulse" />)}
        </div>
      ) : saved.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={64} className="mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-bold text-white mb-2">No saved places yet</h3>
          <p style={{ color: 'rgba(226,232,240,0.5)' }}>Explore cities and save your favourites</p>
          <Link to="/cities" className="btn-primary mt-4 inline-flex"><Globe size={15} /> Explore Cities</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {saved.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Link to={`/cities/${s.cityId}`} className="relative rounded-2xl overflow-hidden card-hover block h-56">
                <img src={s.city?.imageUrl} alt={s.city?.cityName} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,12,27,0.9) 0%, transparent 60%)' }} />
                <button id={`unsave-${s.cityId}`} onClick={(e) => { e.preventDefault(); handleUnsave(s.cityId); }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center">
                  <Heart size={14} fill="#ff6b6b" style={{ color: '#ff6b6b' }} />
                </button>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="font-bold text-white text-lg">{s.city?.cityName}</h3>
                  <p className="text-sm" style={{ color: 'rgba(226,232,240,0.6)' }}>{s.city?.countryName}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
