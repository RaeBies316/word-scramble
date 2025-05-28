import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import type { GameState, Word } from '../types';
import { getRandomWords } from '../gameUtils';
import './WordScramble.css';

const WordScramble: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    words: [],
    currentWordIndex: 0,
    score: 0,
    showHint: false,
    gameComplete: false
  });
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setGameState({
      words: getRandomWords(4),
      currentWordIndex: 0,
      score: 0,
      showHint: false,
      gameComplete: false
    });
    setUserInput('');
    setFeedback('');
    setShowConfetti(false);
  };

  const checkAnswer = () => {
    const currentWord = gameState.words[gameState.currentWordIndex];
    if (userInput.toUpperCase() === currentWord.original) {
      setFeedback('Correct! 🎉');
      setGameState(prev => ({
        ...prev,
        score: prev.score + 1,
        currentWordIndex: prev.currentWordIndex + 1,
        gameComplete: prev.currentWordIndex === prev.words.length - 1,
        showHint: false
      }));
      setUserInput('');
      
      if (gameState.currentWordIndex === gameState.words.length - 1) {
        setShowConfetti(true);
      }
    } else {
      setFeedback('Try again! 🤔');
    }
  };

  const showHint = () => {
    setGameState(prev => ({ ...prev, showHint: true }));
  };

  const currentWord = gameState.words[gameState.currentWordIndex];

  if (gameState.words.length === 0) {
    return <div>Loading...</div>;
  }

  const letterVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 50
      }
    })
  };

  return (
    <div className="game-container">
      {showConfetti && <ReactConfetti />}
      <h1>Word Scramble Challenge</h1>
      
      {!gameState.gameComplete ? (
        <div className="game-content">
          <div className="progress">
            Word {gameState.currentWordIndex + 1} of {gameState.words.length}
          </div>
          <div className="score">
            Score: {gameState.score}
          </div>
          <div className="scrambled-word">
            {currentWord.scrambled.split('').map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
              >
                {letter}
              </motion.span>
            ))}
          </div>
          {gameState.showHint && (
            <motion.div 
              className="hint"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Hint: {currentWord.hint}
            </motion.div>
          )}
          <div className="input-section">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your answer"
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
            />
            <button onClick={checkAnswer} className="check-button">
              Check Answer
            </button>
          </div>
          <button onClick={showHint} className="hint-button" disabled={gameState.showHint}>
            Show Hint
          </button>
          <motion.div 
            className={`feedback ${feedback.includes('Correct') ? 'correct' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={feedback}
          >
            {feedback}
          </motion.div>
        </div>
      ) : (
        <div className="game-complete">
          <h2>Game Complete! 🎉</h2>
          <p>Your final score: {gameState.score} out of {gameState.words.length}</p>
          <button onClick={startNewGame} className="play-again-button">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default WordScramble; 