import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Car } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [form, setForm] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    plan: '' as 'gratuito' | 'basico' | 'profissional' | 'enterprise' | ''
  });

  useEffect(() => {
    const qp = searchParams.get('plan');
    if (qp && ['gratuito','basico','profissional','enterprise'].includes(qp)) {
      setForm((f) => ({ ...f, plan: qp as any }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.email || !form.password || !form.confirmPassword || !form.plan) {
      toast({ variant: 'destructive', title: 'Campos obrigatórios', description: 'Preencha todos os campos.' });
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast({ variant: 'destructive', title: 'Senhas diferentes', description: 'As senhas não coincidem.' });
      return;
    }
    toast({ title: 'Conta criada', description: 'Bem-vindo! Redirecionando para o dashboard...' });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-transparent dark:bg-[hsl(222,47%,11%)]" />
      <div className="absolute -top-16 left-1/5 w-[32rem] h-[32rem] bg-transparent dark:bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 right-0 w-[28rem] h-[28rem] bg-transparent dark:bg-purple-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 w-[36rem] h-[36rem] bg-transparent dark:bg-emerald-500/10 rounded-full blur-[140px]" />

      {/* Navbar */}
      <nav className="relative z-10 border-b border-gray-200 dark:border-white/10 backdrop-blur-sm bg-white dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">Oficina Eficiente</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <section className="relative z-10 container mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-lg mx-auto">
          <Card className="relative bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-xl dark:backdrop-blur-xl">
            <div className="absolute -inset-0.5 rounded-xl pointer-events-none dark:shadow-[0_0_60px_rgba(99,102,241,0.25)]" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-slate-900 dark:text-white">Crie sua conta</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">Cadastre sua oficina e comece agora</CardDescription>
                </div>
                <Badge className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30">Cadastro</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-slate-700 dark:text-slate-300">Nome da Oficina</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="Ex.: Oficina Mecânica Pro"
                    className="bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="voce@oficina.com"
                    className="bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Senha</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 dark:text-slate-300">Plano Selecionado</Label>
                  <Select value={form.plan} onValueChange={(v) => setForm({ ...form, plan: v as any })}>
                    <SelectTrigger className="bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 text-slate-900 dark:text-white">
                      <SelectValue placeholder="Selecione um plano" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-white/10">
                      <SelectItem value="gratuito" className="text-slate-900 dark:text-white">Gratuito</SelectItem>
                      <SelectItem value="basico" className="text-slate-900 dark:text-white">Básico</SelectItem>
                      <SelectItem value="profissional" className="text-slate-900 dark:text-white">Profissional</SelectItem>
                      <SelectItem value="enterprise" className="text-slate-900 dark:text-white">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg">
                  Criar Conta
                </Button>

                <div className="text-center text-sm">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                  >
                    Já tem conta? Faça Login
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Register;