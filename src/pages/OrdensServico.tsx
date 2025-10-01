import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Wrench, Search, Clock, CircleCheck as CheckCircle } from "lucide-react";
import { useServiceOrders } from "@/hooks/useServiceOrders";
import { ServiceOrderForm } from "@/components/service-orders/ServiceOrderForm";
import { ServiceOrderCard } from "@/components/service-orders/ServiceOrderCard";
import { ServiceOrderMetrics } from "@/components/service-orders/ServiceOrderMetrics";
import { ServiceOrderFilters } from "@/components/service-orders/ServiceOrderFilters";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SearchInput } from "@/components/common/SearchInput";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

const OrdensServico = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const { serviceOrders, loading, error, refetch } = useServiceOrders();

  const handleQuickAction = (action: string, order: any) => {
    console.log(`Ação ${action} para ordem:`, order);
    // Implementar ações específicas aqui
  };

  const applyFilters = (orderList: any[]) => {
    let filtered = [...orderList];

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply quick filters
    if (filters.urgent) {
      // Mock urgent logic - in real app would check due dates
      filtered = filtered.filter(() => Math.random() > 0.7);
    }
    if (filters.highValue) {
      filtered = filtered.filter(order => (order.total_amount || 0) > 500);
    }
    if (filters.inProgress) {
      filtered = filtered.filter(order => order.status === 'em_andamento');
    }
    if (filters.needsApproval) {
      filtered = filtered.filter(order => order.status === 'orcamento');
    }

    // Apply status filters
    if (filters.status?.length > 0) {
      filtered = filtered.filter(order => 
        filters.status.includes(order.status)
      );
    }

    // Apply value range filter
    if (filters.valueRange) {
      filtered = filtered.filter(order => 
        (order.total_amount || 0) >= filters.valueRange[0] && 
        (order.total_amount || 0) <= filters.valueRange[1]
      );
    }

    return filtered;
  };

  const filteredOrders = serviceOrders ? applyFilters(serviceOrders) : serviceOrders?.filter(order =>
    order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-40" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-destructive">Erro ao carregar ordens de serviço: {error}</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Ordens de Serviço</h1>
            <p className="text-muted-foreground">Gerencie orçamentos, serviços e acompanhe o status</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-primary">
                <Plus className="mr-2 h-4 w-4" />
                Nova Ordem
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Nova Ordem de Serviço</DialogTitle>
              </DialogHeader>
              <ServiceOrderForm onSuccess={() => {
                setIsDialogOpen(false);
                refetch();
              }} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <ServiceOrderMetrics serviceOrders={serviceOrders || []} />

        {/* Advanced Filters */}
        <ServiceOrderFilters 
          onFiltersChange={setFilters}
          activeFilters={filters}
        />

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ordens por número ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <ServiceOrderCard 
                key={order.id} 
                serviceOrder={order} 
                onUpdate={refetch}
                onQuickAction={handleQuickAction}
              />
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                icon={Wrench}
                title={searchTerm ? "Nenhuma ordem encontrada" : "Nenhuma ordem cadastrada"}
                description={searchTerm 
                  ? "Tente ajustar os termos de busca." 
                  : "Comece criando a primeira ordem de serviço."
                }
                actionLabel="Nova Ordem"
                onAction={() => setIsDialogOpen(true)}
                showAction={!searchTerm}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrdensServico;