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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
              Gestão de Parceiros
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie seus parceiros do marketplace e receba pedidos automaticamente
            </p>
          </div>

          <Tabs defaultValue="parceiros" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="parceiros" className="gap-2">
                <Store className="h-4 w-4" />
                Parceiros
              </TabsTrigger>
              <TabsTrigger value="pedidos" className="gap-2">
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
