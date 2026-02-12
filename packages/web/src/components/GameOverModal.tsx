import React from 'react';

interface GameOverModalProps {
  score: number;
  roundsWon: number;
  onRestart: () => void;
  isNewHighScore?: boolean;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ score, roundsWon, onRestart, isNewHighScore }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm w-full transform transition-all scale-100">
        <h2 className="text-3xl font-bold text-red-600 mb-6">Game Over</h2>

        {isNewHighScore && (
          <div className="text-2xl font-bold text-green-600 mb-6 animate-bounce">
            New High Score!
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="text-xl text-gray-700">
            Final Score: <span className="font-bold text-black">{score}</span>
          </div>
          <div className="text-xl text-gray-700">
            Rounds Won: <span className="font-bold text-black">{roundsWon}</span>
          </div>
        </div>
        <button
          onClick={onRestart}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition-colors text-lg"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};
