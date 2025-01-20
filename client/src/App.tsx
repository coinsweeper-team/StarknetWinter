import { useState, useCallback } from 'react';
import { WalletAccount } from "./wallet-account";
import bombSound from "../src/sounds/bomb.wav";
import popSound from "../src/sounds/pop.flac";
import coinSound from "../src/sounds/collectcoin.wav";
import drumSound from "../src/sounds/drum-beat.m4a";

const CELL_SIZE = 20;
const GRID_SIZE = 401;
const TOTAL_BEES = 50;

interface CellType {
  x: number;
  y: number;
  isBee: boolean;
  isCoin: boolean;
  isRevealed: boolean;
  neighborCount: number;
}
let drumAudio: HTMLAudioElement | null = null;

// Function to play a sound on repeat
function playDrumSound(): void {
  if (!drumAudio) {
    drumAudio = new Audio(drumSound); // Replace with your sound file URL
    drumAudio.loop = true; // Enable looping
    drumAudio.play().catch(error => console.error('Error playing sound:', error));
  }
}

// Function to stop the sound
function stopDrumSound(): void {
  if (drumAudio) {
    drumAudio.pause();
    drumAudio.currentTime = 0;
    drumAudio = null;
  }
}

function playSound(sound: string): void {
  const audio = new Audio(sound); // Replace with your sound file URL
  audio.play().catch(error => console.error('Error playing sound:', error));
}

