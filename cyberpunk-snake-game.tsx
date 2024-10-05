import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_FOOD = { x: 15, y: 15 };

const CyberpunkSnake = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'paused', 'gameOver'

  const moveSnake = useCallback(() => {
    if (gameState !== 'playing') return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      if (head.x < 0) head.x = GRID_SIZE - 1;
      if (head.x >= GRID_SIZE) head.x = 0;
      if (head.y < 0) head.y = GRID_SIZE - 1;
      if (head.y >= GRID_SIZE) head.y = 0;

      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameState('gameOver');
        return prevSnake;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore(prevScore => prevScore + 1);
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameState]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState !== 'playing') return;
      
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':
          setDirection(prev => prev.y !== 1 ? { x: 0, y: -1 } : prev);
          break;
        case 'ArrowDown':
          setDirection(prev => prev.y !== -1 ? { x: 0, y: 1 } : prev);
          break;
        case 'ArrowLeft':
          setDirection(prev => prev.x !== 1 ? { x: -1, y: 0 } : prev);
          break;
        case 'ArrowRight':
          setDirection(prev => prev.x !== -1 ? { x: 1, y: 0 } : prev);
          break;
        case 'Escape':
          setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, 150);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(INITIAL_FOOD);
    setScore(0);
    setGameState('playing');
  };

  const pauseGame = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  const returnToMenu = () => {
    setGameState('menu');
  };

  const renderGame = () => (
    <>
      <div
        className="relative border-2"
        style={{
          width: 400,
          height: 400,
          borderColor: '#91c46e',
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: '#5fc5eb',
            }}
          />
        ))}
        <div
          className="absolute"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            backgroundColor: '#91c46e',
          }}
        />
      </div>
      <div className="mt-4 text-xl">Score: {score}</div>
      <button
        className="mt-4 px-4 py-2 font-bold"
        style={{ backgroundColor: '#91c46e', color: '#000e17' }}
        onClick={pauseGame}
      >
        {gameState === 'playing' ? 'Pause' : 'Resume'}
      </button>
    </>
  );

  const renderMenu = () => (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">Cyberpunk Snake</h1>
      <button
        className="mb-4 px-6 py-3 font-bold text-xl"
        style={{ backgroundColor: '#91c46e', color: '#000e17' }}
        onClick={startGame}
      >
        Start Game
      </button>
      <p className="text-center mt-4">
        Use arrow keys to move.<br />
        Press ESC to pause/resume.
      </p>
    </div>
  );

  const renderGameOver = () => (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4">Game Over</h2>
      <p className="text-xl mb-4">Your Score: {score}</p>
      <button
        className="mb-4 px-6 py-3 font-bold text-xl"
        style={{ backgroundColor: '#91c46e', color: '#000e17' }}
        onClick={startGame}
      >
        Play Again
      </button>
      <button
        className="px-6 py-3 font-bold text-xl"
        style={{ backgroundColor: '#5fc5eb', color: '#000e17' }}
        onClick={returnToMenu}
      >
        Main Menu
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen" style={{ backgroundColor: '#000e17', color: '#91c46e' }}>
      {gameState === 'menu' && renderMenu()}
      {(gameState === 'playing' || gameState === 'paused') && renderGame()}
      {gameState === 'gameOver' && renderGameOver()}
    </div>
  );
};

export default CyberpunkSnake;
