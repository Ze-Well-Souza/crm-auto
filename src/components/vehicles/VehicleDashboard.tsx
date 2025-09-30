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
import { Car, Fuel, Calendar, Gauge, DollarSign, Wrench, FileText, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, TrendingUp, Settings, User, Phone, Mail } from "lucide-react";
import { VehicleTimeline } from "./VehicleTimeline";
import { VehicleQuickActions } from "./VehicleQuickActions";
import { formatDate, formatCurrency } from "@/utils/formatters";
import type { Vehicle } from "@/types";

interface VehicleDashboardProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VehicleDashboard = ({ vehicle, open, onOpenChange }: VehicleDashboardProps) => {
  if (!vehicle) return null;

  // Mock metrics for demonstration
  const vehicleStats = {
    totalSpent: Math.random() * 5000 + 500,
    serviceCount: Math.floor(Math.random() * 20) + 2,
    avgServiceCost: 0,
    lastService: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    nextMaintenance: Math.floor(Math.random() * 15000) + 5000,
    marketValue: Math.random() * 60000 + 15000,
    depreciationRate: Math.random() * 15 + 5,
    fuelEfficiency: Math.random() * 5 + 8,
    maintenanceScore: Math.floor(Math.random() * 100) + 1
  };

  vehicleStats.avgServiceCost = vehicleStats.totalSpent / vehicleStats.serviceCount;

  const getMaintenanceScore = (score: number) => {
    if (score >= 80) return { label: 'Excelente', color: 'text-success', bg: 'bg-success/10' };
    if (score >= 60) return { label: 'Bom', color: 'text-info', bg: 'bg-info/10' };
    if (score >= 40) return { label: 'Regular', color: 'text-warning', bg: 'bg-warning/10' };
    return { label: 'Crítico', color: 'text-destructive', bg: 'bg-destructive/10' };
  };

  const getVehicleAge = () => {
    if (!vehicle.year) return 'N/A';
    const currentYear = new Date().getFullYear();
    return currentYear - vehicle.year;
  };

