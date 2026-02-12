import React, { useState, useEffect } from 'react';
import Digit from './Digit';
import {
  generateRandomNumber,
  getSegments,
  isValidNumber,
  calculateMoves
} from '@math-sticks/shared';

const ROUND_TIME = 45;

const Game: React.FC = () => {
  // Game State
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(ROUND_TIME);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [history, setHistory] = useState<number[]>([]);

  // Board State
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [startSegments, setStartSegments] = useState<boolean[][]>([]);
  const [currentSegments, setCurrentSegments] = useState<boolean[][]>([]);
  const [hand, setHand] = useState<number>(0);
  const [message, setMessage] = useState<string>('Welcome!');

  const startRound = (num: number) => {
    const segs = getSegments(num);
    setTargetNumber(num);
    setStartSegments(segs);
    setCurrentSegments(segs.map(d => [...d])); // Deep copy
    setHand(0);
    setTimeLeft(ROUND_TIME);
  };

  const initGame = () => {
    const num = generateRandomNumber();
    setScore(0);
    setRound(1);
    setGameOver(false);
    setHistory([num]); // Add initial number to history
    setMessage(`Start number: ${num}. Good luck!`);
    startRound(num);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Timer
  useEffect(() => {
    if (gameOver) return;

    if (timeLeft <= 0) {
      setGameOver(true);
      setMessage("Time's up! Game Over.");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

  const handleSegmentClick = (digitIndex: number, segmentIndex: number) => {
    if (gameOver) return;

    const isActive = currentSegments[digitIndex][segmentIndex];
    const newSegments = currentSegments.map(d => [...d]);

    if (isActive) {
      // Remove stick -> add to hand
      newSegments[digitIndex][segmentIndex] = false;
      setHand(h => h + 1);
      setCurrentSegments(newSegments);
    } else {
      // Add stick -> remove from hand
      if (hand > 0) {
        newSegments[digitIndex][segmentIndex] = true;
        setHand(h => h - 1);
        setCurrentSegments(newSegments);
      } else {
        setMessage("No sticks in hand!");
      }
    }
  };

  const submitRound = () => {
    if (gameOver) return;

    if (hand !== 0) {
      setMessage("You must use all sticks!");
      return;
    }

    const num = isValidNumber(currentSegments);
    if (num === -1) {
      setMessage("Not a valid number!");
      return;
    }

    // Check moves
    const moves = calculateMoves(startSegments, currentSegments);
    if (moves > 3) {
      setMessage(`Too many moves! Used ${moves}, max 3.`);
      return;
    }

    // Check history
    if (history.includes(num)) {
       setMessage(`Number ${num} has already been seen!`);
       return;
    }

    // Success
    const newScore = score + num;
    setScore(newScore);
    setHistory(prev => [...prev, num]);
    setRound(r => r + 1);
    setMessage(`Round ${round} won! Found ${num}. +${num} points.`);
    startRound(num);
  };

  const resetConfig = () => {
      setCurrentSegments(startSegments.map(d => [...d]));
      setHand(0);
      setMessage("Reset to current start number.");
  };

  const currentMoveCount = calculateMoves(startSegments, currentSegments);

  return (
    <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Math Sticks</h1>

      {/* Stats Bar */}
      <div className="flex gap-8 mb-6 text-xl bg-white p-4 rounded-lg shadow-sm">
        <div><span className="font-semibold">Score:</span> {score}</div>
        <div><span className="font-semibold">Round:</span> {round}</div>
        <div className={`${timeLeft < 10 ? 'text-red-600 font-bold' : ''}`}>
             <span className="font-semibold">Time:</span> {timeLeft}s
        </div>
      </div>

      <div className="mb-4 text-lg">
        <span className="font-semibold">Start Number:</span> {targetNumber}
      </div>

      <div className="mb-8 text-lg">
        <span className="font-semibold">Sticks in Hand:</span> {hand}
      </div>

      {/* Board */}
      <div className={`flex justify-center mb-8 gap-4 bg-white p-6 rounded-xl shadow-lg ${gameOver ? 'opacity-50 pointer-events-none' : ''}`}>
        {currentSegments.map((segs, idx) => (
          <Digit
            key={idx}
            segments={segs}
            onClick={(sIdx) => handleSegmentClick(idx, sIdx)}
            disabled={gameOver}
          />
        ))}
      </div>

      {/* Controls */}
      {!gameOver ? (
        <div className="flex gap-4 mb-8">
            <button
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50"
            onClick={submitRound}
            disabled={hand > 0}
            >
            Submit
            </button>
            <button
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-semibold transition-colors"
            onClick={resetConfig}
            >
            Reset Config
            </button>
        </div>
      ) : (
          <div className="flex flex-col items-center mb-8">
              <div className="text-2xl font-bold text-red-600 mb-4">GAME OVER</div>
              <div className="text-xl mb-4">Final Score: {score}</div>
              <button
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold transition-colors"
                onClick={initGame}
            >
                Play Again
            </button>
          </div>
      )}

      <div className="text-xl font-bold text-center mb-4 min-h-[2rem]">
        {message}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Moves used: {currentMoveCount} / 3
      </div>

      {/* History */}
      <div className="mt-8 w-full max-w-md">
          <h3 className="text-lg font-bold mb-2">History (Seen Numbers)</h3>
           <div className="max-h-40 overflow-y-auto border p-2 bg-white rounded">
            {history.slice().reverse().map((h, i) => (
                <span key={i} className="inline-block bg-gray-200 rounded px-2 py-1 m-1 text-sm font-mono">
                    {h.toString().padStart(3, '0')}
                </span>
            ))}
           </div>
      </div>
    </div>
  );
};

export default Game;
