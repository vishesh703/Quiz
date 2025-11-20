"use client";

import { cn } from "@/lib/utils";

interface CircularTimerProps {
  duration: number;
  currentTime: number;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export function CircularTimer({ duration, currentTime, className, size=60, strokeWidth=5 }: CircularTimerProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = currentTime / duration;
  const offset = circumference * (1 - progress);

  const percentage = Math.floor(progress * 100);
  let colorClass = "stroke-green-500";
  if (percentage < 50) {
    colorClass = "stroke-yellow-500";
  }
  if (percentage < 25) {
    colorClass = "stroke-red-500";
  }

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-muted"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-[stroke-dashoffset] duration-1000 ease-linear", colorClass)}
          fill="transparent"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold font-mono text-foreground">
          {currentTime}
        </span>
      </div>
    </div>
  );
}
