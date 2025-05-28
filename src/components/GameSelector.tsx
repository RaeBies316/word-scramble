import React from 'react';
import { motion } from 'framer-motion';
import './GameSelector.css';

interface GameSelectorProps {
  onSelectGame: (game: 'scramble' | 'hangman') => void;
  currentGame: 'scramble' | 'hangman';
}

const GameSelector: React.FC<GameSelectorProps> = ({ onSelectGame, currentGame }) => {
  return (
    <div className="game-selector">
      <motion.button
        className={`game-option ${currentGame === 'scramble' ? 'active' : ''}`}
        onClick={() => onSelectGame('scramble')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Word Scramble
      </motion.button>
      
      <motion.button
        className={`game-option ${currentGame === 'hangman' ? 'active' : ''}`}
        onClick={() => onSelectGame('hangman')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Hangman
      </motion.button>
    </div>
  );
};

export default GameSelector; 