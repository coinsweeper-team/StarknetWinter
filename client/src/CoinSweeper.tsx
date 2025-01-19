import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Flag, Bomb, Trophy, Award, Medal, Clock } from 'lucide-react';

// Constants
const DIFFICULTIES = [
  { id: 1, name: 'Beginner', width: 8, height: 8, mines: 10 },
  { id: 2, name: 'Intermediate', width: 16, height: 16, mines: 40 },
  { id: 3, name: 'Expert', width: 30, height: 16, mines: 99 }
];

const GAME_STATES = {
  PENDING: 'pending',
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost'
};

// Cell Component
const Cell = ({ revealed, isBomb, currencyAmount, isFlag, onClick, onRightClick }) => {
  const handleRightClick = (e) => {
    e.preventDefault();
    onRightClick?.();
  };

  return (
    <button
      className={`w-8 h-8 border flex items-center justify-center text-sm
        ${revealed 
          ? 'bg-gray-100 border-gray-300' 
          : 'bg-gray-200 hover:bg-gray-300 border-gray-400 active:bg-gray-400'}`}
      onClick={onClick}
      onContextMenu={handleRightClick}
      disabled={revealed}
    >
      {!revealed && isFlag ? (
        <Flag className="w-4 h-4 text-red-500" />
      ) : revealed ? (
        isBomb ? (
          <Bomb className="w-4 h-4 text-red-500" />
        ) : currencyAmount > 0 ? (
          <div className="flex items-center">
            <Coins className="w-3 h-3 text-yellow-500 mr-0.5" />
            <span className="text-xs">{currencyAmount}</span>
          </div>
        ) : null
      ) : null}
    </button>
  );
};

// Main Game Component
const CoinSweeper = ({ account, actions }) => {
  const [difficulty, setDifficulty] = useState(1);
  const [gameState, setGameState] = useState(GAME_STATES.PENDING);
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState([]);
  const [flags, setFlags] = useState(new Set());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [currency, setCurrency] = useState(0);
  const [achievements, setAchievements] = useState({
    won_first_game: false,
    won_10_games: false,
    won_100_games: false,
    first_in_leaderboard: false
  });
  const [bestRecords, setBestRecords] = useState({
    beginner_best_time: 0,
    intermediate_best_time: 0,
    expert_best_time: 0
  });

  const currentDifficulty = DIFFICULTIES.find(d => d.id === difficulty);

  // Timer Logic
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING) {
      const interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } else {
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [gameState]);

  const startGame = async () => {
    try {
      const result = await actions.setupGame(account, difficulty);
      setGameId(result);
      setGameState(GAME_STATES.PLAYING);
      setTimeElapsed(0);
      setFlags(new Set());
      
      // board
      const { width, height } = currentDifficulty;
      const newBoard = Array(height).fill(null).map((_, y) =>
        Array(width).fill(null).map((_, x) => ({
          revealed: false,
          isBomb: false,
          currencyAmount: 0,
          cellId: y * width + x + 1
        }))
      );
      setBoard(newBoard);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const revealCell = async (cellId) => {
    if (gameState !== GAME_STATES.PLAYING || flags.has(cellId)) return;

    try {
			//  contract simulation
      setBoard(prev => {
        const newBoard = [...prev];
        const y = Math.floor((cellId - 1) / currentDifficulty.width);
        const x = (cellId - 1) % currentDifficulty.width;
        
        if (!newBoard[y][x].revealed) {
          newBoard[y][x] = {
            ...newBoard[y][x],
            revealed: true,
            isBomb: Math.random() < 0.15, 
            currencyAmount: Math.floor(Math.random() * 5) 
          };

          if (newBoard[y][x].isBomb) {
            handleGameEnd(GAME_STATES.LOST);
          } else {
         
            setCurrency(prev => prev + newBoard[y][x].currencyAmount);
          }
        }
        return newBoard;
      });
    } catch (error) {
      console.error('Error revealing cell:', error);
    }
  };

  const toggleFlag = (cellId) => {
    if (gameState !== GAME_STATES.PLAYING) return;
    
    setFlags(prev => {
      const newFlags = new Set(prev);
      if (newFlags.has(cellId)) {
        newFlags.delete(cellId);
      } else {
        newFlags.add(cellId);
      }
      return newFlags;
    });
  };

  const handleGameEnd = async (result) => {
    if (!gameId) return;
    
    setGameState(result);
    try {
      const gameResult = result === GAME_STATES.WON ? 2 : 1; //enum

      await actions.gameEnd(account, gameId, gameResult, timeElapsed, currency);
      
      if (result === GAME_STATES.WON) {
       
        setAchievements(prev => ({
          ...prev,
          won_first_game: true
        }));
      }
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>CoinSweeper</span>
            <div className="flex items-center gap-4 text-base">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {timeElapsed}s
              </div>
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-yellow-500" />
                {currency}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            {DIFFICULTIES.map(diff => (
              <Button 
                key={diff.id}
                onClick={() => setDifficulty(diff.id)}
                variant={difficulty === diff.id ? "default" : "outline"}
                className="flex-1"
                disabled={gameState === GAME_STATES.PLAYING}
              >
                {diff.name}
              </Button>
            ))}
          </div>
          
          <div className="mb-4">
            <Button 
              onClick={startGame}
              className="w-full"
              variant={gameState === GAME_STATES.PLAYING ? "outline" : "default"}
            >
              {gameState === GAME_STATES.PLAYING ? "Restart Game" : "New Game"}
            </Button>
          </div>
          
          <div 
            className="grid gap-1 mb-4" 
            style={{
              gridTemplateColumns: `repeat(${currentDifficulty.width}, minmax(0, 1fr))`
            }}
          >
            {board.flat().map((cell) => (
              <Cell
                key={cell.cellId}
                {...cell}
                isFlag={flags.has(cell.cellId)}
                onClick={() => revealCell(cell.cellId)}
                onRightClick={() => toggleFlag(cell.cellId)}
              />
            ))}
          </div>

          {/* Achievements Panel */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className={`flex items-center gap-2 ${achievements.won_first_game ? 'text-yellow-500' : 'text-gray-400'}`}>
                    <Trophy className="w-5 h-5" />
                    <span>First Win</span>
                  </div>
                  <div className={`flex items-center gap-2 ${achievements.won_10_games ? 'text-yellow-500' : 'text-gray-400'}`}>
                    <Award className="w-5 h-5" />
                    <span>10 Wins</span>
                  </div>
                  <div className={`flex items-center gap-2 ${achievements.won_100_games ? 'text-yellow-500' : 'text-gray-400'}`}>
                    <Medal className="w-5 h-5" />
                    <span>100 Wins</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Best Times</h3>
                  <div>Beginner: {bestRecords.beginner_best_time}s</div>
                  <div>Intermediate: {bestRecords.intermediate_best_time}s</div>
                  <div>Expert: {bestRecords.expert_best_time}s</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoinSweeper;