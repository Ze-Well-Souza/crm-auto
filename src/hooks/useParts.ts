import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Part {
  id: string;
  code: string | null;
  name: string;
  description: string | null;
  category: string | null;
  brand: string | null;
  supplier_id: string | null;
  cost_price: number | null;
  sale_price: number | null;
  stock_quantity: number | null;
  min_stock: number | null;
  max_stock: number | null;
  location: string | null;
  active: boolean | null;
  created_at: string;
  updated_at: string;
  suppliers?: {
    name: string;
    contact_name: string | null;
  };
}

export const useParts = () => {
  const [parts, setParts] = useState<Part[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchParts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('parts')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Erro ao buscar peças:', error);
        setError(error.message);
        return;
      }

      setParts(data);
    } catch (err) {
      console.error('Erro ao buscar peças:', err);
      setError('Erro inesperado ao carregar peças');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  return {
    parts,
    loading,
    error,
    refetch: fetchParts
  };
};