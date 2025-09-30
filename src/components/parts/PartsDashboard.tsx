import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package, DollarSign, TrendingUp, ChartBar as BarChart3, Clock, Truck, Star, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, MapPin, Calendar, Target, ShoppingCart } from "lucide-react";
import { PartsTimeline } from "./PartsTimeline";
import { PartsQuickActions } from "./PartsQuickActions";
import { formatDate, formatCurrency } from "@/utils/formatters";
import type { Part } from "@/types";

interface PartsDashboardProps {
  part: Part | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PartsDashboard = ({ part, open, onOpenChange }: PartsDashboardProps) => {
  if (!part) return null;

  // Mock metrics for demonstration
  const partStats = {
    totalSold: Math.floor(Math.random() * 200) + 50,
    totalRevenue: Math.random() * 10000 + 2000,
    avgSalePrice: 0,
    profitMargin: Math.random() * 50 + 20,
    turnoverRate: Math.random() * 12 + 1,
    daysInStock: Math.floor(Math.random() * 365) + 30,
    lastSale: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
    nextReorder: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
    supplierLeadTime: Math.floor(Math.random() * 14) + 3,
    qualityScore: Math.floor(Math.random() * 30) + 70,
    returnRate: Math.random() * 5,
    seasonalDemand: Math.random() > 0.5
  };

  partStats.avgSalePrice = partStats.totalRevenue / partStats.totalSold;

  const getStockHealthScore = () => {
    const stock = part.stock_quantity || 0;
    const minStock = part.min_stock || 0;
    const maxStock = part.max_stock || minStock * 3;
    
    if (stock <= 0) return { score: 0, label: 'Crítico', color: 'text-destructive' };
    if (stock <= minStock) return { score: 25, label: 'Baixo', color: 'text-warning' };
    if (stock <= maxStock * 0.7) return { score: 75, label: 'Adequado', color: 'text-info' };
    return { score: 100, label: 'Excelente', color: 'text-success' };
  };

  const getProfitMarginColor = (margin: number) => {
    if (margin >= 40) return 'text-success';
    if (margin >= 25) return 'text-warning';
    return 'text-destructive';
  };

  const getTurnoverColor = (rate: number) => {
    if (rate >= 8) return 'text-success';
    if (rate >= 4) return 'text-warning';
    return 'text-destructive';
  };

  const stockHealth = getStockHealthScore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span>{part.name}</span>
                  <Badge variant="outline" className={stockHealth.color}>
                    {stockHealth.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground font-normal">
                  {part.code} • {part.category} • {part.brand}
                </p>
              </div>
            </DialogTitle>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="timeline">Movimentações</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="pt-4">
                  <Package className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-lg font-bold">{part.stock_quantity || 0}</div>
                  <p className="text-xs text-muted-foreground">Em Estoque</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-4">
                  <TrendingUp className="h-6 w-6 text-success mx-auto mb-2" />
                  <div className="text-lg font-bold">{partStats.totalSold}</div>
                  <p className="text-xs text-muted-foreground">Total Vendido</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-4">
                  <DollarSign className="h-6 w-6 text-info mx-auto mb-2" />
                  <div className="text-lg font-bold">
                    {formatCurrency(partStats.totalRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground">Receita Total</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-4">
                  <BarChart3 className="h-6 w-6 text-warning mx-auto mb-2" />
                  <div className={`text-lg font-bold ${getTurnoverColor(partStats.turnoverRate)}`}>
                    {partStats.turnoverRate.toFixed(1)}x
                  </div>
                  <p className="text-xs text-muted-foreground">Giro/Ano</p>
                </CardContent>
              </Card>
            </div>

            {/* Part Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações da Peça</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Nome:</span>
                      <span>{part.name}</span>
                    </div>
                    
                    {part.code && (
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Código:</span>
                        <Badge variant="outline">{part.code}</Badge>
                      </div>
                    )}
                    
                    {part.category && (
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Categoria:</span>
                        <Badge variant="outline">{part.category}</Badge>
                      </div>
                    )}
                    
                    {part.brand && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Marca:</span>
                        <span>{part.brand}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {part.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Localização:</span>
                        <span>{part.location}</span>
                      </div>
                    )}
                    
                    {part.suppliers && (
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Fornecedor:</span>
                        <span>{part.suppliers.name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Prazo Entrega:</span>
                      <span>{partStats.supplierLeadTime} dias</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Qualidade:</span>
                      <Badge variant="default">{partStats.qualityScore}%</Badge>
                    </div>
                  </div>
                </div>

                {part.description && (
                  <div className="pt-4 border-t">
                    <span className="font-medium text-muted-foreground">Descrição:</span>
                    <p className="mt-1 text-sm bg-muted/50 p-3 rounded-md">
                      {part.description}
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="pt-4 border-t">
                  <PartsQuickActions part={part} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Análise de Preços</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Preço de Custo:</span>
                      <span className="font-semibold">{formatCurrency(part.cost_price || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Preço de Venda:</span>
                      <span className="font-semibold">{formatCurrency(part.sale_price || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Margem Unitária:</span>
                      <span className={`font-semibold ${getProfitMarginColor(partStats.profitMargin)}`}>
                        {Math.round(partStats.profitMargin)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-medium">Lucro por Unidade:</span>
                      <span className="text-lg font-bold text-success">
                        {formatCurrency((part.sale_price || 0) - (part.cost_price || 0))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Valor do Estoque</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Valor de Custo:</span>
                      <span className="font-semibold">
                        {formatCurrency((part.stock_quantity || 0) * (part.cost_price || 0))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Valor de Venda:</span>
                      <span className="font-semibold">
                        {formatCurrency((part.stock_quantity || 0) * (part.sale_price || 0))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Lucro Potencial:</span>
                      <span className="font-semibold text-success">
                        {formatCurrency(((part.stock_quantity || 0) * (part.sale_price || 0)) - ((part.stock_quantity || 0) * (part.cost_price || 0)))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ROI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Análise de ROI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-success">
                      {formatCurrency(partStats.avgSalePrice)}
                    </div>
                    <p className="text-sm text-muted-foreground">Preço médio de venda</p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className={`text-2xl font-bold ${getTurnoverColor(partStats.turnoverRate)}`}>
                      {partStats.turnoverRate.toFixed(1)}x
                    </div>
                    <p className="text-sm text-muted-foreground">Giro anual</p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-info">
                      {partStats.daysInStock}
                    </div>
                    <p className="text-sm text-muted-foreground">Dias em estoque</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Métricas de Vendas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Vendido:</span>
                      <span className="font-semibold">{partStats.totalSold} unidades</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Última Venda:</span>
                      <span className="font-semibold">{formatDate(partStats.lastSale)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Taxa de Retorno:</span>
                      <span className={`font-semibold ${partStats.returnRate < 2 ? 'text-success' : 'text-warning'}`}>
                        {partStats.returnRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Demanda Sazonal:</span>
                      <Badge variant={partStats.seasonalDemand ? "default" : "outline"}>
                        {partStats.seasonalDemand ? "Sim" : "Não"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gestão de Estoque</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Estoque Atual:</span>
                      <span className="font-semibold">{part.stock_quantity || 0} un.</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Estoque Mínimo:</span>
                      <span className="font-semibold">{part.min_stock || 0} un.</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Estoque Máximo:</span>
                      <span className="font-semibold">{part.max_stock || 0} un.</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Próxima Reposição:</span>
                      <span className="font-semibold">{formatDate(partStats.nextReorder)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alertas e Recomendações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(part.stock_quantity || 0) <= (part.min_stock || 0) && (
                  <div className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <div>
                        <p className="text-sm font-medium">Estoque Baixo</p>
                        <p className="text-xs text-muted-foreground">Reposição necessária</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Repor
                    </Button>
                  </div>
                )}
                
                {partStats.turnoverRate < 2 && (
                  <div className="flex items-center justify-between p-3 bg-info/10 border border-info/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-info" />
                      <div>
                        <p className="text-sm font-medium">Giro Lento</p>
                        <p className="text-xs text-muted-foreground">Considere promoção ou desconto</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Atenção</Badge>
                  </div>
                )}
                
                {partStats.profitMargin > 50 && (
                  <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <div>
                        <p className="text-sm font-medium">Alta Rentabilidade</p>
                        <p className="text-xs text-muted-foreground">Peça com excelente margem</p>
                      </div>
                    </div>
                    <Badge variant="default">Destaque</Badge>
                  </div>
                )}

                {partStats.returnRate > 3 && (
                  <div className="flex items-center justify-between p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <div>
                        <p className="text-sm font-medium">Alta Taxa de Retorno</p>
                        <p className="text-xs text-muted-foreground">Verificar qualidade do fornecedor</p>
                      </div>
                    </div>
                    <Badge variant="destructive">Crítico</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <PartsTimeline partId={part.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};