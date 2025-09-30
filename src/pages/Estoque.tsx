import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Package, Filter } from "lucide-react";
import { PartsForm } from "@/components/parts/PartsForm";
import { PartsCard } from "@/components/parts/PartsCard";
import { PartsMetrics } from "@/components/parts/PartsMetrics";
import { SearchAdvanced } from "@/components/common/SearchAdvanced";
import { Pagination } from "@/components/common/Pagination";

import { usePartsNew } from "@/hooks/usePartsNew";
import { usePartsSearch } from "@/hooks/useAdvancedSearch";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ModuleErrorBoundary } from "@/components/ErrorBoundary";

const Estoque = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { parts, loading, error, refetch } = usePartsNew();
  
  // Advanced Search Configuration
  const searchConfig = usePartsSearch(parts || []);

  const handleQuickAction = (action: string, part: any) => {
    console.log(`Ação ${action} para peça:`, part);
    // Implementar ações específicas aqui
  };

  // Filter Groups Configuration
  const filterGroups = [
    {
      key: 'category',
      label: 'Categoria',
      type: 'select' as const,
      options: [
        { value: 'motor', label: 'Motor' },
        { value: 'freios', label: 'Freios' },
        { value: 'suspensao', label: 'Suspensão' },
        { value: 'eletrica', label: 'Elétrica' },
        { value: 'carroceria', label: 'Carroceria' }
      ]
    },
    {
      key: 'brand',
      label: 'Marca',
      type: 'multiselect' as const,
      options: [
        { value: 'bosch', label: 'Bosch' },
        { value: 'continental', label: 'Continental' },
        { value: 'gates', label: 'Gates' },
        { value: 'mann', label: 'Mann Filter' },
        { value: 'mahle', label: 'Mahle' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Ativo' },
        { value: 'inactive', label: 'Inativo' },
        { value: 'discontinued', label: 'Descontinuado' },
        { value: 'out_of_stock', label: 'Sem Estoque' }
      ]
    },
    {
      key: 'price_range',
      label: 'Faixa de Preço',
      type: 'number-range' as const,
      placeholder: { min: 'Preço mín.', max: 'Preço máx.' }
    },
    {
      key: 'stock_range',
      label: 'Quantidade em Estoque',
      type: 'number-range' as const,
      placeholder: { min: 'Qtd. mín.', max: 'Qtd. máx.' }
    }
  ];

  // Quick Filters Configuration
  const quickFilters = [
    { key: 'low_stock', label: 'Estoque Baixo', icon: '⚠️' },
    { key: 'out_of_stock', label: 'Sem Estoque', icon: '❌' },
    { key: 'high_margin', label: 'Alta Margem', icon: '💰' },
    { key: 'fast_moving', label: 'Giro Rápido', icon: '🚀' }
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
            <p className="text-destructive">Erro ao carregar estoque: {error}</p>
            <Button 
              variant="outline" 
              onClick={refetch}
              className="mt-4"
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const totalParts = parts?.length || 0;
  const lowStockParts = parts?.filter(p => p.min_stock && p.stock_quantity && p.stock_quantity <= p.min_stock).length || 0;
  const outOfStockParts = parts?.filter(p => !p.stock_quantity || p.stock_quantity <= 0).length || 0;
  const totalValue = parts?.reduce((sum, p) => sum + ((p.stock_quantity || 0) * (p.cost_price || 0)), 0) || 0;

  return (
    <DashboardLayout>
      <ModuleErrorBoundary 
        moduleName="Estoque" 
        moduleIcon={<Package className="h-20 w-20 text-green-500" />}
        fallbackRoute="/"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Controle de Estoque</h1>
              <p className="text-muted-foreground">Gerencie peças, fornecedores e movimentações</p>
            </div>
          
          <Button onClick={() => setIsDialogOpen(true)} className="shadow-primary">
            <Plus className="mr-2 h-4 w-4" />
            Nova Peça
          </Button>
          
          <PartsForm 
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSuccess={() => {
              setIsDialogOpen(false);
              refetch();
            }} 
          />
        </div>

        {/* Enhanced Metrics */}
        <PartsMetrics parts={parts || []} />

        {/* Advanced Search */}
        <SearchAdvanced
          placeholder="Buscar peças por nome, código, categoria..."
          filterGroups={filterGroups}
          quickFilters={quickFilters}
          onSearch={searchConfig.handleSearch}
          onReset={searchConfig.handleReset}
          showQuickFilters={true}
          showAdvancedFilters={true}
        />

        {/* Search Results Info */}
        {searchConfig.isFiltered && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                {searchConfig.paginationInfo.totalItems} peça(s) encontrada(s)
                {searchConfig.paginationInfo.totalItems !== parts?.length && 
                  ` de ${parts?.length} total`
                }
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={searchConfig.handleReset}
              className="text-blue-600 hover:text-blue-800"
            >
              Limpar filtros
            </Button>
          </div>
        )}

        {/* Parts List */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchConfig.data.length > 0 ? (
              searchConfig.data.map((part) => (
                <PartsCard 
                  key={part.id} 
                  part={part} 
                  onUpdate={refetch}
                  onQuickAction={handleQuickAction}
                />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  icon={Package}
                  title={searchConfig.isFiltered ? "Nenhuma peça encontrada" : "Nenhuma peça cadastrada"}
                  description={searchConfig.isFiltered 
                    ? "Tente ajustar os termos de busca ou filtros." 
                    : "Comece cadastrando a primeira peça do estoque."
                  }
                  actionLabel="Nova Peça"
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
       </ModuleErrorBoundary>
     </DashboardLayout>
   );
};

export default Estoque;