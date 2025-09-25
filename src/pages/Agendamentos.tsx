import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { useAppointmentsNew } from "@/hooks/useAppointmentsNew";
import { SearchInput } from "@/components/common/SearchInput";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { StatusBadge } from "@/components/common/StatusBadge";

const Agendamentos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { appointments, loading, error, refetch } = useAppointmentsNew();

  const filteredAppointments = appointments?.filter(appointment => 
    appointment.service_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.service_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.clients?.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Agendamentos</h1>
            <p className="text-muted-foreground">Gerencie a agenda de serviços e consultas</p>
          </div>
          
          <Button className="shadow-primary" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Total de Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Todos os agendamentos</p>
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
              <div className="text-2xl font-bold">
                {appointments?.filter(a => a.status === 'agendado').length || 0}
              </div>
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
              <div className="text-2xl font-bold">
                {appointments?.filter(a => a.status === 'confirmado').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Agendamentos confirmados</p>
            </CardContent>
          </Card>
        </div>

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
              <Card key={appointment.id} className="hover:shadow-elevated transition-smooth cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {new Date(appointment.scheduled_date).toLocaleDateString('pt-BR')} - {appointment.scheduled_time}
                    </CardTitle>
                    <StatusBadge status={appointment.status} type="appointment" />
                  </div>
                  <CardDescription>
                    {appointment.service_type} • Cliente: {appointment.clients?.name || 'N/A'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {appointment.estimated_value && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Valor:</span>
                      <span className="font-semibold">
                        R$ {appointment.estimated_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Criado em {new Date(appointment.created_at).toLocaleDateString('pt-BR')}
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

        <AppointmentForm
          open={showForm}
          onOpenChange={setShowForm}
          onSuccess={refetch}
        />
      </div>
    </DashboardLayout>
  );
};

export default Agendamentos;