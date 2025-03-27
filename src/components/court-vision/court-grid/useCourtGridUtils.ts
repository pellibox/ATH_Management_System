
import { useState, useRef, useEffect, useMemo } from "react";
import { CourtProps } from "../types";
import { useIsMobile } from "@/hooks/use-mobile";

export const useCourtGridUtils = (
  courts: CourtProps[],
  timeSlots: string[],
  propActiveHour: string | null
) => {
  const isMobile = useIsMobile();
  const [activeHoursByGroup, setActiveHoursByGroup] = useState<Record<string, string>>({});
  const [visibleCourtIndices, setVisibleCourtIndices] = useState<Record<string, number[]>>({});
  const [diagnosticMode, setDiagnosticMode] = useState(false);
  const renderedCourtsRef = useRef<HTMLDivElement>(null);

  // Get unique hours from time slots
  const getUniqueHours = (slots: string[]): string[] => {
    return Array.from(new Set(slots.map(slot => slot.split(':')[0]))).sort();
  };

  // Generate court group IDs
  const getGroupId = (type: string, pairIndex: number): string => `${type}-${pairIndex}`;

  // Get all unique court types
  const courtTypes = useMemo(() => {
    return Array.from(new Set(courts.map(court => court.type)));
  }, [courts]);

  // Initialize active hours for each group
  useEffect(() => {
    if (propActiveHour) {
      // If a propActiveHour is provided, use it for all groups
      const newActiveHours: Record<string, string> = {};
      
      courtTypes.forEach(type => {
        const courtsByType = courts.filter(court => court.type === type);
        
        for (let i = 0; i < courtsByType.length; i += 2) {
          const pairIndex = Math.floor(i / 2);
          const groupId = getGroupId(type, pairIndex);
          newActiveHours[groupId] = propActiveHour;
        }
      });
      
      setActiveHoursByGroup(newActiveHours);
    } else {
      // Initialize with current hour or first available hour
      const currentHour = new Date().getHours().toString();
      const uniqueHours = getUniqueHours(timeSlots);
      const defaultHour = uniqueHours.includes(currentHour) ? currentHour : uniqueHours[0];
      
      // Create initial active hours for all court groups
      const initialActiveHours: Record<string, string> = {};
      
      courtTypes.forEach(type => {
        const courtsByType = courts.filter(court => court.type === type);
        
        for (let i = 0; i < courtsByType.length; i += 2) {
          const pairIndex = Math.floor(i / 2);
          const groupId = getGroupId(type, pairIndex);
          initialActiveHours[groupId] = defaultHour;
        }
      });
      
      setActiveHoursByGroup(initialActiveHours);
    }
  }, [courts, courtTypes, propActiveHour, timeSlots]);
  
  // Initialize visible court indices
  useEffect(() => {
    const initialVisibleIndices: Record<string, number[]> = {};
    
    courtTypes.forEach(type => {
      const courtsByType = courts.filter(court => court.type === type);
      
      for (let i = 0; i < courtsByType.length; i += 2) {
        const pairIndex = Math.floor(i / 2);
        const groupId = getGroupId(type, pairIndex);
        
        // Store visible indices
        if (i + 1 < courtsByType.length) {
          initialVisibleIndices[groupId] = [0, 1]; // Both courts visible initially
        } else {
          initialVisibleIndices[groupId] = [0]; // Only one court in this pair
        }
      }
    });
    
    setVisibleCourtIndices(initialVisibleIndices);
  }, [courts, courtTypes]);

  // Handle hour change for a specific group
  const handleHourChangeForGroup = (groupId: string, hour: string) => {
    setActiveHoursByGroup(prev => ({
      ...prev,
      [groupId]: hour
    }));
  };

  // Sync all sliders to the same hour
  const syncAllSliders = (hour: string) => {
    const newActiveHours: Record<string, string> = {};
    
    // Update all group hours
    courtTypes.forEach(type => {
      const courtsByType = courts.filter(court => court.type === type);
      
      for (let i = 0; i < courtsByType.length; i += 2) {
        const pairIndex = Math.floor(i / 2);
        const groupId = getGroupId(type, pairIndex);
        newActiveHours[groupId] = hour;
      }
    });
    
    setActiveHoursByGroup(newActiveHours);
  };

  // Get the current business hour
  const getCurrentBusinessHour = (): string | null => {
    const now = new Date();
    const currentHour = now.getHours().toString();
    
    // Check if current hour is in timeSlots
    const uniqueHours = getUniqueHours(timeSlots);
    return uniqueHours.includes(currentHour) ? currentHour : null;
  };

  // Navigate to a specific court
  const navigateCourt = (courtId: string) => {
    // Find the court element by ID
    const courtElement = document.getElementById(`court-${courtId}`);
    if (courtElement && renderedCourtsRef.current) {
      // Scroll to the court
      courtElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return {
    isMobile,
    activeHoursByGroup,
    visibleCourtIndices,
    renderedCourtsRef,
    diagnosticMode,
    setDiagnosticMode,
    getGroupId,
    handleHourChangeForGroup,
    syncAllSliders,
    navigateCourt,
    getCurrentBusinessHour
  };
};
