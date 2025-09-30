import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CircleCheck as CheckCircle, Send, Eye, Copy, Download, Calendar, Phone, MessageCircle, RefreshCw } from "lucide-react";
import type { FinancialTransaction } from "@/types";

interface FinancialQuickActionsProps {
  transaction: FinancialTransaction;
  onMarkAsPaid?: () => void;
  onSendReminder?: () => void;
  onViewDetails?: () => void;
}

export const FinancialQuickActions = ({ 
  transaction, 
  onMarkAsPaid, 
  onSendReminder,
  onViewDetails
}: FinancialQuickActionsProps) => {
  const { toast } = useToast();

  const handleMarkAsPaid = () => {
    toast({
      title: "Transação atualizada",
      description: "Marcada como paga com sucesso",
    });
    onMarkAsPaid?.();
  };

  const handleSendReminder = () => {
    if (transaction.clients?.email) {
      const subject = `Lembrete de Pagamento - ${transaction.description}`;
      const body = `Olá ${transaction.clients.name}, este é um lembrete sobre o pagamento de ${transaction.description} no valor de ${transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`;
      window.open(`mailto:${transaction.clients.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
    toast({
      title: "Lembrete enviado",
      description: "Cliente notificado sobre o pagamento",
    });
  };

  const handleWhatsAppReminder = () => {
    const message = encodeURIComponent(`Olá ${transaction.clients?.name}, lembrete sobre o pagamento de ${transaction.description} - ${transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`);
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
    toast({
      title: "WhatsApp aberto",
      description: "Enviando lembrete via WhatsApp",
    });
  };

  const handleGenerateReceipt = () => {
    toast({
      title: "Recibo gerado",
      description: "Recibo da transação foi criado",
    });
  };

  const handleDuplicate = () => {
    toast({
      title: "Transação duplicada",
      description: "Nova transação criada baseada nesta",
    });
  };

  const handleReschedule = () => {
    toast({
      title: "Reagendamento",
      description: "Abrindo opções de reagendamento...",
    });
  };

  const canMarkAsPaid = transaction.status === 'pendente' || transaction.status === 'vencido';
  const canSendReminder = transaction.type === 'receita' && transaction.status !== 'pago';

  return (
    <div className="flex flex-wrap gap-1">
      {/* Primary Action */}
      {canMarkAsPaid && (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleMarkAsPaid();
          }}
          className="flex items-center gap-1 text-success hover:text-success"
        >
          <CheckCircle className="h-3 w-3" />
          Pagar
        </Button>
      )}

      {/* Communication Actions */}
      {canSendReminder && transaction.clients && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleSendReminder();
            }}
            className="flex items-center gap-1"
          >
            <Send className="h-3 w-3" />
            Lembrete
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleWhatsAppReminder();
            }}
            className="flex items-center gap-1 text-green-600 hover:text-green-700"
          >
            <MessageCircle className="h-3 w-3" />
            WhatsApp
          </Button>
        </>
      )}

      {/* Utility Actions */}
      <Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          handleGenerateReceipt();
        }}
        className="flex items-center gap-1"
      >
        <Download className="h-3 w-3" />
        Recibo
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          handleDuplicate();
        }}
        className="flex items-center gap-1"
      >
        <Copy className="h-3 w-3" />
        Duplicar
      </Button>

      {transaction.due_date && transaction.status === 'pendente' && (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleReschedule();
          }}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
        >
          <Calendar className="h-3 w-3" />
          Reagendar
        </Button>
      )}
    </div>
  );
};