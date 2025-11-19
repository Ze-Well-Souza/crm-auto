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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">Agendamentos</h1>
              <p className="text-slate-400">Gerencie a agenda de serviços com visualização interativa</p>
            </div>

            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-500/50" onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </div>

        {/* Stats - Landing Page Style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Calendar className="h-4 w-4 text-purple-400" />
                </div>
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalAppointments}</div>
              <p className="text-xs text-slate-400 mt-1">Agendamentos</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <Clock className="h-4 w-4 text-orange-400" />
                </div>
                Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{pendingAppointments}</div>
              <p className="text-xs text-slate-400 mt-1">Aguardando confirmação</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                </div>
                Confirmados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{confirmedAppointments}</div>
              <p className="text-xs text-slate-400 mt-1">Confirmados</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <CheckCircle className="h-4 w-4 text-blue-400" />
                </div>
                Concluídos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{completedAppointments}</div>
              <p className="text-xs text-slate-400 mt-1">Finalizados</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Calendar and List View - Landing Page Style */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 backdrop-blur-xl p-1 rounded-xl">
            <TabsTrigger
              value="calendar"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/50 rounded-lg transition-all text-slate-300"
            >
              <CalendarDays className="h-4 w-4" />
              Agenda Visual
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/50 rounded-lg transition-all text-slate-300"
            >
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

            {/* Search Results Info - Landing Page Style */}
            {searchConfig.isFiltered && (
              <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-300">
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
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
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