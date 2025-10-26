import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoveHorizontal as MoreHorizontal, CreditCard as Edit, Trash2, Eye, CircleCheck as CheckCircle, Play as PlayCircle, Pause as PauseCircle, Circle as XCircle, FileText, Download, Send, Clock } from "lucide-react";
import { ServiceOrderForm } from "./ServiceOrderForm";
import { useServiceOrders } from "@/hooks/useServiceOrders";
import type { ServiceOrder } from "@/types";

interface ServiceOrderActionsProps {
  serviceOrder: ServiceOrder;
  onUpdate: () => void;
}

export const ServiceOrderActions = ({ serviceOrder, onUpdate }: ServiceOrderActionsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { deleteServiceOrder, updateStatus } = useServiceOrders();

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      const success = await deleteServiceOrder(serviceOrder.id);
      
      if (success) {
        onUpdate();
      }
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const result = await updateStatus(serviceOrder.id, newStatus);
      
      if (result) {
        onUpdate();
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const handleGenerateInvoice = () => {
    // In real app would generate PDF invoice
    console.log('Generating invoice for order:', serviceOrder.order_number);
  };

  const handleSendToClient = () => {
    // In real app would send email with order details
    console.log('Sending order to client:', serviceOrder.order_number);
  };

  const canApprove = serviceOrder.status === 'orcamento';
  const canStart = serviceOrder.status === 'aprovado';
  const canComplete = serviceOrder.status === 'em_andamento' || serviceOrder.status === 'aguardando_pecas';
  const canDeliver = serviceOrder.status === 'concluido';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            setIsEditDialogOpen(true);
          }}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Ordem
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleGenerateInvoice();
          }}>
            <FileText className="mr-2 h-4 w-4" />
            Gerar Fatura
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleSendToClient();
          }}>
            <Send className="mr-2 h-4 w-4" />
            Enviar para Cliente
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Status Change Actions */}
          {canApprove && (
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              handleStatusChange('aprovado');
            }}>
              <CheckCircle className="mr-2 h-4 w-4 text-success" />
              Aprovar Orçamento
            </DropdownMenuItem>
          )}
          
          {canStart && (
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              handleStatusChange('em_andamento');
            }}>
              <PlayCircle className="mr-2 h-4 w-4 text-info" />
              Iniciar Serviço
            </DropdownMenuItem>
          )}
          
          {canComplete && (
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              handleStatusChange('concluido');
            }}>
              <CheckCircle className="mr-2 h-4 w-4 text-success" />
              Finalizar Serviço
            </DropdownMenuItem>
          )}
          
          {canDeliver && (
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              handleStatusChange('entregue');
            }}>
              <CheckCircle className="mr-2 h-4 w-4 text-success" />
              Entregar ao Cliente
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Editar Ordem de Serviço</DialogTitle>
          </DialogHeader>
          <ServiceOrderForm 
            serviceOrder={serviceOrder}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              onUpdate();
            }} 
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a ordem "{serviceOrder.order_number}"? 
              Esta ação não pode ser desfeita e removerá todo o histórico associado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};