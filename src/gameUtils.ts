import type { Word, Difficulty, Category, DailyChallenge } from './types';

const wordList: Word[] = [
  // Academic
  { original: 'ALGORITHM', scrambled: '', hint: 'A step-by-step procedure for solving a problem', category: 'academic', difficulty: 'hard' },
  { original: 'QUANTUM', scrambled: '', hint: 'Related to the behavior of matter and energy at the molecular level', category: 'academic', difficulty: 'medium' },
  { original: 'PARADIGM', scrambled: '', hint: 'A typical example or pattern of something', category: 'academic', difficulty: 'hard' },
  { original: 'SYNTHESIS', scrambled: '', hint: 'The combination of ideas to form a theory or system', category: 'academic', difficulty: 'medium' },
  
  // Animals
  { original: 'PENGUIN', scrambled: '', hint: 'A flightless bird that loves the cold', category: 'animals', difficulty: 'easy' },
  { original: 'GIRAFFE', scrambled: '', hint: 'Tallest land animal', category: 'animals', difficulty: 'easy' },
  { original: 'PLATYPUS', scrambled: '', hint: 'Egg-laying mammal with a duck bill', category: 'animals', difficulty: 'medium' },
  { original: 'CHAMELEON', scrambled: '', hint: 'A lizard that can change its color', category: 'animals', difficulty: 'medium' },

  // Countries
  { original: 'BRAZIL', scrambled: '', hint: 'Largest country in South America', category: 'countries', difficulty: 'easy' },
  { original: 'JAPAN', scrambled: '', hint: 'Land of the rising sun', category: 'countries', difficulty: 'easy' },
  { original: 'KAZAKHSTAN', scrambled: '', hint: 'Largest landlocked country', category: 'countries', difficulty: 'hard' },
  { original: 'MADAGASCAR', scrambled: '', hint: 'Large island nation off Africa\'s east coast', category: 'countries', difficulty: 'medium' },

  // Food
  { original: 'SUSHI', scrambled: '', hint: 'Japanese dish with rice and raw fish', category: 'food', difficulty: 'easy' },
  { original: 'LASAGNA', scrambled: '', hint: 'Italian layered pasta dish', category: 'food', difficulty: 'medium' },
  { original: 'CROISSANT', scrambled: '', hint: 'Flaky French pastry', category: 'food', difficulty: 'medium' },
  { original: 'GUACAMOLE', scrambled: '', hint: 'Avocado-based dip', category: 'food', difficulty: 'hard' },

  // Technology
  { original: 'PYTHON', scrambled: '', hint: 'Popular programming language named after a snake', category: 'technology', difficulty: 'easy' },
  { original: 'BLUETOOTH', scrambled: '', hint: 'Wireless technology named after a Viking king', category: 'technology', difficulty: 'medium' },
  { original: 'JAVASCRIPT', scrambled: '', hint: 'Popular web programming language', category: 'technology', difficulty: 'medium' },
  { original: 'KUBERNETES', scrambled: '', hint: 'Container orchestration platform', category: 'technology', difficulty: 'hard' },

  // Shopify
  { original: 'LIQUID', scrambled: '', hint: 'Shopify\'s template language', category: 'shopify', difficulty: 'easy' },
  { original: 'SECTIONS', scrambled: '', hint: 'Modular, customizable content areas in Shopify themes', category: 'shopify', difficulty: 'easy' },
  { original: 'SNIPPETS', scrambled: '', hint: 'Reusable code blocks in Shopify themes', category: 'shopify', difficulty: 'medium' },
  { original: 'METAFIELDS', scrambled: '', hint: 'Custom data storage for Shopify products and collections', category: 'shopify', difficulty: 'medium' },
  { original: 'DAWN', scrambled: '', hint: 'Shopify\'s reference theme built with Online Store 2.0', category: 'shopify', difficulty: 'easy' },
  { original: 'CHECKOUT', scrambled: '', hint: 'The payment and order completion process', category: 'shopify', difficulty: 'easy' },
  { original: 'STOREFRONT', scrambled: '', hint: 'The customer-facing part of an online store', category: 'shopify', difficulty: 'medium' },
  { original: 'COLLECTION', scrambled: '', hint: 'A group of products in Shopify', category: 'shopify', difficulty: 'easy' },
  { original: 'VARIANTS', scrambled: '', hint: 'Different versions of a product (size, color, etc.)', category: 'shopify', difficulty: 'medium' },
  { original: 'THEMEKIT', scrambled: '', hint: 'Command line tool for building Shopify themes', category: 'shopify', difficulty: 'hard' }
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

export const getTimeForDifficulty = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'easy':
      return 60;
    case 'medium':
      return 45;
    case 'hard':
      return 30;
    default:
      return 45;
  }
};

export const getScoreMultiplier = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'easy':
      return 1;
    case 'medium':
      return 2;
    case 'hard':
      return 3;
    default:
      return 1;
  }
};

export const getRandomWords = (count: number, category: Category, difficulty: Difficulty): Word[] => {
  const filteredWords = wordList.filter(word => 
    (category === word.category) && (difficulty === word.difficulty)
  );
  
  if (filteredWords.length < count) {
    // If not enough words in the selected category/difficulty, include words from the same category but different difficulty
    const categoryWords = wordList.filter(word => category === word.category);
    return [...categoryWords]
      .sort(() => 0.5 - Math.random())
      .slice(0, count)
      .map(word => ({
        ...word,
        scrambled: scrambleWord(word.original)
      }));
  }

  return [...filteredWords]
    .sort(() => 0.5 - Math.random())
    .slice(0, count)
    .map(word => ({
      ...word,
      scrambled: scrambleWord(word.original)
    }));
};

// Function to generate a deterministic daily challenge based on the date
export const getDailyChallenge = (): Word[] => {
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const seed = today.split('-').join(''); // Remove dashes to create a number
  
  // Use the date as a seed to always get the same words for the same day
  const seededRandom = (max: number) => {
    const x = Math.sin(Number(seed)) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };

  // Get one word from each category for variety
  const categories: Category[] = ['academic', 'animals', 'countries', 'food', 'technology', 'shopify'];
  const dailyWords: Word[] = [];

  categories.forEach(category => {
    const categoryWords = wordList.filter(word => word.category === category);
    const randomIndex = seededRandom(categoryWords.length);
    const selectedWord = categoryWords[randomIndex];
    if (selectedWord) {
      dailyWords.push({
        ...selectedWord,
        scrambled: scrambleWord(selectedWord.original)
      });
    }
  });

  // Shuffle the daily words using the same seed
  for (let i = dailyWords.length - 1; i > 0; i--) {
    const j = seededRandom(i + 1);
    [dailyWords[i], dailyWords[j]] = [dailyWords[j], dailyWords[i]];
  }

  return dailyWords.slice(0, 4); // Return 4 words for the daily challenge
};

// Function to save daily challenge high scores
export const saveDailyChallengeScore = (score: number, playerName: string) => {
  const today = new Date().toISOString().split('T')[0];
  const storageKey = `wordScrambleDailyChallenge_${today}`;
  
  const existingData = localStorage.getItem(storageKey);
  const dailyChallenge: DailyChallenge = existingData 
    ? JSON.parse(existingData)
    : { date: today, words: [], highScores: [] };

  dailyChallenge.highScores.push({ score, playerName });
  dailyChallenge.highScores.sort((a, b) => b.score - a.score);
  dailyChallenge.highScores = dailyChallenge.highScores.slice(0, 10); // Keep top 10 scores

  localStorage.setItem(storageKey, JSON.stringify(dailyChallenge));
}; 