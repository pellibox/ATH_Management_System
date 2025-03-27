
import { memo } from "react";
import { PlayerFilters } from "@/components/players/PlayerFilters";

// Memorizziamo il componente per evitare re-render inutili
export const PlayerFiltersSection = memo(() => {
  return <PlayerFilters />;
});

PlayerFiltersSection.displayName = "PlayerFiltersSection";
