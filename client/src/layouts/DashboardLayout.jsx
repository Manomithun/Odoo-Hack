import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useUIStore } from '../store/ui.store';
import {
  LayoutDashboard, Map, Globe, Star, User, Shield,
  Menu, X, Plane, ChevronRight, LogOut, Users, Package, BookOpen, Activity, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/trips', icon: Map, label: 'My Trips' },
  { path: '/cities', icon: Globe, label: 'Explore Cities' },
  { path: '/activities', icon: Activity, label: 'Activities' },
  { path: '/community', icon: Users, label: 'Community' },
  { path: '/saved', icon: Star, label: 'Saved Places' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const adminItems = [
  { path: '/admin', icon: Shield, label: 'Admin Panel' },
];

export function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path) => {
    if (path === '/trips') return location.pathname === '/trips' || location.pathname.startsWith('/trips/');
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#020c1b' }}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -272 }} animate={{ x: 0 }} exit={{ x: -272 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="w-68 flex-shrink-0 flex flex-col h-full z-20"
            style={{ width: '272px', background: 'linear-gradient(180deg, #080f20 0%, #0a1628 60%, #0d1f35 100%)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 p-5 pb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' }}>
                <Plane size={18} className="text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-white text-lg leading-none">Traveloop</h1>
                <p className="text-xs mt-0.5" style={{ color: '#4ecdc4' }}>Travel Planner</p>
              </div>
            </div>

            <div className="mx-4 mb-4 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />

            {/* Nav */}
            <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
              <p className="text-xs font-semibold uppercase tracking-widest px-3 pb-2 pt-1" style={{ color: 'rgba(226,232,240,0.25)' }}>Navigation</p>
              {navItems.map(({ path, icon: Icon, label }) => {
                const active = isActive(path);
                return (
                  <Link key={path} to={path}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group"
                    style={{
                      background: active ? 'linear-gradient(135deg, rgba(255,107,107,0.12), rgba(78,205,196,0.12))' : 'transparent',
                      color: active ? '#e2e8f0' : 'rgba(226,232,240,0.5)',
                    }}>
                    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full" style={{ background: 'linear-gradient(180deg, #ff6b6b, #4ecdc4)' }} />}
                    <Icon size={17} style={{ color: active ? '#4ecdc4' : 'inherit' }} />
                    <span className="text-sm font-medium">{label}</span>
                    {active && <ChevronRight size={13} className="ml-auto" style={{ color: '#4ecdc4' }} />}
                  </Link>
                );
              })}

              {user?.isAdmin && (
                <>
                  <div className="mx-3 my-3 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <p className="text-xs font-semibold uppercase tracking-widest px-3 pb-2" style={{ color: 'rgba(226,232,240,0.25)' }}>Admin</p>
                  {adminItems.map(({ path, icon: Icon, label }) => {
                    const active = isActive(path);
                    return (
                      <Link key={path} to={path}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                        style={{ background: active ? 'rgba(255,217,61,0.08)' : 'transparent', color: active ? '#ffd93d' : 'rgba(226,232,240,0.5)' }}>
                        <Icon size={17} />
                        <span className="text-sm font-medium">{label}</span>
                      </Link>
                    );
                  })}
                </>
              )}
            </nav>

            {/* User card */}
            <div className="p-3 mt-2">
              <div className="rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)', color: 'white' }}>
                    {user?.fullName?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
                    <p className="text-xs truncate" style={{ color: 'rgba(226,232,240,0.35)' }}>{user?.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
                  style={{ color: 'rgba(255,107,107,0.7)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.08)'; e.currentTarget.style.color = '#ff6b6b'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,107,107,0.7)'; }}>
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-4 px-6 py-3.5 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,15,32,0.85)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
          <button onClick={toggleSidebar} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ color: 'rgba(226,232,240,0.6)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#e2e8f0'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(226,232,240,0.6)'; }}>
            {sidebarOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
          <div className="flex-1" />
          <Link to="/trips/new" className="btn-primary py-2 px-4 text-xs" id="topbar-new-trip">
            <Plane size={13} /> New Trip
          </Link>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold cursor-pointer"
            onClick={() => navigate('/profile')}
            style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)', color: 'white' }}>
            {user?.fullName?.[0]?.toUpperCase()}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
