import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const categoryColors = {
  onboarding: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  compliance: 'bg-rose-50 text-rose-700 border-rose-200',
  skills: 'bg-violet-50 text-violet-700 border-violet-200',
  leadership: 'bg-amber-50 text-amber-700 border-amber-200',
  product: 'bg-sky-50 text-sky-700 border-sky-200',
  safety: 'bg-orange-50 text-orange-700 border-orange-200',
};

export default function ModuleCard({ module, onClick, progress = 0 }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card 
        className="overflow-hidden cursor-pointer group border-0 shadow-sm hover:shadow-xl transition-all duration-500 bg-white"
        onClick={onClick}
      >
        <div className="relative h-36 overflow-hidden">
          <img 
            src={module.cover_image || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop`}
            alt={module.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {module.session_date && (
            <div className="absolute top-3 right-3">
              <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                <Calendar className="w-3 h-3 text-slate-600" />
                <span className="text-xs font-medium text-slate-700">
                  {format(new Date(module.session_date), 'MMM d')}
                </span>
              </div>
            </div>
          )}
          
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2 drop-shadow-md">
              {module.title}
            </h3>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`${categoryColors[module.category] || 'bg-slate-50 text-slate-700'} font-medium text-xs capitalize border`}
            >
              {module.category?.replace('_', ' ')}
            </Badge>
            
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{module.duration_minutes || 5} min</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="capitalize">{module.difficulty || 'beginner'}</span>
              </div>
            </div>
          </div>
          
          {progress > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Progress</span>
                <span className="text-xs font-medium text-slate-700">{progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}