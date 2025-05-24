import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Image } from "lucide-react";

interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: string;
  estoque: number;
}

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      nome: 'Bolsa Ecológica Jeans',
      descricao: 'Bolsa feita com calças jeans recicladas, forrada e com alças reforçadas. Produto único e sustentável.',
      preco: 75.90,
      imagem: '/bolsa-ecologica-jeans.jpg',
      categoria: 'Bolsas',
      estoque: 5
    },
    {
      id: '2',
      nome: 'Mochila Jeans Vintage',
      descricao: 'Mochila estilo vintage produzida com jeans reciclado, compartimento para notebook e bolsos externos.',
      preco: 129.90,
      imagem: '/mochila-jeans-vintage.jpg',
      categoria: 'Bolsas',
      estoque: 3
    },
    {
      id: '3',
      nome: 'Bolsa Tote Jeans Reciclado',
      descricao: 'Bolsa tote espaçosa feita com retalhos de jeans em técnica patchwork, ideal para uso diário.',
      preco: 85.00,
      imagem: '/bolsa-tote-jeans-reciclado.jpg',
      categoria: 'Bolsas',
      estoque: 4
    },
    {
      id: '4',
      nome: 'Clutch de Jeans Elegante',
      descricao: 'Clutch sofisticada produzida com jeans reciclado e aplicações artesanais.',
      preco: 55.50,
      imagem: '/clutch-jeans-elegante.jpg',
      categoria: 'Bolsas',
      estoque: 6
    },
    {
      id: '5',
      nome: 'Bolsa Carteiro Jeans',
      descricao: 'Bolsa carteiro estilo mensageiro feita com jeans reciclado, ideal para o dia a dia e uso profissional.',
      preco: 95.00,
      imagem: '/bolsa-carteiro-jeans.jpg',
      categoria: 'Bolsas',
      estoque: 3
    },
    {
      id: '6',
      nome: 'Mini Bolsa Jeans Transversal',
      descricao: 'Mini bolsa transversal feita com jeans reciclado, perfeita para sair com o essencial.',
      preco: 65.00,
      imagem: '/mini-bolsa-jeans-transversal.jpg',
      categoria: 'Bolsas',
      estoque: 4
    }
  ]);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    estoque: '',
    imagem: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProduct: Product = {
      id: editingProduct?.id || Date.now().toString(),
      nome: formData.nome,
      descricao: formData.descricao,
      preco: parseFloat(formData.preco),
      categoria: formData.categoria,
      estoque: parseInt(formData.estoque),
      imagem: formData.imagem || '/placeholder.svg'
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? newProduct : p));
    } else {
      setProducts(prev => [...prev, newProduct]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      categoria: '',
      estoque: '',
      imagem: ''
    });
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nome: product.nome,
      descricao: product.descricao,
      preco: product.preco.toString(),
      categoria: product.categoria,
      estoque: product.estoque.toString(),
      imagem: product.imagem
    });
    setIsAddingProduct(true);
  };

  const handleDelete = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meus Produtos</h2>
          <p className="text-gray-600">Gerencie seus produtos sustentáveis</p>
        </div>
        <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Bolsa Ecológica"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descreva seu produto..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) => setFormData(prev => ({ ...prev, preco: e.target.value }))}
                    placeholder="0,00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estoque">Estoque</Label>
                  <Input
                    id="estoque"
                    type="number"
                    value={formData.estoque}
                    onChange={(e) => setFormData(prev => ({ ...prev, estoque: e.target.value }))}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                  id="categoria"
                  value={formData.categoria}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                  placeholder="Ex: Bolsas, Acessórios, Roupas"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingProduct ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              <img
                src={product.imagem}
                alt={product.nome}
                className="h-full w-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                  e.currentTarget.classList.add('opacity-50');
                }}
                loading="lazy"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{product.nome}</CardTitle>
              <CardDescription className="line-clamp-2">
                {product.descricao}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-green-600">
                  R$ {product.preco.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                  Estoque: {product.estoque}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Image className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum produto cadastrado
          </h3>
          <p className="text-gray-500 mb-4">
            Comece adicionando seus primeiros produtos sustentáveis
          </p>
          <Button onClick={() => setIsAddingProduct(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeiro Produto
          </Button>
        </div>
      )}
    </div>
  );
}
