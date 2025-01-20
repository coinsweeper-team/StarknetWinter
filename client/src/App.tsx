import { useState, useCallback } from "react";
import { WalletAccount } from "./wallet-account";
import { useAccount } from "@starknet-react/core";

const CELL_SIZE = 20;
const GRID_SIZE = 401;

interface CellType {
  x: number;
  y: number;
  isBee: boolean;
  isCoin: boolean;
  isRevealed: boolean;
  neighborCount: number;
}

const App = () => {
  const { account } = useAccount(); // Get the connected account
  const [grid, setGrid] = useState<CellType[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [boardId, setBoardId] = useState<number | null>(null);

  const cols = Math.floor(GRID_SIZE / CELL_SIZE);
  const rows = Math.floor(GRID_SIZE / CELL_SIZE);

  const clickSound = new Audio("/sounds/click.mp3");
  const gameOverSound = new Audio("/sounds/gameover.mp3");

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

  const startGame = async () => {
    if (!account) {
      console.error("No StarkNet account connected.");
      return;
    }

    try {
      const difficulty = 1; // Beginner difficulty
      const response = await account.execute({
        contractAddress: "0x076d923e13e0c61c402978ef72d0b7134a93dadfe5c6006dcaf8d4778c51597d",
        entrypoint: "setup_game",
        calldata: [difficulty],
      });

      console.log("Transaction Hash:", response.transaction_hash);

      setBoardId(Date.now()); // Mock boardId
      let newGrid = createEmptyGrid();
      setGrid(newGrid);

      setGameStarted(true);
      setGameOver(false);
      setCoinsCollected(0);
    } catch (error) {
      console.error("Failed to start new game:", error);
    }
  };

  const handleCellClick = async (x: number, y: number) => {
    if (!account || gameOver || boardId === null) return;

    const newGrid = JSON.parse(JSON.stringify(grid));
    const cell = newGrid[x][y];

    if (cell.isRevealed) return;

    clickSound.play();

    try {
      if (cell.isBee) {
        setGameOver(true);
        gameOverSound.play();

        await account.execute({
          contractAddress: "0x076d923e13e0c61c402978ef72d0b7134a93dadfe5c6006dcaf8d4778c51597d",
          entrypoint: "gameEnd",
          calldata: [boardId, 2, 0, 0], // Result: Lost
        });

        console.log("Game ended with a loss!");

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
          }

          if (cell.neighborCount === 0) {
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                floodFill(x + i, y + j);
              }
            }
          }
        };

        floodFill(x, y);

        if (coinsCollectedInThisMove > 0) {
          setCoinsCollected((prev) => prev + coinsCollectedInThisMove);

          await account.execute({
            contractAddress: "0x076d923e13e0c61c402978ef72d0b7134a93dadfe5c6006dcaf8d4778c51597d",
            entrypoint: "addCurrency",
            calldata: [coinsCollectedInThisMove],
          });

          console.log(`Added ${coinsCollectedInThisMove} coins to account!`);
        }
      }

      setGrid(newGrid);
    } catch (error) {
      console.error("Failed to handle cell click:", error);
    }
  };

  const Cell = ({ cell, onClick }: { cell: CellType; onClick: () => void }) => {
    const getCellContent = () => {
      if (!cell.isRevealed) return "";
      if (cell.isBee) return "💣";
      if (cell.isCoin) return "💰";
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
                    cell={
                      grid[x]?.[y] || {
                        x,
                        y,
                        isBee: false,
                        isCoin: false,
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
