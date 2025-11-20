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
import { Filter, X, FileText, CircleCheck as CheckCircle, Play as PlayCircle, Pause as PauseCircle, Clock, DollarSign, Calendar, TriangleAlert as AlertTriangle, TrendingUp, User, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceOrderFiltersProps {
  onFiltersChange: (filters: any) => void;
  activeFilters: any;
}

export const ServiceOrderFilters = ({ onFiltersChange, activeFilters }: ServiceOrderFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [valueRange, setValueRange] = useState([0, 5000]);
  const [dateRange, setDateRange] = useState('all');

  const filterOptions = {
    status: [
      { value: 'orcamento', label: 'Orçamento', icon: FileText, color: 'text-muted-foreground' },
      { value: 'aprovado', label: 'Aprovado', icon: CheckCircle, color: 'text-success' },
      { value: 'em_andamento', label: 'Em Andamento', icon: PlayCircle, color: 'text-info' },
      { value: 'aguardando_pecas', label: 'Aguardando Peças', icon: PauseCircle, color: 'text-warning' },
      { value: 'concluido', label: 'Concluído', icon: CheckCircle, color: 'text-success' },
      { value: 'entregue', label: 'Entregue', icon: CheckCircle, color: 'text-success' },
      { value: 'cancelado', label: 'Cancelado', icon: AlertTriangle, color: 'text-destructive' }
    ],
    priority: [
      { value: 'alta', label: 'Alta Prioridade', color: 'text-destructive' },
      { value: 'media', label: 'Média Prioridade', color: 'text-warning' },
      { value: 'baixa', label: 'Baixa Prioridade', color: 'text-success' }
    ],
    serviceType: [
      { value: 'manutencao_preventiva', label: 'Manutenção Preventiva' },
      { value: 'manutencao_corretiva', label: 'Manutenção Corretiva' },
      { value: 'troca_oleo', label: 'Troca de Óleo' },
      { value: 'revisao', label: 'Revisão Geral' },
      { value: 'freios', label: 'Sistema de Freios' },
      { value: 'suspensao', label: 'Suspensão' }
    ],
    dateRange: [
      { value: 'today', label: 'Hoje' },
      { value: 'week', label: 'Esta Semana' },
      { value: 'month', label: 'Este Mês' },
      { value: 'quarter', label: 'Este Trimestre' },
      { value: 'year', label: 'Este Ano' }
    ]
  };

  const handleFilterChange = (filterType: string, value: string, checked?: boolean) => {
    const newFilters = { ...activeFilters };
    
    if (filterType === 'quickFilter') {
      newFilters[value] = checked;
    } else if (filterType === 'single') {
      newFilters[value] = checked ? value : null;
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
    setValueRange([0, 5000]);
    setDateRange('all');
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).flat().filter(Boolean).length;
  };

  return (
    <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Quick Filters */}
            <div className="flex items-center gap-2">
              <Button
                variant={activeFilters.urgent ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('quickFilter', 'urgent', !activeFilters.urgent)}
                className={cn(
                  activeFilters.urgent
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-500/50"
                    : "border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Urgente
              </Button>

              <Button
                variant={activeFilters.highValue ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('quickFilter', 'highValue', !activeFilters.highValue)}
                className={cn(
                  activeFilters.highValue
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-500/50"
                    : "border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <DollarSign className="h-3 w-3 mr-1" />
                Alto Valor
              </Button>

              <Button
                variant={activeFilters.inProgress ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('quickFilter', 'inProgress', !activeFilters.inProgress)}
                className={cn(
                  activeFilters.inProgress
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-500/50"
                    : "border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <PlayCircle className="h-3 w-3 mr-1" />
                Em Andamento
              </Button>

              <Button
                variant={activeFilters.needsApproval ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('quickFilter', 'needsApproval', !activeFilters.needsApproval)}
                className={cn(
                  activeFilters.needsApproval
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-500/50"
                    : "border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <Clock className="h-3 w-3 mr-1" />
                Aprovação
              </Button>
            </div>

            {/* Advanced Filters */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  Filtros Avançados
                  {getActiveFilterCount() > 0 && (
                    <Badge
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500 text-white border-0"
                    >
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-slate-900 border-white/10 backdrop-blur-xl" align="start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">Filtros Avançados</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Limpar
                    </Button>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2 text-blue-300">
                      <CheckCircle className="h-3 w-3" />
                      Status da Ordem
                    </Label>
                    <div className="grid grid-cols-1 gap-2">
                      {filterOptions.status.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${option.value}`}
                            checked={activeFilters.status?.includes(option.value) || false}
                            onCheckedChange={(checked) =>
                              handleFilterChange('status', option.value, checked as boolean)
                            }
                            className="border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                          />
                          <Label
                            htmlFor={`status-${option.value}`}
                            className={cn(
                              "text-xs flex items-center gap-1",
                              option.value === 'concluido' && "text-emerald-400",
                              option.value === 'em_andamento' && "text-blue-400",
                              option.value === 'orcamento' && "text-slate-400",
                              option.value === 'aguardando_pecas' && "text-orange-400",
                              option.value === 'cancelado' && "text-red-400",
                              option.value === 'aprovado' && "text-emerald-400",
                              option.value === 'entregue' && "text-emerald-400"
                            )}
                          >
                            <option.icon className="h-3 w-3" />
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Value Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2 text-blue-300">
                      <DollarSign className="h-3 w-3" />
                      Faixa de Valor (R$)
                    </Label>
                    <div className="px-2">
                      <Slider
                        value={valueRange}
                        onValueChange={(value) => {
                          setValueRange(value);
                          handleRangeFilter('valueRange', value);
                        }}
                        min={0}
                        max={10000}
                        step={100}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>R$ {valueRange[0].toLocaleString('pt-BR')}</span>
                        <span>R$ {valueRange[1].toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Date Range */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2 text-blue-300">
                      <Calendar className="h-3 w-3" />
                      Período
                    </Label>
                    <Select
                      value={activeFilters.dateRange || ""}
                      onValueChange={(value) => handleFilterChange('single', 'dateRange', true)}
                    >
                      <SelectTrigger className="h-8 bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Selecione o período" className="text-slate-400" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        {filterOptions.dateRange.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-white hover:bg-white/10">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Service Type */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2 text-blue-300">
                      <Wrench className="h-3 w-3" />
                      Tipo de Serviço
                    </Label>
                    <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                      {filterOptions.serviceType.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`service-${option.value}`}
                            checked={activeFilters.serviceType?.includes(option.value) || false}
                            onCheckedChange={(checked) =>
                              handleFilterChange('serviceType', option.value, checked as boolean)
                            }
                            className="border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                          />
                          <Label htmlFor={`service-${option.value}`} className="text-xs text-slate-300">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Priority Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2 text-blue-300">
                      <TrendingUp className="h-3 w-3" />
                      Prioridade
                    </Label>
                    <div className="space-y-2">
                      {filterOptions.priority.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`priority-${option.value}`}
                            checked={activeFilters.priority?.includes(option.value) || false}
                            onCheckedChange={(checked) =>
                              handleFilterChange('priority', option.value, checked as boolean)
                            }
                            className="border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                          />
                          <Label
                            htmlFor={`priority-${option.value}`}
                            className={cn(
                              "text-xs",
                              option.value === 'alta' && "text-red-400",
                              option.value === 'media' && "text-orange-400",
                              option.value === 'baixa' && "text-emerald-400"
                            )}
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
              <span className="text-xs text-slate-400">Filtros ativos:</span>
              <Badge className="text-xs bg-purple-500/20 text-purple-300 border-0">
                {getActiveFilterCount()}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};