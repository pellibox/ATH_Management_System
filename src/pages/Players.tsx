
import { useState } from "react";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define player types and interfaces
interface Player {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  level: "Beginner" | "Intermediate" | "Advanced" | "Professional";
  coach: string;
  phone: string;
  email: string;
  joinDate: string;
  notes: string;
}

// Mock data for players
const mockPlayers: Player[] = [
  {
    id: "p1",
    name: "Alex Johnson",
    age: 24,
    gender: "Male",
    level: "Advanced",
    coach: "Coach Martinez",
    phone: "+1 (555) 123-4567",
    email: "alex.johnson@example.com",
    joinDate: "2022-03-15",
    notes: "Strong forehand, working on backhand slice"
  },
  {
    id: "p2",
    name: "Emma Parker",
    age: 19,
    gender: "Female",
    level: "Intermediate",
    coach: "Coach Anderson",
    phone: "+1 (555) 234-5678",
    email: "emma.parker@example.com",
    joinDate: "2022-06-22",
    notes: "Good all-around player, needs work on serve"
  },
  {
    id: "p3",
    name: "Michael Rodriguez",
    age: 32,
    gender: "Male",
    level: "Professional",
    coach: "Coach Martinez",
    phone: "+1 (555) 345-6789",
    email: "michael.rodriguez@example.com",
    joinDate: "2020-11-08",
    notes: "Former tour player, training for seniors circuit"
  },
  {
    id: "p4",
    name: "Sophia Wang",
    age: 16,
    gender: "Female",
    level: "Advanced",
    coach: "Coach Thompson",
    phone: "+1 (555) 456-7890",
    email: "sophia.wang@example.com",
    joinDate: "2021-09-14",
    notes: "Junior champion, preparing for national tournament"
  },
  {
    id: "p5",
    name: "David Kim",
    age: 28,
    gender: "Male",
    level: "Intermediate",
    coach: "Coach Anderson",
    phone: "+1 (555) 567-8901",
    email: "david.kim@example.com",
    joinDate: "2023-01-05",
    notes: "Consistent player, working on net game"
  },
  {
    id: "p6",
    name: "Olivia Smith",
    age: 14,
    gender: "Female",
    level: "Beginner",
    coach: "Coach Thompson",
    phone: "+1 (555) 678-9012",
    email: "olivia.smith@example.com",
    joinDate: "2023-04-20",
    notes: "Raw talent, focusing on fundamentals"
  },
  {
    id: "p7",
    name: "James Wilson",
    age: 41,
    gender: "Male",
    level: "Intermediate",
    coach: "Coach Martinez",
    phone: "+1 (555) 789-0123",
    email: "james.wilson@example.com",
    joinDate: "2022-08-30",
    notes: "Recreational player, works on fitness"
  },
  {
    id: "p8",
    name: "Isabella Garcia",
    age: 22,
    gender: "Female",
    level: "Advanced",
    coach: "Coach Anderson",
    phone: "+1 (555) 890-1234",
    email: "isabella.garcia@example.com",
    joinDate: "2021-05-17",
    notes: "College player, strong serve and volley game"
  }
];

