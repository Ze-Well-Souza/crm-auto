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
      {/* Total Vehicles - Landing Page Style */}
      <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Car className="h-4 w-4 text-blue-400" />
            </div>
            Total de Veículos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{totalVehicles}</div>
          <p className="text-xs text-slate-400">Cadastrados no sistema</p>
        </CardContent>
      </Card>

      {/* Fuel Distribution - Landing Page Style */}
      <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Fuel className="h-4 w-4 text-emerald-400" />
            </div>
            Combustível
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(fuelTypes).slice(0, 3).map(([fuel, count]) => (
            <div key={fuel} className="flex justify-between items-center">
              <Badge className="text-xs bg-white/10 border-white/20 text-slate-300">{fuel}</Badge>
              <span className="text-sm font-medium text-white">{count}</span>
            </div>
          ))}
          {Object.keys(fuelTypes).length > 3 && (
            <div className="text-xs text-slate-400 text-center">
              +{Object.keys(fuelTypes).length - 3} outros
            </div>
          )}
        </CardContent>
      </Card>

      {/* Age Distribution - Landing Page Style */}
      <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Calendar className="h-4 w-4 text-orange-400" />
            </div>
            Distribuição por Idade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-0">Novos</Badge>
            <span className="text-sm font-medium text-white">{newVehicles}</span>
          </div>
          <div className="flex justify-between items-center">
            <Badge className="bg-blue-500/20 text-blue-300 border-0">Seminovos</Badge>
            <span className="text-sm font-medium text-white">{semiNewVehicles}</span>
          </div>
          <div className="flex justify-between items-center">
            <Badge className="bg-slate-500/20 text-slate-300 border-0">Usados</Badge>
            <span className="text-sm font-medium text-white">{oldVehicles}</span>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Status - Landing Page Style */}
      <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Settings className="h-4 w-4 text-purple-400" />
            </div>
            Status Manutenção
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-emerald-400" />
              <span className="text-xs text-slate-300">Em Dia</span>
            </div>
            <span className="text-sm font-medium text-white">{inDayMaintenance}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-orange-400" />
              <span className="text-xs text-slate-300">Próxima</span>
            </div>
            <span className="text-sm font-medium text-white">{dueMaintenance}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-red-400" />
              <span className="text-xs text-slate-300">Atrasada</span>
            </div>
            <span className="text-sm font-medium text-white">{overdueMaintenance}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};