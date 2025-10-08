import { useCollectionState } from './useCollectionState';
import { useNotifications } from '@/contexts/NotificationContext';
import { MarketplaceOrder } from '@/types';
import { CreateMarketplaceOrderInput, UpdateOrderStatusInput } from '@/schemas/marketplace-order.schema';

export const useMarketplaceOrders = () => {
  const { showSuccess, showError } = useNotifications();
  
  const {
    items: orders,
    filteredItems: filteredOrders,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    paginatedItems,
    addItem,
    updateItem,
    deleteItem,
    setItems,
    setFilteredItems,
  } = useCollectionState<MarketplaceOrder>({
    storageKey: 'marketplace_orders',
    itemsPerPage: 10,
  });

  const createOrder = async (data: CreateMarketplaceOrderInput) => {
    try {
      const newOrder: MarketplaceOrder = {
        id: crypto.randomUUID(),
        partner_id: data.partner_id,
        order_number: data.order_number,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone || null,
        customer_email: data.customer_email || null,
        items: data.items,
        total_amount: data.total_amount,
        status: data.status || null,
        payment_status: data.payment_status || null,
        payment_method: data.payment_method || null,
        delivery_date: data.delivery_date || null,
        delivery_address: data.delivery_address || null,
        notes: data.notes || null,
        marketplace_reference: data.marketplace_reference || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      addItem(newOrder);
      showSuccess('Pedido cadastrado com sucesso!');
      return newOrder;
    } catch (err) {
      showError('Erro ao cadastrar pedido');
      throw err;
    }
  };

  const updateOrderStatus = async (id: string, data: UpdateOrderStatusInput) => {
    try {
      updateItem(id, {
        ...data,
        updated_at: new Date().toISOString(),
      });
      showSuccess('Status do pedido atualizado!');
    } catch (err) {
      showError('Erro ao atualizar status do pedido');
      throw err;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      deleteItem(id);
      showSuccess('Pedido removido com sucesso!');
    } catch (err) {
      showError('Erro ao remover pedido');
      throw err;
    }
  };

  const filterOrders = (filters: {
    partner_id?: string;
    status?: string;
    payment_status?: string;
    date_from?: string;
    date_to?: string;
  }) => {
    let filtered = [...orders];

    if (filters.partner_id) {
      filtered = filtered.filter(o => o.partner_id === filters.partner_id);
    }

    if (filters.status) {
      filtered = filtered.filter(o => o.status === filters.status);
    }

    if (filters.payment_status) {
      filtered = filtered.filter(o => o.payment_status === filters.payment_status);
    }

    if (filters.date_from) {
      filtered = filtered.filter(o => new Date(o.created_at) >= new Date(filters.date_from!));
    }

    if (filters.date_to) {
      filtered = filtered.filter(o => new Date(o.created_at) <= new Date(filters.date_to!));
    }

    setFilteredItems(filtered);
  };

  const getOrderById = (id: string) => {
    return orders.find(o => o.id === id);
  };

  const getOrdersByPartner = (partnerId: string) => {
    return orders.filter(o => o.partner_id === partnerId);
  };

  return {
    orders,
    filteredOrders,
    paginatedOrders: paginatedItems,
    isLoading,
    error,
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
    getOrdersByPartner,
  };
};
