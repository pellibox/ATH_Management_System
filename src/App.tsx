
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CourtVisionProvider } from './components/court-vision/context/CourtVisionContext';
import MainLayout from "./components/layout/MainLayout";

// Use React.lazy for route-based code splitting
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

// Create Loading component for Suspense
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-t-ath-blue rounded-full animate-spin mx-auto"></div>
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
        <BrowserRouter>
          <CourtVisionProvider>
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
          </CourtVisionProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
