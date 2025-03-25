
import { useState, useEffect } from "react";
import { Calendar, Users, MapPin, ChartBar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Statistic Card Component
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  positive?: boolean;
}

const StatCard = ({ title, value, change, icon: Icon, positive = true }: StatCardProps) => (
  <div className="bg-white rounded-xl p-6 shadow-soft animate-on-scroll">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        <div className={cn(
          "flex items-center mt-1 text-xs font-medium",
          positive ? "text-green-600" : "text-red-500"
        )}>
          <span>{change}</span>
        </div>
      </div>
      <div className="h-10 w-10 rounded-full bg-ath-blue-light flex items-center justify-center text-ath-blue">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

// Recent Activity Component
interface Activity {
  id: string;
  type: string;
  title: string;
  time: string;
  user?: string;
}

const recentActivities: Activity[] = [
  { id: "1", type: "booking", title: "New booking - Advanced Training", time: "10 mins ago", user: "Coach Smith" },
  { id: "2", type: "cancellation", title: "Cancelled - Junior Group", time: "42 mins ago" },
  { id: "3", type: "update", title: "Updated court #3 maintenance", time: "2 hours ago", user: "Admin" },
  { id: "4", type: "booking", title: "New booking - Private Lesson", time: "3 hours ago", user: "Coach Williams" },
  { id: "5", type: "update", title: "Updated system settings", time: "Yesterday", user: "Admin" }
];

// Upcoming Courts Component
interface CourtSession {
  id: string;
  court: string;
  time: string;
  title: string;
  instructor: string;
  type: "clay" | "grass" | "hard" | "central";
}

const upcomingSessions: CourtSession[] = [
  { id: "1", court: "Court 1", time: "11:00 - 12:30", title: "Advanced Training", instructor: "Coach Smith", type: "clay" },
  { id: "2", court: "Court 2", time: "13:00 - 14:00", title: "Junior Group", instructor: "Coach Williams", type: "grass" },
  { id: "3", court: "Court 3", time: "15:00 - 16:00", title: "Private Lesson", instructor: "Coach Martinez", type: "hard" },
  { id: "4", court: "Central", time: "17:00 - 19:00", title: "Tournament Prep", instructor: "Coach Johnson", type: "central" }
];

export default function Dashboard() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Trigger animations after mount
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className={cn(
        "mb-8 opacity-0 transform translate-y-4 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : ""
      )}>
        <h1 className="text-3xl font-bold">Welcome to ATH Management System</h1>
        <p className="text-gray-600 mt-1">Here's what's happening at your academy today</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Active Bookings" 
          value="24" 
          change="+12% from last week" 
          icon={Calendar} 
          positive={true} 
        />
        <StatCard 
          title="Total Students" 
          value="187" 
          change="+5 new this week" 
          icon={Users} 
          positive={true} 
        />
        <StatCard 
          title="Courts Available" 
          value="3/8" 
          change="5 currently in use" 
          icon={MapPin} 
          positive={true} 
        />
        <StatCard 
          title="Court Usage" 
          value="84%" 
          change="-3% from last week" 
          icon={ChartBar} 
          positive={false} 
        />
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Sessions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-soft overflow-hidden animate-on-scroll">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Today's Sessions</h2>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>June 25, 2024</span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div 
                    key={session.id} 
                    className={cn(
                      "flex items-center p-3 rounded-lg",
                      `court-${session.type} shadow-sm card-hover`
                    )}
                  >
                    <div className="mr-4">
                      <p className="text-sm font-medium">{session.time}</p>
                      <p className="text-xs text-gray-600 mt-1">{session.court}</p>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{session.title}</h3>
                      <p className="text-sm text-gray-600">{session.instructor}</p>
                    </div>
                    <div>
                      <button className="text-xs bg-white/90 hover:bg-white px-2 py-1 rounded shadow-sm transition-colors">
                        View details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <button className="text-ath-blue hover:text-ath-blue-dark font-medium text-sm">
                  View full schedule →
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="animate-on-scroll">
          <div className="bg-white rounded-xl shadow-soft overflow-hidden h-full">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-start">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center mr-3",
                        activity.type === "booking" ? "bg-green-100 text-green-600" :
                        activity.type === "cancellation" ? "bg-red-100 text-red-500" :
                        "bg-blue-100 text-blue-600"
                      )}>
                        {activity.type === "booking" ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        ) : activity.type === "cancellation" ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-500">{activity.time}</p>
                          {activity.user && (
                            <p className="text-xs text-ath-blue">{activity.user}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t text-center">
                <button className="text-ath-blue hover:text-ath-blue-dark font-medium text-sm">
                  View all activity →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
