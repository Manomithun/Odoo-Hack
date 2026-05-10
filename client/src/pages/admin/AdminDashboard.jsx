import { useEffect, useState } from 'react';
import { adminService } from '../../services/city.service';
import { tripService } from '../../services/trip.service';
import { Users, Map, Globe, Activity, TrendingUp, Search, Filter, Shield, Star, BarChart2, UserCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, PieChart, Pie, Legend, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const TABS = [
  { key: 'overview', label: 'Overview', icon: BarChart2 },
  { key: 'users', label: 'Manage Users', icon: Users },
  { key: 'cities', label: 'Popular Cities', icon: Globe },
  { key: 'activities', label: 'Popular Activities', icon: Activity },
  { key: 'analytics', label: 'User Analytics', icon: TrendingUp },
];

const COLORS = ['#ff6b6b', '#4ecdc4', '#ffd93d', '#a78bfa', '#f97316', '#34d399', '#60a5fa', '#ec4899'];

const MOCK_TRENDS = [
  { month: 'Jan', users: 120, trips: 340 }, { month: 'Feb', users: 145, trips: 390 },
  { month: 'Mar', users: 210, trips: 520 }, { month: 'Apr', users: 280, trips: 680 },
  { month: 'May', users: 350, trips: 820 }, { month: 'Jun', users: 420, trips: 1020 },
];

const MOCK_ACTIVITY_TRENDS = [
  { name: 'Mon', active: 245 }, { name: 'Tue', active: 312 }, { name: 'Wed', active: 280 },
  { name: 'Thu', active: 410 }, { name: 'Fri', active: 520 }, { name: 'Sat', active: 680 }, { name: 'Sun', active: 590 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [groupBy, setGroupBy] = useState('date');

  useEffect(() => {
    adminService.getStats()
      .then(r => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      adminService.getUsers({ page: userPage, limit: 15, search: userSearch })
        .then(r => { setUsers(r.data.data || []); setUsersTotal(r.data.pagination?.total || 0); })
        .catch(() => {});
    }
  }, [activeTab, userSearch, userPage]);

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-white">Loading admin panel...</p></div>;
  if (!stats) return <div className="text-center py-20" style={{ color: 'rgba(226,232,240,0.5)' }}>No access.</div>;

  const cityChartData = (stats.topCities || []).slice(0, 8).map(c => ({ name: c.cityName, value: c._count?.tripStops || 0 }));
  const activitiesByCategory = [
    { name: 'Sightseeing', value: 34 }, { name: 'Food', value: 28 }, { name: 'Culture', value: 21 },
    { name: 'Nature', value: 18 }, { name: 'Adventure', value: 15 }, { name: 'Nightlife', value: 9 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,217,61,0.15)' }}>
          <Shield size={20} style={{ color: '#ffd93d' }} />
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Admin Panel</h1>
          <p className="text-sm" style={{ color: 'rgba(226,232,240,0.5)' }}>Platform management & analytics</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#4ecdc4', change: '+12%' },
          { label: 'Total Trips', value: stats.totalTrips, icon: Map, color: '#ff6b6b', change: '+28%' },
          { label: 'Cities', value: stats.totalCities, icon: Globe, color: '#ffd93d', change: '—' },
          { label: 'Activities', value: stats.totalActivities, icon: Activity, color: '#a78bfa', change: '+5%' },
        ].map(({ label, value, icon: Icon, color, change }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>{change}</span>
            </div>
            <p className="font-display font-bold text-3xl text-white">{value?.toLocaleString()}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(226,232,240,0.45)' }}>{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} id={`admin-tab-${key}`} onClick={() => setActiveTab(key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium flex-shrink-0 transition-all"
            style={{ background: activeTab === key ? 'linear-gradient(135deg, rgba(255,107,107,0.15), rgba(78,205,196,0.15))' : 'rgba(255,255,255,0.05)', color: activeTab === key ? 'white' : 'rgba(226,232,240,0.5)', border: activeTab === key ? '1px solid rgba(78,205,196,0.2)' : '1px solid transparent' }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-5">
          <div className="glass rounded-2xl p-5">
            <h3 className="font-bold text-white mb-4">Growth Over Time</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MOCK_TRENDS}>
                <defs>
                  <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.3} /><stop offset="95%" stopColor="#4ecdc4" stopOpacity={0} /></linearGradient>
                  <linearGradient id="tripsGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.3} /><stop offset="95%" stopColor="#ff6b6b" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#e2e8f0' }} />
                <Area type="monotone" dataKey="users" stroke="#4ecdc4" fill="url(#usersGrad)" strokeWidth={2} name="New Users" />
                <Area type="monotone" dataKey="trips" stroke="#ff6b6b" fill="url(#tripsGrad)" strokeWidth={2} name="New Trips" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="font-bold text-white mb-4">Top Cities by Trips</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={cityChartData} layout="vertical">
                <XAxis type="number" tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(226,232,240,0.5)', fontSize: 11 }} width={70} />
                <Tooltip contentStyle={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#e2e8f0' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {cityChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* MANAGE USERS */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Search + group by */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-40">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(226,232,240,0.4)' }} />
              <input id="user-search" value={userSearch} onChange={e => { setUserSearch(e.target.value); setUserPage(1); }}
                className="input-field pl-9 text-sm" placeholder="Search users..." />
            </div>
            <select id="group-by" value={groupBy} onChange={e => setGroupBy(e.target.value)} className="input-field w-36 text-sm">
              <option value="date">Group by Date</option>
              <option value="status">Group by Status</option>
              <option value="role">Group by Role</option>
            </select>
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(226,232,240,0.35)' }}>User</p>
              <p className="text-xs font-semibold uppercase tracking-widest ml-auto" style={{ color: 'rgba(226,232,240,0.35)' }}>Role</p>
              <p className="text-xs font-semibold uppercase tracking-widest w-20 text-right" style={{ color: 'rgba(226,232,240,0.35)' }}>Joined</p>
            </div>
            {users.length === 0 ? (
              <div className="py-10 text-center" style={{ color: 'rgba(226,232,240,0.4)' }}>No users found</div>
            ) : (
              users.map((u, i) => (
                <div key={u.id} className="flex items-center gap-3 px-5 py-3.5 transition-all"
                  style={{ borderBottom: i < users.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #ff6b6b30, #4ecdc430)', color: '#4ecdc4' }}>
                    {u.fullName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{u.fullName}</p>
                    <p className="text-xs truncate" style={{ color: 'rgba(226,232,240,0.4)' }}>{u.email}</p>
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(226,232,240,0.4)' }}>{u._count?.trips || 0} trips</span>
                  <span className="badge text-xs ml-2"
                    style={{ background: u.isAdmin ? 'rgba(255,217,61,0.15)' : 'rgba(255,255,255,0.07)', color: u.isAdmin ? '#ffd93d' : 'rgba(226,232,240,0.5)' }}>
                    {u.isAdmin ? 'Admin' : 'User'}
                  </span>
                  <span className="text-xs w-20 text-right" style={{ color: 'rgba(226,232,240,0.35)' }}>{format(new Date(u.createdAt), 'MMM d, yy')}</span>
                </div>
              ))
            )}
          </div>

          {usersTotal > 15 && (
            <div className="flex justify-center gap-2">
              {[...Array(Math.ceil(usersTotal / 15))].map((_, i) => (
                <button key={i} onClick={() => setUserPage(i + 1)}
                  className="w-8 h-8 rounded-lg text-xs font-medium"
                  style={{ background: userPage === i + 1 ? 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' : 'rgba(255,255,255,0.06)', color: 'white' }}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* POPULAR CITIES */}
      {activeTab === 'cities' && (
        <div className="grid md:grid-cols-2 gap-5">
          <div className="glass rounded-2xl p-5">
            <h3 className="font-bold text-white mb-4">Cities by Trip Count</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={cityChartData}>
                <XAxis dataKey="name" tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 10 }} />
                <YAxis tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#e2e8f0' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {cityChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {(stats.topCities || []).slice(0, 8).map((city, i) => (
              <div key={city.id} className="glass rounded-xl p-4 flex items-center gap-3">
                <span className="font-display font-bold text-lg w-8" style={{ color: i < 3 ? '#ffd93d' : 'rgba(226,232,240,0.3)' }}>#{i + 1}</span>
                {city.imageUrl && <img src={city.imageUrl} alt={city.cityName} className="w-10 h-10 rounded-xl object-cover" />}
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{city.cityName}</p>
                  <p className="text-xs" style={{ color: 'rgba(226,232,240,0.45)' }}>{city.countryName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: '#4ecdc4' }}>{city._count?.tripStops || 0}</p>
                  <p className="text-xs" style={{ color: 'rgba(226,232,240,0.4)' }}>trips</p>
                </div>
                {i < 3 && <Star size={14} fill="#ffd93d" style={{ color: '#ffd93d' }} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POPULAR ACTIVITIES */}
      {activeTab === 'activities' && (
        <div className="grid md:grid-cols-2 gap-5">
          <div className="glass rounded-2xl p-5">
            <h3 className="font-bold text-white mb-4">Activity Categories</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={activitiesByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: 'rgba(226,232,240,0.2)' }}>
                  {activitiesByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {activitiesByCategory.map((cat, i) => (
              <div key={cat.name} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white text-sm">{cat.name}</p>
                  <span className="text-sm font-bold" style={{ color: COLORS[i % COLORS.length] }}>{cat.value}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full" style={{ width: `${cat.value * 2.5}%`, background: COLORS[i % COLORS.length] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USER ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="glass rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4">Weekly Active Users</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={MOCK_ACTIVITY_TRENDS}>
                  <XAxis dataKey="name" tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#e2e8f0' }} />
                  <Bar dataKey="active" fill="#4ecdc4" radius={[4, 4, 0, 0]} name="Active Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="glass rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4">User Growth Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={MOCK_TRENDS}>
                  <XAxis dataKey="month" tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'rgba(226,232,240,0.4)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#e2e8f0' }} />
                  <Line type="monotone" dataKey="users" stroke="#ff6b6b" strokeWidth={2.5} dot={{ fill: '#ff6b6b', r: 4 }} name="New Users" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent activity log */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-bold text-white mb-4">Recent Platform Activity</h3>
            <div className="space-y-3">
              {(stats.recentActivity || []).slice(0, 10).map((log, i) => (
                <div key={log.id} className="flex items-center gap-3 py-2"
                  style={{ borderBottom: i < 9 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'rgba(78,205,196,0.12)', color: '#4ecdc4' }}>
                    {log.user?.fullName?.[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white"><span style={{ color: '#4ecdc4' }}>{log.user?.fullName}</span> · {log.action}</p>
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(226,232,240,0.35)' }}>{format(new Date(log.createdAt), 'MMM d, h:mm a')}</span>
                </div>
              ))}
              {(!stats.recentActivity || stats.recentActivity.length === 0) && (
                <p className="text-center py-4 text-sm" style={{ color: 'rgba(226,232,240,0.4)' }}>No activity logs yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
