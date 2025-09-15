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
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients (
            name,
            email,
            phone
          ),
          vehicles (
            brand,
            model,
            year,
            license_plate
          )
        `)
        .order('scheduled_date', { ascending: false });

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        setError(error.message);
        return;
      }

      setAppointments(data);
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