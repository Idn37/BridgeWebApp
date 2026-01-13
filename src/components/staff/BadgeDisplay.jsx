import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import BadgeModal from './BadgeModal';

const badgeColors = {
  gold: 'from-yellow-400 via-amber-400 to-yellow-500',
  silver: 'from-slate-300 via-slate-200 to-slate-400',
  bronze: 'from-orange-400 via-amber-500 to-orange-600',
  purple: 'from-violet-400 via-purple-400 to-violet-500',
  green: 'from-emerald-400 via-green-400 to-emerald-500',
  blue: 'from-sky-400 via-blue-400 to-sky-500',
};

export default function BadgeDisplay({ badges, earnedBadgeIds = [] }) {
  const [selectedBadge, setSelectedBadge] = useState(null);

  return (
    <>
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
              className="text-center cursor-pointer"
              onClick={() => setSelectedBadge(badge)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`relative w-16 h-16 mx-auto mb-2 rounded-2xl flex items-center justify-center transition-all ${
                isEarned 
                  ? `bg-gradient-to-br ${colorClass} shadow-lg hover:shadow-xl` 
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}>
                {isEarned ? (
                  <>
                    <span className="text-2xl">{badge.icon || '🏆'}</span>
                    {/* Shine effect */}
                    <motion.div
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl"
                    />
                  </>
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

      {selectedBadge && (
        <BadgeModal
          badge={selectedBadge}
          isEarned={earnedBadgeIds.includes(selectedBadge.id)}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </>
  );
}