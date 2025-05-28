import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Shoppy.css';

interface ShoppyProps {
  message?: string;
  isCorrect?: boolean;
  isHint?: boolean;
  isComplete?: boolean;
  isVisible?: boolean;
}

const Shoppy: React.FC<ShoppyProps> = ({ 
  message, 
  isCorrect, 
  isHint, 
  isComplete,
  isVisible = true 
}) => {
  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const bubbleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 0.5
      }
    }
  };

  return (
    <div className="assistant-container">
      <AnimatePresence>
        {message && isVisible && (
          <motion.div
            className={`message-bubble ${isCorrect ? 'correct' : ''} ${isHint ? 'hint' : ''} ${isComplete ? 'complete' : ''}`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={bubbleVariants}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        className="floating-shape"
        animate="animate"
        variants={floatingVariants}
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          {isHint ? (
            // Lightbulb shape for hints
            <g className="hint-shape">
              <path d="M30 5C20.5 5 13 12.5 13 22C13 28.5 16.5 33.5 20.5 36.5C22.5 38 24 40.5 24 43V47C24 49.2 25.8 51 28 51H32C34.2 51 36 49.2 36 47V43C36 40.5 37.5 38 39.5 36.5C43.5 33.5 47 28.5 47 22C47 12.5 39.5 5 30 5Z" />
              <rect x="26" y="51" width="8" height="4" rx="2" />
            </g>
          ) : isComplete ? (
            // Star shape for completion
            <path className="complete-shape" d="M30 5L35.5 20.5L52 20.5L38.5 30L44 45L30 35.5L16 45L21.5 30L8 20.5L24.5 20.5L30 5Z" />
          ) : (
            // Default animated shape
            <g className="default-shape">
              <circle cx="30" cy="30" r="15" />
              <path d="M30 15C35.5 15 40 19.5 40 25C40 30.5 35.5 35 30 35C24.5 35 20 30.5 20 25C20 19.5 24.5 15 30 15Z" />
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
};

export default Shoppy; 