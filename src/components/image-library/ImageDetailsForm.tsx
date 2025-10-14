import { useForm } from 'react-hook-form';
import { ImageLibraryItem } from '@/types/image-library';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useImageCollections } from '@/hooks/useImageCollections';

interface ImageDetailsFormProps {
  image: ImageLibraryItem;
  onSave: (updates: Partial<ImageLibraryItem>) => void;
}

export default function ImageDetailsForm({ image, onSave }: ImageDetailsFormProps) {
  const { collections } = useImageCollections();
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      title: image.title,
      description: image.description || '',
      category: image.category,
      collection_id: image.collection_id || '',
      alt_text: image.alt_text || '',
    },
  });

  const onSubmit = (data: any) => {
    onSave({
      title: data.title,
      description: data.description,
      category: data.category,
      collection_id: data.collection_id === 'none' ? undefined : data.collection_id,
      alt_text: data.alt_text,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input {...register('title')} required />
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea {...register('description')} />
      </div>

      <div>
        <Label htmlFor="alt_text">Texto Alternativo (Alt)</Label>
        <Input {...register('alt_text')} placeholder="Descrição para acessibilidade" />
      </div>

      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select
          value={watch('category')}
          onValueChange={(value) => setValue('category', value as any)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="logo">Logo</SelectItem>
            <SelectItem value="banner">Banner</SelectItem>
            <SelectItem value="product">Produto</SelectItem>
            <SelectItem value="icon">Ícone</SelectItem>
            <SelectItem value="background">Background</SelectItem>
            <SelectItem value="other">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="collection">Coleção</Label>
        <Select
          value={watch('collection_id') || 'none'}
          onValueChange={(value) => setValue('collection_id', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sem coleção" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sem coleção</SelectItem>
            {collections.map((col) => (
              <SelectItem key={col.id} value={col.id}>{col.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">Salvar</Button>
    </form>
  );
}
