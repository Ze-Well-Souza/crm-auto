import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Rocket, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const PlanosPublicos = () => {
  const plans = [
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
        '5 relatórios/mês',
        'Gestão de clientes e veículos',
        'Agendamentos básicos',
        '1 usuário',
        'Suporte por email',
        '✨ Grátis para sempre!'
      ],
      cta: 'Começar Grátis',
      href: '/auth?plan=gratuito'
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
        'Gestão de clientes e veículos',
        'Agendamentos básicos',
        'Relatórios básicos ilimitados',
        '1 usuário',
        'Suporte por email'
      ],
      cta: 'Começar Agora',
      href: '/auth?plan=basico'
    },
    {
      id: 'profissional',
      name: 'Profissional',
      price: 'R$ 249',
      period: '/mês',
      description: 'Para oficinas em crescimento',
      icon: Crown,
      color: 'from-violet-500 to-purple-600',
      popular: true,
      trial: true,
      features: [
        '1.000 clientes',
        '500 agendamentos/mês',
        'TODOS os módulos',
        'Ordens de serviço completas',
        'Gestão financeira avançada',
        'Controle de estoque',
        'Relatórios avançados (50/mês)',
        '5 usuários',
        'Automações básicas',
        'Suporte prioritário',
        '14 dias grátis! 🎁'
      ],
      cta: 'Começar Trial Grátis',
      href: '/auth?plan=profissional'
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
        'Clientes ilimitados',
        'Agendamentos ilimitados',
        'TODOS os módulos',
        'Relatórios ilimitados',
        'Usuários ilimitados',
        'API access completo',
        'Multi-unidades',
        'Integrações customizadas',
        'Account manager dedicado',
        'Treinamento personalizado',
        'SLA garantido'
      ],
      cta: 'Falar com Vendas',
      href: 'mailto:vendas@crm.com?subject=Interesse no Plano Enterprise'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Crown className="h-8 w-8 text-violet-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              CRM Oficina
            </h1>
          </div>
          <Link to="/auth">
            <Button variant="outline">
              Já tem conta? Entrar
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">
          ✨ Plano GRATUITO disponível - Use para sempre sem pagar nada!
        </Badge>
        <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
          Escolha o plano ideal para sua oficina
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
          Gerencie sua oficina de forma profissional com o melhor CRM do mercado.
          Comece grátis hoje mesmo!
        </p>
      </section>

      {/* Plans Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.popular 
                  ? 'border-4 border-violet-500 shadow-2xl' 
                  : 'border border-slate-200 dark:border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-1 text-sm font-bold rounded-bl-lg flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  Mais Popular
                </div>
              )}
              
              {plan.free && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 text-sm font-bold rounded-bl-lg flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  100% Grátis
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div className={`mx-auto mb-4 p-4 rounded-full bg-gradient-to-r ${plan.color} w-fit`}>
                  <plan.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-slate-600 dark:text-slate-400">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {plan.trial && (
                  <div className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 p-4 rounded-lg mb-4 border-2 border-violet-300 dark:border-violet-700">
                    <p className="text-center font-bold text-violet-700 dark:text-violet-300">
                      🎁 14 dias grátis - Sem cartão de crédito!
                    </p>
                  </div>
                )}
                
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  asChild
                  className={`w-full bg-gradient-to-r ${plan.color} text-white hover:opacity-90 transition-opacity h-12 text-base font-semibold`}
                  size="lg"
                >
                  {plan.id === 'enterprise' ? (
                    <a href={plan.href}>
                      {plan.cta} <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  ) : (
                    <Link to={plan.href}>
                      {plan.cta} <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h3>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">O plano gratuito é realmente grátis para sempre?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Sim! O plano gratuito não tem custo e pode ser usado para sempre. Você tem acesso a
                  40 clientes ativos, 40 agendamentos por mês e 5 relatórios mensais sem pagar nada.
                  Perfeito para começar ou para pequenas oficinas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como funciona o trial gratuito?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Você tem 14 dias completos para testar TODOS os recursos do plano Profissional.
                  Não pedimos cartão de crédito e você pode cancelar a qualquer momento.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Posso mudar de plano depois?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Sim! Você pode fazer upgrade ou downgrade a qualquer momento.
                  O upgrade é imediato e o downgrade ocorre no final do ciclo de cobrança.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quais formas de pagamento aceitam?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Aceitamos cartão de crédito (parcelamento disponível), PIX e boleto bancário.
                  Todos os pagamentos são processados de forma segura pelo Stripe.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Meus dados estão seguros?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Sim! Utilizamos criptografia de ponta a ponta e seguimos as melhores práticas
                  de segurança. Todos os dados são armazenados em servidores certificados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
          <p>© 2024 CRM Oficina. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default PlanosPublicos;
