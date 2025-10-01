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
import { MoveHorizontal as MoreHorizontal, CreditCard as Edit, Trash2, Eye, Plus, Minus, ShoppingCart, ChartBar as BarChart3, TriangleAlert as AlertTriangle, Download, RefreshCw } from "lucide-react";
import { PartsForm } from "./PartsForm";
import { useToast } from "@/hooks/use-toast";
import type { Part } from "@/types";

interface PartsActionsProps {
  part: Part;
  onUpdate: () => void;
}

export const PartsActions = ({ part, onUpdate }: PartsActionsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      // Mock delete - in real app would delete from database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Peça excluída",
        description: `${part.name} foi excluída com sucesso.`,
      });
      
      onUpdate();
    } catch (err) {
      console.error('Erro ao excluir peça:', err);
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleStockAdjustment = (type: 'add' | 'remove') => {
    toast({
      title: "Ajuste de estoque",
      description: `${type === 'add' ? 'Adicionando' : 'Removendo'} itens do estoque...`,
    });
    // In real app would open stock adjustment modal
  };

  const handleReorder = () => {
    toast({
      title: "Pedido de reposição",
      description: "Criando pedido para o fornecedor...",
    });
    // In real app would create purchase order
  };

  const handleViewMovements = () => {
    toast({
      title: "Movimentações",
      description: "Carregando histórico de movimentações...",
    });
    // In real app would show stock movement history
  };

  const handleGenerateReport = () => {
    toast({
      title: "Relatório gerado",
      description: "Relatório da peça foi gerado com sucesso.",
    });
    // In real app would generate PDF report
  };

  const handleUpdatePrice = () => {
    toast({
      title: "Atualização de preço",
      description: "Consultando preços atualizados...",
    });
    // In real app would update prices from supplier
  };

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
            Editar Peça
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleViewMovements();
          }}>
            <Eye className="mr-2 h-4 w-4" />
            Ver Movimentações
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleStockAdjustment('add');
          }}>
            <Plus className="mr-2 h-4 w-4 text-success" />
            Adicionar Estoque
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleStockAdjustment('remove');
          }}>
            <Minus className="mr-2 h-4 w-4 text-warning" />
            Remover Estoque
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleReorder();
          }}>
            <ShoppingCart className="mr-2 h-4 w-4 text-info" />
            Solicitar Reposição
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleUpdatePrice();
          }}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar Preços
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleGenerateReport();
          }}>
            <Download className="mr-2 h-4 w-4" />
            Gerar Relatório
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
            <DialogTitle>Editar Peça</DialogTitle>
          </DialogHeader>
          <PartsForm 
            part={part}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
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
              Tem certeza que deseja excluir a peça "{part.name}"? 
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