
import React from "react";
import { Badge } from "@/components/ui/badge";
import { getProgramColor } from "../utils/programUtils";

interface ProgramBadgeProps {
  program?: string;
}

export function ProgramBadge({ program }: ProgramBadgeProps) {
  if (!program) {
    return (
      <span className="text-gray-500 text-sm">Non assegnato</span>
    );
  }

  const bgColor = getProgramColor(program);
  const bgColorLight = `${bgColor}20`; // Add transparency for background

  return (
    <Badge 
      variant="outline" 
      className="px-2 py-1 font-normal"
      style={{ 
        backgroundColor: bgColorLight,
        borderColor: bgColor,
        color: bgColor
      }}
    >
      {program}
    </Badge>
  );
}
