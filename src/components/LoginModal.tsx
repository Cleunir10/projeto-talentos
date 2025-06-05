import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  userType: 'costureira' | 'cliente'
  onLoginSuccess: () => void
}

export function LoginModal({ isOpen, onClose, userType, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  
  const { signIn, signUp } = useAuth()
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === 'login') {
        await signIn(email, password)
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        })
      } else {
        await signUp(email, password)
        toast({
          title: "Conta criada com sucesso",
          description: "Verifique seu email para confirmar o cadastro.",
        })
      }
      onLoginSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'login' ? 'Entrar como ' : 'Criar conta como '}
            {userType === 'costureira' ? 'Costureira' : 'Cliente'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password">Senha</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
  )
}
