
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
  
  // Log the shared players for debugging
  useEffect(() => {
    console.log("CourtVision: Received sharedPlayers count:", sharedPlayers.length);
    
    // Let's see which players are actually in the shared context
    sharedPlayers.forEach(player => {
      console.log(`CourtVision: Player ${player.id}: ${player.name}, status: ${player.status}`);
    });
    
    // Force a refresh of the shared player list when Court Vision loads
    updateSharedPlayerList();
  }, [sharedPlayers.length]);

  // Always show a notification with the current player count
  useEffect(() => {
    // Give a moment for the DOM to settle
    const timeoutId = setTimeout(() => {
      toast.info("Dati dei giocatori sincronizzati", {
        description: `${sharedPlayers.length} giocatori caricati correttamente`
      });
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, []); 
  
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
