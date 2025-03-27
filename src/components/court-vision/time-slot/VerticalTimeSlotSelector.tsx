
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

interface VerticalTimeSlotSelectorProps {
  timeSlots: string[];
  activeHour: string | null;
  onHourChange: (hour: string) => void;
  groupId: string; // Unique ID for court group to maintain independent state
}

export function VerticalTimeSlotSelector({ 
  timeSlots, 
  activeHour, 
  onHourChange,
  groupId
}: VerticalTimeSlotSelectorProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isGlobalSync, setIsGlobalSync] = useState(false);
  
  // Get unique hours from time slots
  const getUniqueHours = (slots: string[]) => {
    const uniqueHours = new Set(slots.map(slot => slot.split(':')[0]));
    return Array.from(uniqueHours).sort((a, b) => parseInt(a) - parseInt(b));
  };

  // Get all hours for timeline
  const hours = getUniqueHours(timeSlots);
  
  // Get current hour index for slider
  const getCurrentHourIndex = () => {
    if (!activeHour) return 0;
    const index = hours.indexOf(activeHour);
    return index >= 0 ? index : 0;
  };

  // Handle slider change with debounce
  const handleSliderChange = (value: number[]) => {
    const hourIndex = value[0];
    if (hourIndex >= 0 && hourIndex < hours.length) {
      onHourChange(hours[hourIndex]);
      
      // If in global sync mode, broadcast to localStorage for other sliders to pick up
      if (isGlobalSync) {
        localStorage.setItem('courtVision_globalHour', hours[hourIndex]);
        localStorage.setItem('courtVision_globalSync_timestamp', Date.now().toString());
      }
    }
  };
  
  // Handle precision navigation for small increments
  const handlePrecisionChange = (direction: 'up' | 'down') => {
    const currentIndex = getCurrentHourIndex();
    let newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Boundary checks
    if (newIndex < 0) {
      newIndex = 0;
      // Add haptic feedback (vibration) if supported
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      toast({
        title: "Inizio giornata",
        description: "Sei all'inizio del calendario giornaliero",
        duration: 1500,
      });
    } else if (newIndex >= hours.length) {
      newIndex = hours.length - 1;
      // Add haptic feedback (vibration) if supported
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      toast({
        title: "Fine giornata",
        description: "Sei alla fine del calendario giornaliero",
        duration: 1500,
      });
    }
    
    if (newIndex !== currentIndex) {
      onHourChange(hours[newIndex]);
    }
  };
  
  // Listen for global sync events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'courtVision_globalSync_timestamp' && isGlobalSync) {
        const globalHour = localStorage.getItem('courtVision_globalHour');
        if (globalHour && globalHour !== activeHour) {
          onHourChange(globalHour);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isGlobalSync, activeHour, onHourChange]);
  
  // Categorize hours for quick jumps
  const getTimeCategories = () => {
    const morningHours = hours.filter(h => parseInt(h) >= 8 && parseInt(h) < 12);
    const afternoonHours = hours.filter(h => parseInt(h) >= 12 && parseInt(h) < 17);
    const eveningHours = hours.filter(h => parseInt(h) >= 17);
    
    return {
      morning: morningHours[0],
      afternoon: afternoonHours[0],
      evening: eveningHours[0]
    };
  };
  
  const timeCategories = getTimeCategories();
  
  // Get time range labels for display
  const getTimeRangeLabels = () => {
    if (hours.length === 0) return { start: "08:00", mid: "15:00", end: "21:00" };
    
    const start = hours[0] + ":00";
    const end = hours[hours.length - 1] + ":00";
    
    // Find middle hour
    const midIndex = Math.floor(hours.length / 2);
    const mid = hours[midIndex] + ":00";
    
    return { start, mid, end };
  };
  
  // Save slider position to sessionStorage when unmounting or when position changes
  useEffect(() => {
    if (activeHour) {
      sessionStorage.setItem(`courtVision_sliderPosition_${groupId}`, activeHour);
    }
    
    // Restore position on component mount
    const savedPosition = sessionStorage.getItem(`courtVision_sliderPosition_${groupId}`);
    if (savedPosition && !activeHour) {
      onHourChange(savedPosition);
    }
  }, [activeHour, groupId, onHourChange]);
  
  const timeLabels = getTimeRangeLabels();
  
  return (
    <div className="h-full flex flex-col justify-start py-4 px-2 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-blue-600" />
          <h3 className="text-xs font-medium">Orario</h3>
        </div>
        
        {/* Global sync toggle button */}
        <button 
          className={`text-xs px-1.5 py-0.5 rounded ${isGlobalSync ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
          onClick={() => {
            setIsGlobalSync(!isGlobalSync);
            toast({
              title: isGlobalSync ? "Sync disattivato" : "Sync attivato",
              description: isGlobalSync ? "Slider indipendenti" : "Tutti gli slider sincronizzati",
              duration: 2000,
            });
          }}
        >
          {isGlobalSync ? "Sync On" : "Sync Off"}
        </button>
      </div>
      
      {/* Quick jump buttons */}
      <div className="flex justify-between text-xs mb-3">
        {timeCategories.morning && (
          <button 
            className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded"
            onClick={() => onHourChange(timeCategories.morning)}
          >
            AM
          </button>
        )}
        {timeCategories.afternoon && (
          <button 
            className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded"
            onClick={() => onHourChange(timeCategories.afternoon)}
          >
            PM
          </button>
        )}
        {timeCategories.evening && (
          <button 
            className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded"
            onClick={() => onHourChange(timeCategories.evening)}
          >
            Sera
          </button>
        )}
      </div>
      
      {/* Precision controls */}
      <button 
        className="mb-2 text-gray-500 hover:bg-gray-100 rounded-full p-1 transition-colors"
        onClick={() => handlePrecisionChange('up')}
        aria-label="Scorri in alto"
      >
        <ChevronUp className="h-4 w-4 mx-auto" />
      </button>
      
      {/* Vertical slider for time selection */}
      <div className="flex-1 flex flex-col h-full">
        <div className="h-full flex items-center cursor-ns-resize">
          <Slider
            defaultValue={[getCurrentHourIndex()]}
            value={[getCurrentHourIndex()]}
            max={hours.length - 1}
            step={1}
            onValueChange={handleSliderChange}
            orientation="vertical"
            className="h-full mx-auto"
          />
        </div>
        
        {/* Mini timeline preview (simplified) */}
        <div className="h-16 w-3 mx-auto my-2 bg-gray-100 rounded-full overflow-hidden relative">
          {hours.map((hour, index) => {
            // Create a mini preview of occupancy (just for visual reference)
            const density = Math.random(); // In a real app, this would be calculated from actual bookings
            return (
              <div 
                key={hour}
                className={`absolute w-full h-[${100 / hours.length}%] left-0`}
                style={{ 
                  top: `${(index / hours.length) * 100}%`,
                  height: `${100 / hours.length}%`,
                  backgroundColor: density > 0.7 ? '#ef4444' : 
                                  density > 0.4 ? '#f59e0b' : 
                                  density > 0.1 ? '#3b82f6' : 'transparent',
                  opacity: 0.6
                }}
              />
            );
          })}
          <div 
            className="absolute w-full h-1 bg-black left-0"
            style={{ 
              top: `${(getCurrentHourIndex() / hours.length) * 100}%`
            }}
          />
        </div>
        
        <button 
          className="mt-2 text-gray-500 hover:bg-gray-100 rounded-full p-1 transition-colors"
          onClick={() => handlePrecisionChange('down')}
          aria-label="Scorri in basso"
        >
          <ChevronDown className="h-4 w-4 mx-auto" />
        </button>
        
        {/* Current time display */}
        <div className="text-center text-xs font-medium text-gray-700 mt-2">
          {activeHour ? `${activeHour}:00` : "Seleziona"}
        </div>
      </div>
    </div>
  );
}
