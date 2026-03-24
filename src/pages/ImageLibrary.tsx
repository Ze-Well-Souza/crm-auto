import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ImageLibraryDashboard } from '@/components/image-library';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useImageLibrary } from '@/hooks/useImageLibrary';
import { useImageCollections } from '@/hooks/useImageCollections';
import {
  Images,
  HardDrive,
  FolderOpen,
  TrendingUp,
  Sparkles,
  Info,
} from 'lucide-react';

function StorageBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.min((used / limit) * 100, 100);
  const color = pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-yellow-500' : 'bg-emerald-500';
  return (
    <div className="w-full bg-muted rounded-full h-2">
      <div
        className={`${color} h-2 rounded-full transition-all duration-700`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function ImageLibrary() {
  const { images } = useImageLibrary();
  const { collections } = useImageCollections();

  // Calcular métricas reais
  const totalSizeBytes = images.reduce((sum, img) => sum + (img.file_size || 0), 0);
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(1);
  const totalSizeGB = (totalSizeBytes / (1024 * 1024 * 1024)).toFixed(2);
  const limitGB = 1; // Plano gratuito — 1 GB
  const usedGB = parseFloat(totalSizeGB);
  const storagePct = Math.min((usedGB / limitGB) * 100, 100);
  const favoriteCount = images.filter(img => img.is_favorite).length;
  const totalUsage = images.reduce((sum, img) => sum + (img.usage_count || 0), 0);

  const metrics = [
    {
      icon: Images,
      label: 'Total de imagens',
      value: images.length.toString(),
      sub: `${favoriteCount} favoritas`,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      icon: FolderOpen,
      label: 'Coleções',
      value: collections.length.toString(),
      sub: 'álbuns organizados',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      icon: HardDrive,
      label: 'Armazenamento',
      value: `${totalSizeMB} MB`,
      sub: `${storagePct.toFixed(0)}% do limite`,
      color: storagePct > 80 ? 'text-red-500' : 'text-emerald-500',
      bg: storagePct > 80 ? 'bg-red-500/10' : 'bg-emerald-500/10',
      extra: <StorageBar used={usedGB} limit={limitGB} />,
    },
    {
      icon: TrendingUp,
      label: 'Total de usos',
      value: totalUsage.toString(),
      sub: 'vezes referenciadas',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg">
              <Images className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Biblioteca de Imagens</h1>
                <Badge variant="secondary" className="text-xs gap-1">
                  <Sparkles className="h-3 w-3" />
                  Organizado
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Gerencie todas as imagens do seu negócio em um só lugar
              </p>
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <Card key={m.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${m.bg}`}>
                    <m.icon className={`h-4 w-4 ${m.color}`} />
                  </div>
                  <span className="text-xs text-muted-foreground">{m.label}</span>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                  <p className="text-xs text-muted-foreground">{m.sub}</p>
                </div>
                {m.extra && <div className="pt-1">{m.extra}</div>}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dica de uso */}
        {images.length === 0 && (
          <div className="flex items-start gap-3 p-4 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Dica:</strong> Faça upload de imagens de veículos, peças e documentos para
              vincular diretamente a clientes, ordens de serviço e estoque. Formatos aceitos: JPG,
              PNG, WEBP (máx. 10 MB por arquivo).
            </div>
          </div>
        )}

        {/* Dashboard principal */}
        <ImageLibraryDashboard />
      </div>
    </DashboardLayout>
  );
}
