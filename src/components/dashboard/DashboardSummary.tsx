
import React from "react";
import { Calendar, Users, MapPin, ChartBar, Clock, UserCog, Grid, CircleUser } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { it } from "date-fns/locale";

// Statistic Card Component
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  positive?: boolean;
  linkTo?: string;
}

const StatCard = ({ title, value, change, icon: Icon, positive = true, linkTo }: StatCardProps) => {
  const CardContent = () => (
    <div className="bg-white rounded-xl p-6 shadow-soft animate-on-scroll h-full">
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
  
  if (linkTo) {
    return (
      <Link to={linkTo} className="block h-full">
        <CardContent />
      </Link>
    );
  }
  
  return <CardContent />;
};

// Recent Activity Component
interface Activity {
  id: string;
  type: string;
  title: string;
  time: string;
  user?: string;
}

// Dashboard Summary Component
export function DashboardSummary() {
  const today = new Date();
  
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Prenotazioni Attive" 
          value="24" 
          change="+12% rispetto alla scorsa settimana" 
          icon={Calendar} 
          positive={true}
          linkTo="/calendar" 
        />
        <StatCard 
          title="Giocatori Totali" 
          value="187" 
          change="+5 nuovi questa settimana" 
          icon={Users} 
          positive={true}
          linkTo="/players" 
        />
        <StatCard 
          title="Allenatori" 
          value="12" 
          change="+2 nuovi questo mese" 
          icon={UserCog} 
          positive={true}
          linkTo="/coaches" 
        />
        <StatCard 
          title="Utilizzo Campi" 
          value="84%" 
          change="-3% rispetto alla scorsa settimana" 
          icon={ChartBar} 
          positive={false}
          linkTo="/court-vision" 
        />
      </div>
      
      {/* Upcoming Sessions Today */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Programmazione Giornaliera</h2>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span>{format(today, "d MMMM yyyy", { locale: it })}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => {
            const startHour = 9 + i * 2;
            const endHour = startHour + 1;
            
            return (
              <Link 
                key={i} 
                to="/court-vision" 
                className="block"
              >
                <div className={`p-4 rounded-lg shadow-sm ${
                  i === 0 ? "bg-ath-blue-light" : 
                  i === 1 ? "bg-green-50" : "bg-purple-50"
                } hover:shadow-md transition-shadow`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {startHour}:00 - {endHour}:00
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      i === 0 ? "bg-white text-ath-blue" : 
                      i === 1 ? "bg-white text-green-600" : "bg-white text-purple-600"
                    }`}>
                      {i === 0 ? "Allenamento" : i === 1 ? "Lezione Privata" : "Junior Group"}
                    </span>
                  </div>
                  
                  <div className="flex items-start mb-3">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mr-3">
                      <CircleUser className={`h-6 w-6 ${
                        i === 0 ? "text-ath-blue" : 
                        i === 1 ? "text-green-600" : "text-purple-600"
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{
                        i === 0 ? "Group Session" : 
                        i === 1 ? "Private Lesson" : "Junior Training"
                      }</h3>
                      <p className="text-sm">Coach {
                        i === 0 ? "Anderson" : 
                        i === 1 ? "Martinez" : "Thompson"
                      }</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{
                      i === 0 ? "Court #1 (Clay)" : 
                      i === 1 ? "Court #3 (Hard)" : "Center Court"
                    }</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t text-center">
          <Link to="/calendar" className="text-ath-blue hover:text-ath-blue-dark font-medium text-sm">
            Visualizza programmazione completa →
          </Link>
        </div>
      </div>
      
      {/* Players & Coaches Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Giocatori Attivi Oggi</h2>
            <Link to="/players" className="text-ath-blue text-sm font-medium">
              Vedi tutti
            </Link>
          </div>
          
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Link 
                key={i} 
                to={`/players?id=player${i+1}`} 
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">
                    {["Alex Smith", "Emma Johnson", "Michael Brown", "Sophia Davis"][i]}
                  </h3>
                  <div className="flex text-sm">
                    <span className="text-gray-600 mr-2">
                      {["Beginner", "Intermediate", "Advanced", "Professional"][i]}
                    </span>
                    <span className="text-ath-blue">
                      {i % 2 === 0 ? "Tennis" : "Padel"}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                    {format(addDays(today, i), "HH:mm")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Allenatori di Oggi</h2>
            <Link to="/coaches" className="text-ath-blue text-sm font-medium">
              Vedi tutti
            </Link>
          </div>
          
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Link 
                key={i} 
                to={`/coaches?id=coach${i+1}`} 
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-ath-blue-light flex items-center justify-center mr-3">
                  <UserCog className="h-5 w-5 text-ath-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">
                    {["Coach Anderson", "Coach Martinez", "Coach Thompson"][i]}
                  </h3>
                  <div className="flex text-sm">
                    <span className="text-gray-600">
                      {i === 0 ? "Tennis Head Coach" : i === 1 ? "Padel Specialist" : "Junior Coach"}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <div className="h-6 w-6 rounded-full flex items-center justify-center bg-gray-100">
                    <Calendar className="h-3 w-3" />
                  </div>
                  <div className="h-6 w-6 rounded-full flex items-center justify-center bg-gray-100">
                    <Users className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-3">
              <Link 
                to="/court-vision"
                className="p-3 rounded-lg bg-ath-blue-light text-ath-blue font-medium flex items-center justify-center hover:bg-ath-blue hover:text-white transition-colors"
              >
                <Grid className="h-4 w-4 mr-2" />
                <span>Gestisci Campi</span>
              </Link>
              <Link 
                to="/settings"
                className="p-3 rounded-lg bg-gray-100 text-gray-700 font-medium flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <MapPin className="h-4 w-4 mr-2" />
                <span>Impostazioni Email</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
