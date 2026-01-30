import React from 'react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { BookOpen, Trophy, Mic, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Welcome() {
  const handleGetStarted = () => {
    base44.auth.redirectToLogin(window.location.origin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex flex-col">
      {/* Header */}
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-violet-600" />
          </div>
          <h1 className="text-2xl font-bold text-white">BRIDGE</h1>
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Building Real Insights, Driving Growth & Excellence
            </h2>
            <p className="text-lg text-violet-100">
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
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-medium text-left">{feature.text}</span>
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
              className="w-full h-14 bg-white text-violet-600 hover:bg-violet-50 rounded-2xl text-lg font-semibold shadow-2xl"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-violet-200 mt-4">
              Professional training for airport excellence
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}