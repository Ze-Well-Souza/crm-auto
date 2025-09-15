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

export interface Supplier {
  id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  cnpj: string | null;
  notes: string | null;
  active: boolean | null;
  created_at: string;
  updated_at: string;
}

export const usePartsNew = () => {
  const [parts, setParts] = useState<Part[] | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchParts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('parts')
        .select(`
          *,
          suppliers (
            name,
            contact_name
          )
        `)
        .order('created_at', { ascending: false });

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

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) {
        console.error('Erro ao buscar fornecedores:', error);
        return;
      }

      setSuppliers(data);
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err);
    }
  };

  const createPart = async (partData: Omit<Part, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('parts')
        .insert([partData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Peça criada",
        description: "A peça foi criada com sucesso.",
      });

      await fetchParts();
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar peça';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updatePart = async (id: string, partData: Partial<Part>) => {
    try {
      const { data, error } = await supabase
        .from('parts')
        .update(partData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Peça atualizada",
        description: "A peça foi atualizada com sucesso.",
      });

      await fetchParts();
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar peça';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deletePart = async (id: string) => {
    try {
      const { error } = await supabase
        .from('parts')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Peça excluída",
        description: "A peça foi excluída com sucesso.",
      });

      await fetchParts();
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao excluir peça';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchParts();
    fetchSuppliers();
  }, []);

  return {
    parts,
    suppliers,
    loading,
    error,
    refetch: fetchParts,
    createPart,
    updatePart,
    deletePart,
  };
};