
import React from "react";
import { format } from "date-fns";
import { CourtProps, PersonData } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users, UserCircle, Clock } from "lucide-react";

interface PlayerScheduleTemplateProps {
  player: PersonData;
  date: Date;
  courts: CourtProps[];
  timeSlots: string[];
}

export function PlayerScheduleTemplate({ player, date, courts, timeSlots }: PlayerScheduleTemplateProps) {
  // Trova tutti i campi dove il giocatore è assegnato
  const playerAssignments = React.useMemo(() => {
    const assignments: {
      courtId: string;
      courtName: string;
      courtNumber: number;
      courtType: string;
      timeSlot: string;
      coaches: PersonData[];
      otherPlayers: PersonData[];
    }[] = [];

    courts.forEach(court => {
      court.occupants.forEach(occupant => {
        if (occupant.id === player.id && occupant.timeSlot) {
          const coaches = court.occupants.filter(
            p => p.type === "coach" && p.timeSlot === occupant.timeSlot
          );
          
          const otherPlayers = court.occupants.filter(
            p => p.id !== player.id && p.type === "player" && p.timeSlot === occupant.timeSlot
          );
          
          assignments.push({
            courtId: court.id,
            courtName: court.name,
            courtNumber: court.number,
            courtType: court.type,
            timeSlot: occupant.timeSlot,
            coaches,
            otherPlayers
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
  }, [player, courts]);

  // Get player program color
  const getPlayerProgramColor = () => {
    if (player.programColor && typeof player.programColor === 'string') {
      return player.programColor;
    }
    return "#3b82f6"; // Default blue
  };

  // Function to handle court type coloring
  const getCourtTypeColor = (courtType: string) => {
    if (courtType.includes("Clay")) return "#e57373";
    if (courtType.includes("Hard")) return "#64b5f6";
    if (courtType.includes("Grass")) return "#81c784";
    if (courtType.includes("Padel")) return "#9575cd";
    return "#e0e0e0";
  };

  // Function to get style for player badges
  const getPersonBadgeStyle = (person: PersonData) => {
    if (person.programColor && typeof person.programColor === 'string') {
      return {
        backgroundColor: `${person.programColor}20`,
        color: person.programColor,
        borderColor: person.programColor
      };
    }
    return person.type === "player" ? 
      { backgroundColor: "#3b82f620", color: "#3b82f6", borderColor: "#3b82f6" } : 
      { backgroundColor: "#ef444420", color: "#ef4444", borderColor: "#ef4444" };
  };

  if (playerAssignments.length === 0) {
    return (
      <Card className="bg-white shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg font-semibold flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-gray-500" />
            Programmazione {player.name} - {format(date, "dd/MM/yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40 text-gray-500">
            Nessun allenamento programmato per questa data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-md">
      <CardHeader 
        className="border-b" 
        style={{ 
          backgroundColor: `${getPlayerProgramColor()}20` // Using 20% opacity of program color
        }}
      >
        <CardTitle className="text-lg font-semibold flex items-center">
          <div 
            className="w-6 h-6 rounded-full mr-2 flex items-center justify-center text-white text-xs"
            style={{ backgroundColor: getPlayerProgramColor() }}
          >
            {player.name.substring(0, 1).toUpperCase()}
          </div>
          Programmazione {player.name} - {format(date, "dd/MM/yyyy")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {playerAssignments.map((assignment, index) => (
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
                        backgroundColor: getCourtTypeColor(assignment.courtType),
                        color: "white"
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

              {assignment.coaches.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center mb-1">
                    <UserCircle className="h-4 w-4 mr-1 text-gray-500" />
                    Coach:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {assignment.coaches.map(coach => (
                      <Badge 
                        key={coach.id} 
                        variant="secondary" 
                        className="text-sm"
                        style={getPersonBadgeStyle(coach)}
                      >
                        {coach.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {assignment.otherPlayers.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 flex items-center mb-1">
                    <Users className="h-4 w-4 mr-1 text-gray-500" />
                    Altri Giocatori:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {assignment.otherPlayers.map(otherPlayer => (
                      <Badge 
                        key={otherPlayer.id} 
                        variant="outline" 
                        className="text-sm"
                        style={getPersonBadgeStyle(otherPlayer)}
                      >
                        {otherPlayer.name}
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
