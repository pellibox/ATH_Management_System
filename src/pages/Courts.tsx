
import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import CourtCard from "@/components/ui/CourtCard";

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
  const [filter, setFilter] = useState<string>("all");
  
  const filteredCourts = filter === "all" 
    ? mockCourts 
    : filter === "available" 
      ? mockCourts.filter(court => court.available)
      : filter === "occupied"
        ? mockCourts.filter(court => !court.available)
        : mockCourts.filter(court => court.type === filter);
  
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Courts</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all courts</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors">
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
    </div>
  );
}
