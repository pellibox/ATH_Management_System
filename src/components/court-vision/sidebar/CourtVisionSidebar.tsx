
import { ScrollArea } from "@/components/ui/scroll-area";
import { PeopleList } from "./PeopleList";
import { ActivitiesPanel } from "./ActivitiesPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCourtVision } from "@/components/court-vision/context/CourtVisionContext";

export function CourtVisionSidebar() {
  const isMobile = useIsMobile();
  
  // Add this line to verify that the context is available
  console.log("CourtVisionSidebar: useCourtVision hook available:", !!useCourtVision);
  
  return (
    <div className={`${isMobile ? 'w-full' : 'w-64 md:w-72 lg:w-80'} flex-shrink-0 flex flex-col`}>
      <ScrollArea className="flex-1">
        <div className="pr-2 md:pr-4 pb-4 space-y-3 md:space-y-4">
          <PeopleList />
          <ActivitiesPanel />
        </div>
      </ScrollArea>
    </div>
  );
}
