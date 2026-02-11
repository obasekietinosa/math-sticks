import React, { useState, useEffect } from 'react';
import Digit from './Digit';
import {
  generateRandomNumber,
  getSegments,
  isValidNumber,
  calculateMoves
} from '@math-sticks/shared';

const Game: React.FC = () => {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [startSegments, setStartSegments] = useState<boolean[][]>([]);
  const [currentSegments, setCurrentSegments] = useState<boolean[][]>([]);
  const [hand, setHand] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([]);
  const [message, setMessage] = useState<string>('Welcome!');

  const initGame = () => {
    const num = generateRandomNumber();
    const segs = getSegments(num);
    setTargetNumber(num);
    setStartSegments(segs);
    // Deep copy for current segments
    setCurrentSegments(segs.map(d => [...d]));
    setHand(0);
    setHistory([]);
    setMessage(`Start number: ${num}. Make a larger number!`);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleSegmentClick = (digitIndex: number, segmentIndex: number) => {
    // Check if segment is active
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

  const checkWin = () => {
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
    // Moves = sticks removed from original position.
    // calculateMoves returns (diff) / 2.
    // If conserved, diff/2 is number of moves.
    const moves = calculateMoves(startSegments, currentSegments);
    if (moves > 3) {
      setMessage(`Too many moves! Used ${moves}, max 3.`);
      return;
    }

    // Check value
    if (num <= targetNumber) {
      setMessage(`Must be greater than start number ${targetNumber}!`);
      return;
    }

    // Check history
    const maxPrev = history.length > 0 ? Math.max(...history) : targetNumber;
    if (num <= maxPrev) {
      setMessage(`Must be greater than previous best ${maxPrev}!`);
      return;
    }

    // Success
    setHistory(prev => [...prev, num]);
    setMessage(`Success! Found ${num}. Moves used: ${moves}.`);
  };

  const currentMoveCount = calculateMoves(startSegments, currentSegments);
  // If hand > 0, calculateMoves returns incorrect value for "completed moves".
  // But we can show "Diff: X".
  // If hand > 0, user hasn't finished.

  return (
    <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Math Sticks</h1>

      <div className="mb-4 text-xl">
        <span className="font-semibold">Start Number:</span> {targetNumber}
      </div>

      <div className="mb-8 text-lg">
        <span className="font-semibold">Sticks in Hand:</span> {hand}
      </div>

      <div className="flex justify-center mb-8 gap-4 bg-white p-6 rounded-xl shadow-lg">
        {currentSegments.map((segs, idx) => (
          <Digit
            key={idx}
            segments={segs}
            onClick={(sIdx) => handleSegmentClick(idx, sIdx)}
          />
        ))}
      </div>

      <div className="flex gap-4 mb-8">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold transition-colors"
          onClick={checkWin}
          disabled={hand > 0}
        >
          Submit
        </button>
        <button
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-semibold transition-colors"
          onClick={() => {
            setCurrentSegments(startSegments.map(d => [...d]));
            setHand(0);
            setMessage("Reset to start.");
          }}
        >
          Reset Config
        </button>
        <button
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold transition-colors"
          onClick={initGame}
        >
          New Game
        </button>
      </div>

      <div className="text-xl font-bold text-center mb-4 min-h-[2rem]">
        {message}
      </div>

      {history.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <h3 className="text-lg font-bold mb-2">History (Target: {targetNumber})</h3>
          <ul className="list-disc pl-5">
            {history.map((h, i) => (
              <li key={i} className="text-green-600 font-semibold">{h}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Moves used: {currentMoveCount} / 3
      </div>
    </div>
  );
};

export default Game;
