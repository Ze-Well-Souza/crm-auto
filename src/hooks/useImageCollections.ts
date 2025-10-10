import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { ImageCollection } from '@/types/image-library';

export const useImageCollections = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState<ImageCollection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCollections = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('image_collections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setCollections(data || []);
    } catch (err: any) {
      console.error('Erro ao carregar coleções:', err);
      setError(err.message);
      toast.error('Erro ao carregar coleções');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createCollection = useCallback(async (name: string, description?: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    setIsLoading(true);

    try {
      const { data, error: insertError } = await supabase
        .from('image_collections')
        .insert({
          user_id: user.id,
          name,
          description
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setCollections(prev => [data, ...prev]);
      toast.success('Coleção criada!');
      return data;
    } catch (err: any) {
      console.error('Erro ao criar coleção:', err);
      toast.error('Erro ao criar coleção');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const updateCollection = useCallback(async (id: string, updates: Partial<ImageCollection>) => {
    if (!user) return null;

    setIsLoading(true);

    try {
      const { data, error: updateError } = await supabase
        .from('image_collections')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setCollections(prev => prev.map(col => col.id === id ? data : col));
      toast.success('Coleção atualizada!');
      return data;
    } catch (err: any) {
      console.error('Erro ao atualizar coleção:', err);
      toast.error('Erro ao atualizar coleção');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const deleteCollection = useCallback(async (id: string) => {
    if (!user) return false;

    setIsLoading(true);

    try {
      const { error: deleteError } = await supabase
        .from('image_collections')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setCollections(prev => prev.filter(col => col.id !== id));
      toast.success('Coleção removida!');
      return true;
    } catch (err: any) {
      console.error('Erro ao deletar coleção:', err);
      toast.error('Erro ao deletar coleção');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  return {
    collections,
    isLoading,
    error,
    loadCollections,
    createCollection,
    updateCollection,
    deleteCollection
  };
};
