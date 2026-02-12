import React, { useState, useEffect } from 'react';
import Digit from './Digit';
import { Toast } from './Toast';
import { GameOverModal } from './GameOverModal';
import { TutorialOverlay } from './TutorialOverlay';
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
  const [tutorialStep, setTutorialStep] = useState<number>(() => {
    return localStorage.getItem('math-sticks-tutorial-v2-seen') ? -1 : 0;
  });

  // Board State
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [startSegments, setStartSegments] = useState<boolean[][]>([]);
  const [currentSegments, setCurrentSegments] = useState<boolean[][]>([]);
  const [hand, setHand] = useState<number>(0);

  // Feedback State
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [boardStatus, setBoardStatus] = useState<'neutral' | 'success' | 'error'>('neutral');

  const startRound = (num: number) => {
    const segs = getSegments(num);
    setTargetNumber(num);
    setStartSegments(segs);
    setCurrentSegments(segs.map(d => [...d])); // Deep copy
    setHand(0);
    setTimeLeft(ROUND_TIME);
  };

  const initGame = () => {
    let num;
    if (tutorialStep >= 0) {
      num = 6; // Fixed start for tutorial
    } else {
      num = generateRandomNumber();
    }
    setScore(0);
    setRound(1);
    setGameOver(false);
    setHistory([num]); // Add initial number to history
    setMessage(`Start number: ${num}. Good luck!`);
    setMessageType('info');
    setBoardStatus('neutral');
    startRound(num);
  };

  useEffect(() => {
    initGame();
  }, [tutorialStep === 0, tutorialStep === -1]); // Re-run init if tutorial starts or ends

  // Timer
  const isProcessing = boardStatus !== 'neutral';
  const isTutorialActive = tutorialStep >= 0;

  useEffect(() => {
    if (gameOver || isProcessing || isTutorialActive) return;

    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver, isProcessing, isTutorialActive]);

  const handleSegmentClick = (digitIndex: number, segmentIndex: number) => {
    if (gameOver || isProcessing) return;

    // Tutorial Constraints
    if (isTutorialActive) {
      if (tutorialStep === 1) {
        // Must click Digit 2, Segment 4 (E)
        if (digitIndex === 2 && segmentIndex === 4) {
          // Allow logic to proceed
        } else {
          return; // Block
        }
      } else if (tutorialStep === 2) {
         // Must click Digit 2, Segment 1 (B)
         if (digitIndex === 2 && segmentIndex === 1) {
           // Allow logic to proceed
         } else {
           return; // Block
         }
      } else {
        return; // Block other steps (0, 3, 4)
      }
    }

    const isActive = currentSegments[digitIndex][segmentIndex];
    const newSegments = currentSegments.map(d => [...d]);

    if (isActive) {
      // Remove stick -> add to hand
      newSegments[digitIndex][segmentIndex] = false;
      setHand(h => h + 1);
      setCurrentSegments(newSegments);
      if (isTutorialActive && tutorialStep === 1) {
        setTutorialStep(2);
      }
    } else {
      // Add stick -> remove from hand
      if (hand > 0) {
        newSegments[digitIndex][segmentIndex] = true;
        setHand(h => h - 1);
        setCurrentSegments(newSegments);
        if (isTutorialActive && tutorialStep === 2) {
            setTutorialStep(3);
        }
      } else {
        setMessage("No sticks in hand!");
        setMessageType('error');
        setTimeout(() => setMessage(''), 2000);
      }
    }
  };

  const submitRound = () => {
    if (gameOver || isProcessing) return;

    // Tutorial Constraint
    if (isTutorialActive) {
        if (tutorialStep !== 3) return;
    }

    if (hand !== 0) {
      setMessage("You must use all sticks!");
      setMessageType('error');
      setBoardStatus('error');
      setTimeout(() => {
          setBoardStatus('neutral');
          setMessage('');
      }, 1500);
      return;
    }

    const num = isValidNumber(currentSegments);
    if (num === -1) {
      setMessage("Not a valid number!");
      setMessageType('error');
      setBoardStatus('error');
      setTimeout(() => {
          setBoardStatus('neutral');
          setMessage('');
      }, 1500);
      return;
    }

    // Check moves
    const moves = calculateMoves(startSegments, currentSegments);
    if (moves > 3) {
      setMessage(`Too many moves! Used ${moves}, max 3.`);
      setMessageType('error');
      setBoardStatus('error');
      setTimeout(() => {
          setBoardStatus('neutral');
          setMessage('');
      }, 1500);
      return;
    }

    // Check history
    if (history.includes(num)) {
       setMessage(`Number ${num} has already been seen!`);
       setMessageType('error');
       setBoardStatus('error');
       setTimeout(() => {
           setBoardStatus('neutral');
           setMessage('');
       }, 1500);
       return;
    }

    // Success
    setMessage(`Correct! Found ${num}. +${num} points.`);
    setMessageType('success');
    setBoardStatus('success');

    if (isTutorialActive) {
         setTutorialStep(4);
         setBoardStatus('success'); // Keep success status until they click Finish
         return;
    }

    setTimeout(() => {
        const newScore = score + num;
        setScore(newScore);
        setHistory(prev => [...prev, num]);
        setRound(r => r + 1);
        startRound(num);
        setBoardStatus('neutral');
        setMessage('');
    }, 1500);
  };

  const resetConfig = () => {
      if (gameOver || isProcessing) return;
      if (isTutorialActive) return; // Disable reset in tutorial
      setCurrentSegments(startSegments.map(d => [...d]));
      setHand(0);
      setMessage("Reset to current start number.");
      setMessageType('info');
      setTimeout(() => setMessage(''), 2000);
  };

  const finishTutorial = () => {
      setTutorialStep(-1);
      localStorage.setItem('math-sticks-tutorial-v2-seen', 'true');
  };

  const skipTutorial = () => {
      setTutorialStep(-1);
      localStorage.setItem('math-sticks-tutorial-v2-seen', 'true');
  };

  const currentMoveCount = calculateMoves(startSegments, currentSegments);

  const getBoardClass = () => {
      if (gameOver) return 'opacity-50 pointer-events-none';
      if (boardStatus === 'success') return 'bg-green-100 ring-4 ring-green-500 transition-colors duration-300';
      if (boardStatus === 'error') return 'bg-red-100 ring-4 ring-red-500 transition-colors duration-300';
      return 'bg-white transition-colors duration-300';
  };

  const getHighlightedSegment = (digitIdx: number) => {
    if (!isTutorialActive) return null;
    // Tutorial sequence: 6 -> 9
    // 6 is at index 2 (last digit of 006)
    if (digitIdx !== 2) return null;

    if (tutorialStep === 1) return 4; // Pick E (bottom-left)
    if (tutorialStep === 2) return 1; // Place B (top-right)
    return null;
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen relative">
      <Toast message={message} type={messageType} />

      {isTutorialActive && (
        <TutorialOverlay
          step={tutorialStep}
          onStart={() => setTutorialStep(1)}
          onSkip={skipTutorial}
          onFinish={finishTutorial}
        />
      )}

      {gameOver && <GameOverModal score={score} roundsWon={round - 1} onRestart={initGame} />}

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
      <div className={`flex justify-center mb-8 gap-4 p-6 rounded-xl shadow-lg transition-all ${getBoardClass()}`}>
        {currentSegments.map((segs, idx) => (
          <Digit
            key={idx}
            segments={segs}
            onClick={(sIdx) => handleSegmentClick(idx, sIdx)}
            disabled={gameOver || isProcessing}
            highlightedSegment={getHighlightedSegment(idx)}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-8">
            <button
            className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isTutorialActive && tutorialStep === 3 ? 'ring-4 ring-yellow-400 animate-pulse' : ''
            }`}
            onClick={submitRound}
            disabled={hand > 0 || gameOver || isProcessing}
            >
            Submit
            </button>
            <button
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={resetConfig}
            disabled={gameOver || isProcessing || isTutorialActive}
            >
            Reset
            </button>
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
