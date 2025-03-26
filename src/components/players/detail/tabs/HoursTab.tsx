
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Player } from "@/types/player";
import { useEffect, useState } from "react";

interface HoursTabProps {
  player: Player;
  isEditing: boolean;
  handleInputChange: (field: keyof Player, value: any) => void;
  playerActivities: any[];
}

interface ProgramDetails {
  weeks: number;
  sessionsPerWeek: number;
  hoursPerSession: number;
}

export function HoursTab({ player, isEditing, handleInputChange, playerActivities }: HoursTabProps) {
  const [programHours, setProgramHours] = useState(0);
  const [remainingHours, setRemainingHours] = useState(0);
  
  // Define program details map
  const programDetailsMap: Record<string, ProgramDetails> = {
    "Junior Excellence": { weeks: 40, sessionsPerWeek: 3, hoursPerSession: 1 },
    "Elite Performance": { weeks: 40, sessionsPerWeek: 5, hoursPerSession: 1.5 },
    "Foundation": { weeks: 30, sessionsPerWeek: 2, hoursPerSession: 1 },
    "Pro Circuit": { weeks: 48, sessionsPerWeek: 6, hoursPerSession: 2 },
  };
  
  useEffect(() => {
    // Calculate total program hours based on program details
    if (player.program && programDetailsMap[player.program]) {
      const details = programDetailsMap[player.program];
      const totalHours = details.weeks * details.sessionsPerWeek * details.hoursPerSession;
      
      // Calculate remaining hours by subtracting completed hours
      const completedHours = player.completedHours || 0;
      
      setProgramHours(totalHours);
      setRemainingHours(totalHours - completedHours);
    } else {
      setProgramHours(0);
      setRemainingHours(0);
    }
  }, [player.program, player.completedHours]);

  const hoursProgress = programHours > 0 ? ((programHours - remainingHours) / programHours) * 100 : 0;

  return (
    <CardContent className="p-4 pt-2">
      <div className="space-y-5">
        <div>
          <h3 className="text-base font-medium">Attività Programma</h3>
          <p className="text-sm text-gray-500">Monitoraggio delle ore di attività completate</p>
          {player.program && programDetailsMap[player.program] && (
            <div className="mt-1 text-sm text-gray-600">
              <p>
                Programma: <span className="font-medium">{player.program}</span> - 
                {programDetailsMap[player.program].weeks} settimane, 
                {programDetailsMap[player.program].sessionsPerWeek} sessioni/sett., 
                {programDetailsMap[player.program].hoursPerSession} ore/sessione
              </p>
            </div>
          )}
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
