import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/docusur/Layout";
import Index from "./pages/Index";
import ToolsPage from "./pages/ToolsPage";
import ToolPage from "./pages/ToolPage";
import SecurityPage from "./pages/SecurityPage";
import AboutPage from "./pages/AboutPage";
import CgvPage from "./pages/CgvPage";
import MentionsLegalesPage from "./pages/MentionsLegalesPage";
import PolitiqueConfidentialitePage from "./pages/PolitiqueConfidentialitePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="outils" element={<ToolsPage />} />
            <Route path="outils/:id" element={<ToolPage />} />
            <Route path="securite" element={<SecurityPage />} />
            <Route path="a-propos" element={<AboutPage />} />
            <Route path="cgv" element={<CgvPage />} />
            <Route path="mentions-legales" element={<MentionsLegalesPage />} />
            <Route path="politique-de-confidentialite" element={<PolitiqueConfidentialitePage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
