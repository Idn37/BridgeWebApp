import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Home, BookOpen, Trophy, Settings, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const staffNavItems = [
  { name: 'Home', icon: Home, page: 'Home' },
  { name: 'Modules', icon: BookOpen, page: 'Modules' },
];

const trainerNavItems = [
  { name: 'Dashboard', icon: Home, page: 'AdminDashboard' },
];

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const isTrainer = user?.role === 'admin';
  const navItems = isTrainer ? trainerNavItems : staffNavItems;
  
  // Hide nav and header on specific pages
  const hideNav = currentPageName === 'ModuleView';
  const hideHeader = currentPageName === 'Welcome' || currentPageName === 'Landing';
  const showBackButton = currentPageName !== 'Home' && currentPageName !== 'Welcome' && currentPageName !== 'Landing';

  return (
    <div className="min-h-screen bg-slate-900">
      <style>{`
        :root {
          --primary: #8b5cf6;
          --primary-dark: #7c3aed;
        }
      `}</style>
      
      {/* Header with Back/Home buttons */}
      {!hideHeader && (
        <div className="fixed top-0 right-0 p-4 z-50 flex gap-2">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:bg-slate-700"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </Button>
          )}
          {currentPageName !== 'Home' && (
            <Link to={createPageUrl('Home')}>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 hover:bg-slate-700"
              >
                <Home className="w-5 h-5 text-slate-300" />
              </Button>
            </Link>
          )}
        </div>
      )}
      
      {children}

      {/* Bottom Navigation - Mobile Optimized */}
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-4 py-2 z-40">
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
                        ? 'text-violet-400' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                    <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                      {item.name}
                    </span>
                    {isActive && (
                      <div className="absolute -bottom-0.5 w-8 h-1 bg-violet-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
              
              {/* Admin Button - Only show for non-admin users on Home page */}
              {!isTrainer && currentPageName === 'Home' && (
                <Link
                  to={createPageUrl('AdminAuth')}
                  className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all text-slate-500 hover:text-slate-300"
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-xs font-medium">ADMIN</span>
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}