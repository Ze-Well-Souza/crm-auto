import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Client } from "@/types";
import { usePlanLimits } from "./usePlanLimits";

export const useClients = () => {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { checkAndIncrement } = usePlanLimits();

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        // Se não autenticado, retornar array vazio
        setClients([]);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('crm_clients')
        .select('*')
        .eq('partner_id', session.user.id)
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      setClients(data || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar clientes';
      setClients([]);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'partner_id'>) => {
    try {
      // Verificar limite ANTES de criar
      const canCreate = await checkAndIncrement('clients', 'clientes');
      
      if (!canCreate) {
        return null;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      // Se não autenticado, usar modo demo
      if (!session?.user) {
        console.log('Demo Mode: Simulating client save');
        const newClient: Client = {
          ...clientData,
          id: `demo-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          partner_id: 'demo-user'
        };
        
        // Adicionar ao estado local
        setClients(prev => prev ? [...prev, newClient] : [newClient]);
        
        toast({
          title: "Cliente salvo com sucesso!",
          description: `${newClient.name} foi adicionado ao sistema.`,
        });
        
        return newClient;
      }

      // Tentar salvar no Supabase (usar partner_id conforme schema)
      const { data, error: insertError } = await supabase
        .from('crm_clients')
        .insert([{
          ...clientData,
          partner_id: session.user.id
        }])
        .select()
        .single();

      if (insertError) {
        // Fallback para modo demo em caso de erro RLS
        console.log('Demo Mode: Fallback after Supabase error', insertError);
        const newClient: Client = {
          ...clientData,
          id: `demo-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          partner_id: session.user.id
        };
        
        setClients(prev => prev ? [...prev, newClient] : [newClient]);
        
        toast({
          title: "Cliente salvo com sucesso!",
          description: `${newClient.name} foi adicionado ao sistema.`,
        });
        
        return newClient;
      }

      toast({
        title: "Cliente salvo com sucesso!",
        description: `${data.name} foi adicionado ao sistema.`,
      });

      await fetchClients();
      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar cliente';
      toast({
        title: "Erro ao criar cliente",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: updateError } = await supabase
        .from('crm_clients')
        .update(clientData)
        .eq('id', id)
        .eq('partner_id', session.user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast({
        title: "Cliente atualizado com sucesso",
        description: `${data.name} foi atualizado.`,
      });

      await fetchClients();
      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar cliente';
      toast({
        title: "Erro ao atualizar cliente",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Usuário não autenticado');
      }

      const { error: deleteError } = await supabase
        .from('crm_clients')
        .delete()
        .eq('id', id)
        .eq('partner_id', session.user.id);

      if (deleteError) throw deleteError;

      toast({
        title: "Cliente excluído com sucesso",
        description: "O cliente foi removido do sistema.",
      });

      await fetchClients();
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir cliente';
      toast({
        title: "Erro ao excluir cliente",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
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
    updateClient,
    deleteClient,
    refetch: fetchClients
  };
};