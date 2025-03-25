
import { useState } from "react";
import { Calendar, Plus, Search, Users, Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface Program {
  id: string;
  name: string;
  type: "junior" | "adult" | "advanced" | "private";
  description: string;
  ageRange: string;
  schedule: string[];
  capacity: number;
  enrolled: number;
  instructor: string;
  price: string;
}

// Mock data for programs
const mockPrograms: Program[] = [
  {
    id: "prog1",
    name: "Junior Development",
    type: "junior",
    description: "Foundation program for young players focusing on technique and fun.",
    ageRange: "6-10",
    schedule: ["Monday 4-5:30 PM", "Wednesday 4-5:30 PM"],
    capacity: 12,
    enrolled: 8,
    instructor: "Coach Williams",
    price: "$120/month",
  },
  {
    id: "prog2",
    name: "Teen Performance",
    type: "junior",
    description: "Competitive training for aspiring tournament players.",
    ageRange: "11-15",
    schedule: ["Tuesday 5-7 PM", "Thursday 5-7 PM", "Saturday 10-12 PM"],
    capacity: 10,
    enrolled: 10,
    instructor: "Coach Smith",
    price: "$180/month",
  },
  {
    id: "prog3",
    name: "Adult Beginners",
    type: "adult",
    description: "Introduction to tennis for adults with little to no experience.",
    ageRange: "18+",
    schedule: ["Monday 7-8:30 PM", "Friday 7-8:30 PM"],
    capacity: 8,
    enrolled: 5,
    instructor: "Coach Martinez",
    price: "$150/month",
  },
  {
    id: "prog4",
    name: "Adult Intermediate",
    type: "adult",
    description: "Refine technique and tactics for recreational players.",
    ageRange: "18+",
    schedule: ["Tuesday 7-8:30 PM", "Thursday 7-8:30 PM"],
    capacity: 8,
    enrolled: 7,
    instructor: "Coach Johnson",
    price: "$150/month",
  },
  {
    id: "prog5",
    name: "High Performance Academy",
    type: "advanced",
    description: "Elite training program for competitive and tournament players.",
    ageRange: "14-18",
    schedule: ["Monday 5-7 PM", "Wednesday 5-7 PM", "Friday 5-7 PM"],
    capacity: 6,
    enrolled: 5,
    instructor: "Coach Smith",
    price: "$250/month",
  },
  {
    id: "prog6",
    name: "Private Coaching",
    type: "private",
    description: "One-on-one coaching sessions tailored to individual needs.",
    ageRange: "All ages",
    schedule: ["Available by appointment"],
    capacity: 1,
    enrolled: 0,
    instructor: "Various Coaches",
    price: "$75/hour",
  }
];

export default function Programs() {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  
  // Filter programs based on type and search query
  const filteredPrograms = mockPrograms
    .filter(program => {
      if (filter === "all") return true;
      return program.type === filter;
    })
    .filter(program => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        program.name.toLowerCase().includes(query) ||
        program.description.toLowerCase().includes(query) ||
        program.instructor.toLowerCase().includes(query)
      );
    });
  
  // Toggle program card expansion
  const toggleExpand = (id: string) => {
    if (expandedProgram === id) {
      setExpandedProgram(null);
    } else {
      setExpandedProgram(id);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Programs</h1>
          <p className="text-gray-600 mt-1">Manage training programs and courses</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search programs..."
              className="h-10 w-64 rounded-lg bg-white shadow-sm pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors">
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">New Program</span>
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
          All Programs
        </button>
        <button
          onClick={() => setFilter("junior")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            filter === "junior"
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Junior
        </button>
        <button
          onClick={() => setFilter("adult")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            filter === "adult"
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Adult
        </button>
        <button
          onClick={() => setFilter("advanced")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            filter === "advanced"
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Advanced
        </button>
        <button
          onClick={() => setFilter("private")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            filter === "private"
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Private
        </button>
      </div>
      
      {/* Programs Grid */}
      <div className="space-y-4">
        {filteredPrograms.map((program) => (
          <div 
            key={program.id} 
            className={cn(
              "bg-white rounded-xl shadow-soft overflow-hidden transition-all duration-300",
              expandedProgram === program.id ? "ring-2 ring-ath-blue/20" : "",
              "card-hover"
            )}
          >
            <div 
              className="p-6 cursor-pointer"
              onClick={() => toggleExpand(program.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{program.name}</h3>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      program.type === "junior" ? "bg-green-100 text-green-700" :
                      program.type === "adult" ? "bg-blue-100 text-blue-700" :
                      program.type === "advanced" ? "bg-purple-100 text-purple-700" :
                      "bg-gray-100 text-gray-700"
                    )}>
                      {program.type.charAt(0).toUpperCase() + program.type.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{program.description}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-lg font-semibold text-ath-blue">{program.price}</div>
                  <div className="text-sm text-gray-500">Age: {program.ageRange}</div>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {program.enrolled}/{program.capacity} enrolled
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{program.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{program.schedule.length} sessions/week</span>
                </div>
              </div>
              
              <div className={cn(
                "mt-2 flex justify-end items-center gap-1",
                "text-ath-blue transition-transform duration-300",
                expandedProgram === program.id ? "rotate-180" : ""
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
            
            {/* Expanded details */}
            {expandedProgram === program.id && (
              <div className="px-6 pb-6 pt-0 border-t-0 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Schedule</h4>
                    <ul className="space-y-2">
                      {program.schedule.map((session, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-ath-blue" />
                          <span className="text-sm">{session}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Enrollment Status</h4>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div 
                            style={{ width: `${(program.enrolled / program.capacity) * 100}%` }}
                            className={cn(
                              "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center",
                              program.enrolled === program.capacity ? "bg-red-500" : "bg-green-500"
                            )}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">{program.enrolled} enrolled</span>
                          <span className="text-xs text-gray-500">{program.capacity} capacity</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Program Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Duration:</span>
                        <span className="text-sm">3 months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Courts:</span>
                        <span className="text-sm">Clay Courts 1-3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Equipment:</span>
                        <span className="text-sm">Provided</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Next Start Date:</span>
                        <span className="text-sm">July 1, 2024</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex gap-3 justify-end">
                      <button className="px-3 py-1.5 rounded bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors">
                        View Details
                      </button>
                      <button className="px-3 py-1.5 rounded bg-ath-blue text-white text-sm hover:bg-ath-blue-dark transition-colors">
                        Edit Program
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No programs match your search</p>
          <button 
            onClick={() => {
              setFilter("all");
              setSearchQuery("");
            }}
            className="mt-2 text-ath-blue hover:text-ath-blue-dark"
          >
            View all programs
          </button>
        </div>
      )}
    </div>
  );
}
