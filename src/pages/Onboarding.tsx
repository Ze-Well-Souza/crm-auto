import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Building2, User, Wrench, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    workshopName: '',
    workshopPhone: '',
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    // Check if user has already completed onboarding
    const checkOnboarding = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single();

      // If profile has full_name, user already completed onboarding
      if (profile?.full_name) {
        navigate('/');
      }
    };

    checkOnboarding();
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.fullName) {
        toast({
          variant: 'destructive',
          title: 'Campo obrigatório',
          description: 'Por favor, informe seu nome completo.'
        });
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          phone: formData.phone
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      toast({
        title: '🎉 Bem-vindo ao CRM Auto!',
        description: 'Sua conta foi configurada com sucesso.'
      });

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao finalizar',
        description: 'Ocorreu um erro ao configurar sua conta. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold">Informações Pessoais</h2>
              <p className="text-muted-foreground">
                Vamos começar configurando seu perfil
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="João Silva"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(11) 98765-4321"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900 mb-4">
                <Building2 className="h-8 w-8 text-violet-600 dark:text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold">Informações da Oficina</h2>
              <p className="text-muted-foreground">
                Configure os dados do seu negócio (opcional)
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workshopName">Nome da Oficina</Label>
                <Input
                  id="workshopName"
                  name="workshopName"
                  placeholder="Auto Center Silva"
                  value={formData.workshopName}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  Este nome aparecerá nos emails enviados aos clientes
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workshopPhone">Telefone da Oficina</Label>
                <Input
                  id="workshopPhone"
                  name="workshopPhone"
                  type="tel"
                  placeholder="(11) 3456-7890"
                  value={formData.workshopPhone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold">Tudo Pronto!</h2>
              <p className="text-muted-foreground">
                Comece a usar o CRM Auto agora mesmo
              </p>
            </div>

            <div className="space-y-4 bg-slate-50 dark:bg-slate-800 p-6 rounded-lg">
              <h3 className="font-semibold flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-600" />
                Próximos Passos
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="inline-block w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Cadastre seus primeiros clientes e veículos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Configure seu estoque de peças</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span>Crie seu primeiro agendamento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                    4
                  </span>
                  <span>Explore os relatórios e análises</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>💡 Dica:</strong> Você pode acessar o tutorial completo a qualquer momento pelo menu de configurações.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Configuração Inicial</CardTitle>
              <span className="text-sm text-muted-foreground">
                Passo {currentStep} de {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {renderStep()}

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={isLoading}>
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={isLoading}>
                {isLoading ? 'Finalizando...' : 'Começar a Usar'}
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
