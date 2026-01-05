import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Star, Zap } from 'lucide-react';

export default function StreakBanner({ streak = 0, points = 0, longestStreak = 0 }) {
  const getStreakMessage = () => {
    if (streak === 0) return "Start your streak today!";
    if (streak < 3) return "You're building momentum!";
    if (streak < 7) return "Amazing consistency!";
    if (streak < 14) return "You're on fire! 🔥";
    return "Legendary learner! 🏆";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 p-6 text-white"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-violet-200 text-sm font-medium mb-1">Your Knowledge Streak</p>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <Flame className="w-8 h-8 text-orange-400" />
              </motion.div>
              <span className="text-4xl font-bold">{streak}</span>
              <span className="text-violet-200 text-lg">days</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <div className="flex items-center gap-1.5 justify-end mb-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-lg font-bold">{points}</span>
              </div>
              <p className="text-xs text-violet-200">Total Points</p>
            </div>
          </div>
        </div>

        <p className="text-violet-100 text-sm">{getStreakMessage()}</p>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">Best: {longestStreak} days</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm">+10 pts/day</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}