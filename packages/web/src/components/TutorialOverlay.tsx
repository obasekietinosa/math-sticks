import React from 'react';

interface TutorialOverlayProps {
  step: number;
  onStart: () => void;
  onSkip: () => void;
  onFinish: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ step, onStart, onSkip, onFinish }) => {
  if (step === 0) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm w-full">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Welcome to Math Sticks!</h2>
          <p className="text-gray-600 mb-8">
            Learn how to discover new numbers by moving matchsticks.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={onStart}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition-colors text-lg"
            >
              Start Tutorial
            </button>
            <button
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700 font-semibold transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full">
          <h2 className="text-3xl font-bold text-green-600 mb-4">Tutorial Complete!</h2>
          <div className="text-left bg-gray-50 p-4 rounded-lg mb-6 text-sm text-gray-700 space-y-2">
            <p className="font-semibold">Game Rules:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>You have <strong>45 seconds</strong> per round.</li>
              <li>Find a <strong>unique number</strong> each round.</li>
              <li>Moves cost points! Try to use fewer moves.</li>
              <li>You must use <strong>all sticks</strong> in your hand.</li>
            </ul>
          </div>
          <button
            onClick={onFinish}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition-colors text-lg"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  // Steps 1, 2, 3: Interactive Banners
  let instruction = "";
  if (step === 1) instruction = "Click the highlighted stick to pick it up.";
  if (step === 2) instruction = "Click the highlighted empty spot to place the stick.";
  if (step === 3) instruction = "Click Submit to check your answer.";

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-8 py-4 rounded-full shadow-xl z-40 animate-bounce-slight text-lg font-bold pointer-events-none text-center w-11/12 max-w-md">
      {instruction}
    </div>
  );
};
