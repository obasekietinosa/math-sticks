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
    // Base classes
    let base = "absolute transition-all duration-100 ease-out cursor-pointer backdrop-blur-sm";

    // Color logic
    let color = "";

    if (active) {
      color = "bg-fg-primary shadow-sm opacity-90"; // Active: Dark ink
    } else {
      // Inactive: Very subtle ghost, barely visible to reduce clutter
      color = "bg-fg-secondary/5";
    }

    // Interaction states
    if (isHighlighted) {
      // Tutorial highlight
      color = "bg-accent-pop animate-pulse z-30 shadow-lg scale-110";
    } else if (active) {
       // Lift effect on hover if active
       if (!disabled) {
         color += " hover:scale-105 hover:shadow-md hover:z-20 hover:bg-fg-primary";
       }
    } else {
       // Hover on inactive
       if (!disabled) {
         color += " hover:bg-fg-secondary/20 hover:z-10";
       }
    }

    return `${base} ${color}`;
  };

  // Dimensions
  const thicknessVal = 0.6; // rem
  const lengthVal = 2.8;    // rem
  // The point depth determines how "pointy" the hexagon is.
  // For a clean join, it should be about half the thickness.
  const pointDepthVal = thicknessVal / 2;

  const getSegmentStyle = (isVertical: boolean) => {
     const thickness = `${thicknessVal}rem`;
     const length = `${lengthVal}rem`;
     const pointDepth = `${pointDepthVal}rem`;

     // Hexagon points - create a sharp, techy feel
     // Horizontal: Points are at Left/Right
     const clipPathH = `polygon(${pointDepth} 0, calc(100% - ${pointDepth}) 0, 100% 50%, calc(100% - ${pointDepth}) 100%, ${pointDepth} 100%, 0 50%)`;

     // Vertical: Points are at Top/Bottom
     const clipPathV = `polygon(50% 0, 100% ${pointDepth}, 100% calc(100% - ${pointDepth}), 50% 100%, 0 calc(100% - ${pointDepth}), 0 ${pointDepth})`;

     const style: React.CSSProperties = {
         clipPath: isVertical ? clipPathV : clipPathH,
         width: isVertical ? thickness : length,
         height: isVertical ? length : thickness,
     };

     return style;
  };

  // Positioning
  // We calculate positions to ensure the tips of the hexagons meet with a tiny gap.
  //
  // Layout Strategy:
  // Horizontal segments (A, G, D) are centered horizontally.
  // Vertical segments (F, B, E, C) are placed at the edges.
  //
  // Vertical segments need to be pushed down/up so their points tuck into the horizontal ones.
  // But since they are hexagons, they just need to neighbor closely.

  // To Center Horizontally: left: (ContainerWidth - SegmentLength) / 2
  // But we use relative offsets.

  // Let's assume a grid.
  // Col 1: Vertical Left (F, E)
  // Col 2: Horizontal (A, G, D) - but actually they span the width
  // Col 3: Vertical Right (B, C)

  // A (Top): Top 0, Left equivalent to thickness/2 (to account for vertical width?)
  // Actually, standard 7-segment:
  // A is top centered.
  // F is top-left.

  // Let's use CSS calc for precision.
  const halfThick = `${thicknessVal / 2}rem`;
  const segLen = `${lengthVal}rem`;

  // Positions
  // 0 (A): Top
  // 1 (B): Top Right
  // 2 (C): Bottom Right
  // 3 (D): Bottom
  // 4 (E): Bottom Left
  // 5 (F): Top Left
  // 6 (G): Middle

  const positions = [
    // A: Top, Centered horizontally between the verticals
    // Left needs to be shifted by thicknessVal/2 roughly?
    // Let's just use absolute centering for horizontals and side anchoring for verticals.

    { id: 0, style: { top: '0', left: halfThick, width: segLen } , vertical: false },

    { id: 1, style: { top: halfThick, right: '0', height: segLen }, vertical: true },

    { id: 2, style: { bottom: halfThick, right: '0', height: segLen }, vertical: true },

    { id: 3, style: { bottom: '0', left: halfThick, width: segLen }, vertical: false },

    { id: 4, style: { bottom: halfThick, left: '0', height: segLen }, vertical: true },

    { id: 5, style: { top: halfThick, left: '0', height: segLen }, vertical: true },

    // G: Middle.
    // Top should be: top offset + length/2? No.
    // It should be exactly in the center of the container height.
    { id: 6, style: { top: `calc(50% - ${halfThick})`, left: halfThick, width: segLen }, vertical: false },
  ];

  // Calculate Container Size
  // Width = Length (Horizontal) + Thickness (Vertical)?
  // No, usually Horizontal fits *between* verticals or overlaps.
  // If we overlap: Width = Length.
  // If Vertical sits on side: Width = Length + Thickness.
  // Based on positions above:
  // F is at left 0. Width is Thickness.
  // A is at left HalfThick. Width is Length.
  // B is at Right 0.
  // So Total Width = Length + Thickness (approx).
  // Let's set a fixed container size based on these vals.

  // Total Width ≈ 2.8 + 0.6 = 3.4rem
  // Total Height ≈ 2.8 + 2.8 + 0.6 = 6.2rem (approx)

  return (
    <div
      className="relative m-2 select-none transform transition-transform duration-200"
      style={{ width: '3.6rem', height: '6.4rem' }}
    >
      {positions.map((pos, idx) => (
        <div
          key={idx}
          className={`${getSegmentClass(segments[idx], idx === highlightedSegment)}`}
          style={{
            ...getSegmentStyle(pos.vertical),
            ...pos.style, // Apply position overrides
          }}
          onClick={() => !disabled && onClick(idx)}
          data-testid={`segment-${idx}-${segments[idx] ? 'on' : 'off'}`}
        />
      ))}
    </div>
  );
};

export default Digit;
