import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  Calendar as CalendarIcon, 
  Filter, 
  X, 
  Plus, 
  Save, 
  Download,
  RefreshCw,
  Search,
  Settings
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface ReportFilter {
  id: string;
  type: 'date' | 'select' | 'multiselect' | 'range' | 'text' | 'boolean';
  label: string;
  value: any;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
}

interface ReportFiltersProps {
  filters: ReportFilter[];
  onFiltersChange: (filters: ReportFilter[]) => void;
  onApplyFilters: () => void;
  onExport: (format: 'pdf' | 'excel' | 'csv') => void;
  isLoading?: boolean;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onExport,
  isLoading = false
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedFilters, setSavedFilters] = useState<{ name: string; filters: ReportFilter[] }[]>([]);

  const updateFilter = (id: string, value: any) => {
    const updatedFilters = filters.map(filter =>
      filter.id === id ? { ...filter, value } : filter
    );
    onFiltersChange(updatedFilters);
  };

  const removeFilter = (id: string) => {
    const updatedFilters = filters.filter(filter => filter.id !== id);
    onFiltersChange(updatedFilters);
  };

  const addFilter = (type: ReportFilter['type']) => {
    const newFilter: ReportFilter = {
      id: `filter_${Date.now()}`,
      type,
      label: `Novo Filtro ${type}`,
      value: type === 'date' ? { from: undefined, to: undefined } : 
             type === 'multiselect' ? [] :
             type === 'range' ? [0, 100] :
             type === 'boolean' ? false : ''
    };
    onFiltersChange([...filters, newFilter]);
  };

  const saveCurrentFilters = () => {
    const name = prompt('Nome para salvar os filtros:');
    if (name) {
      setSavedFilters([...savedFilters, { name, filters: [...filters] }]);
    }
  };

  const loadSavedFilters = (savedFilter: { name: string; filters: ReportFilter[] }) => {
    onFiltersChange(savedFilter.filters);
  };

  const clearAllFilters = () => {
    const clearedFilters = filters.map(filter => ({
      ...filter,
      value: filter.type === 'date' ? { from: undefined, to: undefined } :
             filter.type === 'multiselect' ? [] :
             filter.type === 'range' ? [filter.min || 0, filter.max || 100] :
             filter.type === 'boolean' ? false : ''
    }));
    onFiltersChange(clearedFilters);
  };

  const renderFilter = (filter: ReportFilter) => {
    switch (filter.type) {
      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filter.value?.from ? (
                  filter.value.to ? (
                    <>
                      {format(filter.value.from, "dd/MM/yyyy")} -{" "}
                      {format(filter.value.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(filter.value.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Selecionar período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filter.value?.from}
                selected={filter.value}
                onSelect={(value) => updateFilter(filter.id, value)}
                numberOfMonths={2}
                className={cn("p-3")}
              />
            </PopoverContent>
          </Popover>
        );

      case 'select':
        return (
          <Select value={filter.value} onValueChange={(value) => updateFilter(filter.id, value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar..." />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${filter.id}_${option.value}`}
                  checked={filter.value?.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = filter.value || [];
                    const newValues = checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    updateFilter(filter.id, newValues);
                  }}
                />
                <Label htmlFor={`${filter.id}_${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <Slider
              value={filter.value || [filter.min || 0, filter.max || 100]}
              onValueChange={(value) => updateFilter(filter.id, value)}
              min={filter.min || 0}
              max={filter.max || 100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filter.value?.[0] || filter.min || 0}</span>
              <span>{filter.value?.[1] || filter.max || 100}</span>
            </div>
          </div>
        );

      case 'text':
        return (
          <Input
            value={filter.value || ''}
            onChange={(e) => updateFilter(filter.id, e.target.value)}
            placeholder="Digite para filtrar..."
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={filter.id}
              checked={filter.value || false}
              onCheckedChange={(checked) => updateFilter(filter.id, checked)}
            />
            <Label htmlFor={filter.id}>Ativo</Label>
          </div>
        );

      default:
        return null;
    }
  };

  const activeFiltersCount = filters.filter(filter => {
    if (filter.type === 'date') return filter.value?.from || filter.value?.to;
    if (filter.type === 'multiselect') return filter.value?.length > 0;
    if (filter.type === 'range') return filter.value?.[0] !== filter.min || filter.value?.[1] !== filter.max;
    if (filter.type === 'boolean') return filter.value;
    return filter.value && filter.value !== '';
  }).length;

  return (
    <Card className="gradient-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} ativo{activeFiltersCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              disabled={activeFiltersCount === 0}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filters.map((filter) => (
            <div key={filter.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{filter.label}</Label>
                {showAdvanced && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(filter.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {renderFilter(filter)}
            </div>
          ))}
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Adicionar Filtros</h4>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => addFilter('date')}>
                  <Plus className="h-3 w-3 mr-1" />
                  Data
                </Button>
                <Button size="sm" variant="outline" onClick={() => addFilter('select')}>
                  <Plus className="h-3 w-3 mr-1" />
                  Seleção
                </Button>
                <Button size="sm" variant="outline" onClick={() => addFilter('range')}>
                  <Plus className="h-3 w-3 mr-1" />
                  Intervalo
                </Button>
                <Button size="sm" variant="outline" onClick={() => addFilter('text')}>
                  <Plus className="h-3 w-3 mr-1" />
                  Texto
                </Button>
              </div>
            </div>

            {/* Saved Filters */}
            {savedFilters.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Filtros Salvos</h4>
                <div className="flex flex-wrap gap-2">
                  {savedFilters.map((saved, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => loadSavedFilters(saved)}
                    >
                      {saved.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Button onClick={onApplyFilters} disabled={isLoading} className="flex-1 min-w-[120px]">
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Aplicar Filtros
          </Button>
          
          <Button variant="outline" onClick={saveCurrentFilters} disabled={activeFiltersCount === 0}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>

          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>
              <Download className="h-3 w-3 mr-1" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => onExport('excel')}>
              <Download className="h-3 w-3 mr-1" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => onExport('csv')}>
              <Download className="h-3 w-3 mr-1" />
              CSV
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};