import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Deadlines from "./pages/Deadlines";
import TranslationAssistant from "./pages/TranslationAssistant";
import FactCheckHub from "./pages/FactCheckHub";
import OrganizerPortal from "./pages/OrganizerPortal";
import AmbassadorToolkit from "./pages/AmbassadorToolkit";
import HelpAndLanguage from "./pages/HelpAndLanguage";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import BottomNavigation from "./components/BottomNavigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/app" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/deadlines" element={<Deadlines />} />
            <Route path="/polling" element={<Deadlines />} />
            <Route path="/fact-check" element={<FactCheckHub />} />
            <Route path="/language" element={<TranslationAssistant />} />
            <Route path="/help" element={<HelpAndLanguage />} />
            <Route path="/organizer" element={<OrganizerPortal />} />
            <Route path="/ambassador" element={<AmbassadorToolkit />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNavigation />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
