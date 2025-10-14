import { useState } from 'react';
import { ImageLibraryItem } from '@/types/image-library';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MoreVertical, Heart, Copy, Download, Trash2, Edit, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import ImageDetailsForm from './ImageDetailsForm';

interface ImageCardProps {
  image: ImageLibraryItem;
  viewMode: 'grid' | 'list';
  onDelete: (id: string, storageUrl?: string) => Promise<boolean>;
  onUpdate: (id: string, updates: Partial<ImageLibraryItem>) => Promise<ImageLibraryItem | null>;
  onUse: (imageId: string, usedIn: string, context?: Record<string, any>) => Promise<void>;
}

export default function ImageCard({ image, viewMode, onDelete, onUpdate, onUse }: ImageCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const imageUrl = image.storage_type === 'url' ? image.external_url : image.file_path;

  const handleCopyUrl = () => {
    if (imageUrl) {
      navigator.clipboard.writeText(imageUrl);
      toast.success('URL copiada!');
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      window.open(imageUrl, '_blank');
      onUse(image.id, 'download');
    }
  };

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja deletar esta imagem?')) {
      setIsDeleting(true);
      const success = await onDelete(image.id, image.file_path || undefined);
      setIsDeleting(false);
      if (!success) {
        toast.error('Erro ao deletar imagem');
      }
    }
  };

  const toggleFavorite = async () => {
    await onUpdate(image.id, { is_favorite: !image.is_favorite });
  };

  if (viewMode === 'list') {
    return (
      <>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <img
              src={image.thumbnail_url || imageUrl || '/placeholder.svg'}
              alt={image.title}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{image.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{image.description}</p>
              <div className="flex gap-2 mt-1">
                <Badge variant="secondary">{image.category}</Badge>
                {image.tags?.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleFavorite}>
                <Heart className={image.is_favorite ? 'fill-current text-red-500' : ''} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyUrl}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar URL
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} disabled={isDeleting}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Deletar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Imagem</DialogTitle>
            </DialogHeader>
            <ImageDetailsForm
              image={image}
              onSave={(updates) => {
                onUpdate(image.id, updates);
                setEditDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Card className="group relative overflow-hidden">
        <div className="aspect-square relative">
          <img
            src={image.thumbnail_url || imageUrl || '/placeholder.svg'}
            alt={image.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button variant="secondary" size="icon" onClick={toggleFavorite}>
              <Heart className={image.is_favorite ? 'fill-current text-red-500' : ''} />
            </Button>
            <Button variant="secondary" size="icon" onClick={handleCopyUrl}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={() => setEditDialogOpen(true)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          {image.storage_type === 'url' && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              <ExternalLink className="h-3 w-3" />
            </Badge>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold truncate">{image.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{image.description}</p>
          <div className="flex gap-1 mt-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">{image.category}</Badge>
            {image.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>{image.usage_count} usos</span>
            {image.file_size && <span>{(image.file_size / 1024).toFixed(0)} KB</span>}
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Imagem</DialogTitle>
          </DialogHeader>
          <ImageDetailsForm
            image={image}
            onSave={(updates) => {
              onUpdate(image.id, updates);
              setEditDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
