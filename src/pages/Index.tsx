import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Scissors, Users, ShoppingCart, Heart, Recycle, Star, LogOut } from "lucide-react";
import { LoginModal } from "@/components/LoginModal";
import { Dashboard } from "@/components/Dashboard";
import { Badge } from "@/components/ui/badge";
import { TestConnection } from "@/components/TestConnection";
import { Cart } from "@/components/Cart";
import { ProductCatalog } from "@/components/ProductCatalog";
import { Orders } from "@/components/Orders";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'produtos' | 'pedidos' | 'dashboard'>('produtos');

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        description: "Logout realizado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Talentos do Jeans</h1>
        <div className="flex items-center gap-4">
          <Cart />
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                Olá, {user.email}
              </span>
              <Button variant="outline" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <LoginModal />
          )}
        </div>
      </div>

      {/* Navigation */}
      {user && (
        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === 'produtos' ? 'default' : 'outline'}
            onClick={() => setActiveTab('produtos')}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Produtos
          </Button>
          <Button
            variant={activeTab === 'pedidos' ? 'default' : 'outline'}
            onClick={() => setActiveTab('pedidos')}
          >
            <Star className="mr-2 h-4 w-4" />
            Meus Pedidos
          </Button>
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'outline'}
            onClick={() => setActiveTab('dashboard')}
          >
            <Users className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </div>
      )}

      {/* Main Content */}
      <main>
        {!user ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Scissors className="w-8 h-8 mb-2" />
                <CardTitle>Para Costureiras</CardTitle>
                <CardDescription>
                  Compartilhe seu talento e venda suas criações
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full" onClick={() => handleLogin('costureira')}>
                  Começar como Costureira
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <ShoppingCart className="w-8 h-8 mb-2" />
                <CardTitle>Para Clientes</CardTitle>
                <CardDescription>
                  Encontre peças únicas e apoie artesãs locais
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full" onClick={() => handleLogin('cliente')}>
                  Comprar Produtos
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <Recycle className="w-8 h-8 mb-2" />
                <CardTitle>Sustentabilidade</CardTitle>
                <CardDescription>
                  Produtos feitos com jeans reciclado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Apoie a economia circular e ajude o meio ambiente
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {activeTab === 'produtos' && <ProductCatalog />}
            {activeTab === 'pedidos' && <Orders />}
            {activeTab === 'dashboard' && <Dashboard />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Sobre Nós</h3>
            <p className="text-sm text-muted-foreground">
              Conectamos talentosas costureiras a clientes que valorizam peças únicas e sustentáveis.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <p className="text-sm text-muted-foreground">
              Email: contato@talentosdojeans.com.br<br />
              Tel: (11) 99999-9999
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                Instagram
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
