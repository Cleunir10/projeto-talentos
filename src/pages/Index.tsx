import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  Scissors, 
  Users, 
  ShoppingCart, 
  Heart, 
  Recycle, 
  Star, 
  LogOut,
  CheckCircle2,
  TreeDeciduous,
  Factory,
  Truck,
  MessageSquare,
  ListOrdered,
  Leaf,
  CircleDollarSign,
  ShieldCheck,
  Award
} from "lucide-react";
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
      {/* Hero Section com Vídeo/Imagem de Fundo */}
      <div className="relative h-[500px] bg-gradient-to-r from-green-900/80 to-green-600/80">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/hero-background.jpg"
            alt="Costureira trabalhando"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-white mb-6">
              Transformando Jeans em Arte
            </h1>
            <p className="text-xl text-green-50 mb-8">
              Uma plataforma que une talento artesanal e sustentabilidade,
              criando peças únicas que contam histórias e preservam o meio ambiente.
            </p>
            {!user && (
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-green-800 hover:bg-green-50"
                  onClick={() => handleLogin('cliente')}
                >
                  Começar a Comprar
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-white border-white hover:bg-white/20"
                  onClick={() => handleLogin('costureira')}
                >
                  Tornar-se Costureira
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Header de Navegação */}
        <div className="py-4 border-b border-green-200 sticky top-0 bg-green-50/80 backdrop-blur-sm z-50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-green-800">Talentos do Jeans</h2>
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

          {user && (
            <div className="flex gap-4 mt-4">
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
        </div>

        {/* Benefícios */}
        {!user && (
          <>
            {/* Como Funciona Section */}
            <section className="py-16 bg-gradient-to-br from-green-50 to-green-100">
              <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
                  Como Funciona
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <ListOrdered className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Cadastre-se</h3>
                    <p className="text-green-600">Crie sua conta como cliente ou costureira</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <ShoppingCart className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Explore</h3>
                    <p className="text-green-600">Navegue por produtos únicos e sustentáveis</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <Heart className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Escolha</h3>
                    <p className="text-green-600">Selecione as peças que mais combinem com você</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <Truck className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Receba</h3>
                    <p className="text-green-600">Receba suas peças únicas em casa</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Estatísticas de Sustentabilidade */}
            <section className="py-16 bg-white/80">
              <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
                  Impacto Ambiental e Social
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <Card className="bg-white/90 border-green-200">
                    <CardHeader>
                      <div className="flex items-center justify-center">
                        <Leaf className="w-12 h-12 text-green-600" />
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-800 mb-2">5000kg</div>
                        <CardDescription>de Jeans Reciclados</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                  <Card className="bg-white/90 border-green-200">
                    <CardHeader>
                      <div className="flex items-center justify-center">
                        <Users className="w-12 h-12 text-green-600" />
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-800 mb-2">100+</div>
                        <CardDescription>Famílias Impactadas</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                  <Card className="bg-white/90 border-green-200">
                    <CardHeader>
                      <div className="flex items-center justify-center">
                        <CircleDollarSign className="w-12 h-12 text-green-600" />
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-800 mb-2">R$ 250mil</div>
                        <CardDescription>Gerados para Artesãs</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                  <Card className="bg-white/90 border-green-200">
                    <CardHeader>
                      <div className="flex items-center justify-center">
                        <Recycle className="w-12 h-12 text-green-600" />
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-800 mb-2">15000L</div>
                        <CardDescription>Água Economizada</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </section>

            {/* Seja uma Costureira */}
            <section className="py-16 bg-gradient-to-br from-green-800 to-green-900 text-white">
              <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl font-bold mb-6">Seja uma Costureira Parceira</h2>
                    <p className="mb-8 text-green-100">
                      Entre para nossa comunidade de artesãs talentosas e transforme sua paixão
                      por costura em uma fonte de renda sustentável.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <ShieldCheck className="w-6 h-6 text-green-400 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-1">Plataforma Segura</h3>
                          <p className="text-sm text-green-100">Pagamentos garantidos e suporte dedicado</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Award className="w-6 h-6 text-green-400 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-1">Visibilidade</h3>
                          <p className="text-sm text-green-100">Exponha seu trabalho para milhares de clientes</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <CircleDollarSign className="w-6 h-6 text-green-400 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-1">Renda Justa</h3>
                          <p className="text-sm text-green-100">Defina seus preços e receba o valor que merece</p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      className="mt-8 bg-white text-green-800 hover:bg-green-100"
                      onClick={() => handleLogin('costureira')}
                    >
                      Começar Agora
                    </Button>
                  </div>
                  <div className="relative h-[400px] rounded-lg overflow-hidden">
                    <img
                      src="/costureira-trabalhando.jpg"
                      alt="Costureira trabalhando"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent" />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Benefícios Section and rest of the code... */}
        {/* Cards de Boas-vindas */}
        {!user && (
          <section className="py-16 bg-white/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="bg-white/80 backdrop-blur border-green-200 transform hover:scale-105 transition-transform">
                <CardHeader>
                  <Scissors className="w-8 h-8 mb-2 text-green-600" />
                  <CardTitle className="text-green-800">Para Costureiras</CardTitle>
                  <CardDescription>
                    Compartilhe seu talento e venda suas criações. Tenha sua própria vitrine virtual.
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
              <Card className="bg-white/80 backdrop-blur border-green-200 transform hover:scale-105 transition-transform">
                <CardHeader>
                  <ShoppingCart className="w-8 h-8 mb-2 text-green-600" />
                  <CardTitle className="text-green-800">Para Clientes</CardTitle>
                  <CardDescription>
                    Encontre peças únicas e apoie artesãs locais. Cada compra tem um impacto positivo.
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
              <Card className="bg-white/80 backdrop-blur border-green-200 transform hover:scale-105 transition-transform">
                <CardHeader>
                  <Recycle className="w-8 h-8 mb-2 text-green-600" />
                  <CardTitle className="text-green-800">Sustentabilidade</CardTitle>
                  <CardDescription>
                    Produtos feitos com jeans reciclado. Cada peça ajuda a reduzir o impacto ambiental.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-700">
                    Apoie a economia circular e ajude o meio ambiente
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Conteúdo Principal */}
        <main className="py-12">
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
            <div className="space-y-12">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-green-800 mb-4">
                  Produtos em Destaque
                </h2>
                <p className="text-green-600">
                  Explore nossa coleção de produtos artesanais feitos com jeans reciclado.
                  Cada peça é única e conta uma história de sustentabilidade e criatividade.
                </p>
              </div>
              <ProductCatalog />
            </div>
          )}
        </main>

        {/* Seção de Impacto Ambiental */}
        <section className="py-16 bg-green-800 text-white -mx-4 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Nosso Impacto Ambiental</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-green-200">Peças de Jeans Recicladas</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-green-200">Costureiras Cadastradas</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">2000+</div>
                <div className="text-green-200">Clientes Satisfeitos</div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Depoimentos */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
            O que dizem sobre nós
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur border-green-200">
              <CardHeader>
                <MessageSquare className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle className="text-green-800">Maria Silva</CardTitle>
                <CardDescription className="italic">
                  "Como costureira, encontrei uma plataforma que valoriza meu trabalho e me
                  conecta com clientes que apreciam peças artesanais."
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-white/80 backdrop-blur border-green-200">
              <CardHeader>
                <MessageSquare className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle className="text-green-800">João Santos</CardTitle>
                <CardDescription className="italic">
                  "Produtos de excelente qualidade e ainda ajudo o meio ambiente. Não poderia
                  estar mais satisfeito!"
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-white/80 backdrop-blur border-green-200">
              <CardHeader>
                <MessageSquare className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle className="text-green-800">Ana Oliveira</CardTitle>
                <CardDescription className="italic">
                  "Cada peça que compro tem uma história única. Amo saber que estou
                  apoiando artesãs locais."
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-green-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-green-800">Sobre Nós</h3>
              <p className="text-sm text-green-600">
                Conectamos talentosas costureiras a clientes que valorizam peças únicas e sustentáveis.
                Nossa missão é promover a economia circular e o artesanato local.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-green-800">Links Rápidos</h3>
              <ul className="space-y-2 text-sm text-green-600">
                <li><a href="#" className="hover:text-green-800">Como Funciona</a></li>
                <li><a href="#" className="hover:text-green-800">Para Costureiras</a></li>
                <li><a href="#" className="hover:text-green-800">Para Clientes</a></li>
                <li><a href="#" className="hover:text-green-800">Sustentabilidade</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-green-800">Contato</h3>
              <p className="text-sm text-green-600">
                Email: contato@talentosdojeans.com.br<br />
                Tel: (11) 99999-9999<br />
                Horário: Seg-Sex, 9h-18h
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-green-800">Redes Sociais</h3>
              <div className="flex gap-4">
                <a href="#" className="text-green-600 hover:text-green-800">Instagram</a>
                <a href="#" className="text-green-600 hover:text-green-800">Facebook</a>
                <a href="#" className="text-green-600 hover:text-green-800">LinkedIn</a>
              </div>
              <div className="mt-4">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Newsletter
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-green-200 text-center text-sm text-green-600">
            © 2025 Talentos do Jeans. Todos os direitos reservados.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
