
import React from "react";
import { format } from "date-fns";
import { CourtProps, PersonData } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Users } from "lucide-react";

interface CoachScheduleTemplateProps {
  coach: PersonData;
  date: Date;
  courts: CourtProps[];
  timeSlots: string[];
}

export function CoachScheduleTemplate({ coach, date, courts, timeSlots }: CoachScheduleTemplateProps) {
  // Trova tutti i campi dove il coach è assegnato
  const coachAssignments = React.useMemo(() => {
    const assignments: {
      courtId: string;
      courtName: string;
      courtNumber: number;
      courtType: string;
      timeSlot: string;
      players: PersonData[];
    }[] = [];

    courts.forEach(court => {
      court.occupants.forEach(occupant => {
        if (occupant.id === coach.id && occupant.timeSlot) {
          const players = court.occupants.filter(
            p => p.type === "player" && p.timeSlot === occupant.timeSlot
          );
          
          assignments.push({
            courtId: court.id,
            courtName: court.name,
            courtNumber: court.number,
            courtType: court.type,
            timeSlot: occupant.timeSlot,
            players
          });
        }
      });
    });

    // Ordina per fascia oraria
    return assignments.sort((a, b) => {
      const timeA = a.timeSlot.split(":").map(Number);
      const timeB = b.timeSlot.split(":").map(Number);
      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
    });
  }, [coach, courts]);

  // Calcola le ore totali di lavoro
  const totalHours = coachAssignments.length;

  if (coachAssignments.length === 0) {
    return (
      <Card className="bg-white shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg font-semibold flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-gray-500" />
            Programmazione Coach {coach.name} - {format(date, "dd/MM/yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40 text-gray-500">
            Nessuna lezione programmata per questa data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <div className="flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-gray-500" />
            Programmazione Coach {coach.name} - {format(date, "dd/MM/yyyy")}
          </div>
          <Badge variant="secondary" className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Ore totali: {totalHours}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {coachAssignments.map((assignment, index) => (
            <div key={index} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-lg">
                    Ore {assignment.timeSlot}
                  </h3>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Badge 
                      className="mr-2" 
                      variant="outline"
                      style={{
                        backgroundColor: 
                          assignment.courtType === "clay" ? "#e57373" : 
                          assignment.courtType === "hard" ? "#64b5f6" : 
                          assignment.courtType === "grass" ? "#81c784" : 
                          assignment.courtType === "carpet" ? "#9575cd" : "#e0e0e0"
                      }}
                    >
                      {assignment.courtType}
                    </Badge>
                    Campo {assignment.courtName} #{assignment.courtNumber}
                  </p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Durata:</span> 1 ora
                </div>
              </div>

              {assignment.players.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 flex items-center mb-1">
                    <Users className="h-4 w-4 mr-1 text-gray-500" />
                    Allievi ({assignment.players.length}):
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {assignment.players.map(player => (
                      <Badge key={player.id} variant="outline" className="text-sm">
                        {player.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
