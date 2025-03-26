
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ACTIVITY_TYPES } from "@/types/extra-activities";
import { toggleDay } from "./activity-form-utils";

interface ActivityFormFieldsProps {
  newActivity: any;
  setNewActivity: (activity: any) => void;
  coachesList: Array<{ id: string; name: string }>;
}

export function ActivityFormFields({ 
  newActivity, 
  setNewActivity, 
  coachesList 
}: ActivityFormFieldsProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome Attività*</label>
          <Input 
            value={newActivity.name} 
            onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
            placeholder="Es. Allenamento Atletico"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo Attività*</label>
          <Select 
            value={newActivity.type}
            onValueChange={(value) => setNewActivity({...newActivity, type: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona tipo" />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_TYPES.map(type => (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Orario*</label>
          <Select 
            value={newActivity.time}
            onValueChange={(value) => setNewActivity({...newActivity, time: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona orario" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 13 }, (_, i) => `${i + 8}:00`).map(time => (
                <SelectItem key={time} value={time}>{time}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Durata (ore)*</label>
          <Select 
            value={newActivity.duration.toString()}
            onValueChange={(value) => setNewActivity({...newActivity, duration: parseFloat(value)})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona durata" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">30 minuti</SelectItem>
              <SelectItem value="1">1 ora</SelectItem>
              <SelectItem value="1.5">1 ora e 30 minuti</SelectItem>
              <SelectItem value="2">2 ore</SelectItem>
              <SelectItem value="2.5">2 ore e 30 minuti</SelectItem>
              <SelectItem value="3">3 ore</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <WeekdaySelector days={newActivity.days} toggleDay={(day) => {
        const updatedDays = toggleDay(newActivity.days, day);
        setNewActivity({...newActivity, days: updatedDays});
      }} />
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Ubicazione*</label>
          <Input 
            value={newActivity.location} 
            onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
            placeholder="Es. Palestra"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Numero Max Partecipanti</label>
          <Input 
            type="number"
            min="1"
            value={newActivity.maxParticipants} 
            onChange={(e) => setNewActivity({...newActivity, maxParticipants: parseInt(e.target.value)})}
            placeholder="Es. 8"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Coach Responsabile*</label>
        <Select 
          value={newActivity.coach}
          onValueChange={(value) => setNewActivity({...newActivity, coach: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona coach" />
          </SelectTrigger>
          <SelectContent>
            {coachesList.map(coach => (
              <SelectItem key={coach.id} value={coach.id}>{coach.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Note Aggiuntive</label>
        <Input 
          value={newActivity.notes || ""} 
          onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
          placeholder="Es. Portare abbigliamento sportivo"
        />
      </div>
    </div>
  );
}

interface WeekdaySelectorProps {
  days: number[];
  toggleDay: (day: number) => void;
}

function WeekdaySelector({ days, toggleDay }: WeekdaySelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Giorni della Settimana*</label>
      <div className="flex flex-wrap gap-2">
        {[
          { day: 1, label: "Lun" },
          { day: 2, label: "Mar" },
          { day: 3, label: "Mer" },
          { day: 4, label: "Gio" },
          { day: 5, label: "Ven" },
          { day: 6, label: "Sab" },
          { day: 7, label: "Dom" }
        ].map(({ day, label }) => (
          <Button
            key={day}
            type="button"
            size="sm"
            variant={days.includes(day) ? "default" : "outline"}
            onClick={() => toggleDay(day)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
