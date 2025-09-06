import React from 'react';
import { Tile } from '../types';

interface TileComponentProps {
  tile: Tile;
}

const getTileStyles = (value: number): string => {
  const baseClasses = "absolute w-16 h-16 flex items-center justify-center font-bold rounded-lg transition-all duration-200 ease-in-out";
  
  const valueStyles: Record<number, string> = {
    2: "bg-blue-100 text-blue-800 text-xl",
    4: "bg-blue-200 text-blue-900 text-xl",
    8: "bg-orange-200 text-orange-900 text-xl",
    16: "bg-orange-300 text-orange-900 text-lg",
    32: "bg-red-300 text-red-900 text-lg",
    64: "bg-red-400 text-white text-lg",
    128: "bg-yellow-400 text-white text-base font-extrabold",
    256: "bg-yellow-500 text-white text-base font-extrabold",
    512: "bg-yellow-600 text-white text-base font-extrabold",
    1024: "bg-purple-500 text-white text-sm font-extrabold",
    2048: "bg-purple-600 text-white text-sm font-extrabold animate-pulse"
  };

  const defaultStyle = "bg-gray-800 text-white text-sm font-extrabold";
  
  return `${baseClasses} ${valueStyles[value] || defaultStyle}`;
};

const TileComponent: React.FC<TileComponentProps> = ({ tile }) => {
  const { value, position, isNew, isMerged } = tile;
  
  const tileStyle = {
    transform: `translate(${position.col * 72}px, ${position.row * 72}px)`,
    zIndex: isNew || isMerged ? 10 : 1
  };

  const animationClasses = isNew ? "animate-bounce" : isMerged ? "animate-pulse" : "";

  return (
    <div
      className={`${getTileStyles(value)} ${animationClasses}`}
      style={tileStyle}
    >
      {value}
    </div>
  );
};

export default TileComponent;