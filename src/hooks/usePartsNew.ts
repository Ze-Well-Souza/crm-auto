import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Part, Supplier } from "@/types";
import { mockParts, mockSuppliers } from "@/utils/mockData";
import { generateId } from "@/utils/formatters";

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
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use centralized mock data
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
      // Use centralized mock data
      setSuppliers(mockSuppliers);
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err);
    }
  };

  const createPart = async (partData: Omit<Part, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newPart: Part = {
        ...partData,
        id: generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Add to mock data
      mockParts.push(newPart);

      toast({
        title: "Peça criada",
        description: "A peça foi criada com sucesso.",
      });

      await fetchParts();
      return newPart;
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update in mock data
      const index = mockParts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockParts[index] = {
          ...mockParts[index],
          ...partData,
          updated_at: new Date().toISOString()
        };
      }

      toast({
        title: "Peça atualizada",
        description: "A peça foi atualizada com sucesso.",
      });

      await fetchParts();
      return mockParts[index];
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Remove from mock data
      const index = mockParts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockParts.splice(index, 1);
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