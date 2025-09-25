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
      
      // Mock data for demonstration since parts table is empty
      const mockParts: Part[] = [
        {
          id: '1',
          code: 'FO001',
          name: 'Filtro de Óleo',
          description: 'Filtro de óleo para motor',
          category: 'Filtros',
          brand: 'Mann',
          supplier_id: '1',
          cost_price: 25.90,
          sale_price: 35.90,
          stock_quantity: 15,
          min_stock: 5,
          max_stock: 50,
          location: 'Prateleira A1',
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          suppliers: {
            name: 'Fornecedor ABC',
            contact_name: 'João Silva'
          }
        },
        {
          id: '2',
          code: 'PF001',
          name: 'Pastilha de Freio Dianteira',
          description: 'Pastilha de freio para veículos populares',
          category: 'Freios',
          brand: 'TRW',
          supplier_id: '2',
          cost_price: 85.00,
          sale_price: 120.00,
          stock_quantity: 3,
          min_stock: 5,
          max_stock: 30,
          location: 'Prateleira B2',
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          suppliers: {
            name: 'Peças XYZ Ltda',
            contact_name: 'Maria Santos'
          }
        },
        {
          id: '3',
          code: 'VL001',
          name: 'Válvula Termostática',
          description: 'Válvula para controle de temperatura do motor',
          category: 'Motor',
          brand: 'Wahler',
          supplier_id: '1',
          cost_price: 45.00,
          sale_price: 65.00,
          stock_quantity: 12,
          min_stock: 4,
          max_stock: 25,
          location: 'Prateleira C1',
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          suppliers: {
            name: 'Fornecedor ABC',
            contact_name: 'João Silva'
          }
        },
        {
          id: '4',
          code: 'AM001',
          name: 'Amortecedor Dianteiro',
          description: 'Amortecedor para suspensão dianteira',
          category: 'Suspensão',
          brand: 'Monroe',
          supplier_id: '2',
          cost_price: 180.00,
          sale_price: 250.00,
          stock_quantity: 0,
          min_stock: 2,
          max_stock: 15,
          location: 'Prateleira D1',
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          suppliers: {
            name: 'Peças XYZ Ltda',
            contact_name: 'Maria Santos'
          }
        },
        {
          id: '5',
          code: 'VE001',
          name: 'Vela de Ignição',
          description: 'Vela de ignição NGK padrão',
          category: 'Motor',
          brand: 'NGK',
          supplier_id: '1',
          cost_price: 12.50,
          sale_price: 18.90,
          stock_quantity: 25,
          min_stock: 10,
          max_stock: 100,
          location: 'Prateleira A2',
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          suppliers: {
            name: 'Fornecedor ABC',
            contact_name: 'João Silva'
          }
        }
      ];

      setParts(mockParts);
    } catch (err) {
      console.error('Erro ao buscar peças:', err);
      setError('Erro inesperado ao carregar peças');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      // Mock suppliers data for demonstration
      const mockSuppliers: Supplier[] = [
        {
          id: '1',
          name: 'Fornecedor ABC',
          contact_name: 'João Silva',
          email: 'contato@abc.com',
          phone: '(11) 99999-0001',
          address: 'Rua das Peças, 123',
          city: 'São Paulo',
          state: 'SP',
          zip_code: '01234-567',
          cnpj: '12.345.678/0001-90',
          notes: 'Fornecedor principal de filtros e peças de motor',
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Peças XYZ Ltda',
          contact_name: 'Maria Santos',
          email: 'vendas@xyz.com',
          phone: '(11) 99999-0002',
          address: 'Av. dos Fornecedores, 456',
          city: 'São Paulo',
          state: 'SP',
          zip_code: '01234-890',
          cnpj: '98.765.432/0001-10',
          notes: 'Especialista em freios e suspensão',
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];

      setSuppliers(mockSuppliers);
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