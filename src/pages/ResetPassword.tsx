import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Shield, Eye, EyeOff, Check, X } from 'lucide-react';

const ResetPassword = () => {
  const { updatePassword, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  // Password validation
  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isMinLength = password.length >= 6;

    return {
      isValid: hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isMinLength,
      requirements: {
        uppercase: hasUpperCase,
        lowercase: hasLowerCase,
        number: hasNumber,
        specialChar: hasSpecialChar,
        minLength: isMinLength
      }
    };
  };

  const passwordValidation = validatePassword(formData.password);

  useEffect(() => {
    // Verificar se há uma sessão de recuperação de senha
    if (!session) {
      toast({
        variant: "destructive",
        title: "Sessão Inválida",
        description: "Link de recuperação expirado ou inválido. Solicite um novo link."
      });
      navigate('/auth');
    }
  }, [session, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.password || !formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha todos os campos."
      });
      return;
    }

    if (!passwordValidation.isValid) {
      toast({
        variant: "destructive",
        title: "Senha Inválida",
        description: "A senha não atende aos requisitos mínimos de segurança."
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "As senhas não coincidem."
      });
      return;
    }

    setIsLoading(true);
    const { error } = await updatePassword(formData.password);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao Redefinir Senha",
        description: error.message
      });
    } else {
      toast({
        title: "Senha Redefinida com Sucesso!",
        description: "Você será redirecionado para o dashboard..."
      });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
    setIsLoading(false);
  };

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground" />
      )}
      <span className={met ? "text-green-500" : "text-muted-foreground"}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md border-2 shadow-xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-3 rounded-2xl shadow-lg">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          
          <div className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
            <CardDescription>
              Crie uma nova senha forte para sua conta
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Digite sua nova senha"
                    className="pr-10"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirme sua nova senha"
                    className="pr-10"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {formData.password && (
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium mb-2">Requisitos da senha:</p>
                  <PasswordRequirement
                    met={passwordValidation.requirements.minLength}
                    text="Mínimo de 6 caracteres"
                  />
                  <PasswordRequirement
                    met={passwordValidation.requirements.uppercase}
                    text="Pelo menos uma letra maiúscula"
                  />
                  <PasswordRequirement
                    met={passwordValidation.requirements.lowercase}
                    text="Pelo menos uma letra minúscula"
                  />
                  <PasswordRequirement
                    met={passwordValidation.requirements.number}
                    text="Pelo menos um número"
                  />
                  <PasswordRequirement
                    met={passwordValidation.requirements.specialChar}
                    text="Pelo menos um caractere especial"
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !passwordValidation.isValid || formData.password !== formData.confirmPassword}
            >
              {isLoading ? "Redefinindo..." : "Redefinir Senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
