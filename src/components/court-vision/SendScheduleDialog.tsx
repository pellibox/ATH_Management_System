
import { useState } from "react";
import { Send, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PersonData, CourtProps } from "./types";

interface SendScheduleDialogProps {
  courts: CourtProps[];
  selectedDate: Date;
  playersList: PersonData[];
  coachesList: PersonData[];
}

export function SendScheduleDialog({ courts, selectedDate, playersList, coachesList }: SendScheduleDialogProps) {
  const { toast } = useToast();
  const [scheduleType, setScheduleType] = useState<"day" | "week" | "month">("day");
  const [contactMethod, setContactMethod] = useState<"WhatsApp" | "Email" | "Phone">("WhatsApp");
  const [recipientType, setRecipientType] = useState<"all" | "players" | "coaches">("all");
  
  // Get all persons assigned to courts
  const getAllAssignedPersons = () => {
    const uniquePersons = new Map<string, PersonData>();
    
    courts.forEach(court => {
      court.occupants.forEach(person => {
        if (!uniquePersons.has(person.id)) {
          uniquePersons.set(person.id, person);
        }
      });
    });
    
    return Array.from(uniquePersons.values());
  };
  
  // Get all persons from the database that should receive the schedule
  const getAllRecipients = () => {
    const assignedPersons = getAllAssignedPersons();
    const assignedIds = new Set(assignedPersons.map(p => p.id));
    
    // Combine assigned persons with those from the database
    let allRecipients: PersonData[] = [...assignedPersons];
    
    if (recipientType === "all" || recipientType === "players") {
      playersList.forEach(player => {
        if (!assignedIds.has(player.id)) {
          allRecipients.push(player);
        }
      });
    }
    
    if (recipientType === "all" || recipientType === "coaches") {
      coachesList.forEach(coach => {
        if (!assignedIds.has(coach.id)) {
          allRecipients.push(coach);
        }
      });
    }
    
    // Filter by type if needed
    if (recipientType === "players") {
      allRecipients = allRecipients.filter(p => p.type === "player");
    } else if (recipientType === "coaches") {
      allRecipients = allRecipients.filter(p => p.type === "coach");
    }
    
    return allRecipients;
  };
  
  const handleSendToAll = () => {
    const recipients = getAllRecipients();
    const dateFormatted = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    // In a real application, this would send the actual schedules via the selected method
    const scheduleMessage = `${scheduleType === "day" ? "Daily" : scheduleType === "week" ? "Weekly" : "Monthly"} schedule for ${dateFormatted}`;
    
    toast({
      title: "Schedules Sent",
      description: `${scheduleMessage} has been sent to ${recipients.length} people via ${contactMethod}.`,
    });
  };
  
  const assignedPersonsCount = getAllAssignedPersons().length;
  const allRecipientsCount = getAllRecipients().length;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center bg-ath-black text-white">
          <Send className="h-4 w-4 mr-2" />
          Send Schedule to All
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Schedule to All</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Schedule Type</h3>
            <div className="flex gap-2">
              <Button 
                variant={scheduleType === "day" ? "default" : "outline"} 
                onClick={() => setScheduleType("day")}
                size="sm"
              >
                Daily
              </Button>
              <Button 
                variant={scheduleType === "week" ? "default" : "outline"} 
                onClick={() => setScheduleType("week")}
                size="sm"
              >
                Weekly
              </Button>
              <Button 
                variant={scheduleType === "month" ? "default" : "outline"} 
                onClick={() => setScheduleType("month")}
                size="sm"
              >
                Monthly
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Recipients</h3>
            <Tabs defaultValue="all" onValueChange={(value) => setRecipientType(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="players">Players</TabsTrigger>
                <TabsTrigger value="coaches">Coaches</TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-xs text-gray-500 mt-1">
              This will send schedules to {allRecipientsCount} people ({assignedPersonsCount} assigned to courts today)
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Contact Method</h3>
            <Select value={contactMethod} onValueChange={(value) => setContactMethod(value as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select contact method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Phone">Phone Call</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-2 flex justify-end">
            <Button onClick={handleSendToAll} className="bg-ath-black">
              <Send className="h-4 w-4 mr-2" />
              Send to All
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
