
import React, { useEffect, useState } from "react";
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
  const [syncComplete, setSyncComplete] = useState(false);
  
  // Sync players once when the component mounts
  useEffect(() => {
    console.log("CourtVision: Initial load - requesting player update");
    updateSharedPlayerList();
    
    // Show a notification only once after initial load
    const timeoutId = setTimeout(() => {
      if (sharedPlayers.length > 0 && !syncComplete) {
        toast.info("Dati dei giocatori sincronizzati", {
          description: `${sharedPlayers.length} giocatori caricati correttamente`,
          id: "player-sync-toast" // Use an ID to prevent duplicate toasts
        });
        setSyncComplete(true);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  // Log player count when it changes, but don't show notification
  useEffect(() => {
    if (sharedPlayers.length > 0) {
      console.log("CourtVision: Player count updated:", sharedPlayers.length);
    }
  }, [sharedPlayers.length]);
  
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
