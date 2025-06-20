import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useAuth } from '../contexts/auth-context'
import { useFormValidation, loginSchema, type LoginFormData } from '../hooks/use-form-validation'
import { useToast } from '../hooks/use-toast'

export function LoginModal() {
  const { isOpen, onClose } = useAuth()
  const { toast } = useToast()
  const { form, handleSubmit } = useFormValidation(loginSchema)
  const { register, formState: { errors, isSubmitting } } = form

  const onSubmit = async (data: LoginFormData) => {
    try {
      await useAuth().signIn(data.email, data.password)
      onClose()
      toast({
        title: 'Sucesso',
        description: 'Login realizado com sucesso!',
        variant: 'default'
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao realizar login. Verifique suas credenciais.',
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
