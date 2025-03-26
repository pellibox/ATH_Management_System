
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourtsTab from "@/components/settings/CourtsTab";
import TimeSlotsTab from "@/components/settings/TimeSlotsTab";
import { EmailSettingsTab } from "@/components/settings/EmailSettingsTab";
import { SettingsIcon, Clock, MapPin, Mail } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<string>("courts");
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <SettingsIcon className="mr-3 h-8 w-8" />
          Impostazioni Sistema
        </h1>
        <p className="text-gray-600 mt-1">
          Gestisci e configura le impostazioni del sistema
        </p>
      </div>
      
      <Tabs 
        defaultValue="courts" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="courts" className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Campi
          </TabsTrigger>
          <TabsTrigger value="time-slots" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Fasce Orarie
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email Schedules
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="courts" className="mt-6">
          <CourtsTab />
        </TabsContent>
        
        <TabsContent value="time-slots" className="mt-6">
          <TimeSlotsTab />
        </TabsContent>
        
        <TabsContent value="email" className="mt-6">
          <EmailSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
