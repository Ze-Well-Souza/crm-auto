import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Appointment {
  id: string;
  client_id: string;
  vehicle_id: string | null;
  service_type: string;
  service_description: string | null;
  scheduled_date: string;
  scheduled_time: string;
  estimated_duration: number | null;
  estimated_value: number | null;
  final_value: number | null;
  status: string | null;
  notes: string | null;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  cancelled_by: string | null;
  created_at: string;
  updated_at: string;
  clients?: {
    name: string;
    email: string | null;
    phone: string | null;
  };
  vehicles?: {
    brand: string;
    model: string;
    year: number | null;
    license_plate: string | null;
  };
}

export const useAppointmentsNew = () => {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for demonstration since appointments table is empty
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          client_id: 'client-1',
          vehicle_id: 'vehicle-1',
          service_type: 'Troca de Óleo',
          service_description: 'Troca de óleo e filtro do motor',
          scheduled_date: '2025-01-20',
          scheduled_time: '09:00',
          estimated_duration: 60,
          estimated_value: 150.00,
          final_value: null,
          status: 'agendado',
          notes: 'Cliente preferencial',
          cancellation_reason: null,
          cancelled_at: null,
          cancelled_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          clients: {
            name: 'João Silva',
            email: 'joao@email.com',
            phone: '(11) 99999-1111'
          },
          vehicles: {
            brand: 'Toyota',
            model: 'Corolla',
            year: 2020,
            license_plate: 'ABC-1234'
          }
        },
        {
          id: '2',
          client_id: 'client-2',
          vehicle_id: 'vehicle-2',
          service_type: 'Revisão Geral',
          service_description: 'Revisão completa dos 60.000 km',
          scheduled_date: '2025-01-21',
          scheduled_time: '14:00',
          estimated_duration: 180,
          estimated_value: 450.00,
          final_value: null,
          status: 'confirmado',
          notes: 'Revisão programada',
          cancellation_reason: null,
          cancelled_at: null,
          cancelled_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          clients: {
            name: 'Maria Santos',
            email: 'maria@email.com',
            phone: '(11) 99999-2222'
          },
          vehicles: {
            brand: 'Honda',
            model: 'Civic',
            year: 2019,
            license_plate: 'DEF-5678'
          }
        },
        {
          id: '3',
          client_id: 'client-3',
          vehicle_id: 'vehicle-3',
          service_type: 'Freios',
          service_description: 'Troca de pastilhas e discos de freio',
          scheduled_date: '2025-01-22',
          scheduled_time: '10:30',
          estimated_duration: 120,
          estimated_value: 320.00,
          final_value: 320.00,
          status: 'concluido',
          notes: 'Serviço concluído com sucesso',
          cancellation_reason: null,
          cancelled_at: null,
          cancelled_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          clients: {
            name: 'Carlos Oliveira',
            email: 'carlos@email.com',
            phone: '(11) 99999-3333'
          },
          vehicles: {
            brand: 'Volkswagen',
            model: 'Golf',
            year: 2018,
            license_plate: 'GHI-9012'
          }
        },
        {
          id: '4',
          client_id: 'client-4',
          vehicle_id: null,
          service_type: 'Diagnóstico',
          service_description: 'Diagnóstico de problema no motor',
          scheduled_date: '2025-01-23',
          scheduled_time: '08:00',
          estimated_duration: 90,
          estimated_value: 80.00,
          final_value: null,
          status: 'em_andamento',
          notes: 'Aguardando peças',
          cancellation_reason: null,
          cancelled_at: null,
          cancelled_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          clients: {
            name: 'Ana Costa',
            email: 'ana@email.com',
            phone: '(11) 99999-4444'
          },
          vehicles: null
        },
        {
          id: '5',
          client_id: 'client-5',
          vehicle_id: 'vehicle-5',
          service_type: 'Ar Condicionado',
          service_description: 'Manutenção do sistema de ar condicionado',
          scheduled_date: '2025-01-18',
          scheduled_time: '15:30',
          estimated_duration: 90,
          estimated_value: 200.00,
          final_value: null,
          status: 'cancelado',
          notes: null,
          cancellation_reason: 'Cliente cancelou por motivos pessoais',
          cancelled_at: new Date().toISOString(),
          cancelled_by: 'client-5',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          clients: {
            name: 'Pedro Lima',
            email: 'pedro@email.com',
            phone: '(11) 99999-5555'
          },
          vehicles: {
            brand: 'Ford',
            model: 'Focus',
            year: 2017,
            license_plate: 'JKL-3456'
          }
        }
      ];

      setAppointments(mockAppointments);
    } catch (err) {
      console.error('Erro ao buscar agendamentos:', err);
      setError('Erro inesperado ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Agendamento criado",
        description: "O agendamento foi criado com sucesso.",
      });

      await fetchAppointments();
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar agendamento';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateAppointment = async (id: string, appointmentData: Partial<Appointment>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(appointmentData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Agendamento atualizado",
        description: "O agendamento foi atualizado com sucesso.",
      });

      await fetchAppointments();
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar agendamento';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi excluído com sucesso.",
      });

      await fetchAppointments();
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao excluir agendamento';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
};