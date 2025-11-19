import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

const Documentation = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Documentação
          </h1>
          <p className="text-muted-foreground mt-2">
            Guia rápido dos módulos e funcionalidades.
          </p>
        </div>

        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Introdução
            </CardTitle>
            <CardDescription>Conteúdo placeholder para começar a documentação.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Esta página serve como ponto de partida. Adicione tópicos, tutoriais e referências conforme necessário.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Documentation;