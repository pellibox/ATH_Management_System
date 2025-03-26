
import { useState } from "react";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourtProps, PersonData } from "../types";
import { PlayerScheduleTemplate } from "./PlayerScheduleTemplate";
import { CoachScheduleTemplate } from "./CoachScheduleTemplate";
import { Calendar, Send, Eye, X } from "lucide-react";

interface SchedulePreviewProps {
  selectedPerson: PersonData;
  courts: CourtProps[];
  date: Date;
  timeSlots: string[];
}

export function SchedulePreview({ selectedPerson, courts, date, timeSlots }: SchedulePreviewProps) {
  const [open, setOpen] = useState(false);
  const [contactMethod, setContactMethod] = useState<"WhatsApp" | "Email" | "Phone">(
    selectedPerson.preferredContactMethod || "WhatsApp"
  );

  const handleSend = () => {
    // Qui andrebbe l'integrazione con un servizio di invio
    console.log(`Inviando schedule a ${selectedPerson.name} via ${contactMethod}`);
    setOpen(false);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Eye className="h-4 w-4 mr-2" />
        Anteprima
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="relative">
            <DialogTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Anteprima Programmazione - {format(date, "dd/MM/yyyy")}
            </DialogTitle>
            <DialogClose className="absolute right-0 top-0">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </DialogHeader>

          <div className="space-y-6">
            {selectedPerson.type === "player" ? (
              <PlayerScheduleTemplate 
                player={selectedPerson} 
                date={date} 
                courts={courts} 
                timeSlots={timeSlots} 
              />
            ) : (
              <CoachScheduleTemplate 
                coach={selectedPerson} 
                date={date} 
                courts={courts} 
                timeSlots={timeSlots} 
              />
            )}

            <div className="flex flex-col space-y-4">
              <h3 className="text-sm font-medium">Metodo di invio:</h3>
              <Tabs value={contactMethod} onValueChange={(v: any) => setContactMethod(v)}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="WhatsApp">WhatsApp</TabsTrigger>
                  <TabsTrigger value="Email">Email</TabsTrigger>
                  <TabsTrigger value="Phone">Telefono</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Annulla
                </Button>
                <Button onClick={handleSend} className="flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Invia Programmazione
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
