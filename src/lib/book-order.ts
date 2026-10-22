/**
 * Regras do pedido do livro, sem dependências: o MESMO arquivo valida o formulário no navegador e o pedido no servidor
 * (backend/worker.ts), então os dois nunca discordam sobre o que é um dado válido.
 */

export type Buyer = { name: string; email: string; cpf: string };
export type Address = { cep: string; street: string; number: string; complement: string; district: string; city: string; state: string };
export type OrderInput = { buyer: Buyer; address: Address };
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export const UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"] as const;

export const digits = (s: string) => s.replace(/\D/g, "");

export const maskCpf = (s: string) => {
  const d = digits(s).slice(0, 11);
  return d.replace(/^(\d{3})(\d)/, "$1.$2").replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1-$2");
};

export const maskCep = (s: string) => {
  const d = digits(s).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

export function isValidCpf(value: string) {
  const d = digits(value);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const check = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(d[i]) * (len + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return check(9) === Number(d[9]) && check(10) === Number(d[10]);
}

export const isValidEmail = (v: string) => v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

const len = (v: string, min: number, max: number) => v.trim().length >= min && v.trim().length <= max;

export function validateBuyer(b: Buyer): FieldErrors<Buyer> {
  const e: FieldErrors<Buyer> = {};
  if (!b.name.trim()) e.name = "Informe seu nome completo.";
  else if (b.name.trim().split(/\s+/).length < 2 || !len(b.name, 5, 120)) e.name = "Informe nome e sobrenome.";
  if (!b.email.trim()) e.email = "Informe seu e-mail.";
  else if (!isValidEmail(b.email.trim())) e.email = "Esse e-mail não parece válido. Confira, por exemplo: nome@email.com.";
  if (!digits(b.cpf)) e.cpf = "Informe seu CPF.";
  else if (!isValidCpf(b.cpf)) e.cpf = "Esse CPF não é válido. Confira os números.";
  return e;
}

export function validateAddress(a: Address): FieldErrors<Address> {
  const e: FieldErrors<Address> = {};
  if (!digits(a.cep)) e.cep = "Informe o CEP.";
  else if (digits(a.cep).length !== 8) e.cep = "O CEP tem 8 números.";
  if (!a.street.trim()) e.street = "Informe o endereço.";
  else if (!len(a.street, 2, 120)) e.street = "Endereço muito longo ou curto.";
  if (!a.number.trim()) e.number = "Informe o número (ou S/N).";
  else if (!len(a.number, 1, 12)) e.number = "Número muito longo.";
  if (a.complement.trim().length > 60) e.complement = "Complemento muito longo.";
  if (!a.district.trim()) e.district = "Informe o bairro.";
  else if (!len(a.district, 2, 80)) e.district = "Bairro muito longo ou curto.";
  if (!a.city.trim()) e.city = "Informe a cidade.";
  else if (!len(a.city, 2, 80)) e.city = "Cidade muito longa ou curta.";
  if (!a.state) e.state = "Escolha o estado.";
  else if (!(UFS as readonly string[]).includes(a.state)) e.state = "Estado inválido.";
  return e;
}

export const hasErrors = (e: object) => Object.keys(e).length > 0;

/** Valor do livro em centavos (evita erro de arredondamento) e formatação em reais. */
export const brl = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

/** Contrato entre o site e a API de pedidos. */
export type OrderRequest = {
  /** gerado no navegador; reenviar o mesmo valor nunca cria um segundo pedido */
  idempotencyKey: string;
  buyer: Buyer;
  address: Address;
  quantity: 1;
  /** a pessoa leu o aviso de privacidade */
  consent: true;
  /** isca contra robôs: pessoas nunca preenchem (campo escondido) */
  website: string;
  /** tempo entre abrir o formulário e enviar, em ms (robôs enviam em instantes) */
  elapsedMs: number;
};
export type OrderResponse = { orderId: string; status: "awaiting_payment" };
