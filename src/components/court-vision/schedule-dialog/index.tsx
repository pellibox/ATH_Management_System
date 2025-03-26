
import { useState } from "react";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { PersonData, CourtProps } from "../types";
import { ScheduleTypeSelector } from "./ScheduleTypeSelector";
import { RecipientSelector } from "./RecipientSelector";
import { ContactMethodSelector } from "./ContactMethodSelector";
import { PreviewButton } from "./PreviewButton";
import { UnassignedWarning } from "./UnassignedWarning";
import { SchedulePreviewDialog } from "./SchedulePreviewDialog";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scheduleType, setScheduleType] = useState<"day" | "week" | "month">("day");
  const [contactMethod, setContactMethod] = useState<"WhatsApp" | "Email" | "Phone">("WhatsApp");
  const [recipientType, setRecipientType] = useState<"players" | "coaches" | "both">("both");
  const [showWarning, setShowWarning] = useState(false);
  const [unassignedPeople, setUnassignedPeople] = useState<PersonData[]>([]);
  const [previewPerson, setPreviewPerson] = useState<PersonData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
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
    
    // Determina i destinatari in base al tipo selezionato
    let recipients: PersonData[] = [];
    if (recipientType === "players" || recipientType === "both") {
      recipients = [...recipients, ...playersList];
    }
    if (recipientType === "coaches" || recipientType === "both") {
      recipients = [...recipients, ...coachesList];
    }
    
    toast({
      title: "Programmazioni Inviate",
      description: `Le programmazioni sono state inviate a ${recipients.length} persone via ${contactMethod}`,
    });
    
    setDialogOpen(false);
  };

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  const previewSchedule = (person: PersonData) => {
    setPreviewPerson(person);
    setShowPreview(true);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center bg-ath-black text-white" onClick={() => setDialogOpen(true)}>
            <Send className="h-4 w-4 mr-2" />
            Invia Programmazione
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="relative">
            <DialogTitle>Invia Programmazione</DialogTitle>
            <DialogClose className="absolute right-0 top-0">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setDialogOpen(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <ScheduleTypeSelector 
              scheduleType={scheduleType} 
              setScheduleType={setScheduleType} 
            />
            
            <RecipientSelector 
              recipientType={recipientType} 
              setRecipientType={setRecipientType} 
            />
            
            <ContactMethodSelector 
              contactMethod={contactMethod} 
              setContactMethod={setContactMethod} 
            />
            
            <PreviewButton 
              onPreview={previewSchedule}
              samplePerson={playersList[0] || coachesList[0]} 
              disabled={playersList.length === 0 && coachesList.length === 0}
            />
            
            <Button onClick={handleSendSchedule} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Invia Programmazioni
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UnassignedWarning 
        open={showWarning}
        setOpen={setShowWarning}
        unassignedPeople={unassignedPeople}
        scheduleType={scheduleType}
        onSendAnyway={sendSchedules}
      />

      <SchedulePreviewDialog 
        open={showPreview}
        setOpen={setShowPreview}
        previewPerson={previewPerson}
        date={selectedDate}
        courts={courts}
        timeSlots={timeSlots}
      />
    </>
  );
}
