import React, { useState, useEffect } from "react";
import { Calendar, Users, MapPin, ChartBar, Clock, UserCog, Grid, CircleUser, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { it } from "date-fns/locale";
import { useCourtVision } from "@/components/court-vision/context/CourtVisionContext";
import { PersonData } from "@/components/court-vision/types";
import { usePlayerContext } from "@/contexts/PlayerContext";

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

// Dashboard Summary Component
export function DashboardSummary() {
  const today = new Date();
  const { 
    coachesList, 
    playersList, 
    courts, 
    filteredCourts,
    activities 
  } = useCourtVision();
  const { players, filteredPlayers } = usePlayerContext();
  
  const [presentCoaches, setPresentCoaches] = useState<PersonData[]>([]);
  const [absentCoaches, setAbsentCoaches] = useState<PersonData[]>([]);
  const [activePlayers, setActivePlayers] = useState<PersonData[]>([]);
  const [courtUtilization, setCourtUtilization] = useState({
    percentage: 0,
    trend: 0
  });
  
  // Calculate court utilization
  useEffect(() => {
    if (courts.length) {
      const occupiedCourts = courts.filter(court => court.occupants && court.occupants.length > 0).length;
      const utilizationPercentage = Math.round((occupiedCourts / courts.length) * 100);
      
      // For trend, we'll simulate this for now, but in a real app this would come from historical data
      const randomTrend = Math.floor(Math.random() * 10) - 5; // Random number between -5 and 5
      
      setCourtUtilization({
        percentage: utilizationPercentage,
        trend: randomTrend
      });
    }
  }, [courts]);
  
  // Process coaches presence/absence
  useEffect(() => {
    // In a real app, this would likely come from the availability events
    // For now, we'll simulate some coaches being absent
    const simulatePresence = (coach: PersonData): PersonData => {
      const random = Math.random();
      if (random > 0.7) {
        // Coach is absent
        const reasons = ["Malattia", "Vacanza", "Trasferta", "Formazione"];
        return {
          ...coach,
          isPresent: false,
          absenceReason: reasons[Math.floor(Math.random() * reasons.length)]
        };
      }
      return { ...coach, isPresent: true };
    };
    
    const processedCoaches = coachesList.map(simulatePresence);
    setPresentCoaches(processedCoaches.filter(coach => coach.isPresent));
    setAbsentCoaches(processedCoaches.filter(coach => !coach.isPresent));
  }, [coachesList]);
  
  // Get active players for today
  useEffect(() => {
    // This would normally be filtered by today's date
    // For simplicity, we'll just take a few players from the list
    const getActivePlayers = () => {
      if (playersList.length === 0) return [];
      
      // In a real app we would check court assignments for today
      const playerIds = courts
        .flatMap(court => court.occupants)
        .filter(occupant => occupant.type === 'player')
        .map(player => player.id);
      
      // Get the players that match these IDs, or take a few random ones if none match
      const matchingPlayers = playersList.filter(player => playerIds.includes(player.id));
      
      if (matchingPlayers.length) {
        return matchingPlayers.slice(0, 4);
      } else {
        // Fallback: get a few random players
        return playersList.slice(0, Math.min(4, playersList.length));
      }
    };
    
    setActivePlayers(getActivePlayers());
  }, [playersList, courts]);
  
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Prenotazioni Attive" 
          value={`${activities ? activities.length : 0}`} 
          change="+12% rispetto alla scorsa settimana" 
          icon={Calendar} 
          positive={true}
          linkTo="/calendar" 
        />
        <StatCard 
          title="Giocatori Totali" 
          value={`${players ? players.length : 0}`} 
          change={`+${Math.floor(players.length * 0.05)} nuovi questa settimana`} 
          icon={Users} 
          positive={true}
          linkTo="/players" 
        />
        <StatCard 
          title="Allenatori" 
          value={`${coachesList ? coachesList.length : 0}`} 
          change="+2 nuovi questo mese" 
          icon={UserCog} 
          positive={true}
          linkTo="/coaches" 
        />
        <StatCard 
          title="Utilizzo Campi" 
          value={`${courtUtilization.percentage}%`} 
          change={`${courtUtilization.trend > 0 ? '+' : ''}${courtUtilization.trend}% rispetto alla scorsa settimana`} 
          icon={ChartBar} 
          positive={courtUtilization.trend >= 0}
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
          {activePlayers.slice(0, 3).map((player, i) => {
            const startHour = 9 + i * 2;
            const endHour = startHour + 1;
            
            return (
              <Link 
                key={player.id} 
                to={`/court-vision?playerId=${player.id}`} 
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
                        player.name
                      }</h3>
                      <p className="text-sm">Coach {
                        presentCoaches[i] ? presentCoaches[i].name.split(' ')[1] : "Anderson"
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
        {/* Players Section */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Giocatori Attivi Oggi</h2>
            <Link to="/players" className="text-ath-blue text-sm font-medium">
              Vedi tutti
            </Link>
          </div>
          
          <div className="space-y-3">
            {activePlayers.map((player, i) => (
              <Link 
                key={player.id} 
                to={`/players?id=${player.id}`} 
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{player.name}</h3>
                  <div className="flex text-sm">
                    <span className="text-gray-600 mr-2">
                      {["Beginner", "Intermediate", "Advanced", "Professional"][i % 4]}
                    </span>
                    <span className="text-ath-blue">
                      {player.sportTypes && player.sportTypes.length > 0 
                        ? player.sportTypes[0] 
                        : (i % 2 === 0 ? "Tennis" : "Padel")}
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
        
        {/* Coaches Section - Updated to show presence/absence */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Allenatori di Oggi</h2>
            <Link to="/coaches" className="text-ath-blue text-sm font-medium">
              Vedi tutti
            </Link>
          </div>
          
          {/* Present Coaches */}
          <div className="mb-4">
            <h3 className="text-sm font-medium flex items-center mb-2 text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Allenatori Presenti ({presentCoaches.length})
            </h3>
            
            <div className="space-y-2">
              {presentCoaches.length > 0 ? (
                presentCoaches.slice(0, 3).map((coach, i) => (
                  <Link 
                    key={coach.id} 
                    to={`/coaches?id=${coach.id}`} 
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-ath-blue-light flex items-center justify-center mr-3">
                      <UserCog className="h-5 w-5 text-ath-blue" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{coach.name}</h3>
                      <div className="flex text-sm">
                        <span className="text-gray-600">
                          {coach.sportTypes ? coach.sportTypes.join(', ') : "Tennis Coach"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="h-6 w-6 rounded-full flex items-center justify-center bg-green-100">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">Nessun allenatore presente oggi</p>
              )}
            </div>
          </div>
          
          {/* Absent Coaches */}
          <div>
            <h3 className="text-sm font-medium flex items-center mb-2 text-amber-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              Allenatori Assenti ({absentCoaches.length})
            </h3>
            
            <div className="space-y-2">
              {absentCoaches.length > 0 ? (
                absentCoaches.slice(0, 3).map((coach, i) => (
                  <Link 
                    key={coach.id} 
                    to={`/coaches?id=${coach.id}`} 
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <UserCog className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{coach.name}</h3>
                      <div className="flex text-sm">
                        <span className="text-amber-600">
                          {coach.absenceReason || "Non disponibile"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="h-6 w-6 rounded-full flex items-center justify-center bg-amber-100">
                        <AlertCircle className="h-3 w-3 text-amber-600" />
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">Tutti gli allenatori sono presenti oggi</p>
              )}
            </div>
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
                to="/coaches"
                className="p-3 rounded-lg bg-gray-100 text-gray-700 font-medium flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <UserCog className="h-4 w-4 mr-2" />
                <span>Gestione Allenatori</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

