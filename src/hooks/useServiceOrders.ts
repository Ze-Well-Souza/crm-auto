import { useState, useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { supabase } from "@/integrations/supabase/client";
import type { ServiceOrder } from "@/types";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";

// Mock data para desenvolvimento
const MOCK_SERVICE_ORDERS: ServiceOrder[] = [
  {
    id: '1',
    order_number: 'OS-2024-001',
    client_id: '1',
    vehicle_id: '1',
    status: 'em_andamento',
    description: 'Troca de óleo e filtros + Revisão completa dos freios',
    total_labor: 455,
    total_parts: 430,
    total_amount: 885,
    total_discount: null,
    discount: null,
    notes: null,
    mechanic_id: null,
    delivered_at: null,
    finished_at: null,
    started_at: null,
    diagnosis: null,
    service_description: 'Troca de óleo e filtros + Revisão completa dos freios',
    start_date: null,
    completion_date: null,
    appointment_id: null,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
    clients: { name: 'João Silva', email: 'joao@email.com' },
    vehicles: { brand: 'Toyota', model: 'Corolla', license_plate: 'ABC-1234' }
  },
  {
    id: '2',
    order_number: 'OS-2024-002',
    client_id: '2',
    vehicle_id: '2',
    status: 'orcamento',
    description: 'Diagnóstico de problema no motor + Troca de velas',
    total_labor: 200,
    total_parts: 160,
    total_amount: 360,
    total_discount: null,
    discount: null,
    notes: null,
    mechanic_id: null,
    delivered_at: null,
    finished_at: null,
    started_at: null,
    diagnosis: null,
    service_description: 'Diagnóstico de problema no motor + Troca de velas',
    start_date: null,
    completion_date: null,
    appointment_id: null,
    created_at: '2024-01-19T14:30:00Z',
    updated_at: '2024-01-19T14:30:00Z',
    clients: { name: 'Maria Santos', email: 'maria@email.com' },
    vehicles: { brand: 'Honda', model: 'Civic', license_plate: 'XYZ-5678' }
  },
  {
    id: '3',
    order_number: 'OS-2024-003',
    client_id: '3',
    vehicle_id: '3',
    status: 'concluido',
    description: 'Alinhamento e balanceamento + Troca de pneus',
    total_labor: 300,
    total_parts: 1800,
    total_amount: 2100,
    total_discount: null,
    discount: null,
    notes: null,
    mechanic_id: null,
    delivered_at: null,
    finished_at: null,
    started_at: null,
    diagnosis: null,
    service_description: 'Alinhamento e balanceamento + Troca de pneus',
    start_date: null,
    completion_date: null,
    appointment_id: null,
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-18T16:00:00Z',
    clients: { name: 'Pedro Oliveira', email: 'pedro@email.com' },
    vehicles: { brand: 'Volkswagen', model: 'Golf', license_plate: 'DEF-9012' }
  },
  {
    id: '4',
    order_number: 'OS-2024-004',
    client_id: '4',
    vehicle_id: '4',
    status: 'aguardando_pecas',
    description: 'Troca de embreagem completa',
    total_labor: 600,
    total_parts: 970,
    total_amount: 1570,
    total_discount: null,
    discount: null,
    notes: null,
    mechanic_id: null,
    delivered_at: null,
    finished_at: null,
    started_at: null,
    diagnosis: null,
    service_description: 'Troca de embreagem completa',
    start_date: null,
    completion_date: null,
    appointment_id: null,
    created_at: '2024-01-21T11:00:00Z',
    updated_at: '2024-01-21T11:00:00Z',
    clients: { name: 'Ana Costa', email: 'ana@email.com' },
    vehicles: { brand: 'Fiat', model: 'Uno', license_plate: 'GHI-3456' }
  },
  {
    id: '5',
    order_number: 'OS-2024-005',
    client_id: '5',
    vehicle_id: '5',
    status: 'cancelado',
    description: 'Reparo no sistema de ar condicionado',
    total_labor: 350,
    total_parts: 580,
    total_amount: 930,
    total_discount: null,
    discount: null,
    notes: null,
    mechanic_id: null,
    delivered_at: null,
    finished_at: null,
    started_at: null,
    diagnosis: null,
    service_description: 'Reparo no sistema de ar condicionado',
    start_date: null,
    completion_date: null,
    appointment_id: null,
    created_at: '2024-01-17T12:15:00Z',
    updated_at: '2024-01-22T10:00:00Z',
    clients: { name: 'Lucas Fernandes', email: 'lucas@email.com' },
    vehicles: { brand: 'Nissan', model: 'Kicks', license_plate: 'JKL-7890' }
  }
];

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

      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));

      // Usar dados mock
      setServiceOrders(MOCK_SERVICE_ORDERS);

      /* Código original comentado para usar mock
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
      */
    } catch (err: any) {
      console.error('Erro ao buscar ordens de serviço:', err);
      setError(err.message || 'Erro inesperado ao carregar ordens de serviço');
    } finally {
      setLoading(false);
    }
  };

  const createServiceOrder = async (orderData: Omit<ServiceOrder, 'id' | 'created_at' | 'updated_at' | 'clients' | 'vehicles' | 'user_id' | 'order_number'>) => {
    try {
      // Verificar acesso ao módulo
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

  const updateServiceOrder = async (id: string, orderData: Partial<ServiceOrder>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: updateError } = await supabase
        .from('service_orders')
        .update(orderData)
        .eq('id', id)
        .eq('user_id', session.user.id)
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

      if (updateError) throw updateError;

      notifications.showUpdateSuccess("Ordem de serviço");

      await fetchServiceOrders();
      return data;
    } catch (err: any) {
      console.error('Erro ao atualizar ordem de serviço:', err);
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
        .from('service_orders')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('user_id', session.user.id)
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

      if (updateError) throw updateError;

      notifications.showUpdateSuccess("Status");

      await fetchServiceOrders();
      return data;
    } catch (err: any) {
      console.error('Erro ao atualizar status:', err);
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
        .from('service_orders')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (deleteError) throw deleteError;

      notifications.showDeleteSuccess("Ordem de serviço");

      await fetchServiceOrders();
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir ordem de serviço:', err);
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