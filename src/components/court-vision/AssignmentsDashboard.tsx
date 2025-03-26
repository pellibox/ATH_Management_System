
import React from "react";
import { format } from "date-fns";
import { CourtProps } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";

export interface AssignmentsDashboardProps {
  courts: CourtProps[];
  selectedDate: Date;
}

export function AssignmentsDashboard({ courts, selectedDate }: AssignmentsDashboardProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Riepilogo Assegnazioni - {format(selectedDate, 'MMMM d, yyyy')}</h2>
      
      {courts.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nessun campo configurato per questa vista</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
          {courts.map(court => (
            <div key={court.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">
                  {court.name} #{court.number}
                </h3>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                  {court.type}
                </span>
              </div>
              
              <div className="overflow-hidden">
                <h4 className="text-sm font-medium mb-1">Persone</h4>
                {court.occupants.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {court.occupants.map(person => (
                      <span 
                        key={person.id} 
                        className="text-xs px-2 py-1 rounded bg-ath-blue-light text-ath-blue">
                        {person.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 mb-3">Nessuna persona assegnata</p>
                )}
                
                <h4 className="text-sm font-medium mb-1">Attività</h4>
                {court.activities.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {court.activities.map(activity => (
                      <span 
                        key={activity.id} 
                        className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
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
