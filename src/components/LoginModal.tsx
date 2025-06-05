import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'costureira' | 'cliente';
  onLoginSuccess: (type: 'costureira' | 'cliente') => void;
}

export function LoginModal({ isOpen, onClose, userType, onLoginSuccess }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    especialidade: '',
    endereco: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.senha);
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
      } else {
        await signUp(formData.email, formData.senha);
        toast({
          title: "Conta criada com sucesso",
          description: "Verifique seu email para confirmar o cadastro.",
        });
      }
      onLoginSuccess(userType);
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button variant="outline">Entrar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-green-800">
            {userType === 'costureira' ? 'Área da Costureira' : 'Área do Cliente'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password">Senha</label>
            <Input
              id="password"
              type="password"
              value={formData.senha}
              onChange={(e) => handleInputChange('senha', e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login'
                ? 'Não tem uma conta? Cadastre-se'
                : 'Já tem uma conta? Entre'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
