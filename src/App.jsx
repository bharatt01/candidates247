import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
// import CandidateForm from "./pages/CandidateForm";
import About from "./pages/About";
import CompleteProfile from "./pages/CompleteProfile";
import ForCandidates from "./pages/ForCandidates";
import ForCompanies from "./pages/ForCompanies";
import CandidateDashboard from "./pages/CandidateDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import CandidateDetails from "./pages/CandidateDetails";
import NotFound from "./pages/NotFound";
import Footer from "./components/PremiumFooter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/for-candidates" element={<ForCandidates />} />
              <Route path="/for-companies" element={<ForCompanies />} />
              <Route path="/dashboard/candidate" element={<CandidateDashboard />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="/dashboard/company" element={<CompanyDashboard />} />
              {/* <Route path="/profile" element={<CandidateForm />} /> */}
              <Route path="/about" element={<About />} />
              <Route path="/candidate/:id" element={<CandidateDetails />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
