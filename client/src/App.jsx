import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute, PublicRoute } from './routes/RouteGuards';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public
import LandingPage from './pages/landing/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import SharedTripView from './pages/share/SharedTripView';

// Dashboard pages
import Dashboard from './pages/dashboard/Dashboard';
import TripsList from './pages/trips/TripsList';
import CreateTrip from './pages/trips/CreateTrip';
import TripDetail from './pages/trips/TripDetail';
import ItineraryBuilder from './pages/trips/ItineraryBuilder';
import TripNotes from './pages/trips/TripNotes';
import PackingChecklist from './pages/trips/PackingChecklist';

// City & Activity
import CitySearch from './pages/cities/CitySearch';
import CityDetail from './pages/cities/CityDetail';
import ActivitySearch from './pages/activities/ActivitySearch';

// Social / Community
import Community from './pages/community/Community';

// Profile & Settings
import Profile from './pages/profile/Profile';
import SavedDestinations from './pages/saved/SavedDestinations';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#0d2137', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
          success: { iconTheme: { primary: '#4ecdc4', secondary: '#0d2137' } },
          error: { iconTheme: { primary: '#ff6b6b', secondary: '#0d2137' } },
          duration: 3000,
        }}
      />
      <Routes>
        {/* Landing */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/share/:token" element={<SharedTripView />} />

        {/* Auth */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trips" element={<TripsList />} />
            <Route path="/trips/new" element={<CreateTrip />} />
            <Route path="/trips/:id" element={<TripDetail />} />
            <Route path="/trips/:id/itinerary" element={<ItineraryBuilder />} />
            <Route path="/trips/:id/notes" element={<TripNotes />} />
            <Route path="/trips/:id/packing" element={<PackingChecklist />} />
            <Route path="/cities" element={<CitySearch />} />
            <Route path="/cities/:id" element={<CityDetail />} />
            <Route path="/activities" element={<ActivitySearch />} />
            <Route path="/community" element={<Community />} />
            <Route path="/saved" element={<SavedDestinations />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
