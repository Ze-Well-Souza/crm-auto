import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Appointment } from "@/types";
import { mockAppointments } from "@/utils/mockData";
import { generateId } from "@/utils/formatters";

export const useAppointmentsNew = () => {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use centralized mock data
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

      toast({
        title: "Agendamento criado",
        description: "O agendamento foi criado com sucesso.",
      });

      await fetchAppointments();
      return newAppointment;
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update in mock data
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index !== -1) {
        mockAppointments[index] = {
          ...mockAppointments[index],
          ...appointmentData,
          updated_at: new Date().toISOString()
        };
      }

      toast({
        title: "Agendamento atualizado",
        description: "O agendamento foi atualizado com sucesso.",
      });

      await fetchAppointments();
      return mockAppointments[index];
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Remove from mock data
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index !== -1) {
        mockAppointments.splice(index, 1);
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