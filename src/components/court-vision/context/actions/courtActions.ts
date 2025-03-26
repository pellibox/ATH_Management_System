
import { CourtProps, PersonData } from "../../types";
import { useToast } from "@/hooks/use-toast";

export const useCourtActions = (
  courts: CourtProps[], 
  setCourts: React.Dispatch<React.SetStateAction<CourtProps[]>>
) => {
  const { toast } = useToast();

  const handleRenameCourt = (courtId: string, name: string) => {
    const updatedCourts = courts.map(court => {
      if (court.id === courtId) {
        return { ...court, name };
      }
      return court;
    });
    setCourts(updatedCourts);
    toast({
      title: "Campo Rinomimato",
      description: `Il campo è stato rinominato a ${name}`,
    });
  };
  
  const handleChangeCourtType = (courtId: string, type: string) => {
    const updatedCourts = courts.map(court => {
      if (court.id === courtId) {
        return { ...court, type };
      }
      return court;
    });
    setCourts(updatedCourts);
    toast({
      title: "Tipo di Campo Modificato",
      description: `Il tipo di campo è stato modificato a ${type}`,
    });
  };

  const handleChangeCourtNumber = (courtId: string, number: number) => {
    const updatedCourts = courts.map(court => {
      if (court.id === courtId) {
        return { ...court, number };
      }
      return court;
    });
    setCourts(updatedCourts);
    toast({
      title: "Numero di Campo Modificato",
      description: `Il numero di campo è stato modificato a ${number}`,
    });
  };

  return {
    handleRenameCourt,
    handleChangeCourtType,
    handleChangeCourtNumber
  };
};
