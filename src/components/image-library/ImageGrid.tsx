import { ImageLibraryItem } from '@/types/image-library';
import ImageCard from './ImageCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ImageOff } from 'lucide-react';

interface ImageGridProps {
  images: ImageLibraryItem[];
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  onDelete: (id: string, storageUrl?: string) => Promise<boolean>;
  onUpdate: (id: string, updates: Partial<ImageLibraryItem>) => Promise<ImageLibraryItem | null>;
  onUse: (imageId: string, usedIn: string, context?: Record<string, any>) => Promise<void>;
}

export default function ImageGrid({
  images,
  viewMode,
  isLoading,
  onDelete,
  onUpdate,
  onUse
}: ImageGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <EmptyState
        icon={ImageOff}
        title="Nenhuma imagem encontrada"
        description="Faça upload de imagens ou ajuste os filtros"
      />
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            viewMode="list"
            onDelete={onDelete}
            onUpdate={onUpdate}
            onUse={onUse}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          viewMode="grid"
          onDelete={onDelete}
          onUpdate={onUpdate}
          onUse={onUse}
        />
      ))}
    </div>
  );
}
