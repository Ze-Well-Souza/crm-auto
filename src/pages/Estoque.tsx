import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Package, AlertTriangle, CheckCircle } from "lucide-react";
import { useParts } from "@/hooks/useParts";

const Estoque = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { parts, loading, error } = useParts();

  const getStockStatus = (part: any) => {
    if (!part.stock_quantity || part.stock_quantity <= 0) {
      return { status: 'out', label: 'Sem estoque', variant: 'destructive' as const };
    }
    if (part.min_stock && part.stock_quantity <= part.min_stock) {
      return { status: 'low', label: 'Estoque baixo', variant: 'secondary' as const };
    }
    return { status: 'ok', label: 'Disponível', variant: 'default' as const };
  };

  const filteredParts = parts?.filter(part => 
    part.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Controle de Estoque</h1>
            <p className="text-muted-foreground">Gerencie peças, fornecedores e movimentações</p>
          </div>
          
          <Button className="shadow-primary">
            <Plus className="mr-2 h-4 w-4" />
            Nova Peça
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Total de Peças
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalParts}</div>
              <p className="text-xs text-muted-foreground">Itens cadastrados</p>
            </CardContent>
          </Card>
          
          <Card className="gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Estoque Baixo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockParts}</div>
              <p className="text-xs text-muted-foreground">Necessita reposição</p>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Sem Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outOfStockParts}</div>
              <p className="text-xs text-muted-foreground">Esgotado</p>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Valor Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Valor em estoque</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar peças por nome, código ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Parts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParts.length > 0 ? (
            filteredParts.map((part) => {
              const stockStatus = getStockStatus(part);
              return (
                <Card key={part.id} className="hover:shadow-elevated transition-smooth cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{part.name}</CardTitle>
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.label}
                      </Badge>
                    </div>
                    {part.code && (
                      <CardDescription>Código: {part.code}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {part.category && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Categoria:</span>
                        <Badge variant="outline">{part.category}</Badge>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Estoque:</span>
                      <span className="font-semibold">{part.stock_quantity || 0} un.</span>
                    </div>

                    {part.sale_price && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Preço:</span>
                        <span className="font-semibold">
                          R$ {part.sale_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}

                    {part.location && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Local:</span>
                        <span className="text-sm">{part.location}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-xs text-muted-foreground">
                        Atualizado em {new Date(part.updated_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    {searchTerm ? "Nenhuma peça encontrada" : "Nenhuma peça cadastrada"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
                    {searchTerm 
                      ? "Tente ajustar os termos de busca." 
                      : "Comece cadastrando a primeira peça do estoque."
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Estoque;