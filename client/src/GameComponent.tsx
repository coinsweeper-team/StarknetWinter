import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const difficulties = [
  { id: 1, name: 'Beginner', width: 8, height: 8, mines: 10 },
  { id: 2, name: 'Intermediate', width: 16, height: 16, mines: 40 },
  { id: 3, name: 'Expert', width: 30, height: 16, mines: 99 }
];

const Game = ({ account, actions }) => {
  const [difficulty, setDifficulty] = useState(1);
  const [gameId, setGameId] = useState(null);
  const [gameState, setGameState] = useState({
    board: [],
    isOver: false,
    timeElapsed: 0,
    currency: 0
  });

  const startGame = async () => {
    try {
      const result = await actions.setupGame(account, difficulty);
      setGameId(result);
      // Initialize board state here
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const endGame = async (result, timeElapsed, currency) => {
    if (!gameId) return;
    try {
      await actions.gameEnd(account, gameId, result, timeElapsed, currency);
      setGameState(prev => ({ ...prev, isOver: true }));
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>CoinSweeper</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            {difficulties.map(diff => (
              <Button 
                key={diff.id}
                onClick={() => setDifficulty(diff.id)}
                variant={difficulty === diff.id ? "default" : "outline"}
                className="flex-1"
              >
                {diff.name}
              </Button>
            ))}
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div>Time: {gameState.timeElapsed}s</div>
            <div>Currency: {gameState.currency}</div>
            <Button onClick={startGame}>New Game</Button>
          </div>
          
          <div className="grid gap-1" style={{
            gridTemplateColumns: `repeat(${difficulties.find(d => d.id === difficulty)?.width || 8}, minmax(0, 1fr))`
          }}>
        
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Game;