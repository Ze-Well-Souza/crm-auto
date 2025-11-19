import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Zap, Star, Rocket } from 'lucide-react';

const plans = [
  { id: 'gratuito', name: 'Free', icon: Star, desc: 'Ideal para começar', color: 'from-green-500 to-emerald-600' },
  { id: 'basico', name: 'Basic', icon: Zap, desc: 'Para oficinas pequenas', color: 'from-blue-500 to-blue-700' },
  { id: 'profissional', name: 'Pro', icon: Crown, desc: 'Mais recursos e controle', color: 'from-purple-500 to-purple-700' },
  { id: 'enterprise', name: 'Enterprise', icon: Rocket, desc: 'Recursos ilimitados', color: 'from-orange-500 to-red-600' },
];

const Planos = () => {
  return (
    <div className="min-h-screen bg-[hsl(222,47%,11%)]">
      <div className="container mx-auto px-6 lg:px-8 py-16">
        <div className="mb-10">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Assinaturas</Badge>
          <h1 className="mt-3 text-3xl font-bold text-white">Gerenciar Planos</h1>
          <p className="text-slate-400">Escolha o plano ideal para sua oficina</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => (
            <Card key={p.id} className="relative bg-white/5 backdrop-blur-xl border-white/10">
              <div className="absolute -inset-1 rounded-2xl pointer-events-none" />
              <CardHeader className="space-y-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${p.color} flex items-center justify-center`}>
                  <p.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">{p.name}</CardTitle>
                  <CardDescription className="text-slate-400">{p.desc}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className={`w-full bg-gradient-to-r ${p.color} hover:opacity-90 text-white border-0`}
                >
                  Selecionar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Planos;
