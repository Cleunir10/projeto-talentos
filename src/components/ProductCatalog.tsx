import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Heart, Star, Filter, Image, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: string;
  costureira: string;
  rating: number;
  reviews: number;
}

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
  userType: 'costureira' | 'cliente';
}

export function ProductCatalog({ onAddToCart, userType }: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Lista de produtos disponíveis
  const products: Product[] = [
    {
      id: '1',
      nome: 'Bolsa Ecológica Jeans',
      descricao: 'Bolsa feita com calças jeans recicladas, forrada e com alças reforçadas. Produto único e sustentável.',
      preco: 75.90,
      imagem: '/bolsa-ecologica-jeans.jpg',
      categoria: 'Bolsas',
      costureira: 'Maria Silva',
      rating: 4.8,
      reviews: 23
    },
    {
      id: '2',
      nome: 'Mochila Jeans Vintage',
      descricao: 'Mochila estilo vintage produzida com jeans reciclado, compartimento para notebook e bolsos externos.',
      preco: 129.90,
      imagem: '/mochila-jeans-vintage.jpg',
      categoria: 'Bolsas',
      costureira: 'Ana Costa',
      rating: 4.9,
      reviews: 15
    },
    {
      id: '3',
      nome: 'Bolsa Tote Jeans Reciclado',
      descricao: 'Bolsa tote espaçosa feita com retalhos de jeans em técnica patchwork, ideal para uso diário.',
      preco: 85.00,
      imagem: '/bolsa-tote-jeans-reciclado.jpg',
      categoria: 'Bolsas',
      costureira: 'Carla Santos',
      rating: 4.7,
      reviews: 31
    },
    {
      id: '4',
      nome: 'Clutch de Jeans Elegante',
      descricao: 'Clutch sofisticada produzida com jeans reciclado e aplicações artesanais.',
      preco: 55.50,
      imagem: '/clutch-jeans-elegante.jpg',
      categoria: 'Bolsas',
      costureira: 'Julia Mendes',
      rating: 4.6,
      reviews: 18
    },
    {
      id: '5',
      nome: 'Bolsa Carteiro Jeans',
      descricao: 'Bolsa carteiro estilo mensageiro feita com jeans reciclado, ideal para o dia a dia e uso profissional.',
      preco: 95.00,
      imagem: '/bolsa-carteiro-jeans.jpg',
      categoria: 'Bolsas',
      costureira: 'Paula Oliveira',
      rating: 4.5,
      reviews: 12
    },
    {
      id: '6',
      nome: 'Mini Bolsa Jeans Transversal',
      descricao: 'Mini bolsa transversal feita com jeans reciclado, perfeita para sair com o essencial.',
      preco: 65.00,
      imagem: '/mini-bolsa-jeans-transversal.jpg',
      categoria: 'Bolsas',
      costureira: 'Fernanda Lima',
      rating: 4.7,
      reviews: 9
    }
  ];

  const categories = ["Todos", "Bolsas", "Acessórios", "Roupas", "Decoração"];

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Todos" || product.categoria === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, products]);

  // Memoize paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Produtos Sustentáveis</h2>
          <p className="text-gray-600">Descubra peças únicas feitas com amor e consciência ambiental</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar produtos ou costureiras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-gray-100 relative rounded-md">
              <img
                key={product.imagem}
                src={product.imagem}
                alt={product.nome}
                className="h-full w-full object-cover rounded-md"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
                loading="lazy"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {product.categoria}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
              </div>
              <CardTitle className="text-lg line-clamp-1">{product.nome}</CardTitle>
              <CardDescription className="line-clamp-2 text-sm">
                {product.descricao}
              </CardDescription>
              <p className="text-xs text-green-600 font-medium">
                por {product.costureira}
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-green-600">
                  R$ {product.preco.toFixed(2)}
                </span>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedProduct(product)}
                      >
                        Ver Mais
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{product.nome}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={product.imagem}
                            alt={product.nome}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                              e.currentTarget.classList.add('opacity-50');
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-gray-600 mb-2">{product.descricao}</p>
                          <p className="text-sm text-green-600 font-medium mb-2">
                            Criado por: {product.costureira}
                          </p>
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{product.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              ({product.reviews} avaliações)
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-green-600">
                              R$ {product.preco.toFixed(2)}
                            </span>
                            {userType === 'cliente' && (
                              <Button
                                onClick={() => onAddToCart(product)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Adicionar
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  {userType === 'cliente' && (
                    <Button
                      size="sm"
                      onClick={() => onAddToCart(product)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-500">
            Tente ajustar seus filtros ou termo de busca
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
                className="w-10 h-10 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próxima
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
