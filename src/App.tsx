
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import DisclosurePage from "./pages/DisclosurePage";
import RequestPage from "./pages/RequestPage";
import ContactsPage from "./pages/ContactsPage";
import NotFound from "./pages/NotFound";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminNews from "./pages/admin/AdminNews";
import AdminServices from "./pages/admin/AdminServices";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminDisclosure from "./pages/admin/AdminDisclosure";
import AdminContacts from "./pages/admin/AdminContacts";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AdminAuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/disclosure" element={<DisclosurePage />} />
            <Route path="/request" element={<RequestPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/admin" element={<Navigate to="/admin/news" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/news" element={<AdminNews />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/about" element={<AdminAbout />} />
            <Route path="/admin/disclosure" element={<AdminDisclosure />} />
            <Route path="/admin/contacts" element={<AdminContacts />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;