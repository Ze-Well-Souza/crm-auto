import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FinancialTransaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  category: string | null;
  payment_method: string | null;
  due_date: string | null;
  payment_date: string | null;
  status: string | null;
  service_order_id: string | null;
  client_id: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  clients?: {
    name: string;
    email: string | null;
  };
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: string | null;
  active: boolean | null;
  created_at: string;
}

export const useFinancialTransactionsNew = () => {
  const [transactions, setTransactions] = useState<FinancialTransaction[] | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          clients (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar transações:', error);
        setError(error.message);
        return;
      }

      setTransactions(data);
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
      setError('Erro inesperado ao carregar transações financeiras');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) {
        console.error('Erro ao buscar métodos de pagamento:', error);
        return;
      }

      setPaymentMethods(data);
    } catch (err) {
      console.error('Erro ao buscar métodos de pagamento:', err);
    }
  };

  const createTransaction = async (transactionData: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([transactionData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Transação criada",
        description: "A transação foi criada com sucesso.",
      });

      await fetchTransactions();
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar transação';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateTransaction = async (id: string, transactionData: Partial<FinancialTransaction>) => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .update(transactionData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Transação atualizada",
        description: "A transação foi atualizada com sucesso.",
      });

      await fetchTransactions();
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar transação';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Transação excluída",
        description: "A transação foi excluída com sucesso.",
      });

      await fetchTransactions();
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao excluir transação';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchPaymentMethods();
  }, []);

  return {
    transactions,
    paymentMethods,
    loading,
    error,
    refetch: fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};