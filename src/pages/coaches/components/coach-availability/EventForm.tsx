
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CoachAvailabilityEvent } from "@/contexts/programs/types";
import { useToast } from "@/hooks/use-toast";

interface EventFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEvent: (event: CoachAvailabilityEvent) => void;
  initialDate: Date;
}

export function EventForm({ isOpen, onOpenChange, onAddEvent, initialDate }: EventFormProps) {
  const { toast } = useToast();
  const [newEvent, setNewEvent] = useState<{
    title: string;
    type: 'vacation' | 'sick' | 'travel' | 'tournament' | 'personal' | 'other';
    date: Date;
    endDate?: Date;
    notes: string;
    allDay: boolean;
  }>({
    title: "",
    type: "other",
    date: initialDate,
    notes: "",
    allDay: true
  });

  const handleAddEvent = () => {
    if (!newEvent.title) {
      toast({
        title: "Errore",
        description: "Inserisci un titolo per l'evento",
        variant: "destructive"
      });
      return;
    }

    const event: CoachAvailabilityEvent = {
      id: `event-${Date.now()}`,
      title: newEvent.title,
      type: newEvent.type,
      date: newEvent.date,
      endDate: newEvent.endDate,
      notes: newEvent.notes,
      allDay: newEvent.allDay
    };

    onAddEvent(event);
    onOpenChange(false);
    setNewEvent({
      title: "",
      type: "other",
      date: initialDate,
      notes: "",
      allDay: true
    });

    toast({
      title: "Evento Aggiunto",
      description: `L'evento "${newEvent.title}" è stato aggiunto al calendario`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Aggiungi Indisponibilità</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="event-title">Titolo</Label>
            <Input 
              id="event-title" 
              placeholder="Inserisci un titolo" 
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
            />
          </div>

          <div className="grid w-full gap-2">
            <Label htmlFor="event-type">Tipo</Label>
            <Select 
              value={newEvent.type}
              onValueChange={(value: any) => setNewEvent({...newEvent, type: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Vacanza</SelectItem>
                <SelectItem value="sick">Malattia</SelectItem>
                <SelectItem value="travel">Trasferta</SelectItem>
                <SelectItem value="tournament">Torneo</SelectItem>
                <SelectItem value="personal">Personale</SelectItem>
                <SelectItem value="other">Altro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Inizio</Label>
              <div className="border rounded-md p-2">
                <Calendar
                  mode="single"
                  selected={newEvent.date}
                  onSelect={(date) => date && setNewEvent({...newEvent, date})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Data Fine (opzionale)</Label>
              <div className="border rounded-md p-2">
                <Calendar
                  mode="single"
                  selected={newEvent.endDate}
                  onSelect={(date) => setNewEvent({...newEvent, endDate: date || undefined})}
                />
              </div>
            </div>
          </div>

          <div className="grid w-full gap-2">
            <Label htmlFor="event-notes">Note (opzionale)</Label>
            <Textarea 
              id="event-notes" 
              placeholder="Aggiungi note" 
              value={newEvent.notes}
              onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annulla</Button>
          <Button onClick={handleAddEvent}>Salva</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
