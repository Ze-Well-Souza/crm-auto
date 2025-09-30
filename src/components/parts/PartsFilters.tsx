import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Filter, X, Package, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, DollarSign, TrendingUp, TrendingDown, ChartBar as BarChart3, Truck, Star, Clock } from "lucide-react";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface PartsFiltersProps {
  onFiltersChange: (filters: any) => void;
  activeFilters: any;
}

export const PartsFilters = ({ onFiltersChange, activeFilters }: PartsFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [stockRange, setStockRange] = useState([0, 100]);

  const filterOptions = {
    stockStatus: [
      { value: 'out_of_stock', label: 'Sem Estoque', icon: AlertTriangle, color: 'text-destructive' },
      { value: 'low_stock', label: 'Estoque Baixo', icon: AlertTriangle, color: 'text-warning' },
      { value: 'adequate', label: 'Adequado', icon: CheckCircle, color: 'text-info' },
      { value: 'high_stock', label: 'Alto Estoque', icon: CheckCircle, color: 'text-success' }
    ],
    category: [
      { value: 'Filtros', label: 'Filtros' },
      { value: 'Freios', label: 'Freios' },
      { value: 'Motor', label: 'Motor' },
      { value: 'Transmissão', label: 'Transmissão' },
      { value: 'Suspensão', label: 'Suspensão' },
      { value: 'Sistema Elétrico', label: 'Sistema Elétrico' }
    ],
    performance: [
      { value: 'fast_moving', label: 'Giro Rápido', icon: TrendingUp, color: 'text-success' },
      { value: 'normal_moving', label: 'Giro Normal', icon: BarChart3, color: 'text-info' },
      { value: 'slow_moving', label: 'Giro Lento', icon: TrendingDown, color: 'text-warning' },
      { value: 'dead_stock', label: 'Estoque Morto', icon: AlertTriangle, color: 'text-destructive' }
    ],
    profitability: [
      { value: 'high_margin', label: 'Alta Margem (>40%)', color: 'text-success' },
      { value: 'medium_margin', label: 'Média Margem (20-40%)', color: 'text-warning' },
      { value: 'low_margin', label: 'Baixa Margem (<20%)', color: 'text-destructive' }
    ]
  };

  const handleFilterChange = (filterType: string, value: string, checked?: boolean) => {
    const newFilters = { ...activeFilters };
    
    if (filterType === 'quickFilter') {
      newFilters[value] = checked;
    } else {
      if (checked) {
        newFilters[filterType] = [...(newFilters[filterType] || []), value];
      } else {
        newFilters[filterType] = (newFilters[filterType] || []).filter((v: string) => v !== value);
      }
    }
    
    onFiltersChange(newFilters);
  };

  const handleRangeFilter = (type: string, range: number[]) => {
    const newFilters = { ...activeFilters };
    newFilters[type] = range;
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange({});
    setPriceRange([0, 1000]);
    setStockRange([0, 100]);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).flat().filter(Boolean).length;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              <Button
                variant={activeFilters.lowStock ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('quickFilter', 'lowStock', !activeFilters.lowStock)}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Baixo
              </Button>
              
              <Button
                variant={activeFilters.outOfStock ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('quickFilter', 'outOfStock', !activeFilters.outOfStock)}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Sem Estoque
              </Button>

              <Button
                variant={activeFilters.highMargin ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('quickFilter', 'highMargin', !activeFilters.highMargin)}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Alta Margem
              </Button>

              <Button
                variant={activeFilters.fastMoving ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('quickFilter', 'fastMoving', !activeFilters.fastMoving)}
              >
                <Star className="h-3 w-3 mr-1" />
                Top Vendas
              </Button>
            </div>

            {/* Advanced Filters */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Filter className="h-3 w-3 mr-1" />
                  Filtros Avançados
                  {getActiveFilterCount() > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs"
                    >
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filtros Avançados</h4>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-3 w-3 mr-1" />
                      Limpar
                    </Button>
                  </div>

                  <Separator />

                  {/* Stock Status Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Package className="h-3 w-3" />
                      Status do Estoque
                    </Label>
                    <div className="grid grid-cols-1 gap-2">
                      {filterOptions.stockStatus.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`stock-${option.value}`}
                            checked={activeFilters.stockStatus?.includes(option.value) || false}
                            onCheckedChange={(checked) => 
                              handleFilterChange('stockStatus', option.value, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={`stock-${option.value}`} 
                            className={cn("text-xs flex items-center gap-1", option.color)}
                          >
                            <option.icon className="h-3 w-3" />
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Category Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <BarChart3 className="h-3 w-3" />
                      Categoria
                    </Label>
                    <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                      {filterOptions.category.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${option.value}`}
                            checked={activeFilters.category?.includes(option.value) || false}
                            onCheckedChange={(checked) => 
                              handleFilterChange('category', option.value, checked as boolean)
                            }
                          />
                          <Label htmlFor={`category-${option.value}`} className="text-xs">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-3 w-3" />
                      Faixa de Preço (R$)
                    </Label>
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => {
                          setPriceRange(value);
                          handleRangeFilter('priceRange', value);
                        }}
                        min={0}
                        max={2000}
                        step={50}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>R$ {priceRange[0]}</span>
                        <span>R$ {priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Stock Quantity Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Package className="h-3 w-3" />
                      Quantidade em Estoque
                    </Label>
                    <div className="px-2">
                      <Slider
                        value={stockRange}
                        onValueChange={(value) => {
                          setStockRange(value);
                          handleRangeFilter('stockRange', value);
                        }}
                        min={0}
                        max={200}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{stockRange[0]} un.</span>
                        <span>{stockRange[1]} un.</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Performance Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-3 w-3" />
                      Performance de Vendas
                    </Label>
                    <div className="space-y-2">
                      {filterOptions.performance.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`performance-${option.value}`}
                            checked={activeFilters.performance?.includes(option.value) || false}
                            onCheckedChange={(checked) => 
                              handleFilterChange('performance', option.value, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={`performance-${option.value}`} 
                            className={cn("text-xs flex items-center gap-1", option.color)}
                          >
                            <option.icon className="h-3 w-3" />
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Profitability Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-3 w-3" />
                      Rentabilidade
                    </Label>
                    <div className="space-y-2">
                      {filterOptions.profitability.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`profit-${option.value}`}
                            checked={activeFilters.profitability?.includes(option.value) || false}
                            onCheckedChange={(checked) => 
                              handleFilterChange('profitability', option.value, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={`profit-${option.value}`} 
                            className={cn("text-xs", option.color)}
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Active Filters Display */}
          {getActiveFilterCount() > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Filtros ativos:</span>
              <Badge variant="secondary" className="text-xs">
                {getActiveFilterCount()}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};