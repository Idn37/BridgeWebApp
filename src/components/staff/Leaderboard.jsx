import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Medal } from 'lucide-react';

const rankColors = {
  0: 'from-yellow-400 to-amber-500',
  1: 'from-slate-300 to-slate-400',
  2: 'from-orange-400 to-orange-500',
};

const rankIcons = {
  0: Trophy,
  1: Medal,
  2: Medal,
};

export default function Leaderboard({ users = [], currentUserEmail }) {
  const sortedUsers = [...users].sort((a, b) => (b.total_points || 0) - (a.total_points || 0));

  return (
    <div className="space-y-3">
      {sortedUsers.slice(0, 10).map((user, idx) => {
        const isCurrentUser = user.user_email === currentUserEmail;
        const RankIcon = rankIcons[idx];
        
        return (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`flex items-center gap-4 p-3 rounded-xl ${
              isCurrentUser ? 'bg-violet-50 border-2 border-violet-200' : 'bg-white border border-slate-100'
            }`}
          >
            {/* Rank */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              idx < 3 
                ? `bg-gradient-to-br ${rankColors[idx]} text-white shadow-sm` 
                : 'bg-slate-100 text-slate-600'
            }`}>
              {idx < 3 && RankIcon ? (
                <RankIcon className="w-4 h-4" />
              ) : (
                <span className="text-sm font-bold">{idx + 1}</span>
              )}
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${isCurrentUser ? 'text-violet-900' : 'text-slate-900'}`}>
                {user.user_name || user.user_email?.split('@')[0] || 'Anonymous'}
                {isCurrentUser && <span className="text-violet-500 ml-1">(You)</span>}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Flame className="w-3 h-3 text-orange-500" />
                <span>{user.current_streak || 0} day streak</span>
              </div>
            </div>

            {/* Points */}
            <div className="text-right">
              <p className="font-bold text-slate-900">{user.total_points || 0}</p>
              <p className="text-xs text-slate-500">points</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}