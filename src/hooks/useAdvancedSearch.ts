import { useState, useCallback, useMemo } from "react";
import { SearchFilters } from "@/components/common/SearchAdvanced";

export interface UseAdvancedSearchOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  filterFunctions?: Record<string, (item: T, value: any) => boolean>;
  sortFunction?: (a: T, b: T, sortBy?: string, sortOrder?: 'asc' | 'desc') => number;
}

export interface SearchState {
  filters: SearchFilters;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export const useAdvancedSearch = <T extends Record<string, any>>({
  data,
  searchFields,
  filterFunctions = {},
  sortFunction
}: UseAdvancedSearchOptions<T>) => {
  const [searchState, setSearchState] = useState<SearchState>({
    filters: {},
    sortOrder: 'asc',
    page: 1,
    pageSize: 10
  });

  // Função de busca por texto
  const searchByText = useCallback((item: T, query: string): boolean => {
    if (!query.trim()) return true;
    
    const searchTerm = query.toLowerCase().trim();
    
    return searchFields.some(field => {
      const value = item[field];
      if (value == null) return false;
      
      return String(value).toLowerCase().includes(searchTerm);
    });
  }, [searchFields]);

  // Função de aplicação de filtros
  const applyFilters = useCallback((item: T, filters: SearchFilters): boolean => {
    // Busca por texto
    if (filters.query && !searchByText(item, filters.query)) {
      return false;
    }

    // Aplicar filtros customizados
    for (const [key, value] of Object.entries(filters)) {
      if (key === 'query' || value == null) continue;
      
      const filterFunction = filterFunctions[key];
      if (filterFunction && !filterFunction(item, value)) {
        return false;
      }
      
      // Filtro padrão por igualdade
      if (!filterFunction && item[key] !== value) {
        return false;
      }
    }

    return true;
  }, [searchByText, filterFunctions]);

  // Dados filtrados e ordenados
  const filteredData = useMemo(() => {
    let result = data.filter(item => applyFilters(item, searchState.filters));

    // Aplicar ordenação
    if (sortFunction && searchState.sortBy) {
      result.sort((a, b) => sortFunction(a, b, searchState.sortBy, searchState.sortOrder));
    }

    return result;
  }, [data, searchState.filters, searchState.sortBy, searchState.sortOrder, applyFilters, sortFunction]);

  // Dados paginados
  const paginatedData = useMemo(() => {
    const startIndex = (searchState.page - 1) * searchState.pageSize;
    const endIndex = startIndex + searchState.pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, searchState.page, searchState.pageSize]);

  // Informações de paginação
  const paginationInfo = useMemo(() => {
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / searchState.pageSize);
    const startItem = totalItems > 0 ? (searchState.page - 1) * searchState.pageSize + 1 : 0;
    const endItem = Math.min(searchState.page * searchState.pageSize, totalItems);

    return {
      totalItems,
      totalPages,
      currentPage: searchState.page,
      pageSize: searchState.pageSize,
      startItem,
      endItem,
      hasNextPage: searchState.page < totalPages,
      hasPreviousPage: searchState.page > 1
    };
  }, [filteredData.length, searchState.page, searchState.pageSize]);

  // Handlers
  const handleSearch = useCallback((filters: SearchFilters) => {
    setSearchState(prev => ({
      ...prev,
      filters,
      page: 1 // Reset para primeira página ao buscar
    }));
  }, []);

