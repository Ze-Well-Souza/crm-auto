import { useState, useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { supabase } from "@/integrations/supabase/client";
import type { Vehicle } from "@/types";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const notifications = useNotifications();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setError('Usuário não autenticado');
        setVehicles([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('vehicles')
        .select(`
          *,
          clients:client_id (
            name,
            email
          )
        `)
        .order('brand', { ascending: true });

      if (fetchError) throw fetchError;
      
      setVehicles(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar veículos:', err);
      setError(err.message || 'Erro inesperado ao carregar veículos');
    } finally {
      setLoading(false);
    }
  };

  const createVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'clients' | 'user_id'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: insertError } = await supabase
        .from('vehicles')
        .insert([{
          ...vehicleData,
          user_id: session.user.id
        }])
        .select(`
          *,
          clients:client_id (
            name,
            email
          )
        `)
        .single();

      if (insertError) throw insertError;

      notifications.showCreateSuccess("Veículo");

      await fetchVehicles();
      return data;
    } catch (err: any) {
      console.error('Erro ao criar veículo:', err);
      notifications.showOperationError("criar", "veículo");
      return null;
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
    refetch: fetchVehicles
  };
};