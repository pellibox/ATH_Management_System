
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourtCardProps {
  id: number;
  name: string;
  type: "clay" | "grass" | "hard" | "central";
  indoor: boolean;
  available: boolean;
  nextAvailable?: string;
  currentSession?: {
    title: string;
    instructor: string;
    endTime: string;
  };
}

export default function CourtCard({
  id,
  name,
  type,
  indoor,
  available,
  nextAvailable,
  currentSession,
}: CourtCardProps) {
  // Map court type to color scheme
  const typeColors = {
    clay: "bg-ath-red-clay/10 text-ath-red-clay border-ath-red-clay/30",
    grass: "bg-ath-grass/10 text-ath-grass border-ath-grass/30",
    hard: "bg-ath-black/10 text-ath-black border-ath-black/30",
    central: "bg-ath-red-clay-dark/10 text-ath-red-clay-dark border-ath-red-clay-dark/30",
  };

  // Format court type for display
  const formatType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="glass-panel rounded-xl p-5 card-hover">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full border",
                typeColors[type]
              )}
            >
              {formatType(type)}
            </span>
            <span className="text-xs text-gray-500">
              {indoor ? "Indoor" : "Outdoor"}
            </span>
          </div>
        </div>
        <div
          className={cn(
            "h-10 w-10 flex items-center justify-center rounded-full",
            available
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-500"
          )}
        >
          <span className="text-sm font-medium">{id}</span>
        </div>
      </div>

      {available ? (
        <div className="bg-green-50 rounded-lg p-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-green-700">Available now</p>
            <p className="text-xs text-green-600 mt-0.5">Ready for booking</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">{currentSession?.title}</p>
            <span className="text-xs text-gray-500">
              Until {currentSession?.endTime}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            {currentSession?.instructor}
          </p>
          <div className="mt-3 pt-2 border-t border-gray-200 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-ath-red-clay mr-1.5"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
              <path d="M8 14h.01" />
              <path d="M12 14h.01" />
              <path d="M16 14h.01" />
              <path d="M8 18h.01" />
              <path d="M12 18h.01" />
              <path d="M16 18h.01" />
            </svg>
            <span className="text-xs text-gray-500">
              Next available at {nextAvailable}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
