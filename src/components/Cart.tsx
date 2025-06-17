import * as React from 'react'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { useStore } from '../contexts/store-context'
import { useAuth } from '../contexts/auth-context'
import { useToast } from '../hooks/use-toast'

export function Cart() {
  const { cart, isLoadingCart, removeFromCart, updateCartItem } = useStore()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = React.useState(false)

  const total = cart.reduce((acc, item) => {
    const price = item.products?.price || 0
    return acc + price * item.quantity
  }, 0)

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    try {
      if (newQuantity < 1) {
        await removeFromCart(id)
      } else {
        await updateCartItem(id, newQuantity)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o carrinho",
        variant: "destructive",
      })
    }
  }

  const handleRemoveItem = async (id: string) => {
    try {
      await removeFromCart(id)
      toast({
        description: "Item removido do carrinho",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o item",
        variant: "destructive",
      })
    }
  }

  if (!user) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {isLoadingCart ? (
            <div className="text-center">Carregando...</div>
          ) : cart.length === 0 ? (
            <div className="text-center text-gray-500">Seu carrinho está vazio</div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-2 border-b">
                  <img
                    src={item.products?.image_url}
                    alt={item.products?.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.products?.name}</h3>
                    <p className="text-sm text-gray-500">
                      R$ {item.products?.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">R$ {total.toFixed(2)}</span>
                </div>
                <Button className="w-full">Finalizar Compra</Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
