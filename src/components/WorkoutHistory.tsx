import React, { useState, useEffect } from 'react';
import { fitnessService } from '../services/fitnessService';
import { WorkoutLog } from '../types/fitness';
import { History, Clock, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  userId: string;
}

export const WorkoutHistory: React.FC<Props> = ({ userId }) => {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);

  useEffect(() => {
    const unsubscribe = fitnessService.subscribeToLogs(userId, setLogs);
    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <History size={16} />
          Training History
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {logs.map((log, index) => (
          <motion.div 
            key={log.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <CalendarIcon size={18} />
              </div>
              <div>
                <p className="font-bold text-white text-sm">{log.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    {new Date(log.date?.toDate?.() || log.date).toLocaleDateString()}
                  </span>
                  <span className="w-1 h-1 bg-slate-800 rounded-full" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Clock size={10} />
                    {log.duration} MINS
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="text-slate-800 group-hover:text-slate-500 transition-colors" size={18} />
          </motion.div>
        ))}
        {logs.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-slate-600 text-xs italic">No workout logs yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
