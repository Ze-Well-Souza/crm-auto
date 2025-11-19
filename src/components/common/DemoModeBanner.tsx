import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DemoModeBannerProps {
  show: boolean;
}

export const DemoModeBanner = ({ show }: DemoModeBannerProps) => {
  if (!show) return null;

  return (
    <Alert className="mb-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
      <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertDescription className="text-blue-800 dark:text-blue-300">
        <strong>Modo Demo:</strong> Você está visualizando dados de demonstração. 
        Para acessar dados reais, faça login com uma conta válida.
      </AlertDescription>
    </Alert>
  );
};
