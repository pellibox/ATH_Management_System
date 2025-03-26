
import { useState } from "react";
import { PersonData, Program } from "./types";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Phone, Mail, Calendar, User, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlayerCardProps {
  player: PersonData;
  programs: Program[];
  onAssignProgram: (playerId: string, programId: string) => void;
  onSendSchedule?: (playerId: string, type: "day" | "week" | "month") => void;
}

export function PlayerCard({ player, programs, onAssignProgram, onSendSchedule }: PlayerCardProps) {
  const { toast } = useToast();
  const [scheduleType, setScheduleType] = useState<"day" | "week" | "month">("week");
  
  const handleSendSchedule = () => {
    if (onSendSchedule) {
      onSendSchedule(player.id, scheduleType);
    } else {
      toast({
        title: "Invio Programmazione",
        description: `La programmazione ${scheduleType === "day" ? "giornaliera" : scheduleType === "week" ? "settimanale" : "mensile"} è stata inviata a ${player.name}`,
      });
    }
  };

  // Ottieni il programma attuale del giocatore, se presente
  const currentProgram = programs.find(p => p.id === player.programId);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4" style={currentProgram ? { backgroundColor: `${currentProgram.color}20` } : {}}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{player.name}</CardTitle>
            <CardDescription>
              {player.sportTypes?.join(", ") || "Nessuno sport specificato"}
            </CardDescription>
          </div>
          <div 
            className="h-10 w-10 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: currentProgram?.color || "#8B5CF6" }}
          >
            {player.name.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-2 text-sm">
        {player.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span>{player.email}</span>
          </div>
        )}
        {player.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{player.phone}</span>
          </div>
        )}
        {currentProgram && (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <span>{currentProgram.name}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3 pt-0 flex gap-2 justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              Programma
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assegna {player.name} a un Programma</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Seleziona Programma</h3>
                <div className="grid grid-cols-1 gap-2">
                  {programs.map(program => (
                    <button
                      key={program.id}
                      className="flex items-center p-2 rounded border border-gray-200 hover:bg-gray-50 text-left"
                      onClick={() => {
                        onAssignProgram(player.id, program.id);
                      }}
                    >
                      <div 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: program.color }}
                      ></div>
                      <span>{program.name}</span>
                    </button>
                  ))}
                  <button
                    className="flex items-center p-2 rounded border border-gray-200 hover:bg-gray-50 text-left"
                    onClick={() => {
                      onAssignProgram(player.id, "");
                    }}
                  >
                    <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                    <span>Rimuovi dal programma</span>
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Invia Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invia Schedule a {player.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Periodo Schedule</h3>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={scheduleType === "day" ? "default" : "outline"}
                    onClick={() => setScheduleType("day")}
                  >
                    Giorno
                  </Button>
                  <Button 
                    size="sm" 
                    variant={scheduleType === "week" ? "default" : "outline"}
                    onClick={() => setScheduleType("week")}
                  >
                    Settimana
                  </Button>
                  <Button 
                    size="sm" 
                    variant={scheduleType === "month" ? "default" : "outline"}
                    onClick={() => setScheduleType("month")}
                  >
                    Mese
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Metodo di Contatto</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={handleSendSchedule}>
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleSendSchedule}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
