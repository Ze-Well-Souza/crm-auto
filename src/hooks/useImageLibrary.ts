import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { ImageLibraryItem, ImageFilters } from '@/types/image-library';

export const useImageLibrary = () => {
  const { user } = useAuth();
  const [images, setImages] = useState<ImageLibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar imagens
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

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.collection_id) {
        query = query.eq('collection_id', filters.collection_id);
      }

      if (filters?.storage_type) {
        query = query.eq('storage_type', filters.storage_type);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setImages(data || []);
    } catch (err: any) {
      console.error('Erro ao carregar imagens:', err);
      setError(err.message);
      toast.error('Erro ao carregar imagens');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Upload de imagem
  const uploadImage = useCallback(async (file: File, metadata: Omit<ImageLibraryItem, 'id' | 'user_id' | 'storage_url' | 'thumbnail_url' | 'usage_count' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    setIsLoading(true);

    try {
      // Upload do arquivo para o storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('image-library')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('image-library')
        .getPublicUrl(fileName);

      // Criar registro no banco
      const { data, error: insertError } = await supabase
        .from('image_library')
        .insert({
          user_id: user.id,
          storage_type: 'supabase',
          storage_url: publicUrl,
          file_size: file.size,
          format: file.type,
          ...metadata
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setImages(prev => [data, ...prev]);
      toast.success('Imagem enviada com sucesso!');
      return data;
    } catch (err: any) {
      console.error('Erro ao enviar imagem:', err);
      toast.error('Erro ao enviar imagem');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Adicionar imagem via URL
  const addImageUrl = useCallback(async (url: string, metadata: Omit<ImageLibraryItem, 'id' | 'user_id' | 'storage_url' | 'thumbnail_url' | 'usage_count' | 'created_at' | 'updated_at' | 'file_size' | 'format'>) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    setIsLoading(true);

    try {
      const { data, error: insertError } = await supabase
        .from('image_library')
        .insert({
          user_id: user.id,
          storage_type: 'url',
          storage_url: url,
          ...metadata
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setImages(prev => [data, ...prev]);
      toast.success('Imagem adicionada com sucesso!');
      return data;
    } catch (err: any) {
      console.error('Erro ao adicionar imagem:', err);
      toast.error('Erro ao adicionar imagem');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Atualizar imagem
  const updateImage = useCallback(async (id: string, updates: Partial<ImageLibraryItem>) => {
    if (!user) return null;

    setIsLoading(true);

    try {
      const { data, error: updateError } = await supabase
        .from('image_library')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setImages(prev => prev.map(img => img.id === id ? data : img));
      toast.success('Imagem atualizada!');
      return data;
    } catch (err: any) {
      console.error('Erro ao atualizar imagem:', err);
      toast.error('Erro ao atualizar imagem');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Deletar imagem
  const deleteImage = useCallback(async (id: string, storageUrl?: string) => {
    if (!user) return false;

    setIsLoading(true);

    try {
      // Se for storage do Supabase, deletar arquivo
      if (storageUrl && storageUrl.includes('image-library')) {
        const path = storageUrl.split('/image-library/').pop();
        if (path) {
          await supabase.storage.from('image-library').remove([path]);
        }
      }

      // Deletar registro
      const { error: deleteError } = await supabase
        .from('image_library')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setImages(prev => prev.filter(img => img.id !== id));
      toast.success('Imagem removida!');
      return true;
    } catch (err: any) {
      console.error('Erro ao deletar imagem:', err);
      toast.error('Erro ao deletar imagem');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Incrementar uso da imagem
  const trackImageUsage = useCallback(async (imageId: string, usedIn: string, context?: Record<string, any>) => {
    if (!user) return;

    try {
      await supabase.rpc('increment_image_usage', { image_id: imageId });
      
      await supabase.from('image_usage_log').insert({
        image_id: imageId,
        user_id: user.id,
        used_in: usedIn,
        context
      });
    } catch (err) {
      console.error('Erro ao registrar uso:', err);
    }
  }, [user]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  return {
    images,
    isLoading,
    error,
    loadImages,
    uploadImage,
    addImageUrl,
    updateImage,
    deleteImage,
    trackImageUsage
  };
};
