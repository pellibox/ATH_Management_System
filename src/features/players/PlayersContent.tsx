
import { memo, useEffect } from "react";
import { usePlayerContext } from "@/contexts/player/PlayerContext";
import { PlayerList } from "@/components/players/PlayerList";
import { 
  PlayerFiltersSection, 
  PlayerDialogs, 
  PlayerHeader,
  PlayerDataSync
} from "./components";

// Use React.memo with a custom comparator to prevent unnecessary re-renders
const MemoizedPlayerList = memo(PlayerList, () => true);

// Utilizziamo React.memo con un comparatore personalizzato per evitare re-render non necessari
const PlayersContent = memo(() => {
  const { setEditingPlayer, setMessagePlayer } = usePlayerContext();
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      setEditingPlayer(null);
      setMessagePlayer(null);
    };
  }, [setEditingPlayer, setMessagePlayer]);

  return (
    <div className="max-w-7xl mx-auto">
      <PlayerHeader />
      <PlayerFiltersSection />
      <MemoizedPlayerList />
      <PlayerDialogs />
      <PlayerDataSync />
    </div>
  );
}, () => true); // Always return true to prevent re-renders based on props

PlayersContent.displayName = "PlayersContent";

export { PlayersContent, MemoizedPlayerList };
