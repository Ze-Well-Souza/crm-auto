import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
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
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { ClientForm } from "./ClientForm";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications } from "@/contexts/NotificationContext";
import { useZodFormValidation } from "@/hooks/useZodValidation";
import { updateClientSchema } from "@/schemas/client.schema";

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cpf_cnpj?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  notes?: string;
}

interface ClientActionsProps {
  client: Client;
  onUpdate: () => void;
}

export const ClientActions = ({ client, onUpdate }: ClientActionsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const notifications = useNotifications();

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('clients_deprecated')
        .delete()
        .eq('id', client.id);

      if (error) {
        console.error('Erro ao excluir cliente:', error);
        notifications.showOperationError("Excluir", "cliente", error.message);
      } else {
        notifications.showDeleteSuccess("Cliente");
        onUpdate();
      }
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      notifications.showOperationError("Excluir", "cliente", "Erro inesperado");
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <ClientEditForm 
            client={client}
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
              Tem certeza que deseja excluir o cliente "{client.name}"? 
              Esta ação não pode ser desfeita.
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

// Formulário de edição do cliente
const ClientEditForm = ({ client, onSuccess }: { client: Client; onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const notifications = useNotifications();

  const [formData, setFormData] = useState({
    name: client.name || "",
    email: client.email || "",
    phone: client.phone || "",
    cpf_cnpj: client.cpf_cnpj || "",
    address: client.address || "",
    city: client.city || "",
    state: client.state || "",
    zip_code: client.zip_code || "",
    notes: client.notes || ""
  });

  const { validate, validateField, errors, clearErrors } = useZodFormValidation(updateClientSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validationResult = validate({ ...formData, id: client.id });
      
      if (!validationResult.isValid || !validationResult.data) {
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('clients')
        .update({
          name: validationResult.data.name,
          email: validationResult.data.email || null,
          phone: validationResult.data.phone || null,
          cpf_cnpj: validationResult.data.cpf_cnpj || null,
          address: validationResult.data.address || null,
          city: validationResult.data.city || null,
          state: validationResult.data.state || null,
          zip_code: validationResult.data.zip_code || null,
          notes: validationResult.data.notes || null,
        })
        .eq('id', client.id);

      if (error) {
        throw error;
      }

      notifications.showUpdateSuccess("Cliente");
      onSuccess();
    } catch (error) {
      notifications.showOperationError("atualizar cliente", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validação em tempo real para campos específicos
    if (name === 'email' || name === 'cpf_cnpj' || name === 'phone' || name === 'zip_code') {
      setTimeout(() => {
        validateField(name, value);
      }, 500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label htmlFor="name" className="text-sm font-medium">Nome Completo *</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`w-full mt-1 px-3 py-2 border border-input rounded-md ${errors.name ? "border-destructive" : ""}`}
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full mt-1 px-3 py-2 border border-input rounded-md ${errors.email ? "border-destructive" : ""}`}
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
          <input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full mt-1 px-3 py-2 border border-input rounded-md ${errors.phone ? "border-destructive" : ""}`}
          />
          {errors.phone && (
            <p className="text-sm text-destructive mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="col-span-2">
          <label htmlFor="cpf_cnpj" className="text-sm font-medium">CPF/CNPJ</label>
          <input
            id="cpf_cnpj"
            name="cpf_cnpj"
            value={formData.cpf_cnpj}
            onChange={handleChange}
            className={`w-full mt-1 px-3 py-2 border border-input rounded-md ${errors.cpf_cnpj ? "border-destructive" : ""}`}
          />
          {errors.cpf_cnpj && (
            <p className="text-sm text-destructive mt-1">{errors.cpf_cnpj}</p>
          )}
        </div>

        <div className="col-span-2">
          <label htmlFor="address" className="text-sm font-medium">Endereço</label>
          <input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full mt-1 px-3 py-2 border border-input rounded-md ${errors.address ? "border-destructive" : ""}`}
          />
          {errors.address && (
            <p className="text-sm text-destructive mt-1">{errors.address}</p>
          )}
        </div>

        <div>
          <label htmlFor="city" className="text-sm font-medium">Cidade</label>
          <input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full mt-1 px-3 py-2 border border-input rounded-md ${errors.city ? "border-destructive" : ""}`}
          />
          {errors.city && (
            <p className="text-sm text-destructive mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label htmlFor="state" className="text-sm font-medium">Estado</label>
          <input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            maxLength={2}
            className={`w-full mt-1 px-3 py-2 border border-input rounded-md ${errors.state ? "border-destructive" : ""}`}
          />
          {errors.state && (
            <p className="text-sm text-destructive mt-1">{errors.state}</p>
          )}
        </div>

        <div className="col-span-2">
          <label htmlFor="zip_code" className="text-sm font-medium">CEP</label>
          <input
            id="zip_code"
            name="zip_code"
            value={formData.zip_code}
            onChange={handleChange}
            className={`w-full mt-1 px-3 py-2 border border-input rounded-md ${errors.zip_code ? "border-destructive" : ""}`}
          />
          {errors.zip_code && (
            <p className="text-sm text-destructive mt-1">{errors.zip_code}</p>
          )}
        </div>

        <div className="col-span-2">
          <label htmlFor="notes" className="text-sm font-medium">Observações</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className={`w-full mt-1 px-3 py-2 border border-input rounded-md ${errors.notes ? "border-destructive" : ""}`}
          />
          {errors.notes && (
            <p className="text-sm text-destructive mt-1">{errors.notes}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
};