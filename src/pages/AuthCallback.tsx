import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando sua conta...');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Exchange the access token from the URL for a session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data.session) {
          setStatus('success');
          setMessage('Email confirmado com sucesso! Redirecionando...');
          
          // Show success toast
          toast({
            title: 'Email confirmado!',
            description: 'Sua conta foi verificada com sucesso.'
          });

          // Check if user has completed onboarding
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', data.session.user.id)
            .single();

          // Redirect to onboarding if profile is incomplete, otherwise to dashboard
          setTimeout(() => {
            if (!profile?.full_name) {
              navigate('/onboarding');
            } else {
              navigate('/');
            }
          }, 2000);
        } else {
          throw new Error('Não foi possível confirmar o email. Por favor, tente novamente.');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Erro ao confirmar email.');
        
        toast({
          variant: 'destructive',
          title: 'Erro na confirmação',
          description: error.message || 'Não foi possível confirmar seu email.'
        });
      }
    };

    handleEmailConfirmation();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && (
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-12 w-12 text-green-600" />
            )}
            {status === 'error' && (
              <XCircle className="h-12 w-12 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Confirmando Email'}
            {status === 'success' && 'Email Confirmado!'}
            {status === 'error' && 'Erro na Confirmação'}
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'error' && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                O link de confirmação pode ter expirado ou já ter sido usado.
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full"
              >
                Voltar para Login
              </Button>
            </div>
          )}
          
          {status === 'success' && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Você será redirecionado automaticamente em instantes...
            </p>
          )}
          
          {status === 'loading' && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Aguarde enquanto confirmamos seu endereço de email.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;