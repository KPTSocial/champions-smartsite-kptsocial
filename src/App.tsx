
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import PhotoBooth from "./pages/PhotoBooth";
import Menu from "./pages/Menu";
import MemberDashboard from "./pages/MemberDashboard";
import Happenings from "./pages/Happenings";
import Reservations from "./pages/Reservations";
import NotFound from "./pages/NotFound";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPhotoBoothPage from "./pages/AdminPhotoBoothPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes with layout */}
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/about" element={<Layout><AboutUs /></Layout>} />
          <Route path="/happenings" element={<Layout><Happenings /></Layout>} />
          <Route path="/photo-booth" element={<Layout><PhotoBooth /></Layout>} />
          <Route path="/menu" element={<Layout><Menu /></Layout>} />
          <Route path="/member-dashboard" element={<Layout><MemberDashboard /></Layout>} />
          <Route path="/reservations" element={<Layout><Reservations /></Layout>} />
          
          {/* Admin routes without public layout */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/photo-booth" element={<AdminPhotoBoothPage />} />
          
          {/* 404 */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
