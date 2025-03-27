
import { PlayerProvider } from "@/contexts/player/PlayerContext";
import { PlayersContent, MemoizedPlayerList } from "@/features/players/PlayersContent";
import { memo } from "react";

export default function Players() {
  return (
    <PlayerProvider>
      <PlayersContent />
    </PlayerProvider>
  );
}
