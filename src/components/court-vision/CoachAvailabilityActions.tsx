
import { useState } from 'react';
import { PersonData } from './types';
import { AlertCircle, Check } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCourtVision } from './context/CourtVisionContext';

interface CoachAvailabilityActionsProps {
  coach: PersonData;
}

export function CoachAvailabilityActions({ coach }: CoachAvailabilityActionsProps) {
  const { handleSetCoachAvailability } = useCourtVision();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reason, setReason] = useState(coach.absenceReason || '');

  const handleMarkAsUnavailable = () => {
    if (!reason.trim()) {
      setReason('Non disponibile');
    }
    
    handleSetCoachAvailability(coach.id, false, reason.trim() || 'Non disponibile');
    setIsDialogOpen(false);
  };

  const handleMarkAsAvailable = () => {
    handleSetCoachAvailability(coach.id, true);
  };

  return (
    <div className="flex gap-2">
      {coach.isPresent === false ? (
        <Button 
          variant="outline" 
          size="sm" 
          className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
          onClick={handleMarkAsAvailable}
        >
          <Check className="h-3 w-3 mr-1" />
          Segna come disponibile
        </Button>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              Segna come indisponibile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Segnala indisponibilità</DialogTitle>
              <DialogDescription>
                Inserisci il motivo per cui {coach.name} non è disponibile
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Inserisci il motivo dell'indisponibilità..."
                className="min-h-[100px]"
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annulla
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleMarkAsUnavailable}
                className="gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                Segna come indisponibile
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
