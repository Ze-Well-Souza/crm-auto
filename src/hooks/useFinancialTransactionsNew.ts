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
      
      // Mock data for demonstration since financial_transactions table is empty
      const mockTransactions: FinancialTransaction[] = [
        {
          id: '1',
          type: 'receita',
          description: 'Troca de óleo - Cliente João',
          amount: 150.00,
          category: 'Serviços Automotivos',
          payment_method: 'Dinheiro',
          due_date: null,
          payment_date: '2025-01-15',
          status: 'pago',
          service_order_id: null,
          client_id: 'client-1',
          notes: 'Pagamento à vista',
          created_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          clients: {
            name: 'João Silva',
            email: 'joao@email.com'
          }
        },
        {
          id: '2',
          type: 'despesa',
          description: 'Compra de filtros de óleo',
          amount: 300.00,
          category: 'Compra de Peças',
          payment_method: 'Cartão de Crédito',
          due_date: null,
          payment_date: '2025-01-14',
          status: 'pago',
          service_order_id: null,
          client_id: null,
          notes: 'Estoque mensal',
          created_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          clients: null
        },
        {
          id: '3',
          type: 'receita',
          description: 'Revisão completa - Cliente Maria',
          amount: 450.00,
          category: 'Manutenção Preventiva',
          payment_method: 'PIX',
          due_date: '2025-01-25',
          payment_date: null,
          status: 'pendente',
          service_order_id: null,
          client_id: 'client-2',
          notes: 'Aguardando pagamento',
          created_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          clients: {
            name: 'Maria Santos',
            email: 'maria@email.com'
          }
        },
        {
          id: '4',
          type: 'despesa',
          description: 'Energia elétrica - Janeiro',
          amount: 280.00,
          category: 'Energia Elétrica',
          payment_method: 'Cartão de Débito',
          due_date: '2025-01-20',
          payment_date: null,
          status: 'pendente',
          service_order_id: null,
          client_id: null,
          notes: 'Conta mensal',
          created_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          clients: null
        }
      ];

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
      // Mock payment methods data for demonstration
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: '1',
          name: 'Dinheiro',
          type: 'dinheiro',
          active: true,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Cartão de Crédito',
          type: 'cartao_credito',
          active: true,
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Cartão de Débito',
          type: 'cartao_debito',
          active: true,
          created_at: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'PIX',
          type: 'pix',
          active: true,
          created_at: new Date().toISOString(),
        },
        {
          id: '5',
          name: 'Transferência Bancária',
          type: 'transferencia',
          active: true,
          created_at: new Date().toISOString(),
        }
      ];

      setPaymentMethods(mockPaymentMethods);
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