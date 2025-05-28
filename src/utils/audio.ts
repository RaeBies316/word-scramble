// Audio utility for Hangman game
export const AUDIO_FILES = {
  correct: '/audio/correct.mp3',
  wrong: '/audio/wrong.mp3',
  gameOver: '/audio/game-over.mp3',
  victory: '/audio/victory.mp3',
  click: '/audio/click.mp3'
} as const;

// Preload audio files
const audioElements = new Map<string, HTMLAudioElement>();

export const preloadAudio = () => {
  Object.entries(AUDIO_FILES).forEach(([key, path]) => {
    const audio = new Audio(path);
    audio.load(); // Preload the audio file
    audioElements.set(key, audio);
  });
};

export const playSound = (soundName: keyof typeof AUDIO_FILES) => {
  const audio = audioElements.get(soundName);
  if (audio) {
    audio.currentTime = 0; // Reset to start
    audio.play().catch(error => {
      console.warn(`Error playing sound ${soundName}:`, error);
    });
  }
};

// Initialize audio when the module loads
preloadAudio(); 