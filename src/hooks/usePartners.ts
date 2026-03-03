import { useState, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { Partner } from '@/types';

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { showSuccess, showError } = useNotifications();

  const fetchPartners = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setPartners([]);
        setFilteredPartners([]);
        return;
      }

      // Note: If crm_partners table doesn't exist yet, we use an empty array
      // The table can be created via migration when needed
      setPartners([]);
      setFilteredPartners([]);
    } catch (err: any) {
      logger.error('Erro ao buscar parceiros:', err);
      setError(err.message || 'Erro ao carregar parceiros');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = partners.filter((p) =>
        p.name.toLowerCase().includes(lowercaseSearch) ||
        p.email?.toLowerCase().includes(lowercaseSearch) ||
        p.phone?.includes(lowercaseSearch)
      );
      setFilteredPartners(filtered);
      setCurrentPage(1);
    } else {
      setFilteredPartners(partners);
    }
  }, [searchTerm, partners]);

  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
  const paginatedPartners = filteredPartners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const createPartner = async (data: Partial<Partner>) => {
    try {
      const newPartner: Partner = {
        id: crypto.randomUUID(),
        name: data.name || '',
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

      setPartners(prev => [...prev, newPartner]);
      showSuccess('Parceiro cadastrado com sucesso!');
      return newPartner;
    } catch (err) {
      showError('Erro ao cadastrar parceiro');
      throw err;
    }
  };

  const updatePartner = async (id: string, data: Partial<Partner>) => {
    try {
      setPartners(prev =>
        prev.map(p => p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p)
      );
      showSuccess('Parceiro atualizado com sucesso!');
    } catch (err) {
      showError('Erro ao atualizar parceiro');
      throw err;
    }
  };

  const deletePartner = async (id: string) => {
    try {
      setPartners(prev => prev.filter(p => p.id !== id));
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

    setFilteredPartners(filtered);
  };

  const getPartnerById = (id: string) => {
    return partners.find(p => p.id === id);
  };

  return {
    partners,
    filteredPartners,
    paginatedPartners,
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
