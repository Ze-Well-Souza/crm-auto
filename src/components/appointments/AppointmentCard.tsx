import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, User, Car, Phone, Mail, DollarSign, MapPin, MessageCircle, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, CirclePlay as PlayCircle, Circle as XCircle, CreditCard as Edit, Eye, TrendingUp } from "lucide-react";
import { AppointmentActions } from "./AppointmentActions";
import { AppointmentDashboard } from "./AppointmentDashboard";
import { AppointmentQuickActions } from "./AppointmentQuickActions";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { StatusBadge } from "@/components/common/StatusBadge";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/types";

interface AppointmentCardProps {
  appointment: Appointment;
  onUpdate: () => void;
  onQuickAction?: (action: string, appointment: Appointment) => void;
}

export const AppointmentCard = ({ appointment, onUpdate, onQuickAction }: AppointmentCardProps) => {
  const [showDashboard, setShowDashboard] = useState(false);
  
  // Mock data for demonstration
  const appointmentMetrics = {
    profitability: Math.random() * 40 + 20, // 20-60%
    complexity: Math.random() > 0.7 ? 'alta' : Math.random() > 0.4 ? 'media' : 'baixa',
    customerSatisfaction: Math.floor(Math.random() * 30) + 70, // 70-100%
    estimatedDuration: appointment.estimated_duration || 60,
    actualDuration: Math.floor(Math.random() * 120) + 30,
    onTimeCompletion: Math.random() > 0.2,
    rescheduledCount: Math.floor(Math.random() * 3),
    priority: Math.random() > 0.8 ? 'alta' : Math.random() > 0.5 ? 'media' : 'baixa'
  };

  const getStatusConfig = (status: string | null) => {
    switch (status) {
      case 'agendado':
        return { 
          variant: 'secondary' as const, 
          label: 'Agendado', 
          icon: Clock,
          color: 'text-warning',
          bgColor: 'from-yellow-400/10 to-orange-500/5'
        };
      case 'confirmado':
        return { 
          variant: 'default' as const, 
          label: 'Confirmado', 
          icon: CheckCircle,
          color: 'text-primary',
          bgColor: 'from-blue-400/10 to-cyan-500/5'
        };
      case 'em_andamento':
        return { 
          variant: 'secondary' as const, 
          label: 'Em Andamento', 
          icon: PlayCircle,
          color: 'text-info',
          bgColor: 'from-blue-400/10 to-cyan-500/5'
        };
      case 'concluido':
        return { 
          variant: 'default' as const, 
          label: 'Concluído', 
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'from-green-400/10 to-emerald-500/5'
        };
      case 'cancelado':
        return { 
          variant: 'destructive' as const, 
          label: 'Cancelado', 
          icon: XCircle,
          color: 'text-destructive',
          bgColor: 'from-red-400/10 to-red-500/5'
        };
      default:
        return { 
          variant: 'outline' as const, 
          label: 'Pendente', 
          icon: AlertTriangle,
          color: 'text-muted-foreground',
          bgColor: 'from-gray-400/10 to-gray-500/5'
        };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'text-destructive';
      case 'media': return 'text-warning';
      case 'baixa': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'alta': return 'text-destructive';
      case 'media': return 'text-warning';
      case 'baixa': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getAppointmentIcon = () => {
    return appointment.service_type?.charAt(0)?.toUpperCase() || 'A';
  };

  const statusConfig = getStatusConfig(appointment.status);
  const StatusIcon = statusConfig.icon;

  const handleQuickAction = (action: string) => {
    onQuickAction?.(action, appointment);
  };

  const handleCardClick = () => {
    setShowDashboard(true);
  };

  const isOverdue = () => {
    const appointmentDate = new Date(`${appointment.scheduled_date}T${appointment.scheduled_time}`);
    return appointmentDate < new Date() && appointment.status !== 'concluido' && appointment.status !== 'cancelado';
  };

  const getTimeUntilAppointment = () => {
    const appointmentDate = new Date(`${appointment.scheduled_date}T${appointment.scheduled_time}`);
    const now = new Date();
    const diffMs = appointmentDate.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 0) return 'Atrasado';
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.ceil(diffHours / 24);
    return `${diffDays}d`;
  };

  return (
    <>
      <Card 
        className="bg-white dark:bg-card border border-slate-200 dark:border-border shadow-sm hover:shadow-md dark:hover:shadow-elevated transition-all cursor-pointer group relative overflow-hidden"
        onClick={handleCardClick}
      >
        {/* Background gradient based on status */}
        <div className={cn(
          "absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10 bg-gradient-to-br",
          statusConfig.bgColor
        )} />

        {/* Priority indicator */}
        {appointmentMetrics.priority === 'alta' && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-destructive rounded-full animate-pulse z-10" />
        )}

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getAppointmentIcon()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {formatDate(appointment.scheduled_date)} - {appointment.scheduled_time}
                  <Badge variant={statusConfig.variant} className="flex items-center gap-1">
                    <StatusIcon className={cn("h-3 w-3", statusConfig.color)} />
                    {statusConfig.label}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  {appointment.service_type}
                  {appointment.clients?.name && (
                    <>
                      <span>•</span>
                      <span>{appointment.clients.name}</span>
                    </>
                  )}
                </CardDescription>
              </div>
            </div>
            <AppointmentActions appointment={appointment} onUpdate={onUpdate} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          {/* Client Information */}
          {appointment.clients && (
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{appointment.clients.name}</span>
                </div>
                <div className="flex gap-1">
                  {appointment.clients.phone && (
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Phone className="h-3 w-3" />
                    </Button>
                  )}
                  {appointment.clients.email && (
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Mail className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Information */}
          {appointment.vehicles && (
            <div className="flex items-center gap-2 text-sm">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.vehicles.brand} {appointment.vehicles.model}</span>
              {appointment.vehicles.license_plate && (
                <Badge variant="outline" className="text-xs">
                  {appointment.vehicles.license_plate}
                </Badge>
              )}
            </div>
          )}

          {/* Service Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Clock className="h-3 w-3 text-info" />
                <span className="text-sm font-semibold">
                  {appointment.estimated_duration || 60} min
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Duração</p>
            </div>
            
            {appointment.estimated_value && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <DollarSign className="h-3 w-3 text-success" />
                  <span className="text-sm font-semibold text-success">
                    {formatCurrency(appointment.estimated_value)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Valor</p>
              </div>
            )}
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t text-xs">
            <div className="text-center">
              <div className={cn("font-semibold", getPriorityColor(appointmentMetrics.priority))}>
                {appointmentMetrics.priority.toUpperCase()}
              </div>
              <p className="text-muted-foreground">Prioridade</p>
            </div>
            
            <div className="text-center">
              <div className={cn("font-semibold", getComplexityColor(appointmentMetrics.complexity))}>
                {appointmentMetrics.complexity.toUpperCase()}
              </div>
              <p className="text-muted-foreground">Complexidade</p>
            </div>
            
            <div className="text-center">
              <div className="font-semibold text-info">
                {getTimeUntilAppointment()}
              </div>
              <p className="text-muted-foreground">Tempo</p>
            </div>
          </div>

          {/* Overdue Alert */}
          {isOverdue() && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">Agendamento Atrasado</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Cliente deve ser contatado
              </p>
            </div>
          )}

          {/* Service Description */}
          {appointment.service_description && (
            <div className="bg-muted/30 p-2 rounded-md">
              <p className="text-xs text-muted-foreground line-clamp-2">
                {appointment.service_description}
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <AppointmentQuickActions 
              appointment={appointment}
              onStatusChange={() => handleQuickAction('status-change')}
              onContactClient={() => handleQuickAction('contact')}
              onReschedule={() => handleQuickAction('reschedule')}
            />
          </div>

          {/* Creation Info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Criado em {formatDate(appointment.created_at)}</span>
            </div>
            {appointmentMetrics.rescheduledCount > 0 && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>{appointmentMetrics.rescheduledCount} reagendamentos</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Appointment Dashboard Modal */}
      <AppointmentDashboard
        appointment={appointment}
        open={showDashboard}
        onOpenChange={setShowDashboard}
      />
    </>
  );
};