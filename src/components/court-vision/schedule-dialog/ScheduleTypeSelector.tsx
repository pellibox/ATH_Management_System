
import { Button } from "@/components/ui/button";

interface ScheduleTypeSelectorProps {
  scheduleType: "day" | "week" | "month";
  setScheduleType: (type: "day" | "week" | "month") => void;
}

export function ScheduleTypeSelector({ 
  scheduleType, 
  setScheduleType 
}: ScheduleTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Tipo di Programmazione</h3>
      <div className="flex gap-2">
        <Button 
          variant={scheduleType === "day" ? "default" : "outline"}
          onClick={() => setScheduleType("day")}
          size="sm"
        >Giornaliera</Button>
        <Button 
          variant={scheduleType === "week" ? "default" : "outline"}
          onClick={() => setScheduleType("week")}
          size="sm"
        >Settimanale</Button>
        <Button 
          variant={scheduleType === "month" ? "default" : "outline"}
          onClick={() => setScheduleType("month")}
          size="sm"
        >Mensile</Button>
      </div>
    </div>
  );
}
