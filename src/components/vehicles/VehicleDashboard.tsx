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
    if (score >= 80) return { label: 'Excelente', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30', bg: 'bg-emerald-500/10' };
    if (score >= 60) return { label: 'Bom', color: 'text-blue-400 bg-blue-500/20 border-blue-500/30', bg: 'bg-blue-500/10' };
    if (score >= 40) return { label: 'Regular', color: 'text-orange-400 bg-orange-500/20 border-orange-500/30', bg: 'bg-orange-500/10' };
    return { label: 'Crítico', color: 'text-red-400 bg-red-500/20 border-red-500/30', bg: 'bg-red-500/10' };
  };

  const getVehicleAge = () => {
    if (!vehicle.year) return 'N/A';
    const currentYear = new Date().getFullYear();
    return currentYear - vehicle.year;
  };

  const score = getMaintenanceScore(vehicleStats.maintenanceScore);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Car className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white">{vehicle.brand} {vehicle.model}</span>
                  <Badge variant="outline" className={score.color}>
                    {score.label}
                  </Badge>
                </div>
                <p className="text-sm text-slate-400 font-normal">
                  {vehicle.year} • {vehicle.license_plate} • {getVehicleAge()} anos
                </p>
              </div>
            </DialogTitle>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border-white/10">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-400"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger
              value="maintenance"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-400"
            >
              Manutenção
            </TabsTrigger>
            <TabsTrigger
              value="financial"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-400"
            >
              Financeiro
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-400"
            >
              Histórico
            </TabsTrigger>
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
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Especificações Técnicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-slate-400" />
                      <span className="font-medium text-purple-400">Marca/Modelo:</span>
                      <span className="text-white">{vehicle.brand} {vehicle.model}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="font-medium text-purple-400">Ano:</span>
                      <span className="text-white">{vehicle.year || 'N/A'}</span>
                    </div>

                    {vehicle.fuel_type && (
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-purple-400">Combustível:</span>
                        <Badge variant="outline" className="border-blue-500/30 text-blue-400">{vehicle.fuel_type}</Badge>
                      </div>
                    )}

                    {vehicle.engine && (
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-purple-400">Motor:</span>
                        <span className="text-white">{vehicle.engine}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {vehicle.license_plate && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-purple-400">Placa:</span>
                        <Badge variant="outline" className="border-blue-500/30 text-blue-400">{vehicle.license_plate}</Badge>
                      </div>
                    )}

                    {vehicle.vin && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-purple-400">Chassi:</span>
                        <span className="font-mono text-xs text-white">{vehicle.vin}</span>
                      </div>
                    )}

                    {vehicle.color && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-white/30"
                          style={{ backgroundColor: vehicle.color.toLowerCase() === 'branco' ? '#ffffff' :
                                   vehicle.color.toLowerCase() === 'preto' ? '#000000' :
                                   vehicle.color.toLowerCase() === 'prata' ? '#c0c0c0' :
                                   vehicle.color.toLowerCase() === 'prata' ? '#c0c0c0' : '#888888' }}
                        />
                        <span className="font-medium text-purple-400">Cor:</span>
                        <span className="text-white">{vehicle.color}</span>
                      </div>
                    )}

                    {vehicle.mileage && (
                      <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-purple-400">Quilometragem:</span>
                        <span className="text-white">{vehicle.mileage.toLocaleString('pt-BR')} km</span>
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
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5" />
                  Status de Manutenção
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-white/10 rounded-lg bg-white/5">
                    <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                    <div className="font-semibold text-white">Em Dia</div>
                    <p className="text-xs text-slate-400">Última revisão recente</p>
                  </div>

                  <div className="text-center p-4 border border-white/10 rounded-lg bg-white/5">
                    <Clock className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                    <div className="font-semibold text-white">{vehicleStats.nextMaintenance.toLocaleString('pt-BR')} km</div>
                    <p className="text-xs text-slate-400">Próxima manutenção</p>
                  </div>

                  <div className="text-center p-4 border border-white/10 rounded-lg bg-white/5">
                    <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="font-semibold text-white">{vehicleStats.maintenanceScore}%</div>
                    <p className="text-xs text-slate-400">Score de manutenção</p>
                  </div>
                </div>

                {/* Maintenance Alerts */}
                <div className="space-y-3">
                  <h4 className="font-medium text-white">Alertas e Lembretes</h4>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-400" />
                        <div>
                          <p className="text-sm font-medium text-white">Revisão dos 60.000 km</p>
                          <p className="text-xs text-slate-400">Vence em 2.500 km</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                        Agendar
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-400" />
                        <div>
                          <p className="text-sm font-medium text-white">IPVA 2025</p>
                          <p className="text-xs text-slate-400">Vence em 45 dias</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
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
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Custos Acumulados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-400">Manutenção:</span>
                      <span className="font-semibold text-white">{formatCurrency(vehicleStats.totalSpent * 0.7)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-400">Peças:</span>
                      <span className="font-semibold text-white">{formatCurrency(vehicleStats.totalSpent * 0.3)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <span className="font-medium text-purple-400">Total Gasto:</span>
                      <span className="text-lg font-bold text-white">
                        {formatCurrency(vehicleStats.totalSpent)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Valor de Mercado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-400">Valor FIPE:</span>
                      <span className="font-semibold text-white">{formatCurrency(vehicleStats.marketValue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-400">Depreciação/ano:</span>
                      <span className="font-semibold text-red-400">
                        -{vehicleStats.depreciationRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-400">Consumo médio:</span>
                      <span className="font-semibold text-emerald-400">
                        {vehicleStats.fuelEfficiency.toFixed(1)} km/l
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cost Analysis */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Análise de Custos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(vehicleStats.avgServiceCost)}
                      </div>
                      <p className="text-sm text-purple-400">Custo médio por serviço</p>
                    </div>

                    <div className="text-center p-4 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">
                        {(vehicleStats.totalSpent / (vehicle.mileage || 1) * 1000).toFixed(2)}
                      </div>
                      <p className="text-sm text-purple-400">R$ por 1.000 km</p>
                    </div>

                    <div className="text-center p-4 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-2xl font-bold text-orange-400">
                        {((vehicleStats.totalSpent / vehicleStats.marketValue) * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-purple-400">% do valor do veículo</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Histórico de Manutenção</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-400 text-center py-8">
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