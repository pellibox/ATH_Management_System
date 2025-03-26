
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, RotateCcw } from "lucide-react";
import { Player } from "@/types/player";
import { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { TENNIS_PROGRAMS } from "@/components/court-vision/constants";
import { calculateProgramHours } from "@/types/player/programs";

interface HoursTabProps {
  player: Player;
  isEditing: boolean;
  handleInputChange: (field: keyof Player, value: any) => void;
  playerActivities: any[];
}

export function HoursTab({ player, isEditing, handleInputChange, playerActivities }: HoursTabProps) {
  const [programHours, setProgramHours] = useState(0);
  const [remainingHours, setRemainingHours] = useState(0);
  const [availablePrograms, setAvailablePrograms] = useState<string[]>([]);
  
  // Load all available programs from TENNIS_PROGRAMS
  useEffect(() => {
    const allPrograms: string[] = [];
    
    // Combine all program categories into a single array of program names
    Object.values(TENNIS_PROGRAMS).forEach(categoryPrograms => {
      categoryPrograms.forEach(program => {
        allPrograms.push(program.name);
      });
    });
    
    // Remove duplicates and sort alphabetically
    setAvailablePrograms([...new Set(allPrograms)].sort());
  }, []);
  
  useEffect(() => {
    // Calculate program hours based on the selected program
    if (player.program) {
      // Find the program in all categories
      let programDetails: any = null;
      
      // Search through all program categories
      for (const category in TENNIS_PROGRAMS) {
        const foundProgram = TENNIS_PROGRAMS[category].find(
          p => p.name === player.program
        );
        
        if (foundProgram) {
          programDetails = foundProgram;
          break;
        }
      }
      
      if (programDetails && programDetails.weeklyHours && programDetails.totalWeeks) {
        const totalHours = programDetails.weeklyHours * programDetails.totalWeeks;
        
        // Calculate remaining hours by subtracting completed hours
        const completedHours = player.completedHours || 0;
        
        setProgramHours(totalHours);
        setRemainingHours(totalHours - completedHours);
      } else {
        setProgramHours(0);
        setRemainingHours(0);
      }
    } else {
      setProgramHours(0);
      setRemainingHours(0);
    }
  }, [player.program, player.completedHours]);

  const hoursProgress = programHours > 0 ? ((programHours - remainingHours) / programHours) * 100 : 0;

  // Get program details for the selected program
  const getProgramDetails = (programName: string) => {
    for (const category in TENNIS_PROGRAMS) {
      const program = TENNIS_PROGRAMS[category].find(p => p.name === programName);
      if (program) {
        return {
          weeklyHours: program.weeklyHours,
          totalWeeks: program.totalWeeks
        };
      }
    }
    return null;
  };

  return (
    <CardContent className="p-4 pt-2">
      <div className="space-y-5">
        <div>
          <h3 className="text-base font-medium">Programma e Attività</h3>
          <p className="text-sm text-gray-500">Gestione del programma e monitoraggio delle ore di attività</p>
          
          <div className="mt-3 mb-5">
            <label className="text-sm font-medium block mb-1">Programma</label>
            {isEditing ? (
              <div className="flex gap-2">
                <Select
                  value={player.program || ""}
                  onValueChange={(value) => handleInputChange('program', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleziona un programma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nessun Programma</SelectItem>
                    {availablePrograms.map((program) => (
                      <SelectItem key={program} value={program}>
                        {program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {player.program && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleInputChange('program', '')}
                    title="Rimuovi programma"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-sm">
                {player.program ? (
                  <div className="flex items-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {player.program}
                    </span>
                    {player.program && getProgramDetails(player.program) && (
                      <span className="ml-2 text-gray-600">
                        ({getProgramDetails(player.program)?.totalWeeks} settimane, 
                        {getProgramDetails(player.program)?.weeklyHours} ore/settimana)
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-500">Nessun programma assegnato</span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Ore di attività completate</span>
            {isEditing ? (
              <Input
                type="number"
                value={player.completedHours || 0}
                onChange={(e) => handleInputChange('completedHours', parseFloat(e.target.value) || 0)}
                className="h-7 w-24"
              />
            ) : (
              <span className="text-sm font-medium">{(player.completedHours || 0).toFixed(1)} / {programHours.toFixed(1)} ore</span>
            )}
          </div>
          <Progress value={hoursProgress} className="h-2" />
          <div className="flex justify-between text-sm">
            <span>Ore rimanenti: <span className="font-medium">{remainingHours.toFixed(1)}</span></span>
            <span>Completamento: <span className="font-medium">{Math.round(hoursProgress)}%</span></span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-500">Ore Allenamento</p>
            {isEditing ? (
              <Input
                type="number"
                value={player.trainingHours || 0}
                onChange={(e) => handleInputChange('trainingHours', parseFloat(e.target.value) || 0)}
                className="h-7 w-full mt-1"
              />
            ) : (
              <p className="font-medium text-lg">{(player.trainingHours || 0).toFixed(1)}</p>
            )}
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-500">Ore Extra</p>
            {isEditing ? (
              <Input
                type="number"
                value={player.extraHours || 0}
                onChange={(e) => handleInputChange('extraHours', parseFloat(e.target.value) || 0)}
                className="h-7 w-full mt-1"
              />
            ) : (
              <p className="font-medium text-lg">{(player.extraHours || 0).toFixed(1)}</p>
            )}
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-500">Ore Assenze</p>
            {isEditing ? (
              <Input
                type="number"
                value={player.missedHours || 0}
                onChange={(e) => handleInputChange('missedHours', parseFloat(e.target.value) || 0)}
                className="h-7 w-full mt-1"
              />
            ) : (
              <p className="font-medium text-lg">{(player.missedHours || 0).toFixed(1)}</p>
            )}
          </div>
        </div>
        
        {playerActivities.length > 0 && (
          <div>
            <h3 className="text-base font-medium mb-2">Ultime Attività</h3>
            <div className="space-y-2">
              {playerActivities.slice(0, 5).map(activity => (
                <div key={activity.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{activity.name}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {activity.date} • {activity.duration} ore
                  </div>
                </div>
              ))}
            </div>
            
            {playerActivities.length > 5 && (
              <Button variant="link" className="mt-2 h-auto p-0">
                Vedi tutte ({playerActivities.length})
              </Button>
            )}
          </div>
        )}
      </div>
    </CardContent>
  );
}