  const handleSort = useCallback((sortBy: string, sortOrder?: 'asc' | 'desc') => {
    setSearchState(prev => ({
      ...prev,
      sortBy,
      sortOrder: sortOrder || (prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc')
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setSearchState(prev => ({
      ...prev,
      page: Math.max(1, Math.min(page, paginationInfo.totalPages))
    }));
  }, [paginationInfo.totalPages]);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setSearchState(prev => ({
      ...prev,
      pageSize,
      page: 1 // Reset para primeira página ao mudar tamanho
    }));
  }, []);

  const handleReset = useCallback(() => {
    setSearchState({
      filters: {},
      sortOrder: 'asc',
      page: 1,
      pageSize: 10
    });
  }, []);

  // Funções de navegação
  const goToFirstPage = useCallback(() => handlePageChange(1), [handlePageChange]);
  const goToLastPage = useCallback(() => handlePageChange(paginationInfo.totalPages), [handlePageChange, paginationInfo.totalPages]);
  const goToNextPage = useCallback(() => handlePageChange(searchState.page + 1), [handlePageChange, searchState.page]);
  const goToPreviousPage = useCallback(() => handlePageChange(searchState.page - 1), [handlePageChange, searchState.page]);

  return {
    // Dados
    data: paginatedData,
    filteredData,
    allData: data,
    
    // Estado
    searchState,
    paginationInfo,
    
    // Handlers
    handleSearch,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleReset,
    
    // Navegação
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    
    // Utilitários
    isEmpty: paginatedData.length === 0,
    isFiltered: Object.keys(searchState.filters).length > 0,
    hasResults: filteredData.length > 0
  };
};

// Hook especializado para diferentes tipos de dados
export const useClientSearch = (clients: any[]) => {
  return useAdvancedSearch({
    data: clients,
    searchFields: ['name', 'email', 'phone', 'document', 'city'],
    filterFunctions: {
      status: (client, value) => client.status === value,
      city: (client, value) => client.city?.toLowerCase().includes(value.toLowerCase()),
      created_date: (client, dateRange) => {
        if (!dateRange.from || !dateRange.to) return true;
        const clientDate = new Date(client.created_at);
        return clientDate >= dateRange.from && clientDate <= dateRange.to;
      }
    },
    sortFunction: (a, b, sortBy, sortOrder) => {
      const aValue = a[sortBy || 'name'];
      const bValue = b[sortBy || 'name'];
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }
  });
};

export const useVehicleSearch = (vehicles: any[]) => {
  return useAdvancedSearch({
    data: vehicles,
    searchFields: ['brand', 'model', 'license_plate', 'color', 'year'],
    filterFunctions: {
      brand: (vehicle, value) => vehicle.brand?.toLowerCase().includes(value.toLowerCase()),
      fuel_type: (vehicle, value) => vehicle.fuel_type === value,
      year_range: (vehicle, range) => {
        if (!range.min && !range.max) return true;
        const year = parseInt(vehicle.year);
        if (range.min && year < range.min) return false;
        if (range.max && year > range.max) return false;
        return true;
      },
      mileage_range: (vehicle, range) => {
        if (!range.min && !range.max) return true;
        const mileage = parseInt(vehicle.mileage || 0);
        if (range.min && mileage < range.min) return false;
        if (range.max && mileage > range.max) return false;
        return true;
      }
    }
  });
};

export const useAppointmentSearch = (appointments: any[]) => {
  return useAdvancedSearch({
    data: appointments,
    searchFields: ['title', 'description', 'client_name', 'vehicle_info'],
    filterFunctions: {
      status: (appointment, value) => appointment.status === value,
      type: (appointment, value) => appointment.type === value,
      priority: (appointment, value) => appointment.priority === value,
      date_range: (appointment, dateRange) => {
        if (!dateRange.from || !dateRange.to) return true;
        const appointmentDate = new Date(appointment.appointment_date);
        return appointmentDate >= dateRange.from && appointmentDate <= dateRange.to;
      },
      today: (appointment) => {
        const today = new Date();
        const appointmentDate = new Date(appointment.appointment_date);
        return appointmentDate.toDateString() === today.toDateString();
      },
      this_week: (appointment) => {
        const today = new Date();
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
        const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        const appointmentDate = new Date(appointment.appointment_date);
        return appointmentDate >= weekStart && appointmentDate <= weekEnd;
      }
    }
  });
};

export const useFinancialSearch = (transactions: any[]) => {
  return useAdvancedSearch({
    data: transactions,
    searchFields: ['description', 'category', 'payment_method'],
    filterFunctions: {
      type: (transaction, value) => transaction.type === value,
      status: (transaction, value) => transaction.status === value,
      category: (transaction, value) => transaction.category === value,
      payment_method: (transaction, value) => transaction.payment_method === value,
      amount_range: (transaction, range) => {
        if (!range.min && !range.max) return true;
        const amount = parseFloat(transaction.amount || 0);
        if (range.min && amount < range.min) return false;
        if (range.max && amount > range.max) return false;
        return true;
      },
      date_range: (transaction, dateRange) => {
        if (!dateRange.from || !dateRange.to) return true;
        const transactionDate = new Date(transaction.due_date || transaction.created_at);
        return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
      },
      overdue: (transaction) => {
        if (transaction.status === 'paid') return false;
        const dueDate = new Date(transaction.due_date);
        return dueDate < new Date();
      }
    }
  });
};

export const usePartsSearch = (parts: any[]) => {
  return useAdvancedSearch({
    data: parts,
    searchFields: ['name', 'sku', 'description', 'brand', 'supplier'],
    filterFunctions: {
      category: (part, value) => part.category === value,
      status: (part, value) => part.status === value,
      brand: (part, value) => part.brand?.toLowerCase().includes(value.toLowerCase()),
      supplier: (part, value) => part.supplier?.toLowerCase().includes(value.toLowerCase()),
      price_range: (part, range) => {
        if (!range.min && !range.max) return true;
        const price = parseFloat(part.sale_price || 0);
        if (range.min && price < range.min) return false;
        if (range.max && price > range.max) return false;
        return true;
      },
      stock_range: (part, range) => {
        if (!range.min && !range.max) return true;
        const stock = parseInt(part.stock_quantity || 0);
        if (range.min && stock < range.min) return false;
        if (range.max && stock > range.max) return false;
        return true;
      },
      low_stock: (part) => {
        const stock = parseInt(part.stock_quantity || 0);
        const minStock = parseInt(part.min_stock_level || 0);
        return stock <= minStock;
      },
      out_of_stock: (part) => {
        const stock = parseInt(part.stock_quantity || 0);
        return stock === 0;
      }
    }
  });
};