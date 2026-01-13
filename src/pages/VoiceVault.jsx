import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Play, User, Calendar, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function VoiceVault() {
  const [user, setUser] = useState(null);
  const [selectedModule, setSelectedModule] = useState('all');

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: approvedVoiceNotes = [] } = useQuery({
    queryKey: ['approvedVoiceNotes'],
    queryFn: async () => {
      const notes = await base44.entities.VoiceNote.filter({ is_approved: true }, '-created_date');
      return notes;
    },
  });

  const { data: modules = [] } = useQuery({
    queryKey: ['modules'],
    queryFn: () => base44.entities.Module.list(),
  });

  // Group voice notes by module
  const notesByModule = approvedVoiceNotes.reduce((acc, note) => {
    const moduleId = note.module_id || 'general';
    if (!acc[moduleId]) {
      acc[moduleId] = [];
    }
    acc[moduleId].push(note);
    return acc;
  }, {});

  const getModuleName = (moduleId) => {
    if (moduleId === 'general') return 'General';
    const module = modules.find(m => m.id === moduleId);
    return module?.title || 'Unknown Module';
  };

  const filteredNotes = selectedModule === 'all' 
    ? approvedVoiceNotes 
    : notesByModule[selectedModule] || [];

  const moduleOptions = Object.keys(notesByModule).map(moduleId => ({
    id: moduleId,
    name: getModuleName(moduleId),
    count: notesByModule[moduleId].length
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Link to={createPageUrl('Home')}>
              <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Voice Vault</h1>
              <p className="text-sm text-slate-500">Community learning insights</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-violet-500 to-indigo-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{approvedVoiceNotes.length}</p>
                <p className="text-violet-100 text-sm">Approved Voice Notes</p>
              </div>
            </div>
            <p className="text-sm text-violet-100">
              Listen to insights and takeaways shared by your colleagues
            </p>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              <button
                onClick={() => setSelectedModule('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedModule === 'all'
                    ? 'bg-violet-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                All ({approvedVoiceNotes.length})
              </button>
              {moduleOptions.map(module => (
                <button
                  key={module.id}
                  onClick={() => setSelectedModule(module.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedModule === module.id
                      ? 'bg-violet-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {module.name} ({module.count})
                </button>
              ))}
            </div>
          </ScrollArea>
        </motion.div>

        {/* Voice Notes List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredNotes.map((note, idx) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900">
                        {note.contributor_name || 'Anonymous Contributor'}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="text-xs bg-violet-50 text-violet-700 border-violet-200">
                          {getModuleName(note.module_id)}
                        </Badge>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(note.created_date), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-600">
                        {note.duration_seconds}s
                      </div>
                    </div>
                  </div>

                  {note.transcript && (
                    <div className="mb-4 p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-700 italic">
                        "{note.transcript}"
                      </p>
                    </div>
                  )}

                  <audio 
                    src={note.audio_url} 
                    controls 
                    className="w-full"
                    style={{ height: '45px' }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredNotes.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Mic className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium mb-1">No voice notes yet</p>
              <p className="text-sm text-slate-400">
                {selectedModule === 'all' 
                  ? 'Be the first to share your insights!'
                  : 'No approved voice notes for this module yet'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}