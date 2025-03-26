
import { Button } from "@/components/ui/button";
import { PersonData } from "../types";

interface PreviewButtonProps {
  onPreview: (person: PersonData) => void;
  samplePerson: PersonData | null;
  disabled: boolean;
}

export function PreviewButton({ 
  onPreview, 
  samplePerson, 
  disabled 
}: PreviewButtonProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Anteprima</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          onClick={() => samplePerson && onPreview(samplePerson)}
          disabled={disabled}
        >
          Anteprima Esempio
        </Button>
      </div>
    </div>
  );
}
