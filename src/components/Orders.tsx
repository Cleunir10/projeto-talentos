import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { usePedidos } from '@/hooks/use-pedidos'
import { formatPrice, statusPedidoConfig } from '@/lib/utils'
import type { Database } from '@/lib/database.types'

type PedidoRow = Database['public']['Tables']['pedidos']['Row']
type Endereco = NonNullable<PedidoRow['endereco_entrega']>

export function Orders() {
  const { pedidos, loading, error } = usePedidos()
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  if (loading) {
    return <div>Carregando pedidos...</div>
  }

  if (error) {
    return <div>Erro ao carregar pedidos: {error.message}</div>
  }

  if (pedidos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meus Pedidos</CardTitle>
          <CardDescription>Você ainda não tem nenhum pedido</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Meus Pedidos</h2>
      {pedidos.map((pedido) => (
        <Card key={pedido.id} className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => setExpandedOrder(expandedOrder === pedido.id ? null : pedido.id)}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pedido #{pedido.numero_pedido}</CardTitle>
                <CardDescription>
                  {new Date(pedido.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge variant={statusPedidoConfig[pedido.status as keyof typeof statusPedidoConfig]?.variant || 'default'}>
                {statusPedidoConfig[pedido.status as keyof typeof statusPedidoConfig]?.label || pedido.status}
              </Badge>
            </div>
          </CardHeader>
          {expandedOrder === pedido.id && (
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Endereço de Entrega</h4>
                    <p className="text-sm text-muted-foreground">
                      {pedido.endereco_entrega.rua}, {pedido.endereco_entrega.numero}<br />
                      {pedido.endereco_entrega.bairro}<br />
                      {pedido.endereco_entrega.cidade} - {pedido.endereco_entrega.estado}<br />
                      CEP: {pedido.endereco_entrega.cep}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Método de Pagamento</h4>
                    <p className="text-sm text-muted-foreground">
                      {pedido.metodo_pagamento}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Resumo do Pedido</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(pedido.subtotal)}</span>
                    </div>
                    {pedido.desconto > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto</span>
                        <span>-{formatPrice(pedido.desconto)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Frete</span>
                      <span>{formatPrice(pedido.frete)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa da plataforma</span>
                      <span>{formatPrice(pedido.taxa_plataforma)}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Total</span>
                      <span>{formatPrice(pedido.total)}</span>
                    </div>
                  </div>
                </div>
                {pedido.codigo_rastreamento && (
                  <div>
                    <h4 className="font-medium">Rastreamento</h4>
                    <p className="text-sm text-muted-foreground">
                      Código: {pedido.codigo_rastreamento}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