const App = () => {
  const [grid, setGrid] = useState<CellType[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [coinsCollected, setCoinsCollected] = useState(0);

  const cols = Math.floor(GRID_SIZE / CELL_SIZE);
  const rows = Math.floor(GRID_SIZE / CELL_SIZE);

  const clickSound = new Audio('/sounds/click.mp3');
  const gameOverSound = new Audio('/sounds/gameover.mp3');

  const createEmptyGrid = useCallback(() => {
    const newGrid: CellType[][] = [];
    for (let i = 0; i < cols; i++) {
      newGrid[i] = [];
      for (let j = 0; j < rows; j++) {
        newGrid[i][j] = {
          x: i,
          y: j,
          isBee: false,
          isCoin: false,
          isRevealed: false,
          neighborCount: 0,
        };
      }
    }
    return newGrid;
  }, [cols, rows]);

  const placeBees = (currentGrid: CellType[][]): CellType[][] => {
    const newGrid = JSON.parse(JSON.stringify(currentGrid));
    let options: [number, number][] = [];

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        options.push([i, j]);
      }
    }

    for (let n = 0; n < TOTAL_BEES; n++) {
      const index = Math.floor(Math.random() * options.length);
      const [i, j] = options[index];
      options.splice(index, 1);
      newGrid[i][j].isBee = true;
    }

    return newGrid;
  };

  const placeCoins = (currentGrid: CellType[][]): CellType[][] => {
    const newGrid = JSON.parse(JSON.stringify(currentGrid));
    let options: [number, number][] = [];

    // Collect all cells that are not bees
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (!newGrid[i][j].isBee) {
          options.push([i, j]);
        }
      }
    }

    const numCoins = 5; // Fixed number of coins
    console.log(`Placing ${numCoins} coins in this game`);

    // Place exactly 5 coins
    for (let n = 0; n < numCoins; n++) {
      if (options.length === 0) break;
      const index = Math.floor(Math.random() * options.length);
      const [i, j] = options[index];
      options.splice(index, 1);
      newGrid[i][j].isCoin = true;
    }

    return newGrid;
  };

  const countNeighborBees = (currentGrid: CellType[][]): CellType[][] => {
    const newGrid = JSON.parse(JSON.stringify(currentGrid));

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (!newGrid[i][j].isBee) {
          let total = 0;
          for (let xoff = -1; xoff <= 1; xoff++) {
            for (let yoff = -1; yoff <= 1; yoff++) {
              const ni = i + xoff;
              const nj = j + yoff;
              if (ni >= 0 && ni < cols && nj >= 0 && nj < rows) {
                if (newGrid[ni][nj].isBee) total++;
              }
            }
          }
          newGrid[i][j].neighborCount = total;
        }
      }
    }

    return newGrid;
  };

  const startGame = () => {
    let newGrid = createEmptyGrid();
    newGrid = placeBees(newGrid);
    newGrid = placeCoins(newGrid);
    newGrid = countNeighborBees(newGrid);
    setGrid(newGrid);
    setGameOver(false);
    setGameStarted(true);
    setCoinsCollected(0);
    //marat sound added
    playDrumSound();
  };

  const handleCellClick = (x: number, y: number) => {
    if (gameOver) return;

    clickSound.play();
    //marat sound added
    playSound(popSound);

    const newGrid = JSON.parse(JSON.stringify(grid));
    const cell = newGrid[x][y];

    if (cell.isBee) {
      //marat sound added
      stopDrumSound();

      setGameOver(true);
      gameOverSound.play();
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          newGrid[i][j].isRevealed = true;
        }
      }
    } else {
      let coinsCollectedInThisMove = 0;

      const floodFill = (x: number, y: number) => {
        if (x < 0 || x >= cols || y < 0 || y >= rows) return;
        if (newGrid[x][y].isRevealed) return;

        const cell = newGrid[x][y];
        cell.isRevealed = true;

        if (cell.isCoin) {
          coinsCollectedInThisMove++;
          // Just count the coin, no need to remove it
        }

        if (cell.neighborCount === 0) {
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (i !== 0 || j !== 0) {
                floodFill(x + i, y + j);
              }
            }
          }
        }
      };

      floodFill(x, y);

      if (coinsCollectedInThisMove > 0) {
        setCoinsCollected((prev) => prev + coinsCollectedInThisMove);
        //marat sound added
        playSound(coinSound);
      }
    }

    setGrid(newGrid);
  };

  const Cell = ({ cell, onClick }: { cell: CellType; onClick: () => void }) => {
    const getCellContent = () => {
      if (!cell.isRevealed) return '';
      if (cell.isBee) return '💣';
      if (cell.isCoin) return   <img src="/src/coin/coin.svg" alt="Coin" />;
      return cell.neighborCount || '';
    };

    const getCellColor = () => {
      if (!cell.isRevealed) return 'bg-gray-300';
      if (cell.isBee) return 'bg-red-500';
      return 'bg-gray-100';
    };

    return (
      <button
        className={`w-5 h-5 border border-gray-400 flex items-center justify-center text-sm font-bold ${getCellColor()}`}
        onClick={onClick}
        disabled={!gameStarted}
      >
        {getCellContent()}
      </button>
    );
  };

  return (
    <div className="bg-black min-h-screen w-full p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <WalletAccount />

        <div className="mt-8 flex flex-col items-center gap-4">
          {!gameStarted && (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={startGame}
            >
              Start New Game
            </button>
          )}

          <div className="flex items-start gap-2">
            <div className="text-white text-lg flex items-center gap-2">
              <img width={20} src="/src/coin/coin.svg" alt="Coin" />
              <span>Collected: {coinsCollected}</span>
            </div>
          </div>

          <div className="flex flex-col">
            {Array.from({ length: rows }, (_, y) => (
              <div key={y} className="flex">
                {Array.from({ length: cols }, (_, x) => (
                  <Cell
                    key={`${x}-${y}`}
                    cell={grid[x]?.[y] || { x, y, isBee: false, isCoin: false, isRevealed: false, neighborCount: 0 }}
                    onClick={() => handleCellClick(x, y)}
                  />
                ))}
              </div>
            ))}
          </div>

          {gameOver && (
            <div className="flex gap-4 items-center">
              <div className="text-red-500 font-bold">Game Over!</div>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={startGame}
              >
                New Game
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;