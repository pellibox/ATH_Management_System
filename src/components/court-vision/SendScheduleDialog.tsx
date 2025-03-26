
import { useState } from "react";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogAction, 
  AlertDialogCancel 
} from "@/components/ui/alert-dialog";
import { Send, Calendar, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayerScheduleTemplate } from "./schedule/PlayerScheduleTemplate";
import { CoachScheduleTemplate } from "./schedule/CoachScheduleTemplate";
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
  };

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  const previewSchedule = (person: PersonData) => {
    setPreviewPerson(person);
    setShowPreview(true);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex items-center bg-ath-black text-white">
            <Send className="h-4 w-4 mr-2" />
            Invia Programmazione
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invia Programmazione</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Tipo di Programmazione</h3>
              <div className="flex gap-2">
                <Button 
                  variant={scheduleType === "day" ? "default" : "outline"}
                  onClick={() => setScheduleType("day")}
                  size="sm"
                >Giornaliera</Button>
                <Button 
                  variant={scheduleType === "week" ? "default" : "outline"}
                  onClick={() => setScheduleType("week")}
                  size="sm"
                >Settimanale</Button>
                <Button 
                  variant={scheduleType === "month" ? "default" : "outline"}
                  onClick={() => setScheduleType("month")}
                  size="sm"
                >Mensile</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Destinatari</h3>
              <Tabs value={recipientType} onValueChange={(v: any) => setRecipientType(v)}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="players">Solo Giocatori</TabsTrigger>
                  <TabsTrigger value="coaches">Solo Allenatori</TabsTrigger>
                  <TabsTrigger value="both">Entrambi</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Metodo di Invio</h3>
              <Select value={contactMethod} onValueChange={(value: any) => setContactMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Phone">Chiamata Telefonica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Anteprima</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => previewSchedule(playersList[0] || coachesList[0])}
                  disabled={playersList.length === 0 && coachesList.length === 0}
                >
                  Anteprima Esempio
                </Button>
              </div>
            </div>
            
            <Button onClick={handleSendSchedule} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Invia Programmazioni
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            Persone Non Assegnate
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p>Le seguenti persone non hanno assegnazioni in questa {
              scheduleType === "day" ? "giornata" : 
              scheduleType === "week" ? "settimana" : "mese"
            }:</p>
            <ul className="mt-2 space-y-1">
              {unassignedPeople.map(person => (
                <li key={person.id} className="text-sm">• {person.name}</li>
              ))}
            </ul>
            <p className="mt-4">Vuoi comunque inviare la programmazione?</p>
          </AlertDialogDescription>
          <div className="flex justify-end space-x-2 mt-4">
            <AlertDialogCancel>Rivedi Assegnazioni</AlertDialogCancel>
            <AlertDialogAction onClick={sendSchedules}>
              Invia Comunque
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Anteprima Programmazione</DialogTitle>
          </DialogHeader>
          
          {previewPerson && (
            <div className="py-4">
              {previewPerson.type === "player" ? (
                <PlayerScheduleTemplate 
                  player={previewPerson} 
                  date={selectedDate} 
                  courts={courts} 
                  timeSlots={timeSlots} 
                />
              ) : (
                <CoachScheduleTemplate 
                  coach={previewPerson} 
                  date={selectedDate} 
                  courts={courts} 
                  timeSlots={timeSlots} 
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
