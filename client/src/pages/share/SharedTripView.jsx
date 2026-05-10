import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { cityService } from '../../services/city.service';
import { MapPin, Calendar, User, DollarSign, Clock, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function SharedTripView() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cityService.getSharedTrip(token)
      .then(res => setData(res.data.data))
      .catch(() => setError('Shared trip not found or has been removed.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#020c1b' }}><p className="text-white">Loading trip...</p></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#020c1b' }}><p style={{ color: '#ff6b6b' }}>{error}</p></div>;

  const { trip } = data;

  return (
    <div className="min-h-screen" style={{ background: '#020c1b' }}>
      {/* Hero */}
      <div className="relative h-80">
        <img src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400'} alt={trip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #020c1b 0%, rgba(2,12,27,0.4) 100%)' }} />
        <div className="absolute inset-x-0 bottom-0 max-w-4xl mx-auto px-6 pb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)', color: 'white' }}>
              {trip.user?.fullName?.[0]}
            </div>
            <span className="text-sm" style={{ color: 'rgba(226,232,240,0.7)' }}>{trip.user?.fullName}</span>
            <span className="badge ml-2" style={{ background: 'rgba(78,205,196,0.2)', color: '#4ecdc4', fontSize: '11px' }}>
              <Eye size={10} className="inline mr-1" /> {data.viewCount} views
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl text-white mb-2">{trip.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'rgba(226,232,240,0.6)' }}>
            <span className="flex items-center gap-1"><Calendar size={13} /> {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}</span>
            <span className="flex items-center gap-1"><DollarSign size={13} style={{ color: '#ffd93d' }} /><span style={{ color: '#ffd93d' }}>${parseFloat(trip.totalEstimatedBudget || 0).toLocaleString()}</span></span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Itinerary */}
        <section>
          <h2 className="font-display font-bold text-2xl text-white mb-5">Itinerary — {trip.tripStops?.length} Cities</h2>
          <div className="space-y-4">
            {trip.tripStops?.map((stop, i) => (
              <motion.div key={stop.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl overflow-hidden">
                <div className="flex items-center gap-4 p-5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' }}>{i + 1}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-xl">{stop.city?.cityName}</h3>
                    <p className="text-sm" style={{ color: 'rgba(226,232,240,0.5)' }}>{stop.city?.countryName}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(226,232,240,0.4)' }}>
                      {format(new Date(stop.arrivalDate), 'MMM d')} – {format(new Date(stop.departureDate), 'MMM d')}
                    </p>
                  </div>
                </div>
                {stop.tripActivities?.length > 0 && (
                  <div className="px-5 pb-5">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(226,232,240,0.3)' }}>Activities</p>
                    <div className="flex flex-wrap gap-2">
                      {stop.tripActivities.map(ta => (
                        <span key={ta.id} className="badge text-xs" style={{ background: 'rgba(78,205,196,0.1)', color: '#4ecdc4' }}>
                          {ta.activity?.title}
                          {ta.activity?.estimatedCost && <span className="ml-1" style={{ color: '#ffd93d' }}>${ta.activity.estimatedCost}</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Budget summary */}
        {trip.budgets?.length > 0 && (
          <section>
            <h2 className="font-display font-bold text-2xl text-white mb-5">Budget Overview</h2>
            <div className="glass rounded-2xl p-5 grid sm:grid-cols-2 gap-3">
              {trip.budgets.map(b => (
                <div key={b.id} className="flex justify-between text-sm">
                  <span style={{ color: 'rgba(226,232,240,0.6)' }}>{b.category}</span>
                  <span className="font-bold text-white">${parseFloat(b.amount).toLocaleString()}</span>
                </div>
              ))}
              <div className="col-span-full h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div className="col-span-full flex justify-between">
                <span className="font-bold text-white">Total</span>
                <span className="font-bold text-xl" style={{ color: '#ffd93d' }}>${parseFloat(trip.totalEstimatedBudget || 0).toLocaleString()}</span>
              </div>
            </div>
          </section>
        )}

        <div className="text-center pt-4 pb-8">
          <p className="text-sm" style={{ color: 'rgba(226,232,240,0.3)' }}>Shared via Traveloop · Plan your own trip at <a href="/" className="underline" style={{ color: '#4ecdc4' }}>traveloop.app</a></p>
        </div>
      </div>
    </div>
  );
}
