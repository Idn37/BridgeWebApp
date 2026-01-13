import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Trophy, BookOpen, Sparkles, ChevronRight } from 'lucide-react';

import ModuleCard from '@/components/staff/ModuleCard';
import StreakBanner from '@/components/staff/StreakBanner';
import BadgeDisplay from '@/components/staff/BadgeDisplay';
import Leaderboard from '@/components/staff/Leaderboard';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: modules = [] } = useQuery({
    queryKey: ['modules'],
    queryFn: () => base44.entities.Module.filter({ is_published: true }, '-session_date'),
  });

  const { data: badges = [] } = useQuery({
    queryKey: ['badges'],
    queryFn: () => base44.entities.Badge.list(),
  });

  const { data: allProgress = [] } = useQuery({
    queryKey: ['allProgress'],
    queryFn: () => base44.entities.UserProgress.list('-total_points', 20),
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
  });

  const upcomingModules = modules.filter(m => 
    m.session_date && new Date(m.session_date) > new Date()
  ).slice(0, 3);

  const recentModules = modules.slice(0, 6);

  const getModuleProgress = (moduleId) => {
    if (!userProgress?.decks_viewed) return 0;
    // Simple progress calculation
    return userProgress.modules_completed?.includes(moduleId) ? 100 : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-slate-500 text-sm">Welcome back,</p>
              <h1 className="text-2xl font-bold text-slate-900">
                {user?.full_name?.split(' ')[0] || 'Learner'} 👋
              </h1>
            </div>
            <Link to={createPageUrl('VoiceVault')}>
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full border-violet-200 hover:bg-violet-50"
              >
                <Mic className="w-5 h-5 text-violet-600" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Streak Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <StreakBanner 
            streak={userProgress?.current_streak || 0}
            points={userProgress?.total_points || 0}
            longestStreak={userProgress?.longest_streak || 0}
          />
        </motion.div>

        {/* Upcoming Sessions */}
        {upcomingModules.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Get Ready For
              </h2>
              <Link to={createPageUrl('Modules')} className="text-sm text-violet-600 font-medium flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingModules.map((module, idx) => (
                <Link key={module.id} to={createPageUrl(`ModuleView?id=${module.id}`)}>
                  <ModuleCard 
                    module={module} 
                    progress={getModuleProgress(module.id)}
                  />
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* Browse & Leaderboard Tabs */}
        <Tabs defaultValue="browse" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-xl">
            <TabsTrigger 
              value="browse" 
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Browse
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              {recentModules.map((module, idx) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link to={createPageUrl(`ModuleView?id=${module.id}`)}>
                    <ModuleCard 
                      module={module} 
                      progress={getModuleProgress(module.id)}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-4">
            <Leaderboard users={allProgress} currentUserEmail={user?.email} />
          </TabsContent>
        </Tabs>

        {/* Badges Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Your Badges</h2>
            <span className="text-sm text-slate-500">
              {userProgress?.badges?.length || 0}/{badges.length} earned
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <BadgeDisplay badges={badges} earnedBadgeIds={userProgress?.badges || []} />
          </div>
        </motion.section>
      </div>
    </div>
  );
}