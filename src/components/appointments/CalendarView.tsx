import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, Clock, User, Car } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/types";

interface CalendarViewProps {
  appointments: Appointment[];
  onDateSelect: (date: Date) => void;
  onAppointmentClick: (appointment: Appointment) => void;
  onNewAppointment: (date?: Date) => void;
}

export const CalendarView = ({ 
  appointments, 
  onDateSelect, 
  onAppointmentClick, 
  onNewAppointment 
}: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.scheduled_date), date)
    );
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'agendado':
        return 'bg-blue-500 text-white';
      case 'confirmado':
        return 'bg-green-500 text-white';
      case 'em_andamento':
        return 'bg-orange-500 text-white';
      case 'concluido':
        return 'bg-emerald-500 text-white';
      case 'cancelado':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'agendado': return 'Agendado';
      case 'confirmado': return 'Confirmado';
      case 'em_andamento': return 'Em Andamento';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return 'Pendente';
    }
  };

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gradient-primary">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={() => onNewAppointment()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 min-h-[600px]">
          {monthDays.map((day, index) => {
            const dayAppointments = getAppointmentsForDate(day);
            const isCurrentDay = isToday(day);
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "border-r border-b last:border-r-0 p-2 min-h-[120px] cursor-pointer hover:bg-accent/50 transition-smooth",
                  isCurrentDay && "bg-primary/5 border-primary/30"
                )}
                onClick={() => onDateSelect(day)}
              >
                {/* Day Number */}
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    "text-sm font-medium",
                    isCurrentDay && "text-primary font-bold"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {dayAppointments.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {dayAppointments.length}
                    </Badge>
                  )}
                </div>

                {/* Appointments */}
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map((appointment) => (
                    <div
                      key={appointment.id}
                      className={cn(
                        "text-xs p-1.5 rounded cursor-pointer hover:opacity-80 transition-smooth",
                        getStatusColor(appointment.status)
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAppointmentClick(appointment);
                      }}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">{appointment.scheduled_time}</span>
                      </div>
                      <div className="truncate font-medium">
                        {appointment.service_type}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <User className="h-3 w-3" />
                        <span className="truncate">{appointment.clients?.name}</span>
                      </div>
                    </div>
                  ))}
                  
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center py-1">
                      +{dayAppointments.length - 3} mais
                    </div>
                  )}
                </div>

                {/* Quick Add Button */}
                {dayAppointments.length === 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 h-8 text-xs opacity-0 group-hover:opacity-100 transition-smooth"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNewAppointment(day);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Agendar
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span>Agendado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span>Confirmado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span>Em Andamento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500"></div>
              <span>Concluído</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span>Cancelado</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};