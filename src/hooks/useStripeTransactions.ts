import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { supabase } from '@/integrations/supabase/client';

export interface StripeTransaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_method: string;
  description: string;
  created_at: string;
  updated_at: string;
  client_id?: string;
  service_order_id?: string;
  client?: {
    name: string;
    email?: string;
  };
  service_order?: {
    order_number: string;
  };
}

export interface TransactionStats {
  total_revenue: number;
  total_transactions: number;
  successful_payments: number;
  pending_payments: number;
  failed_payments: number;
  card_payments: number;
  pix_payments: number;
  boleto_payments: number;
}

export const useStripeTransactions = () => {
  const [transactions, setTransactions] = useState<StripeTransaction[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('financial_transactions_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'financial_transactions'
      }, () => {
        fetchTransactions();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: fetchError } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          clients:client_id(name, email),
          service_orders:service_order_id(order_number)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (fetchError) throw fetchError;

      const transformedData = (data || []).map(item => ({
        id: item.id,
        amount: item.amount,
        currency: 'BRL',
        status: item.status as any,
        payment_method: item.payment_method || 'card',
        description: item.description,
        created_at: item.created_at,
        updated_at: item.updated_at,
        client_id: item.client_id,
        service_order_id: item.service_order_id,
        client: item.clients as any,
        service_order: item.service_orders as any,
      }));

      setTransactions(transformedData);
      calculateStats(transformedData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError(err.message);
      setTransactions([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: StripeTransaction[]) => {
    const newStats: TransactionStats = {
      total_revenue: data
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + Number(t.amount), 0),
      total_transactions: data.length,
      successful_payments: data.filter(t => t.status === 'completed').length,
      pending_payments: data.filter(t => t.status === 'pending').length,
      failed_payments: data.filter(t => t.status === 'failed').length,
      card_payments: data.filter(t => t.payment_method?.toLowerCase().includes('cartão') || t.payment_method?.toLowerCase().includes('card')).length,
      pix_payments: data.filter(t => t.payment_method?.toLowerCase().includes('pix')).length,
      boleto_payments: data.filter(t => t.payment_method?.toLowerCase().includes('boleto')).length,
    };

    setStats(newStats);
  };

  return {
    transactions,
    stats,
    loading,
    error,
    refetch: fetchTransactions
  };
};
