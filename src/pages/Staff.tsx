
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import StaffCard from "@/components/ui/StaffCard";

// Mock data
const mockStaff = [
  {
    id: "staff1",
    name: "John Smith",
    role: "Head Coach",
    specialties: ["ATP Experience", "High Performance", "Clay Court Specialist"],
    email: "john.smith@ath-tennis.com",
    phone: "+1 (555) 123-4567",
    availability: {
      today: true,
    },
  },
  {
    id: "staff2",
    name: "Maria Williams",
    role: "Junior Coach",
    specialties: ["Youth Development", "Technical Training"],
    email: "maria.williams@ath-tennis.com",
    phone: "+1 (555) 234-5678",
    availability: {
      today: false,
      nextAvailable: "Tomorrow, 9:00 AM",
    },
  },
  {
    id: "staff3",
    name: "Roberto Martinez",
    role: "Senior Coach",
    specialties: ["Tactical Analysis", "Mental Training", "Match Preparation"],
    email: "roberto.martinez@ath-tennis.com",
    phone: "+1 (555) 345-6789",
    availability: {
      today: true,
    },
  },
  {
    id: "staff4",
    name: "Sarah Johnson",
    role: "Performance Coach",
    specialties: ["Physical Conditioning", "Injury Prevention", "Tournament Coaching"],
    email: "sarah.johnson@ath-tennis.com",
    phone: "+1 (555) 456-7890",
    availability: {
      today: false,
      nextAvailable: "Thursday, 1:00 PM",
    },
  },
  {
    id: "staff5",
    name: "David Wilson",
    role: "Assistant Coach",
    specialties: ["Stroke Analysis", "Video Analysis"],
    email: "david.wilson@ath-tennis.com",
    phone: "+1 (555) 567-8901",
    availability: {
      today: true,
    },
  },
  {
    id: "staff6",
    name: "Jennifer Lee",
    role: "Fitness Trainer",
    specialties: ["Strength & Conditioning", "Recovery", "Nutrition"],
    email: "jennifer.lee@ath-tennis.com",
    phone: "+1 (555) 678-9012",
    availability: {
      today: true,
    },
  },
  {
    id: "staff7",
    name: "Michael Brown",
    role: "Junior Development Coach",
    specialties: ["Youth Programs", "Beginner Training"],
    email: "michael.brown@ath-tennis.com",
    phone: "+1 (555) 789-0123",
    availability: {
      today: false,
      nextAvailable: "Tomorrow, 2:00 PM",
    },
  },
  {
    id: "staff8",
    name: "Emily Davis",
    role: "Administrative Manager",
    specialties: ["Scheduling", "Event Planning", "Client Relations"],
    email: "emily.davis@ath-tennis.com",
    phone: "+1 (555) 890-1234",
    availability: {
      today: true,
    },
  },
];

export default function Staff() {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Filter staff based on role and search query
  const filteredStaff = mockStaff
    .filter(staff => {
      if (filter === "all") return true;
      if (filter === "available") return staff.availability.today;
      
      const roleMap: Record<string, string[]> = {
        "coach": ["Head Coach", "Senior Coach", "Junior Coach", "Assistant Coach", "Performance Coach", "Junior Development Coach"],
        "fitness": ["Fitness Trainer"],
        "admin": ["Administrative Manager"],
      };
      
      return roleMap[filter]?.includes(staff.role) || false;
    })
    .filter(staff => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        staff.name.toLowerCase().includes(query) ||
        staff.role.toLowerCase().includes(query) ||
        staff.specialties.some(specialty => specialty.toLowerCase().includes(query))
      );
    });
  
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Staff</h1>
          <p className="text-gray-600 mt-1">Manage coaches and administrative staff</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search staff..."
              className="h-10 w-64 rounded-lg bg-white shadow-sm pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors">
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">Add Staff</span>
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
          All Staff
        </button>
        <button
          onClick={() => setFilter("available")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            filter === "available"
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Available Today
        </button>
        <button
          onClick={() => setFilter("coach")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            filter === "coach"
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Coaches
        </button>
        <button
          onClick={() => setFilter("fitness")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            filter === "fitness"
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Fitness Trainers
        </button>
        <button
          onClick={() => setFilter("admin")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            filter === "admin"
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Administrators
        </button>
      </div>
      
      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStaff.map((staff) => (
          <StaffCard key={staff.id} {...staff} />
        ))}
      </div>
      
      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No staff members match your search</p>
          <button 
            onClick={() => {
              setFilter("all");
              setSearchQuery("");
            }}
            className="mt-2 text-ath-blue hover:text-ath-blue-dark"
          >
            View all staff
          </button>
        </div>
      )}
    </div>
  );
}
