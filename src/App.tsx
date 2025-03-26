
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { SharedPlayerProvider } from "./contexts/shared/SharedPlayerContext";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Courts = lazy(() => import("./pages/Courts"));
const CourtVision = lazy(() => import("./pages/CourtVision"));
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
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="48" 
        height="48" 
        viewBox="0 0 24 24" 
        className="mx-auto"
        style={{animation: 'spin 1.5s linear infinite'}}
      >
        {/* Tennis ball with dashed lines */}
        <circle cx="12" cy="12" r="10" fill="none" stroke="#FFC107" strokeWidth="2" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" 
              fill="none" 
              stroke="#FFC107" 
              strokeWidth="1.5" 
              strokeDasharray="5,5" />
        <path d="M2 12h20M12 2v20" 
              stroke="#FFC107" 
              strokeWidth="1.5" 
              strokeDasharray="2,3" />
      </svg>
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
