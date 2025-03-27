
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { SharedPlayerProvider } from "./contexts/shared/SharedPlayerContext";
import { TennisBallLoader } from "./components/ui/TennisBallLoader";

// Improve lazy loading with error handling
const lazyLoad = (importFunc) => {
  return lazy(() => {
    return importFunc().catch(err => {
      console.error("Failed to lazy load component:", err);
      // Return a module with a default component that shows the error
      return { default: () => <div className="p-4 text-red-500">Failed to load component: {err.message}</div> };
    });
  });
};

// Use the enhanced lazy loading
const Dashboard = lazyLoad(() => import("./pages/Dashboard"));
const Calendar = lazyLoad(() => import("./pages/Calendar"));
const Courts = lazyLoad(() => import("./pages/Courts"));
const CourtVision = lazyLoad(() => import("./pages/CourtVision"));
const Staff = lazyLoad(() => import("./pages/Staff"));
const Players = lazyLoad(() => import("./pages/Players"));
const Programs = lazyLoad(() => import("./pages/Programs"));
const Settings = lazyLoad(() => import("./pages/Settings"));
const NotFound = lazyLoad(() => import("./pages/NotFound"));
const Reports = lazyLoad(() => import("./pages/Reports"));
const Tournaments = lazyLoad(() => import("./pages/Tournaments"));
const Videos = lazyLoad(() => import("./pages/Videos"));
const Integrations = lazyLoad(() => import("./pages/Integrations"));
const Activities = lazyLoad(() => import("./pages/Activities"));
const ExtraActivities = lazyLoad(() => import("./pages/ExtraActivities"));
const Coaches = lazyLoad(() => import("./pages/Coaches"));

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
            <Suspense fallback={<TennisBallLoader />}>
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
