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
import { MoveHorizontal as MoreHorizontal, CreditCard as Edit, Trash2, CircleCheck as CheckCircle, Send, Download, Copy, RefreshCw, Calendar } from "lucide-react";
import { TransactionForm } from "./TransactionForm";
import { useFinancialTransactionsNew } from "@/hooks/useFinancialTransactionsNew";
import { useToast } from "@/hooks/use-toast";
import type { FinancialTransaction } from "@/types";

interface FinancialActionsProps {
  transaction: FinancialTransaction;
  onUpdate: () => void;
}

export const FinancialActions = ({ transaction, onUpdate }: FinancialActionsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateTransaction, deleteTransaction } = useFinancialTransactionsNew();
  const { toast } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      await deleteTransaction(transaction.id);
      onUpdate();
    } catch (err) {
      console.error('Erro ao excluir transação:', err);
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      await updateTransaction(transaction.id, { 
        status: 'pago',
        payment_date: new Date().toISOString().split('T')[0]
      });
      onUpdate();
      toast({
        title: "Transação atualizada",
        description: "Transação marcada como paga",
      });
    } catch (err) {
      console.error('Erro ao marcar como paga:', err);
    }
  };

  const handleDuplicate = () => {
    toast({
      title: "Transação duplicada",
      description: "Nova transação criada baseada nesta",
    });
    // In real app would create duplicate transaction
  };

  const handleGenerateReceipt = () => {
    toast({
      title: "Recibo gerado",
      description: "Recibo da transação foi gerado",
    });
    // In real app would generate PDF receipt
  };

  const handleSendReminder = () => {
    toast({
      title: "Lembrete enviado",
      description: "Cliente notificado sobre o vencimento",
    });
    // In real app would send payment reminder
  };

  const canMarkAsPaid = transaction.status === 'pendente' || transaction.status === 'vencido';
  const canSendReminder = transaction.type === 'receita' && transaction.status !== 'pago';

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
            Editar Transação
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleDuplicate();
          }}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicar
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Status Actions */}
          {canMarkAsPaid && (
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              handleMarkAsPaid();
            }}>
              <CheckCircle className="mr-2 h-4 w-4 text-success" />
              Marcar como Paga
            </DropdownMenuItem>
          )}
          
          {canSendReminder && (
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              handleSendReminder();
            }}>
              <Send className="mr-2 h-4 w-4" />
              Enviar Lembrete
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleGenerateReceipt();
          }}>
            <Download className="mr-2 h-4 w-4" />
            Gerar Recibo
          </DropdownMenuItem>
          
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Transação</DialogTitle>
          </DialogHeader>
          <TransactionForm 
            transaction={transaction}
            open={false}
            onOpenChange={() => {}}
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
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
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