import { useState, useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Vehicle } from "@/types";

// Mock data para desenvolvimento
const MOCK_VEHICLES: Vehicle[] = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2022,
    license_plate: 'ABC-1234',
    color: 'Prata',
    fuel_type: 'Flex',
    mileage: 25000,
    chassis: '9BWZZZ377VT004251',
    client_id: '1',
    plate: 'ABC-1234',
    vin: null,
    engine: null,
    notes: 'Revisão em dia - Próxima manutenção em 30.000 km',
    created_at: '2023-06-15T10:00:00Z',
    updated_at: '2024-11-15T14:30:00Z',
    clients: {
      name: 'João Silva',
      email: 'joao.silva@email.com'
    }
  },
  {
    id: '2',
    brand: 'Honda',
    model: 'Civic',
    year: 2021,
    license_plate: 'DEF-5678',
    color: 'Preto',
    fuel_type: 'Gasolina',
    mileage: 45000,
    chassis: '2HGFC2F59MH123456',
    client_id: '2',
    plate: 'DEF-5678',
    vin: null,
    engine: null,
    notes: 'Troca de óleo realizada recentemente',
    created_at: '2023-08-20T11:30:00Z',
    updated_at: '2024-11-10T09:15:00Z',
    clients: {
      name: 'Maria Santos',
      email: 'maria.santos@email.com'
    }
  },
  {
    id: '3',
    brand: 'Volkswagen',
    model: 'Gol',
    year: 2020,
    license_plate: 'GHI-9012',
    color: 'Branco',
    fuel_type: 'Flex',
    mileage: 68000,
    chassis: '9BWAA05U8PT123456',
    client_id: '3',
    plate: 'GHI-9012',
    vin: null,
    engine: null,
    notes: 'Necessita revisão de freios',
    created_at: '2023-05-10T08:45:00Z',
    updated_at: '2024-11-05T16:20:00Z',
    clients: {
      name: 'Carlos Oliveira',
      email: 'carlos.oliveira@email.com'
    }
  },
  {
    id: '4',
    brand: 'Chevrolet',
    model: 'Onix',
    year: 2023,
    license_plate: 'JKL-3456',
    color: 'Vermelho',
    fuel_type: 'Flex',
    mileage: 12000,
    chassis: '9BGKS69U0NG123456',
    client_id: '4',
    plate: 'JKL-3456',
    vin: null,
    engine: null,
    notes: 'Veículo novo - Primeira revisão agendada',
    created_at: '2024-01-15T13:00:00Z',
    updated_at: '2024-11-18T10:45:00Z',
    clients: {
      name: 'Ana Paula Costa',
      email: 'ana.costa@email.com'
    }
  },
  {
    id: '5',
    brand: 'Fiat',
    model: 'Argo',
    year: 2021,
    license_plate: 'MNO-7890',
    color: 'Azul',
    fuel_type: 'Flex',
    mileage: 38000,
    chassis: '9BD358206N1234567',
    client_id: '5',
    plate: 'MNO-7890',
    vin: null,
    engine: null,
    notes: 'Ar condicionado revisado',
    created_at: '2023-09-25T15:30:00Z',
    updated_at: '2024-11-12T11:00:00Z',
    clients: {
      name: 'Roberto Ferreira',
      email: 'roberto.ferreira@email.com'
    }
  },
  {
    id: '6',
    brand: 'Hyundai',
    model: 'HB20',
    year: 2022,
    license_plate: 'PQR-2345',
    color: 'Cinza',
    fuel_type: 'Flex',
    mileage: 28000,
    chassis: '8AFBZZFH8MJ123456',
    client_id: '6',
    plate: 'PQR-2345',
    vin: null,
    engine: null,
    notes: 'Pneus trocados recentemente',
    created_at: '2023-11-08T09:15:00Z',
    updated_at: '2024-11-14T14:20:00Z',
    clients: {
      name: 'Juliana Almeida',
      email: 'juliana.almeida@email.com'
    }
  },
  {
    id: '7',
    brand: 'Renault',
    model: 'Kwid',
    year: 2020,
    license_plate: 'STU-6789',
    color: 'Laranja',
    fuel_type: 'Flex',
    mileage: 52000,
    chassis: '93Y5SRD60MJ123456',
    client_id: '2',
    plate: 'STU-6789',
    vin: null,
    engine: null,
    notes: 'Segundo veículo da cliente Maria Santos',
    created_at: '2023-07-12T12:00:00Z',
    updated_at: '2024-11-08T15:45:00Z',
    clients: {
      name: 'Maria Santos',
      email: 'maria.santos@email.com'
    }
  },
  {
    id: '8',
    brand: 'Ford',
    model: 'Ka',
    year: 2019,
    license_plate: 'VWX-0123',
    color: 'Prata',
    fuel_type: 'Flex',
    mileage: 75000,
    chassis: '9BFZK51P0KB123456',
    client_id: '6',
    plate: 'VWX-0123',
    vin: null,
    engine: null,
    notes: 'Frota empresarial - Veículo 1',
    created_at: '2023-04-18T10:30:00Z',
    updated_at: '2024-11-06T13:10:00Z',
    clients: {
      name: 'Juliana Almeida',
      email: 'juliana.almeida@email.com'
    }
  }
];

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const notifications = useNotifications();
  const { user, session } = useAuth();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user || !session) {
        // Se não autenticado, usar dados mock
        console.log('Usuário não autenticado - usando dados mock de veículos');
        setTimeout(() => {
          setVehicles(MOCK_VEHICLES);
          setLoading(false);
        }, 500);
        return;
      }

      console.log('✅ Usuário autenticado:', user.id);

      // Buscar veículos da frota do parceiro (partner_fleet) com JOIN em vehicles
      const { data: fleetData, error: fetchError } = await supabase
        .from('partner_fleet')
        .select(`
          *,
          vehicles:vehicle_id (
            *,
            clients:client_id (
              name,
              email
            )
          )
        `)
        .eq('partner_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Transformar dados para o formato esperado (Vehicle[])
      const vehiclesData = fleetData?.map((fleet: any) => ({
        ...fleet.vehicles,
        // Adicionar métricas da frota
        fleet_metrics: {
          total_services: fleet.total_services,
          total_spent: fleet.total_spent,
          maintenance_status: fleet.maintenance_status,
          last_service_date: fleet.last_service_date,
          last_service_type: fleet.last_service_type,
          last_service_os: fleet.last_service_os
        }
      })) || [];

      // Se não houver dados no banco, usar mock
      setVehicles(vehiclesData.length > 0 ? vehiclesData : MOCK_VEHICLES);
    } catch (err: any) {
      console.error('Erro ao buscar veículos:', err);
      // Em caso de erro, usar dados mock
      setVehicles(MOCK_VEHICLES);
      setError(null); // Não mostrar erro se temos mock
    } finally {
      setLoading(false);
    }
  };

  const createVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'clients' | 'user_id'>) => {
    try {
      if (!user || !session) {
        throw new Error('Usuário não autenticado');
      }

      // Validar client_id obrigatório
      if (!vehicleData.client_id) {
        throw new Error('Cliente é obrigatório');
      }

      console.log('🚗 Criando veículo:', vehicleData);

      // 1. Criar veículo na tabela vehicles
      const { data: vehicleCreated, error: insertError } = await supabase
        .from('vehicles')
        .insert([{
          ...vehicleData,
          partner_id: user.id
        }])
        .select(`
          *,
          clients:client_id (
            name,
            email
          )
        `)
        .single();

      if (insertError) {
        console.error('❌ Erro ao inserir veículo:', insertError);
        throw insertError;
      }

      if (!vehicleCreated) {
        throw new Error('Veículo não foi criado - resposta vazia do banco');
      }

      console.log('✅ Veículo criado:', vehicleCreated);

      // 2. Criar vínculo na tabela partner_fleet
      const vehicleSnapshot = {
        brand: vehicleCreated.brand,
        model: vehicleCreated.model,
        year: vehicleCreated.year,
        plate: vehicleCreated.license_plate,
        color: vehicleCreated.color,
        fuel_type: vehicleCreated.fuel_type
      };

      console.log('🔗 Criando vínculo na frota...');

      const { data: fleetCreated, error: fleetError } = await supabase
        .from('partner_fleet')
        .insert([{
          partner_id: user.id,
          client_id: vehicleCreated.client_id,
          vehicle_id: vehicleCreated.id,
          vehicle_snapshot: vehicleSnapshot,
          total_services: 0,
          total_spent: 0,
          maintenance_status: 'em_dia',
          last_service_date: null,
          last_service_type: null,
          last_service_os: null
        }])
        .select()
        .single();

      if (fleetError) {
        console.error('❌ Erro ao criar vínculo na frota:', fleetError);
        throw fleetError;
      }

      console.log('✅ Vínculo criado na frota:', fleetCreated);

      notifications.showCreateSuccess("Veículo");

      await fetchVehicles();
      return vehicleCreated;
    } catch (err: any) {
      console.error('❌ Erro ao criar veículo:', err);
      notifications.showOperationError("criar", "veículo");
      throw err; // Re-throw para o formulário tratar
    }
  };

  const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>) => {
    try {
      if (!user || !session) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: updateError } = await supabase
        .from('vehicles')
        .update(vehicleData)
        .eq('id', id)
        .eq('partner_id', user.id)
        .select(`
          *,
          clients:client_id (
            name,
            email
          )
        `)
        .single();

      if (updateError) throw updateError;

      notifications.showUpdateSuccess("Veículo");

      await fetchVehicles();
      return data;
    } catch (err: any) {
      console.error('Erro ao atualizar veículo:', err);
      notifications.showOperationError("atualizar", "veículo");
      return null;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      if (!user || !session) {
        throw new Error('Usuário não autenticado');
      }

      // 1. Deletar da partner_fleet primeiro (devido ao CASCADE)
      const { error: fleetDeleteError } = await supabase
        .from('partner_fleet')
        .delete()
        .eq('vehicle_id', id)
        .eq('partner_id', user.id);

      if (fleetDeleteError) {
        console.error('Erro ao deletar da frota:', fleetDeleteError);
      }

      // 2. Deletar da tabela vehicles
      const { error: deleteError } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)
        .eq('partner_id', user.id);

      if (deleteError) throw deleteError;

      notifications.showDeleteSuccess("Veículo");

      await fetchVehicles();
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir veículo:', err);
      notifications.showOperationError("excluir", "veículo");
      return false;
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return {
    vehicles,
    loading,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    refetch: fetchVehicles
  };
};