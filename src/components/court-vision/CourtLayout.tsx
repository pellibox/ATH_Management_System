
import { COURT_TYPES } from "./constants";

interface CourtLayoutProps {
  type: string;
}

export function CourtLayout({ type }: CourtLayoutProps) {
  if (type === COURT_TYPES.TENNIS_CLAY || type === COURT_TYPES.TENNIS_HARD) {
    return (
      <div className="w-3/4 h-3/4 border border-white/70 relative flex items-center justify-center self-center mt-auto mb-auto">
        <div className="absolute left-0 right-0 h-[1px] bg-white/70"></div>
        <div className="absolute top-0 bottom-0 w-[1px] bg-white/70"></div>
      </div>
    );
  }
  
  if (type === COURT_TYPES.PADEL) {
    return (
      <div className="w-3/4 h-3/4 border border-white/70 relative self-center mt-auto mb-auto">
        <div className="absolute left-0 right-0 top-1/3 h-[1px] bg-white/70"></div>
        <div className="absolute inset-0 border-4 border-transparent border-b-white/70 -mb-4"></div>
      </div>
    );
  }
  
  if (type === COURT_TYPES.PICKLEBALL) {
    return (
      <div className="w-2/3 h-3/4 border border-white/70 relative self-center mt-auto mb-auto">
        <div className="absolute left-0 right-0 top-1/3 bottom-1/3 border-t border-b border-white/70"></div>
      </div>
    );
  }
  
  if (type === COURT_TYPES.TOUCH_TENNIS) {
    return (
      <div className="w-2/3 h-2/3 border border-white/70 relative self-center mt-auto mb-auto">
        <div className="absolute left-0 right-0 h-[1px] top-1/2 bg-white/70"></div>
      </div>
    );
  }
  
  return null;
}
