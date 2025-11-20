import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ModuleErrorBoundary } from '@/components/ErrorBoundary/ModuleErrorBoundary';
import { PartnerDashboard } from '@/components/partners/PartnerDashboard';
import { OrdersDashboard } from '@/components/marketplace-orders/OrdersDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, ShoppingBag } from 'lucide-react';

const Parceiros = () => {
  return (
    <DashboardLayout>
      <ModuleErrorBoundary moduleName="Parceiros" fallbackRoute="/">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Gestão de Parceiros
            </h1>
            <p className="text-slate-400 mt-2">
              Gerencie seus parceiros do marketplace e receba pedidos automaticamente
            </p>
          </div>

          <Tabs defaultValue="parceiros" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/5 border border-white/10 p-1">
              <TabsTrigger value="parceiros" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-300">
                <Store className="h-4 w-4" />
                Parceiros
              </TabsTrigger>
              <TabsTrigger value="pedidos" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-300">
                <ShoppingBag className="h-4 w-4" />
                Pedidos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="parceiros" className="space-y-6">
              <PartnerDashboard />
            </TabsContent>

            <TabsContent value="pedidos" className="space-y-6">
              <OrdersDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </ModuleErrorBoundary>
    </DashboardLayout>
  );
};

export default Parceiros;
