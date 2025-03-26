
import { ScrollArea } from "@/components/ui/scroll-area";
import { PeopleList } from "./PeopleList";
import { ActivitiesPanel } from "./ActivitiesPanel";

export function CourtVisionSidebar() {
  return (
    <div className="w-80 flex-shrink-0 flex flex-col">
      <ScrollArea className="flex-1">
        <div className="pr-4 pb-4 space-y-4">
          <PeopleList />
          <ActivitiesPanel />
        </div>
      </ScrollArea>
    </div>
  );
}
