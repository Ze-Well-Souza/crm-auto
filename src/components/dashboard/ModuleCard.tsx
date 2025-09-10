import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon, ArrowRight } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
  color?: "primary" | "success" | "warning";
}

export const ModuleCard = ({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  badge,
  color = "primary" 
}: ModuleCardProps) => {
  return (
    <Card className="gradient-card shadow-card hover:shadow-elevated transition-smooth cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`p-2 bg-${color}/10 rounded-lg`}>
            <Icon className={`h-6 w-6 text-${color}`} />
          </div>
          {badge && (
            <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
              {badge}
            </span>
          )}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant="ghost" 
          className="w-full justify-between group-hover:bg-primary/5 transition-fast"
        >
          Acessar módulo
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-fast" />
        </Button>
      </CardContent>
    </Card>
  );
};