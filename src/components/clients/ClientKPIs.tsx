import { Users, TrendingUp, Star, UserPlus, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ClientMetrics } from "@/types";

interface ClientKPIsProps {
  metrics: ClientMetrics | null;
  loading: boolean;
}

export const ClientKPIs = ({ metrics, loading }: ClientKPIsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  const kpis = [
    {
      id: "total-clients",
      title: "Total de Clientes",
      value: metrics.totalClients,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      description: "Clientes cadastrados"
    },
    {
      id: "quality-score",
      title: "Qualidade dos Dados",
      value: `${metrics.averageQualityScore}%`,
      icon: TrendingUp,
      color: metrics.averageQualityScore >= 80
        ? "text-green-600 dark:text-green-400"
        : metrics.averageQualityScore >= 50
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400",
      bgColor: metrics.averageQualityScore >= 80
        ? "bg-green-100 dark:bg-green-900/20"
        : metrics.averageQualityScore >= 50
        ? "bg-yellow-100 dark:bg-yellow-900/20"
        : "bg-red-100 dark:bg-red-900/20",
      description: "Média de completude"
    },
    {
      id: "classification",
      title: "Classificação",
      value: `${metrics.vipCount} VIP`,
      icon: Star,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      description: `${metrics.newCount} Novos, ${metrics.regularCount} Regulares`,
      subtitle: true
    },
    {
      id: "with-email",
      title: "Com Email",
      value: metrics.withEmail,
      icon: Mail,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      description: `${metrics.recentClients} adicionados recentemente`,
      subtitle: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {kpi.title}
                </p>
                <p className={`text-3xl font-bold ${kpi.color} mb-1`}>
                  {kpi.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {kpi.description}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

