import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Clock, CircleCheck as CheckCircle, List, CalendarDays, Filter } from "lucide-react";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { CalendarView } from "@/components/appointments/CalendarView";
import { AppointmentDetails } from "@/components/appointments/AppointmentDetails";
import { QuickAppointmentForm } from "@/components/appointments/QuickAppointmentForm";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { useAppointmentsNew } from "@/hooks/useAppointmentsNew";
import { useClients } from "@/hooks/useClients";
import { useVehicles } from "@/hooks/useVehicles";
import { SearchAdvanced } from "@/components/common/SearchAdvanced";
import { Pagination } from "@/components/common/Pagination";
import { useAppointmentSearch } from "@/hooks/useAdvancedSearch";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { isAfter, isBefore, isSameDay, parseISO } from "date-fns";
import type { Appointment } from "@/types";

const Agendamentos = () => {
  const [showForm, setShowForm] = useState(false);
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");
  
  const { appointments, loading, error, refetch } = useAppointmentsNew();
  const { clients } = useClients();
  const { vehicles } = useVehicles();

  // Configuração da busca avançada
  const searchConfig = useAppointmentSearch(appointments || []);

  // Get unique service types for filter options
  const serviceTypes = useMemo(() => {
    if (!appointments) return [];
    const types = new Set(appointments.map(a => a.service_type).filter(Boolean));
    return Array.from(types);
  }, [appointments]);

  // Configuração dos filtros para busca avançada
  const filterGroups = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'scheduled', label: 'Agendado' },
        { value: 'confirmed', label: 'Confirmado' },
        { value: 'in_progress', label: 'Em Andamento' },
        { value: 'completed', label: 'Concluído' },
        { value: 'cancelled', label: 'Cancelado' }
      ]
    },
    {
      key: 'type',
      label: 'Tipo de Serviço',
      type: 'select' as const,
      options: serviceTypes.map(type => ({ value: type, label: type }))
    },
    {
      key: 'priority',
      label: 'Prioridade',
      type: 'select' as const,
      options: [
        { value: 'low', label: 'Baixa' },
        { value: 'medium', label: 'Média' },
        { value: 'high', label: 'Alta' },
        { value: 'urgent', label: 'Urgente' }
      ]
    },
    {
      key: 'date_range',
      label: 'Período',
      type: 'date-range' as const
    }
  ];

  const quickFilters = [
    {
      key: 'today',
      label: 'Hoje',
      color: 'primary' as const
    },
    {
      key: 'this_week',
      label: 'Esta Semana',
      color: 'secondary' as const
    },
    {
      key: 'pending',
      label: 'Pendentes',
      color: 'outline' as const
    }
  ];

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
            {/* Advanced Search */}
            <SearchAdvanced
              placeholder="Buscar agendamentos por cliente, serviço, descrição..."
              filterGroups={filterGroups}
              quickFilters={quickFilters}
              onSearch={searchConfig.handleSearch}
              onReset={searchConfig.handleReset}
              showQuickFilters={true}
              showAdvancedFilters={true}
            />

            {/* Search Results Info */}
            {searchConfig.isFiltered && (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    {searchConfig.paginationInfo.totalItems} agendamento(s) encontrado(s)
                    {searchConfig.paginationInfo.totalItems !== appointments?.length && 
                      ` de ${appointments?.length} total`
                    }
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={searchConfig.handleReset}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Limpar filtros
                </Button>
              </div>
            )}

            {/* Appointments List */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchConfig.data.length > 0 ? (
                  searchConfig.data.map((appointment) => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      onUpdate={refetch}
                      onQuickAction={(action, appt) => {
                        if (action === 'contact') {
                          handleAppointmentClick(appt);
                        }
                      }}
                    />
                  ))
                ) : (
                  <div className="col-span-full">
                    <EmptyState
                      icon={Calendar}
                      title={searchConfig.isFiltered ? "Nenhum agendamento encontrado" : "Nenhum agendamento cadastrado"}
                      description={searchConfig.isFiltered 
                        ? "Tente ajustar os termos de busca ou filtros." 
                        : "Comece criando o primeiro agendamento."
                      }
                      actionLabel="Novo Agendamento"
                      onAction={() => setShowForm(true)}
                      showAction={!searchConfig.isFiltered}
                    />
                  </div>
                )}
              </div>

              {/* Pagination */}
              {searchConfig.paginationInfo.totalPages > 1 && (
                <Pagination
                  paginationInfo={searchConfig.paginationInfo}
                  onPageChange={searchConfig.handlePageChange}
                  onPageSizeChange={searchConfig.handlePageSizeChange}
                  goToFirstPage={searchConfig.goToFirstPage}
                  goToLastPage={searchConfig.goToLastPage}
                  goToNextPage={searchConfig.goToNextPage}
                  goToPreviousPage={searchConfig.goToPreviousPage}
                  showPageSizeSelector={true}
                  showPageInfo={true}
                  showNavigationInfo={true}
                />
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