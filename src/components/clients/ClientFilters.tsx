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
import { Filter, X, Star, MapPin, Calendar, DollarSign, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientFiltersProps {
  onFiltersChange: (filters: any) => void;
  activeFilters: any;
}

export const ClientFilters = ({ onFiltersChange, activeFilters }: ClientFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const filterOptions = {
    tier: [
      { value: 'vip', label: 'VIP', color: 'text-yellow-600' },
      { value: 'premium', label: 'Premium', color: 'text-purple-600' },
      { value: 'regular', label: 'Regular', color: 'text-blue-600' },
      { value: 'novo', label: 'Novo', color: 'text-gray-600' }
    ],
    location: [
      { value: 'sp', label: 'São Paulo' },
      { value: 'rj', label: 'Rio de Janeiro' },
      { value: 'mg', label: 'Minas Gerais' },
      { value: 'outros', label: 'Outros Estados' }
    ],
    lastService: [
      { value: '7', label: 'Últimos 7 dias' },
      { value: '30', label: 'Últimos 30 dias' },
      { value: '90', label: 'Últimos 3 meses' },
      { value: '365', label: 'Último ano' }
    ],
    spentRange: [
      { value: '0-500', label: 'Até R$ 500' },
      { value: '500-1500', label: 'R$ 500 - R$ 1.500' },
      { value: '1500-5000', label: 'R$ 1.500 - R$ 5.000' },
      { value: '5000+', label: 'Acima de R$ 5.000' }
    ]
  };

  const handleFilterChange = (filterType: string, value: string, checked?: boolean) => {
    const newFilters = { ...activeFilters };
    
    if (filterType === 'hasContact') {
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

  const clearFilters = () => {
    onFiltersChange({});
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
                variant={activeFilters.hasEmail ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('hasContact', 'hasEmail', !activeFilters.hasEmail)}
              >
                <Mail className="h-3 w-3 mr-1" />
                Com Email
              </Button>
              
              <Button
                variant={activeFilters.hasPhone ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('hasContact', 'hasPhone', !activeFilters.hasPhone)}
              >
                <Phone className="h-3 w-3 mr-1" />
                Com Telefone
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

                  {/* Tier Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Star className="h-3 w-3" />
                      Classificação
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {filterOptions.tier.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tier-${option.value}`}
                            checked={activeFilters.tier?.includes(option.value) || false}
                            onCheckedChange={(checked) => 
                              handleFilterChange('tier', option.value, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={`tier-${option.value}`} 
                            className={cn("text-xs", option.color)}
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Location Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      Localização
                    </Label>
                    <Select
                      value={activeFilters.location || ""}
                      onValueChange={(value) => handleFilterChange('location', value, true)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.location.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Last Service Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      Último Serviço
                    </Label>
                    <Select
                      value={activeFilters.lastService || ""}
                      onValueChange={(value) => handleFilterChange('lastService', value, true)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Período" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.lastService.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Spent Range Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-3 w-3" />
                      Valor Gasto
                    </Label>
                    <Select
                      value={activeFilters.spentRange || ""}
                      onValueChange={(value) => handleFilterChange('spentRange', value, true)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Faixa de valor" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.spentRange.map((option) => (
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