import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useProdutos } from "@/hooks/use-produtos";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Database } from "@/lib/database.types";

type Produto = Database['public']['Tables']['produtos']['Row'];

export function ProductManager() {
  const { produtos, loading, error, adicionarProduto, atualizarProduto, removerProduto } = useProdutos();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    descricao_curta: "",
    preco: "",
    preco_promocional: "",
    categoria_id: "",
    imagem_url: "",
    estoque: "0",
    peso: "0",
    material: "",
    dimensoes: { largura: "", altura: "", profundidade: "" }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("dimensoes.")) {
      const dimensaoKey = name.split(".")[1] as keyof typeof formData.dimensoes;
      setFormData(prev => ({
        ...prev,
        dimensoes: {
          ...prev.dimensoes,
          [dimensaoKey]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const produtoData = {
        nome: formData.nome,
        descricao: formData.descricao,
        descricao_curta: formData.descricao_curta,
        preco: parseFloat(formData.preco),
        preco_promocional: formData.preco_promocional ? parseFloat(formData.preco_promocional) : null,
        categoria_id: formData.categoria_id,
        imagem_url: formData.imagem_url,
        estoque: parseInt(formData.estoque),
        peso: parseFloat(formData.peso),
        material: formData.material,
        dimensoes: formData.dimensoes,
        costureira_id: user?.id || ""
      };

      if (editingProduct) {
        await atualizarProduto(editingProduct.id, produtoData);
        toast({
          description: "Produto atualizado com sucesso!",
        });
      } else {
        await adicionarProduto(produtoData);
        toast({
          description: "Produto adicionado com sucesso!",
        });
      }

      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (produto: Produto) => {
    setEditingProduct(produto);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      descricao_curta: produto.descricao_curta,
      preco: produto.preco.toString(),
      preco_promocional: produto.preco_promocional?.toString() || "",
      categoria_id: produto.categoria_id,
      imagem_url: produto.imagem_url,
      estoque: produto.estoque.toString(),
      peso: produto.peso.toString(),
      material: produto.material,
      dimensoes: produto.dimensoes as { largura: string; altura: string; profundidade: string }
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja remover este produto?")) return;

    try {
      await removerProduto(id);
      toast({
        description: "Produto removido com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o produto",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      descricao_curta: "",
      preco: "",
      preco_promocional: "",
      categoria_id: "",
      imagem_url: "",
      estoque: "0",
      peso: "0",
      material: "",
      dimensoes: { largura: "", altura: "", profundidade: "" }
    });
    setEditingProduct(null);
  };

  if (loading) {
    return <div>Carregando produtos...</div>;
  }

  if (error) {
    return <div>Erro ao carregar produtos: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Seus Produtos</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Editar Produto" : "Novo Produto"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do produto abaixo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Produto</Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria_id">Categoria</Label>
                    <Input
                      id="categoria_id"
                      name="categoria_id"
                      value={formData.categoria_id}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao_curta">Descrição Curta</Label>
                  <Input
                    id="descricao_curta"
                    name="descricao_curta"
                    value={formData.descricao_curta}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição Completa</Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preco">Preço</Label>
                    <Input
                      id="preco"
                      name="preco"
                      type="number"
                      step="0.01"
                      value={formData.preco}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preco_promocional">Preço Promocional</Label>
                    <Input
                      id="preco_promocional"
                      name="preco_promocional"
                      type="number"
                      step="0.01"
                      value={formData.preco_promocional}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estoque">Estoque</Label>
                    <Input
                      id="estoque"
                      name="estoque"
                      type="number"
                      value={formData.estoque}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="peso">Peso (g)</Label>
                    <Input
                      id="peso"
                      name="peso"
                      type="number"
                      value={formData.peso}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dimensoes.largura">Largura (cm)</Label>
                    <Input
                      id="dimensoes.largura"
                      name="dimensoes.largura"
                      type="number"
                      value={formData.dimensoes.largura}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensoes.altura">Altura (cm)</Label>
                    <Input
                      id="dimensoes.altura"
                      name="dimensoes.altura"
                      type="number"
                      value={formData.dimensoes.altura}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensoes.profundidade">Profundidade (cm)</Label>
                    <Input
                      id="dimensoes.profundidade"
                      name="dimensoes.profundidade"
                      type="number"
                      value={formData.dimensoes.profundidade}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imagem_url">URL da Imagem</Label>
                  <Input
                    id="imagem_url"
                    name="imagem_url"
                    value={formData.imagem_url}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingProduct ? "Salvar" : "Adicionar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {produtos.map((produto) => (
          <Card key={produto.id}>
            <CardHeader>
              <div className="aspect-square relative mb-2">
                <img
                  src={produto.imagem_url || "/placeholder.svg"}
                  alt={produto.nome}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
              <CardTitle>{produto.nome}</CardTitle>
              <CardDescription>
                {produto.descricao_curta}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  {formatPrice(produto.preco)}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(produto)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(produto.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
