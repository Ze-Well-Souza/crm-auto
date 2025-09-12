import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Appointment {
  id: string;
  date: string;
  time: string;
  user_id: string | null;
  service_id: string | null;
  establishment_id: string | null;
  status: string | null;
  notes: string | null;
  total_price: number | null;
  created_at: string;
  updated_at: string;
  clients?: {
    name: string;
    email: string | null;
    phone: string | null;
  };
  services?: {
    name: string;
    price: number | null;
  };
}

export const useAppointments = () => {
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
        .select('*')
        .order('date', { ascending: true });

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

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments
  };
};