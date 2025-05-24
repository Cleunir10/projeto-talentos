
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Eye, Clock, CheckCircle, Truck } from "lucide-react";

interface Order {
  id: string;
  date: string;
  status: 'pendente' | 'confirmado' | 'enviado' | 'entregue';
  items: Array<{
    id: string;
    nome: string;
    quantidade: number;
    preco: number;
    costureira?: string;
  }>;
  total: number;
  cliente?: {
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
  };
}

interface OrdersProps {
  userType: 'costureira' | 'cliente';
}

export function Orders({ userType }: OrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Dados mockados de pedidos
  const orders: Order[] = userType === 'costureira' ? [
    {
      id: 'PED001',
      date: '2024-01-15',
      status: 'pendente',
      items: [
        { id: '1', nome: 'Bolsa Ecológica Floral', quantidade: 1, preco: 45.90 }
      ],
      total: 45.90,
      cliente: {
        nome: 'Ana Silva',
        email: 'ana@email.com',
        telefone: '(11) 99999-9999',
        endereco: 'Rua das Flores, 123 - São Paulo/SP'
      }
    },
    {
      id: 'PED002',
      date: '2024-01-14',
      status: 'confirmado',
      items: [
        { id: '2', nome: 'Necessaire Patchwork', quantidade: 2, preco: 25.00 }
      ],
      total: 50.00,
      cliente: {
        nome: 'Carlos Oliveira',
        email: 'carlos@email.com',
        telefone: '(11) 88888-8888',
        endereco: 'Av. Central, 456 - São Paulo/SP'
      }
    }
  ] : [
    {
      id: 'PED003',
      date: '2024-01-13',
      status: 'enviado',
      items: [
        { id: '3', nome: 'Blusa Vintage Renovada', quantidade: 1, preco: 65.00, costureira: 'Carla Santos' }
      ],
      total: 65.00
    },
    {
      id: 'PED004',
      date: '2024-01-10',
      status: 'entregue',
      items: [
        { id: '4', nome: 'Carteira Minimalista', quantidade: 1, preco: 35.50, costureira: 'Julia Mendes' },
        { id: '1', nome: 'Bolsa Ecológica Floral', quantidade: 1, preco: 45.90, costureira: 'Maria Silva' }
      ],
      total: 81.40
    }
  ];

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pendente':
        return <Clock className="h-4 w-4" />;
      case 'confirmado':
        return <CheckCircle className="h-4 w-4" />;
      case 'enviado':
        return <Truck className="h-4 w-4" />;
      case 'entregue':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmado':
        return 'bg-blue-100 text-blue-800';
      case 'enviado':
        return 'bg-purple-100 text-purple-800';
      case 'entregue':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'confirmado':
        return 'Confirmado';
      case 'enviado':
        return 'Enviado';
      case 'entregue':
        return 'Entregue';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {userType === 'costureira' ? 'Pedidos Recebidos' : 'Meus Pedidos'}
        </h2>
        <p className="text-gray-600">
          {userType === 'costureira' 
            ? 'Gerencie os pedidos dos seus produtos' 
            : 'Acompanhe o status dos seus pedidos'
          }
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                  <CardDescription>
                    {new Date(order.date).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{getStatusText(order.status)}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Itens do Pedido:</h4>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span>{item.quantidade}x {item.nome}</span>
                      <div className="text-right">
                        <span className="font-medium">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                        {userType === 'cliente' && item.costureira && (
                          <p className="text-xs text-green-600">por {item.costureira}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-medium text-lg">Total: R$ {order.total.toFixed(2)}</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Detalhes do Pedido #{order.id}</DialogTitle>
                      </DialogHeader>
                      
                      {selectedOrder && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Status do Pedido</h4>
                            <Badge className={getStatusColor(selectedOrder.status)}>
                              {getStatusIcon(selectedOrder.status)}
                              <span className="ml-1">{getStatusText(selectedOrder.status)}</span>
                            </Badge>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Itens</h4>
                            <div className="space-y-2">
                              {selectedOrder.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                  <div>
                                    <p className="font-medium text-sm">{item.nome}</p>
                                    <p className="text-xs text-gray-500">Quantidade: {item.quantidade}</p>
                                    {userType === 'cliente' && item.costureira && (
                                      <p className="text-xs text-green-600">por {item.costureira}</p>
                                    )}
                                  </div>
                                  <span className="font-medium">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {userType === 'costureira' && selectedOrder.cliente && (
                            <div>
                              <h4 className="font-medium mb-2">Dados do Cliente</h4>
                              <div className="space-y-1 text-sm">
                                <p><strong>Nome:</strong> {selectedOrder.cliente.nome}</p>
                                <p><strong>Email:</strong> {selectedOrder.cliente.email}</p>
                                <p><strong>Telefone:</strong> {selectedOrder.cliente.telefone}</p>
                                <p><strong>Endereço:</strong> {selectedOrder.cliente.endereco}</p>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="font-medium text-lg">Total</span>
                            <span className="font-bold text-lg text-green-600">
                              R$ {selectedOrder.total.toFixed(2)}
                            </span>
                          </div>

                          {userType === 'costureira' && selectedOrder.status === 'pendente' && (
                            <Button className="w-full bg-green-600 hover:bg-green-700">
                              Confirmar Pedido
                            </Button>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {userType === 'costureira' ? 'Nenhum pedido recebido' : 'Nenhum pedido realizado'}
          </h3>
          <p className="text-gray-500">
            {userType === 'costureira' 
              ? 'Quando alguém comprar seus produtos, os pedidos aparecerão aqui'
              : 'Quando você fizer uma compra, seus pedidos aparecerão aqui'
            }
          </p>
        </div>
      )}
    </div>
  );
}
