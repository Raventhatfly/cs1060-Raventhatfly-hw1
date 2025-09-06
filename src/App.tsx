import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import GameHeader from './components/GameHeader';
import { useGameControls } from './hooks/useGameControls';
import { initializeGame, makeMove, saveGameState, loadGameState } from './gameLogic';
import { Direction, GameState } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = loadGameState();
    return saved || initializeGame();
  });

  const handleMove = useCallback((direction: Direction) => {
    setGameState(prevState => {
      if (prevState.gameOver) return prevState;
      const newState = makeMove(prevState, direction);
      return newState;
    });
  }, []);

  const handleRestart = useCallback(() => {
    const newGame = initializeGame();
    setGameState(newGame);
    saveGameState(newGame);
  }, []);

  // Auto-save game state
  useEffect(() => {
    // Clear animation flags after a short delay
    const timer = setTimeout(() => {
      setGameState(prevState => ({
        ...prevState,
        board: prevState.board.map(row => 
          row.map(tile => tile ? { ...tile, isNew: false, isMerged: false } : null)
        )
      }));
    }, 150);

    saveGameState(gameState);
    return () => clearTimeout(timer);
  }, [gameState]);

  // Setup game controls
  useGameControls({
    onMove: handleMove,
    gameOver: gameState.gameOver
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <GameHeader
          score={gameState.score}
          bestScore={gameState.bestScore}
          onRestart={handleRestart}
          gameOver={gameState.gameOver}
          won={gameState.won}
        />
        
        <div className="flex justify-center">
          <GameBoard board={gameState.board} />
        </div>

        {/* Mobile Instructions */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p className="mb-2">
            <strong>HOW TO PLAY:</strong> Use your arrow keys to move the tiles.
          </p>
          <p>
            When two tiles with the same number touch, they merge into one!
          </p>
        </div>

        {/* Game overlay for game over state */}
        {gameState.gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 text-center shadow-2xl max-w-sm mx-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Over!</h2>
              <p className="text-gray-600 mb-6">Final Score: {gameState.score.toLocaleString()}</p>
              <button
                onClick={handleRestart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;