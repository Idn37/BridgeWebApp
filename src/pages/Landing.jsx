import React from 'react';
import { Button } from "@/components/ui/button";
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          GTRSG BRIDGE<br />WEB APP
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 italic mb-12">
          "Fast facts in your pocket. Get the gist. Get going."
        </p>
        
        <Link to={createPageUrl('Home')}>
          <Button className="h-16 px-12 text-lg font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-2xl shadow-2xl shadow-violet-500/20">
            NEXT
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}