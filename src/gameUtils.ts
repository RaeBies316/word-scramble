import type { Word } from './types';

const wordList: Word[] = [
  { original: 'ALGORITHM', scrambled: '', hint: 'A step-by-step procedure for solving a problem' },
  { original: 'QUANTUM', scrambled: '', hint: 'Related to the behavior of matter and energy at the molecular level' },
  { original: 'PARADIGM', scrambled: '', hint: 'A typical example or pattern of something' },
  { original: 'SYNTHESIS', scrambled: '', hint: 'The combination of ideas to form a theory or system' },
  { original: 'PARADOX', scrambled: '', hint: 'A statement that contradicts itself' },
  { original: 'ENIGMA', scrambled: '', hint: 'Something hard to understand or explain' },
  { original: 'CATALYST', scrambled: '', hint: 'Something that speeds up a process' },
  { original: 'SYNERGY', scrambled: '', hint: 'Combined effect greater than the sum of parts' }
];

export const scrambleWord = (word: string): string => {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const scrambled = arr.join('');
  return scrambled === word ? scrambleWord(word) : scrambled;
};

export const getRandomWords = (count: number): Word[] => {
  const shuffled = [...wordList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(word => ({
    ...word,
    scrambled: scrambleWord(word.original)
  }));
}; 