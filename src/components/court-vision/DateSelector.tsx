
import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Copy, CalendarDays, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onCopyToNextDay: () => void;
  onCopyToWeek: () => void;
}

export function DateSelector({ 
  selectedDate, 
  onDateChange,
  onCopyToNextDay,
  onCopyToWeek
}: DateSelectorProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-3 rounded-xl shadow-soft">
      <div className="flex items-center">
        <Calendar className="h-5 w-5 text-ath-blue mr-2" />
        <span className="font-medium">Schedule for:</span>
      </div>
      
      <Popover open={showCalendar} onOpenChange={setShowCalendar}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="border border-gray-300 bg-white"
          >
            <span>{format(selectedDate, "MMMM d, yyyy")}</span>
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              onDateChange(date || new Date());
              setShowCalendar(false);
            }}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
      
      <div className="flex items-center gap-2 ml-auto">
        <Button 
          variant="outline" 
          className="text-sm" 
          onClick={onCopyToNextDay}
        >
          <Copy className="h-4 w-4 mr-1.5" />
          Copy to Next Day
        </Button>
        
        <Button 
          variant="outline" 
          className="text-sm" 
          onClick={onCopyToWeek}
        >
          <CalendarDays className="h-4 w-4 mr-1.5" />
          Copy to Next Week
        </Button>
      </div>
    </div>
  );
}
