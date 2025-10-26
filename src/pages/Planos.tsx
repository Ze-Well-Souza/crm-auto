import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlanSelector } from '@/components/subscription/PlanSelector';
import { UsageDashboard } from '@/components/subscription/UsageDashboard';
import { Crown } from 'lucide-react';

const Planos = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Planos e Assinaturas</h1>
            <p className="text-muted-foreground">
              Gerencie seu plano e acompanhe o uso dos recursos
            </p>
          </div>
        </div>

        <Tabs defaultValue="usage" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="usage">Uso Atual</TabsTrigger>
            <TabsTrigger value="plans">Todos os Planos</TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="mt-6">
            <UsageDashboard />
          </TabsContent>

          <TabsContent value="plans" className="mt-6">
            <PlanSelector />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Planos;
