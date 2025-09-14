import { useState, useEffect } from "react";
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
      
      // Since there's no parts table in the current schema,
      // we'll create mock data for demonstration
      console.log('Parts table not found in schema, using mock data');
      
      // Mock data for demonstration
      const mockParts: Part[] = [
        {
          id: '1',
          code: 'FO001',
          name: 'Filtro de Óleo',
          description: 'Filtro de óleo para motor',
          category: 'Filtros',
          brand: 'Mann',
          supplier_id: null,
          cost_price: 25.90,
          sale_price: 35.90,
          stock_quantity: 15,
          min_stock: 5,
          max_stock: 50,
          location: 'Prateleira A1',
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          code: 'PF001',
          name: 'Pastilha de Freio Dianteira',
          description: 'Pastilha de freio para veículos populares',
          category: 'Freios',
          brand: 'TRW',
          supplier_id: null,
          cost_price: 85.00,
          sale_price: 120.00,
          stock_quantity: 8,
          min_stock: 3,
          max_stock: 30,
          location: 'Prateleira B2',
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          code: 'VL001',
          name: 'Válvula Termostática',
          description: 'Válvula para controle de temperatura do motor',
          category: 'Motor',
          brand: 'Wahler',
          supplier_id: null,
          cost_price: 45.00,
          sale_price: 65.00,
          stock_quantity: 12,
          min_stock: 4,
          max_stock: 25,
          location: 'Prateleira C1',
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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