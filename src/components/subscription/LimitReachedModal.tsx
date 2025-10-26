import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Crown, TrendingUp } from 'lucide-react';

interface LimitReachedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceName: string;
  currentLimit: number;
  nextPlanLimit: number;
  nextPlanName: string;
}

export const LimitReachedModal = ({
  open,
  onOpenChange,
  resourceName,
  currentLimit,
  nextPlanLimit,
  nextPlanName,
}: LimitReachedModalProps) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate('/planos');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
              <Crown className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <DialogTitle className="text-center">
            Limite de {resourceName} atingido
          </DialogTitle>
          <DialogDescription className="text-center">
            Você atingiu o limite de {currentLimit} {resourceName.toLowerCase()} do seu plano atual.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-4 my-4">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-semibold">Plano {nextPlanName}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Com o upgrade você terá acesso a:
          </p>
          <ul className="text-sm mt-2 space-y-1">
            <li>• {nextPlanLimit === -1 ? 'Ilimitado' : nextPlanLimit} {resourceName.toLowerCase()}</li>
            <li>• Recursos avançados desbloqueados</li>
            <li>• Suporte prioritário</li>
          </ul>
        </div>

        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Agora não
          </Button>
          <Button onClick={handleUpgrade}>
            <Crown className="h-4 w-4 mr-2" />
            Fazer Upgrade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
