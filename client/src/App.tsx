import { useState, useEffect, useCallback } from "react";
import { QueryBuilder } from "@dojoengine/sdk";
import { useAccount } from "@starknet-react/core";
import { useDojoSDK, useModel } from "@dojoengine/sdk/react";
import { WalletAccount } from "./wallet-account";
import { ModelsMapping } from "./typescript/models.gen";

const CELL_SIZE = 20;
const GRID_SIZE = 401;
const TOTAL_BEES = 50;

interface CellType {
  x: number;
  y: number;
  isBee: boolean;
  isRevealed: boolean;
  neighborCount: number;
}

const App = () => {
  const { useDojoStore, sdk } = useDojoSDK();
  const { account } = useAccount();
  const state = useDojoStore((state) => state);

  const [grid, setGrid] = useState<CellType[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<number>(1); // 1: Beginner, 2: Intermediate, 3: Expert
  const [boardId, setBoardId] = useState<number | null>(null);

  // Models for the game
  const boardStatus = useModel(
    boardId ? BigInt(boardId) : BigInt(0),
    ModelsMapping.BoardStatus
  );
  const currency = useModel(
    account?.address ? BigInt(account.address) : BigInt(0),
    ModelsMapping.Currency
  );
  const achievements = useModel(
    account?.address ? BigInt(account.address) : BigInt(0),
    ModelsMapping.Achievements
  );

  const cols = Math.floor(GRID_SIZE / CELL_SIZE);
  const rows = Math.floor(GRID_SIZE / CELL_SIZE);

  const createEmptyGrid = useCallback(() => {
    const newGrid: CellType[][] = [];
    for (let i = 0; i < cols; i++) {
      newGrid[i] = [];
      for (let j = 0; j < rows; j++) {
        newGrid[i][j] = {
          x: i,
          y: j,
          isBee: false,
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
    newGrid = countNeighborBees(newGrid);
    setGrid(newGrid);
    setGameOver(false);
    setGameStarted(true);
  };

  const handleCellClick = (x: number, y: number) => {
    if (gameOver) return;

    const newGrid = JSON.parse(JSON.stringify(grid));
    const cell = newGrid[x][y];

    if (cell.isBee) {
      setGameOver(true);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          newGrid[i][j].isRevealed = true;
        }
      }
    } else {
      const floodFill = (x: number, y: number) => {
        if (x < 0 || x >= cols || y < 0 || y >= rows) return;
        if (newGrid[x][y].isRevealed) return;

        newGrid[x][y].isRevealed = true;

        if (newGrid[x][y].neighborCount === 0) {
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              floodFill(x + i, y + j);
            }
          }
        }
      };

      floodFill(x, y);
    }

    setGrid(newGrid);
  };

  const Cell = ({ cell, onClick }: { cell: CellType; onClick: () => void }) => {
    const getCellContent = () => {
      if (!cell.isRevealed) return "";
      if (cell.isBee) return "💣";
      return cell.neighborCount || "";
    };

    const getCellColor = () => {
      if (!cell.isRevealed) return "bg-gray-300";
      if (cell.isBee) return "bg-red-500";
      return "bg-gray-100";
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

        {/* Game Controls */}
        <div className="mt-8 flex flex-col items-center gap-4">
          {!gameStarted && (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={startGame}
            >
              Start New Minesweeper Game
            </button>
          )}

          {/* Minesweeper Grid */}
          <div className="flex flex-col">
            {Array.from({ length: rows }, (_, y) => (
              <div key={y} className="flex">
                {Array.from({ length: cols }, (_, x) => (
                  <Cell
                    key={`${x}-${y}`}
                    cell={
                      grid[x]?.[y] || {
                        x,
                        y,
                        isBee: false,
                        isRevealed: false,
                        neighborCount: 0,
                      }
                    }
                    onClick={() => handleCellClick(x, y)}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Game Over Message */}
          {gameOver && (
            <div className="flex gap-4 items-center">
              <div className="text-red-500 font-bold">Game Over!</div>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={startGame}
              >
                Restart Game
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

