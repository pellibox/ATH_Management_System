
import { useState } from "react";
import { PersonData } from "../../types";
import { useToast } from "@/hooks/use-toast";

export function usePersonManagement(initialPlayers: PersonData[], initialCoaches: PersonData[]) {
  const [playersList, setPlayersList] = useState<PersonData[]>(initialPlayers);
  const [coachesList, setCoachesList] = useState<PersonData[]>(initialCoaches);
  const { toast } = useToast();

  // Player management
  const handleAddPlayer = (player: PersonData) => {
    if (player.type !== "player") {
      player = { ...player, type: "player" };
    }
    setPlayersList([...playersList, player]);
    toast({
      title: "Giocatore Aggiunto",
      description: `${player.name} è stato aggiunto alla lista`,
    });
  };

  const handleUpdatePlayer = (playerId: string, playerData: Partial<PersonData>) => {
    setPlayersList(playersList.map(player => 
      player.id === playerId ? { ...player, ...playerData } : player
    ));
    toast({
      title: "Giocatore Aggiornato",
      description: "Le modifiche al giocatore sono state salvate",
    });
  };

  const handleRemovePlayer = (playerId: string) => {
    const playerToRemove = playersList.find(p => p.id === playerId);
    if (!playerToRemove) return;
    
    setPlayersList(playersList.filter(player => player.id !== playerId));
    toast({
      title: "Giocatore Rimosso",
      description: `${playerToRemove.name} è stato rimosso dalla lista`,
    });
  };

  // Coach management
  const handleAddCoach = (coach: PersonData) => {
    if (coach.type !== "coach") {
      coach = { ...coach, type: "coach" };
    }
    setCoachesList([...coachesList, coach]);
    toast({
      title: "Coach Aggiunto",
      description: `${coach.name} è stato aggiunto alla lista`,
    });
  };

  const handleUpdateCoach = (coachId: string, coachData: Partial<PersonData>) => {
    setCoachesList(coachesList.map(coach => 
      coach.id === coachId ? { ...coach, ...coachData } : coach
    ));
    toast({
      title: "Coach Aggiornato",
      description: "Le modifiche al coach sono state salvate",
    });
  };

  const handleRemoveCoach = (coachId: string) => {
    const coachToRemove = coachesList.find(c => c.id === coachId);
    if (!coachToRemove) return;
    
    setCoachesList(coachesList.filter(coach => coach.id !== coachId));
    toast({
      title: "Coach Rimosso",
      description: `${coachToRemove.name} è stato rimosso dalla lista`,
    });
  };

  // More general person management
  const handleAddPerson = (person: PersonData) => {
    if (person.type === "player") {
      handleAddPlayer(person);
    } else if (person.type === "coach") {
      handleAddCoach(person);
    }
  };

  const handleAddToDragArea = (personId: string) => {
    // Find the person in players or coaches
    const player = playersList.find(p => p.id === personId);
    const coach = coachesList.find(c => c.id === personId);
    
    const person = player || coach;
    if (!person) {
      console.error("Person not found:", personId);
      return;
    }
    
    // Logic for adding to drag area would go here
    toast({
      title: "Persona Aggiunta",
      description: `${person.name} è stata aggiunta all'area di trascinamento`,
    });
  };

  return {
    playersList,
    setPlayersList,
    coachesList,
    setCoachesList,
    handleAddPlayer,
    handleUpdatePlayer,
    handleRemovePlayer,
    handleAddCoach,
    handleUpdateCoach,
    handleRemoveCoach,
    handleAddPerson,
    handleAddToDragArea
  };
}
