import React from 'react';

interface DigitProps {
  segments: boolean[];
  onClick: (index: number) => void;
  disabled?: boolean;
  highlightedSegment?: number | null;
}

const Digit: React.FC<DigitProps> = ({ segments, onClick, disabled, highlightedSegment }) => {
  // Segments: 0:a, 1:b, 2:c, 3:d, 4:e, 5:f, 6:g

  const getSegmentClass = (active: boolean, isHighlighted: boolean) => {
    const base = "absolute transition-colors duration-200 cursor-pointer rounded-sm";
    let color = active
      ? "bg-orange-500 hover:bg-orange-400"
      : "bg-gray-200 hover:bg-gray-300";

    if (isHighlighted) {
      color += " ring-4 ring-yellow-400 animate-pulse z-10";
    }

    return `${base} ${color}`;
  };

  const getSizeStyle = (isVertical: boolean) => ({
    width: isVertical ? '0.5rem' : '4rem',
    height: isVertical ? '4rem' : '0.5rem',
  });

  const positions = [
    { id: 0, class: 'top-0 left-2 right-2', vertical: false }, // a
    { id: 1, class: 'top-2 right-0', vertical: true },        // b
    { id: 2, class: 'bottom-2 right-0', vertical: true },     // c
    { id: 3, class: 'bottom-0 left-2 right-2', vertical: false }, // d
    { id: 4, class: 'bottom-2 left-0', vertical: true },      // e
    { id: 5, class: 'top-2 left-0', vertical: true },         // f
    { id: 6, class: 'top-1/2 -mt-1 left-2 right-2', vertical: false }, // g
  ];

  return (
    <div className="relative w-20 h-40 m-2 select-none bg-gray-50 border border-gray-100">
      {positions.map((pos, idx) => (
        <div
          key={idx}
          className={`${getSegmentClass(segments[idx], idx === highlightedSegment)} ${pos.class}`}
          style={getSizeStyle(pos.vertical)}
          onClick={() => !disabled && onClick(idx)}
          data-testid={`segment-${idx}-${segments[idx] ? 'on' : 'off'}`}
        />
      ))}
    </div>
  );
};

export default Digit;
