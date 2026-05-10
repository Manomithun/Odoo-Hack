import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/auth.store';
import { Plane, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.login(data);
      login(res.data.data.user, res.data.data.token);
      toast.success(`Welcome back, ${res.data.data.user.fullName}! ✈️`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #020c1b 0%, #0a1628 50%, #0d2137 100%)' }}>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #4ecdc4, transparent)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #ff6b6b, transparent)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        {/* Card */}
        <div className="glass rounded-3xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 animate-float"
              style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' }}>
              <Plane size={30} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-3xl text-white">Traveloop</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(226,232,240,0.5)' }}>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(226,232,240,0.8)' }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(226,232,240,0.4)' }} />
                <input {...register('email')} type="email" id="login-email"
                  className="input-field pl-10" placeholder="you@example.com" />
              </div>
              {errors.email && <p className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(226,232,240,0.8)' }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(226,232,240,0.4)' }} />
                <input {...register('password')} type={showPass ? 'text' : 'password'} id="login-password"
                  className="input-field pl-10 pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 btn-ghost p-0">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.password.message}</p>}
            </div>

            <button type="submit" id="login-submit" disabled={loading}
              className="btn-primary w-full justify-center mt-2"
              style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-3 rounded-xl text-center" style={{ background: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.15)' }}>
            <p className="text-xs" style={{ color: 'rgba(226,232,240,0.5)' }}>Demo: <span style={{ color: '#4ecdc4' }}>demo@traveloop.com</span> / <span style={{ color: '#4ecdc4' }}>demo123</span></p>
          </div>

          <p className="text-center text-sm mt-6" style={{ color: 'rgba(226,232,240,0.5)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="link-underline font-medium" style={{ color: '#ff6b6b' }}>Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
