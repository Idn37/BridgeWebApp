import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Home, BookOpen, Trophy, Settings, Users } from 'lucide-react';

const staffNavItems = [
  { name: 'Home', icon: Home, page: 'Home' },
  { name: 'Modules', icon: BookOpen, page: 'Modules' },
];

const trainerNavItems = [
  { name: 'Dashboard', icon: Home, page: 'TrainerDashboard' },
  { name: 'Modules', icon: BookOpen, page: 'ManageModules' },
];

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const isTrainer = user?.role === 'admin';
  const navItems = isTrainer ? trainerNavItems : staffNavItems;
  
  // Hide nav on module view page for immersive experience
  const hideNav = currentPageName === 'ModuleView';

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        :root {
          --primary: #8b5cf6;
          --primary-dark: #7c3aed;
        }
      `}</style>
      
      {children}

      {/* Bottom Navigation - Mobile Optimized */}
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-2 z-40">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-around">
              {navItems.map((item) => {
                const isActive = currentPageName === item.page;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                      isActive 
                        ? 'text-violet-600' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                    <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                      {item.name}
                    </span>
                    {isActive && (
                      <div className="absolute -bottom-0.5 w-8 h-1 bg-violet-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}