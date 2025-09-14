import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  cpf_cnpj: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('clients_deprecated')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Erro ao buscar clientes:', error);
        setError(error.message);
        return;
      }

      setClients(data);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      setError('Erro inesperado ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('clients_deprecated')
        .insert([clientData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar cliente:', error);
        toast({
          title: "Erro ao criar cliente",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Cliente criado com sucesso",
        description: `${data.name} foi adicionado ao sistema.`,
      });

      // Atualiza a lista de clientes
      fetchClients();
      return data;
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