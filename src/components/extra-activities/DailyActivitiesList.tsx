
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { ExtraActivity } from "@/types/extra-activities";
import { ActivityDetails } from "./ActivityDetails";

interface DailyActivitiesListProps {
  activities: ExtraActivity[];
  selectedDate: Date;
  getCoachName: (coachId: string) => string;
  getPlayerName: (playerId: string) => string;
  onDeleteActivity: (activityId: string) => void;
  onEditActivity: (id: string, updatedActivity: Partial<ExtraActivity>) => void;
  onAddParticipant: (activityId: string, participantId: string) => void;
  onRemoveParticipant: (activityId: string, participantId: string) => void;
  playersList: Array<{ id: string; name: string }>;
  coachesList: Array<{ id: string; name: string }>;
}

export function DailyActivitiesList({
  activities,
  selectedDate,
  getCoachName,
  getPlayerName,
  onDeleteActivity,
  onEditActivity,
  onAddParticipant,
  onRemoveParticipant,
  playersList,
  coachesList
}: DailyActivitiesListProps) {
  
  if (activities.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-gray-500" />
          Attività per {format(selectedDate, "EEEE d MMMM yyyy")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map(activity => (
            <ActivityDetails
              key={activity.id}
              activity={activity}
              selectedDate={selectedDate}
              getCoachName={getCoachName}
              getPlayerName={getPlayerName}
              onDelete={onDeleteActivity}
              onEditActivity={onEditActivity}
              onAddParticipant={onAddParticipant}
              onRemoveParticipant={onRemoveParticipant}
              playersList={playersList}
              coachesList={coachesList}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
