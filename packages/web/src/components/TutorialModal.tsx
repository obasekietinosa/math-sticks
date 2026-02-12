import React, { useState } from 'react';

interface TutorialModalProps {
  onClose: () => void;
}

const steps = [
  {
    title: "Welcome to Math Sticks!",
    description: "The goal of the game is to discover new valid numbers by moving matchsticks.",
  },
  {
    title: "Moving Sticks",
    description: "Click on a stick (highlighted) to pick it up. Click on an empty segment (gray) to place it. You must use all sticks in your hand before submitting.",
  },
  {
    title: "Move Cost",
    description: "Each move costs points. Try to find the number with the fewest moves possible. The maximum moves allowed per round is 3.",
  },
  {
    title: "The Timer",
    description: "You have 45 seconds to find a valid number. If the timer runs out, the game ends.",
  },
  {
    title: "Unique Numbers",
    description: "Each round, you must find a *new* number. You cannot reuse numbers you've already found in the current game.",
  },
];

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-lg w-full transform transition-all scale-100 relative">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">{step.title}</h2>

        <div className="mb-8 min-h-[100px] flex items-center justify-center">
          <p className="text-xl text-gray-700 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center mt-8">
            <button
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700 font-semibold px-4 py-2 transition-colors"
            >
                Skip Tutorial
            </button>

            <div className="flex gap-4">
                <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className={`px-6 py-2 rounded-lg font-bold transition-colors ${
                        currentStep === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition-colors"
                >
                    {currentStep === steps.length - 1 ? 'Start Game' : 'Next'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
