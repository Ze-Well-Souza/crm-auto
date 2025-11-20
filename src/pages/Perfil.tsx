import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Camera, Loader2 } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

const Perfil = () => {
  const { user, profile, loadingProfile, updateProfile, uploadAvatar } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    emailNotifications: true,
    soundEffects: true,
  });

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        full_name: profile.full_name || '',
        phone: profile.phone || '',
      }));
    }
  }, [profile]);

  const handleAvatarClick = () => fileRef.current?.click();
  
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const { error, url } = await uploadAvatar(file);
      
      if (error) {
        toast({
          title: 'Erro ao fazer upload',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Avatar atualizado!',
          description: 'Sua foto foi atualizada com sucesso.',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao fazer upload do avatar.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { error } = await updateProfile({
        full_name: formData.full_name,
        phone: formData.phone,
      });

      if (error) {
        toast({
          title: 'Erro',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Perfil atualizado!',
          description: 'Suas informações foram salvas com sucesso.',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar perfil.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

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
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="h-8 w-8 text-white" />
                  )}
                </div>
                <Button 
                  onClick={handleAvatarClick} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Alterar foto'
                  )}
                </Button>
                <input 
                  ref={fileRef} 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <div className="space-y-2">
                  <Label>Nome completo</Label>
                  <Input 
                    value={formData.full_name} 
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} 
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    type="email" 
                    value={user?.email || ''} 
                    disabled
                    className="opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input 
                    value={formData.phone} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-4">Preferências</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações de agendamentos e atualizações
                    </p>
                  </div>
                  <Switch 
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, emailNotifications: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Efeitos Sonoros</Label>
                    <p className="text-sm text-muted-foreground">
                      Ativar sons para ações no sistema
                    </p>
                  </div>
                  <Switch 
                    checked={formData.soundEffects}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, soundEffects: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  if (profile) {
                    setFormData({
                      full_name: profile.full_name || '',
                      phone: profile.phone || '',
                      emailNotifications: true,
                      soundEffects: true,
                    });
                  }
                }}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar alterações'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Perfil;