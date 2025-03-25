
import { useState, useEffect } from "react";
import { Trophy, Users, Calendar, MapPin } from 'lucide-react';

const upcomingTournaments = [
  {
    id: 1,
    title: "Summer Championship",
    date: "June 15-20, 2024",
    location: "Central Court",
    participants: 32,
    registrationOpen: true,
    image: "https://images.unsplash.com/photo-1596657365918-2c0cb1bd1ef0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    title: "Junior Open",
    date: "July 5-10, 2024",
    location: "Clay Courts 1-4",
    participants: 24,
    registrationOpen: true,
    image: "https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    title: "Masters Series",
    date: "August 12-18, 2024",
    location: "All Courts",
    participants: 16,
    registrationOpen: false,
    image: "https://images.unsplash.com/photo-1587385883538-d82f98913ce8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

const pastTournaments = [
  {
    id: 4,
    title: "Spring Classic",
    date: "April 10-15, 2024",
    location: "Hard Courts 1-3",
    winner: "Alex Johnson",
    runnerUp: "Maria Garcia"
  },
  {
    id: 5,
    title: "Winter Indoor Cup",
    date: "February 5-10, 2024",
    location: "Indoor Courts 1-2",
    winner: "David Smith",
    runnerUp: "Sophia Chen"
  }
];

export default function Tournaments() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Trigger animations after mount
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className={`mb-8 opacity-0 transform translate-y-4 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : ""
      }`}>
        <h1 className="text-3xl font-bold">Tournament Management</h1>
        <p className="text-gray-600 mt-1">Organize and manage your tennis tournaments</p>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <button className="bg-ath-blue text-white px-4 py-2 rounded-lg hover:bg-ath-blue-dark transition-colors shadow-sm">
          Create New Tournament
        </button>
        <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors shadow-sm">
          View Tournament Calendar
        </button>
      </div>
      
      <h2 className="text-2xl font-semibold mb-6">Upcoming Tournaments</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {upcomingTournaments.map((tournament) => (
          <div key={tournament.id} className="bg-white rounded-xl overflow-hidden shadow-soft animate-on-scroll">
            <div className="h-48 overflow-hidden">
              <img 
                src={tournament.image} 
                alt={tournament.title} 
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{tournament.title}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-ath-blue" />
                  <span>{tournament.date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-ath-blue" />
                  <span>{tournament.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-ath-blue" />
                  <span>{tournament.participants} Participants</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded ${
                  tournament.registrationOpen 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {tournament.registrationOpen ? "Registration Open" : "Coming Soon"}
                </span>
                <button className="text-ath-blue hover:text-ath-blue-dark text-sm font-medium">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <h2 className="text-2xl font-semibold mb-6">Past Tournaments</h2>
      
      <div className="bg-white rounded-xl shadow-soft overflow-hidden animate-on-scroll">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tournament
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Winner
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Runner-up
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pastTournaments.map((tournament) => (
              <tr key={tournament.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 text-ath-blue mr-2" />
                    <div className="text-sm font-medium text-gray-900">{tournament.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tournament.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tournament.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{tournament.winner}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tournament.runnerUp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-ath-blue hover:text-ath-blue-dark font-medium">
                    View Results
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
