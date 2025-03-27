
import React from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface HorizontalTimeNavProps {
  timeSlots: string[];
  activeHour: string | null;
  onHourSelect: (hour: string) => void;
}

export function HorizontalTimeNav({
  timeSlots,
  activeHour,
  onHourSelect
}: HorizontalTimeNavProps) {
  const isMobile = useIsMobile();
  
  // Get unique hours from time slots
  const getUniqueHours = (slots: string[]) => {
    const uniqueHours = new Set(slots.map(slot => slot.split(':')[0]));
    return Array.from(uniqueHours).sort((a, b) => parseInt(a) - parseInt(b));
  };

  // Get paired hours for showing ranges (8-10, 11-13, etc.)
  const getTimeRangePairs = (hours: string[]) => {
    const pairs = [];
    for (let i = 0; i < hours.length; i += 2) {
      if (i + 1 < hours.length) {
        pairs.push(`${hours[i]}-${hours[i + 1]}`);
      } else {
        // For odd number of hours, just display the last hour
        pairs.push(`${hours[i]}`);
      }
    }
    return pairs;
  };

  const hours = getUniqueHours(timeSlots);
  const hourPairs = getTimeRangePairs(hours);

  return (
    <div className="w-full mb-1">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0.5">
          {hours.map((hour) => (
            <CarouselItem key={`hour-nav-${hour}`} className="pl-0.5 basis-auto">
              <Button
                onClick={() => onHourSelect(hour)}
                variant={activeHour === hour ? "default" : "outline"}
                size="sm"
                className={`${isMobile ? 'h-6 min-w-8 text-xs px-1.5' : 'h-7 min-w-10 text-sm px-2'} font-medium`}
              >
                {hour}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={`${isMobile ? 'h-5 w-5 -left-1' : 'h-6 w-6 -left-2'}`} />
        <CarouselNext className={`${isMobile ? 'h-5 w-5 -right-1' : 'h-6 w-6 -right-2'}`} />
      </Carousel>
    </div>
  );
}
