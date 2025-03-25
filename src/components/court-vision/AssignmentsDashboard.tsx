
import React, { useState } from "react";
import { Clock, Layers, User, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourtProps, PersonData, Program } from "./types";
import { PERSON_TYPES } from "./constants";

export interface AssignmentsDashboardProps {
  courts: CourtProps[];
  people: PersonData[];
  programs: Program[];
  onChangeTimeSlot: (personId: string, timeSlot: string) => void;
  onChangeCourt: (personId: string, courtId: string) => void;
  onRemovePerson: (personId: string, timeSlot?: string) => void;
}

export function AssignmentsDashboard({ 
  courts, 
  people,
  programs, 
  onChangeTimeSlot, 
  onChangeCourt, 
  onRemovePerson 
}: AssignmentsDashboardProps) {
  const [filter, setFilter] = useState<"all" | "today">("today");
  
  // Get all assigned people
  const assignedPeople = courts.flatMap(court => court.occupants);
  
  // Filter by today if needed
  const filteredAssignments = filter === "today" 
    ? assignedPeople.filter(person => {
        const today = new Date().toISOString().split('T')[0];
        return person.date === today;
      })
    : assignedPeople;
  
  const getCourtName = (courtId: string) => {
    const court = courts.find(c => c.id === courtId);
    return court ? `${court.name} #${court.number}` : "Unknown";
  };
  
  // Group by court
  const assignmentsByCourtId: Record<string, PersonData[]> = {};
  filteredAssignments.forEach(person => {
    if (person.courtId) {
      if (!assignmentsByCourtId[person.courtId]) {
        assignmentsByCourtId[person.courtId] = [];
      }
      assignmentsByCourtId[person.courtId].push(person);
    }
  });
  
  // Sort by time slot
  Object.keys(assignmentsByCourtId).forEach(courtId => {
    assignmentsByCourtId[courtId].sort((a, b) => {
      const timeA = a.timeSlot || "";
      const timeB = b.timeSlot || "";
      return timeA.localeCompare(timeB);
    });
  });
  
  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium flex items-center">
          <User className="h-4 w-4 mr-2" /> Assegnazioni
        </h2>
        <Select defaultValue={filter} onValueChange={(value) => setFilter(value as "all" | "today")}>
          <SelectTrigger className="w-32 h-7 text-xs">
            <SelectValue placeholder="Filtra" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Oggi</SelectItem>
            <SelectItem value="all">Tutte</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {Object.keys(assignmentsByCourtId).length > 0 ? (
        <div className="space-y-4 max-h-[180px] overflow-y-auto">
          {Object.entries(assignmentsByCourtId).map(([courtId, people]) => (
            <div key={courtId} className="space-y-1">
              <h3 className="text-xs font-medium flex items-center">
                <Layers className="h-3 w-3 mr-1" />
                {getCourtName(courtId)}
              </h3>
              
              {people.map((person) => (
                <div 
                  key={`${person.id}-${person.timeSlot}`} 
                  className="flex items-center justify-between rounded bg-gray-50 p-1.5 text-sm"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-6 h-6 rounded-full mr-2 flex items-center justify-center text-white text-xs"
                      style={{ 
                        backgroundColor: person.programColor || (person.type === PERSON_TYPES.PLAYER 
                          ? "#8B5CF6" 
                          : "#1A1F2C"
                        ) 
                      }}
                    >
                      {person.name.substring(0, 2)}
                    </div>
                    <span className="font-medium">{person.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {person.timeSlot && (
                      <Select 
                        value={person.timeSlot}
                        onValueChange={(value) => onChangeTimeSlot(person.id, value)}
                      >
                        <SelectTrigger className="h-6 w-auto min-w-[70px] text-xs bg-gray-100">
                          <Clock className="h-3 w-3 mr-1" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
                            "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"].map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    <Select 
                      value={person.courtId}
                      onValueChange={(value) => onChangeCourt(person.id, value)}
                    >
                      <SelectTrigger className="h-6 w-auto min-w-[90px] text-xs bg-gray-100">
                        <Layers className="h-3 w-3 mr-1" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {courts.map((court) => (
                          <SelectItem key={court.id} value={court.id}>
                            {court.name} #{court.number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <button
                      className="p-1 rounded hover:bg-gray-200"
                      onClick={() => onRemovePerson(person.id, person.timeSlot)}
                      title="Rimuovi"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-sm italic">Nessuna assegnazione trovata</div>
      )}
    </div>
  );
}