export default function Players() {
  const { toast } = useToast();
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [coachFilter, setCoachFilter] = useState<string>("all");
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [newPlayer, setNewPlayer] = useState<Omit<Player, "id">>({
    name: "",
    age: 0,
    gender: "Male",
    level: "Beginner",
    coach: "",
    phone: "",
    email: "",
    joinDate: new Date().toISOString().split("T")[0],
    notes: ""
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

  // Handle adding a new player
  const handleAddPlayer = () => {
    const newId = `p${Date.now()}`;
    
    setPlayers([
      ...players,
      { id: newId, ...newPlayer }
    ]);
    
    // Reset new player form
    setNewPlayer({
      name: "",
      age: 0,
      gender: "Male",
      level: "Beginner",
      coach: "",
      phone: "",
      email: "",
      joinDate: new Date().toISOString().split("T")[0],
      notes: ""
    });
    
    toast({
      title: "Player Added",
      description: `${newPlayer.name} has been added to the database.`,
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

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Player Database</h1>
          <p className="text-gray-600 mt-1">Manage player profiles and information</p>
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
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input 
                    value={newPlayer.name} 
                    onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Age</label>
                  <Input 
                    type="number" 
                    value={newPlayer.age || ''} 
                    onChange={(e) => setNewPlayer({...newPlayer, age: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <Select 
                    value={newPlayer.gender} 
                    onValueChange={(value) => setNewPlayer({...newPlayer, gender: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Level</label>
                  <Select 
                    value={newPlayer.level} 
                    onValueChange={(value) => setNewPlayer({...newPlayer, level: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Coach</label>
                  <Input 
                    value={newPlayer.coach} 
                    onChange={(e) => setNewPlayer({...newPlayer, coach: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input 
                    value={newPlayer.phone} 
                    onChange={(e) => setNewPlayer({...newPlayer, phone: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    type="email" 
                    value={newPlayer.email} 
                    onChange={(e) => setNewPlayer({...newPlayer, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Join Date</label>
                  <Input 
                    type="date" 
                    value={newPlayer.joinDate} 
                    onChange={(e) => setNewPlayer({...newPlayer, joinDate: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Notes</label>
                  <textarea 
                    className="w-full p-2 border rounded-md text-sm min-h-[80px]"
                    value={newPlayer.notes} 
                    onChange={(e) => setNewPlayer({...newPlayer, notes: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddPlayer} disabled={!newPlayer.name}>Add Player</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 bg-white shadow-sm rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[180px] text-sm h-9">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={coachFilter} onValueChange={setCoachFilter}>
              <SelectTrigger className="w-[180px] text-sm h-9">
                <SelectValue placeholder="Select Coach" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Coaches</SelectItem>
                {coaches.map((coach) => (
                  <SelectItem key={coach} value={coach}>{coach}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="ml-auto">
            <Button variant="outline" size="sm" className="h-9" onClick={() => {
              setSearchQuery("");
              setLevelFilter("all");
              setCoachFilter("all");
            }}>
              Reset Filters
            </Button>
          </div>
        </div>
      </div>
      
      {/* Player list */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Coach</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player) => (
                <TableRow key={player.id}>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell>{player.age}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      player.level === "Beginner" ? "bg-gray-100 text-gray-700" :
                      player.level === "Intermediate" ? "bg-blue-100 text-blue-700" :
                      player.level === "Advanced" ? "bg-green-100 text-green-700" :
                      "bg-purple-100 text-purple-700"
                    }`}>
                      {player.level}
                    </span>
                  </TableCell>
                  <TableCell>{player.coach}</TableCell>
                  <TableCell>{player.email}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DialogTrigger asChild>
                            <DropdownMenuItem onClick={() => setEditingPlayer(player)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeletePlayer(player.id, player.name)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                          <DialogTitle>Edit Player</DialogTitle>
                        </DialogHeader>
                        {editingPlayer && (
                          <>
                            <div className="grid grid-cols-2 gap-4 py-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input 
                                  value={editingPlayer.name} 
                                  onChange={(e) => setEditingPlayer({...editingPlayer, name: e.target.value})}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Age</label>
                                <Input 
                                  type="number" 
                                  value={editingPlayer.age} 
                                  onChange={(e) => setEditingPlayer({...editingPlayer, age: parseInt(e.target.value) || 0})}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Gender</label>
                                <Select 
                                  value={editingPlayer.gender} 
                                  onValueChange={(value) => setEditingPlayer({...editingPlayer, gender: value as any})}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Level</label>
                                <Select 
                                  value={editingPlayer.level} 
                                  onValueChange={(value) => setEditingPlayer({...editingPlayer, level: value as any})}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                    <SelectItem value="Professional">Professional</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Coach</label>
                                <Input 
                                  value={editingPlayer.coach} 
                                  onChange={(e) => setEditingPlayer({...editingPlayer, coach: e.target.value})}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Phone</label>
                                <Input 
                                  value={editingPlayer.phone} 
                                  onChange={(e) => setEditingPlayer({...editingPlayer, phone: e.target.value})}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input 
                                  type="email" 
                                  value={editingPlayer.email} 
                                  onChange={(e) => setEditingPlayer({...editingPlayer, email: e.target.value})}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Join Date</label>
                                <Input 
                                  type="date" 
                                  value={editingPlayer.joinDate} 
                                  onChange={(e) => setEditingPlayer({...editingPlayer, joinDate: e.target.value})}
                                />
                              </div>
                              
                              <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium">Notes</label>
                                <textarea 
                                  className="w-full p-2 border rounded-md text-sm min-h-[80px]"
                                  value={editingPlayer.notes} 
                                  onChange={(e) => setEditingPlayer({...editingPlayer, notes: e.target.value})}
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button onClick={handleUpdatePlayer}>Update Player</Button>
                            </div>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No players found matching your search criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
