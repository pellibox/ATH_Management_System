
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import player types and mock data
import { Player, mockPlayers } from "@/types/player";

// Import components
import { PlayerForm } from "@/components/players/PlayerForm";
import { PlayerObjectives } from "@/components/players/PlayerObjectives";
import { PlayerFilters } from "@/components/players/PlayerFilters";
import { PlayerList } from "@/components/players/PlayerList";
import { ScheduleMessage } from "@/components/players/ScheduleMessage";

export default function Players() {
  const { toast } = useToast();
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [coachFilter, setCoachFilter] = useState<string>("all");
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [messagePlayer, setMessagePlayer] = useState<Player | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [scheduleType, setScheduleType] = useState<"day" | "week" | "month">("week");
  const [objectives, setObjectives] = useState({
    daily: "",
    weekly: "",
    monthly: "",
    seasonal: ""
  });
  const [newPlayer, setNewPlayer] = useState<Omit<Player, "id">>({
    name: "",
    age: 0,
    gender: "Male",
    level: "Beginner",
    coach: "",
    phone: "",
    email: "",
    joinDate: new Date().toISOString().split("T")[0],
    notes: "",
    preferredContactMethod: "WhatsApp",
    objectives: {
      daily: "",
      weekly: "",
      monthly: "",
      seasonal: ""
    }
  });

  // Get unique coaches for filter dropdown
  const coaches = Array.from(new Set(players.map(player => player.coach)));

  // Filter players based on search and filters
  const filteredPlayers = players.filter(player => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Level filter
    const matchesLevel = levelFilter === "all" || player.level === levelFilter;
    
    // Coach filter
    const matchesCoach = coachFilter === "all" || player.coach === coachFilter;
    
    return matchesSearch && matchesLevel && matchesCoach;
  });

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setLevelFilter("all");
    setCoachFilter("all");
  };

  // Handle adding a new player
  const handleAddPlayer = (playerData: Omit<Player, "id">) => {
    const newId = `p${Date.now()}`;
    
    setPlayers([
      ...players,
      { id: newId, ...playerData }
    ]);
    
    toast({
      title: "Player Added",
      description: `${playerData.name} has been added to the database.`,
    });
  };

  // Handle updating a player
  const handleUpdatePlayer = () => {
    if (!editingPlayer) return;
    
    setPlayers(players.map(player => 
      player.id === editingPlayer.id ? editingPlayer : player
    ));
    
    setEditingPlayer(null);
    
    toast({
      title: "Player Updated",
      description: `${editingPlayer.name}'s information has been updated.`,
    });
  };

  // Handle deleting a player
  const handleDeletePlayer = (id: string, name: string) => {
    setPlayers(players.filter(player => player.id !== id));
    
    toast({
      title: "Player Deleted",
      description: `${name} has been removed from the database.`,
      variant: "destructive",
    });
  };

  // Handle sending a message or schedule
  const handleSendMessage = () => {
    if (!messagePlayer) return;
    
    const method = messagePlayer.preferredContactMethod || "WhatsApp";
    
    toast({
      title: `Message Sent via ${method}`,
      description: `Your ${scheduleType}ly schedule has been sent to ${messagePlayer.name}.`,
    });
    
    setMessagePlayer(null);
    setMessageContent("");
  };

  // Handle setting player objectives
  const handleSetObjectives = (updatedObjectives: Player["objectives"]) => {
    if (!editingPlayer) return;
    
    const updatedPlayer = {
      ...editingPlayer,
      objectives: updatedObjectives
    };
    
    setPlayers(players.map(player => 
      player.id === updatedPlayer.id ? updatedPlayer : player
    ));
    
    setEditingPlayer(null);
    
    toast({
      title: "Objectives Set",
      description: `Training objectives for ${updatedPlayer.name} have been updated.`,
    });
  };

  // Set up an editing player for objectives tab
  const handleEditPlayerObjectives = (player: Player) => {
    setEditingPlayer(player);
    setObjectives(player.objectives || {
      daily: "",
      weekly: "",
      monthly: "",
      seasonal: ""
    });
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Player Database</h1>
          <p className="text-gray-600 mt-1">Manage player profiles and schedule communication</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search players..."
              className="h-10 w-64 rounded-lg bg-white shadow-sm pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors">
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">Add Player</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Player</DialogTitle>
              </DialogHeader>
              <PlayerForm 
                onSave={handleAddPlayer} 
                buttonText="Add Player"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Filters */}
      <PlayerFilters 
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
        coachFilter={coachFilter}
        setCoachFilter={setCoachFilter}
        coaches={coaches}
        resetFilters={resetFilters}
      />
      
      {/* Player list */}
      <PlayerList 
        filteredPlayers={filteredPlayers}
        onEditPlayer={setEditingPlayer}
        onDeletePlayer={handleDeletePlayer}
        onSchedulePlayer={setMessagePlayer}
      />
      
      {/* Edit Dialog */}
      {editingPlayer && (
        <Dialog open={!!editingPlayer} onOpenChange={(open) => !open && setEditingPlayer(null)}>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>Edit Player</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Player Details</TabsTrigger>
                <TabsTrigger value="objectives">Training Objectives</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <PlayerForm 
                  player={editingPlayer} 
                  onSave={(updatedData) => {
                    setEditingPlayer({...editingPlayer, ...updatedData});
                    handleUpdatePlayer();
                  }} 
                  buttonText="Update Player"
                />
              </TabsContent>
              
              <TabsContent value="objectives">
                <PlayerObjectives 
                  player={editingPlayer}
                  onSave={handleSetObjectives}
                  onSendToPlayer={(content) => {
                    setMessagePlayer(editingPlayer);
                    setMessageContent(content);
                  }}
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Schedule Message Dialog */}
      {messagePlayer && (
        <Dialog open={!!messagePlayer} onOpenChange={(open) => !open && setMessagePlayer(null)}>
          <DialogContent>
            <ScheduleMessage 
              player={messagePlayer}
              onSend={handleSendMessage}
              setMessageContent={setMessageContent}
              messageContent={messageContent}
              scheduleType={scheduleType}
              setScheduleType={setScheduleType}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
