import { useState, useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { supabase } from "@/integrations/supabase/client";
import type { ServiceOrder } from "@/types";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

export const useServiceOrders = () => {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const notifications = useNotifications();
  const { hasFeature } = useSubscriptionContext();

  const fetchServiceOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        // No active session — show empty state gracefully (e.g. demo mode)
        setServiceOrders([]);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('crm_service_orders')
        .select(`
          *,
          clients:client_id (
            name,
            email
          ),
          vehicles:vehicle_id (
            brand,
            model,
            plate
          )
        `)
        .eq('partner_id', session.user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Map plate to license_plate for compatibility
      const mapped = (data || []).map((order: any) => ({
        ...order,
        vehicles: order.vehicles ? {
          ...order.vehicles,
          license_plate: order.vehicles.plate
        } : null
      }));

      setServiceOrders(mapped);
    } catch (err: any) {
      logger.error('Erro ao buscar ordens de serviço:', err);
      setError(err.message || 'Erro inesperado ao carregar ordens de serviço');
    } finally {
      setLoading(false);
    }
  };

  const createServiceOrder = async (orderData: Omit<ServiceOrder, 'id' | 'created_at' | 'updated_at' | 'clients' | 'vehicles' | 'partner_id' | 'order_number'>) => {
    try {
      if (!hasFeature('crm_service_orders')) {
        toast.error('Ordens de Serviço disponíveis no plano Profissional', {
          action: {
            label: 'Ver Planos',
            onClick: () => window.location.href = '/planos'
          }
        });
        return null;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: insertError } = await supabase
        .from('crm_service_orders')
        .insert([{
          ...orderData,
          partner_id: session.user.id
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
            plate
          )
        `)
        .single();

      if (insertError) throw insertError;

      notifications.showCreateSuccess("Ordem de serviço");
      await fetchServiceOrders();
      return data;
    } catch (err: any) {
      logger.error('Erro ao criar ordem de serviço:', err);
      notifications.showOperationError("criar", "ordem de serviço");
      return null;
    }
  };

  const updateServiceOrder = async (id: string, orderData: Partial<ServiceOrder>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: updateError } = await supabase
        .from('crm_service_orders')
        .update(orderData)
        .eq('id', id)
        .eq('partner_id', session.user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      notifications.showUpdateSuccess("Ordem de serviço");
      await fetchServiceOrders();
      return data;
    } catch (err: any) {
      logger.error('Erro ao atualizar ordem de serviço:', err);
      notifications.showOperationError("atualizar", "ordem de serviço");
      return null;
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: updateError } = await supabase
        .from('crm_service_orders')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('partner_id', session.user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      notifications.showUpdateSuccess("Status");
      await fetchServiceOrders();
      return data;
    } catch (err: any) {
      logger.error('Erro ao atualizar status:', err);
      notifications.showOperationError("atualizar", "status");
      return null;
    }
  };

  const deleteServiceOrder = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Usuário não autenticado');
      }

      const { error: deleteError } = await supabase
        .from('crm_service_orders')
        .delete()
        .eq('id', id)
        .eq('partner_id', session.user.id);

      if (deleteError) throw deleteError;

      notifications.showDeleteSuccess("Ordem de serviço");
      await fetchServiceOrders();
      return true;
    } catch (err: any) {
      logger.error('Erro ao excluir ordem de serviço:', err);
      notifications.showOperationError("excluir", "ordem de serviço");
      return false;
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
    updateServiceOrder,
    updateStatus,
    deleteServiceOrder,
    refetch: fetchServiceOrders
  };
};
