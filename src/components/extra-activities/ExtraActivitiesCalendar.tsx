
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalendarView from "@/components/ui/CalendarView";
import { DateSelector } from "@/components/court-vision/DateSelector";

interface ExtraActivitiesCalendarProps {
  currentView: "week" | "day" | "month";
  setCurrentView: (view: "week" | "day" | "month") => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export function ExtraActivitiesCalendar({ 
  currentView, 
  setCurrentView, 
  selectedDate, 
  setSelectedDate 
}: ExtraActivitiesCalendarProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Calendario Attività</CardTitle>
        <div className="flex items-center space-x-2">
          <Tabs 
            value={currentView} 
            onValueChange={(v: "week" | "day" | "month") => setCurrentView(v)}
            className="h-8"
          >
            <TabsList className="h-8">
              <TabsTrigger value="day" className="text-xs h-8">Giorno</TabsTrigger>
              <TabsTrigger value="week" className="text-xs h-8">Settimana</TabsTrigger>
              <TabsTrigger value="month" className="text-xs h-8">Mese</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </div>
        <CalendarView currentView={currentView} />
      </CardContent>
    </Card>
  );
}
