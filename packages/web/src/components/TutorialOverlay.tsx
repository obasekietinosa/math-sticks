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
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm">
        <div className="bg-surface-paper border-thick rounded-md shadow-card max-w-sm w-full relative overflow-hidden">
            <div className="bg-fg-primary text-bg-main p-4">
                <h2 className="text-xl font-display uppercase tracking-widest">Training Mode</h2>
            </div>
            <div className="p-8 bg-graph-paper text-center">
              <p className="text-fg-secondary font-bold mb-8 uppercase tracking-wide leading-relaxed">
                Learn the logic of the segments. Discover numbers by moving sticks.
              </p>
              <div className="flex flex-col gap-4">
                <button
                  onClick={onStart}
                  className="w-full py-4 text-xl btn-retro btn-retro-action"
                >
                  Initialize Training
                </button>
                <button
                  onClick={onSkip}
                  className="w-full py-2 text-sm uppercase font-bold text-fg-secondary hover:text-fg-primary underline decoration-2 underline-offset-4"
                >
                  Skip Protocol
                </button>
              </div>
            </div>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm">
        <div className="bg-surface-paper border-thick rounded-md shadow-card max-w-md w-full relative overflow-hidden">
            <div className="bg-accent-action text-white p-4">
                <h2 className="text-xl font-display uppercase tracking-widest">Training Complete</h2>
            </div>
            <div className="p-8 bg-graph-paper">
              <div className="text-left bg-white border-2 border-fg-secondary/20 p-4 rounded-sm mb-8 text-sm text-fg-primary space-y-2 font-mono shadow-sm">
                <p className="font-bold uppercase tracking-widest mb-2 border-b-2 border-fg-secondary/10 pb-1">Directives:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Time Limit: <strong>45 Seconds</strong></li>
                  <li>Target: <strong>Unique Number</strong></li>
                  <li>Constraint: <strong>Max 3 Moves</strong></li>
                  <li>Error Recovery: <strong>Reset System</strong></li>
                </ul>
              </div>
              <button
                onClick={onFinish}
                className="w-full py-4 text-xl btn-retro btn-retro-action"
              >
                Start Mission
              </button>
            </div>
        </div>
      </div>
    );
  }

  // Steps 1, 2, 3: Interactive Banners
  let instruction = "";
  if (step === 1) instruction = "Pick up the highlighted stick.";
  if (step === 2) instruction = "Place it in the empty spot.";
  if (step === 3) instruction = "Submit to verify sequence.";

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md z-40 animate-bounce-slight pointer-events-none">
        <div className="bg-fg-primary text-bg-main border-thick shadow-key p-4 text-center">
            <span className="font-display text-xl uppercase tracking-widest block mb-1">Step {step}/3</span>
            <span className="font-bold uppercase text-sm">{instruction}</span>
        </div>
    </div>
  );
};
