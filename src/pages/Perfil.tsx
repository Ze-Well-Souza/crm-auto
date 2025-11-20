import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Camera } from 'lucide-react';
import { useRef, useState } from 'react';

const Perfil = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [local, setLocal] = useState({
    name: user?.email?.split('@')[0] || 'Admin',
    email: user?.email || 'admin@oficina.com',
    phone: '(11) 99999-9999',
    emailNotifications: true,
    soundEffects: true,
  });
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const handleAvatarClick = () => fileRef.current?.click();
  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const url = URL.createObjectURL(f);
      setAvatarUrl(url);
    }
  };

  const onSave = () => {
    // TODO: Implementar atualização de perfil via Supabase profiles table
    toast({ title: 'Perfil atualizado com sucesso!' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 relative">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/40 via-slate-50 to-slate-50 dark:bg-transparent" />
        <div className="h-32 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600" />

        <Card className="bg-white/90 backdrop-blur-sm border border-white/50 shadow-lg shadow-blue-100/50 dark:bg-slate-900/60 dark:border-white/10">
          <CardHeader>
            <CardTitle>Meu Perfil</CardTitle>
            <CardDescription>Atualize suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <Camera className="h-8 w-8 text-white" />
                    )}
                  </div>
                <Button onClick={handleAvatarClick} variant="outline" size="sm" className="mt-2">
                  Alterar foto
                </Button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input value={local.name} onChange={(e) => setLocal({ ...local, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={local.email} onChange={(e) => setLocal({ ...local, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={local.phone} onChange={(e) => setLocal({ ...local, phone: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Senha atual</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Nova senha</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-white/80 backdrop-blur-sm border border-blue-50 px-4 py-3 hover:bg-blue-50/50 shadow-md shadow-blue-100/40">
                <div>
                  <p className="text-sm font-medium">Notificações por Email</p>
                  <p className="text-xs text-muted-foreground">Receber alertas importantes</p>
                </div>
                <Switch checked={local.emailNotifications} onCheckedChange={(v) => setLocal({ ...local, emailNotifications: v })} />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/80 backdrop-blur-sm border border-purple-50 px-4 py-3 hover:bg-purple-50/50 shadow-md shadow-purple-100/40">
                <div>
                  <p className="text-sm font-medium">Efeitos Sonoros</p>
                  <p className="text-xs text-muted-foreground">Habilitar sons na interface</p>
                </div>
                <Switch checked={local.soundEffects} onCheckedChange={(v) => setLocal({ ...local, soundEffects: v })} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={onSave} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200">Salvar</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/90 backdrop-blur-sm border border-blue-50 shadow-lg shadow-blue-100/50">
            <CardHeader>
              <CardTitle className="text-sm">Sessões</CardTitle>
              <CardDescription className="text-xs">Últimos acessos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">3</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border border-emerald-50 shadow-lg shadow-emerald-100/50">
            <CardHeader>
              <CardTitle className="text-sm">Notificações</CardTitle>
              <CardDescription className="text-xs">Recebidas hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">12</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border border-purple-50 shadow-lg shadow-purple-100/50">
            <CardHeader>
              <CardTitle className="text-sm">Preferências</CardTitle>
              <CardDescription className="text-xs">Ativas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">5</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border border-orange-50 shadow-lg shadow-orange-100/50">
            <CardHeader>
              <CardTitle className="text-sm">Alterações</CardTitle>
              <CardDescription className="text-xs">Últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">8</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Perfil;