
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { SharedPlayerProvider } from "./contexts/shared/SharedPlayerContext";

// Import components directly instead of using lazy for the problematic ones
import CourtVision from "./pages/CourtVision";

// Use lazy loading for other components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Courts = lazy(() => import("./pages/Courts"));
const Staff = lazy(() => import("./pages/Staff"));
const Players = lazy(() => import("./pages/Players"));
const Programs = lazy(() => import("./pages/Programs"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Reports = lazy(() => import("./pages/Reports"));
const Tournaments = lazy(() => import("./pages/Tournaments"));
const Videos = lazy(() => import("./pages/Videos"));
const Integrations = lazy(() => import("./pages/Integrations"));
const Activities = lazy(() => import("./pages/Activities"));
const ExtraActivities = lazy(() => import("./pages/ExtraActivities"));
const Coaches = lazy(() => import("./pages/Coaches"));

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-center">
      <img 
        src="/lovable-uploads/1d4cf35c-0a44-4354-ba59-335096dbc4b6.png" 
        alt="Tennis Ball Loading" 
        className="w-16 h-16 mx-auto animate-spin"
      />
      <p className="mt-4 text-gray-600">Caricamento...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function App() {
  console.log("App component rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SharedPlayerProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/" element={<MainLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="courts" element={<Courts />} />
                  <Route path="court-vision" element={<CourtVision />} />
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
            </Suspense>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </SharedPlayerProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
