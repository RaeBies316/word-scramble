import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import useSound from 'use-sound';
import type { GameState, Word, Difficulty, Category } from '../types';
import { getRandomWords, getTimeForDifficulty, getScoreMultiplier, getDailyChallenge, saveDailyChallengeScore } from '../gameUtils';
import GameSettings from './GameSettings';
import DailyChallenge from './DailyChallenge';
import './WordScramble.css';

const WordScramble: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    words: [],
    currentWordIndex: 0,
    score: 0,
    showHint: false,
    gameComplete: false,
    timeRemaining: 60,
    streak: 0,
    selectedDifficulty: 'easy',
    selectedCategory: 'animals',
    highScores: { easy: 0, medium: 0, hard: 0 },
    isDailyChallenge: false
  });

  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const [playerName, setPlayerName] = useState('');

  // Load high scores from localStorage on mount
  useEffect(() => {
    const savedHighScores = localStorage.getItem('wordScrambleHighScores');
    if (savedHighScores) {
      setGameState(prev => ({
        ...prev,
        highScores: JSON.parse(savedHighScores)
      }));
    }
  }, []);

  const startNewGame = useCallback((isDailyChallenge = false) => {
    const timeLimit = getTimeForDifficulty(gameState.selectedDifficulty);
    setGameState(prev => ({
      ...prev,
      words: isDailyChallenge 
        ? getDailyChallenge()
        : getRandomWords(4, prev.selectedCategory, prev.selectedDifficulty),
      currentWordIndex: 0,
      score: 0,
      showHint: false,
      gameComplete: false,
      timeRemaining: timeLimit,
      streak: 0,
      isDailyChallenge
    }));
    setUserInput('');
    setFeedback('');
    setShowConfetti(false);

    if (timer) {
      clearInterval(timer);
    }

    const newTimer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 1) {
          clearInterval(newTimer);
          return {
            ...prev,
            timeRemaining: 0,
            gameComplete: true
          };
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        };
      });
    }, 1000);

    setTimer(newTimer);
  }, [gameState.selectedDifficulty, gameState.selectedCategory, timer]);

  useEffect(() => {
    startNewGame();
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState.selectedDifficulty, gameState.selectedCategory]);

  const checkAnswer = () => {
    const currentWord = gameState.words[gameState.currentWordIndex];
    if (userInput.toUpperCase() === currentWord.original) {
      const multiplier = getScoreMultiplier(gameState.selectedDifficulty);
      const streakBonus = Math.floor(gameState.streak / 3);
      const timeBonus = Math.floor(gameState.timeRemaining / 10);
      const pointsEarned = (10 + streakBonus + timeBonus) * multiplier;

      setFeedback(`Correct! +${pointsEarned} points 🎉`);
      setGameState(prev => {
        const newScore = prev.score + pointsEarned;
        const isLastWord = prev.currentWordIndex === prev.words.length - 1;
        const newHighScores = { ...prev.highScores };
        
        if (isLastWord) {
          if (prev.isDailyChallenge && playerName) {
            saveDailyChallengeScore(newScore, playerName);
          } else if (newScore > prev.highScores[prev.selectedDifficulty]) {
            newHighScores[prev.selectedDifficulty] = newScore;
            localStorage.setItem('wordScrambleHighScores', JSON.stringify(newHighScores));
          }
        }

        return {
          ...prev,
          score: newScore,
          currentWordIndex: prev.currentWordIndex + 1,
          gameComplete: isLastWord,
          showHint: false,
          streak: prev.streak + 1,
          highScores: newHighScores
        };
      });
      setUserInput('');
      
      if (gameState.currentWordIndex === gameState.words.length - 1) {
        setShowConfetti(true);
        if (timer) clearInterval(timer);
      }
    } else {
      setFeedback('Try again! 🤔');
      setGameState(prev => ({
        ...prev,
        streak: 0
      }));
    }
  };

  const showHint = () => {
    setGameState(prev => ({ 
      ...prev, 
      showHint: true,
      score: Math.max(0, prev.score - 5) // Penalty for using hint
    }));
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setGameState(prev => ({
      ...prev,
      selectedDifficulty: difficulty
    }));
  };

  const handleCategoryChange = (category: Category) => {
    setGameState(prev => ({
      ...prev,
      selectedCategory: category
    }));
  };

  const handleStartDailyChallenge = () => {
    const name = prompt('Enter your name for the leaderboard:');
    if (name) {
      setPlayerName(name);
      setShowDailyChallenge(false);
      startNewGame(true);
    }
  };

  const handlePlayAgain = () => {
    startNewGame(false);
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
      
      <div className="game-modes">
        <button 
          className="daily-challenge-button"
          onClick={() => setShowDailyChallenge(true)}
        >
          Daily Challenge
        </button>
      </div>

      {!gameState.isDailyChallenge && (
        <GameSettings
          difficulty={gameState.selectedDifficulty}
          category={gameState.selectedCategory}
          onDifficultyChange={handleDifficultyChange}
          onCategoryChange={handleCategoryChange}
        />
      )}

      {showDailyChallenge && (
        <DailyChallenge
          onStartDailyChallenge={handleStartDailyChallenge}
          onClose={() => setShowDailyChallenge(false)}
        />
      )}

      {!gameState.gameComplete ? (
        <div className="game-content">
          <div className="game-info">
            <div className="progress">
              Word {gameState.currentWordIndex + 1} of {gameState.words.length}
            </div>
            <div className="score">
              Score: {gameState.score}
            </div>
            <div className="timer">
              Time: {gameState.timeRemaining}s
            </div>
            <div className="streak">
              Streak: {gameState.streak}
            </div>
          </div>

          <div className="scrambled-word">
            {currentWord.scrambled.split('').map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="letter"
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
              className="answer-input"
            />
            <button onClick={checkAnswer} className="check-button">
              Check Answer
            </button>
          </div>

          <button 
            onClick={showHint} 
            className="hint-button" 
            disabled={gameState.showHint}
          >
            Show Hint (-5 points)
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
          <p>Your final score: {gameState.score}</p>
          {!gameState.isDailyChallenge && (
            <p>High score ({gameState.selectedDifficulty}): {gameState.highScores[gameState.selectedDifficulty]}</p>
          )}
          <button onClick={handlePlayAgain} className="play-again-button">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default WordScramble; 