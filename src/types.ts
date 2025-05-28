export interface Word {
  original: string;
  scrambled: string;
  hint: string;
}

export interface GameState {
  words: Word[];
  currentWordIndex: number;
  score: number;
  showHint: boolean;
  gameComplete: boolean;
} 