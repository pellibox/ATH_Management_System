
import { useState } from "react";
import { 
  Edit, 
  Send, 
  MoreHorizontal,
  Trash,
  User,
  UserCheck,
  Calendar,
  Clock,
  BookOpen
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Player } from "@/types/player";
import { getProgramColor } from "./utils/programUtils";
import { cn } from "@/lib/utils";

interface PlayerRowProps {
  player: Player;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onMessage: (player: Player) => void;
  onSetObjectives: () => void;
  programs: { id: string; name: string; color: string }[];
}

export function PlayerRow({ 
  player, 
  onDelete, 
  onEdit, 
  onMessage, 
  onSetObjectives,
  programs = []
}: PlayerRowProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Find program color
  const programColor = getProgramColor(player.program, programs);
  
  // Calculate completion percentages
  const totalHours = (player.trainingHours || 0) + (player.extraHours || 0);
  const completedPercentage = totalHours > 0 
    ? Math.min(100, Math.round(((player.completedHours || 0) / totalHours) * 100)) 
    : 0;
  
  // Calculate daily limit based on program
  const getDailyLimit = () => {
    if (!player.program) return 2;
    
    // Program-specific daily limits
    const programLimits: Record<string, number> = {
      "perf2": 3,
      "perf3": 4.5,
      "perf4": 6,
      "elite": 7.5,
      "elite-full": 10,
      "junior-sit": 3,
      "junior-sat": 1.5,
    };
    
    return programLimits[player.program] || 2;
  };
  
  // Calculate default duration based on program
  const getDefaultDuration = () => {
    if (!player.program) return 1;
    
    // Program-specific durations
    const programDurations: Record<string, number> = {
      "perf2": 1.5,
      "perf3": 1.5,
      "perf4": 1.5,
      "elite": 1.5,
      "elite-full": 2,
      "junior-sit": 1,
      "junior-sat": 1,
    };
    
    return programDurations[player.program] || 1;
  };
  
  const dailyLimit = getDailyLimit();
  const defaultDuration = getDefaultDuration();

  return (
    <div className={cn(
      "flex items-center p-3 hover:bg-gray-50 border-l-4 rounded-md bg-white relative border mb-2 shadow-sm",
      programColor ? `border-l-[${programColor}]` : "border-l-blue-500"
    )}
    style={{ borderLeftColor: programColor }}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={player.avatar} alt={player.name} />
        <AvatarFallback className="bg-blue-100 text-blue-800">
          {player.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      <div className="ml-4 flex-1 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-2 items-center">
        <div className="sm:col-span-3">
          <div className="font-medium text-gray-900">{player.name}</div>
          <div className="text-xs text-gray-500">{player.email}</div>
        </div>
        
        <div className="sm:col-span-2 flex flex-col">
          <span className="text-xs text-gray-500 flex items-center">
            <UserCheck className="h-3 w-3 mr-1" />
            {player.coach || "Non assegnato"}
          </span>
          <span className="text-xs text-gray-500 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {player.joinDate
              ? formatDistanceToNow(new Date(player.joinDate), { 
                  addSuffix: true,
                  locale: it
                })
              : "N/D"}
          </span>
        </div>
        
        <div className="sm:col-span-2 flex flex-col">
          <div className="flex items-center">
            <Badge variant="outline" className="text-xs h-5">
              {player.level || "N/D"}
            </Badge>
            
            {player.program && (
              <Badge 
                variant="outline" 
                className="ml-1 text-xs h-5"
                style={{ borderColor: programColor, color: programColor }}
              >
                {programs.find(p => p.id === player.program)?.name || player.program}
              </Badge>
            )}
          </div>
          
          {/* Session duration and daily limit */}
          <div className="flex items-center space-x-1 mt-1">
            <Badge 
              variant="outline" 
              className="text-[9px] px-1 py-0 h-4 flex items-center bg-gray-50"
              style={{ borderColor: programColor, color: programColor }}
            >
              <Clock className="h-2.5 w-2.5 mr-0.5" />
              {defaultDuration}h
            </Badge>
            
            <Badge 
              variant="outline" 
              className="text-[9px] px-1 py-0 h-4 flex items-center bg-gray-50 text-gray-700"
            >
              {dailyLimit}h/giorno
            </Badge>
          </div>
        </div>
        
        <div className="sm:col-span-3 flex flex-col">
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${completedPercentage}%` }}
              ></div>
            </div>
            <span className="text-xs whitespace-nowrap">{completedPercentage}%</span>
          </div>
          
          <div className="text-xs text-gray-500 mt-1">
            {player.completedHours || 0}/{totalHours} ore completate
          </div>
        </div>
        
        <div className="sm:col-span-2 flex justify-end space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            title="Obiettivi"
            onClick={onSetObjectives}
          >
            <BookOpen className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            title="Invia messaggio"
            onClick={() => onMessage(player)}
          >
            <Send className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            title="Modifica"
            onClick={() => onEdit(player.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(player.id)}>
                <Edit className="h-4 w-4 mr-2" />
                <span>Modifica</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMessage(player)}>
                <Send className="h-4 w-4 mr-2" />
                <span>Invia messaggio</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => onDelete(player.id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                <span>Elimina</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
