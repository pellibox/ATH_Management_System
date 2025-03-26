
import React from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

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
  const getUniqueHours = (slots: string[]) => {
    const uniqueHours = new Set(slots.map(slot => slot.split(':')[0]));
    return Array.from(uniqueHours);
  };

  const hours = getUniqueHours(timeSlots);

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
            <CarouselItem key={`horizontal-nav-${hour}`} className="pl-0.5 basis-auto">
              <Button
                onClick={() => onHourSelect(hour)}
                variant={activeHour === hour ? "default" : "outline"}
                size="sm"
                className="h-7 min-w-10 text-xs font-medium px-2"
              >
                {hour}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="h-6 w-6 -left-2" />
        <CarouselNext className="h-6 w-6 -right-2" />
      </Carousel>
    </div>
  );
}
