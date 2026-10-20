/**
 * Contribuição espontânea via Pix ("Apoiar com Pix"). NÃO é patrocínio nem parceria comercial.
 *
 * COMO PREENCHER (um bloco por valor):
 *  1. Salve a imagem do QR Code em /public/pix/ (ex.: public/pix/pix-25.png).
 *  2. Informe o caminho em `qr` (ex.: "/pix/pix-25.png") e o texto do Pix copia e cola em `code`.
 *  3. Os dois campos precisam ser do MESMO valor do bloco. Enquanto `qr` ou `code` estiver vazio, aquele valor aparece como
 *     "ainda não configurado" e o botão de copiar fica desabilitado. Nada aqui é um código de pagamento real.
 *
 * `qr` e `code` ficam juntos no mesmo objeto de propósito: a tela sempre lê os dois do valor selecionado,
 * então é impossível mostrar o QR Code de um valor com o código de outro.
 */
export type PixOption = {
  id: string;
  /** valor em reais */
  amount: number;
  /** caminho do QR Code em /public (ex.: "/pix/pix-25.png"); vazio = ainda não configurado */
  qr?: string;
  /** Pix copia e cola; vazio = ainda não configurado */
  code?: string;
};

export const pixOptions: PixOption[] = [
  { id: "25", amount: 25, qr: undefined, code: undefined },
  { id: "50", amount: 50, qr: undefined, code: undefined },
  { id: "100", amount: 100, qr: undefined, code: undefined },
];

/** Valor que já vem selecionado ao abrir. */
export const pixDefaultId = "50";

/** Um valor só está pronto quando tem QR Code e código copia e cola. */
export const pixReady = (o: PixOption) => Boolean(o.qr && o.code);
