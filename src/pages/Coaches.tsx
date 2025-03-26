
import { CourtVisionProvider } from "@/components/court-vision/CourtVisionContext";
import { CoachesContent } from "./coaches/CoachesContent";

export default function Coaches() {
  return (
    <CourtVisionProvider>
      <CoachesContent />
    </CourtVisionProvider>
  );
}
