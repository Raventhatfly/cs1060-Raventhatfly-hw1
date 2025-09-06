export interface Position {
  row: number;
  col: number;
}

export interface Tile {
  id: string;
  value: number;
  position: Position;
  isNew?: boolean;
  isMerged?: boolean;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface GameState {
  board: (Tile | null)[][];
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
}