
import React from "react";
import { Button } from "@/components/ui/button";
import { SkipBack, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GlobalControlsProps } from "./types";

export function GlobalControls({
  timeSlots,
  syncAllSliders,
  currentBusinessHour,
  diagnosticMode,
  setDiagnosticMode
}: GlobalControlsProps) {
  const { toast } = useToast();

  return (
    <div className="flex justify-between px-4 mb-2">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => {
            // Find earliest hour and sync all
            if (timeSlots.length > 0) {
              const firstHour = timeSlots[0].split(':')[0];
              syncAllSliders(firstHour);
            }
          }}
          title="Vai all'inizio della giornata"
        >
          <SkipBack className="h-3 w-3 mr-1" />
          <span>Inizio</span>
        </Button>
        
        {currentBusinessHour && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => syncAllSliders(currentBusinessHour)}
            title="Vai all'ora corrente"
          >
            <Clock className="h-3 w-3 mr-1" />
            <span>Ora</span>
          </Button>
        )}
        
        {/* Diagnostic mode toggle - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs ${diagnosticMode ? 'bg-amber-100' : ''}`}
            onClick={() => setDiagnosticMode(!diagnosticMode)}
          >
            {diagnosticMode ? "Debug On" : "Debug Off"}
          </Button>
        )}
      </div>
      
      {/* Test button for generating random assignments - removed */}
    </div>
  );
}
