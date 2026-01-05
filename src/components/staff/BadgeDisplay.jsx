import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const badgeColors = {
  gold: 'from-yellow-400 to-amber-500',
  silver: 'from-slate-300 to-slate-400',
  bronze: 'from-orange-400 to-orange-600',
  purple: 'from-violet-400 to-purple-500',
  green: 'from-emerald-400 to-green-500',
  blue: 'from-sky-400 to-blue-500',
};

export default function BadgeDisplay({ badges, earnedBadgeIds = [] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {badges.map((badge, idx) => {
        const isEarned = earnedBadgeIds.includes(badge.id);
        const colorClass = badgeColors[badge.color] || badgeColors.purple;

        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="text-center"
          >
            <div className={`relative w-16 h-16 mx-auto mb-2 rounded-2xl flex items-center justify-center ${
              isEarned 
                ? `bg-gradient-to-br ${colorClass} shadow-lg` 
                : 'bg-slate-100'
            }`}>
              {isEarned ? (
                <span className="text-2xl">{badge.icon || '🏆'}</span>
              ) : (
                <Lock className="w-5 h-5 text-slate-400" />
              )}
              
              {isEarned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-md"
                >
                  <span className="text-xs text-white">✓</span>
                </motion.div>
              )}
            </div>
            
            <p className={`text-xs font-medium ${isEarned ? 'text-slate-900' : 'text-slate-400'}`}>
              {badge.name}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
              {badge.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}