/**
 * Contribuição espontânea via Pix ("Apoiar com Pix"). NÃO é patrocínio nem parceria comercial.
 *
 * Cada valor tem a cobrança do Nubank (`url`), o Pix copia e cola dela (`code`, o código oficial lido da página da cobrança, com valor e CRC conferidos)
 * e o QR Code (`qr`, em /public/pix/, gerado a partir do `code` para os apps de banco reconhecerem como Pix).
 * `qr`, `code` e `url` ficam juntos no mesmo objeto de propósito: a tela sempre lê os dois do valor selecionado,
 * então é impossível mostrar o QR Code de um valor com o link de outro. Para trocar um valor, atualize os dois.
 */
export type PixOption = {
  id: string;
  /** valor em reais */
  amount: number;
  /** caminho do QR Code em /public (ex.: "/pix/pix-25.png"); vazio = ainda não configurado */
  qr?: string;
  /** Pix copia e cola; vazio = ainda não configurado */
  code?: string;
  /** link da cobrança Pix deste valor; vazio = ainda não configurado */
  url?: string;
};

const nubank = (id: string) => `https://nubank.com.br/cobrar/g6pces/${id}`;

export const pixOptions: PixOption[] = [
  { id: "25", amount: 25, qr: "/pix/pix-25.png", code: "00020126580014BR.GOV.BCB.PIX01362698f3cd-3e44-4113-af2e-2d54609cc73c520400005303986540525.005802BR5922Enrico Probst Vernieri6009SAO PAULO62140510IGdTty4bEP630464E2", url: nubank("6ad94545-d0c9-4808-b9a9-56a2f8fe9157") },
  { id: "50", amount: 50, qr: "/pix/pix-50.png", code: "00020126580014BR.GOV.BCB.PIX01362698f3cd-3e44-4113-af2e-2d54609cc73c520400005303986540550.005802BR5922Enrico Probst Vernieri6009SAO PAULO62140510I9frkuwfCD6304316A", url: nubank("6ad94586-dd08-4405-acc9-f81a7105659b") },
  { id: "100", amount: 100, qr: "/pix/pix-100.png", code: "00020126580014BR.GOV.BCB.PIX01362698f3cd-3e44-4113-af2e-2d54609cc73c5204000053039865406100.005802BR5922Enrico Probst Vernieri6009SAO PAULO62140510URSZc2XHEb6304C218", url: nubank("6ad945b6-f6a6-495b-8b2e-89ceea441ddf") },
  { id: "500", amount: 500, qr: "/pix/pix-500.png", code: "00020126580014BR.GOV.BCB.PIX01362698f3cd-3e44-4113-af2e-2d54609cc73c5204000053039865406500.005802BR5922Enrico Probst Vernieri6009SAO PAULO62140510ShFdPKIwEV63048F89", url: nubank("6ad945c5-9b04-40ff-8a84-3e6249c4cafc") },
];

/** Valor que já vem selecionado ao abrir. */
export const pixDefaultId = "50";

/** Um valor só está pronto quando tem QR Code e código. */
export const pixReady = (o: PixOption) => Boolean(o.qr && o.code && o.url);
