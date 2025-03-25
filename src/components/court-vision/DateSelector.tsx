
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { format, addDays, subDays } from "date-fns";

export interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const goToNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  const goToPreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  return (
    <div className="flex items-center space-x-2 bg-white p-2 rounded-xl shadow-soft">
      <Button variant="outline" size="icon" onClick={goToPreviousDay}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(selectedDate, "EEEE, d MMMM yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                onDateChange(date);
                setIsOpen(false);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      <Button variant="outline" size="icon" onClick={goToNextDay}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
