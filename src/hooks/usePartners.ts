import { useCollectionState } from './useCollectionState';
import { useNotifications } from '@/contexts/NotificationContext';
import { Partner } from '@/types';
import { CreatePartnerInput, UpdatePartnerInput } from '@/schemas/partner.schema';

export const usePartners = () => {
  const { showSuccess, showError } = useNotifications();
  
  const {
    items: partners,
    filteredItems: filteredPartners,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    paginatedItems,
    addItem,
    updateItem,
    deleteItem,
    setItems,
    setFilteredItems,
  } = useCollectionState<Partner>({
    storageKey: 'partners',
    itemsPerPage: 10,
  });

  const createPartner = async (data: CreatePartnerInput) => {
    try {
      const newPartner: Partner = {
        id: crypto.randomUUID(),
        name: data.name,
        cnpj: data.cnpj || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        zip_code: data.zip_code || null,
        category: data.category || null,
        status: data.status || null,
        rating: data.rating || null,
        orders_count: 0,
        total_revenue: 0,
        marketplace_id: data.marketplace_id || null,
        notes: data.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      addItem(newPartner);
      showSuccess('Parceiro cadastrado com sucesso!');
      return newPartner;
    } catch (err) {
      showError('Erro ao cadastrar parceiro');
      throw err;
    }
  };

  const updatePartner = async (id: string, data: UpdatePartnerInput) => {
    try {
      updateItem(id, {
        ...data,
        updated_at: new Date().toISOString(),
      });
      showSuccess('Parceiro atualizado com sucesso!');
    } catch (err) {
      showError('Erro ao atualizar parceiro');
      throw err;
    }
  };

  const deletePartner = async (id: string) => {
    try {
      deleteItem(id);
      showSuccess('Parceiro removido com sucesso!');
    } catch (err) {
      showError('Erro ao remover parceiro');
      throw err;
    }
  };

  const filterPartners = (filters: {
    category?: string;
    status?: string;
    minRating?: number;
  }) => {
    let filtered = [...partners];

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    if (filters.minRating) {
      filtered = filtered.filter(p => p.rating && p.rating >= filters.minRating!);
    }

    setFilteredItems(filtered);
  };

  const getPartnerById = (id: string) => {
    return partners.find(p => p.id === id);
  };

  return {
    partners,
    filteredPartners,
    paginatedPartners: paginatedItems,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    createPartner,
    updatePartner,
    deletePartner,
    filterPartners,
    getPartnerById,
  };
};
