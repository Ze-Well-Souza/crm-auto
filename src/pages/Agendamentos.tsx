import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Clock, CheckCircle, List, CalendarDays } from "lucide-react";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { CalendarView } from "@/components/appointments/CalendarView";
import { AppointmentDetails } from "@/components/appointments/AppointmentDetails";
import { QuickAppointmentForm } from "@/components/appointments/QuickAppointmentForm";
import { useAppointmentsNew } from "@/hooks/useAppointmentsNew";
import { SearchInput } from "@/components/common/SearchInput";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate, formatCurrency } from "@/utils/formatters";
import type { Appointment } from "@/types";

const Agendamentos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");
  
  const { appointments, loading, error, refetch } = useAppointmentsNew();

  const filteredAppointments = appointments?.filter(appointment => 
    appointment.service_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.service_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowQuickForm(true);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetails(true);
  };

  const handleNewAppointment = (date?: Date) => {
    if (date) {
      setSelectedDate(date);
      setShowQuickForm(true);
    } else {
      setShowForm(true);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-destructive">Erro ao carregar agendamentos: {error}</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const totalAppointments = appointments?.length || 0;
  const pendingAppointments = appointments?.filter(a => a.status === 'agendado').length || 0;
  const confirmedAppointments = appointments?.filter(a => a.status === 'confirmado').length || 0;
  const completedAppointments = appointments?.filter(a => a.status === 'concluido').length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Agendamentos</h1>
            <p className="text-muted-foreground">Gerencie a agenda de serviços com visualização interativa</p>
          </div>
          
          <Button className="shadow-primary" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAppointments}</div>
              <p className="text-xs text-muted-foreground">Agendamentos</p>
            </CardContent>
          </Card>
          
          <Card className="gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning" />
                Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAppointments}</div>
              <p className="text-xs text-muted-foreground">Aguardando confirmação</p>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Confirmados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmedAppointments}</div>
              <p className="text-xs text-muted-foreground">Confirmados</p>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-info" />
                Concluídos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAppointments}</div>
              <p className="text-xs text-muted-foreground">Finalizados</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Calendar and List View */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Agenda Visual
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Lista
            </TabsTrigger>
          </TabsList>

          {/* Calendar View */}
          <TabsContent value="calendar" className="space-y-4">
            <CalendarView
              appointments={appointments || []}
              onDateSelect={handleDateSelect}
              onAppointmentClick={handleAppointmentClick}
              onNewAppointment={handleNewAppointment}
            />
          </TabsContent>

          {/* List View */}
          <TabsContent value="list" className="space-y-4">
            {/* Search */}
            <SearchInput
              placeholder="Buscar agendamentos por tipo de serviço, descrição ou cliente..."
              value={searchTerm}
              onChange={setSearchTerm}
            />

            {/* Appointments List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <Card 
                    key={appointment.id} 
                    className="hover:shadow-elevated transition-smooth cursor-pointer"
                    onClick={() => handleAppointmentClick(appointment)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {formatDate(appointment.scheduled_date)} - {appointment.scheduled_time}
                        </CardTitle>
                        <StatusBadge status={appointment.status} type="appointment" />
                      </div>
                      <CardDescription>
                        {appointment.service_type} • {appointment.clients?.name || 'N/A'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {appointment.estimated_value && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Valor:</span>
                          <span className="font-semibold">
                            {formatCurrency(appointment.estimated_value)}
                          </span>
                        </div>
                      )}
                      
                      {appointment.estimated_duration && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Duração:</span>
                          <span className="text-sm">{appointment.estimated_duration} min</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-xs text-muted-foreground">
                          Criado em {formatDate(appointment.created_at)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full">
                  <EmptyState
                    icon={Calendar}
                    title={searchTerm ? "Nenhum agendamento encontrado" : "Nenhum agendamento cadastrado"}
                    description={searchTerm 
                      ? "Tente ajustar os termos de busca." 
                      : "Comece criando o primeiro agendamento."
                    }
                    actionLabel="Novo Agendamento"
                    onAction={() => setShowForm(true)}
                    showAction={!searchTerm}
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Forms and Dialogs */}
        <AppointmentForm
          open={showForm}
          onOpenChange={setShowForm}
          onSuccess={refetch}
        />

        <QuickAppointmentForm
          open={showQuickForm}
          onOpenChange={setShowQuickForm}
          selectedDate={selectedDate}
          onSuccess={refetch}
        />

        <AppointmentDetails
          appointment={selectedAppointment}
          open={showDetails}
          onOpenChange={setShowDetails}
          onUpdate={refetch}
        />
      </div>
    </DashboardLayout>
  );
};

export default Agendamentos;