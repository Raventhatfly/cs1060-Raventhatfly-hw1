import { Tile, Direction, GameState, Position } from './types';

const GRID_SIZE = 4;

export const createEmptyBoard = (): (Tile | null)[][] => {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const getEmptyPositions = (board: (Tile | null)[][]): Position[] => {
  const positions: Position[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!board[row][col]) {
        positions.push({ row, col });
      }
    }
  }
  return positions;
};

export const addRandomTile = (board: (Tile | null)[][]): (Tile | null)[][] => {
  const emptyPositions = getEmptyPositions(board);
  if (emptyPositions.length === 0) return board;

  const randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  const newBoard = board.map(row => [...row]);
  
  newBoard[randomPosition.row][randomPosition.col] = {
    id: generateId(),
    value: Math.random() < 0.9 ? 2 : 4,
    position: randomPosition,
    isNew: true
  };

  return newBoard;
};

export const initializeGame = (): GameState => {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);

  return {
    board,
    score: 0,
    bestScore: parseInt(localStorage.getItem('2048-best-score') || '0'),
    gameOver: false,
    won: false
  };
};

const moveTiles = (board: (Tile | null)[][], direction: Direction): {
  newBoard: (Tile | null)[][];
  score: number;
  moved: boolean;
} => {
  const newBoard = createEmptyBoard();
  let score = 0;
  let moved = false;

  const processLine = (line: (Tile | null)[]): (Tile | null)[] => {
    // Filter out nulls and reverse if needed
    const tiles = line.filter(tile => tile !== null) as Tile[];
    const result: (Tile | null)[] = new Array(GRID_SIZE).fill(null);
    let targetIndex = 0;
    let lineScore = 0;
    let lineMoved = false;

    for (let i = 0; i < tiles.length; i++) {
      const currentTile = tiles[i];
      const originalIndex = line.findIndex(tile => tile === currentTile);
      
      if (targetIndex > 0 && 
          result[targetIndex - 1] && 
          result[targetIndex - 1]!.value === currentTile.value && 
          !result[targetIndex - 1]!.isMerged) {
        // Merge tiles
        const mergedTile = {
          id: result[targetIndex - 1]!.id,
          value: currentTile.value * 2,
          position: result[targetIndex - 1]!.position,
          isMerged: true
        };
        result[targetIndex - 1] = mergedTile;
        lineScore += mergedTile.value;
        lineMoved = true;
      } else {
        result[targetIndex] = { 
          ...currentTile,
          isMerged: false
        };
        if (targetIndex !== originalIndex) {
          lineMoved = true;
        }
        targetIndex++;
      }
    }

    score += lineScore;
    if (lineMoved) moved = true;
    return result;
  };

  if (direction === 'left') {
    for (let row = 0; row < GRID_SIZE; row++) {
      const processedLine = processLine(board[row]);
      for (let col = 0; col < GRID_SIZE; col++) {
        newBoard[row][col] = processedLine[col];
        if (processedLine[col]) {
          processedLine[col]!.position = { row, col };
        }
      }
    }
  } else if (direction === 'right') {
    for (let row = 0; row < GRID_SIZE; row++) {
      const processedLine = processLine([...board[row]].reverse()).reverse();
      for (let col = 0; col < GRID_SIZE; col++) {
        newBoard[row][col] = processedLine[col];
        if (processedLine[col]) {
          processedLine[col]!.position = { row, col };
        }
      }
    }
  } else if (direction === 'up') {
    for (let col = 0; col < GRID_SIZE; col++) {
      const column = board.map(row => row[col]);
      const processedLine = processLine(column);
      for (let row = 0; row < GRID_SIZE; row++) {
        newBoard[row][col] = processedLine[row];
        if (processedLine[row]) {
          processedLine[row]!.position = { row, col };
        }
      }
    }
  } else if (direction === 'down') {
    for (let col = 0; col < GRID_SIZE; col++) {
      const column = board.map(row => row[col]);
      const processedLine = processLine([...column].reverse()).reverse();
      for (let row = 0; row < GRID_SIZE; row++) {
        newBoard[row][col] = processedLine[row];
        if (processedLine[row]) {
          processedLine[row]!.position = { row, col };
        }
      }
    }
  }

  return { newBoard, score, moved };
};

export const canMove = (board: (Tile | null)[][]): boolean => {
  // Check for empty cells
  if (getEmptyPositions(board).length > 0) return true;

  // Check for possible merges
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const currentTile = board[row][col];
      if (!currentTile) continue;

      // Check adjacent cells
      const directions = [
        { row: -1, col: 0 }, // up
        { row: 1, col: 0 },  // down
        { row: 0, col: -1 }, // left
        { row: 0, col: 1 }   // right
      ];

      for (const dir of directions) {
        const newRow = row + dir.row;
        const newCol = col + dir.col;
        
        if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
          const adjacentTile = board[newRow][newCol];
          if (adjacentTile && adjacentTile.value === currentTile.value) {
            return true;
          }
        }
      }
    }
  }

  return false;
};

export const hasWon = (board: (Tile | null)[][]): boolean => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const tile = board[row][col];
      if (tile && tile.value === 2048) {
        return true;
      }
    }
  }
  return false;
};

export const makeMove = (gameState: GameState, direction: Direction): GameState => {
  const { newBoard, score: moveScore, moved } = moveTiles(gameState.board, direction);
  
  if (!moved) return gameState;

  // Add new tile
  const boardWithNewTile = addRandomTile(newBoard);
  
  const newScore = gameState.score + moveScore;
  const newBestScore = Math.max(gameState.bestScore, newScore);
  
  // Save best score
  localStorage.setItem('2048-best-score', newBestScore.toString());

  const won = !gameState.won && hasWon(boardWithNewTile);
  const gameOver = !canMove(boardWithNewTile);

  return {
    board: boardWithNewTile,
    score: newScore,
    bestScore: newBestScore,
    gameOver,
    won
  };
};

export const saveGameState = (gameState: GameState): void => {
  localStorage.setItem('2048-game-state', JSON.stringify(gameState));
};

export const loadGameState = (): GameState | null => {
  const saved = localStorage.getItem('2048-game-state');
  if (!saved) return null;
  
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};