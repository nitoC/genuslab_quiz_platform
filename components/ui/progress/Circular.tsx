import React from "react";

interface CircularProgressProps {
  size?: number; // Total diameter of the ring
  strokeWidth?: number; // Thickness of the ring
  percentage: number; // Progress (0 to 100)
  color?: string; // Tailwind text color class (e.g., 'text-blue-500')
  children?: React.ReactNode; // Content to display in the center
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 100,
  strokeWidth = 8,
  percentage,
  color = "text-blue-500",
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Offset calculation: empty part of the ring
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90" // Start progress from the top
      >
        {/* Background Track Ring */}
        <circle
          className="text-gray-800"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Foreground Ring */}
        <circle
          className={`${color} transition-all duration-500 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>

      {/* Central Content */}
      <div className="absolute flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default CircularProgress;
