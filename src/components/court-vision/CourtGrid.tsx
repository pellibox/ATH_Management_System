
import { useState, useEffect, useRef } from 'react';
import { CourtProps, PersonData, ActivityData } from './types';
import { Court } from './Court';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronLeft, ChevronRight, SkipBack } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VerticalTimeSlotSelector } from './time-slot/VerticalTimeSlotSelector';
import { useToast } from '@/hooks/use-toast';
import { programDetailsMap } from '@/types/player/programs';

interface CourtGridProps {
  courts: CourtProps[];
  timeSlots: string[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  onRemoveActivity: (activityId: string, timeSlot?: string) => void;
  onRenameCourt: (courtId: string, name: string) => void;
  onChangeCourtType: (courtId: string, type: string) => void;
  onChangeCourtNumber: (courtId: string, number: number) => void;
  activeHour?: string | null;
}

export default function CourtGrid({
  courts,
  timeSlots,
  onDrop,
  onActivityDrop,
  onRemovePerson,
  onRemoveActivity,
  onRenameCourt,
  onChangeCourtType,
  onChangeCourtNumber,
  activeHour: propActiveHour
}: CourtGridProps) {
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
  const getGroupId = (type: string, pairIndex: number) => `${type}-${pairIndex}`;
  
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
  }, [timeSlots, propActiveHour, courts]);
  
  // Handle hour change for a specific court group
  const handleHourChangeForGroup = (groupId: string, hour: string) => {
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
  };
  
  // Sync all sliders to the same hour
  const syncAllSliders = (hour: string) => {
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
  };
  
  // Get active hour for a specific court group
  const getActiveHourForGroup = (groupId: string): string | null => {
    return activeHoursByGroup[groupId] || null;
  };
  
  // Group courts by type for display
  const courtsByType: Record<string, CourtProps[]> = {};
  
  courts.forEach(court => {
    if (!courtsByType[court.type]) {
      courtsByType[court.type] = [];
    }
    courtsByType[court.type].push(court);
  });
  
  // Handle court navigation for mobile
  const navigateCourt = (type: string, pairIndex: number, direction: 'next' | 'prev') => {
    const key = `${type}-${pairIndex}`;
    const currentIndex = visibleCourtIndices[key] || 0;
    
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // Light vibration for navigation feedback
    }
    
    if (direction === 'next') {
      setVisibleCourtIndices({
        ...visibleCourtIndices,
        [key]: 1 // Show second court
      });
    } else {
      setVisibleCourtIndices({
        ...visibleCourtIndices,
        [key]: 0 // Show first court
      });
    }
  };
  
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
  }, [courts, toast]);
  
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
  const getCurrentBusinessHour = (): string | null => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Check if we're in business hours (8am to 10pm)
    if (currentHour >= 8 && currentHour <= 22) {
      return currentHour.toString();
    }
    
    return null;
  };
  
  const currentBusinessHour = getCurrentBusinessHour();
  
  return (
    <ScrollArea className="h-full" scrollHideDelay={0}>
      <div className="space-y-6 md:space-y-8 pb-16 pt-4">
        {/* Global navigation controls */}
        <div className="flex justify-between px-4 mb-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                // Find earliest hour and sync all
                if (timeSlots.length > 0) {
                  const firstHour = timeSlots[0].split(':')[0];
                  syncAllSliders(firstHour);
                }
              }}
              title="Vai all'inizio della giornata"
            >
              <SkipBack className="h-3 w-3 mr-1" />
              <span>Inizio</span>
            </Button>
            
            {currentBusinessHour && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => syncAllSliders(currentBusinessHour)}
                title="Vai all'ora corrente"
              >
                Ora
              </Button>
            )}
            
            {/* Diagnostic mode toggle - only in development */}
            {process.env.NODE_ENV === 'development' && (
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs ${diagnosticMode ? 'bg-amber-100' : ''}`}
                onClick={() => setDiagnosticMode(!diagnosticMode)}
              >
                {diagnosticMode ? "Debug On" : "Debug Off"}
              </Button>
            )}
          </div>
          
          {/* Test button for generating random assignments */}
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
            onClick={() => {
              toast({
                title: "TEST - Generazione casuale",
                description: "Funzionalità di test attivata - generazione in corso",
                duration: 2000,
              });
              
              // This would call some test function to generate random assignments
              // Implementation would depend on your test data generation approach
            }}
            title="Funzionalità temporanea solo per testing"
          >
            TEST - Genera Assegnazioni Casuali
          </Button>
        </div>
        
        {Object.entries(courtsByType).map(([type, typeCourts]) => {
          // Organize courts in pairs (or single if odd number)
          const courtPairs: CourtProps[][] = [];
          for (let i = 0; i < typeCourts.length; i += 2) {
            if (i + 1 < typeCourts.length) {
              courtPairs.push([typeCourts[i], typeCourts[i+1]]);
            } else {
              courtPairs.push([typeCourts[i]]);
            }
          }
          
          return (
            <div key={type} className="space-y-3 md:space-y-4">
              <h3 className="text-base md:text-lg font-semibold px-4">{type}</h3>
              
              {courtPairs.map((pair, pairIndex) => {
                // Get group ID for this pair of courts
                const groupId = getGroupId(type, pairIndex);
                
                // Get active hour for this court group
                const groupActiveHour = getActiveHourForGroup(groupId);
                
                // Get visible court index for this pair (mobile only)
                const key = `${type}-${pairIndex}`;
                const visibleCourtIndex = isMobile ? (visibleCourtIndices[key] || 0) : -1;
                
                // Track that these courts are being rendered for virtualization metrics
                pair.forEach(court => {
                  renderedCourtsRef.current.add(court.id);
                });
                
                return (
                  <div key={`pair-${type}-${pairIndex}`} className="flex gap-4 md:gap-6 px-4">
                    {/* Vertical time slot selector for this pair */}
                    <div className="w-16 md:w-20">
                      <VerticalTimeSlotSelector
                        timeSlots={timeSlots}
                        activeHour={groupActiveHour}
                        onHourChange={(hour) => handleHourChangeForGroup(groupId, hour)}
                        groupId={groupId}
                      />
                    </div>
                    
                    {/* Courts in this pair */}
                    <div className="flex-1 relative">
                      {/* Mobile navigation controls */}
                      {isMobile && pair.length > 1 && (
                        <div className="absolute top-1/2 left-0 right-0 z-50 flex justify-between transform -translate-y-1/2 pointer-events-none">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => navigateCourt(type, pairIndex, 'prev')}
                            disabled={visibleCourtIndex === 0}
                            className="h-8 w-8 rounded-full bg-white/90 shadow-md pointer-events-auto"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => navigateCourt(type, pairIndex, 'next')}
                            disabled={visibleCourtIndex === 1 || pair.length === 1}
                            className="h-8 w-8 rounded-full bg-white/90 shadow-md pointer-events-auto"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                      {/* Modified grid/display logic for mobile */}
                      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-4 md:gap-6`}>
                        {isMobile ? (
                          // In mobile, only show one court at a time
                          <Court
                            key={pair[visibleCourtIndex].id}
                            court={pair[visibleCourtIndex]}
                            timeSlots={timeSlots}
                            onDrop={onDrop}
                            onActivityDrop={onActivityDrop}
                            onRemovePerson={onRemovePerson}
                            onRemoveActivity={onRemoveActivity}
                            onRename={onRenameCourt}
                            onChangeType={onChangeCourtType}
                            onChangeNumber={onChangeCourtNumber}
                            isSidebarCollapsed={isMobile}
                            activeHour={groupActiveHour}
                          />
                        ) : (
                          // On desktop, show both courts
                          pair.map((court) => (
                            <Court
                              key={court.id}
                              court={court}
                              timeSlots={timeSlots}
                              onDrop={onDrop}
                              onActivityDrop={onActivityDrop}
                              onRemovePerson={onRemovePerson}
                              onRemoveActivity={onRemoveActivity}
                              onRename={onRenameCourt}
                              onChangeType={onChangeCourtType}
                              onChangeNumber={onChangeCourtNumber}
                              isSidebarCollapsed={isMobile}
                              activeHour={groupActiveHour}
                            />
                          ))
                        )}
                      </div>
                      
                      {/* Court pagination indicator for mobile */}
                      {isMobile && pair.length > 1 && (
                        <div className="flex justify-center mt-2 gap-1">
                          <div 
                            className={`h-2 w-2 rounded-full ${
                              visibleCourtIndex === 0 ? 'bg-blue-500' : 'bg-gray-300'
                            }`} 
                          />
                          <div 
                            className={`h-2 w-2 rounded-full ${
                              visibleCourtIndex === 1 ? 'bg-blue-500' : 'bg-gray-300'
                            }`} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
        
        {Object.keys(courtsByType).length === 0 && (
          <div className="text-center py-6 md:py-12 bg-gray-50 rounded-lg mx-4">
            <p className="text-base md:text-lg text-gray-500">Non ci sono campi configurati per questo tipo</p>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              Puoi aggiungere campi dalle Impostazioni → Campi
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
