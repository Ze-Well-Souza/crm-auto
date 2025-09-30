import { useState } from "react";

// Interface padrão para estados assíncronos
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Hook padrão para gerenciar estados assíncronos
export const useStandardState = <T>() => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false
  });

  // Função para iniciar loading
  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: null, success: false }));
  };

  // Função para definir dados com sucesso
  const setData = (data: T) => {
    setState({ data, loading: false, error: null, success: true });
  };

  // Função para definir erro
  const setError = (error: string) => {
    setState(prev => ({ ...prev, loading: false, error, success: false }));
  };

  // Função para resetar estado
  const reset = () => {
    setState({ data: null, loading: false, error: null, success: false });
  };

  // Função para atualizar estado completo
  const updateState = (updates: Partial<AsyncState<T>>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return {
    ...state,
    setLoading,
    setData,
    setError,
    reset,
    updateState
  };
};

// Hook específico para operações CRUD
export const useCrudState = <T>() => {
  const standardState = useStandardState<T[]>();
  
  const addItem = (item: T) => {
    if (standardState.data) {
      standardState.setData([...standardState.data, item]);
    } else {
      standardState.setData([item]);
    }
  };

  const updateItem = (id: string, updatedItem: T) => {
    if (standardState.data) {
      const updatedData = standardState.data.map((item: any) => 
        item.id === id ? updatedItem : item
      );
      standardState.setData(updatedData);
    }
  };

  const removeItem = (id: string) => {
    if (standardState.data) {
      const filteredData = standardState.data.filter((item: any) => item.id !== id);
      standardState.setData(filteredData);
    }
  };

  return {
    ...standardState,
    addItem,
    updateItem,
    removeItem
  };
};