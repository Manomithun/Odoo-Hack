import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { authService } from '../../services/auth.service';
import { tripService } from '../../services/trip.service';
import { useForm } from 'react-hook-form';
import { User, Map, Star, Calendar, Save, Camera, ChevronRight, Clock, CheckCircle } from 'lucide-react';
import { format, isFuture, isPast, isWithinInterval } from 'date-fns';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const PROFILE_TABS = ['Overview', 'Pre-planned Trips', 'Previous Trips'];

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { fullName: user?.fullName, bio: user?.bio || '', language: user?.language || 'en', profileImage: user?.profileImage || '' },
  });

  useEffect(() => {
    authService.getProfile().then(r => {
      setStats(r.data.data._count);
      reset({ fullName: r.data.data.fullName, bio: r.data.data.bio || '', language: r.data.data.language, profileImage: r.data.data.profileImage || '' });
    }).catch(() => {});

    tripService.getAll({ limit: 50 }).then(r => setTrips(r.data.data || [])).catch(() => {});
  }, []);

  const onSave = async (data) => {
    setSaving(true);
    try {
      const res = await authService.updateProfile(data);
      updateUser(res.data.data);
      toast.success('Profile updated! ✅');
      setEditing(false);
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const upcoming = trips.filter(t => isFuture(new Date(t.startDate)));
  const previous = trips.filter(t => isPast(new Date(t.endDate)));
  const ongoing = trips.filter(t => {
    try { return isWithinInterval(new Date(), { start: new Date(t.startDate), end: new Date(t.endDate) }); } catch { return false; }
  });

  const TripMiniCard = ({ trip }) => (
    <Link to={`/trips/${trip.id}`} className="glass rounded-xl overflow-hidden card-hover block">
      <div className="h-28 relative">
        <img src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'} alt={trip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,12,27,0.9), transparent)' }} />
        <div className="absolute bottom-0 left-0 p-3">
          <p className="font-bold text-white text-sm leading-tight truncate">{trip.title}</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(226,232,240,0.5)' }}>{format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
      {/* Profile Hero Card */}
      <div className="glass rounded-3xl overflow-hidden">
        {/* Banner */}
        <div className="h-28 relative"
          style={{ background: 'linear-gradient(135deg, #0f3460, #1a4a7e, #ff6b6b40)' }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800)', backgroundSize: 'cover' }} />
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold border-4"
                style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)', color: 'white', borderColor: '#020c1b' }}>
                {user?.fullName?.[0]?.toUpperCase()}
              </div>
              {user?.isAdmin && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: '#ffd93d' }}>
                  <span className="text-xs">⭐</span>
                </div>
              )}
            </div>
            <button onClick={() => setEditing(e => !e)} className="btn-secondary text-sm py-2 px-4 gap-2">
              <Camera size={14} /> {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <h2 className="font-display font-bold text-2xl text-white">{user?.fullName}</h2>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(226,232,240,0.5)' }}>{user?.email}</p>
          {user?.bio && <p className="text-sm mt-2 max-w-md" style={{ color: 'rgba(226,232,240,0.65)' }}>{user.bio}</p>}

          {user?.isAdmin && <span className="badge mt-2 inline-block" style={{ background: 'rgba(255,217,61,0.15)', color: '#ffd93d' }}>Platform Admin</span>}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: 'Trips', value: stats?.trips ?? trips.length, icon: Map, color: '#4ecdc4' },
              { label: 'Saved Places', value: stats?.savedDestinations ?? 0, icon: Star, color: '#ffd93d' },
              { label: 'Countries', value: [...new Set(trips.flatMap(t => t.tripStops?.map(s => s.city?.countryName) || []))].length, icon: User, color: '#ff6b6b' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="font-display font-bold text-2xl" style={{ color }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(226,232,240,0.45)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
          <h3 className="font-bold text-white text-lg mb-4">Edit Profile</h3>
          <form onSubmit={handleSubmit(onSave)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'rgba(226,232,240,0.6)' }}>Full Name</label>
                <input {...register('fullName')} id="profile-name" className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'rgba(226,232,240,0.6)' }}>Language</label>
                <select {...register('language')} id="profile-lang" className="input-field text-sm">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'rgba(226,232,240,0.6)' }}>Bio</label>
              <textarea {...register('bio')} id="profile-bio" className="input-field resize-none text-sm" style={{ minHeight: '70px' }} placeholder="Tell us about yourself..." />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'rgba(226,232,240,0.6)' }}>Profile Image URL</label>
              <input {...register('profileImage')} id="profile-img" className="input-field text-sm" placeholder="https://..." />
            </div>
            <button type="submit" id="save-profile-btn" disabled={saving} className="btn-primary gap-2" style={{ opacity: saving ? 0.7 : 1 }}>
              <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Profile Tabs */}
      <div className="flex gap-2">
        {PROFILE_TABS.map(t => (
          <button key={t} id={`profile-tab-${t.toLowerCase().replace(' ', '-')}`} onClick={() => setActiveTab(t)}
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: activeTab === t ? 'linear-gradient(135deg, rgba(255,107,107,0.18), rgba(78,205,196,0.18))' : 'rgba(255,255,255,0.05)', color: activeTab === t ? 'white' : 'rgba(226,232,240,0.5)', border: activeTab === t ? '1px solid rgba(78,205,196,0.25)' : '1px solid transparent' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'Overview' && (
        <div className="space-y-4">
          {ongoing.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} style={{ color: '#4ecdc4' }} />
                <p className="text-sm font-semibold" style={{ color: '#4ecdc4' }}>Currently Travelling</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ongoing.map(t => <TripMiniCard key={t.id} trip={t} />)}
              </div>
            </div>
          )}
          {trips.length === 0 ? (
            <div className="text-center py-12">
              <Map size={48} className="mx-auto mb-3 opacity-20" />
              <p style={{ color: 'rgba(226,232,240,0.4)' }}>No trips yet</p>
              <Link to="/trips/new" className="btn-primary mt-4 inline-flex">Plan a Trip</Link>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold mb-3 text-white">All Trips ({trips.length})</p>
              <div className="grid grid-cols-2 gap-3">
                {trips.slice(0, 4).map(t => <TripMiniCard key={t.id} trip={t} />)}
              </div>
              {trips.length > 4 && (
                <Link to="/trips" className="flex items-center justify-center gap-2 mt-3 text-sm" style={{ color: '#4ecdc4' }}>
                  View all trips <ChevronRight size={14} />
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pre-planned Trips (upcoming) */}
      {activeTab === 'Pre-planned Trips' && (
        <div>
          {upcoming.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto mb-3 opacity-20" />
              <p style={{ color: 'rgba(226,232,240,0.4)' }}>No upcoming trips</p>
              <Link to="/trips/new" className="btn-primary mt-4 inline-flex">Plan a Trip</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((trip, i) => (
                <motion.div key={trip.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link to={`/trips/${trip.id}`} className="glass rounded-2xl p-4 flex items-center gap-4 card-hover block">
                    <img src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200'}
                      alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{trip.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(226,232,240,0.5)' }}>
                        {format(new Date(trip.startDate), 'MMM d, yyyy')} · {trip._count?.tripStops || 0} cities
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="badge text-xs" style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}>Upcoming</span>
                      <p className="text-xs mt-1 font-bold" style={{ color: '#ffd93d' }}>${parseFloat(trip.totalEstimatedBudget || 0).toLocaleString()}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Previous Trips */}
      {activeTab === 'Previous Trips' && (
        <div>
          {previous.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle size={48} className="mx-auto mb-3 opacity-20" />
              <p style={{ color: 'rgba(226,232,240,0.4)' }}>No completed trips yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {previous.map((trip, i) => (
                <motion.div key={trip.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link to={`/trips/${trip.id}`} className="glass rounded-2xl p-4 flex items-center gap-4 card-hover block">
                    <img src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200'}
                      alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{trip.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(226,232,240,0.5)' }}>
                        {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
                      </p>
                      {trip.tripStops?.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {trip.tripStops.slice(0, 3).map(s => (
                            <span key={s.id} className="text-xs" style={{ color: '#4ecdc4' }}>{s.city?.cityName}{trip.tripStops.indexOf(s) < trip.tripStops.length - 1 && trip.tripStops.indexOf(s) < 2 ? ' → ' : ''}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="badge text-xs flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(226,232,240,0.5)' }}>Completed</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
