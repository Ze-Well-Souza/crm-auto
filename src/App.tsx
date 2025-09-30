import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { CommunicationProvider } from "@/contexts/CommunicationContext";
import { StripeProvider } from "@/contexts/StripeContext";
import { ThemeTransitionManager } from "@/components/theme/ThemeTransitionManager";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Clientes from "./pages/Clientes";
import Veiculos from "./pages/Veiculos";
import OrdensServico from "./pages/OrdensServico";
import Agendamentos from "./pages/Agendamentos";
import Estoque from "./pages/Estoque";
import Financeiro from "./pages/Financeiro";
import Relatorios from "./pages/Relatorios";
import Pagamentos from "./pages/Pagamentos";
import Comunicacao from "./pages/Comunicacao";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        <AuthProvider>
          <NotificationProvider>
            <CommunicationProvider>
              <StripeProvider>
                <ThemeTransitionManager />
                <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<Index />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/veiculos" element={<Veiculos />} />
                <Route path="/ordens" element={<OrdensServico />} />
                <Route path="/agendamentos" element={<Agendamentos />} />
                <Route path="/estoque" element={<Estoque />} />
                <Route path="/financeiro" element={<Financeiro />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/pagamentos" element={<Pagamentos />} />
                <Route path="/comunicacao" element={<Comunicacao />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
                </TooltipProvider>
              </StripeProvider>
            </CommunicationProvider>
          </NotificationProvider>
        </AuthProvider>
    </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
