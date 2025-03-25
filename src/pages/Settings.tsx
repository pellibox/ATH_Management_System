
import { useState } from "react";
import { Save, User, Building, LinkIcon, Bell, Shield, Server } from "lucide-react";

interface SettingsTabProps {
  icon: React.ElementType;
  title: string;
  id: string;
  isActive: boolean;
  onClick: () => void;
}

const SettingsTab = ({ icon: Icon, title, id, isActive, onClick }: SettingsTabProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full text-left px-4 py-3 transition-colors ${
      isActive
        ? "bg-ath-blue-light text-ath-blue font-medium rounded-lg"
        : "text-gray-700 hover:bg-gray-100 rounded-lg"
    }`}
  >
    <Icon className="h-5 w-5" />
    <span>{title}</span>
  </button>
);

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-1">Manage application preferences and integrations</p>
      </div>
      
      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <div className="bg-white rounded-xl shadow-soft p-3 space-y-1">
            <SettingsTab
              icon={Building}
              title="General"
              id="general"
              isActive={activeTab === "general"}
              onClick={() => setActiveTab("general")}
            />
            <SettingsTab
              icon={User}
              title="Account"
              id="account"
              isActive={activeTab === "account"}
              onClick={() => setActiveTab("account")}
            />
            <SettingsTab
              icon={LinkIcon}
              title="Integrations"
              id="integrations"
              isActive={activeTab === "integrations"}
              onClick={() => setActiveTab("integrations")}
            />
            <SettingsTab
              icon={Bell}
              title="Notifications"
              id="notifications"
              isActive={activeTab === "notifications"}
              onClick={() => setActiveTab("notifications")}
            />
            <SettingsTab
              icon={Shield}
              title="Security"
              id="security"
              isActive={activeTab === "security"}
              onClick={() => setActiveTab("security")}
            />
            <SettingsTab
              icon={Server}
              title="System"
              id="system"
              isActive={activeTab === "system"}
              onClick={() => setActiveTab("system")}
            />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="col-span-12 md:col-span-9">
          <div className="bg-white rounded-xl shadow-soft p-6">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold mb-6">Academy Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Academy Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                      defaultValue="ATH Tennis Academy"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                        defaultValue="contact@ath-tennis.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                        defaultValue="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20 mb-2"
                      defaultValue="123 Tennis Court Avenue"
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                        placeholder="City"
                        defaultValue="Sportsville"
                      />
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                        placeholder="State"
                        defaultValue="CA"
                      />
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                        placeholder="Zip Code"
                        defaultValue="90210"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Hours
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Opening Time</label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                          defaultValue="08:00"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Closing Time</label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                          defaultValue="20:00"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-3">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <label
                          key={day}
                          className="inline-flex items-center"
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-ath-blue rounded focus:ring-2 focus:ring-ath-blue/20"
                            defaultChecked={day !== "Sunday"}
                          />
                          <span className="ml-2 text-sm text-gray-700">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t flex justify-end">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors">
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            )}
            
            {/* Integration Settings */}
            {activeTab === "integrations" && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold mb-6">API Integrations</h2>
                
                <div className="space-y-8">
                  {/* Vicki Integration */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">Vicki Coach Analytics</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Connect to Vicki for coaching data and athlete preferences
                        </p>
                      </div>
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        Connected
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          API Key
                        </label>
                        <div className="flex">
                          <input
                            type="password"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                            value="••••••••••••••••••••••"
                            readOnly
                          />
                          <button className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-700 hover:bg-gray-200 transition-colors">
                            Show
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Endpoint URL
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                          defaultValue="https://api.vicki.ai/v2/"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data Sync Frequency
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20 bg-white">
                        <option>Real-time</option>
                        <option>Every 15 minutes</option>
                        <option>Every hour</option>
                        <option>Every day</option>
                      </select>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button className="px-3 py-1.5 bg-ath-blue text-white rounded hover:bg-ath-blue-dark transition-colors text-sm">
                        Update Settings
                      </button>
                    </div>
                  </div>
                  
                  {/* Playtomic Integration */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">Playtomic</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Synchronize external bookings with Playtomic platform
                        </p>
                      </div>
                      <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                        Setup Required
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          API Key
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                          placeholder="Enter your Playtomic API key"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account ID
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                          placeholder="Enter your Account ID"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button className="px-3 py-1.5 bg-ath-blue text-white rounded hover:bg-ath-blue-dark transition-colors text-sm">
                        Connect
                      </button>
                    </div>
                  </div>
                  
                  {/* KNX Integration */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">KNX Home Automation</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Control court lighting and climate systems automatically
                        </p>
                      </div>
                      <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                        Not Connected
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm">
                        Setup Connection
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Placeholder for other tabs */}
            {(activeTab !== "general" && activeTab !== "integrations") && (
              <div className="py-16 text-center">
                <h2 className="text-xl font-semibold text-gray-400 mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
                </h2>
                <p className="text-gray-500">
                  This section is under development
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