  const score = getMaintenanceScore(vehicleStats.maintenanceScore);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span>{vehicle.brand} {vehicle.model}</span>
                  <Badge variant="outline" className={score.color}>
                    {score.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground font-normal">
                  {vehicle.year} • {vehicle.license_plate} • {getVehicleAge()} anos
                </p>
              </div>
            </DialogTitle>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="timeline">Histórico</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="pt-4">
                  <DollarSign className="h-6 w-6 text-success mx-auto mb-2" />
                  <div className="text-lg font-bold text-success">
                    {formatCurrency(vehicleStats.totalSpent)}
                  </div>
                  <p className="text-xs text-muted-foreground">Gasto Total</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-4">
                  <Wrench className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-lg font-bold">{vehicleStats.serviceCount}</div>
                  <p className="text-xs text-muted-foreground">Serviços</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-4">
                  <TrendingUp className="h-6 w-6 text-info mx-auto mb-2" />
                  <div className="text-lg font-bold">
                    {formatCurrency(vehicleStats.avgServiceCost)}
                  </div>
                  <p className="text-xs text-muted-foreground">Custo Médio</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-4">
                  <Car className="h-6 w-6 text-warning mx-auto mb-2" />
                  <div className="text-lg font-bold">
                    {formatCurrency(vehicleStats.marketValue)}
                  </div>
                  <p className="text-xs text-muted-foreground">Valor FIPE</p>
                </CardContent>
              </Card>
            </div>

            {/* Vehicle Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Especificações Técnicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Marca/Modelo:</span>
                      <span>{vehicle.brand} {vehicle.model}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Ano:</span>
                      <span>{vehicle.year || 'N/A'}</span>
                    </div>
                    
                    {vehicle.fuel_type && (
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Combustível:</span>
                        <Badge variant="outline">{vehicle.fuel_type}</Badge>
                      </div>
                    )}
                    
                    {vehicle.engine && (
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Motor:</span>
                        <span>{vehicle.engine}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {vehicle.license_plate && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Placa:</span>
                        <Badge variant="outline">{vehicle.license_plate}</Badge>
                      </div>
                    )}
                    
                    {vehicle.vin && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Chassi:</span>
                        <span className="font-mono text-xs">{vehicle.vin}</span>
                      </div>
                    )}
                    
                    {vehicle.color && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full border border-muted-foreground/30"
                          style={{ backgroundColor: vehicle.color.toLowerCase() === 'branco' ? '#ffffff' : 
                                   vehicle.color.toLowerCase() === 'preto' ? '#000000' :
                                   vehicle.color.toLowerCase() === 'prata' ? '#c0c0c0' : '#888888' }}
                        />
                        <span className="font-medium">Cor:</span>
                        <span>{vehicle.color}</span>
                      </div>
                    )}
                    
                    {vehicle.mileage && (
                      <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Quilometragem:</span>
                        <span>{vehicle.mileage.toLocaleString('pt-BR')} km</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t">
                  <VehicleQuickActions vehicle={vehicle} />
                </div>
              </CardContent>
            </Card>

            {/* Owner Information */}
            {vehicle.clients && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações do Proprietário</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{vehicle.clients.name}</span>
                  </div>
                  
                  {vehicle.clients.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{vehicle.clients.email}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Status de Manutenção
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                    <div className="font-semibold">Em Dia</div>
                    <p className="text-xs text-muted-foreground">Última revisão recente</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <Clock className="h-8 w-8 text-warning mx-auto mb-2" />
                    <div className="font-semibold">{vehicleStats.nextMaintenance.toLocaleString('pt-BR')} km</div>
                    <p className="text-xs text-muted-foreground">Próxima manutenção</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="h-8 w-8 text-info mx-auto mb-2" />
                    <div className="font-semibold">{vehicleStats.maintenanceScore}%</div>
                    <p className="text-xs text-muted-foreground">Score de manutenção</p>
                  </div>
                </div>

                {/* Maintenance Alerts */}
                <div className="space-y-3">
                  <h4 className="font-medium">Alertas e Lembretes</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <div>
                          <p className="text-sm font-medium">Revisão dos 60.000 km</p>
                          <p className="text-xs text-muted-foreground">Vence em 2.500 km</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Agendar
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-info/10 border border-info/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-info" />
                        <div>
                          <p className="text-sm font-medium">IPVA 2025</p>
                          <p className="text-xs text-muted-foreground">Vence em 45 dias</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Lembrar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Custos Acumulados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Manutenção:</span>
                      <span className="font-semibold">{formatCurrency(vehicleStats.totalSpent * 0.7)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Peças:</span>
                      <span className="font-semibold">{formatCurrency(vehicleStats.totalSpent * 0.3)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-medium">Total Gasto:</span>
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(vehicleStats.totalSpent)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Valor de Mercado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Valor FIPE:</span>
                      <span className="font-semibold">{formatCurrency(vehicleStats.marketValue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Depreciação/ano:</span>
                      <span className="font-semibold text-destructive">
                        -{vehicleStats.depreciationRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Consumo médio:</span>
                      <span className="font-semibold text-success">
                        {vehicleStats.fuelEfficiency.toFixed(1)} km/l
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cost Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Análise de Custos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(vehicleStats.avgServiceCost)}
                      </div>
                      <p className="text-sm text-muted-foreground">Custo médio por serviço</p>
                    </div>
                    
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-info">
                        {(vehicleStats.totalSpent / (vehicle.mileage || 1) * 1000).toFixed(2)}
                      </div>
                      <p className="text-sm text-muted-foreground">R$ por 1.000 km</p>
                    </div>
                    
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-warning">
                        {((vehicleStats.totalSpent / vehicleStats.marketValue) * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-muted-foreground">% do valor do veículo</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Manutenção</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Histórico detalhado de manutenção será implementado aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <VehicleTimeline vehicleId={vehicle.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};