
import React, { useState, useMemo } from "react";
import { PersonData, ActivityData, CourtProps, Program } from "./types";
import { ChevronUp, ChevronDown, User, Clock, Layers, Calendar, AlertTriangle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PERSON_TYPES } from "./constants";

interface AssignmentsDashboardProps {
  courts: CourtProps[];
  selectedDate?: Date;
  programs: Program[];
  onChangeTimeSlot?: (personId: string, timeSlot: string) => void;
  onChangeCourt?: (personId: string, courtId: string) => void;
  onRemovePerson?: (personId: string, timeSlot?: string) => void;
}

const COACH_MAX_HOURS = 8; // Maximum hours a coach should work

export function AssignmentsDashboard({ courts, selectedDate, programs = [], onChangeTimeSlot, onChangeCourt, onRemovePerson }: AssignmentsDashboardProps) {
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

  // Group people by ID to calculate total hours assigned
  const peopleWithHours = useMemo(() => {
    const hoursMap = new Map();
    
    // Calculate hours for each person
    allAssignedPeople.forEach(person => {
      const hours = person.durationHours || 1;
      if (hoursMap.has(person.id)) {
        hoursMap.set(person.id, hoursMap.get(person.id) + hours);
      } else {
        hoursMap.set(person.id, hours);
      }
    });
    
    // Add hours info to people
    return allAssignedPeople.map(person => ({
      ...person,
      hoursAssigned: hoursMap.get(person.id) || 0
    }));
  }, [allAssignedPeople]);

  // Calculate remaining hours for each program
  const programHoursSummary = useMemo(() => {
    const summary = new Map();
    
    // Initialize with all programs
    programs.forEach(program => {
      summary.set(program.id, {
        name: program.name,
        color: program.color,
        weeklyHours: program.weeklyHours || 0,
        assignedHours: 0,
        remainingHours: program.weeklyHours || 0
      });
    });
    
    // Calculate assigned hours by program
    peopleWithHours.forEach(person => {
      if (person.programId && summary.has(person.programId)) {
        const program = summary.get(person.programId);
        program.assignedHours += person.hoursAssigned;
        program.remainingHours = Math.max(0, program.weeklyHours - program.assignedHours);
        summary.set(person.programId, program);
      }
    });
    
    return Array.from(summary.values());
  }, [peopleWithHours, programs]);

  // Group coaches to calculate their hours
  const coachesHours = useMemo(() => {
    const coachesMap = new Map();
    
    peopleWithHours.forEach(person => {
      if (person.type === PERSON_TYPES.COACH) {
        if (!coachesMap.has(person.id)) {
          coachesMap.set(person.id, {
            id: person.id,
            name: person.name,
            totalHours: 0
          });
        }
        
        const coach = coachesMap.get(person.id);
        coach.totalHours += person.durationHours || 1;
        coachesMap.set(person.id, coach);
      }
    });
    
    return Array.from(coachesMap.values());
  }, [peopleWithHours]);

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
        <>
          {/* Programmi e Ore Rimanenti */}
          {programHoursSummary.length > 0 && (
            <div className="mb-4 mt-4 border-b pb-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1" /> 
                Ore Settimanali dei Programmi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {programHoursSummary.map((program, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-2 rounded-md"
                    style={{ backgroundColor: `${program.color}10` }}
                  >
                    <div className="flex items-center">
                      <div 
                        className="h-3 w-3 rounded-full mr-2"
                        style={{ backgroundColor: program.color }}
                      />
                      <span className="text-xs font-medium">{program.name}</span>
                    </div>
                    <div className="text-xs">
                      <span className="mr-1">{program.assignedHours}/{program.weeklyHours}h</span>
                      <span 
                        className={
                          program.remainingHours <= 0 
                            ? "text-red-500 font-medium" 
                            : program.remainingHours <= 2 
                              ? "text-orange-500 font-medium" 
                              : "text-green-500"
                        }
                      >
                        ({program.remainingHours}h rim.)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Carico di Lavoro Maestri */}
          {coachesHours.length > 0 && (
            <div className="mb-4 border-b pb-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <User className="h-4 w-4 mr-1" /> 
                Carico di Lavoro Maestri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {coachesHours.map((coach) => (
                  <div 
                    key={coach.id} 
                    className={`flex items-center justify-between p-2 rounded-md ${
                      coach.totalHours > COACH_MAX_HOURS 
                        ? "bg-red-50" 
                        : coach.totalHours === COACH_MAX_HOURS 
                          ? "bg-orange-50" 
                          : "bg-green-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-gray-800 mr-2" />
                      <span className="text-xs font-medium">{coach.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span 
                        className={`text-xs ${
                          coach.totalHours > COACH_MAX_HOURS 
                            ? "text-red-500 font-medium" 
                            : coach.totalHours === COACH_MAX_HOURS 
                              ? "text-orange-500 font-medium" 
                              : "text-green-500"
                        }`}
                      >
                        {coach.totalHours} ore
                      </span>
                      {coach.totalHours > COACH_MAX_HOURS && (
                        <AlertTriangle 
                          className="h-3 w-3 ml-1 text-red-500" 
                          aria-label="Carico di lavoro eccessivo"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabella delle Assegnazioni */}
          <ScrollArea className="h-[200px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Nome</TableHead>
                  <TableHead className="w-[100px]">Tipo</TableHead>
                  <TableHead className="w-[200px]">Campo</TableHead>
                  <TableHead className="w-[120px]">Orario</TableHead>
                  <TableHead className="w-[120px]">Durata</TableHead>
                  <TableHead className="w-[120px]">Ore Ass.</TableHead>
                  <TableHead className="w-[120px]">Programma</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {peopleWithHours.map((person) => {
                  const program = programs.find(p => p.id === person.programId);
                  const weeklyHours = program?.weeklyHours || 0;
                  const remainingHours = Math.max(0, weeklyHours - person.hoursAssigned);
                  
                  return (
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
                        <div className="flex items-center">
                          <span 
                            className={
                              person.type === PERSON_TYPES.COACH && person.hoursAssigned > COACH_MAX_HOURS
                                ? "text-red-500 font-medium"
                                : ""
                            }
                          >
                            {person.hoursAssigned}
                          </span>
                          {program && person.type === PERSON_TYPES.PLAYER && (
                            <span className="text-xs ml-1 text-gray-500">
                              /{weeklyHours}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {program ? (
                          <div 
                            className="px-2 py-1 rounded-full text-xs inline-flex items-center justify-between w-full" 
                            style={{ 
                              backgroundColor: `${person.programColor}20` || "#f3f4f6",
                              color: person.programColor || "#374151" 
                            }}
                          >
                            <span className="truncate max-w-[80px]">{program.name}</span>
                            {person.type === PERSON_TYPES.PLAYER && (
                              <span className={`ml-1 ${
                                remainingHours <= 0 ? "text-red-500" : "text-green-500"
                              }`}>
                                {remainingHours}h
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Nessun programma</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </>
      )}
    </div>
  );
}
