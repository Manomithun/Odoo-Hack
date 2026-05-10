import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { tripService } from '../../services/trip.service';
import { cityService } from '../../services/city.service';
import { Map, Globe, PiggyBank, Plus, TrendingUp, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="glass rounded-2xl p-5 card-hover">
    <div className="flex items-center justify-between mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
        <Icon size={20} style={{ color }} />
      </div>
    </div>
    <p className="text-3xl font-display font-bold text-white">{value}</p>
    <p className="text-sm mt-1" style={{ color: 'rgba(226,232,240,0.5)' }}>{label}</p>
  </motion.div>
);

export default function Dashboard() {
  const { user } = useAuthStore();
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      tripService.getAll({ limit: 4 }),
      cityService.getAll({ limit: 6, sortBy: 'popularity' }),
    ]).then(([tripsRes, citiesRes]) => {
      setTrips(tripsRes.data.data || []);
      setCities(citiesRes.data.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const totalBudget = trips.reduce((s, t) => s + parseFloat(t.totalEstimatedBudget || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero greeting */}
      <div className="relative rounded-3xl overflow-hidden p-8"
        style={{ background: 'linear-gradient(135deg, #0f3460 0%, #1a4a7e 50%, #0d2137 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10">
          <p className="text-sm font-medium mb-1" style={{ color: '#4ecdc4' }}>{greeting()},</p>
          <h1 className="font-display font-bold text-4xl text-white mb-2">{user?.fullName} ✈️</h1>
          <p style={{ color: 'rgba(226,232,240,0.6)' }}>Ready for your next adventure?</p>
          <Link to="/trips/new" id="dashboard-create-trip" className="btn-primary mt-4 inline-flex">
            <Plus size={16} /> Plan a Trip
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Map} label="Total Trips" value={trips.length} color="#4ecdc4" delay={0.1} />
        <StatCard icon={Globe} label="Cities Planned" value={trips.reduce((s, t) => s + (t._count?.tripStops || 0), 0)} color="#ff6b6b" delay={0.2} />
        <StatCard icon={PiggyBank} label="Total Budget" value={`$${totalBudget.toLocaleString()}`} color="#ffd93d" delay={0.3} />
        <StatCard icon={TrendingUp} label="Upcoming" value={trips.filter(t => new Date(t.startDate) > new Date()).length} color="#a78bfa" delay={0.4} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'New Trip', to: '/trips/new', icon: Plus, color: '#ff6b6b' },
          { label: 'Explore Cities', to: '/cities', icon: Globe, color: '#4ecdc4' },
          { label: 'My Trips', to: '/trips', icon: Map, color: '#ffd93d' },
          { label: 'Saved Places', to: '/saved', icon: Calendar, color: '#a78bfa' },
        ].map(({ label, to, icon: Icon, color }) => (
          <Link key={to} to={to} id={`quick-${label.toLowerCase().replace(' ', '-')}`}
            className="glass rounded-2xl p-4 flex flex-col items-center gap-2 card-hover text-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <span className="text-sm font-medium text-white">{label}</span>
          </Link>
        ))}
      </div>

      {/* Recent trips */}
      {trips.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-white">Recent Trips</h2>
            <Link to="/trips" className="text-sm flex items-center gap-1" style={{ color: '#4ecdc4' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {trips.slice(0, 4).map((trip, i) => (
              <motion.div key={trip.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <Link to={`/trips/${trip.id}`} className="glass rounded-2xl overflow-hidden card-hover block">
                  <div className="h-36 relative">
                    <img src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600'}
                      alt={trip.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,12,27,0.9) 0%, transparent 60%)' }} />
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="font-bold text-white text-lg leading-tight">{trip.title}</h3>
                      <div className="flex items-center gap-1 text-xs mt-1" style={{ color: 'rgba(226,232,240,0.6)' }}>
                        <Calendar size={11} />
                        {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 badge"
                      style={{ background: trip.visibility === 'public' ? 'rgba(78,205,196,0.2)' : 'rgba(255,255,255,0.1)', color: trip.visibility === 'public' ? '#4ecdc4' : '#e2e8f0' }}>
                      {trip.visibility}
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm" style={{ color: 'rgba(226,232,240,0.6)' }}>
                      <MapPin size={13} /> {trip._count?.tripStops || 0} cities
                    </div>
                    <span className="font-bold" style={{ color: '#ffd93d' }}>${parseFloat(trip.totalEstimatedBudget || 0).toLocaleString()}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Discover cities */}
      {cities.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-white">Discover Destinations</h2>
            <Link to="/cities" className="text-sm flex items-center gap-1" style={{ color: '#4ecdc4' }}>
              Explore <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {cities.map((city, i) => (
              <motion.div key={city.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
                <Link to={`/cities/${city.id}`} className="relative rounded-2xl overflow-hidden card-hover block h-40">
                  <img src={city.imageUrl} alt={city.cityName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,12,27,0.85) 0%, transparent 50%)' }} />
                  <div className="absolute bottom-0 left-0 p-3">
                    <p className="font-bold text-white">{city.cityName}</p>
                    <p className="text-xs" style={{ color: 'rgba(226,232,240,0.7)' }}>{city.countryName}</p>
                  </div>
                  <div className="absolute top-2 right-2 badge" style={{ background: 'rgba(255,217,61,0.2)', color: '#ffd93d' }}>
                    ⭐ {city.popularityScore}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
