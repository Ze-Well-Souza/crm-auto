import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Car, Shield, Users, Wrench, Crown, Zap, Rocket, Eye, EyeOff, Check, X, CheckCircle, Star, ArrowRight, TrendingUp, Clock, ChevronDown } from 'lucide-react';

const Auth = () => {
  const { user, signIn, signUp, resetPassword, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

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

  const allPlans = [
    {
      id: 'gratuito',
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      description: 'Experimente grátis para sempre',
      icon: Star,
      color: 'from-green-500 to-emerald-600',
      free: true,
      features: [
        '40 clientes ativos',
        '40 agendamentos/mês',
        'Gestão básica completa',
        '1 usuário',
        'Suporte por email'
      ]
    },
    {
      id: 'basico',
      name: 'Básico',
      price: 'R$ 99',
      period: '/mês',
      description: 'Ideal para oficinas iniciantes',
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      features: [
        '200 clientes',
        '100 agendamentos/mês',
        'Relatórios básicos ilimitados',
        '1 usuário',
        'Suporte por email'
      ]
    },
    {
      id: 'profissional',
      name: 'Profissional',
      price: 'R$ 249',
      period: '/mês',
      description: 'Para oficinas em crescimento',
      icon: Crown,
      color: 'from-blue-500 to-blue-700',
      popular: true,
      trial: true,
      features: [
        '1.000 clientes',
        '500 agendamentos/mês',
        'TODOS os módulos',
        'Gestão financeira avançada',
        'Controle de estoque',
        '5 usuários',
        '14 dias grátis! 🎁'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'R$ 499',
      period: '/mês',
      description: 'Para redes e grandes oficinas',
      icon: Rocket,
      color: 'from-orange-500 to-red-600',
      features: [
        'Recursos ilimitados',
        'Multi-unidades',
        'API access completo',
        'Account manager dedicado',
        'Treinamento personalizado'
      ]
    }
  ];

  const planInfo = allPlans.find(p => p.id === selectedPlan) || allPlans[2];

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, informe seu email."
      });
      return;
    }

    setIsLoading(true);
    const { error } = await resetPassword(forgotPasswordEmail);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message
      });
    } else {
      toast({
        title: "Email Enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha."
      });
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    }
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


  const faqs = [
    {
      question: 'O plano gratuito é realmente grátis para sempre?',
      answer: 'Sim! O plano gratuito não tem custo e pode ser usado para sempre. Você tem acesso a 40 clientes ativos, 40 agendamentos por mês e 5 relatórios mensais sem pagar nada. Perfeito para começar ou para pequenas oficinas.'
    },
    {
      question: 'Como funciona o trial gratuito?',
      answer: 'Você tem 14 dias completos para testar TODOS os recursos do plano Profissional. Não pedimos cartão de crédito e você pode cancelar a qualquer momento.'
    },
    {
      question: 'Posso mudar de plano depois?',
      answer: 'Sim! Você pode fazer upgrade ou downgrade a qualquer momento. O upgrade é imediato e o downgrade ocorre no final do ciclo de cobrança.'
    },
    {
      question: 'Quais formas de pagamento aceitam?',
      answer: 'Aceitamos cartão de crédito (parcelamento disponível), PIX e boleto bancário. Todos os pagamentos são processados de forma segura pelo Stripe.'
    },
    {
      question: 'Meus dados estão seguros?',
      answer: 'Sim! Utilizamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança. Todos os dados são armazenados em servidores certificados.'
    }
  ];

  return (
    <>
      {/* PÁGINA PRINCIPAL */}
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
        {/* Header */}
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Car className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Uautos Pro
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={() => setShowAuthDialog(true)}
                className="hover:bg-accent"
              >
                Já tem conta? Entrar
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <Badge className="mb-4 bg-success/10 text-success border-success/20 hover:bg-success/20">
            ✨ Plano GRATUITO disponível - Use para sempre sem pagar nada!
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-blue-600 bg-clip-text text-transparent">
            Escolha o plano ideal para sua oficina
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Gerencie sua oficina de forma profissional integrado ao Marketplace Uautos.
            Comece grátis hoje mesmo!
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 text-white shadow-lg"
            onClick={() => setShowAuthDialog(true)}
          >
            Começar Grátis Agora <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </section>

        {/* Plans Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {allPlans.map((plan) => {
              const IconComponent = plan.icon;
              return (
                <Card 
                  key={plan.id}
                  className={`relative overflow-hidden transition-all hover:shadow-xl ${
                    plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-primary text-white border-0">
                      👑 Mais Popular
                    </Badge>
                  )}
                  {plan.free && (
                    <Badge className="absolute top-4 right-4 bg-gradient-to-r from-success to-emerald-600 text-white border-0">
                      ✨ 100% Grátis
                    </Badge>
                  )}
                  
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                    <div className="pt-4">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {plan.trial && (
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 mb-4">
                        <p className="text-sm text-primary font-medium text-center">
                          🎁 14 dias grátis - Sem cartão de crédito!
                        </p>
                      </div>
                    )}
                    
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full mt-6 ${
                        plan.id === 'enterprise'
                          ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:opacity-90'
                          : plan.id === 'gratuito'
                          ? 'bg-gradient-to-r from-success to-emerald-600 hover:opacity-90'
                          : plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-primary hover:opacity-90'
                          : 'bg-primary hover:bg-primary/90'
                      } text-white shadow-lg`}
                      onClick={() => {
                        if (plan.id === 'enterprise') {
                          window.location.href = 'mailto:vendas@crm.com?subject=Interesse no Plano Enterprise';
                        } else {
                          setShowAuthDialog(true);
                        }
                      }}
                    >
                      {plan.id === 'enterprise' ? 'Falar com Vendas' : 
                       plan.id === 'gratuito' ? 'Começar Grátis' :
                       plan.trial ? 'Começar Trial Grátis' : 'Começar Agora'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <Card className="border-border hover:shadow-lg transition-all">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-success mb-2" />
                <CardTitle>Aumente sua Produtividade</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Automatize processos e economize até 10 horas por semana com nosso sistema inteligente.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-border hover:shadow-lg transition-all">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>100% Seguro</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Seus dados protegidos com criptografia de ponta a ponta e backups automáticos diários.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-border hover:shadow-lg transition-all">
              <CardHeader>
                <Clock className="h-10 w-10 text-warning mb-2" />
                <CardTitle>Suporte Rápido</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Atendimento ágil e eficiente para resolver qualquer dúvida ou problema.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mb-20">
            <h3 className="text-3xl font-bold text-center mb-2 text-foreground">Perguntas Frequentes</h3>
            <p className="text-center text-muted-foreground mb-12">Tire suas dúvidas sobre nossos planos</p>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between text-foreground">
                      {faq.question}
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </CardTitle>
                    <CardDescription className="text-muted-foreground pt-2">
                      {faq.answer}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/40 bg-background/80 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-muted-foreground">
              © 2025 UAutos. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>

      {/* AUTH DIALOG */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Acesse sua conta</DialogTitle>
            <DialogDescription>
              Faça login ou crie uma conta para começar
            </DialogDescription>
          </DialogHeader>
          
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
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
                
                <Button
                  type="button"
                  variant="link"
                  className="w-full"
                  onClick={() => {
                    setShowAuthDialog(false);
                    setShowForgotPassword(true);
                  }}
                >
                  Esqueci minha senha
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
                  <div className="relative">
                    <Input
                      id="signup-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {formData.password && (
                    <div className="text-sm space-y-1 mt-2">
                      <div className="flex items-center gap-2">
                        {passwordValidation.requirements.minLength ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <X className="h-4 w-4 text-destructive" />
                        )}
                        <span className={passwordValidation.requirements.minLength ? "text-success" : "text-muted-foreground"}>
                          Mínimo 6 caracteres
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordValidation.requirements.uppercase ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <X className="h-4 w-4 text-destructive" />
                        )}
                        <span className={passwordValidation.requirements.uppercase ? "text-success" : "text-muted-foreground"}>
                          Uma letra maiúscula
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordValidation.requirements.lowercase ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <X className="h-4 w-4 text-destructive" />
                        )}
                        <span className={passwordValidation.requirements.lowercase ? "text-success" : "text-muted-foreground"}>
                          Uma letra minúscula
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordValidation.requirements.number ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <X className="h-4 w-4 text-destructive" />
                        )}
                        <span className={passwordValidation.requirements.number ? "text-success" : "text-muted-foreground"}>
                          Um número
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordValidation.requirements.specialChar ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <X className="h-4 w-4 text-destructive" />
                        )}
                        <span className={passwordValidation.requirements.specialChar ? "text-success" : "text-muted-foreground"}>
                          Um caractere especial (!@#$%^&*)
                        </span>
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
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading || !passwordValidation.isValid}>
                  {isLoading ? "Criando conta..." : "Criar Conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="flex items-center justify-center pt-4 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 mr-2" />
            Seus dados estão protegidos
          </div>
        </DialogContent>
      </Dialog>

      {/* EMAIL VERIFICATION DIALOG */}
      <Dialog open={showEmailVerification} onOpenChange={setShowEmailVerification}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verifique seu email</DialogTitle>
            <DialogDescription>
              Enviamos um link de confirmação para <strong>{registeredEmail}</strong>.
              Por favor, verifique sua caixa de entrada e spam.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowEmailVerification(false)}>Entendi</Button>
        </DialogContent>
      </Dialog>

      {/* FORGOT PASSWORD DIALOG */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recuperar senha</DialogTitle>
            <DialogDescription>
              Informe seu email e enviaremos um link para redefinir sua senha.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="seu@email.com"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar Link"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Auth;