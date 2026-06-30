import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isOnboardingCompleted } from "@/lib/user-store";
import { initAuth } from "@/lib/auth";
import KiloLogo from "@/components/KiloLogo";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Workout from "./pages/Workout";
import Diet from "./pages/Diet";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isOnboardingCompleted()) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

const BootSplash = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
    <div className="w-20 h-20 bg-foreground rounded-[1.5rem] flex items-center justify-center animate-pulse">
      <KiloLogo size={44} className="text-background" />
    </div>
  </div>
);

const App = () => {
  // Auth + hydracja danych z chmury PRZED renderem tras (dane wracają na nowym urządzeniu).
  const [ready, setReady] = useState(false);
  useEffect(() => {
    initAuth().finally(() => setReady(true));
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="kilo-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {!ready ? (
            <BootSplash />
          ) : (
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={isOnboardingCompleted() ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />}
                />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/workout" element={<ProtectedRoute><Workout /></ProtectedRoute>} />
                <Route path="/diet" element={<ProtectedRoute><Diet /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
