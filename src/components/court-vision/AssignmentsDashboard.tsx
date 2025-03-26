
import React from "react";
import { format } from "date-fns";
import { CourtProps } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Clock, Calendar, Users, MapPin, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface AssignmentsDashboardProps {
  courts: CourtProps[];
  selectedDate: Date;
}

export function AssignmentsDashboard({ courts, selectedDate }: AssignmentsDashboardProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Ensure we have a valid Date object
  const displayDate = selectedDate instanceof Date && !isNaN(selectedDate.getTime()) 
    ? selectedDate 
    : new Date();
  
  const handleCourtClick = (courtId: string) => {
    navigate(`/court-vision?courtId=${courtId}&date=${displayDate.toISOString()}`);
  };
  
  const handlePersonClick = (personId: string) => {
    // Determine if person is a player or coach
    const personType = courts.some(court => 
      court.occupants.some(o => o.id === personId && o.type === "coach")
    ) ? "coaches" : "players";
    
    navigate(`/${personType}?id=${personId}`);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold truncate">
          Riepilogo Assegnazioni - {format(displayDate, 'MMMM d, yyyy')}
        </h2>
        <button 
          onClick={() => navigate('/court-vision')}
          className="text-sm flex items-center gap-1 text-ath-blue hover:text-ath-blue-dark"
        >
          <Edit className="h-4 w-4" />
          <span>Modifica Assegnazioni</span>
        </button>
      </div>
      
      {courts.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nessun campo configurato per questa vista</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
          {courts.map(court => (
            <div 
              key={court.id} 
              className="bg-white p-4 rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleCourtClick(court.id)}
            >
              <div className="flex justify-between items-center mb-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="font-medium truncate flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {court.name} #{court.number}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clicca per gestire questo campo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded truncate ml-2 flex-shrink-0">
                  {court.type}
                </span>
              </div>
              
              <div className="overflow-hidden">
                <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>Persone</span>
                </h4>
                {court.occupants.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {court.occupants.map(person => (
                      <TooltipProvider key={person.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span 
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePersonClick(person.id);
                              }}
                              className="text-xs px-2 py-1 rounded bg-ath-blue-light text-ath-blue truncate max-w-full cursor-pointer hover:bg-ath-blue hover:text-white transition-colors"
                            >
                              {person.name} {person.type === "coach" ? "(Coach)" : ""}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Visualizza profilo di {person.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 mb-3">Nessuna persona assegnata</p>
                )}
                
                <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Attività</span>
                </h4>
                {court.activities.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {court.activities.map(activity => (
                      <span 
                        key={activity.id} 
                        className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 truncate max-w-full"
                      >
                        {activity.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Nessuna attività assegnata</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
