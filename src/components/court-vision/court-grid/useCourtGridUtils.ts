
import { useState, useRef, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { CourtProps } from "../types";

export function useCourtGridUtils(courts: CourtProps[], timeSlots: string[], propActiveHour: string | null | undefined) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Maintain independent hour for each court type group
  const [activeHoursByGroup, setActiveHoursByGroup] = useState<Record<string, string | null>>({});
  
  // For mobile: track visible court in each pair
  const [visibleCourtIndices, setVisibleCourtIndices] = useState<Record<string, number>>({});
  
  // For virtualization: track rendered courts to optimize performance
  const renderedCourtsRef = useRef<Set<string>>(new Set());
  
  // For optimization: track scroll positions to restore when coming back to the page
  const scrollPositionsByGroup = useRef<Record<string, number>>({});
  
  // For performance monitoring
  const perfMetricsRef = useRef({
    renderCount: 0,
    lastRenderTime: Date.now(),
    sliderMoveCount: 0,
  });
  
  // Track diagnostic mode for troubleshooting
  const [diagnosticMode, setDiagnosticMode] = useState(false);
  
  // Function to generate a unique ID for each court group
  const getGroupId = useCallback((type: string, pairIndex: number) => `${type}-${pairIndex}`, []);
  
  // Initialize currentActiveHour from the first time slot on component mount or when propActiveHour changes
  useEffect(() => {
    if (propActiveHour) {
      // Initialize all court type groups with the same hour if not set yet
      const initialHoursByGroup: Record<string, string | null> = {};
      
      // Group courts by type
      const courtsByType: Record<string, CourtProps[]> = {};
      courts.forEach(court => {
        if (!courtsByType[court.type]) {
          courtsByType[court.type] = [];
        }
        courtsByType[court.type].push(court);
      });
      
      // Create pairs and initialize hours
      Object.entries(courtsByType).forEach(([type, typeCourts]) => {
        for (let i = 0; i < typeCourts.length; i += 2) {
          const groupId = getGroupId(type, Math.floor(i / 2));
          if (!activeHoursByGroup[groupId]) {
            initialHoursByGroup[groupId] = propActiveHour;
          }
        }
      });
      
      // Only update state if there are new values to set
      if (Object.keys(initialHoursByGroup).length > 0) {
        setActiveHoursByGroup(prev => ({
          ...prev,
          ...initialHoursByGroup
        }));
      }
    } else if (timeSlots.length > 0) {
      // If no active hour is provided, initialize with first hour from time slots
      const firstHour = timeSlots[0].split(':')[0];
      
      // Group courts by type
      const courtsByType: Record<string, CourtProps[]> = {};
      courts.forEach(court => {
        if (!courtsByType[court.type]) {
          courtsByType[court.type] = [];
        }
        courtsByType[court.type].push(court);
      });
      
      // Create pairs and initialize hours
      const initialHoursByGroup: Record<string, string | null> = {};
      Object.entries(courtsByType).forEach(([type, typeCourts]) => {
        for (let i = 0; i < typeCourts.length; i += 2) {
          const groupId = getGroupId(type, Math.floor(i / 2));
          initialHoursByGroup[groupId] = firstHour;
        }
      });
      
      setActiveHoursByGroup(initialHoursByGroup);
    }
  }, [timeSlots, propActiveHour, courts, getGroupId, activeHoursByGroup]);
  
  // Handle hour change for a specific court group
  const handleHourChangeForGroup = useCallback((groupId: string, hour: string) => {
    // Increment metrics for performance tracking
    perfMetricsRef.current.sliderMoveCount++;
    
    // Update the specific court group's hour
    setActiveHoursByGroup(prev => ({
      ...prev,
      [groupId]: hour
    }));
    
    // Save to session storage for persistence
    try {
      sessionStorage.setItem(`courtVision_hourByGroup_${groupId}`, hour);
    } catch (e) {
      console.warn('Failed to save hour to sessionStorage', e);
    }
  }, []);
  
  // Sync all sliders to the same hour
  const syncAllSliders = useCallback((hour: string) => {
    // Create a new object with the same hour for all groups
    const syncedHours: Record<string, string> = {};
    
    // Apply to all existing groups
    Object.keys(activeHoursByGroup).forEach(groupId => {
      syncedHours[groupId] = hour;
    });
    
    // Update state
    setActiveHoursByGroup(syncedHours);
    
    // Show confirmation
    toast({
      title: "Sincronizzazione completata",
      description: `Tutti i campi sincronizzati alle ${hour}:00`,
      duration: 2000,
    });
    
    // Broadcast through localStorage for other components
    localStorage.setItem('courtVision_globalHour', hour);
    localStorage.setItem('courtVision_globalSync_timestamp', Date.now().toString());
  }, [activeHoursByGroup, toast]);
  
  // Handle court navigation for mobile
  const navigateCourt = useCallback((type: string, pairIndex: number, direction: 'next' | 'prev') => {
    const key = `${type}-${pairIndex}`;
    
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // Light vibration for navigation feedback
    }
    
    if (direction === 'next') {
      setVisibleCourtIndices(prev => ({
        ...prev,
        [key]: 1 // Show second court
      }));
    } else {
      setVisibleCourtIndices(prev => ({
        ...prev,
        [key]: 0 // Show first court
      }));
    }
  }, []);
  
  // Restore saved slider positions from session storage on component mount
  useEffect(() => {
    // Group courts by type
    const courtsByType: Record<string, CourtProps[]> = {};
    courts.forEach(court => {
      if (!courtsByType[court.type]) {
        courtsByType[court.type] = [];
      }
      courtsByType[court.type].push(court);
    });
    
    // Check for saved positions
    const savedPositions: Record<string, string | null> = {};
    let hasRestoredPositions = false;
    
    Object.entries(courtsByType).forEach(([type, typeCourts]) => {
      for (let i = 0; i < typeCourts.length; i += 2) {
        const groupId = getGroupId(type, Math.floor(i / 2));
        try {
          const savedHour = sessionStorage.getItem(`courtVision_hourByGroup_${groupId}`);
          if (savedHour) {
            savedPositions[groupId] = savedHour;
            hasRestoredPositions = true;
          }
        } catch (e) {
          console.warn('Failed to restore hour from sessionStorage', e);
        }
      }
    });
    
    // Only update state if we actually found saved positions
    if (hasRestoredPositions) {
      setActiveHoursByGroup(prev => ({
        ...prev,
        ...savedPositions
      }));
      
      toast({
        title: "Posizioni ripristinate",
        description: "Le posizioni degli slider sono state ripristinate",
        duration: 2000,
      });
    }
    
    // Clean up function to save scroll positions when leaving
    return () => {
      Object.entries(scrollPositionsByGroup.current).forEach(([groupId, position]) => {
        try {
          sessionStorage.setItem(`courtVision_scrollPosition_${groupId}`, position.toString());
        } catch (e) {
          console.warn('Failed to save scroll position to sessionStorage', e);
        }
      });
    };
  }, [courts, toast, getGroupId]);
  
  // Schedule periodic performance logging
  useEffect(() => {
    if (diagnosticMode) {
      const interval = setInterval(() => {
        console.log('Performance metrics:', {
          renderCount: perfMetricsRef.current.renderCount,
          lastRenderTime: perfMetricsRef.current.lastRenderTime,
          timeSinceLastRender: Date.now() - perfMetricsRef.current.lastRenderTime,
          sliderMoveCount: perfMetricsRef.current.sliderMoveCount,
          visibleCourts: renderedCourtsRef.current.size
        });
        
        // Reset metrics
        perfMetricsRef.current.renderCount = 0;
        perfMetricsRef.current.sliderMoveCount = 0;
        perfMetricsRef.current.lastRenderTime = Date.now();
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [diagnosticMode]);
  
  // Track render performance
  useEffect(() => {
    perfMetricsRef.current.renderCount++;
    perfMetricsRef.current.lastRenderTime = Date.now();
  });
  
  // Generate current time of day if in business hours for "jump to now" feature
  const getCurrentBusinessHour = useCallback((): string | null => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Check if we're in business hours (8am to 10pm)
    if (currentHour >= 8 && currentHour <= 22) {
      return currentHour.toString();
    }
    
    return null;
  }, []);

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
}
