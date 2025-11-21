import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import {
  Car,
  Users,
  Calendar,
  Package,
  DollarSign,
  Zap,
  Crown,
  Rocket,
  Star,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowDown,
  Check,
  TrendingUp
} from 'lucide-react';

const Landing = () => {
  const { user, signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
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
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const scrollToPlans = () => {
    document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const plans = [
    {
      id: 'gratuito',
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      description: 'Ideal para começar',
      icon: Star,
      gradient: 'from-green-500 to-emerald-600',
      features: [
        '40 clientes ativos',
        '40 agendamentos/mês',
        'Gestão básica completa',
        '1 usuário'
      ],
      buttonText: 'Começar Grátis',
      buttonVariant: 'outline' as const
    },
    {
      id: 'basico',
      name: 'Básico',
      price: 'R$ 99',
      period: '/mês',
      description: 'Para oficinas pequenas',
      icon: Zap,
      gradient: 'from-blue-500 to-blue-700',
      features: [
        '200 clientes',
        '100 agendamentos/mês',
        'Relatórios básicos ilimitados',
        '1 usuário'
      ],
      buttonText: 'Assinar Agora',
      buttonVariant: 'default' as const
    },
    {
      id: 'profissional',
      name: 'Profissional',
      price: 'R$ 249',
      period: '/mês',
      description: 'Mais Popular',
      icon: Crown,
      gradient: 'from-blue-500 to-blue-700',
      popular: true,
      features: [
        '1.000 clientes',
        '500 agendamentos/mês',
        'Gestão financeira avançada',
        'Controle de estoque',
        '5 usuários'
      ],
      buttonText: 'Assinar Agora',
      buttonVariant: 'default' as const
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Personalizado',
      period: '',
      description: 'Recursos ilimitados',
      icon: Rocket,
      gradient: 'from-orange-500 to-red-600',
      features: [
        'Clientes ilimitados',
        'Multi-unidades',
        'API completa',
        'Suporte 24/7',
        'Usuários ilimitados'
      ],
      buttonText: 'Falar com Vendas',
      buttonVariant: 'outline' as const
    }
  ];

  const handlePlanSelect = (planId: string) => {
    if (planId === 'enterprise') {
      toast({
        title: "Plano Enterprise",
        description: "Em breve você receberá um contato da nossa equipe de vendas."
      });
      navigate(`/register?plan=${planId}`);
    } else {
      navigate(`/register?plan=${planId}`);
    }
  };

  const fillDemoAndLogin = async () => {
    setFormData({ email: 'admin@oficina.com', password: '123456' });
    setIsLoading(true);
    const { error } = await signIn('admin@oficina.com', '123456');
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro no Login',
        description: error.message === 'Invalid login credentials'
          ? 'Credenciais inválidas. Verifique seu email e senha.'
          : error.message
      });
    } else {
      toast({ title: 'Login demo preenchido', description: 'Redirecionando para o dashboard...' });
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-transparent" />
      <div className="absolute -top-16 left-1/5 w-[32rem] h-[32rem] bg-blue-100/30 dark:bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 right-0 w-[28rem] h-[28rem] bg-cyan-100/30 dark:bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 w-[36rem] h-[36rem] bg-blue-100/30 dark:bg-blue-500/10 rounded-full blur-[140px]" />

      {/* Navbar */}
      <nav className="relative z-10 border-b border-slate-200 dark:border-white/10 backdrop-blur-sm bg-white/80 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">Uautos Pro</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Value Prop */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge className="bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30">
                Sistema Completo de Gestão
              </Badge>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight">
                <span className="text-slate-900 dark:text-white drop-shadow-[0_2px_8px_rgba(59,130,246,0.25)]">Gerencie sua Oficina</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 dark:from-blue-400 dark:via-blue-300 dark:to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(37,99,235,0.35)]">
                  com Inteligência
                </span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                Sistema completo integrado ao Marketplace Uautos. Controle clientes, ordens de serviço, estoque e financeiro em um só lugar.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Gestão de Clientes</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10">
                <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Agendamentos</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10">
                <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Controle de Estoque</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10">
                <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Financeiro</span>
              </div>
            </div>

            {/* Learn More Button */}
            <Button
              onClick={scrollToPlans}
              variant="ghost"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group"
            >
              Conheça os planos
              <ArrowDown className="ml-2 h-4 w-4 animate-bounce" />
            </Button>
          </div>

          {/* Right Column - Login Card */}
          <div>
            <Card className="relative bg-white/90 dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-2xl shadow-indigo-500/20 dark:shadow-indigo-400/20 backdrop-blur-xl">
              <div className="absolute -inset-0.5 rounded-xl pointer-events-none dark:shadow-[0_0_60px_rgba(99,102,241,0.25)]" />
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900 dark:text-white">Acesse sua conta</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Entre com suas credenciais para continuar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="pl-10 bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 dark:focus:border-blue-500/50 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="pl-10 pr-10 bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 dark:focus:border-blue-500/50 focus:ring-blue-500/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 px-0"
                  onClick={fillDemoAndLogin}
                >
                  🔑 Preencher Credenciais Demo
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => navigate('/reset-password')}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/register')}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
                    >
                      Criar conta →
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="relative z-10 container mx-auto px-4 py-24">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <Badge className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30">
            Planos e Preços
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
            Escolha o plano ideal para sua oficina
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Comece grátis e escale conforme seu negócio cresce
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              className={`relative bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
                plan.popular ? 'lg:scale-105 border-blue-300 dark:border-blue-500/40' : 'hover:border-slate-300 dark:hover:border-white/20'
              } ${
                plan.id === 'gratuito' ? 'shadow-emerald-500/20 dark:shadow-emerald-900/20 hover:shadow-emerald-500/30' :
                plan.id === 'basico' ? 'shadow-blue-500/20 dark:shadow-blue-500/20 hover:shadow-blue-500/30' :
                plan.id === 'profissional' ? 'shadow-blue-500/20 dark:shadow-blue-500/20 hover:shadow-blue-500/30' :
                'shadow-orange-500/20 dark:shadow-orange-500/20 hover:shadow-orange-500/30'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                    <Star className="h-3 w-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}

              {/* Neon glow per plan - only in dark mode */}
              {plan.id === 'gratuito' && (
                <div className="absolute -inset-1 rounded-2xl pointer-events-none dark:shadow-[0_0_50px_rgba(16,185,129,0.25)]" />
              )}
              {plan.id === 'basico' && (
                <div className="absolute -inset-1 rounded-2xl pointer-events-none dark:shadow-[0_0_50px_rgba(59,130,246,0.25)]" />
              )}
              {plan.id === 'profissional' && (
                <div className="absolute -inset-1 rounded-2xl pointer-events-none dark:shadow-[0_0_60px_rgba(168,85,247,0.28)]" />
              )}
              {plan.id === 'enterprise' && (
                <div className="absolute -inset-1 rounded-2xl pointer-events-none dark:shadow-[0_0_60px_rgba(234,88,12,0.28)]" />
              )}

              <CardHeader className="space-y-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center shadow-lg`}>
                  <plan.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-slate-900 dark:text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">{plan.description}</CardDescription>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                    {plan.period && <span className="text-slate-600 dark:text-slate-400">{plan.period}</span>}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanSelect(plan.id)}
                  variant={plan.buttonVariant}
                  className={`w-full ${
                    plan.buttonVariant === 'default'
                      ? `bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white border-0`
                      : 'border-slate-300 dark:border-white/20 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Mais de 500 oficinas já confiam no Uautos Pro
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-white/10 backdrop-blur-sm bg-white/80 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-slate-900 dark:text-white font-semibold">Uautos Pro</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © 2025 Uautos. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
