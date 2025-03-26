
import { useSharedPlayers } from "@/contexts/shared/SharedPlayerContext";
import { CoachesContent } from "./coaches/CoachesContent";
import { CourtVisionProvider } from "@/components/court-vision/context/CourtVisionContext";

export default function Coaches() {
  const { sharedPlayers } = useSharedPlayers();
  
  return (
    <CourtVisionProvider initialPlayers={sharedPlayers}>
      <CoachesContent />
    </CourtVisionProvider>
  );
}
