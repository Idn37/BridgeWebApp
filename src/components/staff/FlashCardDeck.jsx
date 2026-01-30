import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import FlashCard from './FlashCard';

export default function FlashCardDeck({ decks, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < decks.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete?.();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentDeck = decks[currentIndex];
  const progress = ((currentIndex + 1) / decks.length) * 100;

  if (!currentDeck) return null;

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Progress bar */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">
            Card {currentIndex + 1} of {decks.length}
          </span>
          <span className="text-xs font-semibold text-violet-400">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Card container */}
      <div className="flex-1 px-6 py-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <FlashCard deck={currentDeck} />
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
          className="w-12 h-12 rounded-full border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5 text-slate-300" />
        </Button>

        <div className="flex gap-2">
          {decks.map((_, idx) => (
            <div 
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'w-6 bg-violet-500' 
                  : idx < currentIndex 
                    ? 'bg-violet-400' 
                    : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 shadow-lg"
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