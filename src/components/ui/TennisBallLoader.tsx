
import React from "react";

interface TennisBallLoaderProps {
  size?: number;
  text?: string;
  textColor?: string;
}

export function TennisBallLoader({
  size = 80,
  text = "Caricamento ATH Management System...",
  textColor = "#558B2F"
}: TennisBallLoaderProps) {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-center flex flex-col items-center">
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 100 100" 
          className="filter drop-shadow-md"
          style={{ animation: "spin 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite" }}
        >
          <defs>
            <radialGradient id="ballGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{ stopColor: "#8BC34A", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#4CAF50", stopOpacity: 0.9 }} />
            </radialGradient>
          </defs>
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="url(#ballGradient)" 
            stroke="#558B2F" 
            strokeWidth="3"
            style={{ transition: "all 0.3s ease" }}
          />
          <path 
            d="M50 5 
               Q30 25, 50 45 
               Q70 25, 50 5" 
            fill="white" 
            stroke="#558B2F" 
            strokeWidth="2"
            style={{ opacity: 0.8 }}
          />
          <path 
            d="M50 5 
               Q40 15, 50 25 
               Q60 15, 50 5" 
            fill="white" 
            stroke="#FFFFFF" 
            strokeWidth="1"
            style={{ opacity: 0.5 }}
          />
        </svg>
        <p 
          className="mt-5 font-semibold tracking-wide"
          style={{ color: textColor }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
