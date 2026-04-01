import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar"; 
import Footer from "../src/components/PremiumFooter"
import Index from "./pages/Index";
import CompleteProfile from "./pages/CompleteProfile"; 

import About from "./pages/About";
import ForCandidates from "./pages/ForCandidates";
import ForCompanies from "./pages/ForCompanies";
import CandidateDashboard from "./pages/CandidateDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import SubscriptionPage from "./pages/SubscriptionPage";
import CandidateDetails from "./pages/CandidateDetails";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <ScrollToTop />
          <AuthProvider>
            <Navbar />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/for-candidates" element={<ForCandidates />} />
                <Route path="/for-companies" element={<ForCompanies />} />
                <Route path="/dashboard/candidate" element={<CandidateDashboard />} />
                <Route path="/dashboard/company" element={<CompanyDashboard />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/candidate/:id" element={<CandidateDetails />} />
                 <Route path="/superadmin" element={<SuperAdminLogin />} />
        <Route path="/superadmin/dashboard" element={<AdminDashboard />} />
                <Route path="/complete-profile" element={<CompleteProfile />} />

                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
    <Footer /> {/* Uncomment when PremiumFooter is created */}
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
