import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useImageLibrary } from '@/hooks/useImageLibrary';
import { useImageCollections } from '@/hooks/useImageCollections';
import { imageUploadSchema, imageUrlSchema, type ImageUploadInput, type ImageUrlInput } from '@/schemas/image-library.schema';
import { Upload, Link2 } from 'lucide-react';

interface ImageUploadFormProps {
  onSuccess?: () => void;
}

export default function ImageUploadForm({ onSuccess }: ImageUploadFormProps) {
  const { uploadImage, addImageUrl } = useImageLibrary();
  const { collections } = useImageCollections();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadForm = useForm<Omit<ImageUploadInput, 'file'>>({
    resolver: zodResolver(imageUploadSchema.omit({ file: true })),
    defaultValues: {
      category: 'other',
      tags: [],
    },
  });

  const urlForm = useForm<ImageUrlInput>({
    resolver: zodResolver(imageUrlSchema),
    defaultValues: {
      category: 'other',
      tags: [],
    },
  });

  const handleFileUpload = async (data: Omit<ImageUploadInput, 'file'>) => {
    if (!selectedFile) return;

    setIsUploading(true);
    const result = await uploadImage(selectedFile, {
      title: data.title,
      description: data.description,
      category: data.category,
      tags: data.tags,
      collection_id: data.collection_id,
    });
    setIsUploading(false);

    if (result) {
      uploadForm.reset();
      setSelectedFile(null);
      onSuccess?.();
    }
  };

  const handleUrlSubmit = async (data: ImageUrlInput) => {
    setIsUploading(true);
    const result = await addImageUrl(data.url, {
      title: data.title,
      description: data.description,
      category: data.category,
      tags: data.tags,
      collection_id: data.collection_id,
    });
    setIsUploading(false);

    if (result) {
      urlForm.reset();
      onSuccess?.();
    }
  };

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </TabsTrigger>
        <TabsTrigger value="url">
          <Link2 className="mr-2 h-4 w-4" />
          URL
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upload">
        <form onSubmit={uploadForm.handleSubmit(handleFileUpload)} className="space-y-4">
          <div>
            <Label htmlFor="file">Arquivo</Label>
            <Input
              id="file"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div>
            <Label htmlFor="title">Título</Label>
            <Input {...uploadForm.register('title')} placeholder="Nome da imagem" />
            {uploadForm.formState.errors.title && (
              <p className="text-sm text-destructive mt-1">{uploadForm.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea {...uploadForm.register('description')} placeholder="Descrição da imagem" />
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={uploadForm.watch('category')}
              onValueChange={(value) => uploadForm.setValue('category', value as any)}
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
            <Label htmlFor="collection">Coleção (opcional)</Label>
            <Select
              value={uploadForm.watch('collection_id') || 'none'}
              onValueChange={(value) => uploadForm.setValue('collection_id', value === 'none' ? undefined : value)}
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

          <Button type="submit" disabled={isUploading || !selectedFile} className="w-full">
            {isUploading ? 'Enviando...' : 'Enviar'}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="url">
        <form onSubmit={urlForm.handleSubmit(handleUrlSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="url">URL da Imagem</Label>
            <Input {...urlForm.register('url')} placeholder="https://exemplo.com/imagem.jpg" />
            {urlForm.formState.errors.url && (
              <p className="text-sm text-destructive mt-1">{urlForm.formState.errors.url.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="title">Título</Label>
            <Input {...urlForm.register('title')} placeholder="Nome da imagem" />
            {urlForm.formState.errors.title && (
              <p className="text-sm text-destructive mt-1">{urlForm.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea {...urlForm.register('description')} placeholder="Descrição da imagem" />
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={urlForm.watch('category')}
              onValueChange={(value) => urlForm.setValue('category', value as any)}
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
            <Label htmlFor="collection">Coleção (opcional)</Label>
            <Select
              value={urlForm.watch('collection_id') || 'none'}
              onValueChange={(value) => urlForm.setValue('collection_id', value === 'none' ? undefined : value)}
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

          <Button type="submit" disabled={isUploading} className="w-full">
            {isUploading ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
