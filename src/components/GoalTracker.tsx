import React, { useState, useEffect } from 'react';
import { fitnessService } from '../services/fitnessService';
import { Goal } from '../types/fitness';
import { Target, Plus, CheckCircle2, Circle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  userId: string;
}

export const GoalTracker: React.FC<Props> = ({ userId }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '' });

  useEffect(() => {
    const unsubscribe = fitnessService.subscribeToGoals(userId, setGoals);
    return () => unsubscribe();
  }, [userId]);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title) return;
    
    await fitnessService.addGoal(userId, {
      userId,
      title: newGoal.title,
      description: newGoal.description,
      status: 'in_progress',
      targetDate: null
    });
    setNewGoal({ title: '', description: '' });
    setShowAdd(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Daily Goals</h3>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="p-1.5 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleAddGoal}
            className="overflow-hidden space-y-4"
          >
            <input 
              type="text" 
              placeholder="E.g. Lose 5kg"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-indigo-500 text-sm"
            />
            <button className="w-full bg-indigo-500 text-white py-2 rounded-xl text-sm font-bold">Add Goal</button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6">
        {goals.map((goal, index) => (
          <div key={goal.id || index} className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className={`font-medium ${goal.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                {goal.title}
              </span>
              <span className="text-slate-500 text-xs">{goal.status === 'completed' ? 'Goal Met' : 'Active'}</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${goal.status === 'completed' ? 'bg-emerald-500 w-full' : 'bg-indigo-500 w-[45%]'}`} 
              />
            </div>
          </div>
        ))}
        {goals.length === 0 && (
          <p className="text-center py-4 text-slate-600 text-xs italic tracking-wide">No goals set yet.</p>
        )}
      </div>
    </div>
  );
};
