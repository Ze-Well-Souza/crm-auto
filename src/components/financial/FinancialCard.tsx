import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Circle as XCircle, CreditCard, User, FileText, Phone, MessageCircle, Send, Eye } from "lucide-react";
import { FinancialActions } from "./FinancialActions";
import { FinancialDashboard } from "./FinancialDashboard";
import { FinancialQuickActions } from "./FinancialQuickActions";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { StatusBadge } from "@/components/common/StatusBadge";
import { cn } from "@/lib/utils";
import type { FinancialTransaction } from "@/types";

interface FinancialCardProps {
  transaction: FinancialTransaction;
  onUpdate: () => void;
  onQuickAction?: (action: string, transaction: FinancialTransaction) => void;
}

export const FinancialCard = ({ transaction, onUpdate, onQuickAction }: FinancialCardProps) => {
  const [showDashboard, setShowDashboard] = useState(false);
  
  // Mock data for demonstration
  const transactionMetrics = {
    impact: Math.random() * 100, // Impact score 0-100
    category: transaction.category || 'Geral',
    paymentMethod: transaction.payment_method || 'Não informado',
    daysUntilDue: transaction.due_date ? 
      Math.ceil((new Date(transaction.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null,
    recurrence: Math.random() > 0.7 ? 'mensal' : Math.random() > 0.4 ? 'eventual' : 'única',
    profitability: transaction.type === 'receita' ? Math.random() * 40 + 20 : 0
  };

  const getStatusConfig = (status: string | null) => {
    switch (status) {
      case 'pago':
        return { 
          variant: 'default' as const, 
          label: 'Pago', 
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'from-green-400/10 to-emerald-500/5'
        };
      case 'pendente':
        return {
          variant: 'secondary' as const,
          label: 'Pendente',
          icon: Clock,
          color: 'text-warning',
          bgColor: 'from-orange-400/10 to-orange-500/5'
        };
      case 'vencido':
        return { 
          variant: 'destructive' as const, 
          label: 'Vencido', 
          icon: AlertTriangle,
          color: 'text-destructive',
          bgColor: 'from-red-400/10 to-red-500/5'
        };
      case 'cancelado':
        return { 
          variant: 'destructive' as const, 
          label: 'Cancelado', 
          icon: XCircle,
          color: 'text-destructive',
          bgColor: 'from-red-400/10 to-red-500/5'
        };
      default:
        return { 
          variant: 'outline' as const, 
          label: 'Pendente', 
          icon: Clock,
          color: 'text-muted-foreground',
          bgColor: 'from-gray-400/10 to-gray-500/5'
        };
    }
  };

  const getTypeIcon = () => {
    return transaction.type === 'receita' ? TrendingUp : TrendingDown;
  };

  const getTransactionIcon = () => {
    return transaction.description?.charAt(0)?.toUpperCase() || (transaction.type === 'receita' ? 'R' : 'D');
  };

  const statusConfig = getStatusConfig(transaction.status);
  const StatusIcon = statusConfig.icon;
  const TypeIcon = getTypeIcon();

  const handleQuickAction = (action: string) => {
    onQuickAction?.(action, transaction);
  };

  const handleCardClick = () => {
    setShowDashboard(true);
  };

  const isOverdue = () => {
    if (!transaction.due_date) return false;
    return new Date(transaction.due_date) < new Date() && transaction.status === 'pendente';
  };

  return (
    <>
      <Card 
        className="hover:shadow-elevated transition-smooth cursor-pointer group relative overflow-hidden"
        onClick={handleCardClick}
      >
        {/* Background gradient based on type and status */}
        <div className={cn(
          "absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10 bg-gradient-to-br",
          statusConfig.bgColor
        )} />

        {/* Overdue indicator */}
        {isOverdue() && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-destructive rounded-full animate-pulse z-10" />
        )}

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarFallback className={cn(
                  "font-semibold",
                  transaction.type === 'receita' ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                )}>
                  {getTransactionIcon()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TypeIcon className={cn(
                    "h-4 w-4",
                    transaction.type === 'receita' ? "text-success" : "text-destructive"
                  )} />
                  {transaction.description}
                  <Badge variant={statusConfig.variant} className="flex items-center gap-1">
                    <StatusIcon className={cn("h-3 w-3", statusConfig.color)} />
                    {statusConfig.label}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  {transaction.category && (
                    <Badge variant="outline" className="text-xs">
                      {transaction.category}
                    </Badge>
                  )}
                  {transaction.payment_method && (
                    <>
                      <span>•</span>
                      <span>{transaction.payment_method}</span>
                    </>
                  )}
                </CardDescription>
              </div>
            </div>
            <FinancialActions transaction={transaction} onUpdate={onUpdate} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          {/* Amount Display */}
          <div className="text-center py-3 bg-muted/30 rounded-md">
            <div className={cn(
              "text-2xl font-bold",
              transaction.type === 'receita' ? "text-success" : "text-destructive"
            )}>
              {transaction.type === 'receita' ? '+' : '-'} {formatCurrency(transaction.amount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {transaction.type === 'receita' ? 'Receita' : 'Despesa'}
            </p>
          </div>

          {/* Client Information */}
          {transaction.clients && (
            <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-md">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{transaction.clients.name}</span>
              <div className="ml-auto flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Phone className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <MessageCircle className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Due Date Information */}
          {transaction.due_date && (
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm font-semibold">
                    {formatDate(transaction.due_date)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Vencimento</p>
              </div>
              
              {transactionMetrics.daysUntilDue !== null && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className={cn(
                      "h-3 w-3",
                      transactionMetrics.daysUntilDue < 0 ? "text-destructive" :
                      transactionMetrics.daysUntilDue <= 7 ? "text-warning" : "text-success"
                    )} />
                    <span className={cn(
                      "text-sm font-semibold",
                      transactionMetrics.daysUntilDue < 0 ? "text-destructive" :
                      transactionMetrics.daysUntilDue <= 7 ? "text-warning" : "text-success"
                    )}>
                      {Math.abs(transactionMetrics.daysUntilDue)}d
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {transactionMetrics.daysUntilDue < 0 ? 'Atrasado' : 'Restam'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Performance Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t text-xs">
            <div className="text-center">
              <div className="font-semibold text-info">
                {Math.round(transactionMetrics.impact)}
              </div>
              <p className="text-muted-foreground">Impacto</p>
            </div>
            
            <div className="text-center">
              <div className="font-semibold text-primary">
                {transactionMetrics.recurrence.toUpperCase()}
              </div>
              <p className="text-muted-foreground">Frequência</p>
            </div>
            
            {transaction.type === 'receita' && (
              <div className="text-center">
                <div className="font-semibold text-success">
                  {Math.round(transactionMetrics.profitability)}%
                </div>
                <p className="text-muted-foreground">Margem</p>
              </div>
            )}
          </div>

          {/* Overdue Alert */}
          {isOverdue() && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">Vencimento Ultrapassado</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Cobrança deve ser realizada
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <FinancialQuickActions 
              transaction={transaction}
              onMarkAsPaid={() => handleQuickAction('mark-paid')}
              onSendReminder={() => handleQuickAction('send-reminder')}
              onViewDetails={() => handleQuickAction('view-details')}
            />
          </div>

          {/* Creation Date */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Criada em {formatDate(transaction.created_at)}</span>
            </div>
            {transaction.payment_date && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>Paga em {formatDate(transaction.payment_date)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Financial Dashboard Modal */}
      <FinancialDashboard
        transactions={transaction ? [transaction] : []}
      />
    </>
  );
};