import { useState, useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { supabase } from "@/integrations/supabase/client";
import type { ServiceOrder } from "@/types";

export const useServiceOrders = () => {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const notifications = useNotifications();

  const fetchServiceOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setError('Usuário não autenticado');
        setServiceOrders([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('service_orders')
        .select(`
          *,
          clients:client_id (
            name,
            email
          ),
          vehicles:vehicle_id (
            brand,
            model,
            license_plate
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setServiceOrders(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar ordens de serviço:', err);
      setError(err.message || 'Erro inesperado ao carregar ordens de serviço');
    } finally {
      setLoading(false);
    }
  };

  const createServiceOrder = async (orderData: Omit<ServiceOrder, 'id' | 'created_at' | 'updated_at' | 'clients' | 'vehicles' | 'user_id' | 'order_number'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: insertError } = await supabase
        .from('service_orders')
        .insert([{
          ...orderData,
          user_id: session.user.id
        }])
        .select(`
          *,
          clients:client_id (
            name,
            email
          ),
          vehicles:vehicle_id (
            brand,
            model,
            license_plate
          )
        `)
        .single();

      if (insertError) throw insertError;

      notifications.showCreateSuccess("Ordem de serviço");

      await fetchServiceOrders();
      return data;
    } catch (err: any) {
      console.error('Erro ao criar ordem de serviço:', err);
      notifications.showOperationError("criar", "ordem de serviço");
      return null;
    }
  };

  useEffect(() => {
    fetchServiceOrders();
  }, []);

  return {
    serviceOrders,
    loading,
    error,
    createServiceOrder,
    refetch: fetchServiceOrders
  };
};