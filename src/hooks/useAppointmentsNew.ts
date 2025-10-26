import { useEffect } from "react";
import { useCrudState } from "@/hooks/useStandardState";
import { useNotifications } from "@/contexts/NotificationContext";
import { supabase } from "@/integrations/supabase/client";
import type { Appointment } from "@/types";

export const useAppointmentsNew = () => {
  const state = useCrudState<Appointment>();
  const notifications = useNotifications();

  const fetchAppointments = async () => {
    try {
      state.setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        state.setError('Usuário não autenticado');
        state.setData([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .order('scheduled_date', { ascending: false });

      if (fetchError) throw fetchError;
      
      state.setData(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar agendamentos:', err);
      state.setError(err.message || 'Erro inesperado ao carregar agendamentos');
    }
  };

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: insertError } = await supabase
        .from('appointments')
        .insert([{
          ...appointmentData,
          user_id: session.user.id
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      
      state.addItem(data);
      notifications.showCreateSuccess("Agendamento");

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar agendamento';
      state.setError(errorMessage);
      notifications.showOperationError("criar", "agendamento", errorMessage);
      throw err;
    }
  };

  const updateAppointment = async (id: string, appointmentData: Partial<Appointment>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('appointments')
        .update(appointmentData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      state.updateItem(id, data);
      notifications.showUpdateSuccess("Agendamento");

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar agendamento';
      state.setError(errorMessage);
      notifications.showOperationError("atualizar", "agendamento", errorMessage);
      throw err;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      state.removeItem(id);
      notifications.showDeleteSuccess("Agendamento");
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao excluir agendamento';
      state.setError(errorMessage);
      notifications.showOperationError("excluir", "agendamento", errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments: state.data,
    loading: state.loading,
    error: state.error,
    success: state.success,
    refetch: fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
};