
import { useState } from "react";
import { Plus, Search, TagIcon, Clock, Edit, Trash } from "lucide-react";
import { ACTIVITY_TYPES } from "@/components/court-vision/constants";
import { useToast } from "@/hooks/use-toast";

type Activity = {
  id: string;
  name: string;
  type: string;
  duration: string;
  description?: string;
};

export default function Activities() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [activities, setActivities] = useState<Activity[]>([
    { id: "activity1", name: "Singles Match", type: ACTIVITY_TYPES.MATCH, duration: "1h" },
    { id: "activity2", name: "Group Training", type: ACTIVITY_TYPES.TRAINING, duration: "1.5h" },
    { id: "activity3", name: "Basket Drill", type: ACTIVITY_TYPES.BASKET_DRILL, duration: "45m" },
    { id: "activity4", name: "Doubles Match", type: ACTIVITY_TYPES.MATCH, duration: "1.5h" },
    { id: "activity5", name: "Serve Practice", type: ACTIVITY_TYPES.TRAINING, duration: "30m" },
    { id: "activity6", name: "Fitness Training", type: ACTIVITY_TYPES.FITNESS, duration: "1h" },
    { id: "activity7", name: "Tournament Match", type: ACTIVITY_TYPES.MATCH, duration: "2h" },
  ]);
  
  // Filter activities based on type and search query
  const filteredActivities = activities
    .filter(activity => {
      if (filter === "all") return true;
      return activity.type === filter;
    })
    .filter(activity => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        activity.name.toLowerCase().includes(query) ||
        activity.type.toLowerCase().includes(query) ||
        activity.duration.toLowerCase().includes(query)
      );
    });
  
  const handleAddActivity = () => {
    // This would open a dialog to add a new activity
    toast({
      title: "Not Implemented",
      description: "This feature is not yet implemented in this demo.",
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Activities</h1>
          <p className="text-gray-600 mt-1">Manage training activities and matches</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search activities..."
              className="h-10 w-64 rounded-lg bg-white shadow-sm pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button 
            onClick={handleAddActivity}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">Add Activity</span>
          </button>
        </div>
      </div>
      
      {/* Filter */}
      <div className="mb-6 bg-white shadow-sm rounded-lg p-1 inline-flex items-center overflow-x-auto">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            filter === "all"
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All Activities
        </button>
        <button
          onClick={() => setFilter(ACTIVITY_TYPES.MATCH)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            filter === ACTIVITY_TYPES.MATCH
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Matches
        </button>
        <button
          onClick={() => setFilter(ACTIVITY_TYPES.TRAINING)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            filter === ACTIVITY_TYPES.TRAINING
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Training
        </button>
        <button
          onClick={() => setFilter(ACTIVITY_TYPES.BASKET_DRILL)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            filter === ACTIVITY_TYPES.BASKET_DRILL
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Basket Drills
        </button>
        <button
          onClick={() => setFilter(ACTIVITY_TYPES.FITNESS)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            filter === ACTIVITY_TYPES.FITNESS
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Fitness
        </button>
      </div>
      
      {/* Activities Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Activity</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Type</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Duration</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((activity) => (
              <tr key={activity.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-sm">{activity.name}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center font-medium text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                    <TagIcon className="w-3 h-3 mr-1" />
                    {activity.type}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center text-sm text-gray-600">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {activity.duration}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end items-center space-x-2">
                    <button className="p-1.5 rounded-full hover:bg-gray-100" title="Edit">
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1.5 rounded-full hover:bg-gray-100" title="Delete">
                      <Trash className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No activities match your search</p>
            <button 
              onClick={() => {
                setFilter("all");
                setSearchQuery("");
              }}
              className="mt-2 text-ath-blue hover:text-ath-blue-dark"
            >
              View all activities
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
