import { PersonData, ActivityData, CourtProps, ValidationRule, ValidationResult } from "../types";
import { hasExceededDailyLimit, isCoachAssignmentValid, calculateHealthScore } from "../utils/personUtils";
import { useToast } from "@/hooks/use-toast";

/**
 * Default validation rules for the court vision system
 */
export const DEFAULT_VALIDATION_RULES: ValidationRule[] = [
  {
    id: "coach-conflict",
    name: "Coach Conflict",
    description: "Coach cannot be assigned to multiple courts at the same time",
    severity: "error",
    checkFunction: (data: { coach: PersonData, otherAssignments: PersonData[] }) => {
      const { coach, otherAssignments } = data;
      // Simplified check - in real implementation, would check specific time overlap
      return otherAssignments.length === 0;
    },
    messageFunction: (data: { coach: PersonData, otherAssignments: PersonData[] }) => {
      const { coach } = data;
      return `${coach.name} è assegnato contemporaneamente su più campi.`;
    }
  },
  {
    id: "player-hours-limit",
    name: "Player Hours Limit",
    description: "Player cannot exceed daily hours limit from their program",
    severity: "warning",
    checkFunction: (data: { player: PersonData }) => {
      return !hasExceededDailyLimit(data.player);
    },
    messageFunction: (data: { player: PersonData }) => {
      const { player } = data;
      return `${player.name} ha superato il limite di ore giornaliere da programma.`;
    }
  },
  {
    id: "coach-coverage",
    name: "Coach Coverage",
    description: "Coach should cover the entire session for assigned players",
    severity: "warning",
    checkFunction: (data: { coach: PersonData, players: PersonData[] }) => {
      return isCoachAssignmentValid(data.coach, data.players);
    },
    messageFunction: (data: { coach: PersonData, players: PersonData[] }) => {
      const { coach } = data;
      return `${coach.name} non copre l'intera durata della sessione dei giocatori assegnati.`;
    }
  }
];

/**
 * Custom hook for validation functionality
 */
