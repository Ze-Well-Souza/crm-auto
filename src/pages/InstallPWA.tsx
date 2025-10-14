import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  CheckCircle, 
  Chrome,
  ArrowDown,
  Share,
  MoreVertical
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  return (
    <DashboardLayout>
      <div className="container max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Instale o CRM Autos</h1>
          <p className="text-xl text-muted-foreground">
            Acesse o app diretamente da tela inicial do seu dispositivo
          </p>
        </div>

        {/* Install Status */}
        {isInstalled && (
          <Card className="border-green-500 bg-green-50">
            <CardContent className="flex items-center gap-3 pt-6">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">App já instalado!</p>
                <p className="text-sm text-green-700">
                  O CRM Autos já está instalado no seu dispositivo.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Por que instalar?</CardTitle>
            <CardDescription>
              Vantagens de usar o app instalado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Acesso Rápido</p>
                  <p className="text-sm text-muted-foreground">
                    Abra direto da tela inicial, sem navegar
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Funciona Offline</p>
                  <p className="text-sm text-muted-foreground">
                    Continue trabalhando sem internet
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Mais Rápido</p>
                  <p className="text-sm text-muted-foreground">
                    Carregamento instantâneo das páginas
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Experiência Nativa</p>
                  <p className="text-sm text-muted-foreground">
                    Parece e funciona como app nativo
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Installation Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Android/Chrome */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Android / Chrome
                </CardTitle>
                <Badge variant={isAndroid ? "default" : "outline"}>
                  {isAndroid ? "Seu dispositivo" : "Outro dispositivo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {deferredPrompt && !isInstalled ? (
                <Button 
                  onClick={handleInstallClick} 
                  className="w-full"
                  size="lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Instalar Agora
                </Button>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <p>
                      Toque no menu do navegador <MoreVertical className="inline h-4 w-4" />
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <p>Selecione "Adicionar à tela inicial"</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <p>Toque em "Adicionar"</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* iOS/Safari */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  iPhone / iPad
                </CardTitle>
                <Badge variant={isIOS ? "default" : "outline"}>
                  {isIOS ? "Seu dispositivo" : "Outro dispositivo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <p>
                  Toque no botão compartilhar <Share className="inline h-4 w-4" />
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <p>Role para baixo e toque em "Adicionar à Tela de Início"</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <p>Toque em "Adicionar"</p>
              </div>
            </CardContent>
          </Card>

          {/* Desktop */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Desktop (Chrome, Edge)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <p>
                  Clique no ícone de instalação <Download className="inline h-4 w-4" /> na barra de endereço
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <p>Clique em "Instalar"</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <p>O app será adicionado ao seu sistema</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Info */}
        <Card>
          <CardHeader>
            <CardTitle>Precisa de ajuda?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Se você encontrar dificuldades para instalar o app, entre em contato com o suporte 
              ou consulte a documentação do seu navegador sobre instalação de apps web.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
