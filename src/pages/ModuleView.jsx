import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Clock, BookOpen, Calendar, Mic, CheckCircle, Share2 } from 'lucide-react';
import { format } from 'date-fns';

import DeckSwiper from '@/components/staff/DeckSwiper';
import VoiceRecorder from '@/components/staff/VoiceRecorder';

export default function ModuleView() {
  const [user, setUser] = useState(null);
  const [showDecks, setShowDecks] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const queryClient = useQueryClient();

  const urlParams = new URLSearchParams(window.location.search);
  const moduleId = urlParams.get('id');

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: module } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: async () => {
      const results = await base44.entities.Module.filter({ id: moduleId });
      return results[0];
    },
    enabled: !!moduleId,
  });

  const { data: decks = [] } = useQuery({
    queryKey: ['decks', moduleId],
    queryFn: async () => {
      const results = await base44.entities.Deck.filter({ module_id: moduleId }, 'order');
      return results;
    },
    enabled: !!moduleId,
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      return results[0];
    },
    enabled: !!user?.email,
  });

  const { data: allBadges = [] } = useQuery({
    queryKey: ['badges'],
    queryFn: () => base44.entities.Badge.list(),
  });

  const checkAndAwardBadges = async (updatedProgress) => {
    const currentBadgeIds = updatedProgress.badges || [];
    const newBadges = [];

    for (const badge of allBadges) {
      if (currentBadgeIds.includes(badge.id)) continue;

      let shouldAward = false;
      
      switch (badge.requirement_type) {
        case 'modules_completed':
          shouldAward = (updatedProgress.modules_completed?.length || 0) >= badge.requirement_value;
          break;
        case 'streak':
          shouldAward = (updatedProgress.current_streak || 0) >= badge.requirement_value;
          break;
        case 'voice_notes':
          shouldAward = (updatedProgress.voice_notes_count || 0) >= badge.requirement_value;
          break;
        case 'points':
          shouldAward = (updatedProgress.total_points || 0) >= badge.requirement_value;
          break;
      }

      if (shouldAward) {
        newBadges.push(badge.id);
      }
    }

    if (newBadges.length > 0) {
      const allBadgeIds = [...currentBadgeIds, ...newBadges];
      await base44.entities.UserProgress.update(updatedProgress.id, {
        badges: allBadgeIds,
      });
      return newBadges;
    }

    return [];
  };

  const updateProgressMutation = useMutation({
    mutationFn: async (data) => {
      if (!user?.email) return;
      
      const today = new Date().toISOString().split('T')[0];
      let updatedProgress;
      
      if (userProgress) {
        const modulesCompleted = [...new Set([...(userProgress.modules_completed || []), moduleId])];
        let newStreak = userProgress.current_streak || 0;
        
        if (userProgress.last_activity_date !== today) {
          const lastDate = userProgress.last_activity_date ? new Date(userProgress.last_activity_date) : null;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastDate && lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
            newStreak += 1;
          } else if (!lastDate || lastDate.toISOString().split('T')[0] !== today) {
            newStreak = 1;
          }
        }

        const updateData = {
          modules_completed: modulesCompleted,
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, userProgress.longest_streak || 0),
          last_activity_date: today,
          total_points: (userProgress.total_points || 0) + 10,
        };

        await base44.entities.UserProgress.update(userProgress.id, updateData);
        
        updatedProgress = {
          ...userProgress,
          ...updateData,
        };
      } else {
        const createData = {
          user_email: user.email,
          user_name: user.full_name,
          modules_completed: [moduleId],
          current_streak: 1,
          longest_streak: 1,
          last_activity_date: today,
          total_points: 10,
          badges: [],
          decks_viewed: [],
        };
        
        const created = await base44.entities.UserProgress.create(createData);
        updatedProgress = created;
      }

      const newBadges = await checkAndAwardBadges(updatedProgress);
      return { newBadges };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries(['userProgress']);
      setIsComplete(true);
    },
  });

  const handleComplete = () => {
    updateProgressMutation.mutate();
  };

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  const isModuleComplete = userProgress?.modules_completed?.includes(moduleId);

  return (
    <div className="min-h-screen bg-slate-50">
      <AnimatePresence mode="wait">
        {!showDecks ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            className="relative"
          >
            {/* Hero */}
            <div className="relative h-72 overflow-hidden">
              <img
                src={module.cover_image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800'}
                alt={module.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
              
              {/* Back button */}
              <Link 
                to={createPageUrl('Home')} 
                className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>

              {/* Title */}
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-2xl font-bold text-white mb-2">{module.title}</h1>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {module.duration_minutes || 5} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {decks.length} blocks
                  </span>
                  {module.session_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(module.session_date), 'MMM d')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status */}
              {isModuleComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-800 font-medium">You've completed this module!</span>
                </motion.div>
              )}

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">About this module</h2>
                <p className="text-slate-600 leading-relaxed">
                  {module.description || 'Get ready for your upcoming training session with these bite-sized building blocks. Each card contains key concepts and takeaways to help you prepare.'}
                </p>
              </div>

              {/* What you'll learn */}
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-3">What you'll learn</h2>
                <div className="space-y-2">
                  {decks.slice(0, 4).map((deck, idx) => (
                    <motion.div
                      key={deck.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3 bg-white rounded-lg p-3 border border-slate-100"
                    >
                      <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-violet-600">{idx + 1}</span>
                      </div>
                      <span className="text-slate-700">{deck.title}</span>
                    </motion.div>
                  ))}
                  {decks.length > 4 && (
                    <p className="text-sm text-slate-500 pl-11">+ {decks.length - 4} more blocks</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={() => setShowDecks(true)}
                  className="w-full h-14 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl text-lg font-semibold shadow-lg shadow-violet-200"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {isModuleComplete ? 'Review Again' : 'Start Learning'}
                </Button>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowRecorder(true)}
                    className="flex-1 h-12 rounded-xl border-slate-200"
                  >
                    <Mic className="w-4 h-4 mr-2 text-violet-600" />
                    Voice Note
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-xl border-slate-200"
                  >
                    <Share2 className="w-4 h-4 mr-2 text-slate-600" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="decks"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="h-screen flex flex-col bg-slate-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
              <button 
                onClick={() => setShowDecks(false)}
                className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-semibold text-slate-900">{module.title}</h2>
              <div className="w-10" />
            </div>

            {/* Deck Swiper */}
            <DeckSwiper 
              decks={decks} 
              onComplete={handleComplete}
              onDeckView={(deckId) => {
                // Optional: Track individual deck views
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Modal */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Module Complete!</h3>
              <p className="text-slate-500 mb-6">
                You've earned 10 points and extended your streak. Keep it up!
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRecorder(true)}
                  className="flex-1 h-12 rounded-xl"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Add Voice Note
                </Button>
                <Link to={createPageUrl('Home')} className="flex-1">
                  <Button className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-700">
                    Continue
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Recorder Modal */}
      <AnimatePresence>
        {showRecorder && (
          <VoiceRecorder 
            moduleId={moduleId}
            onClose={() => setShowRecorder(false)}
            onSubmit={() => {
              setShowRecorder(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}