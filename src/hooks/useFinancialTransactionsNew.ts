import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { FinancialTransaction, PaymentMethod } from "@/types";
import { mockTransactions, mockPaymentMethods } from "@/utils/mockData";
import { generateId } from "@/utils/formatters";

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
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use centralized mock data
      setTransactions(mockTransactions);
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
      setError('Erro inesperado ao carregar transações financeiras');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      // Use centralized mock data
      setPaymentMethods(mockPaymentMethods);
    } catch (err) {
      console.error('Erro ao buscar métodos de pagamento:', err);
    }
  };

  const createTransaction = async (transactionData: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newTransaction: FinancialTransaction = {
        ...transactionData,
        id: generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Add to mock data
      mockTransactions.push(newTransaction);

      toast({
        title: "Transação criada",
        description: "A transação foi criada com sucesso.",
      });

      await fetchTransactions();
      return newTransaction;
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