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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState<'costureira' | 'cliente'>('cliente');
  const [activeTab, setActiveTab] = useState<'produtos' | 'pedidos' | 'dashboard'>('produtos');

  const handleLogin = (type: 'costureira' | 'cliente') => {
    setLoginType(type);
    setShowLoginModal(true);
  };

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

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    toast({
      description: "Login realizado com sucesso!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-green-800">Talentos do Jeans</h1>
          <div className="flex items-center gap-4">
            <Cart />
            {user ? (
              <>
                <span className="text-sm text-green-700">
                  Olá, {user.email}
                </span>
                <Button variant="outline" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                userType={loginType}
                onLoginSuccess={handleLoginSuccess}
              />
            )}
          </div>
        </div>

        {/* Navigation */}
        {user && (
          <div className="flex gap-4 mb-6">
            <Button
              variant={activeTab === 'produtos' ? 'default' : 'outline'}
              onClick={() => setActiveTab('produtos')}
              className="bg-green-600 hover:bg-green-700"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Produtos
            </Button>
            <Button
              variant={activeTab === 'pedidos' ? 'default' : 'outline'}
              onClick={() => setActiveTab('pedidos')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Star className="mr-2 h-4 w-4" />
              Meus Pedidos
            </Button>
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveTab('dashboard')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Users className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>
        )}

        {/* Welcome Section */}
        {!user && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/80 backdrop-blur border-green-200">
              <CardHeader>
                <Scissors className="w-8 h-8 mb-2 text-green-600" />
                <CardTitle className="text-green-800">Para Costureiras</CardTitle>
                <CardDescription>
                  Compartilhe seu talento e venda suas criações
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  onClick={() => handleLogin('costureira')}
                >
                  Começar como Costureira
                </Button>
              </CardFooter>
            </Card>
            <Card className="bg-white/80 backdrop-blur border-green-200">
              <CardHeader>
                <ShoppingCart className="w-8 h-8 mb-2 text-green-600" />
                <CardTitle className="text-green-800">Para Clientes</CardTitle>
                <CardDescription>
                  Encontre peças únicas e apoie artesãs locais
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  onClick={() => handleLogin('cliente')}
                >
                  Comprar Produtos
                </Button>
              </CardFooter>
            </Card>
            <Card className="bg-white/80 backdrop-blur border-green-200">
              <CardHeader>
                <Recycle className="w-8 h-8 mb-2 text-green-600" />
                <CardTitle className="text-green-800">Sustentabilidade</CardTitle>
                <CardDescription>
                  Produtos feitos com jeans reciclado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700">
                  Apoie a economia circular e ajude o meio ambiente
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <main>
          {user ? (
            <>
              {activeTab === 'produtos' && <ProductCatalog />}
              {activeTab === 'pedidos' && <Orders />}
              {activeTab === 'dashboard' && (
                <Dashboard
                  userType={loginType}
                  onLogout={handleSignOut}
                />
              )}
            </>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-green-800 mb-4">
                  Produtos em Destaque
                </h2>
                <p className="text-green-600 max-w-2xl mx-auto">
                  Explore nossa coleção de produtos artesanais feitos com jeans reciclado.
                  Cada peça é única e conta uma história de sustentabilidade.
                </p>
              </div>
              <ProductCatalog />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-green-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-green-800">Sobre Nós</h3>
              <p className="text-sm text-green-600">
                Conectamos talentosas costureiras a clientes que valorizam peças únicas e sustentáveis.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-green-800">Contato</h3>
              <p className="text-sm text-green-600">
                Email: contato@talentosdojeans.com.br<br />
                Tel: (11) 99999-9999
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-green-800">Redes Sociais</h3>
              <div className="flex gap-4">
                <a href="#" className="text-green-600 hover:text-green-800">
                  Instagram
                </a>
                <a href="#" className="text-green-600 hover:text-green-800">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
