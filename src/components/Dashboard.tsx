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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

  // Cliente não deveria ter acesso ao dashboard
  if (userType !== 'costureira') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acesso Restrito</CardTitle>
          <CardDescription>
            Esta área é reservada para costureiras.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard da Costureira</h1>
        <Button variant="outline" size="icon" onClick={onLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento</CardTitle>
          <CardDescription>
            Gerencie seus produtos e acompanhe seus pedidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
            </TabsList>
            <TabsContent value="products">
              <ProductManager />
            </TabsContent>
            <TabsContent value="orders">
              <Orders />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
