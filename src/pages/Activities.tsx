
import { useState } from "react";
import { Plus, Search, TagIcon, Clock, Edit, Trash, Brain, HeartPulse, Target, Zap, Lightbulb, Dumbbell } from "lucide-react";
import { ACTIVITY_TYPES } from "@/components/court-vision/constants";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Activity = {
  id: string;
  name: string;
  type: string;
  duration: string;
  description?: string;
};

// Define additional activity types
const ACTIVITY_SUBTYPES = {
  FITNESS: "Preparazione Atletica",
  MENTAL: "Mental Coaching",
  MEDICAL: "Medical Assessment",
  STRATEGY: "Strategia e Tattica",
  TECHNIQUE: "Tecnica",
  BIOMECHANICS: "Biomechanical Analysis"
};

export default function Activities() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const [activities, setActivities] = useState<Activity[]>([
    { id: "activity1", name: "Singles Match", type: ACTIVITY_TYPES.MATCH, duration: "1h" },
    { id: "activity2", name: "Group Training", type: ACTIVITY_TYPES.TRAINING, duration: "1.5h" },
    { id: "activity3", name: "Basket Drill", type: ACTIVITY_TYPES.BASKET_DRILL, duration: "45m" },
    { id: "activity4", name: "Doubles Match", type: ACTIVITY_TYPES.MATCH, duration: "1.5h" },
    { id: "activity5", name: "Serve Practice", type: ACTIVITY_TYPES.TRAINING, duration: "30m" },
    { id: "activity6", name: "Fitness Training", type: ACTIVITY_SUBTYPES.FITNESS, duration: "1h" },
    { id: "activity7", name: "Tournament Match", type: ACTIVITY_TYPES.MATCH, duration: "2h" },
    { id: "activity8", name: "Mental Preparation", type: ACTIVITY_SUBTYPES.MENTAL, duration: "1h" },
    { id: "activity9", name: "Physical Assessment", type: ACTIVITY_SUBTYPES.MEDICAL, duration: "1h" },
    { id: "activity10", name: "Strategy Session", type: ACTIVITY_SUBTYPES.STRATEGY, duration: "1h" },
    { id: "activity11", name: "Technical Drill", type: ACTIVITY_SUBTYPES.TECHNIQUE, duration: "1h" },
    { id: "activity12", name: "Biomechanical Evaluation", type: ACTIVITY_SUBTYPES.BIOMECHANICS, duration: "1.5h" },
  ]);
  
  const filteredActivities = activities
    .filter(activity => {
      if (activeTab === "all") return true;
      if (activeTab === "fitness") return activity.type === ACTIVITY_SUBTYPES.FITNESS;
      if (activeTab === "mental") return activity.type === ACTIVITY_SUBTYPES.MENTAL;
      if (activeTab === "medical") return activity.type === ACTIVITY_SUBTYPES.MEDICAL;
      if (activeTab === "strategy") return activity.type === ACTIVITY_SUBTYPES.STRATEGY;
      if (activeTab === "technique") return activity.type === ACTIVITY_SUBTYPES.TECHNIQUE;
      if (activeTab === "biomechanics") return activity.type === ACTIVITY_SUBTYPES.BIOMECHANICS;
      
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
    toast({
      title: "Not Implemented",
      description: "This feature is not yet implemented in this demo.",
    });
  };

  const navigateToPrograms = () => {
    navigate('/programs');
  };
  
  // Function to get the icon for a specific activity type
  const getActivityIcon = (type: string) => {
    switch(type) {
      case ACTIVITY_SUBTYPES.FITNESS:
        return <Dumbbell className="w-3 h-3 mr-1" />;
      case ACTIVITY_SUBTYPES.MENTAL:
        return <Brain className="w-3 h-3 mr-1" />;
      case ACTIVITY_SUBTYPES.MEDICAL:
        return <HeartPulse className="w-3 h-3 mr-1" />;
      case ACTIVITY_SUBTYPES.STRATEGY:
        return <Target className="w-3 h-3 mr-1" />;
      case ACTIVITY_SUBTYPES.TECHNIQUE:
        return <Zap className="w-3 h-3 mr-1" />;
      case ACTIVITY_SUBTYPES.BIOMECHANICS:
        return <Lightbulb className="w-3 h-3 mr-1" />;
      default:
        return <TagIcon className="w-3 h-3 mr-1" />;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Attività</h1>
          <p className="text-gray-600 mt-1">Gestione delle attività di allenamento</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Cerca attività..."
              className="h-10 w-64 rounded-lg bg-white shadow-sm pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button 
            onClick={navigateToPrograms}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <TagIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Vedi Programmi</span>
          </button>
          
          <button 
            onClick={handleAddActivity}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">Aggiungi Attività</span>
          </button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-white shadow-sm rounded-lg p-1 overflow-x-auto flex flex-nowrap">
          <TabsTrigger value="all" className="px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap">
            Tutte le Attività
          </TabsTrigger>
          <TabsTrigger value="fitness" className="px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap">
            <Dumbbell className="h-3.5 w-3.5 mr-1.5" />
            Preparazione Atletica
          </TabsTrigger>
          <TabsTrigger value="mental" className="px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap">
            <Brain className="h-3.5 w-3.5 mr-1.5" />
            Mental Coaching
          </TabsTrigger>
          <TabsTrigger value="medical" className="px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap">
            <HeartPulse className="h-3.5 w-3.5 mr-1.5" />
            Medical Assessment
          </TabsTrigger>
          <TabsTrigger value="strategy" className="px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap">
            <Target className="h-3.5 w-3.5 mr-1.5" />
            Strategia e Tattica
          </TabsTrigger>
          <TabsTrigger value="technique" className="px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap">
            <Zap className="h-3.5 w-3.5 mr-1.5" />
            Tecnica
          </TabsTrigger>
          <TabsTrigger value="biomechanics" className="px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap">
            <Lightbulb className="h-3.5 w-3.5 mr-1.5" />
            Biomechanical Analysis
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="mb-6 bg-white shadow-sm rounded-lg p-1 inline-flex items-center overflow-x-auto">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            filter === "all"
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Tutte le Attività
        </button>
        <button
          onClick={() => setFilter(ACTIVITY_TYPES.MATCH)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            filter === ACTIVITY_TYPES.MATCH
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Partite
        </button>
        <button
          onClick={() => setFilter(ACTIVITY_TYPES.TRAINING)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            filter === ACTIVITY_TYPES.TRAINING
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Allenamento
        </button>
        <button
          onClick={() => setFilter(ACTIVITY_TYPES.BASKET_DRILL)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            filter === ACTIVITY_TYPES.BASKET_DRILL
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Esercizi con Cesto
        </button>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Attività</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Tipo</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Durata</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600 text-sm">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((activity) => (
              <tr key={activity.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-sm">{activity.name}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center font-medium text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                    {getActivityIcon(activity.type)}
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
                    <button className="p-1.5 rounded-full hover:bg-gray-100" title="Modifica">
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1.5 rounded-full hover:bg-gray-100" title="Elimina">
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
            <p className="text-lg text-gray-500">Nessuna attività corrisponde alla tua ricerca</p>
            <button 
              onClick={() => {
                setFilter("all");
                setSearchQuery("");
                setActiveTab("all");
              }}
              className="mt-2 text-ath-blue hover:text-ath-blue-dark"
            >
              Visualizza tutte le attività
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
