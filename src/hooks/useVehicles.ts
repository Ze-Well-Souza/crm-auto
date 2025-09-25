import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Vehicle } from "@/types";
import { mockClients } from "@/utils/mockData";
import { generateId } from "@/utils/formatters";

// Mock vehicles data
const mockVehicles: Vehicle[] = [
  {
    id: generateId(),
    client_id: mockClients[0]?.id || generateId(),
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
    license_plate: 'ABC-1234',
    vin: '9BWZZZ377VT012345',
    color: 'Branco',
    fuel_type: 'Flex',
    engine: '2.0 16V',
    mileage: 45000,
    notes: 'Veículo em bom estado',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    clients: {
      name: mockClients[0]?.name || 'João Silva',
      email: mockClients[0]?.email || 'joao@email.com'
    }
  },
  {
    id: generateId(),
    client_id: mockClients[1]?.id || generateId(),
    brand: 'Honda',
    model: 'Civic',
    year: 2019,
    license_plate: 'DEF-5678',
    vin: '1HGBH41JXMN109186',
    color: 'Prata',
    fuel_type: 'Gasolina',
    engine: '1.8 16V',
    mileage: 62000,
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    clients: {
      name: mockClients[1]?.name || 'Maria Santos',
      email: mockClients[1]?.email || 'maria@email.com'
    }
  }
];

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data sorted by brand
      const sortedVehicles = [...mockVehicles].sort((a, b) => a.brand.localeCompare(b.brand));
      setVehicles(sortedVehicles);
    } catch (err) {
      console.error('Erro ao buscar veículos:', err);
      setError('Erro inesperado ao carregar veículos');
    } finally {
      setLoading(false);
    }
  };

  const createVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'clients'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const clientData = mockClients.find(c => c.id === vehicleData.client_id);
      
      const newVehicle: Vehicle = {
        ...vehicleData,
        id: generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        clients: clientData ? {
          name: clientData.name,
          email: clientData.email
        } : undefined
      };
      
      // Add to mock data
      mockVehicles.push(newVehicle);

      toast({
        title: "Veículo criado com sucesso",
        description: `${newVehicle.brand} ${newVehicle.model} foi adicionado ao sistema.`,
      });

      // Atualiza a lista de veículos
      fetchVehicles();
      return newVehicle;
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