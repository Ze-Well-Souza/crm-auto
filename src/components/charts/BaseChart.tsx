import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LucideIcon } from 'lucide-react';

interface BaseChartProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  loading?: boolean;
  error?: string;
  className?: string;
  headerActions?: React.ReactNode;
}

export const BaseChart: React.FC<BaseChartProps> = ({
  title,
  description,
  icon: Icon,
  children,
  loading = false,
  error,
  className = "",
  headerActions
}) => {
  return (
    <Card className={`gradient-card ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-primary" />}
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {description && (
                <CardDescription className="text-sm text-muted-foreground">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <p className="text-sm">Erro ao carregar dados: {error}</p>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};