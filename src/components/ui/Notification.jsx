import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Notification = ({ onClick, hasRecommendation }) => {
  
  if (!hasRecommendation) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}        
      transition={{ duration: 0.5, type: 'spring' }}
      className="fixed top-24 right-6 z-50"
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
        className="relative bg-coral-accent text-white px-5 py-3 rounded-card shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2 cursor-pointer z-50"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
        <div className="text-left">
          <p className="font-inter font-semibold text-sm">
            AI'ın Tavsiyesi
          </p>
          <p className="font-inter text-xs opacity-90">
            Özel rotanızı görüntüleyin
          </p>
        </div>
      </button>
      
      {/* Pulse Animation */}
      <motion.div
        className="absolute inset-0 bg-coral-accent rounded-card opacity-50 pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

export default Notification;