
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CalendarPlus, MapPin, Users, Clock, Activity } from "lucide-react";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { ExtraActivity } from "@/types/extra-activities";

interface ActivityRegistrationProps {
  playerId: string;
  playerName: string;
}

export function ActivityRegistration({ playerId, playerName }: ActivityRegistrationProps) {
  const { 
    extraActivities, 
    selectedActivities, 
    setSelectedActivities, 
    handleRegisterForActivities 
  } = usePlayerContext();
  
  const [open, setOpen] = useState(false);

  const handleCheckboxChange = (activityId: string) => {
    setSelectedActivities(
      selectedActivities.includes(activityId)
        ? selectedActivities.filter(id => id !== activityId)
        : [...selectedActivities, activityId]
    );
  };

  const getActivityTypeStyle = (type: string) => {
    switch(type) {
      case "athletic":
        return "bg-orange-100 text-orange-800";
      case "mental":
        return "bg-purple-100 text-purple-800";
      case "physio":
        return "bg-blue-100 text-blue-800";
      case "nutrition":
        return "bg-green-100 text-green-800";
      case "video":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isPlayerRegistered = (activity: ExtraActivity) => 
    activity.participants.includes(playerId);

  const handleRegistration = () => {
    handleRegisterForActivities(playerId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setOpen(true)}
        className="flex gap-1"
      >
        <CalendarPlus className="h-4 w-4" />
        <span className="hidden sm:inline">Register</span>
      </Button>
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Register {playerName} for Extra Activities</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p className="text-sm text-gray-500">
            Select the extra activities you want to register this player for:
          </p>
          
          {extraActivities.length > 0 ? (
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {extraActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className={`p-4 border rounded-lg ${
                    selectedActivities.includes(activity.id) 
                      ? "border-ath-blue bg-ath-blue/5" 
                      : "hover:border-gray-300"
                  } ${isPlayerRegistered(activity) ? "bg-gray-50" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        checked={selectedActivities.includes(activity.id)}
                        onCheckedChange={() => handleCheckboxChange(activity.id)}
                        disabled={isPlayerRegistered(activity)}
                      />
                      <div>
                        <h3 className="font-medium text-base">{activity.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline" className={getActivityTypeStyle(activity.type)}>
                            <Activity className="h-3 w-3 mr-1" />
                            {activity.type}
                          </Badge>
                          <Badge variant="outline" className="bg-gray-100">
                            <MapPin className="h-3 w-3 mr-1" />
                            {activity.location}
                          </Badge>
                          <Badge variant="outline" className="bg-gray-100">
                            <Clock className="h-3 w-3 mr-1" />
                            {activity.time} ({activity.duration}h)
                          </Badge>
                          <Badge variant="outline" className="bg-gray-100">
                            <Users className="h-3 w-3 mr-1" />
                            {activity.participants.length}/{activity.maxParticipants}
                          </Badge>
                        </div>
                        {activity.notes && (
                          <p className="text-sm text-gray-500 mt-2">{activity.notes}</p>
                        )}
                      </div>
                    </div>
                    
                    {isPlayerRegistered(activity) && (
                      <Badge>Already Registered</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No extra activities available for registration
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <div className="text-sm text-gray-500">
            Selected: {selectedActivities.length} activities
          </div>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleRegistration}
              disabled={selectedActivities.length === 0}
            >
              Register
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
