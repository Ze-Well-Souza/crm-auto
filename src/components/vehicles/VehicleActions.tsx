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
import { MoveHorizontal as MoreHorizontal, CreditCard as Edit, Trash2, Eye, Calendar, Wrench, FileText, TriangleAlert as AlertTriangle, Download } from "lucide-react";
import { VehicleForm } from "./VehicleForm";
import { useVehicles } from "@/hooks/useVehicles";
import type { Vehicle } from "@/types";

interface VehicleActionsProps {
  vehicle: Vehicle;
  onUpdate: () => void;
}

export const VehicleActions = ({ vehicle, onUpdate }: VehicleActionsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { deleteVehicle } = useVehicles();

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      const success = await deleteVehicle(vehicle.id);
      
      if (success) {
        onUpdate();
      }
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleScheduleService = () => {
    console.log('Scheduling service for vehicle:', vehicle.id);
    // In real app would navigate to appointment form with vehicle pre-selected
  };

  const handleCreateServiceOrder = () => {
    console.log('Creating service order for vehicle:', vehicle.id);
    // In real app would navigate to service order form with vehicle pre-selected
  };

  const handleViewHistory = () => {
    console.log('Viewing history for vehicle:', vehicle.id);
    // In real app would show maintenance history
  };

  const handleExportReport = () => {
    console.log('Exporting report for vehicle:', vehicle.id);
    // In real app would generate PDF report
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
            Editar Veículo
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleViewHistory();
          }}>
            <Eye className="mr-2 h-4 w-4" />
            Ver Histórico
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleScheduleService();
          }}>
            <Calendar className="mr-2 h-4 w-4" />
            Agendar Serviço
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleCreateServiceOrder();
          }}>
            <Wrench className="mr-2 h-4 w-4" />
            Nova Ordem
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleExportReport();
          }}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
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
            <DialogTitle>Editar Veículo</DialogTitle>
          </DialogHeader>
          <VehicleForm 
            vehicle={vehicle}
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
              Tem certeza que deseja excluir o veículo "{vehicle.brand} {vehicle.model}"? 
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