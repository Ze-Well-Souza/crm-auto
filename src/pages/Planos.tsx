import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Shield, Star, Zap, Infinity as InfinityIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    description: 'Para quem está começando e precisa do básico.',
    price: '0',
    icon: <Shield className="w-5 h-5 text-slate-400" />,
    features: [
      { name: '10 Clientes ativos', included: true },
      { name: 'Agendamentos básicos', included: true },
      { name: '10 Relatórios/mês', included: true },
      { name: '1 Usuário', included: true },
      { name: 'Controle de Estoque', included: false },
      { name: 'Ordens de Serviço', included: false },
      { name: 'Integração WhatsApp', included: false },
      { name: 'Suporte Prioritário', included: false },
    ],
    buttonText: 'Seu plano atual',
    buttonVariant: 'outline' as const,
    disabled: true,
  },
  {
    name: 'Básico',
    description: 'Ideal para oficinas em crescimento.',
    price: '49',
    icon: <Star className="w-5 h-5 text-blue-500" />,
    features: [
      { name: '50 Clientes ativos', included: true },
      { name: 'Agendamentos ilimitados', included: true },
      { name: '50 Relatórios/mês', included: true },
      { name: '3 Usuários', included: true },
      { name: 'Controle de Estoque', included: true },
      { name: 'Ordens de Serviço', included: true },
      { name: 'Integração WhatsApp', included: false },
      { name: 'Suporte Prioritário', included: false },
    ],
    buttonText: 'Assinar Básico',
    buttonVariant: 'outline' as const,
    disabled: false,
  },
  {
    name: 'Profissional',
    description: 'O parceiro ideal de grandes centros automotivos.',
    price: '99',
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    popular: true,
    features: [
      { name: 'Clientes Ilimitados', included: true },
      { name: 'Agendamentos ilimitados', included: true },
      { name: 'Relatórios Ilimitados', included: true },
      { name: '10 Usuários', included: true },
      { name: 'Controle de Estoque', included: true },
      { name: 'Ordens de Serviço', included: true },
      { name: 'Integração WhatsApp', included: true },
      { name: 'Suporte Prioritário', included: true },
    ],
    buttonText: 'Começar Trial 90 Dias',
    buttonVariant: 'default' as const,
    disabled: false,
    gradient: 'from-blue-600 to-purple-600',
  },
  {
    name: 'Enterprise',
    description: 'Operações complexas e multiloja.',
    price: '199',
    icon: <InfinityIcon className="w-5 h-5 text-emerald-400" />,
    features: [
      { name: 'Tudo do Profissional', included: true },
      { name: 'Multi-loja', included: true },
      { name: 'Usuários Ilimitados', included: true },
      { name: 'API de Integração', included: true },
      { name: 'Gerente de Conta', included: true },
      { name: 'Backup Diário', included: true },
      { name: 'Treinamento Presencial', included: false },
      { name: 'Desenvolvimento Custom', included: false },
    ],
    buttonText: 'Falar com Vendas',
    buttonVariant: 'outline' as const,
    disabled: false,
  }
];

export default function Planos() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-poppins py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Escolha o plano ideal para sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">oficina</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Sem pegadinhas. Você tem 90 dias de teste gratuito no plano Profissional para explorar tudo que o Uautos CRM pode fazer por você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, i) => (
            <Card 
              key={i} 
              className={`relative bg-white dark:bg-slate-800 border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-purple-500 shadow-purple-500/20 scale-105 z-10' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-400/50'
              } rounded-2xl flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                  Mais Popular
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8 shrink-0">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-xl ${plan.popular ? 'bg-purple-100 dark:bg-purple-500/20' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-slate-500 min-h-[40px]">{plan.description}</CardDescription>
                
                <div className="mt-6 flex items-end justify-center gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">R$ {plan.price}</span>
                  <span className="text-slate-500 font-medium mb-1">/mês</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="rounded-full bg-blue-100 dark:bg-blue-500/20 p-1">
                          <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="rounded-full bg-slate-100 dark:bg-slate-700 p-1">
                          <X className="w-3 h-3 text-slate-400" strokeWidth={3} />
                        </div>
                      )}
                      <span className={`text-sm ${feature.included ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500 line-through decoration-slate-300'}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-6 shrink-0 mt-auto">
                <Button 
                  className={`w-full py-6 rounded-xl font-bold ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-purple-500/30 border-0'
                      : ''
                  }`}
                  variant={plan.buttonVariant}
                  disabled={plan.disabled}
                  onClick={() => navigate('/dashboard')}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
