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
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Car, Shield, Users, Wrench, Crown, Zap, Rocket, Eye, EyeOff, Check, X, CheckCircle } from 'lucide-react';

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation function
  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isMinLength = password.length >= 6;

    return {
      isValid: hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isMinLength,
      requirements: {
        uppercase: hasUpperCase,
        lowercase: hasLowerCase,
        number: hasNumber,
        specialChar: hasSpecialChar,
        minLength: isMinLength
      }
    };
  };

  const passwordValidation = validatePassword(formData.password);

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

    if (!passwordValidation.isValid) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A senha deve conter: 1 letra maiúscula, 1 minúscula, 1 número, 1 caractere especial e no mínimo 6 caracteres."
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
      setRegisteredEmail(formData.email);
      setShowEmailVerification(true);
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
      <ThemeToggle />
      <div className="w-full max-w-5xl space-y-6">
        {/* Plano Selecionado */}
        {selectedPlan && (
          <Card className="border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
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
                {showEmailVerification ? (
                  // Email Verification Message
                  <div className="space-y-6 py-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Verifique seu Email</h3>
                      <p className="text-sm text-muted-foreground">
                        Enviamos um link de confirmação para:
                      </p>
                      <p className="font-semibold text-blue-600 dark:text-blue-400">
                        {registeredEmail}
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-lg text-left space-y-2">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                        📧 Próximos passos:
                      </p>
                      <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                        <li>Abra sua caixa de entrada</li>
                        <li>Procure por email de "CRM Auto"</li>
                        <li>Clique no link de confirmação</li>
                        <li>Complete a configuração da sua conta</li>
                      </ol>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Não recebeu o email? Verifique sua caixa de spam ou entre em contato.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowEmailVerification(false);
                        setFormData({ email: '', password: '', confirmPassword: '' });
                      }}
                    >
                      Voltar ao Login
                    </Button>
                  </div>
                ) : (
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                      <TabsTrigger value="login" className="data-[state=active]:bg-gray-300 data-[state=active]:text-black text-gray-700">Login</TabsTrigger>
                      <TabsTrigger value="signup" className="data-[state=active]:bg-gray-300 data-[state=active]:text-black text-gray-700">Cadastro</TabsTrigger>
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
                          className="bg-gray-100 border-gray-300 text-black placeholder-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="pr-10 bg-gray-100 border-gray-300 text-black placeholder-gray-500"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
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
                          className="bg-gray-100 border-gray-300 text-black placeholder-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Senha</Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="pr-10 bg-gray-100 border-gray-300 text-black placeholder-gray-500"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {formData.password && (
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1">
                              {passwordValidation.requirements.minLength ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-red-500" />}
                              <span className={passwordValidation.requirements.minLength ? 'text-green-600' : 'text-red-600'}>Mínimo 6 caracteres</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {passwordValidation.requirements.uppercase ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-red-500" />}
                              <span className={passwordValidation.requirements.uppercase ? 'text-green-600' : 'text-red-600'}>1 letra maiúscula</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {passwordValidation.requirements.lowercase ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-red-500" />}
                              <span className={passwordValidation.requirements.lowercase ? 'text-green-600' : 'text-red-600'}>1 letra minúscula</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {passwordValidation.requirements.number ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-red-500" />}
                              <span className={passwordValidation.requirements.number ? 'text-green-600' : 'text-red-600'}>1 número</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {passwordValidation.requirements.specialChar ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-red-500" />}
                              <span className={passwordValidation.requirements.specialChar ? 'text-green-600' : 'text-red-600'}>1 caractere especial</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Senha</Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            className="pr-10 bg-gray-100 border-gray-300 text-black placeholder-gray-500"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                          <p className="text-xs text-red-600">As senhas não coincidem</p>
                        )}
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                          <p className="text-xs text-green-600">As senhas coincidem</p>
                        )}
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
                )}
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