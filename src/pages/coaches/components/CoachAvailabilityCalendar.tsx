
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalendarView from "@/components/ui/CalendarView";
import { ExtraActivitiesCalendar } from "@/components/extra-activities/ExtraActivitiesCalendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CoachAvailabilityEvent } from "@/contexts/programs/types";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface CoachAvailabilityCalendarProps {
  coachId: string;
  coachName: string;
  availabilityEvents: CoachAvailabilityEvent[];
  onAddEvent: (event: CoachAvailabilityEvent) => void;
  onRemoveEvent: (eventId: string) => void;
  onUpdateEvent: (eventId: string, event: Partial<CoachAvailabilityEvent>) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentView: "week" | "day" | "month";
  setCurrentView: (view: "week" | "day" | "month") => void;
  isCoachView?: boolean; // If true, coach can only add events but not modify admin events
}

export function CoachAvailabilityCalendar({
  coachId,
  coachName,
  availabilityEvents,
  onAddEvent,
  onRemoveEvent,
  onUpdateEvent,
  selectedDate,
  setSelectedDate,
  currentView,
  setCurrentView,
  isCoachView = false
}: CoachAvailabilityCalendarProps) {
  const { toast } = useToast();
  const [isAddingEvent, setIsAddingEvent] = useState(false);
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
    date: selectedDate,
    notes: "",
    allDay: true
  });

  // Get events for the selected date
  const eventsForSelectedDate = availabilityEvents.filter(event => {
    const eventDate = new Date(event.date);
    const selectedDateStr = selectedDate.toDateString();
    
    // Check if event falls on selected date
    if (event.endDate) {
      const endDate = new Date(event.endDate);
      return eventDate.toDateString() <= selectedDateStr && endDate.toDateString() >= selectedDateStr;
    }
    
    return eventDate.toDateString() === selectedDateStr;
  });

  // Handle form submission for new event
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
    setIsAddingEvent(false);
    setNewEvent({
      title: "",
      type: "other",
      date: selectedDate,
      notes: "",
      allDay: true
    });

    toast({
      title: "Evento Aggiunto",
      description: `L'evento "${newEvent.title}" è stato aggiunto al calendario`
    });
  };

  // Get color for event type
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'vacation':
        return "bg-blue-100 text-blue-800";
      case 'sick':
        return "bg-red-100 text-red-800";
      case 'travel':
        return "bg-purple-100 text-purple-800";
      case 'tournament':
        return "bg-green-100 text-green-800";
      case 'personal':
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get event type label
  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'vacation':
        return "Vacanza";
      case 'sick':
        return "Malattia";
      case 'travel':
        return "Trasferta";
      case 'tournament':
        return "Torneo";
      case 'personal':
        return "Personale";
      default:
        return "Altro";
    }
  };

  return (
    <div className="space-y-6">
      <ExtraActivitiesCalendar
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Indisponibilità - {format(selectedDate, "dd/MM/yyyy")}</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddingEvent(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Aggiungi
          </Button>
        </CardHeader>
        <CardContent>
          {eventsForSelectedDate.length > 0 ? (
            <div className="space-y-3">
              {eventsForSelectedDate.map((event) => (
                <div key={event.id} className="flex items-start justify-between p-3 border rounded-md">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className={getEventTypeColor(event.type)}>
                        {getEventTypeLabel(event.type)}
                      </Badge>
                      <h3 className="font-medium">{event.title}</h3>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {event.endDate 
                        ? `${format(new Date(event.date), "dd/MM/yyyy")} - ${format(new Date(event.endDate), "dd/MM/yyyy")}`
                        : format(new Date(event.date), "dd/MM/yyyy")}
                      {event.allDay && " (Tutto il giorno)"}
                    </div>
                    {event.notes && (
                      <p className="text-sm mt-1">{event.notes}</p>
                    )}
                  </div>
                  {!isCoachView && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onRemoveEvent(event.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nessuna indisponibilità programmata per questa data
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Event Dialog */}
      <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
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
            <Button variant="outline" onClick={() => setIsAddingEvent(false)}>Annulla</Button>
            <Button onClick={handleAddEvent}>Salva</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
