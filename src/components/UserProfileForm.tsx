import React, { useState } from 'react';
import { UserProfile } from '../types/fitness';
import { fitnessService } from '../services/fitnessService';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { User, Scale, ArrowRight } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const UserProfileForm: React.FC<Props> = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: 25,
    weight: 70,
    height: 170,
    activityLevel: 'moderate' as UserProfile['activityLevel'],
    displayName: auth.currentUser?.displayName || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setLoading(true);
    
    try {
      await fitnessService.createUserProfile({
        uid: auth.currentUser.uid,
        email: auth.currentUser.email || '',
        ...formData,
        createdAt: new Date()
      });
      onComplete();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-[32px] p-8 md:p-12 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <User className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Onboarding</h2>
            <p className="text-slate-400 text-sm">Configure your AI coaching profile.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 px-1">Display Name</label>
              <input 
                type="text" 
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-indigo-500 outline-none transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 px-1">Age</label>
              <input 
                type="number" 
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-indigo-500 outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 px-1">Weight (kg)</label>
              <input 
                type="number" 
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-indigo-500 outline-none transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 px-1">Height (cm)</label>
              <input 
                type="number" 
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-indigo-500 outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 px-1">Activity Level</label>
            <select 
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as UserProfile['activityLevel'] })}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:border-indigo-500 outline-none transition-colors appearance-none"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Lightly Active</option>
              <option value="moderate">Moderately Active</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 text-white py-5 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all group shadow-lg shadow-indigo-500/20 disabled:opacity-50 mt-4"
          >
            {loading ? 'Initializing...' : 'Complete Setup'}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
