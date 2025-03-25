
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Send, Calendar, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PersonData, CourtProps } from "./types";

interface SendScheduleDialogProps {
  courts: CourtProps[];
  selectedDate: Date;
  playersList: PersonData[];
  coachesList: PersonData[];
  onCheckUnassigned: (type: "day" | "week" | "month") => PersonData[];
}

export function SendScheduleDialog({ 
  courts, 
  selectedDate, 
  playersList, 
  coachesList,
  onCheckUnassigned 
}: SendScheduleDialogProps) {
  const { toast } = useToast();
  const [scheduleType, setScheduleType] = useState<"day" | "week" | "month">("day");
  const [contactMethod, setContactMethod] = useState<"WhatsApp" | "Email" | "Phone">("WhatsApp");
  const [showWarning, setShowWarning] = useState(false);
  const [unassignedPeople, setUnassignedPeople] = useState<PersonData[]>([]);
  
  const handleSendSchedule = () => {
    const unassigned = onCheckUnassigned(scheduleType);
    
    if (unassigned.length > 0) {
      setUnassignedPeople(unassigned);
      setShowWarning(true);
    } else {
      sendSchedules();
    }
  };
  
  const sendSchedules = () => {
    setShowWarning(false);
    toast({
      title: "Schedules Sent",
      description: `Schedule has been sent to all assigned people via ${contactMethod}`,
    });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex items-center bg-ath-black text-white">
            <Send className="h-4 w-4 mr-2" />
            Send Schedule
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Schedule</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Schedule Type</h3>
              <div className="flex gap-2">
                <Button 
                  variant={scheduleType === "day" ? "default" : "outline"}
                  onClick={() => setScheduleType("day")}
                  size="sm"
                >Daily</Button>
                <Button 
                  variant={scheduleType === "week" ? "default" : "outline"}
                  onClick={() => setScheduleType("week")}
                  size="sm"
                >Weekly</Button>
                <Button 
                  variant={scheduleType === "month" ? "default" : "outline"}
                  onClick={() => setScheduleType("month")}
                  size="sm"
                >Monthly</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Contact Method</h3>
              <Select value={contactMethod} onValueChange={(value: any) => setContactMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Phone">Phone Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleSendSchedule} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send Schedules
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            Unassigned People Found
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p>The following people have no assignments in this {scheduleType}:</p>
            <ul className="mt-2 space-y-1">
              {unassignedPeople.map(person => (
                <li key={person.id} className="text-sm">• {person.name}</li>
              ))}
            </ul>
            <p className="mt-4">Do you want to continue sending the schedule anyway?</p>
          </AlertDialogDescription>
          <div className="flex justify-end space-x-2 mt-4">
            <AlertDialogCancel>Review Assignments</AlertDialogCancel>
            <AlertDialogAction onClick={sendSchedules}>
              Send Anyway
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
