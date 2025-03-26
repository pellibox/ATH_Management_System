
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock, Search, Filter, Edit, Trash, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format, addDays, isToday, isSameDay } from "date-fns";
import { useCourtVision } from "@/components/court-vision/CourtVisionContext";
import { DateSelector } from "@/components/court-vision/DateSelector";
import CalendarView from "@/components/ui/CalendarView";

// Tipo di attività aggiuntiva
interface ExtraActivity {
  id: string;
  name: string;
  type: string;
  time: string;
  duration: number;
  days: number[];
  location: string;
  maxParticipants: number;
  participants: string[];
  coach: string;
  notes?: string;
}

// Tipi di attività predefiniti
const ACTIVITY_TYPES = [
  { id: "athletic", name: "Atletica" },
  { id: "mental", name: "Preparazione Mentale" },
  { id: "physio", name: "Fisioterapia" },
  { id: "nutrition", name: "Nutrizione" },
  { id: "video", name: "Analisi Video" }
];

// Funzione per generare un ID univoco
const generateId = () => `extra-activity-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export default function ExtraActivities() {
  const { toast } = useToast();
  const { playersList, coachesList } = useCourtVision();
  const [currentView, setCurrentView] = useState<"week" | "day" | "month">("week");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activities, setActivities] = useState<ExtraActivity[]>([
    {
      id: "athletic-1",
      name: "Preparazione Atletica Settimanale",
      type: "athletic",
      time: "17:00",
      duration: 1.5,
      days: [1, 3, 5], // Lunedì, Mercoledì, Venerdì
      location: "Palestra",
      maxParticipants: 8,
      participants: ["player-1", "player-2", "player-3"],
      coach: "coach-1",
      notes: "Portare abbigliamento sportivo e scarpe da ginnastica"
    },
    {
      id: "mental-1",
      name: "Sessione di Mindfulness",
      type: "mental",
      time: "16:00",
      duration: 1,
      days: [2, 4], // Martedì, Giovedì
      location: "Sala Conferenze",
      maxParticipants: 10,
      participants: ["player-2", "player-4"],
      coach: "coach-2",
      notes: "Portare tappetino yoga"
    }
  ]);
  
  const [newActivity, setNewActivity] = useState<Omit<ExtraActivity, "id">>({
    name: "",
    type: "athletic",
    time: "16:00",
    duration: 1,
    days: [1], // Lunedì di default
    location: "",
    maxParticipants: 8,
    participants: [],
    coach: "",
    notes: ""
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dayFilter, setDayFilter] = useState<number | "all">("all");
  
  // Filtra le attività in base ai criteri di ricerca
  const filteredActivities = activities.filter(activity => {
    const matchSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (activity.notes && activity.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchType = typeFilter === "all" || activity.type === typeFilter;
    
    const matchDay = dayFilter === "all" || activity.days.includes(dayFilter as number);
    
    return matchSearch && matchType && matchDay;
  });
  
  // Attività programmate per la data selezionata
  const activitiesForSelectedDate = activities.filter(activity => 
    activity.days.includes(selectedDate.getDay() === 0 ? 7 : selectedDate.getDay())
  );
  
  // Gestione aggiunta nuova attività
  const handleAddActivity = () => {
    if (!newActivity.name || !newActivity.location || !newActivity.coach) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi obbligatori",
        variant: "destructive"
      });
      return;
    }
    
    const newActivityWithId: ExtraActivity = {
      ...newActivity,
      id: generateId()
    };
    
    setActivities([...activities, newActivityWithId]);
    
    toast({
      title: "Attività Aggiunta",
      description: `${newActivity.name} è stata aggiunta con successo`,
    });
    
    // Reset form
    setNewActivity({
      name: "",
      type: "athletic",
      time: "16:00",
      duration: 1,
      days: [1],
      location: "",
      maxParticipants: 8,
      participants: [],
      coach: "",
      notes: ""
    });
  };
  
  // Gestione modifica attività
  const handleEditActivity = (id: string, updatedActivity: Partial<ExtraActivity>) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, ...updatedActivity } : activity
    ));
    
    toast({
      title: "Attività Aggiornata",
      description: "Le modifiche sono state salvate con successo",
    });
  };
  
  // Gestione eliminazione attività
  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
    
    toast({
      title: "Attività Eliminata",
      description: "L'attività è stata eliminata con successo",
    });
  };
  
  // Gestione aggiunta partecipante
  const handleAddParticipant = (activityId: string, participantId: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId && !activity.participants.includes(participantId)) {
        return {
          ...activity,
          participants: [...activity.participants, participantId]
        };
      }
      return activity;
    }));
    
    toast({
      title: "Partecipante Aggiunto",
      description: "Il partecipante è stato aggiunto all'attività",
    });
  };
  
  // Gestione rimozione partecipante
  const handleRemoveParticipant = (activityId: string, participantId: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          participants: activity.participants.filter(id => id !== participantId)
        };
      }
      return activity;
    }));
    
    toast({
      title: "Partecipante Rimosso",
      description: "Il partecipante è stato rimosso dall'attività",
    });
  };
  
  // Toggle giorno della settimana per una nuova attività
  const toggleDay = (day: number) => {
    setNewActivity(prev => {
      if (prev.days.includes(day)) {
        return { ...prev, days: prev.days.filter(d => d !== day) };
      } else {
        return { ...prev, days: [...prev.days, day] };
      }
    });
  };

  // Ottieni il nome di un coach dal suo ID
  const getCoachName = (coachId: string) => {
    const coach = coachesList.find(c => c.id === coachId);
    return coach ? coach.name : "Coach non trovato";
  };
  
  // Ottieni il nome di un giocatore dal suo ID
  const getPlayerName = (playerId: string) => {
    const player = playersList.find(p => p.id === playerId);
    return player ? player.name : "Giocatore non trovato";
  };

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Attività Aggiuntive</h1>
          <p className="text-gray-600 mt-1">Gestisci atletica e altre attività di supporto</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors">
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">Nuova Attività</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Crea Nuova Attività</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome Attività*</label>
                    <Input 
                      value={newActivity.name} 
                      onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                      placeholder="Es. Allenamento Atletico"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo Attività*</label>
                    <Select 
                      value={newActivity.type}
                      onValueChange={(value) => setNewActivity({...newActivity, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTIVITY_TYPES.map(type => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Orario*</label>
                    <Select 
                      value={newActivity.time}
                      onValueChange={(value) => setNewActivity({...newActivity, time: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona orario" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 13 }, (_, i) => `${i + 8}:00`).map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Durata (ore)*</label>
                    <Select 
                      value={newActivity.duration.toString()}
                      onValueChange={(value) => setNewActivity({...newActivity, duration: parseFloat(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona durata" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">30 minuti</SelectItem>
                        <SelectItem value="1">1 ora</SelectItem>
                        <SelectItem value="1.5">1 ora e 30 minuti</SelectItem>
                        <SelectItem value="2">2 ore</SelectItem>
                        <SelectItem value="2.5">2 ore e 30 minuti</SelectItem>
                        <SelectItem value="3">3 ore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Giorni della Settimana*</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { day: 1, label: "Lun" },
                      { day: 2, label: "Mar" },
                      { day: 3, label: "Mer" },
                      { day: 4, label: "Gio" },
                      { day: 5, label: "Ven" },
                      { day: 6, label: "Sab" },
                      { day: 7, label: "Dom" }
                    ].map(({ day, label }) => (
                      <Button
                        key={day}
                        type="button"
                        size="sm"
                        variant={newActivity.days.includes(day) ? "default" : "outline"}
                        onClick={() => toggleDay(day)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ubicazione*</label>
                    <Input 
                      value={newActivity.location} 
                      onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                      placeholder="Es. Palestra"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Numero Max Partecipanti</label>
                    <Input 
                      type="number"
                      min="1"
                      value={newActivity.maxParticipants} 
                      onChange={(e) => setNewActivity({...newActivity, maxParticipants: parseInt(e.target.value)})}
                      placeholder="Es. 8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Coach Responsabile*</label>
                  <Select 
                    value={newActivity.coach}
                    onValueChange={(value) => setNewActivity({...newActivity, coach: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona coach" />
                    </SelectTrigger>
                    <SelectContent>
                      {coachesList.map(coach => (
                        <SelectItem key={coach.id} value={coach.id}>{coach.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Note Aggiuntive</label>
                  <Input 
                    value={newActivity.notes || ""} 
                    onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
                    placeholder="Es. Portare abbigliamento sportivo"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Annulla</Button>
                </DialogClose>
                <Button onClick={handleAddActivity}>Aggiungi Attività</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Calendario Attività</CardTitle>
              <div className="flex items-center space-x-2">
                <Tabs 
                  value={currentView} 
                  onValueChange={(v: "week" | "day" | "month") => setCurrentView(v)}
                  className="h-8"
                >
                  <TabsList className="h-8">
                    <TabsTrigger value="day" className="text-xs h-8">Giorno</TabsTrigger>
                    <TabsTrigger value="week" className="text-xs h-8">Settimana</TabsTrigger>
                    <TabsTrigger value="month" className="text-xs h-8">Mese</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
              </div>
              <CalendarView currentView={currentView} />
            </CardContent>
          </Card>
        
          {activitiesForSelectedDate.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  Attività per {format(selectedDate, "EEEE d MMMM yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activitiesForSelectedDate.map(activity => (
                    <div key={activity.id} className="rounded-lg border p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium flex items-center">
                            <Badge className="mr-2" variant="outline">
                              {ACTIVITY_TYPES.find(t => t.id === activity.type)?.name}
                            </Badge>
                            {activity.name}
                          </h3>
                          <div className="flex items-center mt-1 text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            {activity.time} - {activity.duration} ore
                            <span className="mx-2">•</span>
                            <span>{activity.location}</span>
                          </div>
                          <div className="mt-2 text-sm">
                            <p>
                              <span className="font-medium">Coach:</span> {getCoachName(activity.coach)}
                            </p>
                            {activity.notes && (
                              <p className="mt-1 text-gray-600">
                                <span className="font-medium">Note:</span> {activity.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleDeleteActivity(activity.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                            Partecipanti ({activity.participants.length}/{activity.maxParticipants})
                          </h4>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-7 text-xs">Aggiungi</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Aggiungi Partecipanti</DialogTitle>
                              </DialogHeader>
                              <div className="py-4">
                                <Input placeholder="Cerca giocatori..." className="mb-4" />
                                <div className="max-h-[300px] overflow-y-auto space-y-2">
                                  {playersList
                                    .filter(player => !activity.participants.includes(player.id))
                                    .map(player => (
                                      <div key={player.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                        <span>{player.name}</span>
                                        <Button 
                                          size="sm" 
                                          variant="ghost"
                                          onClick={() => handleAddParticipant(activity.id, player.id)}
                                        >
                                          Aggiungi
                                        </Button>
                                      </div>
                                    ))
                                  }
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {activity.participants.length > 0 ? (
                            activity.participants.map(participantId => (
                              <Badge key={participantId} variant="secondary" className="flex items-center gap-1">
                                {getPlayerName(participantId)}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-4 w-4 ml-1 hover:bg-transparent"
                                  onClick={() => handleRemoveParticipant(activity.id, participantId)}
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">Nessun partecipante</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Tutte le Attività
              </CardTitle>
              
              <div className="flex flex-col space-y-2 mt-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Cerca attività..."
                    className="h-10 w-full rounded-lg bg-white border pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="Filtra per tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutti i tipi</SelectItem>
                      {ACTIVITY_TYPES.map(type => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={dayFilter.toString()} 
                    onValueChange={(v) => setDayFilter(v === "all" ? "all" : parseInt(v))}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="Filtra per giorno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutti i giorni</SelectItem>
                      <SelectItem value="1">Lunedì</SelectItem>
                      <SelectItem value="2">Martedì</SelectItem>
                      <SelectItem value="3">Mercoledì</SelectItem>
                      <SelectItem value="4">Giovedì</SelectItem>
                      <SelectItem value="5">Venerdì</SelectItem>
                      <SelectItem value="6">Sabato</SelectItem>
                      <SelectItem value="7">Domenica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredActivities.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {filteredActivities.map(activity => (
                    <div key={activity.id} className="rounded-lg border shadow-sm p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">
                          {activity.name}
                        </h3>
                        <Badge>
                          {ACTIVITY_TYPES.find(t => t.id === activity.type)?.name}
                        </Badge>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {activity.time}, {activity.duration} ora(e)
                        </div>
                        <div className="mt-1">
                          <span className="font-medium">Ubicazione:</span> {activity.location}
                        </div>
                        <div className="mt-1">
                          <span className="font-medium">Coach:</span> {getCoachName(activity.coach)}
                        </div>
                        <div className="mt-1">
                          <span className="font-medium">Partecipanti:</span> {activity.participants.length}/{activity.maxParticipants}
                        </div>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {[
                          { day: 1, label: "L" },
                          { day: 2, label: "M" },
                          { day: 3, label: "M" },
                          { day: 4, label: "G" },
                          { day: 5, label: "V" },
                          { day: 6, label: "S" },
                          { day: 7, label: "D" }
                        ].map(({ day, label }) => (
                          <span 
                            key={day}
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                              activity.days.includes(day) 
                                ? "bg-ath-blue text-white" 
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <p className="text-gray-500 mb-2">Nessuna attività trovata con i filtri applicati</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setTypeFilter("all");
                      setDayFilter("all");
                    }}
                  >
                    Cancella Filtri
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
