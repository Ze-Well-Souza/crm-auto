import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Appointment {
  id: string;
  usuario_id: string | null;
  parceiro_id: number | null;
  data_agendamento: string;
  servico_tipo: string;
  servico_descricao: string | null;
  valor_estimado: number | null;
  valor_final: number | null;
  status: string | null;
  observacoes: string | null;
  endereco_atendimento: any | null;
  veiculo_info: any | null;
  duracao_estimada: number | null;
  motivo_cancelamento: string | null;
  cancelado_por: string | null;
  cancelado_em: string | null;
  created_at: string;
  updated_at: string | null;
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
        .from('agendamentos')
        .select('*')
        .order('data_agendamento', { ascending: false });

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