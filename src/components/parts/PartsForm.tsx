import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { usePartsNew } from "@/hooks/usePartsNew";
import { PART_CATEGORIES } from "@/utils/constants";
import type { Part } from "@/types";

const partSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  supplier_id: z.string().optional(),
  cost_price: z.number().min(0, "Preço de custo deve ser positivo").optional(),
  sale_price: z.number().min(0, "Preço de venda deve ser positivo").optional(),
  stock_quantity: z.number().min(0, "Quantidade deve ser positiva").optional(),
  min_stock: z.number().min(0, "Estoque mínimo deve ser positivo").optional(),
  max_stock: z.number().min(0, "Estoque máximo deve ser positivo").optional(),
  location: z.string().optional(),
  active: z.boolean().default(true),
});

type PartFormData = z.infer<typeof partSchema>;

interface PartsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  part?: any;
  onSuccess?: () => void;
}

export const PartsForm = ({
  open,
  onOpenChange,
  part,
  onSuccess,
}: PartsFormProps) => {
  const [loading, setLoading] = useState(false);
  const { suppliers, createPart, updatePart } = usePartsNew();

  const form = useForm<PartFormData>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      code: part?.code || "",
      name: part?.name || "",
      description: part?.description || "",
      category: part?.category || "",
      brand: part?.brand || "",
      supplier_id: part?.supplier_id || "",
      cost_price: part?.cost_price || 0,
      sale_price: part?.sale_price || 0,
      stock_quantity: part?.stock_quantity || 0,
      min_stock: part?.min_stock || 0,
      max_stock: part?.max_stock || 0,
      location: part?.location || "",
      active: part?.active ?? true,
    },
  });

  const onSubmit = async (data: PartFormData) => {
    try {
      setLoading(true);

      if (part) {
        await updatePart(part.id, data as any);
      } else {
        await createPart(data as any);
      }

      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar peça:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-yellow-400">
            {part ? "Editar Peça" : "Nova Peça"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {part
              ? "Atualize as informações da peça."
              : "Preencha os dados para cadastrar uma nova peça."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-400">Código</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: FO001" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-400">Nome *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Filtro de Óleo" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-yellow-400">Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição detalhada da peça..."
                      {...field}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-400">Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Selecione uma categoria" className="text-slate-400" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-white/10">
                        {PART_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category} className="text-white hover:bg-white/10">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-400">Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Bosch, Mann, TRW" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="supplier_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-yellow-400">Fornecedor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Selecione um fornecedor" className="text-slate-400" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-900 border-white/10">
                      {suppliers?.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id} className="text-white hover:bg-white/10">
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cost_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-400">Preço de Custo (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sale_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-400">Preço de Venda (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="stock_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-400">Quantidade em Estoque</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="min_stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-400">Estoque Mínimo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-400">Estoque Máximo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-yellow-400">Localização</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Prateleira A1, Setor B" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base text-yellow-400">Ativo</FormLabel>
                    <div className="text-sm text-slate-400">
                      Peça disponível para uso
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-white/10 text-white hover:bg-white/10">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                {loading ? "Salvando..." : part ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};