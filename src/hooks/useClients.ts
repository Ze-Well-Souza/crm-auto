import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Client } from "@/types";
import { mockClients } from "@/utils/mockData";

export const useClients = () => {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data for demonstration
      const sortedClients = [...mockClients].sort((a, b) => a.name.localeCompare(b.name));
      setClients(sortedClients);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      setError('Erro inesperado ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newClient: Client = {
        ...clientData,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Add to mock data
      mockClients.push(newClient);

      toast({
        title: "Cliente criado com sucesso",
        description: `${newClient.name} foi adicionado ao sistema.`,
      });

      // Atualiza a lista de clientes
      fetchClients();
      return newClient;
    } catch (err) {
      console.error('Erro ao criar cliente:', err);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível criar o cliente.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    error,
    createClient,
    refetch: fetchClients
  };
};