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
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
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
const Planos = lazy(() => import("./pages/Planos"));
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
const InstallPWA = lazy(() => import("./pages/InstallPWA"));
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
                <SubscriptionProvider>
                  <ThemeTransitionManager />
                  <Toaster />
                  <Sonner />
                  <TooltipProvider>
                    <BrowserRouter>
                      <Suspense fallback={<PageLoadingFallback />}>
                        <Routes>
                          <Route path="/auth" element={<Auth />} />
                          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                          <Route path="/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
                          <Route path="/veiculos" element={<ProtectedRoute><Veiculos /></ProtectedRoute>} />
                          <Route path="/planos" element={<ProtectedRoute><Planos /></ProtectedRoute>} />
                          <Route path="/ordens" element={<ProtectedRoute><OrdensServico /></ProtectedRoute>} />
                          <Route path="/agendamentos" element={<ProtectedRoute><Agendamentos /></ProtectedRoute>} />
                          <Route path="/estoque" element={<ProtectedRoute><Estoque /></ProtectedRoute>} />
                          <Route path="/financeiro" element={<ProtectedRoute><Financeiro /></ProtectedRoute>} />
                          <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
                          <Route path="/pagamentos" element={<ProtectedRoute><Pagamentos /></ProtectedRoute>} />
                          <Route path="/parceiros" element={<ProtectedRoute><Parceiros /></ProtectedRoute>} />
                          <Route path="/comunicacao" element={<ProtectedRoute><Comunicacao /></ProtectedRoute>} />
                          <Route path="/biblioteca-imagens" element={<ProtectedRoute><ImageLibrary /></ProtectedRoute>} />
                          <Route path="/install" element={<InstallPWA />} />
                          <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                    </BrowserRouter>
                  </TooltipProvider>
                </SubscriptionProvider>
              </StripeProvider>
            </CommunicationProvider>
          </NotificationProvider>
        </AuthProvider>
    </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
