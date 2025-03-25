
import React, { useState } from "react";
import { PersonData, ActivityData, CourtProps } from "./types";
import { ChevronUp, ChevronDown, User, Clock, Layers } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PERSON_TYPES } from "./constants";

interface AssignmentsDashboardProps {
  courts: CourtProps[];
  selectedDate: Date;
}

export function AssignmentsDashboard({ courts, selectedDate }: AssignmentsDashboardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const allAssignedPeople = courts.flatMap(court => 
    court.occupants.map(person => ({
      ...person,
      courtName: court.name,
      courtNumber: court.number
    }))
  ).sort((a, b) => {
    // Sort by time slot first
    if (a.timeSlot && b.timeSlot) {
      return a.timeSlot.localeCompare(b.timeSlot);
    }
    if (a.timeSlot) return -1;
    if (b.timeSlot) return 1;
    
    // Then by court
    if (a.courtName !== b.courtName) {
      return a.courtName.localeCompare(b.courtName);
    }
    
    // Then by court number
    return a.courtNumber - b.courtNumber;
  });

  if (allAssignedPeople.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-md p-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium flex items-center">
            <User aria-hidden="true" className="h-5 w-5 mr-2" />
            Riepilogo Assegnazioni
          </h2>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:text-gray-700"
            aria-label={isCollapsed ? "Espandi riepilogo" : "Comprimi riepilogo"}
          >
            {isCollapsed ? <ChevronDown aria-hidden="true" /> : <ChevronUp aria-hidden="true" />}
          </button>
        </div>
        
        {!isCollapsed && (
          <div className="mt-4 text-gray-500 text-center">
            Nessuna persona assegnata per oggi.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium flex items-center">
          <User aria-hidden="true" className="h-5 w-5 mr-2" />
          Riepilogo Assegnazioni ({allAssignedPeople.length})
        </h2>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-500 hover:text-gray-700"
          aria-label={isCollapsed ? "Espandi riepilogo" : "Comprimi riepilogo"}
        >
          {isCollapsed ? <ChevronDown aria-hidden="true" /> : <ChevronUp aria-hidden="true" />}
        </button>
      </div>
      
      {!isCollapsed && (
        <ScrollArea className="mt-4 h-[200px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Nome</TableHead>
                <TableHead className="w-[100px]">Tipo</TableHead>
                <TableHead className="w-[200px]">Campo</TableHead>
                <TableHead className="w-[120px]">Orario</TableHead>
                <TableHead className="w-[120px]">Durata</TableHead>
                <TableHead className="w-[200px]">Programma</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allAssignedPeople.map((person) => (
                <TableRow key={`${person.id}-${person.timeSlot || 'no-time'}`}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div 
                        className="h-4 w-4 rounded-full mr-2"
                        style={{ backgroundColor: person.programColor || 
                          (person.type === PERSON_TYPES.PLAYER ? "#8B5CF6" : "#1A1F2C") 
                        }}
                      />
                      {person.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {person.type === PERSON_TYPES.PLAYER ? "Giocatore" : "Allenatore"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Layers aria-hidden="true" className="h-4 w-4 mr-1 text-gray-500" />
                      {person.courtName} #{person.courtNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock aria-hidden="true" className="h-4 w-4 mr-1 text-gray-500" />
                      {person.timeSlot || "Non assegnato"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {person.durationHours ? `${person.durationHours} ora/e` : "1 ora"}
                  </TableCell>
                  <TableCell>
                    {person.programId ? (
                      <div 
                        className="px-2 py-1 rounded-full text-xs inline-flex items-center" 
                        style={{ 
                          backgroundColor: `${person.programColor}20` || "#f3f4f6",
                          color: person.programColor || "#374151" 
                        }}
                      >
                        Programma assegnato
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">Nessun programma</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
}
