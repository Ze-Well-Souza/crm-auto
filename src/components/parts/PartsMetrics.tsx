import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, DollarSign, TrendingUp, TrendingDown, ChartBar as BarChart3, Clock, Star, Truck, Target } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import type { Part } from "@/types";

interface PartsMetricsProps {
  parts: Part[];
}

export const PartsMetrics = ({ parts }: PartsMetricsProps) => {
  const totalParts = parts.length;
  
  // Stock status distribution
  const outOfStock = parts.filter(p => !p.stock_quantity || p.stock_quantity <= 0).length;
  const lowStock = parts.filter(p => p.min_stock && p.stock_quantity && p.stock_quantity <= p.min_stock && p.stock_quantity > 0).length;
  const adequateStock = parts.filter(p => p.min_stock && p.stock_quantity && p.stock_quantity > p.min_stock && p.stock_quantity <= (p.min_stock * 2)).length;
  const highStock = totalParts - outOfStock - lowStock - adequateStock;

  // Financial metrics
  const totalStockValue = parts.reduce((sum, p) => sum + ((p.stock_quantity || 0) * (p.cost_price || 0)), 0);
  const totalSaleValue = parts.reduce((sum, p) => sum + ((p.stock_quantity || 0) * (p.sale_price || 0)), 0);
  const potentialProfit = totalSaleValue - totalStockValue;
  const avgProfitMargin = totalStockValue > 0 ? ((potentialProfit / totalStockValue) * 100) : 0;

  // Category distribution
  const categories = parts.reduce((acc, p) => {
    const category = p.category || 'Sem categoria';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Supplier distribution
  const suppliers = parts.reduce((acc, p) => {
    const supplier = p.suppliers?.name || 'Sem fornecedor';
    acc[supplier] = (acc[supplier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Performance metrics (mock data)
  const fastMovingItems = Math.floor(totalParts * 0.2);
  const slowMovingItems = Math.floor(totalParts * 0.3);
  const deadStock = Math.floor(totalParts * 0.1);
  const activeItems = totalParts - fastMovingItems - slowMovingItems - deadStock;

  const stockHealthScore = totalParts > 0 ? 
    ((adequateStock + highStock) / totalParts) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Parts */}
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

      {/* Stock Value */}
      <Card className="gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-success" />
            Valor em Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {formatCurrency(totalStockValue)}
          </div>
          <p className="text-xs text-muted-foreground">
            Lucro potencial: {formatCurrency(potentialProfit)}
          </p>
        </CardContent>
      </Card>

      {/* Stock Alerts */}
      <Card className="gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Alertas de Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{outOfStock + lowStock}</div>
          <p className="text-xs text-muted-foreground">
            {outOfStock} sem estoque, {lowStock} baixo
          </p>
        </CardContent>
      </Card>

      {/* Stock Health */}
      <Card className="gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4 text-info" />
            Saúde do Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-info">
            {Math.round(stockHealthScore)}%
          </div>
          <p className="text-xs text-muted-foreground">Score de qualidade</p>
        </CardContent>
      </Card>

      {/* Stock Status Distribution - Full Width */}
      <Card className="col-span-full gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Distribuição de Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="font-semibold">{outOfStock}</span>
              </div>
              <Badge variant="destructive" className="text-xs">Sem Estoque</Badge>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="font-semibold">{lowStock}</span>
              </div>
              <Badge variant="secondary" className="text-xs">Estoque Baixo</Badge>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="h-4 w-4 text-info" />
                <span className="font-semibold">{adequateStock}</span>
              </div>
              <Badge variant="outline" className="text-xs">Adequado</Badge>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="font-semibold">{highStock}</span>
              </div>
              <Badge variant="default" className="text-xs">Alto Estoque</Badge>
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Análise de Giro</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-xs">Giro Rápido</span>
                  </div>
                  <Badge variant="default" className="text-xs">{fastMovingItems}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-info" />
                    <span className="text-xs">Giro Normal</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{activeItems}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-3 w-3 text-warning" />
                    <span className="text-xs">Giro Lento</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{slowMovingItems}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-destructive" />
                    <span className="text-xs">Estoque Morto</span>
                  </div>
                  <Badge variant="destructive" className="text-xs">{deadStock}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Top Categorias</h4>
              <div className="space-y-2">
                {Object.entries(categories).slice(0, 4).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-xs truncate">{category}</span>
                    <Badge variant="outline" className="text-xs">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-success">
                {formatCurrency(totalStockValue)}
              </div>
              <p className="text-xs text-muted-foreground">Valor de Custo</p>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-primary">
                {formatCurrency(totalSaleValue)}
              </div>
              <p className="text-xs text-muted-foreground">Valor de Venda</p>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-info">
                {Math.round(avgProfitMargin)}%
              </div>
              <p className="text-xs text-muted-foreground">Margem Média</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};