
import { useState } from "react";
import { Save, User, Building, LinkIcon, Bell, Shield, Server, CalendarIcon, Layers, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourtsTab from "@/components/settings/CourtsTab";
import TimeSlotsTab from "@/components/settings/TimeSlotsTab";

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
  const { toast } = useToast();
  
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Impostazioni</h1>
        <p className="text-gray-600 mt-1">Gestisci preferenze e integrazioni dell'applicazione</p>
      </div>
      
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-3">
          <div className="bg-white rounded-xl shadow-soft p-3 space-y-1">
            <SettingsTab
              icon={Building}
              title="Generale"
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
              icon={Layers}
              title="Campi"
              id="courts"
              isActive={activeTab === "courts"}
              onClick={() => setActiveTab("courts")}
            />
            <SettingsTab
              icon={Clock}
              title="Fasce Orarie"
              id="timeslots"
              isActive={activeTab === "timeslots"}
              onClick={() => setActiveTab("timeslots")}
            />
            <SettingsTab
              icon={LinkIcon}
              title="Integrazioni"
              id="integrations"
              isActive={activeTab === "integrations"}
              onClick={() => setActiveTab("integrations")}
            />
            <SettingsTab
              icon={Bell}
              title="Notifiche"
              id="notifications"
              isActive={activeTab === "notifications"}
              onClick={() => setActiveTab("notifications")}
            />
            <SettingsTab
              icon={Shield}
              title="Sicurezza"
              id="security"
              isActive={activeTab === "security"}
              onClick={() => setActiveTab("security")}
            />
            <SettingsTab
              icon={Server}
              title="Sistema"
              id="system"
              isActive={activeTab === "system"}
              onClick={() => setActiveTab("system")}
            />
          </div>
        </div>
        
        <div className="col-span-12 md:col-span-9">
          <div className="bg-white rounded-xl shadow-soft p-6">
            {activeTab === "general" && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold mb-6">Informazioni Academy</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Academy
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
                        Indirizzo Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                        defaultValue="contact@ath-tennis.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numero di Telefono
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                        defaultValue="+39 123 456 7890"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Indirizzo
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20 mb-2"
                      defaultValue="Via dei Campi Sportivi, 123"
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                        placeholder="Città"
                        defaultValue="Roma"
                      />
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                        placeholder="Provincia"
                        defaultValue="RM"
                      />
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                        placeholder="CAP"
                        defaultValue="00123"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Orari di Apertura
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Orario Apertura</label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                          defaultValue="08:00"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Orario Chiusura</label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                          defaultValue="20:00"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-3">
                      {["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"].map((day) => (
                        <label
                          key={day}
                          className="inline-flex items-center"
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-ath-blue rounded focus:ring-2 focus:ring-ath-blue/20"
                            defaultChecked={day !== "Domenica"}
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
                    <span>Salva Modifiche</span>
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === "courts" && <CourtsTab />}
            
            {activeTab === "timeslots" && <TimeSlotsTab />}
            
            {activeTab === "integrations" && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold mb-6">Integrazioni API</h2>
                
                <div className="space-y-8">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">Vicki Coach Analytics</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Connettiti a Vicki per dati di coaching e preferenze degli atleti
                        </p>
                      </div>
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        Connesso
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
                            Mostra
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          URL Endpoint
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
                        Frequenza Sincronizzazione Dati
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20 bg-white">
                        <option>Tempo reale</option>
                        <option>Ogni 15 minuti</option>
                        <option>Ogni ora</option>
                        <option>Ogni giorno</option>
                      </select>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button className="px-3 py-1.5 bg-ath-blue text-white rounded hover:bg-ath-blue-dark transition-colors text-sm">
                        Aggiorna Impostazioni
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">Playtomic</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Sincronizza prenotazioni esterne con la piattaforma Playtomic
                        </p>
                      </div>
                      <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                        Configurazione Richiesta
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
                          placeholder="Inserisci la tua API key di Playtomic"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID Account
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
                          placeholder="Inserisci il tuo ID Account"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button className="px-3 py-1.5 bg-ath-blue text-white rounded hover:bg-ath-blue-dark transition-colors text-sm">
                        Connetti
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {(activeTab !== "general" && activeTab !== "integrations" && activeTab !== "courts" && activeTab !== "timeslots") && (
              <div className="py-16 text-center">
                <h2 className="text-xl font-semibold text-gray-400 mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
                <p className="text-gray-500">
                  Questa sezione è in fase di sviluppo
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
