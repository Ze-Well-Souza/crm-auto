import { useEffect } from "react";
import { useCrudState } from "@/hooks/useStandardState";
import { useNotifications } from "@/contexts/NotificationContext";
import type { Appointment } from "@/types";
import { mockAppointments } from "@/utils/mockData";
import { generateId } from "@/utils/formatters";

export const useAppointmentsNew = () => {
  const state = useCrudState<Appointment>();
  const notifications = useNotifications();

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

      notifications.showCreateSuccess("Agendamento");

      return newAppointment;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar agendamento';
      state.setError(errorMessage);
      notifications.showOperationError("criar", "agendamento", errorMessage);
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

      notifications.showUpdateSuccess("Agendamento");

      return mockAppointments[index];
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar agendamento';
      state.setError(errorMessage);
      notifications.showOperationError("atualizar", "agendamento", errorMessage);
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