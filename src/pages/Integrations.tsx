
import { useState, useEffect } from "react";
import { GitMerge, Play, Pause, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const integrations = [
  {
    id: "vicki",
    name: "Vicki",
    description: "Coaching analysis and athlete management system",
    status: "connected",
    lastSync: "10 minutes ago",
    features: [
      "Athlete preferences synchronization",
      "Session data exchange",
      "Player analytics"
    ],
    image: "https://via.placeholder.com/100?text=Vicki"
  },
  {
    id: "playtomic",
    name: "Playtomic",
    description: "External court booking system",
    status: "connected",
    lastSync: "5 minutes ago",
    features: [
      "Real-time booking synchronization",
      "Court availability management",
      "Player directory integration"
    ],
    image: "https://via.placeholder.com/100?text=Playtomic"
  },
  {
    id: "knx",
    name: "KNX System",
    description: "Smart facility management and control",
    status: "connected",
    lastSync: "2 hours ago",
    features: [
      "Court lighting control",
      "Climate control synchronization",
      "Automated scheduling"
    ],
    image: "https://via.placeholder.com/100?text=KNX"
  },
  {
    id: "payments",
    name: "Payment Gateway",
    description: "Online payment processing system",
    status: "issue",
    lastSync: "1 day ago",
    features: [
      "Secure payment processing",
      "Invoice generation",
      "Subscription management"
    ],
    image: "https://via.placeholder.com/100?text=Payments"
  }
];

export default function Integrations() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Trigger animations after mount
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);
  
  // Function to render status indicator
  const renderStatus = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <div className="flex items-center">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
            <span className="text-green-600 font-medium">Connected</span>
          </div>
        );
      case "disconnected":
        return (
          <div className="flex items-center">
            <div className="h-2.5 w-2.5 rounded-full bg-gray-400 mr-2"></div>
            <span className="text-gray-600 font-medium">Disconnected</span>
          </div>
        );
      case "issue":
        return (
          <div className="flex items-center">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500 mr-2"></div>
            <span className="text-amber-600 font-medium">Connection Issue</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className={`mb-8 opacity-0 transform translate-y-4 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : ""
      }`}>
        <h1 className="text-3xl font-bold">System Integrations</h1>
        <p className="text-gray-600 mt-1">Manage connections with external services and APIs</p>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-soft mb-8 animate-on-scroll">
        <div className="flex items-center mb-4">
          <GitMerge className="h-6 w-6 text-ath-blue mr-2" />
          <h2 className="text-xl font-semibold">Integration Hub</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Connect and manage all your external services from one place. ATH Management System can integrate with various services to enhance your academy's operations.
        </p>
        <button className="bg-ath-blue text-white px-4 py-2 rounded-lg hover:bg-ath-blue-dark transition-colors shadow-sm">
          Add New Integration
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 animate-on-scroll">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white rounded-xl shadow-soft overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <img 
                    src={integration.image} 
                    alt={integration.name} 
                    className="w-12 h-12 rounded-lg mr-4 object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{integration.name}</h3>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {renderStatus(integration.status)}
                  <span className="text-xs text-gray-500 mt-1">Last sync: {integration.lastSync}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">FEATURES</h4>
              <ul className="space-y-2 mb-4">
                {integration.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex justify-between mt-6">
                <div className="flex space-x-2">
                  {integration.status === "connected" ? (
                    <button className="flex items-center bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors text-sm">
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </button>
                  ) : (
                    <button className="flex items-center bg-ath-blue text-white px-3 py-1.5 rounded hover:bg-ath-blue-dark transition-colors text-sm">
                      <Play className="h-4 w-4 mr-1" />
                      Activate
                    </button>
                  )}
                  
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="flex items-center bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors text-sm">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Sync Now
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-4 text-sm">
                      <p>Manually trigger a data synchronization with {integration.name}.</p>
                      <p className="mt-2 text-xs text-gray-500">Last automatic sync: {integration.lastSync}</p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                
                <button className="text-gray-500 hover:text-gray-700 text-sm">
                  Configure
                </button>
              </div>
              
              {integration.status === "issue" && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-amber-800 font-medium">Connection issue detected</p>
                    <p className="text-xs text-amber-700 mt-1">
                      The system couldn't connect to the payment gateway. Please check your API credentials or contact support.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
