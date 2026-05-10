import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cityService } from '../../services/city.service';
import { tripService } from '../../services/trip.service';
import { useAuthStore } from '../../store/auth.store';
import { Heart, Globe, TrendingUp, Users, Share2, Eye, MapPin, Calendar, Star, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const TABS = ['Discover', 'Top Travelers', 'Trending Cities'];

const MOCK_COMMUNITY = [
  { id: '1', user: { name: 'Sofia Müller', avatar: 'S', country: '🇩🇪' }, trip: { title: 'Exploring Southeast Asia', cities: ['Bangkok', 'Bali', 'Singapore'], days: 21, budget: 2800, cover: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', likes: 248, views: 1204 }, timeAgo: '2 hours ago' },
  { id: '2', user: { name: 'James Carter', avatar: 'J', country: '🇺🇸' }, trip: { title: 'European Grand Tour', cities: ['Paris', 'Rome', 'Barcelona'], days: 18, budget: 4200, cover: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600', likes: 389, views: 2100 }, timeAgo: '5 hours ago' },
  { id: '3', user: { name: 'Priya Nair', avatar: 'P', country: '🇮🇳' }, trip: { title: 'Japan Cherry Blossom', cities: ['Tokyo', 'Kyoto', 'Osaka'], days: 14, budget: 3500, cover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600', likes: 512, views: 3780 }, timeAgo: '1 day ago' },
  { id: '4', user: { name: 'Lucas Silva', avatar: 'L', country: '🇧🇷' }, trip: { title: 'Africa Safari Dream', cities: ['Cape Town', 'Nairobi'], days: 12, budget: 5100, cover: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600', likes: 301, views: 1560 }, timeAgo: '2 days ago' },
  { id: '5', user: { name: 'Emma Chen', avatar: 'E', country: '🇨🇳' }, trip: { title: 'Mediterranean Escape', cities: ['Santorini', 'Dubrovnik', 'Amalfi'], days: 16, budget: 3900, cover: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600', likes: 445, views: 2890 }, timeAgo: '3 days ago' },
  { id: '6', user: { name: 'Omar Hassan', avatar: 'O', country: '🇦🇪' }, trip: { title: 'Desert & City Dubai', cities: ['Dubai', 'Abu Dhabi'], days: 7, budget: 2200, cover: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', likes: 176, views: 892 }, timeAgo: '4 days ago' },
];

const TOP_TRAVELERS = [
  { name: 'Priya Nair', country: '🇮🇳', trips: 24, followers: 1820, avatar: 'P', tag: 'Asia Expert' },
  { name: 'Emma Chen', country: '🇨🇳', trips: 19, followers: 1345, avatar: 'E', tag: 'Mediterranean' },
  { name: 'James Carter', country: '🇺🇸', trips: 31, followers: 2100, avatar: 'J', tag: 'Backpacker' },
  { name: 'Sofia Müller', country: '🇩🇪', trips: 16, followers: 980, avatar: 'S', tag: 'Budget Travel' },
];

const TRENDING_CITIES = [
  { name: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', growth: '+34%', trips: 892 },
  { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400', growth: '+28%', trips: 741 },
  { name: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', growth: '+22%', trips: 1203 },
  { name: 'Cape Town', country: 'South Africa', img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400', growth: '+19%', trips: 534 },
];

const AVATAR_COLORS = ['#ff6b6b', '#4ecdc4', '#ffd93d', '#a78bfa', '#f97316', '#34d399'];

export default function Community() {
  const [tab, setTab] = useState('Discover');
  const [likedPosts, setLikedPosts] = useState([]);
  const { user } = useAuthStore();

  const toggleLike = (id) => {
    setLikedPosts(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
    toast.success(likedPosts.includes(id) ? 'Removed from liked' : 'Added to liked! ❤️');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Community</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(226,232,240,0.5)' }}>Discover trips shared by travelers worldwide</p>
        </div>
        <Link to="/trips/new" className="btn-secondary gap-2 text-sm">
          <Share2 size={14} /> Share Your Trip
        </Link>
      </div>

      {/* Stats banner */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Shared Trips', value: '2,840', icon: Map },
          { label: 'Community Members', value: '5,100+', icon: Users },
          { label: 'Countries Covered', value: '94', icon: Globe },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass rounded-2xl p-4 text-center">
            <p className="font-display font-bold text-2xl text-white">{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(226,232,240,0.5)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map(t => (
          <button key={t} id={`community-${t.toLowerCase().replace(' ', '-')}`} onClick={() => setTab(t)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: tab === t ? 'linear-gradient(135deg, rgba(255,107,107,0.2), rgba(78,205,196,0.2))' : 'rgba(255,255,255,0.05)', color: tab === t ? 'white' : 'rgba(226,232,240,0.5)', border: tab === t ? '1px solid rgba(78,205,196,0.25)' : '1px solid transparent' }}>
            {t}
          </button>
        ))}
      </div>

      {/* DISCOVER */}
      {tab === 'Discover' && (
        <div className="grid md:grid-cols-2 gap-5">
          {MOCK_COMMUNITY.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl overflow-hidden card-hover">
              {/* Cover */}
              <div className="relative h-48">
                <img src={post.trip.cover} alt={post.trip.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,12,27,0.95) 0%, transparent 50%)' }} />
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="font-bold text-white text-lg leading-tight">{post.trip.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {post.trip.cities.map(c => (
                      <span key={c} className="badge text-xs" style={{ background: 'rgba(78,205,196,0.2)', color: '#4ecdc4' }}>{c}</span>
                    ))}
                  </div>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                  <Eye size={11} style={{ color: 'rgba(226,232,240,0.6)' }} />
                  <span className="text-xs" style={{ color: 'rgba(226,232,240,0.6)' }}>{post.trip.views.toLocaleString()}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: `${AVATAR_COLORS[parseInt(post.id) % AVATAR_COLORS.length]}30`, color: AVATAR_COLORS[parseInt(post.id) % AVATAR_COLORS.length] }}>
                    {post.user.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{post.user.name} <span>{post.user.country}</span></p>
                    <p className="text-xs" style={{ color: 'rgba(226,232,240,0.4)' }}>{post.timeAgo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(226,232,240,0.5)' }}>
                  <span className="flex items-center gap-1"><Calendar size={10} /> {post.trip.days} days</span>
                  <span className="flex items-center gap-1"><MapPin size={10} /> {post.trip.cities.length} cities</span>
                  <span className="flex items-center gap-1 ml-auto font-bold" style={{ color: '#ffd93d' }}>
                    ${post.trip.budget.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <button id={`like-${post.id}`} onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-2 text-sm transition-all"
                    style={{ color: likedPosts.includes(post.id) ? '#ff6b6b' : 'rgba(226,232,240,0.5)' }}>
                    <Heart size={14} fill={likedPosts.includes(post.id) ? '#ff6b6b' : 'none'} />
                    {post.trip.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm" style={{ color: 'rgba(226,232,240,0.5)' }}>
                    <MessageCircle size={14} /> Comment
                  </button>
                  <button className="flex items-center gap-1.5 text-sm" style={{ color: 'rgba(226,232,240,0.5)' }}>
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* TOP TRAVELERS */}
      {tab === 'Top Travelers' && (
        <div className="space-y-3">
          {TOP_TRAVELERS.map((traveler, i) => (
            <motion.div key={traveler.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-5 flex items-center gap-4 card-hover">
              <div className="text-2xl font-display font-bold w-8 text-center" style={{ color: 'rgba(226,232,240,0.3)' }}>#{i + 1}</div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                style={{ background: `${AVATAR_COLORS[i]}25`, color: AVATAR_COLORS[i] }}>
                {traveler.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white">{traveler.name}</p>
                  <span>{traveler.country}</span>
                  <span className="badge text-xs" style={{ background: 'rgba(78,205,196,0.12)', color: '#4ecdc4' }}>{traveler.tag}</span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs" style={{ color: 'rgba(226,232,240,0.5)' }}>
                  <span>{traveler.trips} trips</span>
                  <span>{traveler.followers.toLocaleString()} followers</span>
                </div>
              </div>
              <button className="btn-secondary text-xs py-1.5 px-4">Follow</button>
            </motion.div>
          ))}
        </div>
      )}

      {/* TRENDING CITIES */}
      {tab === 'Trending Cities' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {TRENDING_CITIES.map((city, i) => (
            <motion.div key={city.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl overflow-hidden card-hover h-52">
              <img src={city.img} alt={city.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,12,27,0.95) 0%, transparent 50%)' }} />
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(52,211,153,0.2)', border: '1px solid rgba(52,211,153,0.3)', backdropFilter: 'blur(8px)' }}>
                <TrendingUp size={11} style={{ color: '#34d399' }} />
                <span className="text-xs font-bold" style={{ color: '#34d399' }}>{city.growth}</span>
              </div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="font-display font-bold text-2xl text-white">{city.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm" style={{ color: 'rgba(226,232,240,0.6)' }}>{city.country}</p>
                  <p className="text-xs" style={{ color: 'rgba(226,232,240,0.5)' }}>{city.trips.toLocaleString()} trips</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
