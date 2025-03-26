
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, Save } from "lucide-react";

export function EmailSettingsTab() {
  const { toast } = useToast();
  const [emailSettings, setEmailSettings] = useState({
    senderEmail: "",
    sendCopy: false,
    emailFooter: "",
    scheduleSubject: "Programmazione Allenamento - {{date}}",
    reminderSubject: "Promemoria Allenamento - {{date}}",
    sendAutomaticReminders: false,
    smtpServer: "",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    useSMTP: false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailSettings({
      ...emailSettings,
      [name]: value
    });
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setEmailSettings({
      ...emailSettings,
      [name]: checked
    });
  };
  
  const handleSaveSettings = () => {
    // In a real app, save these settings to a backend
    console.log("Saving email settings:", emailSettings);
    
    toast({
      title: "Impostazioni salvate",
      description: "Le impostazioni per l'invio degli schedule sono state salvate con successo."
    });
  };
  
  const handleTestEmail = () => {
    // In a real app, this would send a test email
    toast({
      title: "Email di test inviata",
      description: `Un'email di test è stata inviata a ${emailSettings.senderEmail}`
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Impostazioni Email per Schedules
          </CardTitle>
          <CardDescription>
            Configura le impostazioni per l'invio delle programmazioni via email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="senderEmail">Email Mittente</Label>
            <Input
              id="senderEmail"
              name="senderEmail"
              placeholder="nome@tuaaccademia.com"
              value={emailSettings.senderEmail}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500">Quest'email sarà utilizzata come mittente per tutte le comunicazioni</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="sendCopy"
              checked={emailSettings.sendCopy}
              onCheckedChange={(checked) => handleSwitchChange("sendCopy", checked)}
            />
            <Label htmlFor="sendCopy">Invia una copia all'email del mittente</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emailFooter">Firma/Footer Email</Label>
            <Input
              id="emailFooter"
              name="emailFooter"
              placeholder="Il Team di Coaching"
              value={emailSettings.emailFooter}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scheduleSubject">Oggetto Email Programmazione</Label>
            <Input
              id="scheduleSubject"
              name="scheduleSubject"
              value={emailSettings.scheduleSubject}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500">Usa {{date}}, {{player}}, {{coach}} come placeholder</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="sendAutomaticReminders"
              checked={emailSettings.sendAutomaticReminders}
              onCheckedChange={(checked) => handleSwitchChange("sendAutomaticReminders", checked)}
            />
            <Label htmlFor="sendAutomaticReminders">Invia promemoria automatici (24h prima)</Label>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="useSMTP"
                checked={emailSettings.useSMTP}
                onCheckedChange={(checked) => handleSwitchChange("useSMTP", checked)}
              />
              <Label htmlFor="useSMTP">Usa server SMTP personalizzato</Label>
            </div>
            
            {emailSettings.useSMTP && (
              <div className="space-y-4 pl-6 border-l-2 border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpServer">Server SMTP</Label>
                    <Input
                      id="smtpServer"
                      name="smtpServer"
                      placeholder="smtp.provider.com"
                      value={emailSettings.smtpServer}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">Porta SMTP</Label>
                    <Input
                      id="smtpPort"
                      name="smtpPort"
                      value={emailSettings.smtpPort}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">Username SMTP</Label>
                    <Input
                      id="smtpUsername"
                      name="smtpUsername"
                      value={emailSettings.smtpUsername}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">Password SMTP</Label>
                    <Input
                      id="smtpPassword"
                      name="smtpPassword"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleTestEmail}>
            <Send className="h-4 w-4 mr-2" />
            Invia Email di Test
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Salva Impostazioni
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
