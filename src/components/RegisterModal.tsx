import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useAuth } from '../contexts/auth-context'
import { useFormValidation, registerSchema, type RegisterFormData } from '../hooks/use-form-validation'
import { useToast } from '../hooks/use-toast'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  userType: 'costureira' | 'cliente'
}

export function RegisterModal({ isOpen, onClose, userType }: RegisterModalProps) {
  const { toast } = useToast()
  const { form, handleSubmit } = useFormValidation(registerSchema)
  const { register, formState: { errors, isSubmitting } } = form
  const { signUp } = useAuth()

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await signUp(data.email, data.password, {
        name: data.name,
        tipo: userType
      })
      onClose()
      toast({
        title: 'Sucesso',
        description: 'Conta criada com sucesso! Verifique seu e-mail para confirmar o cadastro.',
        variant: 'default'
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao criar conta. Tente novamente.',
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Criar conta como {userType === 'costureira' ? 'Costureira' : 'Cliente'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              {...register('name')}
              placeholder="Seu nome completo"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder="******"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              placeholder="******"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 