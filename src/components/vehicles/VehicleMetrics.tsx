import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Car, Fuel, Calendar, Gauge, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, TrendingUp, DollarSign, Settings } from "lucide-react";
import type { Vehicle } from "@/types";

interface VehicleMetricsProps {
  vehicles: Vehicle[];
}

export const VehicleMetrics = ({ vehicles }: VehicleMetricsProps) => {
  const totalVehicles = vehicles.length;
  
  // Fuel type distribution
  const fuelTypes = vehicles.reduce((acc, v) => {
    const fuel = v.fuel_type || 'Não informado';
    acc[fuel] = (acc[fuel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Age distribution
  const currentYear = new Date().getFullYear();
  const newVehicles = vehicles.filter(v => v.year && (currentYear - v.year) <= 3).length;
  const semiNewVehicles = vehicles.filter(v => v.year && (currentYear - v.year) > 3 && (currentYear - v.year) <= 7).length;
  const oldVehicles = vehicles.filter(v => v.year && (currentYear - v.year) > 7).length;

  // Mileage distribution
  const lowMileage = vehicles.filter(v => v.mileage && v.mileage <= 50000).length;
  const mediumMileage = vehicles.filter(v => v.mileage && v.mileage > 50000 && v.mileage <= 100000).length;
  const highMileage = vehicles.filter(v => v.mileage && v.mileage > 100000).length;

  // Mock maintenance status
  const inDayMaintenance = Math.floor(totalVehicles * 0.6);
  const dueMaintenance = Math.floor(totalVehicles * 0.25);
  const overdueMaintenance = totalVehicles - inDayMaintenance - dueMaintenance;

  // Data completeness
  const withMileage = vehicles.filter(v => v.mileage).length;
  const withEngine = vehicles.filter(v => v.engine).length;
  const withColor = vehicles.filter(v => v.color).length;

  const mileagePercentage = totalVehicles > 0 ? (withMileage / totalVehicles) * 100 : 0;
  const enginePercentage = totalVehicles > 0 ? (withEngine / totalVehicles) * 100 : 0;
  const colorPercentage = totalVehicles > 0 ? (withColor / totalVehicles) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Vehicles */}
      <Card className="gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Car className="h-4 w-4 text-primary" />
            Total de Veículos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVehicles}</div>
          <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
        </CardContent>
      </Card>

      {/* Fuel Distribution */}
      <Card className="gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Fuel className="h-4 w-4 text-success" />
            Combustível
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(fuelTypes).slice(0, 3).map(([fuel, count]) => (
            <div key={fuel} className="flex justify-between items-center">
              <Badge variant="outline" className="text-xs">{fuel}</Badge>
              <span className="text-sm font-medium">{count}</span>
            </div>
          ))}
          {Object.keys(fuelTypes).length > 3 && (
            <div className="text-xs text-muted-foreground text-center">
              +{Object.keys(fuelTypes).length - 3} outros
            </div>
          )}
        </CardContent>
      </Card>

      {/* Age Distribution */}
      <Card className="gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-warning" />
            Distribuição por Idade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <Badge variant="default" className="text-green-600">Novos</Badge>
            <span className="text-sm font-medium">{newVehicles}</span>
          </div>
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="text-blue-600">Seminovos</Badge>
            <span className="text-sm font-medium">{semiNewVehicles}</span>
          </div>
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="text-gray-600">Usados</Badge>
            <span className="text-sm font-medium">{oldVehicles}</span>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Status */}
      <Card className="gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Settings className="h-4 w-4 text-info" />
            Status Manutenção
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-success" />
              <span className="text-xs">Em Dia</span>
            </div>
            <span className="text-sm font-medium">{inDayMaintenance}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-warning" />
              <span className="text-xs">Próxima</span>
            </div>
            <span className="text-sm font-medium">{dueMaintenance}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-destructive" />
              <span className="text-xs">Atrasada</span>
            </div>
            <span className="text-sm font-medium">{overdueMaintenance}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};