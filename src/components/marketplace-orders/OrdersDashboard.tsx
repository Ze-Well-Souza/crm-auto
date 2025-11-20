import { useState } from 'react';
import { Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderCard } from './OrderCard';
import { OrderForm } from './OrderForm';
import { OrderFilters } from './OrderFilters';
import { SimplePagination } from '@/components/common/Pagination';
import { SearchInput } from '@/components/common/SearchInput';
import { EmptyState } from '@/components/common/EmptyState';
import { useMarketplaceOrders } from '@/hooks/useMarketplaceOrders';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const OrdersDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  const {
    paginatedOrders,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    filterOrders,
    getOrderById,
  } = useMarketplaceOrders();

  const handleOpenForm = (orderId?: string) => {
    setEditingOrderId(orderId || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingOrderId(null);
  };

  const handleSubmit = async (data: any) => {
    if (editingOrderId) {
      await updateOrderStatus(editingOrderId, { status: data.status, payment_status: data.payment_status });
    } else {
      await createOrder(data);
    }
    handleCloseForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este pedido?')) {
      await deleteOrder(id);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    filterOrders(newFilters);
  };

  const handleStatusChange = async (orderId: string, status: string, payment_status?: string) => {
    await updateOrderStatus(orderId, { status: status as any, payment_status: payment_status as any });
  };

  const editingOrder = editingOrderId ? getOrderById(editingOrderId) : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar pedidos..."
        />
        <Button onClick={() => handleOpenForm()} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Pedido Manual
        </Button>
      </div>

      <OrderFilters onFilterChange={handleFilterChange} />

      {paginatedOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Nenhum pedido encontrado"
          description="Os pedidos do marketplace aparecerão aqui automaticamente, ou você pode cadastrar manualmente"
          actionLabel="Cadastrar Pedido Manual"
          onAction={() => handleOpenForm()}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {paginatedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onDelete={() => handleDelete(order.id)}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-blue-400">
              {editingOrderId ? 'Editar Pedido' : 'Novo Pedido Manual'}
            </DialogTitle>
          </DialogHeader>
          <OrderForm
            initialData={editingOrder}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
