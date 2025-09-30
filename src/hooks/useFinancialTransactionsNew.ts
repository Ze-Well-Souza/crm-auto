import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCrudState, useStandardState } from "@/hooks/useStandardState";
import type { FinancialTransaction, PaymentMethod } from "@/types";
import { mockTransactions, mockPaymentMethods } from "@/utils/mockData";
import { generateId } from "@/utils/formatters";

export const useFinancialTransactionsNew = () => {
  const transactionsState = useCrudState<FinancialTransaction>();
  const paymentMethodsState = useStandardState<PaymentMethod[]>();
  const { toast } = useToast();

  const fetchTransactions = async () => {
    try {
      transactionsState.setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use centralized mock data
      transactionsState.setData(mockTransactions);
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
      transactionsState.setError('Erro inesperado ao carregar transações financeiras');
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      paymentMethodsState.setLoading(true);
      
      // Use centralized mock data
      paymentMethodsState.setData(mockPaymentMethods);
    } catch (err) {
      console.error('Erro ao buscar métodos de pagamento:', err);
      paymentMethodsState.setError('Erro ao carregar métodos de pagamento');
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
      transactionsState.addItem(newTransaction);

      toast({
        title: "Transação criada",
        description: "A transação foi criada com sucesso.",
      });

      return newTransaction;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar transação';
      transactionsState.setError(errorMessage);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update in mock data
      const index = mockTransactions.findIndex(t => t.id === id);
      if (index !== -1) {
        const updatedTransaction = {
          ...mockTransactions[index],
          ...transactionData,
          updated_at: new Date().toISOString()
        };
        mockTransactions[index] = updatedTransaction;
        transactionsState.updateItem(id, updatedTransaction);
      }

      toast({
        title: "Transação atualizada",
        description: "A transação foi atualizada com sucesso.",
      });

      return mockTransactions[index];
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar transação';
      transactionsState.setError(errorMessage);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Remove from mock data
      const index = mockTransactions.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTransactions.splice(index, 1);
        transactionsState.removeItem(id);
      }

      toast({
        title: "Transação excluída",
        description: "A transação foi excluída com sucesso.",
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao excluir transação';
      transactionsState.setError(errorMessage);
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