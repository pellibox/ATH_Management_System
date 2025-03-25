
import { useState, useEffect } from "react";
import { Plus, Filter, Layers, Eye } from "lucide-react";
import CourtCard from "@/components/ui/CourtCard";
import { Link } from "react-router-dom";
import { COURT_TYPES } from "@/components/court-vision/constants";
import { useToast } from "@/hooks/use-toast";

// Shared court state management (in a real app, this would be in a global state store)
import { CourtProps } from "@/components/court-vision/types";

// Mock data
const mockCourts = [
  {
    id: 1,
    name: "Court 1",
    type: "clay" as const,
    indoor: false,
    available: true,
  },
  {
    id: 2,
    name: "Court 2",
    type: "grass" as const,
    indoor: false,
    available: false,
    nextAvailable: "14:30",
    currentSession: {
      title: "Junior Training",
      instructor: "Coach Williams",
      endTime: "14:00",
    },
  },
  {
    id: 3,
    name: "Court 3",
    type: "hard" as const,
    indoor: true,
    available: true,
  },
  {
    id: 4,
    name: "Court 4",
    type: "clay" as const,
    indoor: false,
    available: false,
    nextAvailable: "16:00",
    currentSession: {
      title: "Private Lesson",
      instructor: "Coach Martinez",
      endTime: "15:30",
    },
  },
  {
    id: 5,
    name: "Central Court",
    type: "central" as const,
    indoor: true,
    available: false,
    nextAvailable: "18:00",
    currentSession: {
      title: "Tournament Prep",
      instructor: "Coach Johnson",
      endTime: "17:30",
    },
  },
  {
    id: 6,
    name: "Court 6",
    type: "hard" as const,
    indoor: true,
    available: true,
  },
  {
    id: 7,
    name: "Court 7",
    type: "grass" as const,
    indoor: false,
    available: true,
  },
  {
    id: 8,
    name: "Court 8",
    type: "clay" as const,
    indoor: false,
    available: false,
    nextAvailable: "13:00",
    currentSession: {
      title: "Advanced Training",
      instructor: "Coach Smith",
      endTime: "12:30",
    },
  },
];

export default function Courts() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("all");
  const [showAddCourtModal, setShowAddCourtModal] = useState(false);
  const [newCourtName, setNewCourtName] = useState("Court");
  const [newCourtType, setNewCourtType] = useState("clay");
  const [newCourtIndoor, setNewCourtIndoor] = useState(false);
  
  const [courts, setCourts] = useState(mockCourts);
  
  const filteredCourts = filter === "all" 
    ? courts 
    : filter === "available" 
      ? courts.filter(court => court.available)
      : filter === "occupied"
        ? courts.filter(court => !court.available)
        : courts.filter(court => court.type === filter);
  
  const handleAddCourt = () => {
    const newCourt = {
      id: courts.length + 1,
      name: newCourtName,
      type: newCourtType as "clay" | "grass" | "hard" | "central",
      indoor: newCourtIndoor,
      available: true,
    };
    
    setCourts([...courts, newCourt]);
    setShowAddCourtModal(false);
    
    toast({
      title: "Court Added",
      description: `${newCourtName} has been added successfully`,
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Courts</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all courts</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/court-vision" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ath-blue-light text-ath-blue hover:bg-ath-blue-light/80 transition-colors">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">Court Vision</span>
          </Link>
          <button 
            onClick={() => setShowAddCourtModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ath-red-clay text-white hover:bg-ath-red-clay-dark transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">Add Court</span>
          </button>
        </div>
      </div>
      
      {/* Filter */}
      <div className="mb-6 bg-white shadow-sm rounded-lg p-1 inline-flex items-center">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("available")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            filter === "available"
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Available
        </button>
        <button
          onClick={() => setFilter("occupied")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            filter === "occupied"
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Occupied
        </button>
        <button
          onClick={() => setFilter("clay")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            filter === "clay"
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Clay
        </button>
        <button
          onClick={() => setFilter("grass")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            filter === "grass"
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Grass
        </button>
        <button
          onClick={() => setFilter("hard")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            filter === "hard"
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Hard
        </button>
      </div>
      
      {/* Court Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourts.map((court) => (
          <CourtCard key={court.id} {...court} />
        ))}
      </div>
      
      {filteredCourts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No courts match the selected filter</p>
          <button 
            onClick={() => setFilter("all")} 
            className="mt-2 text-ath-blue hover:text-ath-blue-dark"
          >
            View all courts
          </button>
        </div>
      )}
      
      {/* Add Court Modal */}
      {showAddCourtModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Court</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Court Name</label>
                <input
                  type="text"
                  value={newCourtName}
                  onChange={(e) => setNewCourtName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Court Type</label>
                <select
                  value={newCourtType}
                  onChange={(e) => setNewCourtType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="clay">Clay</option>
                  <option value="grass">Grass</option>
                  <option value="hard">Hard</option>
                  <option value="central">Central</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="indoor"
                  checked={newCourtIndoor}
                  onChange={(e) => setNewCourtIndoor(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="indoor" className="text-sm font-medium">Indoor Court</label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddCourtModal(false)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCourt}
                className="px-4 py-2 bg-ath-red-clay text-white rounded hover:bg-ath-red-clay-dark"
              >
                Add Court
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
