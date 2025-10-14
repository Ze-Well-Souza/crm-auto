import { useState } from 'react';
import { useImageCollections } from '@/hooks/useImageCollections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit, Folder } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export default function CollectionManager() {
  const { collections, isLoading, createCollection, updateCollection, deleteCollection } = useImageCollections();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleCreate = async () => {
    if (!formData.name.trim()) return;
    await createCollection(formData.name, formData.description);
    setFormData({ name: '', description: '' });
    setCreateDialogOpen(false);
  };

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim()) return;
    await updateCollection(id, { name: formData.name, description: formData.description });
    setFormData({ name: '', description: '' });
    setEditingCollection(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta coleção? As imagens não serão deletadas.')) {
      await deleteCollection(id);
    }
  };

  const startEdit = (collection: any) => {
    setFormData({ name: collection.name, description: collection.description || '' });
    setEditingCollection(collection.id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {collections.length} {collections.length === 1 ? 'coleção' : 'coleções'}
        </p>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Coleção
        </Button>
      </div>

      {collections.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="Nenhuma coleção criada"
          description="Crie coleções para organizar suas imagens"
        />
      ) : (
        <div className="grid gap-3">
          {collections.map((collection) => (
            <Card key={collection.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {collection.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(collection)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(collection.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {collection.description && (
                  <p className="text-sm text-muted-foreground mb-2">{collection.description}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {collection.image_count} {collection.image_count === 1 ? 'imagem' : 'imagens'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Coleção</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome da coleção"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição da coleção (opcional)"
              />
            </div>
            <Button onClick={handleCreate} className="w-full">Criar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCollection} onOpenChange={() => setEditingCollection(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Coleção</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <Button onClick={() => editingCollection && handleUpdate(editingCollection)} className="w-full">
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
