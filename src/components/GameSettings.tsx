import React from 'react';
import type { Difficulty, Category } from '../types';
import './GameSettings.css';

interface GameSettingsProps {
  difficulty: Difficulty;
  category: Category;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onCategoryChange: (category: Category) => void;
}

const GameSettings: React.FC<GameSettingsProps> = ({
  difficulty,
  category,
  onDifficultyChange,
  onCategoryChange
}) => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const categories: Category[] = ['academic', 'animals', 'countries', 'food', 'technology'];

  return (
    <div className="game-settings">
      <div className="settings-group">
        <label>
          Difficulty:
          <select 
            value={difficulty} 
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="settings-group">
        <label>
          Category:
          <select 
            value={category} 
            onChange={(e) => onCategoryChange(e.target.value as Category)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default GameSettings; 