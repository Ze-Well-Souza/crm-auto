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
        className="hover:shadow-elevated transition-smooth cursor-pointer group relative overflow-hidden"
        onClick={handleCardClick}
      >
        {/* Background gradient based on maintenance status */}
        <div className={cn(
          "absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10",
          vehicleMetrics.maintenanceStatus === 'atrasado' && "bg-gradient-to-br from-red-400 to-red-500",
          vehicleMetrics.maintenanceStatus === 'atencao' && "bg-gradient-to-br from-yellow-400 to-orange-500",
          vehicleMetrics.maintenanceStatus === 'em_dia' && "bg-gradient-to-br from-green-400 to-emerald-500"
        )} />

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getVehicleIcon()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {vehicle.brand} {vehicle.model}
                  <Badge variant={maintenanceStatus.variant} className="flex items-center gap-1">
                    <MaintenanceIcon className={cn("h-3 w-3", maintenanceStatus.color)} />
                    {maintenanceStatus.label}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  {vehicle.year && <span>{vehicle.year}</span>}
                  {vehicle.license_plate && (
                    <>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">
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
          {/* Owner Information */}
          {vehicle.clients && (
            <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-md">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{vehicle.clients.name}</span>
              {vehicle.clients.email && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
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

          {/* Vehicle Specifications */}
          <div className="grid grid-cols-2 gap-3">
            {vehicle.fuel_type && (
              <div className="flex items-center gap-2 text-sm">
                <Fuel className="h-4 w-4 text-muted-foreground" />
                <span>{vehicle.fuel_type}</span>
              </div>
            )}
            
            {vehicle.engine && (
              <div className="flex items-center gap-2 text-sm">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>{vehicle.engine}</span>
              </div>
            )}
            
            {vehicle.color && (
              <div className="flex items-center gap-2 text-sm">
                <div 
                  className="w-4 h-4 rounded-full border border-muted-foreground/30"
                  style={{ backgroundColor: vehicle.color.toLowerCase() === 'branco' ? '#ffffff' : 
                           vehicle.color.toLowerCase() === 'preto' ? '#000000' :
                           vehicle.color.toLowerCase() === 'prata' ? '#c0c0c0' :
                           vehicle.color.toLowerCase() === 'azul' ? '#0066cc' :
                           vehicle.color.toLowerCase() === 'vermelho' ? '#cc0000' : '#888888' }}
                />
                <span>{vehicle.color}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{getVehicleAge()}</span>
            </div>
          </div>

          {/* Mileage and Value */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Gauge className="h-3 w-3 text-info" />
                <span className="text-xs font-semibold">
                  {vehicle.mileage ? `${vehicle.mileage.toLocaleString('pt-BR')} km` : 'N/A'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Quilometragem</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <DollarSign className="h-3 w-3 text-success" />
                <span className="text-xs font-semibold text-success">
                  {formatCurrency(vehicleMetrics.totalSpent)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Total gasto</p>
            </div>
          </div>

          {/* Service Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Wrench className="h-3 w-3 text-primary" />
                <span className="text-xs font-semibold">
                  {vehicleMetrics.totalServices} serviços
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Total realizados</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3 text-warning" />
                <span className="text-xs font-semibold">
                  {formatCurrency(vehicleMetrics.totalSpent)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Gasto total</p>
            </div>
          </div>

          {/* Maintenance Alert */}
          {vehicleMetrics.maintenanceStatus === 'atrasado' && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">Manutenção Atrasada</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Última revisão há mais de 4 meses
              </p>
            </div>
          )}

          {/* Next Maintenance */}
          {vehicleMetrics.maintenanceStatus !== 'atrasado' && vehicleMetrics.estimatedNextMileage && (
            <div className="bg-info/10 border border-info/20 rounded-md p-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-info" />
                <span className="text-sm font-medium text-info">Próxima Manutenção</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
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

          {/* Last Service */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
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
            <div className="mt-3 p-2 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground line-clamp-2">
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