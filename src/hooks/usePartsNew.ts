import { useEffect } from "react";
import { useCrudState, useStandardState } from "@/hooks/useStandardState";
import { useNotifications } from "@/contexts/NotificationContext";
import type { Part, Supplier } from "@/types";
import { mockParts, mockSuppliers } from "@/utils/mockData";
import { generateId } from "@/utils/formatters";

export const usePartsNew = () => {
  const partsState = useCrudState<Part>();
  const suppliersState = useStandardState<Supplier[]>();
  const notifications = useNotifications();

  const fetchParts = async () => {
    try {
      partsState.setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use centralized mock data
      partsState.setData(mockParts);
    } catch (err) {
      console.error('Erro ao buscar peças:', err);
      partsState.setError('Erro inesperado ao carregar peças');
    }
  };

  const fetchSuppliers = async () => {
    try {
      suppliersState.setLoading(true);
      
      // Use centralized mock data
      suppliersState.setData(mockSuppliers);
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err);
      suppliersState.setError('Erro ao carregar fornecedores');
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
      partsState.addItem(newPart);

      notifications.showCreateSuccess("Peça");

      return newPart;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar peça';
      partsState.setError(errorMessage);
      notifications.showOperationError("criar", "peça", errorMessage);
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
        const updatedPart = {
          ...mockParts[index],
          ...partData,
          updated_at: new Date().toISOString()
        };
        mockParts[index] = updatedPart;
        partsState.updateItem(id, updatedPart);
      }

      notifications.showUpdateSuccess("Peça");

      return mockParts[index];
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar peça';
      partsState.setError(errorMessage);
      notifications.showOperationError("atualizar", "peça", errorMessage);
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
        partsState.removeItem(id);
      }

      notifications.showDeleteSuccess("Peça");
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao excluir peça';
      partsState.setError(errorMessage);
      notifications.showOperationError("excluir", "peça", errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchParts();
    fetchSuppliers();
  }, []);

  return {
    parts: partsState.data,
    suppliers: suppliersState.data,
    loading: partsState.loading || suppliersState.loading,
    error: partsState.error || suppliersState.error,
    success: partsState.success,
    refetch: fetchParts,
    createPart,
    updatePart,
    deletePart,
  };
};