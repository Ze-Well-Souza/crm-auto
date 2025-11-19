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
      gradient: 'from-green-400 to-emerald-500',
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
      gradient: 'from-blue-400 to-blue-600',
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
      gradient: 'from-purple-400 to-purple-600',
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
      gradient: 'from-orange-400 to-red-500',
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
    } else {
      toast({
        title: `Plano ${planId} Selecionado`,
        description: "Crie sua conta para continuar."
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/10 backdrop-blur-sm bg-slate-900/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">Oficina Eficiente</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Value Prop */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                Sistema Completo de Gestão
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-white">Gerencie sua Oficina</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                  com Inteligência
                </span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                Sistema completo integrado ao Marketplace. Controle clientes, ordens de serviço, estoque e financeiro em um só lugar.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-300">Gestão de Clientes</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <Calendar className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-slate-300">Agendamentos</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <Package className="h-4 w-4 text-green-400" />
                <span className="text-sm text-slate-300">Controle de Estoque</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <DollarSign className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-slate-300">Financeiro</span>
              </div>
            </div>

            {/* Learn More Button */}
            <Button
              onClick={scrollToPlans}
              variant="ghost"
              className="text-blue-400 hover:text-blue-300 group"
            >
              Conheça os planos
              <ArrowDown className="ml-2 h-4 w-4 animate-bounce" />
            </Button>
          </div>

          {/* Right Column - Login Card */}
          <div className="animate-slide-up">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Acesse sua conta</CardTitle>
                <CardDescription className="text-slate-400">
                  Entre com suas credenciais para continuar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-300">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => navigate('/auth')}
                      className="text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/auth')}
                      className="text-slate-400 hover:text-slate-300"
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
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            Planos e Preços
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Escolha o plano ideal para sua oficina
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Comece grátis e escale conforme seu negócio cresce
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              className={`relative bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                plan.popular ? 'lg:scale-105 border-purple-500/50' : ''
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

              <CardHeader className="space-y-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center`}>
                  <plan.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-slate-400">{plan.description}</CardDescription>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-slate-400">{plan.period}</span>}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanSelect(plan.id)}
                  variant={plan.buttonVariant}
                  className={`w-full ${
                    plan.buttonVariant === 'default'
                      ? `bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white border-0`
                      : 'border-white/20 text-white hover:bg-white/10'
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
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span className="text-sm text-slate-300">
              Mais de 500 oficinas já confiam na Oficina Eficiente
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-sm bg-slate-900/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-blue-400" />
              <span className="text-white font-semibold">Oficina Eficiente</span>
            </div>
            <p className="text-sm text-slate-400">
              © 2025 Oficina Eficiente. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
