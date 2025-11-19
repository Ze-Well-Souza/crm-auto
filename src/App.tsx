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
import { AdminRoute } from "@/components/auth/AdminRoute";
import { FeatureRoute } from "@/components/auth/FeatureRoute";
// import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense, lazy } from "react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const Landing = lazy(() => import("./pages/Landing"));
const Documentation = lazy(() => import("./pages/Documentation"));
const Register = lazy(() => import("./pages/Register"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Admin = lazy(() => import("./pages/Admin"));
const Clientes = lazy(() => import("./pages/Clientes"));
const Veiculos = lazy(() => import("./pages/Veiculos"));
// const PlanosPublicos = lazy(() => import("./pages/PlanosPublicos"));
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

const PageLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  // <ErrorBoundary>
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
                        {/* Rotas Públicas */}
                          <Route path="/landing" element={<Landing />} />
                          <Route path="/auth/callback" element={<AuthCallback />} />
                          <Route path="/reset-password" element={<ResetPassword />} />
                          <Route path="/install" element={<InstallPWA />} />
                          <Route path="/register" element={<Register />} />

                          {/* Onboarding */}
                          <Route path="/onboarding" element={<Onboarding />} />

                          {/* Landing como entrada */}
                          <Route path="/" element={<Landing />} />
                          {/* Dashboard */}
                          <Route path="/dashboard" element={<Index />} />
                          
                          {/* Admin */}
                          <Route path="/admin" element={<ProtectedRoute><AdminRoute><Admin /></AdminRoute></ProtectedRoute>} />
                          
                          {/* Rotas com Proteção de Features */}
                          <Route path="/clientes" element={<ProtectedRoute><FeatureRoute feature="crm_clients"><Clientes /></FeatureRoute></ProtectedRoute>} />
                          <Route path="/veiculos" element={<ProtectedRoute><FeatureRoute feature="crm_vehicles"><Veiculos /></FeatureRoute></ProtectedRoute>} />
                          <Route path="/agendamentos" element={<ProtectedRoute><FeatureRoute feature="crm_appointments"><Agendamentos /></FeatureRoute></ProtectedRoute>} />
                          <Route path="/ordens" element={<ProtectedRoute><FeatureRoute feature="crm_service_orders"><OrdensServico /></FeatureRoute></ProtectedRoute>} />
                          <Route path="/estoque" element={<ProtectedRoute><FeatureRoute feature="crm_parts"><Estoque /></FeatureRoute></ProtectedRoute>} />
                          <Route path="/financeiro" element={<ProtectedRoute><FeatureRoute feature="crm_financial"><Financeiro /></FeatureRoute></ProtectedRoute>} />
                          <Route path="/relatorios" element={<ProtectedRoute><FeatureRoute feature="crm_reports"><Relatorios /></FeatureRoute></ProtectedRoute>} />
                          
                          {/* Rotas sem Proteção de Features */}
                          {/** rota de planos removida */}
                          <Route path="/pagamentos" element={<ProtectedRoute><Pagamentos /></ProtectedRoute>} />
                          <Route path="/parceiros" element={<ProtectedRoute><Parceiros /></ProtectedRoute>} />
                          <Route path="/comunicacao" element={<ProtectedRoute><Comunicacao /></ProtectedRoute>} />
                          <Route path="/biblioteca-imagens" element={<ProtectedRoute><ImageLibrary /></ProtectedRoute>} />
                          <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
                          <Route path="/docs" element={<ProtectedRoute><Documentation /></ProtectedRoute>} />
                          
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
  // </ErrorBoundary>
);

export default App;
