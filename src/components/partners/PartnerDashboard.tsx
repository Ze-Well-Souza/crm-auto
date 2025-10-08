import { useState } from 'react';
import { Plus, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PartnerCard } from './PartnerCard';
import { PartnerForm } from './PartnerForm';
import { PartnerFilters } from './PartnerFilters';
import { PartnerMetrics } from './PartnerMetrics';
import { SimplePagination } from '@/components/common/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { EmptyState } from '@/components/common/EmptyState';
import { usePartners } from '@/hooks/usePartners';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const PartnerDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({});

  const {
    paginatedPartners,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    createPartner,
    updatePartner,
    deletePartner,
    filterPartners,
    getPartnerById,
  } = usePartners();

  const handleOpenForm = (partnerId?: string) => {
    setEditingPartnerId(partnerId || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPartnerId(null);
  };

  const handleSubmit = async (data: any) => {
    if (editingPartnerId) {
      await updatePartner(editingPartnerId, data);
    } else {
      await createPartner(data);
    }
    handleCloseForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este parceiro?')) {
      await deletePartner(id);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    filterPartners(newFilters);
  };

  const editingPartner = editingPartnerId ? getPartnerById(editingPartnerId) : undefined;

  return (
    <div className="space-y-6">
      <PartnerMetrics />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar parceiros..."
        />
        <Button onClick={() => handleOpenForm()} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Parceiro
        </Button>
      </div>

      <PartnerFilters onFilterChange={handleFilterChange} />

      {paginatedPartners.length === 0 ? (
        <EmptyState
          icon={Store}
          title="Nenhum parceiro encontrado"
          description="Comece cadastrando seu primeiro parceiro do marketplace"
          actionLabel="Cadastrar Parceiro"
          onAction={() => handleOpenForm()}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedPartners.map((partner) => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                onEdit={() => handleOpenForm(partner.id)}
                onDelete={() => handleDelete(partner.id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <SimplePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPartnerId ? 'Editar Parceiro' : 'Novo Parceiro'}
            </DialogTitle>
          </DialogHeader>
          <PartnerForm
            initialData={editingPartner}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
