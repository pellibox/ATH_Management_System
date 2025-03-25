import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChevronRight, Users, CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { PersonData, ActivityData, CourtProps } from "./types";
import { PERSON_TYPES, ACTIVITY_TYPES } from "./constants";
import { useIsMobile } from "@/hooks/use-mobile";

interface CourtAssignmentDialogProps {
  courts: CourtProps[];
  availablePeople: PersonData[];
  availableActivities: ActivityData[];
  onAssignPerson: (courtId: string, person: PersonData) => void;
  onAssignActivity: (courtId: string, activity: ActivityData) => void;
}

export function CourtAssignmentDialog({
  courts,
  availablePeople,
  availableActivities,
  onAssignPerson,
  onAssignActivity,
}: CourtAssignmentDialogProps) {
  const [selectedTab, setSelectedTab] = useState<"people" | "activities">("people");
  const [selectedCourt, setSelectedCourt] = useState<CourtProps | null>(null);
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const AssignmentComponent = () => (
    <div className="p-2">
      <div className="flex space-x-2 mb-4">
        <Button
          variant={selectedTab === "people" ? "default" : "outline"}
          onClick={() => setSelectedTab("people")}
          size="sm"
          className={selectedTab === "people" ? "bg-ath-red-clay hover:bg-ath-red-clay-dark" : ""}
        >
          <Users className="h-4 w-4 mr-2" /> People
        </Button>
        <Button
          variant={selectedTab === "activities" ? "default" : "outline"}
          onClick={() => setSelectedTab("activities")}
          size="sm"
          className={selectedTab === "activities" ? "bg-ath-red-clay hover:bg-ath-red-clay-dark" : ""}
        >
          <CalendarIcon className="h-4 w-4 mr-2" /> Activities
        </Button>
      </div>

      {selectedTab === "people" ? (
        <div>
          <h3 className="text-sm font-medium mb-2">Select Court</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {courts.map((court) => (
              <div
                key={court.id}
                className={`p-2 border rounded cursor-pointer ${
                  selectedCourt?.id === court.id ? "bg-ath-red-clay/10 border-ath-red-clay" : ""
                }`}
                onClick={() => setSelectedCourt(court)}
              >
                <div className="font-medium text-sm">
                  {court.name} #{court.number}
                </div>
                <div className="text-xs text-gray-500">
                  {court.occupants.length} people assigned
                </div>
              </div>
            ))}
          </div>

          {selectedCourt && (
            <>
              <h3 className="text-sm font-medium mb-2">Assign People</h3>
              {availablePeople.length > 0 ? (
                <div className="space-y-2">
                  {availablePeople.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-2 ${
                            person.type === PERSON_TYPES.PLAYER
                              ? "bg-ath-red-clay text-white"
                              : "bg-ath-black text-white"
                          }`}
                        >
                          {person.name.substring(0, 2)}
                        </div>
                        <span className="text-sm">{person.name}</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-ath-red-clay hover:bg-ath-red-clay-dark"
                        onClick={() => {
                          onAssignPerson(selectedCourt.id, person);
                          // Keep the dialog open to allow multiple assignments
                        }}
                      >
                        Assign
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic p-2">
                  All people assigned to courts
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div>
          <h3 className="text-sm font-medium mb-2">Select Court</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {courts.map((court) => (
              <div
                key={court.id}
                className={`p-2 border rounded cursor-pointer ${
                  selectedCourt?.id === court.id ? "bg-ath-red-clay/10 border-ath-red-clay" : ""
                }`}
                onClick={() => setSelectedCourt(court)}
              >
                <div className="font-medium text-sm">
                  {court.name} #{court.number}
                </div>
                <div className="text-xs text-gray-500">
                  {court.activities.length} activities assigned
                </div>
              </div>
            ))}
          </div>

          {selectedCourt && (
            <>
              <h3 className="text-sm font-medium mb-2">Assign Activities</h3>
              {availableActivities.length > 0 ? (
                <div className="space-y-2">
                  {availableActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center">
                        <div
                          className={`px-2 py-1 rounded-full text-xs mr-2 ${
                            activity.type === ACTIVITY_TYPES.MATCH
                              ? "bg-ath-black-light text-white"
                              : activity.type === ACTIVITY_TYPES.TRAINING
                              ? "bg-ath-red-clay-dark text-white"
                              : activity.type === ACTIVITY_TYPES.BASKET_DRILL
                              ? "bg-ath-red-clay text-white"
                              : activity.type === ACTIVITY_TYPES.GAME
                              ? "bg-ath-black text-white"
                              : "bg-ath-gray-medium text-white"
                          }`}
                        >
                          {activity.name}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-ath-red-clay hover:bg-ath-red-clay-dark"
                        onClick={() => {
                          onAssignActivity(selectedCourt.id, activity);
                          // Keep the dialog open to allow multiple assignments
                        }}
                      >
                        Assign
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic p-2">
                  All activities assigned to courts
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      <div className="mt-4 flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => setOpen(false)}
          className="border-ath-red-clay text-ath-red-clay"
        >
          Done
        </Button>
      </div>
    </div>
  );

  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full mb-4 border-ath-red-clay text-ath-red-clay">
          <Users className="h-4 w-4 mr-2" /> Assign to Courts
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white">
        <DrawerHeader>
          <DrawerTitle>Assign to Courts</DrawerTitle>
        </DrawerHeader>
        <AssignmentComponent />
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mb-4 border-ath-red-clay text-ath-red-clay">
          <Users className="h-4 w-4 mr-2" /> Assign to Courts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Assign to Courts</DialogTitle>
        </DialogHeader>
        <AssignmentComponent />
      </DialogContent>
    </Dialog>
  );
}
