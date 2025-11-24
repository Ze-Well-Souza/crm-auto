import { useState, useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Vehicle } from "@/types";

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
        // Se não autenticado, retornar vazio
        console.log('Usuário não autenticado - sem dados de veículos');
        setVehicles([]);
        setLoading(false);
        return;
      }

      console.log('✅ Usuário autenticado:', user.id);

      // Buscar veículos da frota do parceiro (partner_fleet) com JOIN em vehicles
      const { data: fleetData, error: fetchError } = await supabase
        .from('crm_fleet')
        .select(`
          *,
          crm_vehicles:vehicle_id (
            *,
            crm_clients:client_id (
              name,
              email
            )
          )
        `)
        .eq('partner_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      console.log('📊 Dados da frota retornados:', fleetData);

      // Transformar dados para o formato esperado (Vehicle[])
      const vehiclesData = fleetData?.map((fleet: any) => ({
        ...fleet.crm_vehicles,
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

      console.log('🚗 Veículos processados:', vehiclesData);

      // Usar apenas dados reais do banco
      setVehicles(vehiclesData);
    } catch (err: any) {
      console.error('Erro ao buscar veículos:', err);
      // Em caso de erro, retornar vazio e mostrar erro
      setVehicles([]);
      setError(err.message || 'Erro ao buscar veículos');
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
        .from('crm_vehicles')
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
        .from('crm_fleet')
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
        .from('crm_vehicles')
        .update(vehicleData)
        .eq('id', id)
        .eq('partner_id', user.id)
        .select()
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
        .from('crm_fleet')
        .delete()
        .eq('vehicle_id', id)
        .eq('partner_id', user.id);

      if (fleetDeleteError) {
        console.error('Erro ao deletar da frota:', fleetDeleteError);
      }

      // 2. Deletar da tabela vehicles
      const { error: deleteError } = await supabase
        .from('crm_vehicles')
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