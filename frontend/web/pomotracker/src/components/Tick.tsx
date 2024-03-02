import React from "react";
interface TickProps {
  centerX: number;
  centerY: number;
  radius: number;
  numLines: number;
}
export const Tick: React.FC<TickProps> = ({
  centerX,
  centerY,
  radius,
  numLines,
}) => {
  const lines: JSX.Element[] = [];
  for (let i = 0; i < numLines; i++) {
    const angle = (i / numLines) * Math.PI; // Only render half of the circle
    const x1 = centerX + radius * Math.cos(angle);
    const y1 = centerY + radius * Math.sin(angle);
    const x2 = centerX + radius * Math.cos(angle + Math.PI / 2); // Perpendicular angle
    const y2 = centerY + radius * Math.sin(angle + Math.PI / 2); // Perpendicular angle
    lines.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" />);
  }

  return (
    <svg width={2 * radius} height={radius}>
      {lines}
      <circle cx={radius} cy={radius} r={radius} fill="none" stroke="black" />
    </svg>
  );
};
