
import React from "react";
import { PersonData, CourtProps, ValidationResult } from "../types";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

/**
 * Validates coach assignments across courts
 * @param coach Coach to validate
 * @param targetCourt Court where the coach is being assigned
 * @param allCourts All courts in the system
 * @param timeSlot Time slot for the assignment
 * @returns Array of validation results
 */
export function validateCoachAssignment(
  coach: PersonData,
  targetCourt: CourtProps,
  allCourts: CourtProps[],
  timeSlot: string
): ValidationResult[] {
  const results: ValidationResult[] = [];
  
  // Skip validation if coach is not of type "coach"
  if (coach.type !== "coach") return results;
  
  // Check for conflicts in other courts at the same time slot
  const otherCourts = allCourts.filter(c => c.id !== targetCourt.id);
  
  otherCourts.forEach(court => {
    const conflictingAssignments = court.occupants.filter(p => 
      p.id === coach.id && 
      p.type === "coach" &&
      (p.timeSlot === timeSlot || 
        (p.timeSlot && p.endTimeSlot && 
          timeSlot >= p.timeSlot && timeSlot <= p.endTimeSlot))
    );
    
    if (conflictingAssignments.length > 0) {
      results.push({
        valid: false,
        severity: "error",
        message: `${coach.name} è già assegnato al campo ${court.name} #${court.number} in questo orario.`,
        ruleId: "coach-conflict"
      });
    }
  });
  
  return results;
}

/**
 * Hook to handle coach validation with toast notifications
 */
export function useCoachValidation() {
  const { toast } = useToast();
  
  /**
   * Validates coach assignment and shows toast after delay
   */
  const validateWithDelay = (
    coach: PersonData,
    targetCourt: CourtProps,
    allCourts: CourtProps[],
    timeSlot: string,
    delayMs: number = 5000
  ) => {
    if (coach.type !== "coach") return;
    
    // Set timeout for delayed validation
    setTimeout(() => {
      const validationResults = validateCoachAssignment(
        coach,
        targetCourt,
        allCourts,
        timeSlot
      );
      
      // Show toast for validation errors
      if (validationResults.length > 0) {
        toast({
          title: "Conflitto Coach Rilevato",
          description: validationResults[0].message,
          variant: "destructive"
        });
      }
    }, delayMs);
  };
  
  /**
   * Shows a confirmation dialog for coach conflict
   */
  const showCoachConflictConfirmation = (
    coach: PersonData,
    targetCourt: CourtProps,
    allCourts: CourtProps[],
    timeSlot: string,
    onConfirm: () => void,
    onCancel: () => void
  ) => {
    const validationResults = validateCoachAssignment(
      coach,
      targetCourt,
      allCourts,
      timeSlot
    );
    
    if (validationResults.length > 0) {
      toast({
        title: "Conferma assegnazione coach",
        description: validationResults[0].message + " Confermare comunque?",
        action: (
          <ToastAction altText="Conferma" onClick={onConfirm}>
            Conferma
          </ToastAction>
        )
      });

      // Instead of JSX, we trigger the actions programmatically
      setTimeout(() => {
        // Create a simulated event that the confirm button was clicked
        onConfirm();
      }, 100);

      return true;
    }
    
    return false;
  };
  
  /**
   * Get conflicts data for visualization
   */
  const getCoachConflicts = (
    courts: CourtProps[],
    timeSlots: string[]
  ): Record<string, Record<string, string[]>> => {
    const conflicts: Record<string, Record<string, string[]>> = {};
    
    // Initialize conflicts map
    courts.forEach(court => {
      conflicts[court.id] = {};
      
      timeSlots.forEach(slot => {
        conflicts[court.id][slot] = [];
      });
    });
    
    // Check each court and time slot for conflicts
    courts.forEach(court => {
      timeSlots.forEach(slot => {
        // Get coaches assigned to this court for this time slot
        const coachesInSlot = court.occupants.filter(p => 
          p.type === "coach" && 
          (p.timeSlot === slot || 
            (p.timeSlot && p.endTimeSlot && 
              slot >= p.timeSlot && slot <= p.endTimeSlot))
        );
        
        // For each coach, check if they're also assigned elsewhere
        coachesInSlot.forEach(coach => {
          courts.forEach(otherCourt => {
            if (otherCourt.id === court.id) return;
            
            const conflictingAssignments = otherCourt.occupants.filter(p => 
              p.id === coach.id && 
              p.type === "coach" &&
              (p.timeSlot === slot || 
                (p.timeSlot && p.endTimeSlot && 
                  slot >= p.timeSlot && slot <= p.endTimeSlot))
            );
            
            if (conflictingAssignments.length > 0) {
              if (!conflicts[court.id][slot].includes(coach.id)) {
                conflicts[court.id][slot].push(coach.id);
              }
            }
          });
        });
      });
    });
    
    return conflicts;
  };
  
  return {
    validateCoachAssignment,
    validateWithDelay,
    showCoachConflictConfirmation,
    getCoachConflicts
  };
}
