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
    let base = "absolute transition-all duration-100 ease-out cursor-pointer backdrop-blur-sm";

    let color = active
      ? "bg-fg-primary shadow-sm opacity-90" // Active: Dark ink
      : "bg-fg-secondary/10";      // Inactive: Ghost

    if (isHighlighted) {
      // Tutorial highlight
      color = "bg-accent-pop animate-pulse z-20 shadow-lg scale-110";
    } else if (active) {
       // Lift effect on hover if active
       color += " hover:scale-110 hover:shadow-md hover:z-10 hover:bg-fg-primary";
    } else {
       // Hover on inactive
       color += " hover:bg-fg-secondary/30";
    }

    return `${base} ${color}`;
  };

  const getSegmentStyle = (isVertical: boolean) => {
     const thickness = '0.8rem';
     const length = '3.5rem';

     // Hexagon points - create a sharp, techy feel
     const pointDepth = '8px';
     const clipPathH = `polygon(${pointDepth} 0, calc(100% - ${pointDepth}) 0, 100% 50%, calc(100% - ${pointDepth}) 100%, ${pointDepth} 100%, 0 50%)`;
     const clipPathV = `polygon(50% 0, 100% ${pointDepth}, 100% calc(100% - ${pointDepth}), 50% 100%, 0 calc(100% - ${pointDepth}), 0 ${pointDepth})`;

     const style: React.CSSProperties = {
         clipPath: isVertical ? clipPathV : clipPathH,
         width: isVertical ? thickness : length,
         height: isVertical ? length : thickness,
     };

     return style;
  };

  // Positions tuned for the elongated hexagon shape to create a tight grid
  const positions = [
    { id: 0, class: 'top-0 left-1.5', vertical: false },        // a
    { id: 1, class: 'top-1.5 right-0', vertical: true },        // b
    { id: 2, class: 'bottom-1.5 right-0', vertical: true },     // c
    { id: 3, class: 'bottom-0 left-1.5', vertical: false },     // d
    { id: 4, class: 'bottom-1.5 left-0', vertical: true },      // e
    { id: 5, class: 'top-1.5 left-0', vertical: true },         // f
    { id: 6, class: 'top-1/2 -mt-[0.4rem] left-1.5', vertical: false }, // g (mt is half thickness)
  ];

  return (
    <div className="relative w-20 h-36 m-2 select-none transform transition-transform duration-200">
      {/* Render Inactive Segments (Base) */}
      {/* We render all segments as inactive/active based on state, but the visual "ghost" is handled by the class logic above */}

      {positions.map((pos, idx) => (
        <div
          key={idx}
          className={`${getSegmentClass(segments[idx], idx === highlightedSegment)} ${pos.class}`}
          style={getSegmentStyle(pos.vertical)}
          onClick={() => !disabled && onClick(idx)}
          data-testid={`segment-${idx}-${segments[idx] ? 'on' : 'off'}`}
        />
      ))}
    </div>
  );
};

export default Digit;
