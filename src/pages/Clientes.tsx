import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Users, Filter } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { ClientForm } from "@/components/clients/ClientForm";
import { ClientCard } from "@/components/clients/ClientCard";
import { ClientMetrics } from "@/components/clients/ClientMetrics";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { SearchAdvanced } from "@/components/common/SearchAdvanced";
import { Pagination } from "@/components/common/Pagination";
import { useClientSearch } from "@/hooks/useAdvancedSearch";
import { Card, CardContent } from "@/components/ui/card";

const Clientes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { clients, loading, error, refetch } = useClients();

  // Configuração da busca avançada
  const searchConfig = useClientSearch(clients || []);

  const handleQuickAction = (action: string, client: any) => {
    console.log(`Ação ${action} para cliente:`, client);
    // Implementar ações específicas aqui
  };

  // Configuração dos filtros para busca avançada
  const filterGroups = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Ativo' },
        { value: 'inactive', label: 'Inativo' },
        { value: 'pending', label: 'Pendente' }
      ]
    },
    {
      key: 'city',
      label: 'Cidade',
      type: 'select' as const,
      placeholder: 'Filtrar por cidade'
    },
    {
      key: 'created_date',
      label: 'Data de Cadastro',
      type: 'date-range' as const
    }
  ];

  const quickFilters = [
    {
      key: 'hasEmail',
      label: 'Com Email',
      color: 'primary' as const
    },
    {
      key: 'hasPhone', 
      label: 'Com Telefone',
      color: 'secondary' as const
    },
    {
      key: 'recent',
      label: 'Recentes',
      color: 'outline' as const
    }
  ];

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

        {/* Enhanced Metrics */}
        <ClientMetrics clients={clients || []} />

        {/* Advanced Search */}
        <SearchAdvanced
          placeholder="Buscar clientes por nome, email, telefone ou documento..."
          filterGroups={filterGroups}
          quickFilters={quickFilters}
          onSearch={searchConfig.handleSearch}
          onReset={searchConfig.handleReset}
          showQuickFilters={true}
          showAdvancedFilters={true}
        />

        {/* Search Results Info - Landing Page Style */}
        {searchConfig.isFiltered && (
          <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300">
                {searchConfig.paginationInfo.totalItems} cliente(s) encontrado(s)
                {searchConfig.paginationInfo.totalItems !== clients?.length &&
                  ` de ${clients?.length} total`
                }
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={searchConfig.handleReset}
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
            >
              Limpar filtros
            </Button>
          </div>
        )}

        {/* Clients List */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchConfig.data.length > 0 ? (
              searchConfig.data.map((client) => (
                <ClientCard 
                  key={client.id} 
                  client={client} 
                  onUpdate={refetch}
                  onQuickAction={handleQuickAction}
                />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  icon={Users}
                  title={searchConfig.isFiltered ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
                  description={searchConfig.isFiltered 
                    ? "Tente ajustar os termos de busca ou filtros." 
                    : "Comece cadastrando o primeiro cliente do sistema."
                  }
                  actionLabel="Novo Cliente"
                  onAction={() => setIsDialogOpen(true)}
                  showAction={!searchConfig.isFiltered}
                />
              </div>
            )}
          </div>

          {/* Pagination */}
          {searchConfig.paginationInfo.totalPages > 1 && (
            <Pagination
              paginationInfo={searchConfig.paginationInfo}
              onPageChange={searchConfig.handlePageChange}
              onPageSizeChange={searchConfig.handlePageSizeChange}
              goToFirstPage={searchConfig.goToFirstPage}
              goToLastPage={searchConfig.goToLastPage}
              goToNextPage={searchConfig.goToNextPage}
              goToPreviousPage={searchConfig.goToPreviousPage}
              showPageSizeSelector={true}
              showPageInfo={true}
              showNavigationInfo={true}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Clientes;