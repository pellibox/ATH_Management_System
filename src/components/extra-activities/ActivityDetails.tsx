
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Edit, Trash, Users } from "lucide-react";
import { ExtraActivity, ACTIVITY_TYPES } from "@/types/extra-activities";
import { ExtraActivityForm } from "./ExtraActivityForm";

interface ActivityDetailsProps {
  activity: ExtraActivity;
  selectedDate: Date;
  getCoachName: (coachId: string) => string;
  getPlayerName: (playerId: string) => string;
  onDelete: (activityId: string) => void;
  onEditActivity: (id: string, updatedActivity: Partial<ExtraActivity>) => void;
  onAddParticipant: (activityId: string, participantId: string) => void;
  onRemoveParticipant: (activityId: string, participantId: string) => void;
  playersList: Array<{ id: string; name: string }>;
  coachesList: Array<{ id: string; name: string }>;
}

export function ActivityDetails({
  activity,
  selectedDate,
  getCoachName,
  getPlayerName,
  onDelete,
  onEditActivity,
  onAddParticipant,
  onRemoveParticipant,
  playersList,
  coachesList
}: ActivityDetailsProps) {
  return (
    <div key={activity.id} className="rounded-lg border p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium flex items-center">
            <Badge className="mr-2" variant="outline">
              {ACTIVITY_TYPES.find(t => t.id === activity.type)?.name}
            </Badge>
            {activity.name}
          </h3>
          <div className="flex items-center mt-1 text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            {activity.time} - {activity.duration} ore
            <span className="mx-2">•</span>
            <span>{activity.location}</span>
          </div>
          <div className="mt-2 text-sm">
            <p>
              <span className="font-medium">Coach:</span> {getCoachName(activity.coach)}
            </p>
            {activity.notes && (
              <p className="mt-1 text-gray-600">
                <span className="font-medium">Note:</span> {activity.notes}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <ExtraActivityForm
            activityToEdit={activity}
            onEditActivity={onEditActivity}
            coachesList={coachesList}
            buttonLabel=""
            buttonIcon={<Edit className="h-4 w-4" />}
            buttonVariant="ghost"
          />
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => onDelete(activity.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Separator className="my-3" />
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium flex items-center">
            <Users className="h-4 w-4 mr-1 text-gray-500" />
            Partecipanti ({activity.participants.length}/{activity.maxParticipants})
          </h4>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-7 text-xs">Aggiungi</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Aggiungi Partecipanti</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Input placeholder="Cerca giocatori..." className="mb-4" />
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {playersList
                    .filter(player => !activity.participants.includes(player.id))
                    .map(player => (
                      <div key={player.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                        <span>{player.name}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => onAddParticipant(activity.id, player.id)}
                        >
                          Aggiungi
                        </Button>
                      </div>
                    ))
                  }
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {activity.participants.length > 0 ? (
            activity.participants.map(participantId => (
              <Badge key={participantId} variant="secondary" className="flex items-center gap-1">
                {getPlayerName(participantId)}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-4 w-4 ml-1 hover:bg-transparent"
                  onClick={() => onRemoveParticipant(activity.id, participantId)}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </Badge>
            ))
          ) : (
            <span className="text-sm text-gray-500">Nessun partecipante</span>
          )}
        </div>
      </div>
    </div>
  );
}
