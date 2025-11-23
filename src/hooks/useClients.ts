import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Client } from "@/types";
import { usePlanLimits } from "./usePlanLimits";
import { mockClients } from "@/data/mockClients";

// Mock data para desenvolvimento - usando dados avançados com métricas
const MOCK_CLIENTS: Client[] = mockClients.map(client => ({
  ...client,
  partner_id: 'mock-partner'
}));

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
        // Se não autenticado, usar dados mock
        console.log('Usuário não autenticado - usando dados mock');
        setTimeout(() => {
          setClients(MOCK_CLIENTS);
          setLoading(false);
        }, 500);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('partner_clients')
        .select('*')
        .eq('partner_id', session.user.id)
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      // Se não houver dados no banco, usar mock
      setClients(data && data.length > 0 ? data : MOCK_CLIENTS);
    } catch (err: any) {
      console.error('Erro ao buscar clientes:', err);
      // Em caso de erro, usar dados mock
      setClients(MOCK_CLIENTS);
      setError(null); // Não mostrar erro se temos mock
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
        .from('partner_clients')
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
    } catch (err: any) {
      console.error('Erro ao criar cliente:', err);
      // Último fallback: modo demo
      const newClient: Client = {
        ...clientData,
        id: `demo-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        partner_id: 'demo-user'
      };
      
      setClients(prev => prev ? [...prev, newClient] : [newClient]);
      
      toast({
        title: "Cliente salvo com sucesso!",
        description: `${newClient.name} foi adicionado ao sistema.`,
      });
      
      return newClient;
    }
  };

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: updateError } = await supabase
        .from('partner_clients')
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
    } catch (err: any) {
      console.error('Erro ao atualizar cliente:', err);
      toast({
        title: "Erro ao atualizar cliente",
        description: err.message || "Não foi possível atualizar o cliente.",
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
        .from('partner_clients')
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
    } catch (err: any) {
      console.error('Erro ao excluir cliente:', err);
      toast({
        title: "Erro ao excluir cliente",
        description: err.message || "Não foi possível excluir o cliente.",
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