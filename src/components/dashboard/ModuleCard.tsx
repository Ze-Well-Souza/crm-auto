import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
  color?: "primary" | "success" | "warning" | "info" | "purple" | "pink" | "orange";
}

export const ModuleCard = ({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  badge,
  color = "primary" 
}: ModuleCardProps) => {
  const colorClasses = {
    primary: "from-primary/5 to-primary-light/3 border-primary/20 hover:shadow-primary",
    success: "from-success/5 to-success-light/3 border-success/20 hover:shadow-success",
    warning: "from-warning/5 to-warning-light/3 border-warning/20 hover:shadow-warning",
    info: "from-info/5 to-info-light/3 border-info/20 hover:shadow-info",
    purple: "from-purple/5 to-purple-light/3 border-purple/20 hover:shadow-purple",
    pink: "from-pink/5 to-pink-light/3 border-pink/20 hover:shadow-primary",
    orange: "from-orange/5 to-orange-light/3 border-orange/20 hover:shadow-warning"
  };

  const iconClasses = {
    primary: "bg-primary/10 text-primary group-hover:bg-primary/20",
    success: "bg-success/10 text-success group-hover:bg-success/20",
    warning: "bg-warning/10 text-warning group-hover:bg-warning/20",
    info: "bg-info/10 text-info group-hover:bg-info/20",
    purple: "bg-purple/10 text-purple group-hover:bg-purple/20",
    pink: "bg-pink/10 text-pink group-hover:bg-pink/20",
    orange: "bg-orange/10 text-orange group-hover:bg-orange/20"
  };

  const badgeClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info",
    purple: "bg-purple/10 text-purple",
    pink: "bg-pink/10 text-pink",
    orange: "bg-orange/10 text-orange"
  };

  return (
    <Link to={href}>
      <Card className={cn(
        "bg-gradient-to-br transition-smooth hover-lift hover-glow group cursor-pointer border animate-fade-in relative overflow-hidden",
        colorClasses[color]
      )}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-current to-transparent rounded-full -translate-x-8 -translate-y-8 group-hover:scale-150 transition-smooth"></div>
        </div>
        
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center justify-between">
            <div className={cn(
              "p-3 rounded-xl transition-smooth group-hover:scale-110 group-hover:rotate-6 animate-bounce-in",
              iconClasses[color]
            )}>
              <Icon className="h-6 w-6" />
            </div>
            {badge && (
              <span className={cn(
                "px-3 py-1 text-xs font-medium rounded-full transition-smooth animate-pulse-slow",
                badgeClasses[color]
              )}>
                {badge}
              </span>
            )}
          </div>
          <CardTitle className="text-lg group-hover:text-gradient-primary transition-smooth">{title}</CardTitle>
          <CardDescription className="text-sm group-hover:text-foreground/80 transition-smooth">{description}</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <Button 
            variant="ghost" 
            className="w-full justify-between group-hover:bg-background/60 group-hover:text-primary transition-smooth"
          >
            Acessar módulo
            <ArrowRight className="h-4 w-4 group-hover:translate-x-2 group-hover:text-primary transition-smooth" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};