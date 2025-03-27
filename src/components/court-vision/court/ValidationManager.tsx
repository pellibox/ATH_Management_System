
import { useState, useEffect } from "react";
import { PersonData } from "../types";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ValidationManagerProps {
  occupants: PersonData[];
  onValidate: () => void;
}

export function ValidationManager({ occupants, onValidate }: ValidationManagerProps) {
  const [validationInProgress, setValidationInProgress] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const { toast } = useToast();

  // Simulate delayed validation (5 seconds after changes)
  useEffect(() => {
    let validationTimer: NodeJS.Timeout;
    
    if (occupants.length > 0) {
      setValidationInProgress(true);
      validationTimer = setTimeout(() => {
        onValidate();
        setValidationInProgress(false);
        setValidationComplete(true);
        setTimeout(() => setValidationComplete(false), 3000);
      }, 5000);
    }
    
    return () => {
      if (validationTimer) clearTimeout(validationTimer);
    };
  }, [occupants, onValidate]);

  // Force validation immediately
  const handleForceValidation = () => {
    setValidationInProgress(true);
    setTimeout(() => {
      onValidate();
      setValidationInProgress(false);
      setValidationComplete(true);
      setTimeout(() => setValidationComplete(false), 3000);
    }, 300);
  };

  return (
    <div className="flex items-center">
      {validationInProgress && (
        <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800 animate-pulse flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Validazione...
        </Badge>
      )}
      
      {validationComplete && !validationInProgress && (
        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 flex items-center">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Verificato
        </Badge>
      )}
      
      <Button 
        onClick={handleForceValidation}
        size="sm"
        variant="ghost"
        className="ml-2 text-xs py-1 px-2 h-7"
      >
        Valida ora
      </Button>
    </div>
  );
}
