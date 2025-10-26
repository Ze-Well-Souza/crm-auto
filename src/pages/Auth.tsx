import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Car, Shield, Users, Wrench, Crown, Zap, Rocket } from 'lucide-react';

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { toast } = useToast();

  // Capturar plano pré-selecionado da URL
  const selectedPlan = searchParams.get('plan') || 'profissional';

  const planInfo = {
    'basico': { name: 'Básico', price: 'R$ 99/mês', icon: Zap, color: 'from-blue-500 to-blue-600' },
    'profissional': { name: 'Profissional', price: 'R$ 249/mês', icon: Crown, color: 'from-violet-500 to-purple-600', trial: '14 dias grátis' },
    'enterprise': { name: 'Enterprise', price: 'R$ 499/mês', icon: Rocket, color: 'from-orange-500 to-red-600' }
  }[selectedPlan] || { name: 'Profissional', price: 'R$ 249/mês', icon: Crown, color: 'from-violet-500 to-purple-600', trial: '14 dias grátis' };

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha todos os campos."
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(formData.email, formData.password);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro no Login",
        description: error.message === "Invalid login credentials" 
          ? "Credenciais inválidas. Verifique seu email e senha." 
          : error.message
      });
    } else {
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard..."
      });
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha todos os campos."
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "As senhas não coincidem."
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres."
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(formData.email, formData.password);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro no Cadastro",
        description: error.message === "User already registered" 
          ? "Este email já está cadastrado. Faça login." 
          : error.message
      });
    } else {
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar a conta."
      });
    }
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl space-y-6">
        {/* Plano Selecionado */}
        {selectedPlan && (
          <Card className="border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${planInfo.color}`}>
                    <planInfo.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Plano Selecionado: {planInfo.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{planInfo.price}</p>
                  </div>
                  {planInfo.trial && (
                    <Badge className="bg-violet-600 text-white">
                      {planInfo.trial}
                    </Badge>
                  )}
                </div>
                <Link to="/pricing">
                  <Button variant="ghost" size="sm">Ver todos os planos</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <div className="order-2 lg:order-1 space-y-6">
            <div className="text-center lg:text-left space-y-4">
              <div className="flex justify-center lg:justify-start">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                  <Car className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Oficina Eficiente
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Sistema completo de gestão para sua oficina mecânica
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center space-y-2 p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg">
                <Users className="h-8 w-8 text-blue-600" />
                <span className="text-sm font-medium">Gestão de Clientes</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg">
                <Wrench className="h-8 w-8 text-purple-600" />
                <span className="text-sm font-medium">Ordens de Serviço</span>
              </div>
            </div>
          </div>

          {/* Right side - Auth Form */}
          <div className="order-1 lg:order-2">
            <Card className="shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Acesse sua conta</CardTitle>
                <CardDescription>
                  Faça login ou crie uma conta para começar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Cadastro</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-4">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-4">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Senha</Label>
                        <Input
                          id="signup-password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Senha</Label>
                        <Input
                          id="confirm-password"
                          name="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? 'Criando conta...' : 'Criar Conta'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <div className="flex items-center justify-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mt-4">
              <Shield className="h-4 w-4" />
              <span>Seus dados estão protegidos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
