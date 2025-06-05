import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

export interface Endereco {
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export type StatusPedido =
  | "pendente"
  | "confirmado"
  | "em_producao"
  | "enviado"
  | "entregue"
  | "cancelado";

export const statusPedidoConfig = {
  pendente: { label: "Pendente", variant: "default" as const },
  confirmado: { label: "Confirmado", variant: "secondary" as const },
  em_producao: { label: "Em Produção", variant: "secondary" as const },
  enviado: { label: "Enviado", variant: "default" as const },
  entregue: { label: "Entregue", variant: "secondary" as const },
  cancelado: { label: "Cancelado", variant: "destructive" as const },
};
