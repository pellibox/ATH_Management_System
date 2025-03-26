
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Save, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";

export function EmailSettingsTab() {
  const { toast } = useToast();
  const [emailSettings, setEmailSettings] = useState({
    senderEmail: "academy@example.com",
    senderName: "Tennis Academy",
    signature: "Best regards,\nThe Academy Team",
    scheduleNotifications: true,
    tournamentNotifications: true,
    billingSummaries: false,
    playerProgressReports: true
  });
  
  const [templates, setTemplates] = useState({
    scheduleTemplate: `Dear {playerName},

We are pleased to inform you that your schedule for {date} has been set.

Your coach: {coachName}
Time: {timeSlot}
Court: {courtName}

{notes}

Best regards,
The Academy Team`,
    reminderTemplate: `Dear {playerName},

This is a reminder about your upcoming session tomorrow.

Time: {timeSlot}
Coach: {coachName}
Court: {courtName}

We look forward to seeing you!

Best regards,
The Academy Team`
  });
  
  const handleSaveSettings = () => {
    // In a real app, this would save to a backend
    toast({
      title: "Email Settings Saved",
      description: "Your email settings have been updated successfully"
    });
  };
  
  const handleTemplateChange = (template: string, value: string) => {
    setTemplates({
      ...templates,
      [template]: value
    });
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Email Settings</h2>
        <p className="text-gray-500">Configure how emails are sent from the system</p>
      </div>
      
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium mb-4">Sender Information</h3>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="senderEmail">Sender Email</Label>
              <Input 
                id="senderEmail" 
                value={emailSettings.senderEmail}
                onChange={(e) => setEmailSettings({...emailSettings, senderEmail: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="senderName">Sender Name</Label>
              <Input 
                id="senderName" 
                value={emailSettings.senderName}
                onChange={(e) => setEmailSettings({...emailSettings, senderName: e.target.value})}
              />
            </div>
            
            <div className="sm:col-span-2">
              <Label htmlFor="signature">Email Signature</Label>
              <Textarea 
                id="signature" 
                value={emailSettings.signature}
                onChange={(e) => setEmailSettings({...emailSettings, signature: e.target.value})}
                rows={3}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Schedule Notifications</div>
                <div className="text-sm text-gray-500">Email players when their schedule is updated</div>
              </div>
              <Switch 
                checked={emailSettings.scheduleNotifications}
                onCheckedChange={(checked) => setEmailSettings({...emailSettings, scheduleNotifications: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Tournament Notifications</div>
                <div className="text-sm text-gray-500">Email about upcoming tournaments</div>
              </div>
              <Switch 
                checked={emailSettings.tournamentNotifications}
                onCheckedChange={(checked) => setEmailSettings({...emailSettings, tournamentNotifications: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Billing Summaries</div>
                <div className="text-sm text-gray-500">Send monthly billing summaries</div>
              </div>
              <Switch 
                checked={emailSettings.billingSummaries}
                onCheckedChange={(checked) => setEmailSettings({...emailSettings, billingSummaries: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Player Progress Reports</div>
                <div className="text-sm text-gray-500">Send coaches' assessments to players</div>
              </div>
              <Switch 
                checked={emailSettings.playerProgressReports}
                onCheckedChange={(checked) => setEmailSettings({...emailSettings, playerProgressReports: checked})}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium mb-4">Email Templates</h3>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="scheduleTemplate" className="mb-1 block">Schedule Notification Template</Label>
              <div className="text-xs text-gray-500 mb-2">
                Available variables: {'{playerName}'}, {'{date}'}, {'{coachName}'}, {'{timeSlot}'}, {'{courtName}'}, {'{notes}'}
              </div>
              <Textarea 
                id="scheduleTemplate" 
                value={templates.scheduleTemplate}
                onChange={(e) => handleTemplateChange('scheduleTemplate', e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="reminderTemplate" className="mb-1 block">Reminder Template</Label>
              <div className="text-xs text-gray-500 mb-2">
                Available variables: {'{playerName}'}, {'{date}'}, {'{coachName}'}, {'{timeSlot}'}, {'{courtName}'}
              </div>
              <Textarea 
                id="reminderTemplate" 
                value={templates.reminderTemplate}
                onChange={(e) => handleTemplateChange('reminderTemplate', e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} className="px-8">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
