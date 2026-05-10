import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { tripService } from '../../services/trip.service';
import { ArrowLeft, ArrowRight, Map, Calendar, Image, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().min(1, 'End date required'),
  coverImage: z.string().url().optional().or(z.literal('')),
  totalEstimatedBudget: z.coerce.number().min(0).optional(),
  visibility: z.enum(['private', 'public']).default('private'),
});

const steps = [
  { title: 'Trip Details', icon: Map },
  { title: 'Dates & Budget', icon: Calendar },
  { title: 'Cover & Privacy', icon: Image },
];

export default function CreateTrip() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, trigger, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { visibility: 'private', totalEstimatedBudget: 0 },
  });

  const coverImage = watch('coverImage');

  const nextStep = async () => {
    const fields = [['title', 'description'], ['startDate', 'endDate', 'totalEstimatedBudget'], ['visibility']][step];
    const valid = await trigger(fields);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await tripService.create({ ...data, totalEstimatedBudget: Number(data.totalEstimatedBudget) || 0 });
      toast.success('Trip created! 🌍');
      navigate(`/trips/${res.data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create trip');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/trips')} className="btn-ghost p-2">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Create Trip</h1>
          <p className="text-sm" style={{ color: 'rgba(226,232,240,0.5)' }}>Plan your next adventure</p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  background: i <= step ? 'linear-gradient(135deg, #ff6b6b, #4ecdc4)' : 'rgba(255,255,255,0.1)',
                  color: 'white'
                }}>
                {i + 1}
              </div>
              <span className="text-sm hidden sm:block" style={{ color: i === step ? 'white' : 'rgba(226,232,240,0.4)' }}>{s.title}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px mx-2" style={{ background: i < step ? '#4ecdc4' : 'rgba(255,255,255,0.1)' }} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="glass rounded-3xl p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <h2 className="font-display font-bold text-xl text-white mb-6">Trip Details</h2>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(226,232,240,0.8)' }}>Trip Title *</label>
                  <input {...register('title')} id="trip-title" className="input-field" placeholder="European Summer Adventure" />
                  {errors.title && <p className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.title.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(226,232,240,0.8)' }}>Description</label>
                  <textarea {...register('description')} id="trip-description" className="input-field h-24 resize-none"
                    placeholder="Describe your trip..." />
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <h2 className="font-display font-bold text-xl text-white mb-6">Dates & Budget</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(226,232,240,0.8)' }}>Start Date *</label>
                    <input {...register('startDate')} type="date" id="trip-start" className="input-field" style={{ colorScheme: 'dark' }} />
                    {errors.startDate && <p className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.startDate.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(226,232,240,0.8)' }}>End Date *</label>
                    <input {...register('endDate')} type="date" id="trip-end" className="input-field" style={{ colorScheme: 'dark' }} />
                    {errors.endDate && <p className="text-xs mt-1" style={{ color: '#ff6b6b' }}>{errors.endDate.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(226,232,240,0.8)' }}>Estimated Budget ($)</label>
                  <input {...register('totalEstimatedBudget')} type="number" id="trip-budget" className="input-field" placeholder="0" />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <h2 className="font-display font-bold text-xl text-white mb-6">Cover & Privacy</h2>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(226,232,240,0.8)' }}>Cover Image URL</label>
                  <input {...register('coverImage')} id="trip-cover" className="input-field" placeholder="https://..." />
                  {coverImage && (
                    <img src={coverImage} alt="Preview" className="mt-3 rounded-xl h-32 w-full object-cover" onError={e => e.target.style.display='none'} />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: 'rgba(226,232,240,0.8)' }}>Visibility</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['private', 'public'].map((v) => (
                      <label key={v} className="relative cursor-pointer">
                        <input {...register('visibility')} type="radio" value={v} className="sr-only" />
                        <div className="p-4 rounded-xl border-2 text-center transition-all"
                          style={{ borderColor: watch('visibility') === v ? '#4ecdc4' : 'rgba(255,255,255,0.1)', background: watch('visibility') === v ? 'rgba(78,205,196,0.1)' : 'transparent' }}>
                          <Globe size={20} className="mx-auto mb-1" style={{ color: watch('visibility') === v ? '#4ecdc4' : 'rgba(226,232,240,0.5)' }} />
                          <p className="text-sm font-medium capitalize" style={{ color: watch('visibility') === v ? '#4ecdc4' : 'rgba(226,232,240,0.7)' }}>{v}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <button type="button" onClick={() => setStep(s => s - 1)} className="btn-ghost">
                <ArrowLeft size={16} /> Back
              </button>
            ) : <div />}

            {step < steps.length - 1 ? (
              <button type="button" id={`step-${step}-next`} onClick={nextStep} className="btn-primary">
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button type="submit" id="create-trip-submit" disabled={loading} className="btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Creating...' : 'Create Trip'} {!loading && <ArrowRight size={16} />}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
