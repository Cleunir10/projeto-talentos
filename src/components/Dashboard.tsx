import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scissors, LogOut, Plus, ShoppingCart, User, Bell, Package } from "lucide-react";
import { ProductManager } from "@/components/ProductManager";
import { ProductCatalog } from "@/components/ProductCatalog";
import { Cart } from "@/components/Cart";
import { Orders } from "@/components/Orders";
import { Profile } from "@/components/Profile";
import { Notifications } from "@/components/Notifications";

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  quantity: number;
  costureira: string;
  imagem: string;
}

interface DashboardProps {
  userType: 'costureira' | 'cliente';
  onLogout: () => void;
}

export function Dashboard({ userType, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState(userType === 'costureira' ? 'produtos' : 'catalogo');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: { id: string; nome: string; preco: number; costureira: string; imagem: string }) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { 
        id: product.id,
        nome: product.nome,
        preco: product.preco,
        costureira: product.costureira,
        imagem: product.imagem,
        quantity: 1 
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Scissors className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-green-800">Talentos</h1>
              <span className="text-sm text-gray-500 capitalize">
                | {userType === 'costureira' ? 'Área da Costureira' : 'Área do Cliente'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              {userType === 'cliente' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('carrinho')}
                  className="relative"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Carrinho
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            {userType === 'costureira' ? (
              <>
                <TabsTrigger value="produtos" className="flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>Produtos</span>
                </TabsTrigger>
                <TabsTrigger value="pedidos" className="flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Pedidos</span>
                </TabsTrigger>
                <TabsTrigger value="perfil" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Perfil</span>
                </TabsTrigger>
                <TabsTrigger value="notificacoes" className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>Notificações</span>
                </TabsTrigger>
                <TabsTrigger value="catalogo" className="flex items-center space-x-2">
                  <Scissors className="h-4 w-4" />
                  <span>Explorar</span>
                </TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="catalogo" className="flex items-center space-x-2">
                  <Scissors className="h-4 w-4" />
                  <span>Catálogo</span>
                </TabsTrigger>
                <TabsTrigger value="carrinho" className="flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Carrinho</span>
                </TabsTrigger>
                <TabsTrigger value="pedidos" className="flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>Pedidos</span>
                </TabsTrigger>
                <TabsTrigger value="perfil" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Perfil</span>
                </TabsTrigger>
                <TabsTrigger value="notificacoes" className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>Notificações</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {userType === 'costureira' && (
            <TabsContent value="produtos">
              <ProductManager />
            </TabsContent>
          )}

          <TabsContent value="catalogo">
            <ProductCatalog onAddToCart={addToCart} userType={userType} />
          </TabsContent>

          {userType === 'cliente' && (
            <TabsContent value="carrinho">
              <Cart 
                items={cartItems}
                onRemoveItem={removeFromCart}
                onUpdateQuantity={updateQuantity}
              />
            </TabsContent>
          )}

          <TabsContent value="pedidos">
            <Orders userType={userType} />
          </TabsContent>

          <TabsContent value="perfil">
            <Profile userType={userType} />
          </TabsContent>

          <TabsContent value="notificacoes">
            <Notifications userType={userType} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
