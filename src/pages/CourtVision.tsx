
import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CourtVisionHeader from "@/components/court-vision/CourtVisionHeader";
import { CourtVisionSidebar } from "@/components/court-vision/sidebar/CourtVisionSidebar";
import { CourtVisionContent } from "@/components/court-vision/content/CourtVisionContent";
import { CourtVisionProvider } from "@/components/court-vision/context/CourtVisionContext";
import { useSharedPlayers } from "@/contexts/shared/SharedPlayerContext";
import { toast } from "sonner";

export default function CourtVision() {
  const { sharedPlayers, updateSharedPlayerList } = useSharedPlayers();
  
  // Ensure shared players list is clean when this page loads
  useEffect(() => {
    // Clean up any potential duplicates when Court Vision page loads
    if (sharedPlayers.length > 0) {
      updateSharedPlayerList();
    }
  }, [updateSharedPlayerList, sharedPlayers.length]);
  
  // Show notification when players are loaded
  useEffect(() => {
    // Only show notification when players are loaded
    if (sharedPlayers.length > 0) {
      // Count how many players have a program
      const playersWithProgram = sharedPlayers.filter(p => 
        p.programId || (p.programIds && p.programIds.length > 0)
      ).length;
      
      toast.info("Dati dei giocatori caricati", {
        description: `${playersWithProgram} giocatori con programma disponibili`,
        id: "player-sync-toast", // Use an ID to prevent duplicate toasts
      });
    }
  }, [sharedPlayers]);
  
  return (
    <DndProvider backend={HTML5Backend}>
      <CourtVisionProvider initialPlayers={sharedPlayers}>
        <div className="mx-auto py-4 relative flex flex-col h-[calc(100vh-theme(spacing.16))]">
          <h1 className="text-2xl font-bold mb-4">Visione Campo</h1>
          
          <CourtVisionHeader />
          
          {/* Main content area with sidebar layout */}
          <div className="flex flex-1 gap-4 overflow-hidden">
            {/* Left sidebar for players, coaches and activities */}
            <CourtVisionSidebar />
            
            {/* Main content area */}
            <CourtVisionContent />
          </div>
        </div>
      </CourtVisionProvider>
    </DndProvider>
  );
}
