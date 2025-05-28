import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';
import './Hangman.css';
import { playSound } from '../utils/audio';

// Shopify-themed word list
const WORDS = [
  'MERCHANT', 'ECOMMERCE', 'SHOPIFY', 'RETAIL', 'PAYMENT',
  'INVENTORY', 'SHIPPING', 'CHECKOUT', 'PRODUCT', 'CUSTOMER',
  'PLATFORM', 'DIGITAL', 'ONLINE', 'STORE', 'SALES',
  'BUSINESS', 'COMMERCE', 'MARKETPLACE', 'SHOP', 'BRAND'
];

interface HangmanProps {
  onGameComplete?: (score: number) => void;
}

const Hangman: React.FC<HangmanProps> = ({ onGameComplete }) => {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const maxWrongGuesses = 6;

  // Sound effects
  const [playCorrect] = useSound('/sounds/correct.mp3', { volume: 0.5 });
  const [playWrong] = useSound('/sounds/wrong.mp3', { volume: 0.5 });
  const [playWin] = useSound('/sounds/win.mp3', { volume: 0.7 });
  const [playLose] = useSound('/sounds/lose.mp3', { volume: 0.7 });

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameStatus('playing');
    playSound('click'); // Play sound when starting new game
  };

  const getMaskedWord = () => {
    return word
      .split('')
      .map(letter => guessedLetters.has(letter) ? letter : '_')
      .join(' ');
  };

  const handleGuess = (letter: string) => {
    if (gameStatus !== 'playing') return;

    const newGuessedLetters = new Set(guessedLetters);
    if (!newGuessedLetters.has(letter)) {
      newGuessedLetters.add(letter);
      setGuessedLetters(newGuessedLetters);

      if (!word.includes(letter)) {
        const newWrongGuesses = wrongGuesses + 1;
        setWrongGuesses(newWrongGuesses);
        playSound('wrong'); // Play sound for wrong guess

        if (newWrongGuesses >= maxWrongGuesses) {
          setGameStatus('lost');
          playSound('gameOver'); // Play sound for game over
          onGameComplete?.(score);
        }
      } else {
        playSound('correct'); // Play sound for correct guess
        
        // Check if word is complete
        const isWordComplete = word
          .split('')
          .every(letter => newGuessedLetters.has(letter));

        if (isWordComplete) {
          const newScore = score + 1;
          setScore(newScore);
          setGameStatus('won');
          playSound('victory'); // Play sound for victory
          onGameComplete?.(newScore);
        }
      }
    }
  };

  const renderHangman = () => {
    return (
      <motion.svg
        width="200"
        height="250"
        viewBox="0 0 200 250"
        className="hangman-drawing"
        initial="hidden"
        animate="visible"
      >
        {/* Base */}
        <motion.line
          x1="40" y1="230" x2="160" y2="230"
          variants={{
            hidden: { pathLength: 0 },
            visible: { pathLength: 1 }
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Vertical pole */}
        {wrongGuesses > 0 && (
          <motion.line
            x1="100" y1="230" x2="100" y2="30"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Top */}
        {wrongGuesses > 1 && (
          <motion.line
            x1="100" y1="30" x2="150" y2="30"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Rope */}
        {wrongGuesses > 2 && (
          <motion.line
            x1="150" y1="30" x2="150" y2="60"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Head */}
        {wrongGuesses > 3 && (
          <motion.circle
            cx="150" cy="75" r="15"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Body */}
        {wrongGuesses > 4 && (
          <motion.line
            x1="150" y1="90" x2="150" y2="150"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Arms and legs */}
        {wrongGuesses > 5 && (
          <>
            <motion.line
              x1="150" y1="110" x2="130" y2="130"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
            <motion.line
              x1="150" y1="110" x2="170" y2="130"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            <motion.line
              x1="150" y1="150" x2="130" y2="180"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
            <motion.line
              x1="150" y1="150" x2="170" y2="180"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />
          </>
        )}
      </motion.svg>
    );
  };

  return (
    <div className="hangman-container">
      <motion.div
        className="game-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Shopify Hangman</h2>
        <div className="score">Score: {score}</div>
      </motion.div>

      <div className="game-content">
        {renderHangman()}

        <motion.div
          className="word-display"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {getMaskedWord()}
        </motion.div>

        <div className="keyboard">
          {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letter) => (
            <motion.button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.has(letter) || gameStatus !== 'playing'}
              className={`key ${guessedLetters.has(letter) ? 'used' : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {letter}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {gameStatus !== 'playing' && (
            <motion.div
              className={`game-over ${gameStatus}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h3>{gameStatus === 'won' ? 'Congratulations!' : 'Game Over!'}</h3>
              <p>The word was: {word}</p>
              <motion.button
                onClick={startNewGame}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Hangman; 