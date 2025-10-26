import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Client } from "@/types";

export const useClients = () => {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Usuário não autenticado');
        setClients([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;
      
      setClients(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar clientes:', err);
      setError(err.message || 'Erro inesperado ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: insertError } = await supabase
        .from('clients')
        .insert([{
          ...clientData,
          user_id: user.id
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: "Cliente criado com sucesso",
        description: `${data.name} foi adicionado ao sistema.`,
      });

      await fetchClients();
      return data;
    } catch (err: any) {
      console.error('Erro ao criar cliente:', err);
      toast({
        title: "Erro ao criar cliente",
        description: err.message || "Não foi possível criar o cliente.",
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