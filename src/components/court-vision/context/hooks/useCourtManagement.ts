
import { useState } from "react";
import { CourtProps } from "../../types";
import { useToast } from "@/hooks/use-toast";

export function useCourtManagement(initialCourts: CourtProps[]) {
  const [courts, setCourts] = useState<CourtProps[]>(initialCourts);
  const { toast } = useToast();

  const handleAddCourt = (court: CourtProps) => {
    console.log("Adding court:", court);
    setCourts([...courts, { 
      ...court, 
      occupants: [], 
      activities: [] 
    }]);
    
    toast({
      title: "Campo Aggiunto",
      description: `Il campo "${court.name} #${court.number}" è stato aggiunto`,
    });
  };

  const handleUpdateCourt = (courtId: string, courtData: Partial<CourtProps>) => {
    console.log("Updating court:", courtId, courtData);
    setCourts(courts.map(court => 
      court.id === courtId 
        ? { ...court, ...courtData } 
        : court
    ));
    
    toast({
      title: "Campo Aggiornato",
      description: "Le modifiche al campo sono state salvate",
    });
  };

  const handleRemoveCourt = (courtId: string) => {
    console.log("Removing court:", courtId);
    
    const courtToRemove = courts.find(c => c.id === courtId);
    if (!courtToRemove) return;
    
    setCourts(courts.filter(court => court.id !== courtId));
    
    toast({
      title: "Campo Rimosso",
      description: `Il campo "${courtToRemove.name} #${courtToRemove.number}" è stato rimosso`,
    });
  };

  return {
    courts,
    setCourts,
    handleAddCourt,
    handleUpdateCourt,
    handleRemoveCourt
  };
}
