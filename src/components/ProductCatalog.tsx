import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Heart, Star, Filter, Image, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useProdutos } from "@/hooks/use-produtos";
import { useToast } from "@/hooks/use-toast";
import { useCarrinho } from "@/hooks/use-carrinho";
import type { Database } from "@/lib/database.types";
import { formatPrice } from "@/lib/utils";

type Produto = Database['public']['Tables']['produtos']['Row'];

export function ProductCatalog() {
  const { produtos, loading, error } = useProdutos();
  const { toast } = useToast();
  const { adicionarAoCarrinho } = useCarrinho();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredProducts = useMemo(() => {
    return produtos.filter(produto => {
      const matchesSearch = produto.nome.toLowerCase().includes(search.toLowerCase()) ||
                          produto.descricao.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || produto.categoria_id === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [produtos, search, selectedCategory]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(produtos.map(p => p.categoria_id));
    return Array.from(uniqueCategories);
  }, [produtos]);

  // Paginação
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-96">Erro ao carregar produtos: {error.message}</div>;
  }

  const handleAddToCart = async (produto: Produto) => {
    try {
      await adicionarAoCarrinho(produto);
      toast({
        title: "Produto adicionado",
        description: `${produto.nome} foi adicionado ao carrinho.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((categoryId) => (
            <Button
              key={categoryId}
              variant={selectedCategory === categoryId ? "default" : "outline"}
              onClick={() => setSelectedCategory(categoryId === selectedCategory ? null : categoryId)}
            >
              {categoryId}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={product.imagem_url || "/placeholder.svg"}
                alt={product.nome}
                className="object-cover w-full h-full"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="line-clamp-1">{product.nome}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.descricao_curta}
                  </CardDescription>
                </div>
                <Badge>{product.categoria_id}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {formatPrice(product.preco)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setSelectedProduct(product)}
                >
                  Ver detalhes
                </Button>
                <Button onClick={() => handleAddToCart(product)}>
                  Adicionar ao carrinho
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Modal de detalhes do produto */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.nome}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-square">
                  <img
                    src={selectedProduct.imagem_url || "/placeholder.svg"}
                    alt={selectedProduct.nome}
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Descrição</h3>
                    <p className="text-muted-foreground">
                      {selectedProduct.descricao}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Detalhes</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Material: {selectedProduct.material}</p>
                      <p>Peso: {selectedProduct.peso}g</p>
                      <p>Estoque: {selectedProduct.estoque} unidades</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-semibold">
                        {formatPrice(selectedProduct.preco)}
                      </span>
                      {selectedProduct.preco_promocional && (
                        <span className="text-lg text-muted-foreground line-through">
                          {formatPrice(selectedProduct.preco_promocional)}
                        </span>
                      )}
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                    >
                      Adicionar ao carrinho
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
