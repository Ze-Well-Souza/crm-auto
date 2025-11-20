// Reusable empty state component
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  showAction?: boolean;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  showAction = true
}: EmptyStateProps) => {
  return (
    <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Icon className="h-12 w-12 text-purple-400 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-400 mb-4 text-center max-w-sm">
          {description}
        </p>
        {showAction && actionLabel && onAction && (
          <Button onClick={onAction} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};