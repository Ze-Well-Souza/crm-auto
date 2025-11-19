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
  const { profile, updateProfile, setAvatarUrl } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [local, setLocal] = useState({
    name: profile?.name || 'Admin',
    email: profile?.email || 'admin@oficina.com',
    phone: profile?.phone || '(11) 99999-9999',
    emailNotifications: profile?.preferences.emailNotifications ?? true,
    soundEffects: profile?.preferences.soundEffects ?? true,
  });

  const handleAvatarClick = () => fileRef.current?.click();
  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const url = URL.createObjectURL(f);
      setAvatarUrl(url);
    }
  };

  const onSave = () => {
    updateProfile({
      name: local.name,
      email: local.email,
      phone: local.phone,
      preferences: { emailNotifications: local.emailNotifications, soundEffects: local.soundEffects }
    });
    toast({ title: 'Perfil atualizado com sucesso!' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="h-32 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600" />

        <Card className="bg-white/70 dark:bg-slate-900/60">
          <CardHeader>
            <CardTitle>Meu Perfil</CardTitle>
            <CardDescription>Atualize suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Notificações por Email</p>
                  <p className="text-xs text-muted-foreground">Receber alertas importantes</p>
                </div>
                <Switch checked={local.emailNotifications} onCheckedChange={(v) => setLocal({ ...local, emailNotifications: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Efeitos Sonoros</p>
                  <p className="text-xs text-muted-foreground">Habilitar sons na interface</p>
                </div>
                <Switch checked={local.soundEffects} onCheckedChange={(v) => setLocal({ ...local, soundEffects: v })} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={onSave} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">Salvar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Perfil;