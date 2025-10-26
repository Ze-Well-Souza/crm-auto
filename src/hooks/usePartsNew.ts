import { useEffect } from "react";
import { useCrudState, useStandardState } from "@/hooks/useStandardState";
import { useNotifications } from "@/contexts/NotificationContext";
import { supabase } from "@/integrations/supabase/client";
import type { Part, Supplier } from "@/types";

export const usePartsNew = () => {
  const partsState = useCrudState<Part>();
  const suppliersState = useStandardState<Supplier[]>();
  const notifications = useNotifications();

  const fetchParts = async () => {
    try {
      partsState.setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        partsState.setError('Usuário não autenticado');
        partsState.setData([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('parts')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;
      
      partsState.setData(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar peças:', err);
      partsState.setError(err.message || 'Erro inesperado ao carregar peças');
    }
  };

  const fetchSuppliers = async () => {
    try {
      suppliersState.setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        suppliersState.setError('Usuário não autenticado');
        suppliersState.setData([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('suppliers')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;
      
      suppliersState.setData(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar fornecedores:', err);
      suppliersState.setError(err.message || 'Erro ao carregar fornecedores');
    }
  };

  const createPart = async (partData: Omit<Part, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: insertError } = await supabase
        .from('parts')
        .insert([{
          ...partData,
          user_id: session.user.id
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      
      partsState.addItem(data);
      notifications.showCreateSuccess("Peça");

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar peça';
      partsState.setError(errorMessage);
      notifications.showOperationError("criar", "peça", errorMessage);
      throw err;
    }
  };

  const updatePart = async (id: string, partData: Partial<Part>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('parts')
        .update(partData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      partsState.updateItem(id, data);
      notifications.showUpdateSuccess("Peça");

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar peça';
      partsState.setError(errorMessage);
      notifications.showOperationError("atualizar", "peça", errorMessage);
      throw err;
    }
  };

  const deletePart = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('parts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      partsState.removeItem(id);
      notifications.showDeleteSuccess("Peça");
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao excluir peça';
      partsState.setError(errorMessage);
      notifications.showOperationError("excluir", "peça", errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchParts();
    fetchSuppliers();
  }, []);

  return {
    parts: partsState.data,
    suppliers: suppliersState.data,
    loading: partsState.loading || suppliersState.loading,
    error: partsState.error || suppliersState.error,
    success: partsState.success,
    refetch: fetchParts,
    createPart,
    updatePart,
    deletePart,
  };
};