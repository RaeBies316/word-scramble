import React, { useState, useEffect } from 'react';
import type { DailyChallenge as DailyChallengeType } from '../types';
import './DailyChallenge.css';

interface DailyChallengeProps {
  onStartDailyChallenge: () => void;
  onClose: () => void;
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({
  onStartDailyChallenge,
  onClose
}) => {
  const [dailyStats, setDailyStats] = useState<DailyChallengeType | null>(null);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `wordScrambleDailyChallenge_${today}`;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
      const data = JSON.parse(savedData);
      setDailyStats(data);
      setHasPlayedToday(true);
    }
  }, []);

  return (
    <div className="daily-challenge-modal">
      <div className="daily-challenge-content">
        <h2>Daily Challenge</h2>
        <p className="daily-description">
          Test your skills with today's unique word selection! 
          Same words for everyone, compete for the highest score.
        </p>

        {hasPlayedToday ? (
          <div className="daily-results">
            <h3>Today's Leaderboard</h3>
            <div className="leaderboard">
              {dailyStats?.highScores.map((score, index) => (
                <div key={index} className="leaderboard-entry">
                  <span className="rank">#{index + 1}</span>
                  <span className="player-name">{score.playerName}</span>
                  <span className="score">{score.score}</span>
                </div>
              ))}
            </div>
            <p className="played-message">
              You've already played today's challenge. 
              Come back tomorrow for a new set of words!
            </p>
          </div>
        ) : (
          <button 
            className="start-daily-challenge"
            onClick={onStartDailyChallenge}
          >
            Start Today's Challenge
          </button>
        )}

        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default DailyChallenge; 