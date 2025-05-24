import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Smartphone } from "lucide-react";

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  quantity: number;
  costureira: string;
  imagem: string;
}

interface CartProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const shippingSchema = z.object({
  endereco: z.string().min(3, "Endereço deve ter pelo menos 3 caracteres"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro deve ter pelo menos 2 caracteres"),
  cidade: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  estado: z.string().length(2, "Estado deve ter 2 letras")
});

export function Cart({ items, onRemoveItem, onUpdateQuantity }: CartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  
  const form = useForm({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      cep: "",
      estado: ""
    }
  });

  const subtotal = items.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + shipping;

  const handleCheckout = async (data) => {
    try {
      setIsCheckingOut(true);
      // Simulação de chamada à API de pagamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aqui você adicionaria a integração real com o backend
      console.log("Dados do pedido:", {
        items,
        shipping: data,
        payment: paymentMethod,
        total
      });

      // Limpa o carrinho após checkout bem-sucedido
      items.forEach(item => onRemoveItem(item.id));
      setIsCheckingOut(false);
      
      // Mostra mensagem de sucesso
      toast({
        title: "Pedido realizado com sucesso!",
        description: `Total: R$ ${total.toFixed(2)}`,
        variant: "success"
      });
    } catch (error) {
      console.error("Erro no checkout:", error);
      setIsCheckingOut(false);
      toast({
        title: "Erro ao processar pedido",
        description: "Por favor, tente novamente",
        variant: "destructive"
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Carrinho de Compras</h2>
          <p className="text-gray-600">Seus produtos sustentáveis estão aqui</p>
        </div>
        
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Seu carrinho está vazio
          </h3>
          <p className="text-gray-500 mb-4">
            Explore nossos produtos sustentáveis e adicione ao carrinho
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Carrinho de Compras</h2>
        <p className="text-gray-600">{items.length} {items.length === 1 ? 'item' : 'itens'} no carrinho</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={item.imagem} 
                      alt={item.nome}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">{item.nome}</h3>
                    <p className="text-sm text-green-600 font-medium mb-2">por {item.costureira}</p>
                    <p className="text-sm text-gray-500 mb-2">R$ {item.preco.toFixed(2)} cada</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-green-600">
                        R$ {(item.preco * item.quantity).toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span>{shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}</span>
              </div>
              {shipping === 0 && (
                <p className="text-sm text-green-600">
                  ✓ Frete grátis para compras acima de R$ 50,00
                </p>
              )}
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span className="text-green-600">R$ {total.toFixed(2)}</span>
              </div>
              
              <Dialog open={isCheckingOut} onOpenChange={setIsCheckingOut}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                    Finalizar Compra
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Finalizar Compra</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Payment Method */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Método de Pagamento</Label>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pix" id="pix" />
                          <Label htmlFor="pix" className="flex items-center space-x-2 cursor-pointer">
                            <Smartphone className="h-4 w-4 text-green-600" />
                            <span>PIX</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="credit" id="credit" />
                          <Label htmlFor="credit" className="flex items-center space-x-2 cursor-pointer">
                            <CreditCard className="h-4 w-4 text-blue-600" />
                            <span>Cartão de Crédito</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Endereço de Entrega</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <Input
                            placeholder="Endereço"
                            {...form.register("endereco")}
                            error={!!form.formState.errors.endereco}
                          />
                          {form.formState.errors.endereco && (
                            <p className="text-red-600 text-sm mt-1">
                              {form.formState.errors.endereco.message}
                            </p>
                          )}
                        </div>
                        <Input
                          placeholder="Número"
                          {...form.register("numero")}
                          error={!!form.formState.errors.numero}
                        />
                        {form.formState.errors.numero && (
                          <p className="text-red-600 text-sm mt-1">
                            {form.formState.errors.numero.message}
                          </p>
                        )}
                        <Input
                          placeholder="CEP"
                          {...form.register("cep")}
                          error={!!form.formState.errors.cep}
                        />
                        {form.formState.errors.cep && (
                          <p className="text-red-600 text-sm mt-1">
                            {form.formState.errors.cep.message}
                          </p>
                        )}
                        <Input
                          placeholder="Bairro"
                          {...form.register("bairro")}
                          error={!!form.formState.errors.bairro}
                        />
                        {form.formState.errors.bairro && (
                          <p className="text-red-600 text-sm mt-1">
                            {form.formState.errors.bairro.message}
                          </p>
                        )}
                        <Input
                          placeholder="Cidade"
                          {...form.register("cidade")}
                          error={!!form.formState.errors.cidade}
                        />
                        {form.formState.errors.cidade && (
                          <p className="text-red-600 text-sm mt-1">
                            {form.formState.errors.cidade.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>R$ {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Frete</span>
                        <span>{shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span className="text-green-600">R$ {total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={form.handleSubmit(handleCheckout)} 
                      className="w-full bg-green-600 hover:bg-green-700"
                      isLoading={isCheckingOut}
                    >
                      Confirmar Pedido
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
