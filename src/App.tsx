import React, { useState } from 'react'
import './App.css'
import WordScramble from './components/WordScramble'
import Hangman from './components/Hangman'
import GameSelector from './components/GameSelector'

function App() {
  const [currentGame, setCurrentGame] = useState<'scramble' | 'hangman'>('scramble')

  return (
    <div className="app-container">
      <GameSelector 
        currentGame={currentGame}
        onSelectGame={setCurrentGame}
      />
      
      {currentGame === 'scramble' ? (
        <WordScramble />
      ) : (
        <Hangman />
      )}
    </div>
  )
}

export default App
