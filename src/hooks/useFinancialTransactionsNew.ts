import { useEffect } from "react";
import { useCrudState, useStandardState } from "@/hooks/useStandardState";
import { useNotifications } from "@/contexts/NotificationContext";
import { supabase } from "@/integrations/supabase/client";
import type { FinancialTransaction, PaymentMethod } from "@/types";

export const useFinancialTransactionsNew = () => {
  const transactionsState = useCrudState<FinancialTransaction>();
  const paymentMethodsState = useStandardState<PaymentMethod[]>();
  const notifications = useNotifications();

  const fetchTransactions = async () => {
    try {
      transactionsState.setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        transactionsState.setError('Usuário não autenticado');
        transactionsState.setData([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('financial_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      transactionsState.setData(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar transações:', err);
      transactionsState.setError(err.message || 'Erro inesperado ao carregar transações financeiras');
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      paymentMethodsState.setLoading(true);
      
      // Payment methods fixos (não dependem de autenticação)
      const mockPaymentMethods: PaymentMethod[] = [
        { id: 'pm-1', name: 'Dinheiro', type: 'cash', active: true, created_at: new Date().toISOString() },
        { id: 'pm-2', name: 'Cartão de Débito', type: 'debit', active: true, created_at: new Date().toISOString() },
        { id: 'pm-3', name: 'Cartão de Crédito', type: 'credit', active: true, created_at: new Date().toISOString() },
        { id: 'pm-4', name: 'PIX', type: 'pix', active: true, created_at: new Date().toISOString() },
        { id: 'pm-5', name: 'Boleto', type: 'boleto', active: true, created_at: new Date().toISOString() },
      ];
      
      paymentMethodsState.setData(mockPaymentMethods);
    } catch (err: any) {
      console.error('Erro ao buscar métodos de pagamento:', err);
      paymentMethodsState.setError(err.message || 'Erro ao carregar métodos de pagamento');
    }
  };

  const createTransaction = async (transactionData: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: insertError } = await supabase
        .from('financial_transactions')
        .insert([{
          ...transactionData,
          user_id: user.id
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      
      transactionsState.addItem(data);
      notifications.showCreateSuccess("Transação");

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar transação';
      transactionsState.setError(errorMessage);
      notifications.showOperationError("criar", "transação", errorMessage);
      throw err;
    }
  };

  const updateTransaction = async (id: string, transactionData: Partial<FinancialTransaction>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('financial_transactions')
        .update(transactionData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      transactionsState.updateItem(id, data);
      notifications.showUpdateSuccess("Transação");

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar transação';
      transactionsState.setError(errorMessage);
      notifications.showOperationError("atualizar", "transação", errorMessage);
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      transactionsState.removeItem(id);
      notifications.showDeleteSuccess("Transação");
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao excluir transação';
      transactionsState.setError(errorMessage);
      notifications.showOperationError("excluir", "transação", errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchPaymentMethods();
  }, []);

  return {
    transactions: transactionsState.data,
    paymentMethods: paymentMethodsState.data,
    loading: transactionsState.loading || paymentMethodsState.loading,
    error: transactionsState.error || paymentMethodsState.error,
    success: transactionsState.success,
    refetch: fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};