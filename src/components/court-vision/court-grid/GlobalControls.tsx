
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Clock, AlertTriangle } from "lucide-react";
import { GlobalControlsProps } from "./types";
import { ConflictFilterSwitch } from "./ConflictFilterSwitch";

export function GlobalControls({ 
  timeSlots, 
  syncAllSliders, 
  currentBusinessHour,
  diagnosticMode,
  setDiagnosticMode,
  showOnlyConflicts,
  setShowOnlyConflicts,
  conflictsCount
}: GlobalControlsProps) {
  // Get unique hours from time slots for slider marks 
  const hours = Array.from(new Set(timeSlots.map(slot => parseInt(slot.split(':')[0])))).sort();
  
  // Calculate day progress as percentage
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const startHour = Math.min(...hours);
  const endHour = Math.max(...hours);
  
  const hourProgress = (currentHour - startHour) / (endHour - startHour) * 100;
  const minuteProgress = (currentMinute / 60) / (endHour - startHour) * 100;
  
  // Total progress relative to business hours
  const dayProgress = Math.min(Math.max(hourProgress + minuteProgress, 0), 100);
  
  return (
    <div className="px-4 space-y-3">
      <div className="text-sm font-medium mb-1">Orari</div>
      <div className="flex items-center space-x-3">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <div className="flex-1 relative h-5">
          <Slider 
            min={0} 
            max={hours.length - 1}
            step={1}
            onValueChange={(value) => {
              // Convert the numeric index to the actual hour string
              syncAllSliders(hours[value[0]].toString());
            }}
          />
          {/* Current time indicator */}
          {dayProgress >= 0 && dayProgress <= 100 && (
            <div
              className="absolute h-5 w-0.5 bg-blue-500 top-0 z-10 transform -translate-x-1/2"
              style={{ left: `${dayProgress}%` }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-[10px] rounded px-1">
                Ora
              </div>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => {
            if (currentBusinessHour !== null) {
              syncAllSliders(currentBusinessHour);
            }
          }}
        >
          Vai a ora corrente
        </Button>
      </div>
      
      <div className="flex justify-between items-center pt-2">
        {/* Conflict filter toggle */}
        <ConflictFilterSwitch 
          showOnlyConflicts={showOnlyConflicts}
          setShowOnlyConflicts={setShowOnlyConflicts}
          conflictsCount={conflictsCount}
        />
        
        {/* Diagnostic mode toggle */}
        <div className="flex items-center space-x-2">
          <label className="text-sm">
            <input
              type="checkbox"
              checked={diagnosticMode}
              onChange={(e) => setDiagnosticMode(e.target.checked)}
              className="mr-1"
            />
            Modalità diagnostica
          </label>
        </div>
      </div>
    </div>
  );
}
