import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCrudState } from "@/hooks/useStandardState";
import type { Appointment } from "@/types";
import { mockAppointments } from "@/utils/mockData";
import { generateId } from "@/utils/formatters";

export const useAppointmentsNew = () => {
  const state = useCrudState<Appointment>();
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      state.setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use centralized mock data
      state.setData(mockAppointments);
    } catch (err) {
      console.error('Erro ao buscar agendamentos:', err);
      state.setError('Erro inesperado ao carregar agendamentos');
    }
  };

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newAppointment: Appointment = {
        ...appointmentData,
        id: generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Add to mock data
      mockAppointments.push(newAppointment);
      state.addItem(newAppointment);

      toast({
        title: "Agendamento criado",
        description: "O agendamento foi criado com sucesso.",
      });

      return newAppointment;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar agendamento';
      state.setError(errorMessage);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update in mock data
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index !== -1) {
        const updatedAppointment = {
          ...mockAppointments[index],
          ...appointmentData,
          updated_at: new Date().toISOString()
        };
        mockAppointments[index] = updatedAppointment;
        state.updateItem(id, updatedAppointment);
      }

      toast({
        title: "Agendamento atualizado",
        description: "O agendamento foi atualizado com sucesso.",
      });

      return mockAppointments[index];
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar agendamento';
      state.setError(errorMessage);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Remove from mock data
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index !== -1) {
        mockAppointments.splice(index, 1);
        state.removeItem(id);
      }

      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi excluído com sucesso.",
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao excluir agendamento';
      state.setError(errorMessage);
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