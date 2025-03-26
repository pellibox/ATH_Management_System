
import { User, UserCog } from "lucide-react";
import { PERSON_TYPES } from "../constants";
import { PersonData } from "../types";

interface PersonAvatarProps {
  person: PersonData;
  hasProgram: boolean;
  programColor?: string;
}

export function PersonAvatar({ person, hasProgram, programColor }: PersonAvatarProps) {
  return (
    <div 
      className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
        person.type === PERSON_TYPES.PLAYER 
          ? hasProgram 
            ? "bg-gradient-to-r from-ath-blue to-ath-blue-light" 
            : "bg-ath-blue" 
          : "bg-ath-red-clay"
      }`}
      style={programColor ? { backgroundColor: programColor } : {}}
    >
      {person.type === PERSON_TYPES.PLAYER ? (
        <User className="w-4 h-4" />
      ) : (
        <UserCog className="w-4 h-4" />
      )}
    </div>
  );
}
