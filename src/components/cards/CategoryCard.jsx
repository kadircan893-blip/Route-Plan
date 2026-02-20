import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const CategoryCard = ({ category, isSelected, onSelect }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    onSelect(category.id);
  };

  return (
    <motion.div
      className="relative h-48 cursor-pointer perspective-1000"
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side */}
        <div
          className="absolute w-full h-full rounded-card shadow-card overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            backgroundColor: 'white',
          }}
        >
          {/* Selection Indicator */}
          {isSelected && (
            <div className="absolute top-3 right-3 w-8 h-8 bg-moss-green rounded-full flex items-center justify-center z-10 shadow-md">
              <Check className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
          )}

          {/* Card Content */}
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div 
              className="text-6xl mb-4"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            >
              {category.emoji}
            </div>
            <h3 className="font-sf-pro font-semibold text-xl text-dark-slate mb-2">
              {category.title}
            </h3>
            <p className="font-inter text-sm text-dark-slate opacity-75">
              {category.description}
            </p>
          </div>

          {/* Bottom Color Strip */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-2"
            style={{ backgroundColor: category.color }}
          />
        </div>

        {/* Back Side */}
        <div
          className="absolute w-full h-full rounded-card shadow-card overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: category.color,
          }}
        >
          {/* Selection Indicator on Back */}
          {isSelected && (
            <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center z-10 shadow-md">
              <Check className="w-5 h-5 text-moss-green" strokeWidth={3} />
            </div>
          )}

          {/* Animated Background Pattern */}
          <div className="flex items-center justify-center h-full p-6 relative">
            {/* Emoji Pattern */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="grid grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <span key={i} className="text-4xl">
                    {category.emoji}
                  </span>
                ))}
              </div>
            </div>

            {/* Center Content */}
            <div className="relative z-10 text-center">
              <div className="text-7xl mb-4 animate-bounce">
                {category.emoji}
              </div>
              <p className="font-sf-pro font-semibold text-lg text-white drop-shadow-lg">
                {category.title}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Selection Border */}
      {isSelected && (
        <div className="absolute inset-0 rounded-card border-4 border-moss-green pointer-events-none" />
      )}
    </motion.div>
  );
};

export default CategoryCard;