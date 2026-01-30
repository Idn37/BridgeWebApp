import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';

export default function AdminAuth() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple password check - you can change this password
    if (password === 'admin123') {
      localStorage.setItem('isAdminAuthenticated', 'true');
      navigate(createPageUrl('AdminDashboard'));
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-violet-600/20 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 border-violet-500/30">
            <Lock className="w-10 h-10 text-violet-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-slate-400">Enter password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="h-14 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-center text-lg"
              autoFocus
            />
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-2 text-center"
              >
                {error}
              </motion.p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl text-lg font-semibold"
          >
            Access Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Default password: admin123
        </p>
      </motion.div>
    </div>
  );
}