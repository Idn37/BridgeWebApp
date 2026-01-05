import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Lightbulb, Target, Zap, BookOpen, Star } from 'lucide-react';

const iconMap = {
  lightbulb: Lightbulb,
  target: Target,
  zap: Zap,
  book: BookOpen,
  star: Star,
};

export default function DeckSwiper({ decks, onComplete, onDeckView }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const handleNext = () => {
    if (currentIndex < decks.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
      onDeckView?.(decks[currentIndex + 1]?.id);
    } else {
      onComplete?.();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentDeck = decks[currentIndex];
  const IconComponent = iconMap[currentDeck?.icon] || Lightbulb;
  const progress = ((currentIndex + 1) / decks.length) * 100;

  if (!currentDeck) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500">
            Building Block {currentIndex + 1} of {decks.length}
          </span>
          <span className="text-xs font-semibold text-violet-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Card container */}
      <div className="flex-1 relative overflow-hidden px-4 py-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-4"
          >
            <div className="h-full bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-br from-violet-500 to-indigo-600 p-6 text-white">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold leading-tight">{currentDeck.title}</h2>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-slate-600 leading-relaxed mb-6">
                  {currentDeck.content}
                </p>

                {currentDeck.key_points?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Key Takeaways
                    </h4>
                    <ul className="space-y-2.5">
                      {currentDeck.key_points.map((point, idx) => (
                        <motion.li 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-emerald-600" />
                          </div>
                          <span className="text-sm text-slate-700">{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-6 flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="w-12 h-12 rounded-full border-slate-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="flex gap-1.5">
          {decks.map((_, idx) => (
            <div 
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'w-6 bg-violet-500' 
                  : idx < currentIndex 
                    ? 'bg-violet-300' 
                    : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 shadow-lg shadow-violet-200"
        >
          {currentIndex === decks.length - 1 ? (
            <Check className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
}