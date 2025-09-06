import { useEffect, useCallback } from 'react';
import { Direction } from '../types';

interface UseGameControlsProps {
  onMove: (direction: Direction) => void;
  gameOver: boolean;
}

export const useGameControls = ({ onMove, gameOver }: UseGameControlsProps) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameOver) return;
    
    const keyMap: Record<string, Direction> = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'w': 'up',
      's': 'down',
      'a': 'left',
      'd': 'right'
    };

    const direction = keyMap[event.key];
    if (direction) {
      event.preventDefault();
      onMove(direction);
    }
  }, [onMove, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Touch controls for mobile
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (gameOver) return;
    
    const touch = event.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    const handleTouchEnd = (endEvent: TouchEvent) => {
      const endTouch = endEvent.changedTouches[0];
      const deltaX = endTouch.clientX - startX;
      const deltaY = endTouch.clientY - startY;
      const minSwipeDistance = 50;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          onMove(deltaX > 0 ? 'right' : 'left');
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          onMove(deltaY > 0 ? 'down' : 'up');
        }
      }

      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchend', handleTouchEnd);
  }, [onMove, gameOver]);

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart);
    return () => window.removeEventListener('touchstart', handleTouchStart);
  }, [handleTouchStart]);
};