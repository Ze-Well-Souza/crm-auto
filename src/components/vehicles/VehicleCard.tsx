import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Car, Fuel, Calendar, Gauge, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, DollarSign, Wrench, FileText, Phone, User, MapPin, TrendingUp, Settings } from "lucide-react";
import { VehicleActions } from "./VehicleActions";
import { VehicleDashboard } from "./VehicleDashboard";
import { VehicleQuickActions } from "./VehicleQuickActions";
import { useVehicleMetrics } from "@/hooks/useVehicleMetrics";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types";

interface VehicleCardProps {
  vehicle: Vehicle;
  onUpdate: () => void;
  onQuickAction?: (action: string, vehicle: Vehicle) => void;
}

export const VehicleCard = ({ vehicle, onUpdate, onQuickAction }: VehicleCardProps) => {
  const [showDashboard, setShowDashboard] = useState(false);
  const { metrics, loading: metricsLoading } = useVehicleMetrics(vehicle.id);
  
  // Usar métricas reais ou valores padrão durante carregamento
  const vehicleMetrics = metrics || {
    totalSpent: 0,
    totalServices: 0,
    lastService: null,
    nextService: null,
    maintenanceStatus: 'em_dia' as const,
    estimatedNextMileage: null,
    averageServiceCost: 0
  };

  const getMaintenanceStatus = (status: 'em_dia' | 'atencao' | 'atrasado') => {
    switch (status) {
      case 'atrasado':
        return { 
          label: 'Atrasada', 
          variant: 'destructive' as const, 
          icon: AlertTriangle,
          color: 'text-destructive'
        };
      case 'atencao':
        return { 
          label: 'Atenção', 
          variant: 'secondary' as const,
          icon: Clock,
          color: 'text-warning'
        };
      case 'em_dia':
        return { 
          label: 'Em Dia', 
          variant: 'default' as const, 
          icon: CheckCircle,
          color: 'text-success'
        };
      default:
        return { 
          label: 'Indefinido', 
          variant: 'outline' as const, 
          icon: AlertTriangle,
          color: 'text-muted-foreground'
        };
    }
  };

  const getVehicleAge = () => {
    if (!vehicle.year) return 'N/A';
    const currentYear = new Date().getFullYear();
    const age = currentYear - vehicle.year;
    return `${age} anos`;
  };

  const getVehicleIcon = () => {
    return vehicle.brand?.charAt(0)?.toUpperCase() || 'V';
  };

  const maintenanceStatus = getMaintenanceStatus(vehicleMetrics.maintenanceStatus);
  const MaintenanceIcon = maintenanceStatus.icon;

  const handleQuickAction = (action: string) => {
    onQuickAction?.(action, vehicle);
  };

  const handleCardClick = () => {
    setShowDashboard(true);
  };

  return (
    <>
      <Card
        className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer group relative overflow-hidden"
        onClick={handleCardClick}
      >
        {/* Background gradient based on maintenance status - Landing Page Style */}
        <div className={cn(
          "absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10",
          vehicleMetrics.maintenanceStatus === 'atrasado' && "bg-gradient-to-br from-red-400 to-red-500",
          vehicleMetrics.maintenanceStatus === 'atencao' && "bg-gradient-to-br from-orange-400 to-orange-500",
          vehicleMetrics.maintenanceStatus === 'em_dia' && "bg-gradient-to-br from-emerald-400 to-emerald-500"
        )} />

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-purple-500/30">
                <AvatarFallback className="bg-purple-500/20 text-purple-300 font-semibold">
                  {getVehicleIcon()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  {vehicle.brand} {vehicle.model}
                  <Badge className={cn(
                    "flex items-center gap-1 border-0",
                    vehicleMetrics.maintenanceStatus === 'atrasado' && "bg-red-500/20 text-red-300",
                    vehicleMetrics.maintenanceStatus === 'atencao' && "bg-orange-500/20 text-orange-300",
                    vehicleMetrics.maintenanceStatus === 'em_dia' && "bg-emerald-500/20 text-emerald-300"
                  )}>
                    <MaintenanceIcon className="h-3 w-3" />
                    {maintenanceStatus.label}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-slate-400">
                  {vehicle.year && <span>{vehicle.year}</span>}
                  {vehicle.license_plate && (
                    <>
                      <span>•</span>
                      <Badge className="text-xs bg-blue-500/20 text-blue-300 border-0">
                        {vehicle.license_plate}
                      </Badge>
                    </>
                  )}
                </CardDescription>
              </div>
            </div>
            <VehicleActions vehicle={vehicle} onUpdate={onUpdate} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          {/* Owner Information - Landing Page Style */}
          {vehicle.clients && (
            <div className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 p-2 rounded-md backdrop-blur-sm">
              <User className="h-4 w-4 text-slate-400" />
              <span className="font-medium text-slate-300">{vehicle.clients.name}</span>
              {vehicle.clients.email && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickAction('contact-owner');
                  }}
                >
                  <Phone className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}

          {/* Vehicle Specifications - Landing Page Style */}
          <div className="grid grid-cols-2 gap-3">
            {vehicle.fuel_type && (
              <div className="flex items-center gap-2 text-sm">
                <Fuel className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">{vehicle.fuel_type}</span>
              </div>
            )}

            {vehicle.engine && (
              <div className="flex items-center gap-2 text-sm">
                <Settings className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">{vehicle.engine}</span>
              </div>
            )}

            {vehicle.color && (
              <div className="flex items-center gap-2 text-sm">
                <div
                  className="w-4 h-4 rounded-full border border-white/30"
                  style={{ backgroundColor: vehicle.color.toLowerCase() === 'branco' ? '#ffffff' :
                           vehicle.color.toLowerCase() === 'preto' ? '#000000' :
                           vehicle.color.toLowerCase() === 'prata' ? '#c0c0c0' :
                           vehicle.color.toLowerCase() === 'azul' ? '#0066cc' :
                           vehicle.color.toLowerCase() === 'vermelho' ? '#cc0000' : '#888888' }}
                />
                <span className="text-slate-300">{vehicle.color}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-slate-300">{getVehicleAge()}</span>
            </div>
          </div>

          {/* Mileage and Value - Landing Page Style */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Gauge className="h-3 w-3 text-blue-400" />
                <span className="text-xs font-semibold text-white">
                  {vehicle.mileage ? `${vehicle.mileage.toLocaleString('pt-BR')} km` : 'N/A'}
                </span>
              </div>
              <p className="text-xs text-slate-400">Quilometragem</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <DollarSign className="h-3 w-3 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">
                  {formatCurrency(vehicleMetrics.totalSpent)}
                </span>
              </div>
              <p className="text-xs text-slate-400">Total gasto</p>
            </div>
          </div>

          {/* Service Metrics - Landing Page Style */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Wrench className="h-3 w-3 text-purple-400" />
                <span className="text-xs font-semibold text-white">
                  {vehicleMetrics.totalServices} serviços
                </span>
              </div>
              <p className="text-xs text-slate-400">Total realizados</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3 text-cyan-400" />
                <span className="text-xs font-semibold text-white">
                  {formatCurrency(vehicleMetrics.averageServiceCost)}
                </span>
              </div>
              <p className="text-xs text-slate-400">Custo médio</p>
            </div>
          </div>

          {/* Maintenance Alert - Landing Page Style */}
          {vehicleMetrics.maintenanceStatus === 'atrasado' && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="text-sm font-medium text-red-300">Manutenção Atrasada</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Última revisão há mais de 4 meses
              </p>
            </div>
          )}

          {/* Next Maintenance - Landing Page Style */}
          {vehicleMetrics.maintenanceStatus !== 'atrasado' && vehicleMetrics.estimatedNextMileage && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-md p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">Próxima Manutenção</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Em {vehicleMetrics.estimatedNextMileage.toLocaleString('pt-BR')} km
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <VehicleQuickActions
              vehicle={vehicle}
              onScheduleService={() => handleQuickAction('schedule')}
              onCreateServiceOrder={() => handleQuickAction('service')}
              onViewHistory={() => handleQuickAction('history')}
            />
          </div>

          {/* Last Service - Landing Page Style */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Último serviço: {vehicleMetrics.lastService ? formatDate(vehicleMetrics.lastService) : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>OS #{vehicleMetrics.totalServices.toString().padStart(3, '0')}</span>
            </div>
          </div>

          {vehicle.notes && (
            <div className="mt-3 p-2 bg-white/5 border border-white/10 rounded-md backdrop-blur-sm">
              <p className="text-xs text-slate-400 line-clamp-2">
                {vehicle.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vehicle Dashboard Modal */}
      <VehicleDashboard
        vehicle={vehicle}
        open={showDashboard}
        onOpenChange={setShowDashboard}
      />
    </>
  );
};