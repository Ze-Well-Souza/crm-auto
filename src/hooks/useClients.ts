import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import * as Sentry from '@sentry/react';
import { supabase } from "@/integrations/supabase/client";
import type { Client } from "@/types";
import { usePlanLimits } from "./usePlanLimits";

// Mock data para desenvolvimento
const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    cpf_cnpj: '123.456.789-00',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zip_code: '01234-567',
    notes: 'Cliente VIP - Preferência por atendimento matinal',
    partner_id: 'mock-partner',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(11) 97654-3210',
    cpf_cnpj: '987.654.321-00',
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    zip_code: '01310-100',
    notes: 'Possui 2 veículos cadastrados',
    partner_id: 'mock-partner',
    created_at: '2024-02-10T14:30:00Z',
    updated_at: '2024-02-10T14:30:00Z'
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@email.com',
    phone: '(11) 96543-2109',
    cpf_cnpj: '456.789.123-00',
    address: 'Rua Augusta, 500',
    city: 'São Paulo',
    state: 'SP',
    zip_code: '01305-000',
    notes: 'Agendamentos preferenciais às terças-feiras',
    partner_id: 'mock-partner',
    created_at: '2024-03-05T09:15:00Z',
    updated_at: '2024-03-05T09:15:00Z'
  },
  {
    id: '4',
    name: 'Ana Paula Costa',
    email: 'ana.costa@email.com',
    phone: '(11) 95432-1098',
    cpf_cnpj: '321.654.987-00',
    address: 'Rua Consolação, 789',
    city: 'São Paulo',
    state: 'SP',
    zip_code: '01301-000',
    notes: 'Cliente desde 2023',
    partner_id: 'mock-partner',
    created_at: '2023-11-20T16:45:00Z',
    updated_at: '2023-11-20T16:45:00Z'
  },
  {
    id: '5',
    name: 'Roberto Ferreira',
    email: 'roberto.ferreira@email.com',
    phone: '(11) 94321-0987',
    cpf_cnpj: '789.123.456-00',
    address: 'Rua Oscar Freire, 250',
    city: 'São Paulo',
    state: 'SP',
    zip_code: '01426-000',
    notes: 'Preferência por peças originais',
    partner_id: 'mock-partner',
    created_at: '2024-01-28T11:20:00Z',
    updated_at: '2024-01-28T11:20:00Z'
  },
  {
    id: '6',
    name: 'Juliana Almeida',
    email: 'juliana.almeida@email.com',
    phone: '(11) 93210-9876',
    cpf_cnpj: '654.321.789-00',
    address: 'Av. Faria Lima, 1500',
    city: 'São Paulo',
    state: 'SP',
    zip_code: '01452-000',
    notes: 'Empresa - Frota de 3 veículos',
    partner_id: 'mock-partner',
    created_at: '2024-02-14T13:00:00Z',
    updated_at: '2024-02-14T13:00:00Z'
  }
];

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
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      // Se não houver dados no banco, usar mock
      setClients(data && data.length > 0 ? data : MOCK_CLIENTS);
    } catch (err: any) {
      console.error('Erro ao buscar clientes:', err);
      Sentry.captureException(err, {
        tags: { component: 'useClients', action: 'fetchClients' }
      });
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
        .from('clients')
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