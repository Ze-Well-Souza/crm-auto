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
import { Filter, X, Fuel, Calendar, Gauge, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, DollarSign } from "lucide-react";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleFiltersProps {
  onFiltersChange: (filters: any) => void;
  activeFilters: any;
}

export const VehicleFilters = ({ onFiltersChange, activeFilters }: VehicleFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [yearRange, setYearRange] = useState([2000, 2025]);
  const [mileageRange, setMileageRange] = useState([0, 200000]);

  const filterOptions = {
    fuelType: [
      { value: 'Gasolina', label: 'Gasolina', icon: Fuel },
      { value: 'Etanol', label: 'Etanol', icon: Fuel },
      { value: 'Flex', label: 'Flex', icon: Fuel },
      { value: 'Diesel', label: 'Diesel', icon: Fuel },
      { value: 'Elétrico', label: 'Elétrico', icon: Fuel },
      { value: 'Híbrido', label: 'Híbrido', icon: Fuel }
    ],
    maintenanceStatus: [
      { value: 'em_dia', label: 'Em Dia', icon: CheckCircle, color: 'text-success' },
      { value: 'proxima', label: 'Próxima', icon: Clock, color: 'text-warning' },
      { value: 'atrasada', label: 'Atrasada', icon: AlertTriangle, color: 'text-destructive' }
    ],
    ageCategory: [
      { value: 'novo', label: 'Novo (0-3 anos)' },
      { value: 'seminovo', label: 'Seminovo (4-7 anos)' },
      { value: 'usado', label: 'Usado (8+ anos)' }
    ],
    mileageCategory: [
      { value: 'baixa', label: 'Baixa (0-50k km)' },
      { value: 'media', label: 'Média (50-100k km)' },
      { value: 'alta', label: 'Alta (100k+ km)' }
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
    setYearRange([2000, 2025]);
    setMileageRange([0, 200000]);
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
                variant={activeFilters.highMileage ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('quickFilter', 'highMileage', !activeFilters.highMileage)}
              >
                <Gauge className="h-3 w-3 mr-1" />
                Alta Km
              </Button>
              
              <Button
                variant={activeFilters.maintenanceDue ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('quickFilter', 'maintenanceDue', !activeFilters.maintenanceDue)}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Manutenção
              </Button>

              <Button
                variant={activeFilters.flexFuel ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('quickFilter', 'flexFuel', !activeFilters.flexFuel)}
              >
                <Fuel className="h-3 w-3 mr-1" />
                Flex
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

                  {/* Fuel Type Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Fuel className="h-3 w-3" />
                      Tipo de Combustível
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {filterOptions.fuelType.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`fuel-${option.value}`}
                            checked={activeFilters.fuelType?.includes(option.value) || false}
                            onCheckedChange={(checked) => 
                              handleFilterChange('fuelType', option.value, checked as boolean)
                            }
                          />
                          <Label htmlFor={`fuel-${option.value}`} className="text-xs">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Year Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      Faixa de Ano
                    </Label>
                    <div className="px-2">
                      <Slider
                        value={yearRange}
                        onValueChange={(value) => {
                          setYearRange(value);
                          handleRangeFilter('yearRange', value);
                        }}
                        min={1990}
                        max={2025}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{yearRange[0]}</span>
                        <span>{yearRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Mileage Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Gauge className="h-3 w-3" />
                      Quilometragem (km)
                    </Label>
                    <div className="px-2">
                      <Slider
                        value={mileageRange}
                        onValueChange={(value) => {
                          setMileageRange(value);
                          handleRangeFilter('mileageRange', value);
                        }}
                        min={0}
                        max={300000}
                        step={5000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{mileageRange[0].toLocaleString('pt-BR')}</span>
                        <span>{mileageRange[1].toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Maintenance Status */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Settings className="h-3 w-3" />
                      Status de Manutenção
                    </Label>
                    <div className="space-y-2">
                      {filterOptions.maintenanceStatus.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`maintenance-${option.value}`}
                            checked={activeFilters.maintenanceStatus?.includes(option.value) || false}
                            onCheckedChange={(checked) => 
                              handleFilterChange('maintenanceStatus', option.value, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={`maintenance-${option.value}`} 
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

                  {/* Age Category */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      Categoria por Idade
                    </Label>
                    <Select
                      value={activeFilters.ageCategory || ""}
                      onValueChange={(value) => handleFilterChange('ageCategory', value, true)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.ageCategory.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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