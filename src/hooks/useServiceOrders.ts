import { useState, useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import type { ServiceOrder } from "@/types";
import { mockClients } from "@/utils/mockData";
import { generateId } from "@/utils/formatters";

// Mock service orders data
const mockServiceOrders: ServiceOrder[] = [
  {
    id: generateId(),
    order_number: `OS-${Date.now()}`,
    client_id: mockClients[0]?.id || generateId(),
    vehicle_id: generateId(),
    description: 'Troca de óleo e filtros',
    total_labor: 80.00,
    total_parts: 70.00,
    total_amount: 150.00,
    discount: 0,
    status: 'concluido',
    mechanic_id: 'mec-001',
    notes: 'Serviço realizado conforme agendado',
    delivered_at: new Date().toISOString(),
    finished_at: new Date().toISOString(),
    started_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    clients: {
      name: mockClients[0]?.name || 'João Silva',
      email: mockClients[0]?.email || 'joao@email.com'
    },
    vehicles: {
      brand: 'Toyota',
      model: 'Corolla',
      license_plate: 'ABC-1234'
    }
  }
];

export const useServiceOrders = () => {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const notifications = useNotifications();

  const fetchServiceOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data sorted by creation date
      const sortedOrders = [...mockServiceOrders].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setServiceOrders(sortedOrders);
    } catch (err) {
      console.error('Erro ao buscar ordens de serviço:', err);
      setError('Erro inesperado ao carregar ordens de serviço');
    } finally {
      setLoading(false);
    }
  };

  const createServiceOrder = async (orderData: Omit<ServiceOrder, 'id' | 'created_at' | 'updated_at' | 'clients' | 'vehicles'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const clientData = mockClients.find(c => c.id === orderData.client_id);
      
      const newOrder: ServiceOrder = {
        ...orderData,
        id: generateId(),
        order_number: `OS-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        clients: clientData ? {
          name: clientData.name,
          email: clientData.email
        } : undefined,
        vehicles: undefined
      };
      
      // Add to mock data
      mockServiceOrders.push(newOrder);

      notifications.showCreateSuccess("Ordem de serviço");

      // Atualiza a lista
      fetchServiceOrders();
      return newOrder;
    } catch (err) {
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