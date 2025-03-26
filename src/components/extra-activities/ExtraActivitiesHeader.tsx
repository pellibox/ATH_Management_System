
import { ExtraActivity } from "@/types/extra-activities";
import { ExtraActivityForm } from "./ExtraActivityForm";

interface ExtraActivitiesHeaderProps {
  onAddActivity: (activity: ExtraActivity) => void;
  coachesList: Array<{ id: string; name: string }>;
  onEditActivity: (id: string, updatedActivity: Partial<ExtraActivity>) => void;
}

export function ExtraActivitiesHeader({ 
  onAddActivity,
  coachesList,
  onEditActivity
}: ExtraActivitiesHeaderProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Attività Aggiuntive</h1>
        <p className="text-gray-600 mt-1">Gestisci atletica e altre attività di supporto</p>
      </div>
      
      <div className="flex items-center gap-3">
        <ExtraActivityForm 
          onAddActivity={onAddActivity} 
          coachesList={coachesList}
          onEditActivity={onEditActivity}
        />
      </div>
    </div>
  );
}
