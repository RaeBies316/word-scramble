export type Difficulty = 'easy' | 'medium' | 'hard';
export type Category = 'academic' | 'animals' | 'countries' | 'food' | 'technology' | 'shopify';

export interface Word {
  original: string;
  scrambled: string;
  hint: string;
  category: Category;
  difficulty: Difficulty;
}

export interface DailyChallenge {
  date: string;
  words: Word[];
  highScores: {
    score: number;
    playerName: string;
  }[];
}

export interface GameState {
  words: Word[];
  currentWordIndex: number;
  score: number;
  showHint: boolean;
  gameComplete: boolean;
  timeRemaining: number;
  streak: number;
  selectedDifficulty: Difficulty;
  selectedCategory: Category;
  highScores: Record<Difficulty, number>;
  isDailyChallenge: boolean;
} 