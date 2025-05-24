
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Package, ShoppingCart, Star, Trash2 } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'pedido' | 'avaliacao' | 'sistema';
  date: string;
  read: boolean;
}

interface NotificationsProps {
  userType: 'costureira' | 'cliente';
}

export function Notifications({ userType }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>(
    userType === 'costureira' ? [
      {
        id: '1',
        title: 'Novo Pedido Recebido',
        message: 'Ana Silva fez um pedido da sua Bolsa Ecológica Floral no valor de R$ 45,90',
        type: 'pedido',
        date: '2024-01-15T10:30:00',
        read: false
      },
      {
        id: '2',
        title: 'Nova Avaliação',
        message: 'Carlos Oliveira avaliou sua Necessaire Patchwork com 5 estrelas',
        type: 'avaliacao',
        date: '2024-01-14T15:45:00',
        read: false
      },
      {
        id: '3',
        title: 'Produto em Destaque',
        message: 'Sua Bolsa Ecológica Floral foi destacada na página inicial da plataforma',
        type: 'sistema',
        date: '2024-01-13T09:15:00',
        read: true
      }
    ] : [
      {
        id: '1',
        title: 'Pedido Confirmado',
        message: 'Seu pedido #PED003 foi confirmado pela costureira Carla Santos',
        type: 'pedido',
        date: '2024-01-13T14:20:00',
        read: false
      },
      {
        id: '2',
        title: 'Produto Enviado',
        message: 'Sua Blusa Vintage Renovada foi enviada e chegará em 3-5 dias úteis',
        type: 'pedido',
        date: '2024-01-12T11:30:00',
        read: false
      },
      {
        id: '3',
        title: 'Pedido Entregue',
        message: 'Seu pedido #PED004 foi entregue com sucesso. Que tal avaliar os produtos?',
        type: 'pedido',
        date: '2024-01-10T16:45:00',
        read: true
      }
    ]
  );

  // Conta quantas notificações não lidas existem
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'pedido':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'avaliacao':
        return <Star className="h-5 w-5 text-yellow-600" />;
      case 'sistema':
        return <Bell className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Agora há pouco';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notificações</h2>
          <p className="text-gray-600">
            {unreadCount > 0 
              ? `Você tem ${unreadCount} ${unreadCount === 1 ? 'notificação não lida' : 'notificações não lidas'}`
              : 'Todas as notificações foram lidas'
            }
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              !notification.read ? 'border-green-200 bg-green-50' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-sm font-medium ${
                        !notification.read ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                        {!notification.read && (
                          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                            Nova
                          </Badge>
                        )}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        !notification.read ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDate(notification.date)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma notificação
          </h3>
          <p className="text-gray-500">
            Quando houver novidades, elas aparecerão aqui
          </p>
        </div>
      )}
    </div>
  );
}
