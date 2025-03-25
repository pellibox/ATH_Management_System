
import React from "react";
import { format } from "date-fns";
import { CourtProps } from "./types";

export interface AssignmentsDashboardProps {
  courts: CourtProps[];
  selectedDate: Date; // Add this prop
}

export function AssignmentsDashboard({ courts, selectedDate }: AssignmentsDashboardProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Assignments Dashboard - {format(selectedDate, 'MMMM d, yyyy')}</h2>
      
      {courts.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No courts configured for this view</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
              
              <div>
                <h4 className="text-sm font-medium mb-1">People</h4>
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
                  <p className="text-xs text-gray-500 mb-3">No people assigned</p>
                )}
                
                <h4 className="text-sm font-medium mb-1">Activities</h4>
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
                  <p className="text-xs text-gray-500">No activities assigned</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
