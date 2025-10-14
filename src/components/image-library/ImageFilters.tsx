import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { ImageFilters as ImageFiltersType, ImageCollection } from '@/types/image-library';

interface ImageFiltersProps {
  filters: ImageFiltersType;
  onFiltersChange: (filters: ImageFiltersType) => void;
  collections: ImageCollection[];
}

export default function ImageFilters({ filters, onFiltersChange, collections }: ImageFiltersProps) {
  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category: category as any });
  };

  const handleCollectionChange = (collection_id: string) => {
    onFiltersChange({ ...filters, collection_id });
  };

  const handleStorageTypeChange = (storage_type: string) => {
    onFiltersChange({ ...filters, storage_type: storage_type as any });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasFilters = filters.search || filters.category || filters.collection_id || filters.storage_type;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Input
        placeholder="Buscar imagens..."
        value={filters.search || ''}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="max-w-xs"
      />

      <Select value={filters.category || ''} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Todas as categorias" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todas</SelectItem>
          <SelectItem value="logo">Logo</SelectItem>
          <SelectItem value="banner">Banner</SelectItem>
          <SelectItem value="product">Produto</SelectItem>
          <SelectItem value="icon">Ícone</SelectItem>
          <SelectItem value="background">Background</SelectItem>
          <SelectItem value="other">Outro</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.collection_id || ''} onValueChange={handleCollectionChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Todas as coleções" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todas</SelectItem>
          {collections.map((col) => (
            <SelectItem key={col.id} value={col.id}>{col.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.storage_type || ''} onValueChange={handleStorageTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Tipo de storage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos</SelectItem>
          <SelectItem value="supabase">Supabase</SelectItem>
          <SelectItem value="url">URL Externa</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Limpar
        </Button>
      )}
    </div>
  );
}
