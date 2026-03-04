import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import type { ImageLibraryItem, ImageFilters } from '@/types/image-library';

export const useImageLibrary = () => {
  const { user } = useAuth();
  const [images, setImages] = useState<ImageLibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImages = useCallback(async (filters?: ImageFilters) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('image_library')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filters?.category) query = query.eq('category', filters.category);
      if (filters?.collection_id) query = query.eq('collection_id', filters.collection_id);
      if (filters?.storage_type) query = query.eq('storage_type', filters.storage_type);
      if (filters?.search) query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      if (filters?.tags && filters.tags.length > 0) query = query.contains('tags', filters.tags);

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setImages(data || []);
    } catch (err: any) {
      logger.error('Erro ao carregar imagens:', err);
      setError(err.message);
      toast.error('Erro ao carregar imagens');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const uploadImage = useCallback(async (file: File, metadata: Pick<ImageLibraryItem, 'title' | 'description' | 'alt_text' | 'category' | 'tags' | 'collection_id'>) => {
    if (!user) { toast.error('Usuário não autenticado'); return null; }
    setIsLoading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('image-library')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('image-library')
        .getPublicUrl(fileName);

      const insertData = {
        user_id: user.id, storage_type: 'supabase', file_path: publicUrl,
        file_size: file.size, file_type: file.type, is_favorite: false, is_public: false,
        ...metadata
      };

      const { data, error: insertError } = await supabase
        .from('image_library').insert(insertData).select().single();

      if (insertError) throw insertError;

      setImages(prev => [data, ...prev]);
      toast.success('Imagem enviada com sucesso!');
      return data;
    } catch (err: any) {
      logger.error('Erro no upload de imagem:', err);
      toast.error(err.message || 'Erro ao enviar imagem');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addImageUrl = useCallback(async (url: string, metadata: Pick<ImageLibraryItem, 'title' | 'description' | 'alt_text' | 'category' | 'tags' | 'collection_id'>) => {
    if (!user) { toast.error('Usuário não autenticado'); return null; }
    setIsLoading(true);

    try {
      const { data, error: insertError } = await supabase
        .from('image_library')
        .insert({ user_id: user.id, storage_type: 'url', external_url: url, is_favorite: false, is_public: false, ...metadata })
        .select().single();
      if (insertError) throw insertError;
      setImages(prev => [data, ...prev]);
      toast.success('Imagem adicionada com sucesso!');
      return data;
    } catch (err: any) {
      logger.error('Erro ao adicionar imagem:', err);
      toast.error('Erro ao adicionar imagem');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const updateImage = useCallback(async (id: string, updates: Partial<ImageLibraryItem>) => {
    if (!user) return null;
    setIsLoading(true);
    try {
      const { data, error: updateError } = await supabase
        .from('image_library').update(updates).eq('id', id).eq('user_id', user.id).select().single();
      if (updateError) throw updateError;
      setImages(prev => prev.map(img => img.id === id ? data : img));
      toast.success('Imagem atualizada!');
      return data;
    } catch (err: any) {
      logger.error('Erro ao atualizar imagem:', err);
      toast.error('Erro ao atualizar imagem');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const deleteImage = useCallback(async (id: string, storageUrl?: string) => {
    if (!user) return false;
    setIsLoading(true);
    try {
      if (storageUrl && storageUrl.includes('image-library/object/public')) {
        const path = storageUrl.split('/image-library/object/public/image-library/').pop();
        if (path) await supabase.storage.from('image-library').remove([path]);
      }
      const { error: deleteError } = await supabase
        .from('image_library').delete().eq('id', id).eq('user_id', user.id);
      if (deleteError) throw deleteError;
      setImages(prev => prev.filter(img => img.id !== id));
      toast.success('Imagem removida!');
      return true;
    } catch (err: any) {
      logger.error('Erro ao deletar imagem:', err);
      toast.error('Erro ao deletar imagem');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const trackImageUsage = useCallback(async (imageId: string, usedIn: string, context?: Record<string, any>) => {
    if (!user) return;
    try {
      await supabase.rpc('increment_image_usage', { image_id: imageId });
      await supabase.from('image_usage_log').insert({ image_id: imageId, user_id: user.id, used_in: usedIn, context });
    } catch (err) {
      logger.error('Erro ao registrar uso:', err);
    }
  }, [user]);

  useEffect(() => { loadImages(); }, [loadImages]);

  return { images, isLoading, error, loadImages, uploadImage, addImageUrl, updateImage, deleteImage, trackImageUsage };
};