export function useValidationManager() {
  const { toast } = useToast();
  
  /**
   * Validate a court's assignments
   */
  const validateCourt = (
    court: CourtProps,
    allCourts: CourtProps[],
    timeSlots: string[],
    validationRules: ValidationRule[] = DEFAULT_VALIDATION_RULES
  ): {
    courtId: string,
    results: ValidationResult[],
    healthScore: number,
    conflicts: Record<string, string[]>
  } => {
    const results: ValidationResult[] = [];
    const conflicts: Record<string, string[]> = {};
    
    // Group occupants by time slot for conflict detection
    timeSlots.forEach(timeSlot => {
      // Initialize conflicts array for this time slot
      conflicts[timeSlot] = [];
      
      // Check for coach conflicts across courts for this time slot
      const coaches = court.occupants.filter(p => 
        p.type === "coach" && 
        (p.timeSlot === timeSlot || 
          (p.timeSlot && p.endTimeSlot && 
            timeSlot >= p.timeSlot && timeSlot <= p.endTimeSlot))
      );
      
      coaches.forEach(coach => {
        // Check if this coach is assigned to any other court at this time
        const otherCourts = allCourts.filter(c => c.id !== court.id);
        
        otherCourts.forEach(otherCourt => {
          const conflictingAssignments = otherCourt.occupants.filter(p => 
            p.id === coach.id && 
            p.type === "coach" &&
            (p.timeSlot === timeSlot || 
              (p.timeSlot && p.endTimeSlot && 
                timeSlot >= p.timeSlot && timeSlot <= p.endTimeSlot))
          );
          
          if (conflictingAssignments.length > 0) {
            // Add to conflicts
            if (!conflicts[timeSlot].includes(coach.id)) {
              conflicts[timeSlot].push(coach.id);
            }
            
            // Add validation result
            results.push({
              valid: false,
              severity: "error",
              message: `${coach.name} è assegnato contemporaneamente al campo ${court.name} #${court.number} e al campo ${otherCourt.name} #${otherCourt.number} alle ${timeSlot}`,
              ruleId: "coach-conflict"
            });
          }
        });
      });
      
      // Check for player daily limits
      const players = court.occupants.filter(p => 
        p.type === "player" && 
        (p.timeSlot === timeSlot || 
          (p.timeSlot && p.endTimeSlot && 
            timeSlot >= p.timeSlot && timeSlot <= p.endTimeSlot))
      );
      
      players.forEach(player => {
        if (hasExceededDailyLimit(player)) {
          results.push({
            valid: false,
            severity: "warning",
            message: `${player.name} ha superato il limite di ore giornaliere da programma.`,
            ruleId: "player-hours-limit"
          });
        }
      });
    });
    
    // Calculate health score
    const healthScore = calculateHealthScore(court.occupants, court.activities, validationRules);
    
    return {
      courtId: court.id,
      results,
      healthScore,
      conflicts
    };
  };
  
  /**
   * Validate all courts
   */
  const validateAllCourts = (
    courts: CourtProps[],
    timeSlots: string[],
    validationRules: ValidationRule[] = DEFAULT_VALIDATION_RULES
  ) => {
    const allResults: Record<string, ValidationResult[]> = {};
    const allConflicts: Record<string, Record<string, string[]>> = {};
    let totalHealthScore = 0;
    
    courts.forEach(court => {
      const { results, healthScore, conflicts } = validateCourt(
        court, 
        courts, 
        timeSlots, 
        validationRules
      );
      
      allResults[court.id] = results;
      allConflicts[court.id] = conflicts;
      totalHealthScore += healthScore;
    });
    
    // Calculate average health score
    const averageHealthScore = courts.length > 0 ? 
      Math.round(totalHealthScore / courts.length) : 100;
    
    // Show toast with overall validation results
    const totalIssues = Object.values(allResults)
      .flat()
      .filter(r => !r.valid).length;
    
    if (totalIssues > 0) {
      toast({
        title: `Validazione completata: ${averageHealthScore}%`,
        description: `Trovati ${totalIssues} problemi da risolvere`,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Validazione completata: 100%",
        description: "Nessun problema rilevato",
        variant: "default"
      });
    }
    
    return {
      results: allResults,
      conflicts: allConflicts,
      healthScore: averageHealthScore
    };
  };
  
  return {
    validateCourt,
    validateAllCourts
  };
}

/**
 * Run simplified validation check for a specific assignment
 */
export function quickValidateAssignment(
  person: PersonData,
  targetCourt: CourtProps,
  allCourts: CourtProps[],
  timeSlot: string
): ValidationResult[] {
  const results: ValidationResult[] = [];
  
  // Check coach conflict
  if (person.type === "coach") {
    // Look for this coach in other courts at the same time
    const otherCourts = allCourts.filter(c => c.id !== targetCourt.id);
    
    otherCourts.forEach(court => {
      const conflictingAssignments = court.occupants.filter(p => 
        p.id === person.id && 
        p.type === "coach" &&
        (p.timeSlot === timeSlot || 
          (p.timeSlot && p.endTimeSlot && 
            timeSlot >= p.timeSlot && timeSlot <= p.endTimeSlot))
      );
      
      if (conflictingAssignments.length > 0) {
        results.push({
          valid: false,
          severity: "error",
          message: `${person.name} è già assegnato al campo ${court.name} #${court.number} in questo orario.`,
          ruleId: "coach-conflict"
        });
      }
    });
  }
  
  // Check player daily limits
  if (person.type === "player") {
    const durationHours = person.durationHours || 1;
    const currentHours = person.hoursAssigned || 0;
    const dailyLimit = person.dailyLimit || 2;
    
    if (currentHours + durationHours > dailyLimit) {
      results.push({
        valid: false,
        severity: "warning",
        message: `${person.name} supererà il limite di ${dailyLimit} ore giornaliere con questa assegnazione.`,
        ruleId: "player-hours-limit"
      });
    }
  }
  
  return results;
}
