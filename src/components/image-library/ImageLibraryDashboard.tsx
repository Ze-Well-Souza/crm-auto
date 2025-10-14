import { useState } from 'react';
import { Upload, FolderOpen, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useImageLibrary } from '@/hooks/useImageLibrary';
import { useImageCollections } from '@/hooks/useImageCollections';
import ImageGrid from './ImageGrid';
import ImageUploadForm from './ImageUploadForm';
import ImageFilters from './ImageFilters';
import CollectionManager from './CollectionManager';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ImageFilters as ImageFiltersType } from '@/types/image-library';

export default function ImageLibraryDashboard() {
  const { images, isLoading, deleteImage, updateImage, trackImageUsage } = useImageLibrary();
  const { collections } = useImageCollections();
  const [filters, setFilters] = useState<ImageFiltersType>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [collectionsDialogOpen, setCollectionsDialogOpen] = useState(false);

  const filteredImages = images.filter(img => {
    if (filters.category && img.category !== filters.category) return false;
    if (filters.collection_id && img.collection_id !== filters.collection_id) return false;
    if (filters.storage_type && img.storage_type !== filters.storage_type) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return img.title.toLowerCase().includes(searchLower) || 
             img.description?.toLowerCase().includes(searchLower);
    }
    if (filters.tags && filters.tags.length > 0) {
      return filters.tags.some(tag => img.tags?.includes(tag));
    }
    return true;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Biblioteca de Imagens</h1>
          <p className="text-muted-foreground">
            {images.length} {images.length === 1 ? 'imagem' : 'imagens'} • 
            {collections.length} {collections.length === 1 ? 'coleção' : 'coleções'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCollectionsDialogOpen(true)}>
            <FolderOpen className="mr-2 h-4 w-4" />
            Coleções
          </Button>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      <ImageFilters filters={filters} onFiltersChange={setFilters} collections={collections} />

      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="favorites">Favoritas</TabsTrigger>
            <TabsTrigger value="recent">Recentes</TabsTrigger>
          </TabsList>
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-4">
          <ImageGrid
            images={filteredImages}
            viewMode={viewMode}
            isLoading={isLoading}
            onDelete={deleteImage}
            onUpdate={updateImage}
            onUse={trackImageUsage}
          />
        </TabsContent>

        <TabsContent value="favorites" className="mt-4">
          <ImageGrid
            images={filteredImages.filter(img => img.is_favorite)}
            viewMode={viewMode}
            isLoading={isLoading}
            onDelete={deleteImage}
            onUpdate={updateImage}
            onUse={trackImageUsage}
          />
        </TabsContent>

        <TabsContent value="recent" className="mt-4">
          <ImageGrid
            images={filteredImages.slice(0, 20)}
            viewMode={viewMode}
            isLoading={isLoading}
            onDelete={deleteImage}
            onUpdate={updateImage}
            onUse={trackImageUsage}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload de Imagem</DialogTitle>
          </DialogHeader>
          <ImageUploadForm onSuccess={() => setUploadDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={collectionsDialogOpen} onOpenChange={setCollectionsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Gerenciar Coleções</DialogTitle>
          </DialogHeader>
          <CollectionManager />
        </DialogContent>
      </Dialog>
    </div>
  );
}
