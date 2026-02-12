import React from 'react';

interface GameOverModalProps {
  score: number;
  roundsWon: number;
  onRestart: () => void;
  isNewHighScore?: boolean;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ score, roundsWon, onRestart, isNewHighScore }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm">
      <div className="bg-surface-paper border-thick rounded-md shadow-card max-w-sm w-full transform transition-all scale-100 overflow-hidden relative">

        {/* Header Bar */}
        <div className="bg-fg-primary text-bg-main p-4 flex justify-between items-center">
            <h2 className="text-2xl font-display uppercase tracking-widest">System Halted</h2>
            <div className="w-3 h-3 bg-accent-pop rounded-full animate-pulse"></div>
        </div>

        <div className="p-8 text-center bg-graph-paper">
            {isNewHighScore && (
            <div className="text-xl font-bold text-accent-action mb-6 animate-bounce uppercase tracking-widest border-2 border-accent-action p-2 rotate-2 bg-white shadow-sm">
                New High Score!
            </div>
            )}

            <div className="space-y-6 mb-8">
            <div className="text-sm text-fg-secondary uppercase font-bold tracking-widest">
                Final Score
                <div className="text-5xl font-display text-fg-primary mt-1">{score.toString().padStart(4, '0')}</div>
            </div>
            <div className="text-sm text-fg-secondary uppercase font-bold tracking-widest">
                Rounds Cleared
                <div className="text-4xl font-display text-fg-primary mt-1">{roundsWon.toString().padStart(2, '0')}</div>
            </div>
            </div>

            <button
            onClick={onRestart}
            className="w-full py-4 text-xl btn-retro btn-retro-action"
            >
            Reboot System
            </button>
        </div>
      </div>
    </div>
  );
};
