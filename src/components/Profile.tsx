import * as React from 'react'
import { useAuth } from '../contexts/auth-context'
import { useFormValidation, profileSchema, type ProfileFormData } from '../hooks/use-form-validation'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useToast } from '../hooks/use-toast'

export function Profile() {
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const { form, handleSubmit } = useFormValidation(profileSchema)
  const { register, formState: { errors, isSubmitting }, reset } = form

  React.useEffect(() => {
    if (user) {
      reset({
        name: user.user_metadata?.name || '',
        phone: user.user_metadata?.phone || '',
        address: {
          street: user.user_metadata?.address?.street || '',
          number: user.user_metadata?.address?.number || '',
          complement: user.user_metadata?.address?.complement || '',
          neighborhood: user.user_metadata?.address?.neighborhood || '',
          city: user.user_metadata?.address?.city || '',
          state: user.user_metadata?.address?.state || '',
          zipCode: user.user_metadata?.address?.zipCode || '',
        }
      })
    }
  }, [user, reset])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data)
      toast({
        title: 'Perfil atualizado',
        description: 'Seus dados foram salvos com sucesso!',
        variant: 'default'
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o perfil.',
        variant: 'destructive'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" {...register('phone')} />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
      </div>
      <fieldset className="border p-4 rounded space-y-2">
        <legend className="font-semibold">Endereço</legend>
        <Label htmlFor="address.street">Rua</Label>
        <Input id="address.street" {...register('address.street')} />
        {errors.address?.street && <p className="text-sm text-red-500">{errors.address.street.message}</p>}
        <Label htmlFor="address.number">Número</Label>
        <Input id="address.number" {...register('address.number')} />
        {errors.address?.number && <p className="text-sm text-red-500">{errors.address.number.message}</p>}
        <Label htmlFor="address.complement">Complemento</Label>
        <Input id="address.complement" {...register('address.complement')} />
        {errors.address?.complement && <p className="text-sm text-red-500">{errors.address.complement.message}</p>}
        <Label htmlFor="address.neighborhood">Bairro</Label>
        <Input id="address.neighborhood" {...register('address.neighborhood')} />
        {errors.address?.neighborhood && <p className="text-sm text-red-500">{errors.address.neighborhood.message}</p>}
        <Label htmlFor="address.city">Cidade</Label>
        <Input id="address.city" {...register('address.city')} />
        {errors.address?.city && <p className="text-sm text-red-500">{errors.address.city.message}</p>}
        <Label htmlFor="address.state">Estado</Label>
        <Input id="address.state" {...register('address.state')} />
        {errors.address?.state && <p className="text-sm text-red-500">{errors.address.state.message}</p>}
        <Label htmlFor="address.zipCode">CEP</Label>
        <Input id="address.zipCode" {...register('address.zipCode')} />
        {errors.address?.zipCode && <p className="text-sm text-red-500">{errors.address.zipCode.message}</p>}
      </fieldset>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
      </Button>
    </form>
  )
}
