import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/auth.store';
import { Plane, Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async ({ confirmPassword, ...data }) => {
    setLoading(true);
    try {
      const res = await authService.register(data);
      login(res.data.data.user, res.data.data.token);
      toast.success('Welcome to Traveloop! 🌍');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #020c1b 0%, #0a1628 50%, #0d2137 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #4ecdc4, transparent)' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #ff6b6b, transparent)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4 py-8">
        <div className="glass rounded-3xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 animate-float"
              style={{ background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' }}>
              <Plane size={30} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-3xl text-white">Create Account</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(226,232,240,0.5)' }}>Start planning your adventures</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(226,232,240,0.8)' }}>Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(226,232,240,0.4)' }} />
                <input {...register('fullName')} id="register-name" className="input-field pl-10" placeholder="John Doe" />
              </div>
              {errors.fullName && <p className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(226,232,240,0.8)' }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(226,232,240,0.4)' }} />
                <input {...register('email')} type="email" id="register-email" className="input-field pl-10" placeholder="you@example.com" />
              </div>
              {errors.email && <p className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(226,232,240,0.8)' }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(226,232,240,0.4)' }} />
                <input {...register('password')} type={showPass ? 'text' : 'password'} id="register-password"
                  className="input-field pl-10 pr-10" placeholder="Min 6 characters" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 btn-ghost p-0">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(226,232,240,0.8)' }}>Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(226,232,240,0.4)' }} />
                <input {...register('confirmPassword')} type="password" id="register-confirm"
                  className="input-field pl-10" placeholder="Repeat password" />
              </div>
              {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" id="register-submit" disabled={loading}
              className="btn-primary w-full justify-center mt-2" style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'rgba(226,232,240,0.5)' }}>
            Already have an account?{' '}
            <Link to="/login" className="link-underline font-medium" style={{ color: '#ff6b6b' }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
