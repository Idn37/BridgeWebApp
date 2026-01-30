import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Users, BookOpen, Mic, TrendingUp, 
  CheckCircle, Clock, Play, ChevronRight, Flame,
  Eye, MessageSquare, Award, BarChart3, Check, X, ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      window.location.href = createPageUrl('AdminAuth');
      return;
    }
    
    base44.auth.me().then(u => {
      setUser(u);
    }).catch(() => {
      base44.auth.redirectToLogin();
    });
  }, []);

  const { data: modules = [] } = useQuery({
    queryKey: ['allModules'],
    queryFn: () => base44.entities.Module.list('-session_date'),
  });

  const { data: allProgress = [] } = useQuery({
    queryKey: ['allProgress'],
    queryFn: () => base44.entities.UserProgress.list('-last_activity_date'),
  });

  const { data: voiceNotes = [] } = useQuery({
    queryKey: ['voiceNotes'],
    queryFn: () => base44.entities.VoiceNote.list('-created_date', 50),
  });

  const { data: decks = [] } = useQuery({
    queryKey: ['allDecks'],
    queryFn: () => base44.entities.Deck.list(),
  });

  const approveVoiceNoteMutation = useMutation({
    mutationFn: (noteId) => base44.entities.VoiceNote.update(noteId, { is_approved: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(['voiceNotes']);
    },
  });

  const rejectVoiceNoteMutation = useMutation({
    mutationFn: (noteId) => base44.entities.VoiceNote.delete(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries(['voiceNotes']);
    },
  });

  const deleteVoiceNoteMutation = useMutation({
    mutationFn: (noteId) => base44.entities.VoiceNote.delete(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries(['voiceNotes']);
    },
  });

  // Calculate stats
  const activeUsers = allProgress.filter(p => {
    if (!p.last_activity_date) return false;
    const lastActive = new Date(p.last_activity_date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return lastActive >= weekAgo;
  }).length;

  const totalCompletions = allProgress.reduce((sum, p) => sum + (p.modules_completed?.length || 0), 0);
  const avgStreak = allProgress.length > 0 
    ? Math.round(allProgress.reduce((sum, p) => sum + (p.current_streak || 0), 0) / allProgress.length)
    : 0;

  const pendingVoiceNotes = voiceNotes.filter(v => !v.is_approved);
  const approvedVoiceNotes = voiceNotes.filter(v => v.is_approved);

  const getModuleEngagement = (moduleId) => {
    return allProgress.filter(p => p.modules_completed?.includes(moduleId)).length;
  };

  const getModuleName = (moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    return module?.title || 'Unknown Module';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
          <p className="text-slate-400">Monitor staff engagement and manage content</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-8 h-8 opacity-80" />
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">This week</span>
              </div>
              <p className="text-3xl font-bold">{activeUsers}</p>
              <p className="text-violet-100 text-sm">Active Learners</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border border-slate-700 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <BookOpen className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-3xl font-bold text-white">{totalCompletions}</p>
              <p className="text-slate-400 text-sm">Module Completions</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border border-slate-700 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Flame className="w-8 h-8 text-orange-400" />
              </div>
              <p className="text-3xl font-bold text-white">{avgStreak}</p>
              <p className="text-slate-400 text-sm">Avg. Streak Days</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border border-slate-700 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Mic className="w-8 h-8 text-violet-400" />
                {pendingVoiceNotes.length > 0 && (
                  <span className="text-xs bg-amber-900/50 text-amber-400 px-2 py-1 rounded-full font-medium border border-amber-700/50">
                    {pendingVoiceNotes.length} pending
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-white">{voiceNotes.length}</p>
              <p className="text-slate-400 text-sm">Voice Notes</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Voice Notes Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-800 border border-slate-700 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2 text-white">
                    <Mic className="w-5 h-5 text-violet-400" />
                    Voice Notes Manager
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="pending">
                      Pending ({pendingVoiceNotes.length})
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                      Approved ({approvedVoiceNotes.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="pending">
                    <ScrollArea className="h-96">
                      <div className="space-y-3">
                        {pendingVoiceNotes.map((note, idx) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                              <Mic className="w-5 h-5 text-violet-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-900">
                                {note.contributor_name || 'Anonymous'}
                              </p>
                              <p className="text-xs text-slate-500 mb-1">
                                {getModuleName(note.module_id)}
                              </p>
                              <p className="text-xs text-slate-400">
                                {note.duration_seconds}s • {format(new Date(note.created_date), 'MMM d, h:mm a')}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <audio 
                          src={note.audio_url} 
                          controls 
                          className="w-full mb-3 h-10"
                          style={{ maxHeight: '40px' }}
                        />

                        {note.transcript && (
                          <p className="text-sm text-slate-600 mb-3 bg-white p-3 rounded-lg border border-slate-100">
                            "{note.transcript}"
                          </p>
                        )}

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => approveVoiceNoteMutation.mutate(note.id)}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectVoiceNoteMutation.mutate(note.id)}
                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </motion.div>
                    ))}

                        {pendingVoiceNotes.length === 0 && (
                          <div className="text-center py-12 text-slate-500">
                            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>All voice notes reviewed!</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="approved">
                    <ScrollArea className="h-96">
                      <div className="space-y-3">
                        {approvedVoiceNotes.map((note, idx) => (
                          <motion.div
                            key={note.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-slate-900">
                                    {note.contributor_name || 'Anonymous'}
                                  </p>
                                  <p className="text-xs text-slate-500 mb-1">
                                    {getModuleName(note.module_id)}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {note.duration_seconds}s • {format(new Date(note.created_date), 'MMM d, h:mm a')}
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-emerald-100 text-emerald-700 border-0">
                                Approved
                              </Badge>
                            </div>
                            
                            <audio 
                              src={note.audio_url} 
                              controls 
                              className="w-full mb-3 h-10"
                              style={{ maxHeight: '40px' }}
                            />

                            {note.transcript && (
                              <p className="text-sm text-slate-600 mb-3 bg-white p-3 rounded-lg border border-slate-100">
                                "{note.transcript}"
                              </p>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteVoiceNoteMutation.mutate(note.id)}
                              className="w-full text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </motion.div>
                        ))}

                        {approvedVoiceNotes.length === 0 && (
                          <div className="text-center py-12 text-slate-500">
                            <Mic className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No approved voice notes yet</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <Card className="bg-slate-800 border border-slate-700 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to={createPageUrl('ManageModules')}>
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Manage Modules
                  </Button>
                </Link>
                <Link to={createPageUrl('VoiceVault')}>
                  <Button variant="outline" className="w-full justify-start">
                    <Mic className="w-4 h-4 mr-2" />
                    View Voice Vault
                  </Button>
                </Link>
                <Link to={createPageUrl('Welcome')}>
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Exit Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border border-slate-700 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Engagement Tip</p>
                    <p className="text-sm text-slate-300">
                      Approve voice notes to build a rich community knowledge base
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Engagement by Module */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Card className="bg-slate-800 border border-slate-700 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <BarChart3 className="w-5 h-5 text-violet-400" />
                Module Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules.slice(0, 6).map((module, idx) => {
                  const engagement = getModuleEngagement(module.id);
                  const totalStaff = allProgress.length || 1;
                  const engagementPercent = Math.round((engagement / totalStaff) * 100);
                  const deckCount = decks.filter(d => d.module_id === module.id).length;

                  return (
                    <div key={module.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-white truncate max-w-xs">
                            {module.title}
                          </span>
                          <span className="text-xs text-slate-500">{deckCount} blocks</span>
                        </div>
                        <span className="text-sm font-semibold text-white">{engagementPercent}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${engagementPercent}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}