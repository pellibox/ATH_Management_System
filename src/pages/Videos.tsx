
import { useState, useEffect } from "react";
import { Play, Filter, Search } from 'lucide-react';

const videoCategories = ["All Videos", "Training Sessions", "Matches", "Tournament Highlights", "Technical Analysis"];

const videoCollection = [
  {
    id: 1,
    title: "Advanced Forehand Technique",
    date: "May 15, 2024",
    duration: "28:45",
    category: "Technical Analysis",
    coach: "Coach Smith",
    thumbnail: "https://images.unsplash.com/photo-1622279457486-28f24e062503?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    title: "Junior Group Session",
    date: "May 12, 2024",
    duration: "45:10",
    category: "Training Sessions",
    coach: "Coach Williams",
    thumbnail: "https://images.unsplash.com/photo-1531315396756-905d68d21b56?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    title: "Summer Tournament Final",
    date: "April 30, 2024",
    duration: "1:24:30",
    category: "Matches",
    coach: "N/A",
    thumbnail: "https://images.unsplash.com/photo-1621685795973-22ef539beaad?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 4,
    title: "Serve Analysis Workshop",
    date: "April 25, 2024",
    duration: "52:15",
    category: "Technical Analysis",
    coach: "Coach Martinez",
    thumbnail: "https://images.unsplash.com/photo-1586787940030-f3d52dbfd085?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 5,
    title: "Spring Tournament Highlights",
    date: "April 15, 2024",
    duration: "15:30",
    category: "Tournament Highlights",
    coach: "N/A",
    thumbnail: "https://images.unsplash.com/photo-1522778034537-20a2486be803?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 6,
    title: "Advanced Group Training",
    date: "April 10, 2024",
    duration: "1:05:20",
    category: "Training Sessions",
    coach: "Coach Johnson",
    thumbnail: "https://images.unsplash.com/photo-1600679472829-3044539ce8ed?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

export default function Videos() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Videos");
  const [filteredVideos, setFilteredVideos] = useState(videoCollection);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Trigger animations after mount
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);
  
  // Filter videos based on category and search term
  useEffect(() => {
    let filtered = videoCollection;
    
    if (activeCategory !== "All Videos") {
      filtered = filtered.filter(video => video.category === activeCategory);
    }
    
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(video => 
        video.title.toLowerCase().includes(searchLower) || 
        video.coach.toLowerCase().includes(searchLower) ||
        video.category.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredVideos(filtered);
  }, [activeCategory, searchTerm]);
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className={`mb-8 opacity-0 transform translate-y-4 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : ""
      }`}>
        <h1 className="text-3xl font-bold">Video Archive</h1>
        <p className="text-gray-600 mt-1">Browse and manage training videos and match recordings</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div className="flex items-center bg-white rounded-lg border shadow-sm w-full md:w-auto">
          <Search className="ml-3 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search videos..."
            className="w-full md:w-64 h-10 rounded-lg bg-transparent px-3 py-2 text-sm focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="bg-ath-blue text-white px-4 py-2 rounded-lg hover:bg-ath-blue-dark transition-colors shadow-sm">
            Upload Video
          </button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors shadow-sm flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>
      
      <div className="mb-6 overflow-x-auto">
        <div className="inline-flex bg-white rounded-lg p-1 shadow-sm">
          {videoCategories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                activeCategory === category
                  ? "bg-ath-blue text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div key={video.id} className="bg-white rounded-xl overflow-hidden shadow-soft animate-on-scroll">
            <div className="relative">
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <button className="bg-white/90 rounded-full p-3 transform hover:scale-110 transition-transform">
                  <Play className="h-6 w-6 text-ath-blue" />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold leading-tight">{video.title}</h3>
                <span className="text-xs bg-ath-blue-light text-ath-blue px-2 py-0.5 rounded">
                  {video.category}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-3">
                <p>{video.date}</p>
                {video.coach !== "N/A" && <p>Coach: {video.coach}</p>}
              </div>
              
              <div className="flex justify-between items-center">
                <button className="text-ath-blue hover:text-ath-blue-dark text-sm font-medium">
                  View Details
                </button>
                <button className="text-gray-500 hover:text-gray-700 text-sm">
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredVideos.length === 0 && (
        <div className="bg-white rounded-xl p-10 text-center shadow-soft animate-on-scroll">
          <p className="text-lg text-gray-600">No videos found matching your criteria.</p>
          <button 
            className="mt-4 text-ath-blue hover:text-ath-blue-dark font-medium"
            onClick={() => {
              setActiveCategory("All Videos");
              setSearchTerm("");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
