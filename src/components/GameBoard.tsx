import React from 'react';
import { Tile } from '../types';
import TileComponent from './TileComponent';

interface GameBoardProps {
  board: (Tile | null)[][];
}

const GameBoard: React.FC<GameBoardProps> = ({ board }) => {
  const allTiles = board.flat().filter(tile => tile !== null) as Tile[];

  return (
    <div className="relative bg-gray-300 rounded-xl p-2 shadow-inner">
      {/* Grid background */}
      <div className="grid grid-cols-4 gap-2 w-[280px] h-[280px]">
        {Array(16).fill(0).map((_, index) => (
          <div
            key={index}
            className="w-16 h-16 bg-gray-200 rounded-lg"
          />
        ))}
      </div>
      
      {/* Tiles */}
      <div className="absolute top-2 left-2">
        {allTiles.map(tile => (
          <TileComponent key={tile.id} tile={tile} />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;