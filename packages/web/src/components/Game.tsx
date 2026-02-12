import React, { useState, useEffect, useRef } from 'react';
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

interface HighScore {
  score: number;
  rounds: number;
}

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

  const [highScore, setHighScore] = useState<HighScore>(() => {
    try {
      const stored = localStorage.getItem('math-sticks-highscore');
      return stored ? JSON.parse(stored) : { score: 0, rounds: 0 };
    } catch {
      return { score: 0, rounds: 0 };
    }
  });
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  const hasProcessedGameOver = useRef(false);

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
    setIsNewHighScore(false);
    hasProcessedGameOver.current = false;
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

  useEffect(() => {
    if (gameOver && !hasProcessedGameOver.current) {
      hasProcessedGameOver.current = true;

      const finalScore = score;
      const finalRounds = round - 1;

      // Update Logic: Standard "Best Score" approach + Tie-breaker on rounds
      const isNewBest = finalScore > highScore.score || (finalScore === highScore.score && finalRounds > highScore.rounds);

      if (isNewBest) {
          const newRecord = { score: finalScore, rounds: finalRounds };
          localStorage.setItem('math-sticks-highscore', JSON.stringify(newRecord));
          setHighScore(newRecord);
          setIsNewHighScore(true);
      } else {
          setIsNewHighScore(false);
      }
    }
  }, [gameOver, score, round, highScore]);

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
    let newHand = hand;

    if (isActive) {
      // Remove stick -> add to hand
      newSegments[digitIndex][segmentIndex] = false;
      newHand += 1;
    } else {
      // Add stick -> remove from hand
      if (hand > 0) {
        newSegments[digitIndex][segmentIndex] = true;
        newHand -= 1;
      } else {
        setMessage("No sticks in hand!");
        setMessageType('error');
        setTimeout(() => setMessage(''), 2000);
        return;
      }
    }

    const newMoves = calculateMoves(startSegments, newSegments);
    if (newMoves > 3) {
      setMessage("Maximum 3 moves allowed!");
      setMessageType('error');
      setTimeout(() => setMessage(''), 1500);
      return;
    }

    setHand(newHand);
    setCurrentSegments(newSegments);

    if (isActive) {
      if (isTutorialActive && tutorialStep === 1) {
        setTutorialStep(2);
      }
    } else {
      if (isTutorialActive && tutorialStep === 2) {
          setTutorialStep(3);
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
      setMessage(`Too many moves! Used ${moves}/3. Reset to try again.`);
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
      if (gameOver) return 'opacity-50 pointer-events-none grayscale';
      if (boardStatus === 'success') return 'bg-green-50/50 ring-4 ring-green-500';
      if (boardStatus === 'error') return 'bg-red-50/50 ring-4 ring-accent-pop';
      return '';
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-main p-4 font-body text-fg-primary">
      <Toast message={message} type={messageType} />

      {isTutorialActive && (
        <TutorialOverlay
          step={tutorialStep}
          onStart={() => setTutorialStep(1)}
          onSkip={skipTutorial}
          onFinish={finishTutorial}
        />
      )}

      {gameOver && <GameOverModal score={score} roundsWon={round - 1} onRestart={initGame} isNewHighScore={isNewHighScore} />}

      <div className="w-full max-w-lg">
        {/* Header / Brand */}
        <div className="flex justify-between items-end mb-4">
          <h1 className="text-4xl font-display uppercase tracking-tighter text-fg-primary leading-none">
            Math<br/>Sticks
          </h1>
          <div className="text-right">
             <div className="text-xs font-bold uppercase tracking-widest text-fg-secondary">High Score</div>
             <div className="font-display text-xl leading-none">{highScore.score} PTS</div>
          </div>
        </div>

        {/* Game Container */}
        <div className="bg-surface-paper border-thick rounded-md shadow-card p-6 relative">

          {/* LCD Stats Screen */}
          <div className="bg-surface-screen border-thick rounded-sm mb-6 p-4 relative overflow-hidden shadow-inner">
             <div className="lcd-scanlines absolute inset-0 pointer-events-none z-10"></div>
             <div className="flex justify-between items-end relative z-0 font-display text-fg-primary">
                <div className="flex flex-col">
                   <span className="text-xs font-body opacity-60 uppercase">Score</span>
                   <span className="text-3xl leading-none">{score.toString().padStart(4, '0')}</span>
                </div>
                <div className="flex flex-col items-center">
                   <span className="text-xs font-body opacity-60 uppercase">Round</span>
                   <span className="text-3xl leading-none">{round.toString().padStart(2, '0')}</span>
                </div>
                <div className={`flex flex-col items-end ${timeLeft < 10 ? 'animate-pulse text-red-900' : ''}`}>
                   <span className="text-xs font-body opacity-60 uppercase">Time</span>
                   <span className="text-3xl leading-none">{timeLeft.toString().padStart(2, '0')}s</span>
                </div>
             </div>
          </div>

          {/* Sub-Info Bar */}
          <div className="flex justify-between items-center mb-6 px-2 font-bold text-sm uppercase">
            <div className="flex items-center gap-2">
               <span className="text-fg-secondary">Start:</span>
               <span className="font-display text-xl">{targetNumber.toString().padStart(3, '0')}</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-fg-secondary">Hand:</span>
               <div className="flex gap-1">
                 {Array.from({ length: Math.max(hand, 0) }).map((_, i) => (
                    <div key={i} className="w-1 h-4 bg-fg-primary transform -rotate-12 shadow-sm"></div>
                 ))}
                 {hand === 0 && <span className="text-fg-secondary/50">-</span>}
               </div>
            </div>
          </div>

          {/* Board Area */}
          <div className={`bg-graph-paper border-2 border-fg-primary/10 rounded p-6 mb-8 flex justify-center gap-2 sm:gap-4 transition-all duration-300 relative ${getBoardClass()}`}>
             {/* Board Status Indicator (LED) */}
             <div className={`absolute top-2 right-2 w-3 h-3 rounded-full border-2 border-black/20 ${
                boardStatus === 'neutral' ? 'bg-gray-400' :
                boardStatus === 'success' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' :
                'bg-accent-pop shadow-[0_0_8px_rgba(239,68,68,0.8)]'
             }`}></div>

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
      <div className="flex gap-4 mb-2">
            <button
            className={`flex-1 py-4 text-xl btn-retro btn-retro-action ${
              isTutorialActive && tutorialStep === 3 ? 'ring-4 ring-bg-main animate-pulse' : ''
            }`}
            onClick={submitRound}
            disabled={hand > 0 || gameOver || isProcessing}
            >
            Submit
            </button>
            <button
            className="flex-1 py-4 text-xl btn-retro btn-retro-pop"
            onClick={resetConfig}
            disabled={gameOver || isProcessing || isTutorialActive}
            >
            Reset
            </button>
      </div>

      <div className={`text-center font-bold text-sm uppercase tracking-widest ${currentMoveCount > 3 ? 'text-accent-pop animate-pulse' : 'text-fg-secondary'}`}>
        Moves: {Math.floor(currentMoveCount)} / 3
        {currentMoveCount > 3 && <span className="ml-2 block text-xs">(Reset Required)</span>}
      </div>

     </div> {/* End Game Container */}

      {/* History */}
      <div className="mt-8 w-full">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-fg-secondary">History Log</h3>
           <div className="max-h-32 overflow-y-auto border-thick bg-white p-2 font-display text-lg leading-none shadow-sm flex flex-wrap gap-2">
            {history.length === 0 && <span className="text-fg-secondary/50 text-sm font-body">No numbers found yet...</span>}
            {history.slice().reverse().map((h, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 border border-gray-300">
                    {h.toString().padStart(3, '0')}
                </span>
            ))}
           </div>
      </div>

      </div> {/* End Wrapper */}
    </div>
  );
};

export default Game;
