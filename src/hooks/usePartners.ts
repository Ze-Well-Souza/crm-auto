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

      const { data, error: fetchError } = await supabase
        .from('crm_partners')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const mapped: Partner[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        cnpj: p.cnpj,
        email: p.email,
        phone: p.phone,
        address: p.address,
        city: p.city,
        state: p.state,
        zip_code: p.zip_code,
        category: p.category,
        status: p.status,
        rating: p.rating,
        orders_count: p.orders_count,
        total_revenue: p.total_revenue,
        marketplace_id: p.marketplace_id,
        notes: p.notes,
        created_at: p.created_at,
        updated_at: p.updated_at,
      }));

      setPartners(mapped);
      setFilteredPartners(mapped);
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Usuário não autenticado');

      const { data: inserted, error: insertError } = await supabase
        .from('crm_partners')
        .insert([{
          name: data.name || '',
          cnpj: data.cnpj || null,
          email: data.email || null,
          phone: data.phone || null,
          address: data.address || null,
          city: data.city || null,
          state: data.state || null,
          zip_code: data.zip_code || null,
          category: data.category || null,
          status: data.status || 'ativo',
          rating: data.rating || null,
          marketplace_id: data.marketplace_id || null,
          notes: data.notes || null,
          user_id: session.user.id,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      showSuccess('Parceiro cadastrado com sucesso!');
      await fetchPartners();
      return inserted;
    } catch (err: any) {
      logger.error('Erro ao cadastrar parceiro:', err);
      showError('Erro ao cadastrar parceiro');
      throw err;
    }
  };

  const updatePartner = async (id: string, data: Partial<Partner>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Usuário não autenticado');

      const { error: updateError } = await supabase
        .from('crm_partners')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (updateError) throw updateError;

      showSuccess('Parceiro atualizado com sucesso!');
      await fetchPartners();
    } catch (err: any) {
      logger.error('Erro ao atualizar parceiro:', err);
      showError('Erro ao atualizar parceiro');
      throw err;
    }
  };

  const deletePartner = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Usuário não autenticado');

      const { error: deleteError } = await supabase
        .from('crm_partners')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (deleteError) throw deleteError;

      showSuccess('Parceiro removido com sucesso!');
      await fetchPartners();
    } catch (err: any) {
      logger.error('Erro ao remover parceiro:', err);
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
    if (filters.category) filtered = filtered.filter(p => p.category === filters.category);
    if (filters.status) filtered = filtered.filter(p => p.status === filters.status);
    if (filters.minRating) filtered = filtered.filter(p => p.rating && p.rating >= filters.minRating!);
    setFilteredPartners(filtered);
  };

  const getPartnerById = (id: string) => partners.find(p => p.id === id);

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
