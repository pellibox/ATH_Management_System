
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";
import { ExtraActivity } from "@/types/extra-activities";
import { usePlayerContext } from "@/contexts/player/PlayerContext";

interface ActivityRegistrationProps {
  playerId: string;
  playerName: string;
}

export function ActivityRegistration({ playerId, playerName }: ActivityRegistrationProps) {
  const {
    extraActivities,
    selectedActivities,
    setSelectedActivities,
    handleRegisterForActivities
  } = usePlayerContext();
  
  const [activities, setActivities] = useState<ExtraActivity[]>(extraActivities || []);

  const handleToggleActivity = (activityId: string) => {
    setSelectedActivities(
      selectedActivities.includes(activityId)
        ? selectedActivities.filter(id => id !== activityId)
        : [...selectedActivities, activityId]
    );
  };

  const handleRegister = () => {
    if (selectedActivities.length > 0) {
      handleRegisterForActivities(playerId);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Registra Attività per {playerName}</h2>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Seleziona le attività a cui registrare il giocatore:
        </p>

        {activities && activities.length > 0 ? (
          <div className="space-y-2">
            {activities.map(activity => (
              <div 
                key={activity.id}
                className={`p-3 border rounded-lg cursor-pointer flex items-center justify-between ${
                  selectedActivities.includes(activity.id) 
                    ? 'bg-blue-50 border-blue-300' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleToggleActivity(activity.id)}
              >
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}, {activity.startTime} - {activity.endTime}
                    </p>
                  </div>
                </div>
                {selectedActivities.includes(activity.id) && (
                  <X className="h-4 w-4 text-blue-500" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nessuna attività disponibile al momento</p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Annulla</Button>
        <Button 
          onClick={handleRegister}
          disabled={selectedActivities.length === 0}
        >
          Registra
        </Button>
      </div>
    </div>
  );
}
