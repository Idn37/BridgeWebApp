import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Pencil, Trash2, BookOpen, Calendar, 
  GripVertical, X, Save, Eye, EyeOff, Layers
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const categories = ['onboarding', 'compliance', 'skills', 'leadership', 'product', 'safety'];
const difficulties = ['beginner', 'intermediate', 'advanced'];

export default function ManageModules() {
  const [editingModule, setEditingModule] = useState(null);
  const [showModuleDialog, setShowModuleDialog] = useState(false);
  const [showDeckDialog, setShowDeckDialog] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [editingDeck, setEditingDeck] = useState(null);
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u?.role !== 'admin') {
        window.location.href = '/';
      }
      setUser(u);
    }).catch(() => {
      base44.auth.redirectToLogin();
    });
  }, []);

  const { data: modules = [] } = useQuery({
    queryKey: ['allModules'],
    queryFn: () => base44.entities.Module.list('-created_date'),
  });

  const { data: decks = [] } = useQuery({
    queryKey: ['allDecks'],
    queryFn: () => base44.entities.Deck.list('order'),
  });

  const createModuleMutation = useMutation({
    mutationFn: (data) => base44.entities.Module.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['allModules']);
      setShowModuleDialog(false);
      setEditingModule(null);
    },
  });

  const updateModuleMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Module.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['allModules']);
      setShowModuleDialog(false);
      setEditingModule(null);
    },
  });

  const deleteModuleMutation = useMutation({
    mutationFn: (id) => base44.entities.Module.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['allModules']),
  });

  const createDeckMutation = useMutation({
    mutationFn: (data) => base44.entities.Deck.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['allDecks']);
      setShowDeckDialog(false);
      setEditingDeck(null);
    },
  });

  const updateDeckMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Deck.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['allDecks']);
      setShowDeckDialog(false);
      setEditingDeck(null);
    },
  });

  const deleteDeckMutation = useMutation({
    mutationFn: (id) => base44.entities.Deck.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['allDecks']),
  });

  const handleModuleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      difficulty: formData.get('difficulty'),
      duration_minutes: parseInt(formData.get('duration')) || 5,
      cover_image: formData.get('cover_image'),
      session_date: formData.get('session_date') || null,
      trainer_notes: formData.get('trainer_notes'),
      is_published: editingModule?.is_published || false,
    };

    if (editingModule) {
      updateModuleMutation.mutate({ id: editingModule.id, data });
    } else {
      createModuleMutation.mutate(data);
    }
  };

  const handleDeckSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const keyPointsStr = formData.get('key_points');
    const data = {
      module_id: selectedModuleId,
      title: formData.get('title'),
      content: formData.get('content'),
      key_points: keyPointsStr ? keyPointsStr.split('\n').filter(p => p.trim()) : [],
      icon: formData.get('icon') || 'lightbulb',
      order: editingDeck?.order || decks.filter(d => d.module_id === selectedModuleId).length,
    };

    if (editingDeck) {
      updateDeckMutation.mutate({ id: editingDeck.id, data });
    } else {
      createDeckMutation.mutate(data);
    }
  };

  const togglePublish = (module) => {
    updateModuleMutation.mutate({ 
      id: module.id, 
      data: { ...module, is_published: !module.is_published } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Manage Modules</h1>
            <p className="text-slate-500">Create and edit training content</p>
          </div>
          <Button
            onClick={() => {
              setEditingModule(null);
              setShowModuleDialog(true);
            }}
            className="bg-violet-600 hover:bg-violet-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Module
          </Button>
        </motion.div>

        {/* Modules List */}
        <div className="space-y-4">
          {modules.map((module, idx) => {
            const moduleDecks = decks.filter(d => d.module_id === module.id);
            
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border-0 shadow-sm overflow-hidden">
                  <div className="flex">
                    {/* Thumbnail */}
                    <div className="w-32 h-32 flex-shrink-0">
                      <img
                        src={module.cover_image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200'}
                        alt={module.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900">{module.title}</h3>
                            {module.is_published ? (
                              <Badge className="bg-emerald-100 text-emerald-700 border-0">
                                <Eye className="w-3 h-3 mr-1" />
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-slate-500">
                                <EyeOff className="w-3 h-3 mr-1" />
                                Draft
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 line-clamp-1 mb-2">
                            {module.description || 'No description'}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span className="capitalize">{module.category}</span>
                            <span>{module.duration_minutes || 5} min</span>
                            <span className="flex items-center gap-1">
                              <Layers className="w-3 h-3" />
                              {moduleDecks.length} blocks
                            </span>
                            {module.session_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(module.session_date), 'MMM d')}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePublish(module)}
                          >
                            {module.is_published ? 'Unpublish' : 'Publish'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingModule(module);
                              setShowModuleDialog(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteModuleMutation.mutate(module.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decks Section */}
                  <div className="border-t border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-700">Building Blocks</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedModuleId(module.id);
                          setEditingDeck(null);
                          setShowDeckDialog(true);
                        }}
                        className="text-violet-600"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Block
                      </Button>
                    </div>
                    
                    {moduleDecks.length > 0 ? (
                      <div className="space-y-2">
                        {moduleDecks.sort((a, b) => (a.order || 0) - (b.order || 0)).map((deck, dIdx) => (
                          <div
                            key={deck.id}
                            className="flex items-center gap-3 bg-white rounded-lg p-3 border border-slate-100"
                          >
                            <GripVertical className="w-4 h-4 text-slate-300" />
                            <div className="w-6 h-6 rounded bg-violet-100 flex items-center justify-center">
                              <span className="text-xs font-bold text-violet-600">{dIdx + 1}</span>
                            </div>
                            <span className="flex-1 text-sm text-slate-700">{deck.title}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setSelectedModuleId(module.id);
                                setEditingDeck(deck);
                                setShowDeckDialog(true);
                              }}
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500"
                              onClick={() => deleteDeckMutation.mutate(deck.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 text-center py-4">
                        No building blocks yet. Add content for staff to review.
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}

          {modules.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No modules yet</h3>
              <p className="text-slate-500 mb-4">Create your first training module</p>
              <Button
                onClick={() => setShowModuleDialog(true)}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Module
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Module Dialog */}
      <Dialog open={showModuleDialog} onOpenChange={setShowModuleDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingModule ? 'Edit Module' : 'Create Module'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleModuleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input name="title" defaultValue={editingModule?.title} required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea name="description" defaultValue={editingModule?.description} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select name="category" defaultValue={editingModule?.category || 'skills'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select name="difficulty" defaultValue={editingModule?.difficulty || 'beginner'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(d => (
                      <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input type="number" name="duration" defaultValue={editingModule?.duration_minutes || 5} />
              </div>
              <div className="space-y-2">
                <Label>Session Date</Label>
                <Input type="datetime-local" name="session_date" defaultValue={editingModule?.session_date?.slice(0, 16)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cover Image URL</Label>
              <Input name="cover_image" defaultValue={editingModule?.cover_image} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Trainer Notes (private)</Label>
              <Textarea name="trainer_notes" defaultValue={editingModule?.trainer_notes} rows={2} placeholder="Notes for trainers only..." />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowModuleDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
                <Save className="w-4 h-4 mr-2" />
                {editingModule ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Deck Dialog */}
      <Dialog open={showDeckDialog} onOpenChange={setShowDeckDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingDeck ? 'Edit Building Block' : 'Add Building Block'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleDeckSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input name="title" defaultValue={editingDeck?.title} required />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea name="content" defaultValue={editingDeck?.content} rows={4} placeholder="Main content for this block..." />
            </div>
            <div className="space-y-2">
              <Label>Key Points (one per line)</Label>
              <Textarea 
                name="key_points" 
                defaultValue={editingDeck?.key_points?.join('\n')} 
                rows={3} 
                placeholder="Point 1&#10;Point 2&#10;Point 3" 
              />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select name="icon" defaultValue={editingDeck?.icon || 'lightbulb'}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lightbulb">💡 Lightbulb</SelectItem>
                  <SelectItem value="target">🎯 Target</SelectItem>
                  <SelectItem value="zap">⚡ Zap</SelectItem>
                  <SelectItem value="book">📖 Book</SelectItem>
                  <SelectItem value="star">⭐ Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowDeckDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
                <Save className="w-4 h-4 mr-2" />
                {editingDeck ? 'Update' : 'Add'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}