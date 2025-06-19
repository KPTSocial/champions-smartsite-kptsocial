
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import PhotoBooth from "./pages/PhotoBooth";
import MobilePhotoUpload from "./pages/MobilePhotoUpload";
import Menu from "./pages/Menu";
import MemberDashboard from "./pages/MemberDashboard";
import Happenings from "./pages/Happenings";
import Reservations from "./pages/Reservations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/happenings" element={<Happenings />} />
            <Route path="/photo-booth" element={<PhotoBooth />} />
            <Route path="/mobile-upload" element={<MobilePhotoUpload />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/member-dashboard" element={<MemberDashboard />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
