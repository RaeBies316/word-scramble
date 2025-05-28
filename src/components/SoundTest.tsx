import React from 'react';
import { motion } from 'framer-motion';
import { playSound } from '../utils/audio';

const SoundTest = () => {
  const sounds = [
    { name: 'correct', label: 'Correct Guess' },
    { name: 'wrong', label: 'Wrong Guess' },
    { name: 'gameOver', label: 'Game Over' },
    { name: 'victory', label: 'Victory' },
    { name: 'click', label: 'Click' }
  ] as const;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-8">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Sound Effect Test Panel
        </h1>
        
        <div className="grid gap-4">
          {sounds.map(({ name, label }) => (
            <motion.button
              key={name}
              onClick={() => playSound(name)}
              className="px-6 py-3 bg-white bg-opacity-20 rounded-lg text-white font-semibold
                       hover:bg-opacity-30 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Play "{label}"
            </motion.button>
          ))}
        </div>

        <p className="mt-6 text-white text-opacity-80 text-sm text-center">
          Click each button to test the corresponding sound effect
        </p>
      </div>
    </div>
  );
};

export default SoundTest; 