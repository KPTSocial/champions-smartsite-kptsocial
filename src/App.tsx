import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Menu from "./pages/Menu";
import Happenings from "./pages/Happenings";
import Reservations from "./pages/Reservations";
import NotFound from "./pages/NotFound";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminMenuPage from "./pages/AdminMenuPage";
import AdminEventsPage from "./pages/AdminEventsPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes with layout */}
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/about" element={<Layout><AboutUs /></Layout>} />
          <Route path="/happenings" element={<Layout><Happenings /></Layout>} />
          <Route path="/menu" element={<Layout><Menu /></Layout>} />
          <Route path="/reservations" element={<Layout><Reservations /></Layout>} />
          
          {/* Admin routes without public layout */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/menu" element={<AdminMenuPage />} />
          <Route path="/admin/events" element={<AdminEventsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          
          {/* 404 */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
