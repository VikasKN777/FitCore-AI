import React, { useState, useEffect } from 'react';
import { UserProfile, Workout } from '../types/fitness';
import { generateWorkout } from '../services/geminiService';
import { fitnessService } from '../services/fitnessService';
import { Sparkles, Brain, Clock, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  user: UserProfile;
}

export const WorkoutPlanner: React.FC<Props> = ({ user }) => {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchWorkout = async () => {
      const existing = await fitnessService.getWorkoutForDate(user.uid, today);
      if (existing) setWorkout(existing);
    };
    fetchWorkout();
  }, [user.uid, today]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const generated = await generateWorkout(user, today);
      await fitnessService.saveWorkout(user.uid, generated);
      setWorkout(generated);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!workout) return;
    try {
      await fitnessService.logWorkout(user.uid, {
        userId: user.uid,
        workoutId: workout.id,
        title: workout.title,
        duration: workout.estimatedTime,
        notes: 'Completed AI suggested workout'
      });
      setIsLogged(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (!workout) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
              <Brain className="text-indigo-400" size={24} />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Coach AI Engine</span>
          </div>
          
          <h2 className="text-4xl font-bold mb-6 tracking-tighter leading-tight max-w-sm text-white">
            Ready for your daily <span className="text-indigo-400 italic">push?</span>
          </h2>
          
          <p className="text-slate-400 mb-10 text-lg max-w-md">
            Our AI analyzes your profile and goals to curate the perfect routine for today.
          </p>

          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="bg-indigo-500 text-white py-4 px-8 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-600 transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            {loading ? 'Consulting Coach...' : 'Generate Today\'s Workout'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
    >
      <div className="bg-slate-800/50 p-8 md:p-10 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{workout.difficulty} • {workout.estimatedTime} Mins</span>
          </div>
          <h3 className="text-4xl font-bold text-white tracking-tight leading-none">{workout.title}</h3>
        </div>
        {!isLogged && (
          <button 
            onClick={handleComplete}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <CheckCircle2 size={18} />
            Start Session
          </button>
        )}
      </div>

      <div className="p-8 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {workout.exercises.map((ex, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl hover:bg-slate-800/30 transition-colors group">
              <div className="flex gap-4 items-center">
                <span className="text-xl font-mono text-slate-700 font-bold">
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                <div>
                  <p className="font-bold text-white mb-0.5">{ex.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{ex.sets} Sets • {ex.reps || ex.duration}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLogged && (
          <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-2xl font-bold flex items-center justify-center gap-3 border border-emerald-500/20">
            <CheckCircle2 size={24} />
            Today's Session Completed
          </div>
        )}
      </div>
    </motion.div>
  );
}
;
