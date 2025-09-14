import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ServiceOrder {
  id: string;
  order_number: string;
  client_id: string;
  vehicle_id: string | null;
  description: string | null;
  total_labor: number | null;
  total_parts: number | null;
  total_amount: number | null;
  discount: number | null;
  status: string | null;
  mechanic_id: string | null;
  notes: string | null;
  delivered_at: string | null;
  finished_at: string | null;
  started_at: string | null;
  created_at: string;
  updated_at: string;
  clients?: {
    name: string;
    email: string | null;
  };
  vehicles?: {
    brand: string;
    model: string;
    license_plate: string | null;
  };
}

export const useServiceOrders = () => {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchServiceOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('service_orders_deprecated')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar ordens de serviço:', error);
        setError(error.message);
        return;
      }

      setServiceOrders(data);
    } catch (err) {
      console.error('Erro ao buscar ordens de serviço:', err);
      setError('Erro inesperado ao carregar ordens de serviço');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceOrders();
  }, []);

  return {
    serviceOrders,
    loading,
    error,
    refetch: fetchServiceOrders
  };
};