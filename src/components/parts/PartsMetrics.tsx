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
      <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Package className="h-4 w-4 text-purple-400" />
            </div>
            Total de Peças
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{totalParts}</div>
          <p className="text-xs text-slate-400">Itens cadastrados</p>
        </CardContent>
      </Card>

      {/* Stock Value */}
      <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            Valor em Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-400">
            {formatCurrency(totalStockValue)}
          </div>
          <p className="text-xs text-slate-400">
            Lucro potencial: {formatCurrency(potentialProfit)}
          </p>
        </CardContent>
      </Card>

      {/* Stock Alerts */}
      <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
            </div>
            Alertas de Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-400">{outOfStock + lowStock}</div>
          <p className="text-xs text-slate-400">
            {outOfStock} sem estoque, {lowStock} baixo
          </p>
        </CardContent>
      </Card>

      {/* Stock Health */}
      <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Target className="h-4 w-4 text-blue-400" />
            </div>
            Saúde do Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-400">
            {Math.round(stockHealthScore)}%
          </div>
          <p className="text-xs text-slate-400">Score de qualidade</p>
        </CardContent>
      </Card>

      {/* Stock Status Distribution - Full Width */}
      <Card className="col-span-full bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            Distribuição de Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="font-semibold text-white">{outOfStock}</span>
              </div>
              <Badge className="text-xs bg-red-500/20 text-red-300 border-0">Sem Estoque</Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <span className="font-semibold text-white">{lowStock}</span>
              </div>
              <Badge className="text-xs bg-orange-500/20 text-orange-300 border-0">Estoque Baixo</Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="h-4 w-4 text-blue-400" />
                <span className="font-semibold text-white">{adequateStock}</span>
              </div>
              <Badge className="text-xs bg-blue-500/20 text-blue-300 border-0">Adequado</Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold text-white">{highStock}</span>
              </div>
              <Badge className="text-xs bg-emerald-500/20 text-emerald-300 border-0">Alto Estoque</Badge>
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-blue-300">Análise de Giro</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                    <span className="text-xs text-slate-300">Giro Rápido</span>
                  </div>
                  <Badge className="text-xs bg-emerald-500/20 text-emerald-300 border-0">{fastMovingItems}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-blue-400" />
                    <span className="text-xs text-slate-300">Giro Normal</span>
                  </div>
                  <Badge className="text-xs bg-blue-500/20 text-blue-300 border-0">{activeItems}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-3 w-3 text-orange-400" />
                    <span className="text-xs text-slate-300">Giro Lento</span>
                  </div>
                  <Badge className="text-xs bg-orange-500/20 text-orange-300 border-0">{slowMovingItems}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-red-400" />
                    <span className="text-xs text-slate-300">Estoque Morto</span>
                  </div>
                  <Badge className="text-xs bg-red-500/20 text-red-300 border-0">{deadStock}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm text-blue-300">Top Categorias</h4>
              <div className="space-y-2">
                {Object.entries(categories).slice(0, 4).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-xs truncate text-slate-300">{category}</span>
                    <Badge className="text-xs bg-purple-500/20 text-purple-300 border-0">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-lg font-bold text-emerald-400">
                {formatCurrency(totalStockValue)}
              </div>
              <p className="text-xs text-slate-400">Valor de Custo</p>
            </div>

            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-lg font-bold text-purple-400">
                {formatCurrency(totalSaleValue)}
              </div>
              <p className="text-xs text-slate-400">Valor de Venda</p>
            </div>

            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-lg font-bold text-blue-400">
                {Math.round(avgProfitMargin)}%
              </div>
              <p className="text-xs text-slate-400">Margem Média</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};