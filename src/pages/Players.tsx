
import { PlayerProvider } from "@/contexts/player/PlayerContext";
import { PlayersContent } from "@/features/players/PlayersContent";
import { memo } from "react";

// Export memoized version of the PlayerList for reuse in other components
export const MemoizedPlayerList = memo(
  require("@/components/players/PlayerList").PlayerList
);

export default function Players() {
  return (
    <PlayerProvider>
      <PlayersContent />
    </PlayerProvider>
  );
}
