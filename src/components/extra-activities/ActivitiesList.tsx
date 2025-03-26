
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExtraActivity, ACTIVITY_TYPES } from "@/types/extra-activities";

interface ActivitiesListProps {
  activities: ExtraActivity[];
  getCoachName: (coachId: string) => string;
}

export function ActivitiesList({ activities, getCoachName }: ActivitiesListProps) {
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

  return (
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
  );
}
