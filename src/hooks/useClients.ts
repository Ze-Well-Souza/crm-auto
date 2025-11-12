import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import * as Sentry from '@sentry/react';
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
      Sentry.captureException(err, {
        tags: { component: 'useClients', action: 'fetchClients' }
      });
      setError(err.message || 'Erro inesperado ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      // Verificar limite ANTES de criar
      const canCreate = await checkAndIncrement('clients', 'clientes');
      
      if (!canCreate) {
        return null;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: insertError } = await supabase
        .from('clients')
        .insert([{
          ...clientData,
          user_id: session.user.id
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

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: updateError } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .eq('user_id', session.user.id)
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
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

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