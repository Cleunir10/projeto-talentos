import * as React from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { useStore } from '../contexts/store-context'
import { useToast } from '../hooks/use-toast'

export function ProductCatalog() {
  const { products, isLoadingProducts, addToCart } = useStore()
  const { toast } = useToast()

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1)
      toast({
        description: "Produto adicionado ao carrinho",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho",
        variant: "destructive",
      })
    }
  }

  if (isLoadingProducts) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-t-lg" />
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </CardContent>
            <CardFooter>
              <div className="h-10 bg-gray-200 rounded w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id}>
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            <img
              src={product.image_url}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              R$ {product.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">{product.description}</p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => handleAddToCart(product.id)}
            >
              Adicionar ao Carrinho
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
