
import React from "react";
import { Clock } from "lucide-react";

interface TimeSlotHeaderProps {
  time: string;
}

export function TimeSlotHeader({ time }: TimeSlotHeaderProps) {
  return (
    <div className="absolute top-0 left-0 p-1 text-xs font-medium text-gray-500 bg-white/80 rounded">
      {time}
    </div>
  );
}
