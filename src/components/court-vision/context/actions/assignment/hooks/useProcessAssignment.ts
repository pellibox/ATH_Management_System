
import { useToast } from "@/hooks/use-toast";
import { PersonData } from "../../../../types";
import { PERSON_TYPES } from "../../../../constants";
import { 
  preparePersonAssignment, 
  removePersonFromSource, 
  addPersonToCourt 
} from "../utils/personAssignmentUtils";

/**
 * Hook to handle the core assignment processing logic
 */
export const useProcessAssignment = (
  courts: any[],
  setCourts: React.Dispatch<React.SetStateAction<any[]>>,
  people: PersonData[],
  setPeople: React.Dispatch<React.SetStateAction<PersonData[]>>,
  selectedDate: Date,
  timeSlots: string[]
) => {
  const { toast } = useToast();

  const processAssignment = (
    courtId: string, 
    person: PersonData, 
    position?: { x: number, y: number }, 
    timeSlot?: string
  ) => {
    console.log("Processing assignment for:", person.name, "type:", person.type, "to court:", courtId);
    
    // Check if moving from an existing assignment (with source info)
    const isMovingFromExistingAssignment = person.sourceTimeSlot || person.courtId;

    // Keep track of the source time slot and court ID for possible removal later
    const sourceTimeSlot = person.timeSlot || person.sourceTimeSlot;
    const sourceCourtId = person.courtId;

    // Handle coach assignment specifically to ensure they have durationHours
    if (person.type === PERSON_TYPES.COACH && !person.durationHours) {
      console.log("Setting default duration for coach");
      person = { ...person, durationHours: 1 };
    }

    // Prepare the person object with court info, including proper time slot calculations
    const personWithCourtInfo = preparePersonAssignment(
      person, 
      courtId, 
      position, 
      timeSlot,
      timeSlots
    );
    
    // Set the date explicitly to the selected date's ISO string date part
    const dateString = selectedDate.toISOString().split('T')[0];
    personWithCourtInfo.date = dateString;

    // Remove from source if needed
    let updatedCourts = removePersonFromSource(
      courts,
      person,
      sourceTimeSlot,
      sourceCourtId
    );

    // Add person to the target court
    updatedCourts = addPersonToCourt(
      updatedCourts,
      courtId,
      personWithCourtInfo
    );

    console.log("Updated courts after drop:", updatedCourts);
    setCourts(updatedCourts);

    // Only remove from available list if it's a player and not a coach
    // Coaches should remain available for multiple assignments
    const isFromAvailableList = people.some(p => p.id === person.id);
    if (isFromAvailableList && person.type === "player") {
      setPeople(people.filter(p => p.id !== person.id));
    }

    // Construct message with duration info
    const durationText = personWithCourtInfo.durationHours && personWithCourtInfo.durationHours > 1 
      ? ` per ${personWithCourtInfo.durationHours} ore`
      : '';
    
    // Show success notification
    toast({
      title: isMovingFromExistingAssignment ? "Persona Spostata" : "Persona Assegnata",
      description: `${person.name} è stata ${isMovingFromExistingAssignment ? "spostata" : "assegnata"} al campo ${courts.find(c => c.id === courtId)?.name} #${courts.find(c => c.id === courtId)?.number}${timeSlot ? ` alle ${timeSlot}` : ''}${durationText}`,
    });
  };

  return { processAssignment };
};
