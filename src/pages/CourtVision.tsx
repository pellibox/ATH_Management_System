
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ViewModeToggle } from "@/components/court-vision/ViewModeToggle";
import CourtVisionHeader from "@/components/court-vision/CourtVisionHeader";
import { CourtVisionSidebar } from "@/components/court-vision/sidebar/CourtVisionSidebar";
import { CourtVisionContent } from "@/components/court-vision/content/CourtVisionContent";
import { CourtVisionProvider } from "@/components/court-vision/context/CourtVisionContext";
import { useSharedPlayers } from "@/contexts/shared/SharedPlayerContext";

// Main Court Vision component
export default function CourtVision() {
  // Get shared players data
  const { sharedPlayers } = useSharedPlayers();
  
  return (
    <DndProvider backend={HTML5Backend}>
      <CourtVisionProvider initialPlayers={sharedPlayers}>
        <div className="mx-auto py-4 relative flex flex-col h-[calc(100vh-theme(spacing.16))]">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Visione Campo</h1>
            <ViewModeToggle />
          </div>
          
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
