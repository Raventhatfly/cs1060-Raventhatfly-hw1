import React from 'react';
import { RotateCcw, Trophy, Target } from 'lucide-react';

interface GameHeaderProps {
  score: number;
  bestScore: number;
  onRestart: () => void;
  gameOver: boolean;
  won: boolean;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  score, 
  bestScore, 
  onRestart, 
  gameOver, 
  won 
}) => {
  return (
    <div className="w-full max-w-md mx-auto mb-6">
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">2048</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Join numbers and get to the 2048 tile!
        </p>
      </div>

      {/* Score Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3">
          <div className="bg-gray-200 rounded-lg px-4 py-2 text-center min-w-[80px]">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Score</span>
            </div>
            <div className="text-lg font-bold text-gray-800">{score.toLocaleString()}</div>
          </div>
          
          <div className="bg-orange-200 rounded-lg px-4 py-2 text-center min-w-[80px]">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-4 h-4 text-orange-700" />
              <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Best</span>
            </div>
            <div className="text-lg font-bold text-orange-800">{bestScore.toLocaleString()}</div>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">New Game</span>
        </button>
      </div>

      {/* Game Status Messages */}
      {won && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-center">
          <div className="font-bold text-lg">🎉 You Win!</div>
          <div className="text-sm">You reached the 2048 tile! Keep playing for a higher score.</div>
        </div>
      )}

      {gameOver && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">
          <div className="font-bold text-lg">Game Over!</div>
          <div className="text-sm">No more moves available. Try again!</div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center text-gray-500 text-sm">
        <p className="hidden sm:block">Use arrow keys to move tiles</p>
        <p className="sm:hidden">Swipe to move tiles</p>
      </div>
    </div>
  );
};

export default GameHeader;