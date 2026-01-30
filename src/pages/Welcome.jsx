import React from 'react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { BookOpen, Trophy, Mic, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Welcome() {
  const handleGetStarted = () => {
    base44.auth.redirectToLogin(window.location.origin);
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
            <h1 className="text-xl font-bold text-white">GTRSG BRIDGE</h1>
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
              Your professional training platform for airport staff excellence
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
    </div>
  );
}