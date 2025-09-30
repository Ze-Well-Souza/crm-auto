import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus, ShoppingCart, ChartBar as BarChart3, TriangleAlert as AlertTriangle, RefreshCw, Eye, TrendingUp, Package, Truck, Star } from "lucide-react";
import type { Part } from "@/types";

interface PartsQuickActionsProps {
  part: Part;
  onAdjustStock?: () => void;
  onReorder?: () => void;
  onViewMovements?: () => void;
}

export const PartsQuickActions = ({ 
  part, 
  onAdjustStock, 
  onReorder,
  onViewMovements
}: PartsQuickActionsProps) => {
  const { toast } = useToast();

  const handleQuickAdd = () => {
    toast({
      title: "Estoque adicionado",
      description: `5 unidades de ${part.name} adicionadas`,
    });
    // In real app would add stock quantity
  };

  const handleQuickRemove = () => {
    if ((part.stock_quantity || 0) <= 0) {
      toast({
        title: "Estoque insuficiente",
        description: "Não há estoque para remover",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Estoque removido",
      description: `1 unidade de ${part.name} removida`,
    });
    // In real app would remove stock quantity
  };

  const handleQuickReorder = () => {
    const suggestedQuantity = (part.max_stock || part.min_stock || 10) - (part.stock_quantity || 0);
    toast({
      title: "Pedido criado",
      description: `Solicitando ${suggestedQuantity} unidades ao fornecedor`,
    });
    // In real app would create purchase order
  };

  const handleCheckSupplier = () => {
    toast({
      title: "Consultando fornecedor",
      description: "Verificando disponibilidade e preços...",
    });
    // In real app would check supplier availability
  };

  const handlePriceAlert = () => {
    toast({
      title: "Alerta configurado",
      description: "Você será notificado sobre mudanças de preço",
    });
    // In real app would set up price monitoring
  };

  const handleViewAnalytics = () => {
    toast({
      title: "Analytics",
      description: "Carregando análise de performance da peça...",
    });
    onViewMovements?.();
  };

  const isLowStock = (part.stock_quantity || 0) <= (part.min_stock || 0);
  const isOutOfStock = (part.stock_quantity || 0) <= 0;

  return (
    <div className="flex flex-wrap gap-1">
      {/* Stock Management */}
      <Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          handleQuickAdd();
        }}
        className="flex items-center gap-1 text-success hover:text-success"
      >
        <Plus className="h-3 w-3" />
        +5
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          handleQuickRemove();
        }}
        disabled={isOutOfStock}
        className="flex items-center gap-1 text-warning hover:text-warning"
      >
        <Minus className="h-3 w-3" />
        -1
      </Button>

      {/* Reorder Action */}
      {isLowStock && (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleQuickReorder();
          }}
          className="flex items-center gap-1 text-info hover:text-info"
        >
          <ShoppingCart className="h-3 w-3" />
          Repor
        </Button>
      )}

      {/* Supplier Actions */}
      {part.suppliers && (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleCheckSupplier();
          }}
          className="flex items-center gap-1"
        >
          <Truck className="h-3 w-3" />
          Fornecedor
        </Button>
      )}

      {/* Analytics */}
      <Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          handleViewAnalytics();
        }}
        className="flex items-center gap-1"
      >
        <BarChart3 className="h-3 w-3" />
        Analytics
      </Button>

      {/* Price Monitoring */}
      <Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          handlePriceAlert();
        }}
        className="flex items-center gap-1 text-purple-600 hover:text-purple-700"
      >
        <TrendingUp className="h-3 w-3" />
        Preço
      </Button>
    </div>
  );
};