
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
  const [visibleCourtIndices, setVisibleCourtIndices] = useState<Record<string, number>>({});
  const [diagnosticMode, setDiagnosticMode] = useState(false);
  const renderedCourtsRef = useRef<HTMLDivElement>(null);

  // Get unique hours from time slots
  const getUniqueHours = (slots: string[]): string[] => {
    return Array.from(new Set(slots.map(slot => slot.split(':')[0]))).sort();
  };

  // Generate court group IDs
  const getGroupId = (type: string): string => `${type}`;

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
        const groupId = getGroupId(type);
        newActiveHours[groupId] = propActiveHour;
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
        const groupId = getGroupId(type);
        initialActiveHours[groupId] = defaultHour;
      });
      
      setActiveHoursByGroup(initialActiveHours);
    }
  }, [courts, courtTypes, propActiveHour, timeSlots]);
  
  // Initialize visible court indices
  useEffect(() => {
    const initialVisibleIndices: Record<string, number> = {};
    
    courtTypes.forEach(type => {
      const groupId = getGroupId(type);
      initialVisibleIndices[groupId] = 0; // First court visible initially
    });
    
    setVisibleCourtIndices(initialVisibleIndices);
  }, [courts, courtTypes]);

  // Handle hour change for a specific group
  const handleHourChangeForGroup = (hour: string, groupId: string) => {
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
      const groupId = getGroupId(type);
      newActiveHours[groupId] = hour;
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
  const navigateCourt = (key: string, direction: 'prev' | 'next') => {
    setVisibleCourtIndices(prev => {
      const current = prev[key] || 0;
      if (direction === 'prev' && current > 0) {
        return { ...prev, [key]: current - 1 };
      } else if (direction === 'next') {
        return { ...prev, [key]: current + 1 };
      }
      return prev;
    });
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
