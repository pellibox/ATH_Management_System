
import { ScrollArea } from "@/components/ui/scroll-area";
import { PeopleList } from "./PeopleList";
import { ActivitiesPanel } from "./ActivitiesPanel";
import { useIsMobile } from "@/hooks/use-mobile";

export function CourtVisionSidebar() {
  const isMobile = useIsMobile();
  
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
