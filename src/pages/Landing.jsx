import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Landing() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleNext = async () => {
    if (!user?.email) {
      navigate(createPageUrl('Home'));
      return;
    }

    // Update streak when visiting the app
    try {
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      const userProgress = results[0];
      const today = new Date().toISOString().split('T')[0];

      if (userProgress) {
        // Only update if last activity was not today
        if (userProgress.last_activity_date !== today) {
          let newStreak = userProgress.current_streak || 0;
          const lastDate = userProgress.last_activity_date ? new Date(userProgress.last_activity_date) : null;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastDate && lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
            newStreak += 1;
          } else if (!lastDate) {
            newStreak = 1;
          } else {
            newStreak = 1; // Reset if missed a day
          }

          await base44.entities.UserProgress.update(userProgress.id, {
            current_streak: newStreak,
            longest_streak: Math.max(newStreak, userProgress.longest_streak || 0),
            last_activity_date: today,
          });
        }
      } else {
        // Create new progress record if doesn't exist
        await base44.entities.UserProgress.create({
          user_email: user.email,
          user_name: user.full_name,
          modules_completed: [],
          current_streak: 1,
          longest_streak: 1,
          last_activity_date: today,
          total_points: 0,
          badges: [],
          decks_viewed: [],
        });
      }
    } catch (error) {
      console.error('Failed to update streak:', error);
    }

    navigate(createPageUrl('Home'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          GTRSG BRIDGE<br />WEB APP
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 italic mb-12">
          "Fast facts in your pocket. Get the gist. Get going."
        </p>
        
        <Button 
          onClick={handleNext}
          className="h-16 px-12 text-lg font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-2xl shadow-2xl shadow-violet-500/20"
        >
          NEXT
          <ArrowRight className="w-6 h-6 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}