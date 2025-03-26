
import { getProgramColor } from "../utils/programUtils";

interface PlayerAvatarProps {
  name: string;
  program?: string;
}

export function PlayerAvatar({ name, program }: PlayerAvatarProps) {
  const programColor = getProgramColor(program);
  
  return (
    <div 
      className="h-8 w-8 rounded-full flex items-center justify-center text-white mr-2"
      style={{ backgroundColor: programColor }}
    >
      {name.substring(0, 1).toUpperCase()}
    </div>
  );
}
