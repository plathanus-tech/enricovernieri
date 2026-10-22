/**
 * Livro "Curva Zero", do pai do Enrico. Texto e dados do produto conforme a página da obra na Amazon.com.br;
 * confirmar com o autor antes de publicar. Nada de pagamento ou entrega está aqui além do que foi informado.
 */
import { news, type NewsItem } from "./news";

export const book = {
  title: "Curva Zero",
  subtitle: "quando obstinação e disciplina te ensinam que desistir não é uma opção",
  author: "Pascoal Vernieri",
  publisher: "Novo Arco",
  edition: "1ª edição, maio de 2026",
  pages: 140,
  /** valor em centavos */
  priceCents: 4990,
  /** Capa do livro (650×1000 px). Vazio = espaço reservado. */
  cover: {
    src: "/book/livro-curva-zero.jpg",
    width: 650,
    height: 1000,
    alt: "Capa do livro Curva Zero, de Pascoal Vernieri: título em letras grandes sobre fundo escuro",
  } as undefined | { src: string; width: number; height: number; alt: string },
  /** Fotos do lançamento: família com o livro (home) e autógrafo com o abraço (hero da página do livro). */
  photos: {
    family: {
      src: "/book/lancamento-curva-zero.jpg",
      width: 1280,
      height: 853,
      alt: "Enrico segura o livro Curva Zero, cercado pela família, em frente ao capacete e ao troféu de kart",
    },
    signing: {
      src: "/book/autografo-curva-zero.jpg",
      width: 1280,
      height: 853,
      alt: "O pai do Enrico autografa o livro Curva Zero enquanto Enrico o abraça por trás",
    },
  },
  /** Texto de apresentação da obra, na ordem original. */
  synopsis: [
    "Este livro nasce do encontro entre dois mundos que parecem distantes, mas são surpreendentemente semelhantes: o esporte de base e o empreendedorismo.",
    "Ao acompanhar a trajetória do filho no kart e, ao mesmo tempo, conduzir sua própria jornada como empreendedor, Pascoal Vernieri percebeu que os desafios eram quase os mesmos. Decisões sob pressão, limites financeiros, formação de pessoas, frustrações, persistência e a responsabilidade de sustentar sonhos sem destruir quem caminha junto.",
    "Curva Zero é uma reflexão honesta sobre liderança, família e construção de projetos de longo prazo. Um convite para olhar além do resultado imediato e entender o que realmente sustenta trajetórias duradouras: processo, caráter, disciplina e consciência nas decisões.",
    "Mais do que um livro sobre kart ou negócios, esta é uma conversa sobre como formar pessoas, liderar com responsabilidade e continuar avançando mesmo quando o caminho fica mais difícil.",
  ],
} as const;

/**
 * Pix FIXO para a compra do livro, a ser fornecido pelo responsável.
 *  - qr: imagem do QR Code em /public/book/ (ex.: "/book/pix-livro.png"); opcional se `code` existir.
 *  - code: Pix copia e cola completo.
 * Enquanto `code` estiver vazio o site NÃO permite concluir o pedido. Nada aqui é um código de pagamento real.
 */
export const bookPix: { qr?: string; code?: string } = {
  qr: "/book/pix-livro.png",
  code: "00020126360014br.gov.bcb.pix0114+5548991151370520400005303986540549.905802BR5922PASCOAL PINTO VERNIERI6007PALHOCA62070503***6304B17E",
};

/** Endereço da API de pedidos (backend/). Definido na publicação por NEXT_PUBLIC_ORDER_API_URL. Vazio = pedidos desativados. */
export const orderApiUrl = process.env.NEXT_PUBLIC_ORDER_API_URL ?? "";

/** Notícias sobre o livro (entrevistas, lançamentos, eventos). Reaproveita as de src/content/news.ts pelo slug, para não duplicar texto, foto e data; outras podem ser acrescentadas aqui. Vazio = a seção não aparece. */
const bookNewsSlugs = ["minuano-livro-curva-zero-2026", "curvados-livro-curva-zero-2026"];
export const bookNews: NewsItem[] = news.filter((n) => bookNewsSlugs.includes(n.slug));
