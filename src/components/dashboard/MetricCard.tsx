import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  color?: "primary" | "success" | "warning" | "info" | "purple" | "pink" | "orange";
}

export const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon,
  trend = "neutral",
  color = "primary"
}: MetricCardProps) => {
  const colorClasses = {
    primary: "from-primary/10 to-primary-light/5 border-primary/20 shadow-primary",
    success: "from-success/10 to-success-light/5 border-success/20 shadow-success",
    warning: "from-warning/10 to-warning-light/5 border-warning/20 shadow-warning",
    info: "from-info/10 to-info-light/5 border-info/20 shadow-info",
    purple: "from-purple/10 to-purple-light/5 border-purple/20 shadow-purple",
    pink: "from-pink/10 to-pink-light/5 border-pink/20 shadow-pink",
    orange: "from-orange/10 to-orange-light/5 border-orange/20 shadow-warning"
  };

  const iconClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info",
    purple: "bg-purple/10 text-purple",
    pink: "bg-pink/10 text-pink",
    orange: "bg-orange/10 text-orange"
  };

  return (
    <Card className={cn(
      "bg-gradient-to-br transition-smooth hover-lift hover-glow group animate-fade-in border",
      colorClasses[color]
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground group-hover:text-gradient-primary transition-smooth">{value}</p>
            {change && (
              <p className={cn(
                "text-xs font-medium transition-smooth",
                changeType === "positive" && "text-success",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground"
              )}>
                {change}
              </p>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-xl transition-smooth group-hover:scale-110 animate-float",
            iconClasses[color]
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};