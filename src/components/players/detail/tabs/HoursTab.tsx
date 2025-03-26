
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

export function HoursTab({ player, isEditing, handleInputChange, playerActivities }: HoursTabProps) {
  // Calculate program hours based on player's program
  const [programHours, setProgramHours] = useState(player.program ? 40 : 0);
  const completedHours = player.completedHours || 0;
  
  useEffect(() => {
    // Update program hours whenever the player's program changes
    if (player.program) {
      // In a real app, you would fetch this from a program database
      // For now, we'll use some hardcoded values based on the program name
      if (player.program === "Junior Excellence") {
        setProgramHours(40);
      } else if (player.program === "Elite Performance") {
        setProgramHours(60);
      } else if (player.program === "Foundation") {
        setProgramHours(30);
      } else if (player.program === "Pro Circuit") {
        setProgramHours(80);
      } else {
        setProgramHours(40); // Default value
      }
    } else {
      setProgramHours(0);
    }
  }, [player.program]);

  const remainingHours = Math.max(0, programHours - completedHours);
  const hoursProgress = programHours > 0 ? (completedHours / programHours) * 100 : 0;

  return (
    <CardContent className="p-4 pt-2">
      <div className="space-y-5">
        <div>
          <h3 className="text-base font-medium">Ore Programma</h3>
          <p className="text-sm text-gray-500">Monitoraggio delle ore completate rispetto al programma</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Ore completate</span>
            {isEditing ? (
              <Input
                type="number"
                value={player.completedHours || 0}
                onChange={(e) => handleInputChange('completedHours', parseInt(e.target.value) || 0)}
                className="h-7 w-24"
              />
            ) : (
              <span className="text-sm font-medium">{completedHours} / {programHours} ore</span>
            )}
          </div>
          <Progress value={hoursProgress} className="h-2" />
          <div className="flex justify-between text-sm">
            <span>Ore rimanenti: <span className="font-medium">{remainingHours}</span></span>
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
                onChange={(e) => handleInputChange('trainingHours', parseInt(e.target.value) || 0)}
                className="h-7 w-full mt-1"
              />
            ) : (
              <p className="font-medium text-lg">{player.trainingHours || 0}</p>
            )}
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-500">Ore Extra</p>
            {isEditing ? (
              <Input
                type="number"
                value={player.extraHours || 0}
                onChange={(e) => handleInputChange('extraHours', parseInt(e.target.value) || 0)}
                className="h-7 w-full mt-1"
              />
            ) : (
              <p className="font-medium text-lg">{player.extraHours || 0}</p>
            )}
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-500">Ore Assenze</p>
            {isEditing ? (
              <Input
                type="number"
                value={player.missedHours || 0}
                onChange={(e) => handleInputChange('missedHours', parseInt(e.target.value) || 0)}
                className="h-7 w-full mt-1"
              />
            ) : (
              <p className="font-medium text-lg">{player.missedHours || 0}</p>
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
