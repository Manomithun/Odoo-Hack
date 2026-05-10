import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Search, MapPin, ChevronRight, Star, Users, Map, ArrowRight, Globe, TrendingUp } from 'lucide-react';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600',
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1600',
];

const REGIONS = [
  { name: 'Europe', emoji: '🏛️', color: '#4ecdc4', cities: 'Paris, Rome, Barcelona' },
  { name: 'Asia', emoji: '🏯', color: '#ff6b6b', cities: 'Tokyo, Bali, Bangkok' },
  { name: 'Americas', emoji: '🗽', color: '#ffd93d', cities: 'New York, Machu Picchu' },
  { name: 'Africa', emoji: '🦁', color: '#f97316', cities: 'Cape Town, Marrakech' },
  { name: 'Middle East', emoji: '🕌', color: '#a78bfa', cities: 'Dubai, Istanbul' },
  { name: 'Oceania', emoji: '🌊', color: '#34d399', cities: 'Sydney, Queenstown' },
];

const TOP_DESTINATIONS = [
  { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600', rating: 4.9, price: '$1,200' },
  { name: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', rating: 4.8, price: '$800' },
  { name: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600', rating: 4.9, price: '$1,500' },
  { name: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600', rating: 4.8, price: '$1,100' },
  { name: 'Cape Town', country: 'South Africa', img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600', rating: 4.7, price: '$900' },
  { name: 'Dubai', country: 'UAE', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', rating: 4.8, price: '$1,400' },
];

const STATS = [
  { label: 'Trips Planned', value: '12,000+', icon: Map },
  { label: 'Destinations', value: '180+', icon: Globe },
  { label: 'Happy Travelers', value: '5,000+', icon: Users },
  { label: 'Top Rated', value: '4.9 ⭐', icon: Star },
];

const FEATURES = [
  { icon: '🗺️', title: 'Multi-City Itineraries', desc: 'Plan complex multi-destination trips with drag-and-drop stop ordering and day-by-day scheduling.' },
  { icon: '💰', title: 'Smart Budget Tracking', desc: 'Track expenses by category, visualize spending with charts, and get budget predictions.' },
  { icon: '🤖', title: 'AI Trip Suggestions', desc: 'Get smart recommendations for activities, hotels, and hidden gems tailored to your travel style.' },
  { icon: '🤝', title: 'Community & Sharing', desc: 'Share your itineraries publicly, inspire others, and discover trips from global travelers.' },
  { icon: '✅', title: 'Packing Checklists', desc: 'Never forget essentials with smart, categorized packing lists for every trip.' },
  { icon: '📓', title: 'Travel Journal', desc: 'Document your adventures with notes and memories linked to specific stops.' },
];

export default function LandingPage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (isAuthenticated) navigate(`/cities?search=${encodeURIComponent(searchQuery)}`);
    else navigate('/register');
  };

  return (
    <div className="min-h-screen" style={{ background: '#020c1b', color: '#e2e8f0' }}>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(2,12,27,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' }}>
            <Plane size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">Traveloop</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: 'rgba(226,232,240,0.6)' }}>
          <a href="#destinations" className="link-underline hover:text-white transition-colors">Destinations</a>
          <a href="#features" className="link-underline hover:text-white transition-colors">Features</a>
          <a href="#community" className="link-underline hover:text-white transition-colors">Community</a>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard" id="nav-dashboard" className="btn-primary py-2 px-5 text-sm">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" id="nav-login" className="btn-ghost text-sm px-4 py-2">Sign In</Link>
              <Link to="/register" id="nav-register" className="btn-primary py-2 px-5 text-sm">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={heroIdx} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
            className="absolute inset-0">
            <img src={HERO_IMAGES[heroIdx]} alt="Travel" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(2,12,27,0.5) 0%, rgba(2,12,27,0.7) 50%, rgba(2,12,27,0.95) 100%)' }} />
          </motion.div>
        </AnimatePresence>

        {/* Floating dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full"
              style={{ width: `${Math.random() * 6 + 2}px`, height: `${Math.random() * 6 + 2}px`, background: i % 2 === 0 ? '#4ecdc4' : '#ff6b6b', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.4 }}
              animate={{ y: [-20, 20, -20], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }} />
          ))}
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: 'rgba(78,205,196,0.1)', border: '1px solid rgba(78,205,196,0.25)' }}>
              <TrendingUp size={14} style={{ color: '#4ecdc4' }} />
              <span className="text-sm" style={{ color: '#4ecdc4' }}>12,000+ trips planned this month</span>
            </div>
            <h1 className="font-display font-bold text-6xl md:text-7xl text-white mb-6 leading-tight">
              Plan Your Perfect<br />
              <span className="gradient-text">Adventure</span>
            </h1>
            <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(226,232,240,0.7)' }}>
              Build multi-city itineraries, track budgets, discover activities, and share your journeys with the world.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="relative max-w-2xl mx-auto mb-10">
            <div className="flex items-center rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}>
              <Search size={18} className="ml-5 flex-shrink-0" style={{ color: 'rgba(226,232,240,0.5)' }} />
              <input id="hero-search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent px-4 py-5 text-white text-lg outline-none placeholder-gray-500"
                placeholder="Where do you want to go?" />
              <button type="submit" id="hero-search-btn"
                className="m-2 px-6 py-3 rounded-xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' }}>
                Search
              </button>
            </div>
            {/* Popular tags */}
            <div className="flex items-center gap-2 mt-4 flex-wrap justify-center">
              <span className="text-sm" style={{ color: 'rgba(226,232,240,0.4)' }}>Popular:</span>
              {['Bali', 'Tokyo', 'Paris', 'Santorini', 'Dubai'].map(c => (
                <button key={c} type="button" onClick={() => setSearchQuery(c)}
                  className="px-3 py-1 rounded-full text-xs transition-all"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(226,232,240,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(78,205,196,0.15)'; e.currentTarget.style.color = '#4ecdc4'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(226,232,240,0.6)'; }}>
                  {c}
                </button>
              ))}
            </div>
          </motion.form>

          {/* Hero dots */}
          <div className="flex justify-center gap-2">
            {HERO_IMAGES.map((_, i) => (
              <button key={i} onClick={() => setHeroIdx(i)}
                className="rounded-full transition-all" style={{ width: heroIdx === i ? '24px' : '6px', height: '6px', background: heroIdx === i ? '#4ecdc4' : 'rgba(255,255,255,0.3)' }} />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs" style={{ color: 'rgba(226,232,240,0.4)' }}>Scroll to explore</span>
          <div className="w-px h-10" style={{ background: 'linear-gradient(180deg, rgba(226,232,240,0.4), transparent)' }} />
        </motion.div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ label, value, icon: Icon }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className="glass rounded-2xl p-5 text-center">
              <Icon size={24} className="mx-auto mb-3" style={{ color: '#4ecdc4' }} />
              <p className="font-display font-bold text-3xl text-white">{value}</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(226,232,240,0.5)' }}>{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* REGIONS */}
      <section className="py-16 px-6" id="destinations">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-4xl text-white mb-3">Explore by Region</h2>
            <p style={{ color: 'rgba(226,232,240,0.5)' }}>Discover the world's most incredible destinations</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {REGIONS.map((region, i) => (
              <motion.div key={region.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }} viewport={{ once: true }}>
                <Link to={isAuthenticated ? `/cities?country=${region.name}` : '/register'}
                  id={`region-${region.name.toLowerCase().replace(' ', '-')}`}
                  className="glass rounded-2xl p-4 text-center card-hover block cursor-pointer"
                  style={{ border: `1px solid rgba(${region.color === '#4ecdc4' ? '78,205,196' : '255,107,107'},0.1)` }}>
                  <div className="text-4xl mb-3">{region.emoji}</div>
                  <p className="font-bold text-white text-sm">{region.name}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(226,232,240,0.4)' }}>{region.cities}</p>
                  <div className="mt-2 h-0.5 rounded-full w-8 mx-auto" style={{ background: region.color }} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP DESTINATIONS */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display font-bold text-4xl text-white mb-2">Top Destinations</h2>
              <p style={{ color: 'rgba(226,232,240,0.5)' }}>Handpicked destinations loved by travelers</p>
            </div>
            <Link to={isAuthenticated ? '/cities' : '/register'} className="btn-secondary text-sm gap-2 hidden md:flex">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOP_DESTINATIONS.map((dest, i) => (
              <motion.div key={dest.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <Link to={isAuthenticated ? '/cities' : '/register'}
                  id={`dest-${dest.name.toLowerCase()}`}
                  className="relative rounded-3xl overflow-hidden card-hover block h-72 group">
                  <img src={dest.img} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,12,27,0.95) 0%, rgba(2,12,27,0.2) 60%)' }} />
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(255,217,61,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,217,61,0.3)' }}>
                    <Star size={12} fill="#ffd93d" style={{ color: '#ffd93d' }} />
                    <span className="text-xs font-bold" style={{ color: '#ffd93d' }}>{dest.rating}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 p-5">
                    <h3 className="font-display font-bold text-2xl text-white">{dest.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5" style={{ color: 'rgba(226,232,240,0.6)' }}>
                        <MapPin size={13} />
                        <span className="text-sm">{dest.country}</span>
                      </div>
                      <span className="font-bold" style={{ color: '#4ecdc4' }}>From {dest.price}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm" style={{ color: '#4ecdc4', opacity: 0, transition: 'opacity 0.3s' }}
                      onMouseEnter={e => e.currentTarget.parentElement.parentElement.style.opacity = 1}
                      >
                      <span>Explore</span> <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-4xl text-white mb-3">Everything You Need to Travel</h2>
            <p style={{ color: 'rgba(226,232,240,0.5)' }}>A complete travel planning toolkit in one beautiful platform</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="glass rounded-2xl p-6 card-hover">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(226,232,240,0.5)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6" id="community">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-16 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30"
              style={{ background: 'radial-gradient(circle at 30% 50%, #ff6b6b30 0%, transparent 60%), radial-gradient(circle at 70% 50%, #4ecdc430 0%, transparent 60%)' }} />
            <div className="relative z-10">
              <div className="text-6xl mb-6">🌍</div>
              <h2 className="font-display font-bold text-5xl text-white mb-4">Start Planning Today</h2>
              <p className="text-xl mb-10" style={{ color: 'rgba(226,232,240,0.6)' }}>
                Join thousands of travelers who plan smarter with Traveloop
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" id="cta-register" className="btn-primary text-lg px-10 py-4 rounded-2xl">
                  Create Free Account <ArrowRight size={18} />
                </Link>
                <Link to="/login" id="cta-login" className="btn-secondary text-lg px-8 py-4 rounded-2xl">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' }}>
            <Plane size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-white">Traveloop</span>
        </div>
        <p className="text-sm" style={{ color: 'rgba(226,232,240,0.3)' }}>© 2026 Traveloop · Built with ❤️ for explorers</p>
      </footer>
    </div>
  );
}
