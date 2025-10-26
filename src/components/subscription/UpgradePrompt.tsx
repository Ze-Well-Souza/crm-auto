import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';

interface UpgradePromptProps {
  feature: string;
  title?: string;
  description?: string;
}

export const UpgradePrompt = ({
  feature,
  title = 'Recurso Premium',
  description = 'Este recurso está disponível apenas em planos superiores.',
}: UpgradePromptProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Lock className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Desbloqueie este recurso com:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Plano Profissional ou Enterprise</li>
                <li>✓ 14 dias de trial grátis</li>
                <li>✓ Cancele quando quiser</li>
              </ul>
            </div>

            <Button 
              onClick={() => navigate('/planos')} 
              className="w-full"
              size="lg"
            >
              Ver Planos Disponíveis
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="w-full"
            >
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
