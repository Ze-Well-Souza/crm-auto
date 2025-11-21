import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { ClientForm } from "@/components/clients/ClientForm";
import { ClientCardModern } from "@/components/clients/ClientCardModern";
import { ClientKPIs } from "@/components/clients/ClientKPIs";
import { ClientFiltersAdvanced, ClientFilterOptions } from "@/components/clients/ClientFiltersAdvanced";
import { useClientMetricsAdvanced } from "@/hooks/useClientMetricsAdvanced";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import type { Client } from "@/types";

const Clientes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { clients, loading, error, refetch } = useClients();
  const { metrics, loading: metricsLoading } = useClientMetricsAdvanced();

  const [filters, setFilters] = useState<ClientFilterOptions>({
    searchQuery: '',
    showVIP: false,
    showNew: false,
    showWithEmail: false,
    showRecent: false
  });

  // Aplicar filtros aos clientes
  const filteredClients = clients?.filter(client => {
    // Busca textual
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch =
        client.name.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.phone?.includes(query) ||
        client.cpf_cnpj?.includes(query);
      if (!matchesSearch) return false;
    }

    // Filtros de tags
    if (filters.showVIP && !client.is_vip) return false;
    if (filters.showNew && client.service_count !== 0) return false;
    if (filters.showWithEmail && !client.email) return false;
    if (filters.showRecent) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      if (new Date(client.created_at) <= sevenDaysAgo) return false;
    }

    return true;
  }) || [];

  // Handlers para ações rápidas
  const handleCall = (client: Client) => {
    if (client.phone) {
      window.location.href = `tel:${client.phone}`;
    }
  };

  const handleWhatsApp = (client: Client) => {
    if (client.phone) {
      const phone = client.phone.replace(/\D/g, '');
      window.open(`https://wa.me/55${phone}`, '_blank');
    }
  };

  const handleEmail = (client: Client) => {
    if (client.email) {
      window.location.href = `mailto:${client.email}`;
    }
  };

  const handleSchedule = (client: Client) => {
    console.log('Agendar para cliente:', client);
    // TODO: Implementar navegação para agendamento
  };

  const handleNewService = (client: Client) => {
    console.log('Novo serviço para cliente:', client);
    // TODO: Implementar navegação para nova ordem de serviço
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-destructive">Erro ao carregar clientes: {error}</p>
            <Button onClick={refetch} className="mt-4">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header - Landing Page Style */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-500 bg-clip-text text-transparent">
              Gestão de Clientes
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Gerencie informações completas dos seus clientes</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-500/50">
                <Plus className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
              </DialogHeader>
              <ClientForm onSuccess={() => {
                setIsDialogOpen(false);
                refetch();
              }} />
            </DialogContent>
          </Dialog>
        </div>

        {/* KPIs Modernos */}
        <ClientKPIs metrics={metrics} loading={metricsLoading} />

        {/* Filtros Avançados */}
        <ClientFiltersAdvanced
          filters={filters}
          onFiltersChange={setFilters}
          totalResults={filteredClients.length}
        />

        {/* Grid de Clientes */}
        <div className="space-y-6">
          {filteredClients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <ClientCardModern
                  key={client.id}
                  client={client}
                  onCall={handleCall}
                  onWhatsApp={handleWhatsApp}
                  onEmail={handleEmail}
                  onSchedule={handleSchedule}
                  onNewService={handleNewService}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title={filters.searchQuery || filters.showVIP || filters.showNew || filters.showWithEmail || filters.showRecent
                ? "Nenhum cliente encontrado"
                : "Nenhum cliente cadastrado"}
              description={filters.searchQuery || filters.showVIP || filters.showNew || filters.showWithEmail || filters.showRecent
                ? "Tente ajustar os termos de busca ou filtros."
                : "Comece cadastrando o primeiro cliente do sistema."
              }
              actionLabel="Novo Cliente"
              onAction={() => setIsDialogOpen(true)}
              showAction={!(filters.searchQuery || filters.showVIP || filters.showNew || filters.showWithEmail || filters.showRecent)}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Clientes;