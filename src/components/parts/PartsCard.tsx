import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Package, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, TrendingUp, TrendingDown, DollarSign, MapPin, Truck, ChartBar as BarChart3, Clock, Star, ShoppingCart, Eye, CreditCard as Edit, Plus, Minus } from "lucide-react";
import { PartsActions } from "./PartsActions";
import { PartsDashboard } from "./PartsDashboard";
import { PartsQuickActions } from "./PartsQuickActions";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import type { Part } from "@/types";

interface PartsCardProps {
  part: Part;
  onUpdate: () => void;
  onQuickAction?: (action: string, part: Part) => void;
}

export const PartsCard = ({ part, onUpdate, onQuickAction }: PartsCardProps) => {
  const [showDashboard, setShowDashboard] = useState(false);
  
  // Mock data for demonstration - in real app would come from database
  const partMetrics = {
    monthlyUsage: Math.floor(Math.random() * 20) + 1,
    totalSold: Math.floor(Math.random() * 100) + 10,
    profitMargin: Math.random() * 50 + 20, // 20-70%
    turnoverRate: Math.random() * 12 + 1, // 1-13 times per year
    lastSale: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    supplierRating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
    reorderPoint: (part.min_stock || 0) + Math.floor(Math.random() * 5),
    avgDaysToSell: Math.floor(Math.random() * 30) + 5
  };

  const getStockStatus = () => {
    const stock = part.stock_quantity || 0;
    const minStock = part.min_stock || 0;
    
    if (stock <= 0) {
      return { 
        status: 'out', 
        label: 'Sem Estoque', 
        variant: 'destructive' as const,
        icon: AlertTriangle,
        color: 'text-destructive',
        bgColor: 'from-red-400/10 to-red-500/5'
      };
    }
    if (stock <= minStock) {
      return { 
        status: 'low', 
        label: 'Estoque Baixo', 
        variant: 'secondary' as const,
        icon: AlertTriangle,
        color: 'text-warning',
        bgColor: 'from-yellow-400/10 to-orange-500/5'
      };
    }
    if (stock <= minStock * 2) {
      return { 
        status: 'medium', 
        label: 'Atenção', 
        variant: 'outline' as const,
        icon: Clock,
        color: 'text-info',
        bgColor: 'from-blue-400/10 to-cyan-500/5'
      };
    }
    return { 
      status: 'ok', 
      label: 'Disponível', 
      variant: 'default' as const,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'from-green-400/10 to-emerald-500/5'
    };
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

  const getPartIcon = () => {
    return part.code?.charAt(0)?.toUpperCase() || part.name?.charAt(0)?.toUpperCase() || 'P';
  };

  const stockStatus = getStockStatus();
  const StatusIcon = stockStatus.icon;

  const handleQuickAction = (action: string) => {
    onQuickAction?.(action, part);
  };

  const handleCardClick = () => {
    setShowDashboard(true);
  };

  const calculateStockValue = () => {
    return (part.stock_quantity || 0) * (part.cost_price || 0);
  };

  const calculatePotentialProfit = () => {
    const costValue = (part.stock_quantity || 0) * (part.cost_price || 0);
    const saleValue = (part.stock_quantity || 0) * (part.sale_price || 0);
    return saleValue - costValue;
  };

  return (
    <>
      <Card 
        className="hover:shadow-elevated transition-smooth cursor-pointer group relative overflow-hidden"
        onClick={handleCardClick}
      >
        {/* Background gradient based on stock status */}
        <div className={cn(
          "absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10 bg-gradient-to-br",
          stockStatus.bgColor
        )} />

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getPartIcon()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {part.name}
                  <Badge variant={stockStatus.variant} className="flex items-center gap-1">
                    <StatusIcon className={cn("h-3 w-3", stockStatus.color)} />
                    {stockStatus.label}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  {part.code && <span>Código: {part.code}</span>}
                  {part.category && (
                    <>
                      {part.code && <span>•</span>}
                      <Badge variant="outline" className="text-xs">
                        {part.category}
                      </Badge>
                    </>
                  )}
                </CardDescription>
              </div>
            </div>
            <PartsActions part={part} onUpdate={onUpdate} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          {/* Supplier Information */}
          {part.suppliers && (
            <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-md">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{part.suppliers.name}</span>
              <div className="ml-auto flex items-center gap-1">
                {[...Array(partMetrics.supplierRating)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          )}

          {/* Stock Information */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Package className="h-3 w-3 text-primary" />
                <span className="text-sm font-semibold">
                  {part.stock_quantity || 0} un.
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Em estoque</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <AlertTriangle className="h-3 w-3 text-warning" />
                <span className="text-sm font-semibold">
                  {part.min_stock || 0} un.
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Mínimo</p>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <DollarSign className="h-3 w-3 text-info" />
                <span className="text-sm font-semibold">
                  {part.cost_price ? formatCurrency(part.cost_price) : 'N/A'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Custo</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-sm font-semibold text-success">
                  {part.sale_price ? formatCurrency(part.sale_price) : 'N/A'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Venda</p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t text-xs">
            <div className="text-center">
              <div className={cn("font-semibold", getProfitMarginColor(partMetrics.profitMargin))}>
                {Math.round(partMetrics.profitMargin)}%
              </div>
              <p className="text-muted-foreground">Margem</p>
            </div>
            
            <div className="text-center">
              <div className={cn("font-semibold", getTurnoverColor(partMetrics.turnoverRate))}>
                {partMetrics.turnoverRate.toFixed(1)}x
              </div>
              <p className="text-muted-foreground">Giro/ano</p>
            </div>
            
            <div className="text-center">
              <div className="font-semibold text-info">
                {partMetrics.avgDaysToSell}d
              </div>
              <p className="text-muted-foreground">Dias venda</p>
            </div>
          </div>

          {/* Stock Value */}
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-sm font-medium">Valor em Estoque:</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(calculateStockValue())}
            </span>
          </div>

          {/* Reorder Alert */}
          {(part.stock_quantity || 0) <= (part.min_stock || 0) && (
            <div className="bg-warning/10 border border-warning/20 rounded-md p-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium text-warning">Reposição Necessária</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Sugestão: {partMetrics.reorderPoint} unidades
              </p>
            </div>
          )}

          {/* Location */}
          {part.location && (
            <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-md">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Local:</span>
              <span>{part.location}</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <PartsQuickActions 
              part={part}
              onAdjustStock={() => handleQuickAction('adjust-stock')}
              onReorder={() => handleQuickAction('reorder')}
              onViewMovements={() => handleQuickAction('movements')}
            />
          </div>

          {/* Last Update */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Atualizado em {formatDate(part.updated_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              <span>{partMetrics.monthlyUsage}/mês</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parts Dashboard Modal */}
      <PartsDashboard
        part={part}
        open={showDashboard}
        onOpenChange={setShowDashboard}
      />
    </>
  );
};