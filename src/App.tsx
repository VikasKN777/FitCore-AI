import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { fitnessService } from './services/fitnessService';
import { UserProfile } from './types/fitness';
import { Auth } from './components/Auth';
import { UserProfileForm } from './components/UserProfileForm';
import { WorkoutPlanner } from './components/WorkoutPlanner';
import { GoalTracker } from './components/GoalTracker';
import { Activity, Flame, TrendingUp, Calendar, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const p = await fitnessService.getUserProfile(u.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const p = await fitnessService.getUserProfile(user.uid);
      setProfile(p);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Activity className="text-orange-500 animate-pulse" size={48} />
          <span className="text-white/40 font-mono text-xs tracking-widest uppercase">Initializing Core...</span>
        </div>
      </div>
    );
  }

  if (!user) return <Auth />;
  if (!profile) return <UserProfileForm onComplete={refreshProfile} />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900/50 border-r border-slate-800 p-8 flex flex-col gap-8 hidden lg:flex">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase italic">FitCore</span>
        </div>

        <nav className="flex flex-col gap-2">
          <div className="bg-slate-800 text-indigo-400 p-3 rounded-lg flex items-center gap-3 font-medium cursor-pointer">
            <LayoutDashboard size={18} />
            Dashboard
          </div>
          <div className="hover:bg-slate-800 p-3 rounded-lg flex items-center gap-3 text-slate-400 cursor-pointer transition-colors">
            <TrendingUp size={18} />
            Analytics
          </div>
          <div className="hover:bg-slate-800 p-3 rounded-lg flex items-center gap-3 text-slate-400 cursor-pointer transition-colors">
            <Calendar size={18} />
            Plan
          </div>
        </nav>

        <div className="mt-auto">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-4 rounded-2xl flex flex-col gap-3 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-semibold text-indigo-200 uppercase tracking-wider">Premium Access</p>
              <h4 className="text-sm font-bold text-white">Advanced AI Coaching</h4>
              <button className="mt-4 bg-white/20 hover:bg-white/30 text-white text-[10px] py-2 px-4 rounded-lg backdrop-blur-md transition-all font-semibold uppercase tracking-wider">Upgrade</button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full"></div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-10">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Hello, {profile.displayName?.split(' ')[0] || 'Athlete'}</h1>
            <p className="text-slate-400 text-sm">Here is your fitness summary for {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active Streak</p>
              <p className="text-xl font-bold text-white">12 Days 🔥</p>
            </div>
            <Auth />
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left/Middle Column - Workouts and Quick Stats */}
          <section className="col-span-1 lg:col-span-8 flex flex-col gap-8">
            <WorkoutPlanner user={profile} />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Avg. HR', val: '142', unit: 'bpm', color: 'emerald' },
                { label: 'Calories', val: '520', unit: 'kcal', color: 'orange' },
                { label: 'Sleep', val: '7.5', unit: 'hrs', color: 'violet' },
                { label: 'Weight', val: profile.weight, unit: 'kg', color: 'indigo' },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.val} <span className="text-sm text-slate-500 font-normal">{stat.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Right Column - Goals */}
          <section className="col-span-1 lg:col-span-4 flex flex-col gap-8">
            <GoalTracker userId={user.uid} />
            
            {/* Weekly Overview - Static Decorator from Design */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Weekly Overview</p>
               <div className="flex justify-between items-end h-24 gap-2 px-1">
                  <div className="w-full bg-slate-800 rounded-full h-[60%]"></div>
                  <div className="w-full bg-slate-800 rounded-full h-[80%]"></div>
                  <div className="w-full bg-indigo-500 rounded-full h-[100%] shadow-[0_0_15px_rgba(99,102,241,0.4)]"></div>
                  <div className="w-full bg-slate-800 rounded-full h-[40%]"></div>
                  <div className="w-full bg-slate-800 rounded-full h-[70%]"></div>
                  <div className="w-full bg-slate-800 rounded-full h-[55%]"></div>
                  <div className="w-full bg-slate-800 rounded-full h-[30%]"></div>
               </div>
               <div className="flex justify-between mt-4 px-1">
                 {['M','T','W','T','F','S','S'].map((day, i) => (
                   <span key={i} className={`text-[10px] font-bold uppercase ${i === 2 ? 'text-indigo-400' : 'text-slate-500'}`}>{day}</span>
                 ))}
               </div>
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 p-4 flex justify-around z-50">
        <LayoutDashboard className="text-indigo-400" />
        <TrendingUp className="text-slate-500" />
        <Activity className="text-slate-500" />
        <Calendar className="text-slate-500" />
      </div>
    </div>
  );
}
