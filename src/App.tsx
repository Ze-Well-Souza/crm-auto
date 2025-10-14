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
import { Suspense, lazy } from "react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Clientes = lazy(() => import("./pages/Clientes"));
const Veiculos = lazy(() => import("./pages/Veiculos"));
const OrdensServico = lazy(() => import("./pages/OrdensServico"));
const Agendamentos = lazy(() => import("./pages/Agendamentos"));
const Estoque = lazy(() => import("./pages/Estoque"));
const Financeiro = lazy(() => import("./pages/Financeiro"));
const Relatorios = lazy(() => import("./pages/Relatorios"));
const Pagamentos = lazy(() => import("./pages/Pagamentos"));
const Comunicacao = lazy(() => import("./pages/Comunicacao"));
const Configuracoes = lazy(() => import("./pages/Configuracoes"));
const Parceiros = lazy(() => import("./pages/Parceiros"));
const ImageLibrary = lazy(() => import("./pages/ImageLibrary"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

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
                <Suspense fallback={<PageLoadingFallback />}>
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
                    <Route path="/parceiros" element={<Parceiros />} />
                    <Route path="/comunicacao" element={<Comunicacao />} />
                    <Route path="/biblioteca-imagens" element={<ImageLibrary />} />
                    <Route path="/configuracoes" element={<Configuracoes />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
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
