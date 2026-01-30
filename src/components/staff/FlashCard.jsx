import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, RotateCcw } from 'lucide-react';

const emojiMap = {
  '👤': '👤',
  '👔': '👔',
  '✨': '✨',
  '🎟️': '🎟️',
  '🏷️': '🏷️',
  '🚪': '🚪',
  '📞': '📞',
  '📱': '📱',
  '♿': '♿',
  '🤝': '🤝',
};

export default function FlashCard({ deck, onFlip }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  const emoji = deck.icon || '📖';

  return (
    <div 
      onClick={handleFlip}
      className="perspective-1000 cursor-pointer w-full h-[500px] select-none"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of Card */}
        <div 
          className="absolute inset-0 backface-hidden bg-gradient-to-br from-violet-500 to-indigo-600 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-8xl mb-6">{emoji}</div>
          <h2 className="text-3xl font-bold text-white text-center leading-tight">
            {deck.title}
          </h2>
          <p className="text-violet-100 text-sm mt-6 opacity-75">Tap to flip</p>
        </div>

        {/* Back of Card */}
        <div 
          className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-2xl overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-br from-violet-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{deck.title}</h3>
                <RotateCcw className="w-5 h-5 opacity-75" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {deck.content && (
                <p className="text-slate-600 leading-relaxed mb-6">
                  {deck.content}
                </p>
              )}

              {deck.key_points?.length > 0 && (
                <div className="space-y-4">
                  {deck.key_points.map((point, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <p className="text-slate-700 leading-relaxed">{point}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}