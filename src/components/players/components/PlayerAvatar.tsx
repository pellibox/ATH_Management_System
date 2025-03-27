
import React from "react";
import { getProgramColor } from "../utils/programUtils";

interface PlayerAvatarProps {
  name: string;
  program?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PlayerAvatar({ name, program, size = 'md' }: PlayerAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8 text-xs';
      case 'lg':
        return 'h-12 w-12 text-lg';
      case 'md':
      default:
        return 'h-10 w-10 text-sm';
    }
  };
  
  const bgColor = program ? getProgramColor(program) : '#64748b';
  
  return (
    <div 
      className={`${getSizeClasses()} rounded-full flex items-center justify-center mr-3 text-white font-medium`}
      style={{ backgroundColor: bgColor }}
    >
      {getInitials(name)}
    </div>
  );
}
