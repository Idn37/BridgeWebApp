import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";

const badgeColors = {
  gold: 'from-yellow-400 via-amber-400 to-yellow-500',
  silver: 'from-slate-300 via-slate-200 to-slate-400',
  bronze: 'from-orange-400 via-amber-500 to-orange-600',
  purple: 'from-violet-400 via-purple-400 to-violet-500',
  green: 'from-emerald-400 via-green-400 to-emerald-500',
  blue: 'from-sky-400 via-blue-400 to-sky-500',
};

export default function BadgeModal({ badge, isEarned, onClose }) {
  if (!badge) return null;

  const colorClass = badgeColors[badge.color] || badgeColors.purple;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-gradient-to-b from-slate-50 to-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ 
                rotate: -360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl"
            />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>

          {/* Badge display */}
          <div className="text-center relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="relative inline-block mb-6"
            >
              {/* Glow effect */}
              {isEarned && (
                <>
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`absolute inset-0 bg-gradient-to-br ${colorClass} rounded-3xl blur-2xl`}
                  />
                  {/* Sparkles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360],
                        x: [0, Math.cos(i * 60) * 40, Math.cos(i * 60) * 60],
                        y: [0, Math.sin(i * 60) * 40, Math.sin(i * 60) * 60],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeOut"
                      }}
                      className="absolute top-1/2 left-1/2 w-2 h-2"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                    </motion.div>
                  ))}
                </>
              )}

              {/* Badge */}
              <div className={`relative w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl ${
                isEarned 
                  ? `bg-gradient-to-br ${colorClass}` 
                  : 'bg-slate-200'
              }`}>
                <motion.div
                  animate={isEarned ? {
                    rotate: [0, -5, 5, -5, 0],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                >
                  <span className="text-6xl drop-shadow-lg">
                    {badge.icon || '🏆'}
                  </span>
                </motion.div>

                {/* Shine effect */}
                {isEarned && (
                  <motion.div
                    animate={{
                      x: ['-200%', '200%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-3xl"
                  />
                )}
              </div>

              {/* Earned checkmark */}
              {isEarned && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <span className="text-xl text-white font-bold">✓</span>
                </motion.div>
              )}
            </motion.div>

            {/* Badge info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {badge.name}
              </h3>
              <p className="text-slate-600 mb-4">
                {badge.description}
              </p>
              
              {isEarned ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-emerald-700">Earned!</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-full">
                  <div className="w-2 h-2 bg-slate-400 rounded-full" />
                  <span className="text-sm font-medium text-slate-600">Locked</span>
                </div>
              )}
            </motion.div>

            <Button
              onClick={onClose}
              className="mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 w-full"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}