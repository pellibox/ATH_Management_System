
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Courts from "./pages/Courts";
import CourtVision from "./pages/CourtVision";
import Staff from "./pages/Staff";
import Players from "./pages/Players";
import Programs from "./pages/Programs";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Reports from "./pages/Reports";
import Tournaments from "./pages/Tournaments";
import Videos from "./pages/Videos";
import Integrations from "./pages/Integrations";
import Activities from "./pages/Activities";
import ExtraActivities from "./pages/ExtraActivities";
import Coaches from "./pages/Coaches";
import { CourtVisionProvider } from "./components/court-vision/context/CourtVisionContext";
import "./App.css";
import "./index.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CourtVisionProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route element={<MainLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="courts" element={<Courts />} />
                <Route path="court-vision" element={<CourtVision />} />
                <Route path="court-vision/layout" element={<CourtVision />} />
                <Route path="staff" element={<Staff />} />
                <Route path="players" element={<Players />} />
                <Route path="coaches" element={<Coaches />} />
                <Route path="programs" element={<Programs />} />
                <Route path="tournaments" element={<Tournaments />} />
                <Route path="reports" element={<Reports />} />
                <Route path="videos" element={<Videos />} />
                <Route path="activities" element={<Activities />} />
                <Route path="extra-activities" element={<ExtraActivities />} />
                <Route path="integrations" element={<Integrations />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </CourtVisionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
