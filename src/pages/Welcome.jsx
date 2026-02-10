import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { BookOpen, Trophy, Mic, Sparkles, ArrowRight, Zap, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Welcome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleGetStarted = async () => {
    if (!user?.email) {
      base44.auth.redirectToLogin(window.location.origin);
      return;
    }

    // Update streak once per day when visiting the app
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">GTRSG BRIDGING TRAINING</h1>
          </div>
        </motion.div>
      </div>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-md"
        >
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-violet-600/20 backdrop-blur-sm rounded-3xl mb-6 border-2 border-violet-500/30">
              <Sparkles className="w-12 h-12 text-violet-400" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Building Real Insights, Driving Growth & Excellence
            </h2>
            <p className="text-lg text-slate-300">
              Your professional bite-sized training platform.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-10">
            {[
              { icon: BookOpen, text: "Bite-sized training modules" },
              { icon: Trophy, text: "Track progress & earn badges" },
              { icon: Mic, text: "Share voice insights" }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="flex items-center gap-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50"
              >
                <div className="w-12 h-12 bg-violet-600/20 rounded-xl flex items-center justify-center border border-violet-500/30">
                  <feature.icon className="w-6 h-6 text-violet-400" />
                </div>
                <span className="text-slate-200 font-medium text-left">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={handleGetStarted}
              className="w-full h-14 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-2xl text-lg font-semibold shadow-2xl shadow-violet-500/20"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-slate-400 mt-6 italic">
              "Fast facts in your pocket. Get the gist. Get going."
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Dashboard Button - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => navigate(createPageUrl('AdminAuth'))}
          className="w-16 h-16 rounded-full bg-slate-800/80 backdrop-blur-sm border-2 border-slate-700 hover:bg-slate-700 shadow-2xl"
        >
          <LayoutDashboard className="w-7 h-7 text-slate-300" />
        </Button>
      </div>
    </div>
  );
}