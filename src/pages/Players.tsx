
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import components
import { PlayerForm } from "@/components/players/PlayerForm";
import { PlayerObjectives } from "@/components/players/PlayerObjectives";
import { PlayerFilters } from "@/components/players/PlayerFilters";
import { PlayerList } from "@/components/players/PlayerList";
import { ScheduleMessage } from "@/components/players/ScheduleMessage";
import { PlayerProvider, usePlayerContext } from "@/contexts/PlayerContext";

// Players page wrapper with context provider
export default function Players() {
  return (
    <PlayerProvider>
      <PlayersContent />
    </PlayerProvider>
  );
}

// Players content component using the context
function PlayersContent() {
  const { 
    searchQuery, 
    setSearchQuery, 
    editingPlayer, 
    setEditingPlayer,
    messagePlayer,
    setMessagePlayer,
    handleUpdatePlayer
  } = usePlayerContext();

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
                buttonText="Add Player"
                handleSave={() => {}}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Filters */}
      <PlayerFilters />
      
      {/* Player list */}
      <PlayerList />
      
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
                  buttonText="Update Player"
                  handleSave={handleUpdatePlayer}
                />
              </TabsContent>
              
              <TabsContent value="objectives">
                <PlayerObjectives />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Schedule Message Dialog */}
      {messagePlayer && (
        <Dialog open={!!messagePlayer} onOpenChange={(open) => !open && setMessagePlayer(null)}>
          <DialogContent>
            <ScheduleMessage />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
