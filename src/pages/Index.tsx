import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Scissors, Users, ShoppingCart, Heart, Recycle, Star } from "lucide-react";
import { LoginModal } from "@/components/LoginModal";
import { Dashboard } from "@/components/Dashboard";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'costureira' | 'cliente' | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState<'costureira' | 'cliente'>('cliente');

  const handleLogin = (type: 'costureira' | 'cliente') => {
    setLoginType(type);
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (type: 'costureira' | 'cliente') => {
    setIsLoggedIn(true);
    setUserType(type);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
  };

  // Dados dos produtos em destaque
  const featuredProducts = [
    {
      id: '1',
      name: 'Bolsa Tote Jeans Reciclado',
      description: 'Bolsa espaçosa feita com calças jeans recicladas, design moderno e funcional.',
      price: 89.90,
      image: '/bolsa-tote-jeans-reciclado.jpg',
      category: 'Bolsas',
      artisan: 'Maria Silva',
    },
    {
      id: '2',
      name: 'Mochila Jeans Sustentável',
      description: 'Mochila resistente produzida com reaproveitamento de jeans, com compartimentos organizados.',
      price: 119.90,
      image: '/mochila-jeans-sustentavel.jpg',
      category: 'Bolsas',
      artisan: 'Joana Lima',
    },
    {
      id: '3',
      name: 'Clutch Patchwork Jeans',
      description: 'Clutch elegante feita com retalhos de jeans em técnica patchwork, ideal para eventos.',
      price: 65.00,
      image: '/clutch-patchwork-jeans.jpg',
      category: 'Bolsas',
      artisan: 'Ana Ferreira',
    },
  ];

  if (isLoggedIn && userType) {
    return <Dashboard userType={userType} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Scissors className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-green-800">Talentos</h1>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => handleLogin('cliente')}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Entrar como Cliente
              </Button>
              <Button 
                onClick={() => handleLogin('costureira')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Entrar como Costureira
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Conectando <span className="text-green-600">Sustentabilidade</span> e <span className="text-green-600">Artesanato</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Plataforma que conecta costureiras autônomas que reaproveitam resíduos têxteis a clientes conscientes
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                size="lg" 
                onClick={() => handleLogin('cliente')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Comprar Produtos Sustentáveis
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => handleLogin('costureira')}
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3"
              >
                <Users className="mr-2 h-5 w-5" />
                Vender Suas Criações
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Produtos em Destaque
          </h3>
          <p className="text-center text-gray-600 mb-10">
            Bolsas exclusivas feitas com calças jeans recicladas
          </p>
          
          <div className="grid md:grid-cols-3 gap-8" key="featured-products-grid">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100 relative group">
                  <img
                    key={product.image}
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-600 hover:bg-green-700">{product.category}</Badge>
                    <p className="text-sm text-green-600 font-medium">
                      por {product.artisan}
                    </p>
                  </div>
                  <CardTitle className="text-lg mt-2">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-xl font-bold text-green-600">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <Button 
                    onClick={() => handleLogin('cliente')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Comprar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button 
              variant="outline" 
              onClick={() => handleLogin('cliente')}
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              Ver Todos os Produtos
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Como Funciona
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-green-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Recycle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-green-800">Reaproveitamento</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Costureiras transformam resíduos têxteis em peças únicas e sustentáveis
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-green-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-green-800">Conexão</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Conectamos artesãs talentosas com clientes que valorizam sustentabilidade
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-green-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Star className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-green-800">Qualidade</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Produtos únicos, feitos à mão com amor e responsabilidade ambiental
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-4xl font-bold mb-2">500+</h4>
              <p className="text-green-100">Costureiras Cadastradas</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold mb-2">2000+</h4>
              <p className="text-green-100">Produtos Sustentáveis</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold mb-2">10t</h4>
              <p className="text-green-100">Resíduos Reaproveitados</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-6">
            Faça Parte da Revolução Sustentável
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a nós e contribua para um mundo mais sustentável
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => handleLogin('costureira')}
              className="bg-white text-green-600 hover:bg-gray-50 px-8 py-3"
            >
              Começar a Vender
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => handleLogin('cliente')}
              className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3"
            >
              Explorar Produtos
            </Button>
          </div>
        </div>
      </section>

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        userType={loginType}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Index;
