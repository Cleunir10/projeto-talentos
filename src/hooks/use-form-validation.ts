import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from './use-toast'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres')
})

export const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
})

export const profileSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().min(3, 'Rua inválida'),
    number: z.string().min(1, 'Número inválido'),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, 'Bairro inválido'),
    city: z.string().min(2, 'Cidade inválida'),
    state: z.string().length(2, 'Estado inválido'),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido')
  })
})

export const orderSchema = z.object({
  shippingMethod: z.enum(['standard', 'express', 'pickup'], {
    required_error: 'Selecione um método de envio'
  }),
  paymentMethod: z.enum(['credit', 'debit', 'pix', 'bank_transfer'], {
    required_error: 'Selecione um método de pagamento'
  }),
  address: z.object({
    street: z.string().min(3, 'Rua inválida'),
    number: z.string().min(1, 'Número inválido'),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, 'Bairro inválido'),
    city: z.string().min(2, 'Cidade inválida'),
    state: z.string().length(2, 'Estado inválido'),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido')
  })
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type OrderFormData = z.infer<typeof orderSchema>

export function useFormValidation<T extends z.ZodType>(schema: T) {
  const { toast } = useToast()
  
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  })

  const handleSubmit = async (onSubmit: (data: z.infer<T>) => Promise<void>) => {
    try {
      const data = await form.handleSubmit(onSubmit)()
      return data
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast({
            title: 'Erro de validação',
            description: err.message,
            variant: 'destructive'
          })
        })
      } else {
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao processar o formulário',
          variant: 'destructive'
        })
      }
      throw error
    }
  }

  return {
    form,
    handleSubmit
  }
} 