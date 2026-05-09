import React from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LogIn, LogOut, Activity, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const Auth: React.FC = () => {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = () => signOut(auth);

  if (auth.currentUser) {
    return (
      <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-1.5 pl-4 rounded-full">
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-white leading-none mb-1">{auth.currentUser.displayName}</span>
          <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-[0.15em] leading-none">Verified Athlete</span>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-700 rounded-full blur-[160px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.4)] rotate-3">
            <Activity className="text-white" size={32} />
          </div>
        </div>
        
        <h1 className="text-5xl font-black text-white mb-4 tracking-tighter leading-tight italic uppercase">
          FITCORE<span className="text-indigo-400">AI</span>
        </h1>
        <p className="text-slate-400 mb-10 text-lg leading-relaxed">
          Elite fitness tracking powered by AI. <br/>Precision workouts for your goals.
        </p>

        <button
          onClick={handleLogin}
          className="group w-full bg-white text-slate-950 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-500 hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl"
        >
          <LogIn size={20} className="group-hover:rotate-12 transition-transform" />
          Authenticate with Google
        </button>

        <div className="mt-12 flex items-center justify-center gap-8 opacity-20 grayscale grayscale-100">
           {/* Mock logos or icons for social proof */}
           <Activity size={24} className="text-white" />
           <TrendingUp size={24} className="text-white" />
           <Zap size={24} className="text-white" />
        </div>
      </motion.div>
    </div>
  );
};
