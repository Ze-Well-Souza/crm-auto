import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Vehicle {
  id: string;
  client_id: string;
  brand: string;
  model: string;
  year: number | null;
  license_plate: string | null;
  vin: string | null;
  color: string | null;
  fuel_type: string | null;
  engine: string | null;
  mileage: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  clients?: {
    name: string;
    email: string | null;
  };
}

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('vehicles_deprecated')
        .select(`
          *,
          clients_deprecated (
            name,
            email
          )
        `)
        .order('brand', { ascending: true });

      if (error) {
        console.error('Erro ao buscar veículos:', error);
        setError(error.message);
        return;
      }

      setVehicles(data);
    } catch (err) {
      console.error('Erro ao buscar veículos:', err);
      setError('Erro inesperado ao carregar veículos');
    } finally {
      setLoading(false);
    }
  };

  const createVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'clients'>) => {
    try {
      const { data, error } = await supabase
        .from('vehicles_deprecated')
        .insert([vehicleData])
        .select(`
          *,
          clients_deprecated (
            name,
            email
          )
        `)
        .single();

      if (error) {
        console.error('Erro ao criar veículo:', error);
        toast({
          title: "Erro ao criar veículo",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Veículo criado com sucesso",
        description: `${data.brand} ${data.model} foi adicionado ao sistema.`,
      });

      // Atualiza a lista de veículos
      fetchVehicles();
      return data;
    } catch (err) {
      console.error('Erro ao criar veículo:', err);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível criar o veículo.",
        variant: "destructive",
      });
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