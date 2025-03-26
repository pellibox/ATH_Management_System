
import { useEffect } from "react";
import { PersonData, CourtProps } from "../types";

export interface FiltersProps {
  courts: CourtProps[];
  currentSport: string;
  playersList: PersonData[];
  coachesList: PersonData[];
  setFilteredCourts: React.Dispatch<React.SetStateAction<CourtProps[]>>;
  setFilteredPlayers: React.Dispatch<React.SetStateAction<PersonData[]>>;
  setFilteredCoaches: React.Dispatch<React.SetStateAction<PersonData[]>>;
}

export const useCourtVisionFilters = ({
  courts,
  currentSport,
  playersList,
  coachesList,
  setFilteredCourts,
  setFilteredPlayers,
  setFilteredCoaches
}: FiltersProps) => {
  // Filter courts, players, and coaches based on selected sport
  useEffect(() => {
    if (currentSport) {
      let filteredCourtType = '';
      
      switch (currentSport) {
        case 'tennis':
          filteredCourtType = 'Tennis';
          break;
        case 'padel':
          filteredCourtType = 'Padel';
          break;
        case 'pickleball':
          filteredCourtType = 'Pickleball';
          break;
        case 'touchtennis':
          filteredCourtType = 'TouchTennis';
          break;
        default:
          break;
      }
      
      const filtered = courts.filter(court => {
        if (currentSport === 'tennis') {
          return court.type === 'Tennis-Clay' || court.type === 'Tennis-Hard';
        }
        return court.type === filteredCourtType;
      });
      
      setFilteredCourts(filtered);
      
      setFilteredPlayers(playersList.filter(player => 
        !player.sportTypes || player.sportTypes.includes(currentSport)
      ));
      
      setFilteredCoaches(coachesList.filter(coach => 
        !coach.sportTypes || coach.sportTypes.includes(currentSport)
      ));
    } else {
      setFilteredCourts(courts);
      setFilteredPlayers(playersList);
      setFilteredCoaches(coachesList);
    }
  }, [currentSport, courts, playersList, coachesList]);
};
