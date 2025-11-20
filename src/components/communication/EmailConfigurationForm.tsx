import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

const SMTP_PRESETS = {
  gmail: {
    name: 'Gmail',
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_secure: true,
    help: 'Use a senha de app do Google (não sua senha normal)',
  },
  outlook: {
    name: 'Outlook/Hotmail',
    smtp_host: 'smtp-mail.outlook.com',
    smtp_port: 587,
    smtp_secure: true,
    help: 'Use sua senha normal do Outlook',
  },
  yahoo: {
    name: 'Yahoo',
    smtp_host: 'smtp.mail.yahoo.com',
    smtp_port: 587,
    smtp_secure: true,
    help: 'Use a senha de app do Yahoo',
  },
  custom: {
    name: 'Personalizado',
    smtp_host: '',
    smtp_port: 587,
    smtp_secure: true,
    help: 'Configure manualmente seu servidor SMTP',
  },
};

export const EmailConfigurationForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [existingConfig, setExistingConfig] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    provider: 'gmail',
    email: '',
    smtp_host: SMTP_PRESETS.gmail.smtp_host,
    smtp_port: SMTP_PRESETS.gmail.smtp_port,
    smtp_secure: SMTP_PRESETS.gmail.smtp_secure,
    smtp_username: '',
    smtp_password: '',
    from_name: '',
    is_active: true,
  });

  useEffect(() => {
    loadExistingConfig();
  }, []);

  const loadExistingConfig = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('email_configurations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (data && !error) {
        setExistingConfig(data);
        setFormData({
          provider: data.provider,
          email: data.email,
          smtp_host: data.smtp_host,
          smtp_port: data.smtp_port,
          smtp_secure: data.smtp_secure,
          smtp_username: data.smtp_username,
          smtp_password: '', // Não carregamos a senha por segurança
          from_name: data.from_name || '',
          is_active: data.is_active,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  };

  const handleProviderChange = (provider: string) => {
    const preset = SMTP_PRESETS[provider as keyof typeof SMTP_PRESETS];
    setFormData({
      ...formData,
      provider,
      smtp_host: preset.smtp_host,
      smtp_port: preset.smtp_port,
      smtp_secure: preset.smtp_secure,
    });
  };

  const handleTestEmail = async () => {
    if (!formData.email || !formData.smtp_password) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha email e senha antes de testar',
        variant: 'destructive',
      });
      return;
    }

    setTestLoading(true);
    try {
      // Primeiro, salvar a configuração temporariamente
      await handleSave(true);

      // Enviar email de teste
      const { data, error } = await supabase.functions.invoke('send-email-smtp', {
        body: {
          to: [formData.email],
          subject: 'Teste de Configuração de Email',
          content: `
            <h2>Configuração de Email Bem-Sucedida!</h2>
            <p>Parabéns! Seu email foi configurado corretamente.</p>
            <p><strong>Provedor:</strong> ${SMTP_PRESETS[formData.provider as keyof typeof SMTP_PRESETS].name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p>Agora você pode enviar emails através do sistema.</p>
          `,
          isHtml: true,
        },
      });

      if (error) throw error;

      toast({
        title: 'Email de teste enviado!',
        description: 'Verifique sua caixa de entrada',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar email de teste',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setTestLoading(false);
    }
  };

  const handleSave = async (silent = false) => {
    if (!formData.email || !formData.smtp_username) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Criptografar senha (base64 simples por enquanto)
      const encryptedPassword = btoa(formData.smtp_password);

      const configData = {
        user_id: user.id,
        provider: formData.provider,
        email: formData.email,
        smtp_host: formData.smtp_host,
        smtp_port: formData.smtp_port,
        smtp_secure: formData.smtp_secure,
        smtp_username: formData.smtp_username,
        smtp_password_encrypted: encryptedPassword,
        from_name: formData.from_name || formData.email.split('@')[0],
        is_active: formData.is_active,
      };

      if (existingConfig) {
        // Atualizar configuração existente
        const { error } = await supabase
          .from('email_configurations')
          .update(configData)
          .eq('id', existingConfig.id);

        if (error) throw error;
      } else {
        // Criar nova configuração
        const { error } = await supabase
          .from('email_configurations')
          .insert([configData]);

        if (error) throw error;
      }

      if (!silent) {
        toast({
          title: 'Configuração salva!',
          description: 'Email configurado com sucesso',
        });
      }

      await loadExistingConfig();
    } catch (error: any) {
      if (!silent) {
        toast({
          title: 'Erro ao salvar',
          description: error.message,
          variant: 'destructive',
        });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const preset = SMTP_PRESETS[formData.provider as keyof typeof SMTP_PRESETS];

  return (
    <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Mail className="h-5 w-5 text-blue-400" />
          </div>
          Configuração de Email Próprio
        </CardTitle>
        <CardDescription className="text-slate-400">
          Configure seu email pessoal ou profissional para enviar emails através do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {existingConfig && (
          <Alert className="bg-emerald-500/20 border-emerald-500/30">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <AlertDescription className="text-emerald-300">
              Email configurado: <strong>{existingConfig.email}</strong>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="provider" className="text-blue-400">Provedor de Email</Label>
          <Select value={formData.provider} onValueChange={handleProviderChange}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              <SelectItem value="gmail" className="text-white hover:bg-white/10">Gmail</SelectItem>
              <SelectItem value="outlook" className="text-white hover:bg-white/10">Outlook/Hotmail</SelectItem>
              <SelectItem value="yahoo" className="text-white hover:bg-white/10">Yahoo</SelectItem>
              <SelectItem value="custom" className="text-white hover:bg-white/10">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-slate-400">{preset.help}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-blue-400">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="from_name" className="text-blue-400">Nome de Exibição</Label>
            <Input
              id="from_name"
              placeholder="Seu Nome"
              value={formData.from_name}
              onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtp_username" className="text-blue-400">Usuário SMTP *</Label>
            <Input
              id="smtp_username"
              placeholder="Geralmente seu email"
              value={formData.smtp_username}
              onChange={(e) => setFormData({ ...formData, smtp_username: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtp_password" className="text-blue-400">Senha / Senha de App *</Label>
            <Input
              id="smtp_password"
              type="password"
              placeholder="••••••••"
              value={formData.smtp_password}
              onChange={(e) => setFormData({ ...formData, smtp_password: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {formData.provider === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="smtp_host" className="text-blue-400">Servidor SMTP</Label>
              <Input
                id="smtp_host"
                placeholder="smtp.exemplo.com"
                value={formData.smtp_host}
                onChange={(e) => setFormData({ ...formData, smtp_host: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp_port" className="text-blue-400">Porta</Label>
              <Input
                id="smtp_port"
                type="number"
                value={formData.smtp_port}
                onChange={(e) => setFormData({ ...formData, smtp_port: parseInt(e.target.value) })}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
              />
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Switch
            id="smtp_secure"
            checked={formData.smtp_secure}
            onCheckedChange={(checked) => setFormData({ ...formData, smtp_secure: checked })}
          />
          <Label htmlFor="smtp_secure" className="text-blue-400">Usar conexão segura (TLS)</Label>
        </div>

        <Alert className="bg-orange-500/20 border-orange-500/30">
          <AlertCircle className="h-4 w-4 text-orange-400" />
          <AlertDescription className="text-orange-400">
            <strong>Dica de Segurança:</strong> Para Gmail e Yahoo, use uma "senha de app" ao invés da sua senha normal.
            Para Outlook, use sua senha normal mas ative autenticação de dois fatores.
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button onClick={() => handleSave(false)} disabled={loading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Configuração
          </Button>
          <Button variant="outline" onClick={handleTestEmail} disabled={testLoading || loading} className="border-white/10 text-white hover:bg-white/10">
            {testLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Testar Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

