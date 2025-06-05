import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import { useCarrinho } from '@/hooks/use-carrinho'
import { useToast } from '@/hooks/use-toast'
import { formatPrice } from '@/lib/utils'

export function Cart() {
  const [isOpen, setIsOpen] = useState(false)
  const { itens, loading, total, atualizarQuantidade, removerDoCarrinho } = useCarrinho()
  const { toast } = useToast()

  if (loading) {
    return null
  }

  async function handleUpdateQuantity(itemId: string, quantidade: number) {
    try {
      await atualizarQuantidade(itemId, quantidade)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a quantidade",
        variant: "destructive",
      })
    }
  }

  async function handleRemoveItem(itemId: string) {
    try {
      await removerDoCarrinho(itemId)
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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itens.length > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {itens.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Carrinho de Compras</SheetTitle>
        </SheetHeader>
        {itens.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Seu carrinho está vazio</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {itens.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-4">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.produto.nome}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.preco_unitario)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity(item.id, item.quantidade - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantidade}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity(item.id, item.quantidade + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Button className="w-full mt-4">
                Finalizar Compra
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
