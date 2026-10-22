import type { Metadata } from "next";
import Link from "next/link";
import { site, whatsappLink } from "@/content/site";

export const metadata: Metadata = {
  title: "Aviso de Privacidade",
  description: "Como os dados informados na compra do livro Curva Zero são usados e protegidos.",
};

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "Quais dados coletamos",
    body: (
      <p>
        Ao comprar o livro, pedimos nome completo, e-mail, CPF, endereço de entrega (CEP, endereço, número, complemento, bairro, cidade e estado). Não coletamos dados de cartão ou de conta bancária: o pagamento é feito por Pix no aplicativo do seu banco.
      </p>
    ),
  },
  {
    title: "Para que usamos",
    body: (
      <p>
        Só para registrar o seu pedido, conferir o pagamento do Pix, enviar o livro e falar com você sobre a compra. O e-mail recebe a confirmação do pedido. Não usamos os dados para publicidade nem os vendemos ou compartilhamos para outros fins.
      </p>
    ),
  },
  {
    title: "Quem recebe os dados",
    body: (
      <ul className="grid list-disc gap-1 pl-5">
        <li>A equipe responsável pela venda do livro, que recebe o pedido por e-mail.</li>
        <li>Os serviços que operam o pedido: a hospedagem da API (Cloudflare), onde o pedido fica gravado, e o envio de e-mail (Resend).</li>
        <li>O serviço público ViaCEP, que recebe apenas o CEP digitado para preencher o endereço automaticamente.</li>
      </ul>
    ),
  },
  {
    title: "Por quanto tempo guardamos",
    body: <p>Os pedidos ficam gravados por até 180 dias, tempo para conferir o pagamento, enviar o livro e resolver eventuais problemas. Depois disso, são apagados automaticamente.</p>,
  },
  {
    title: "Seus direitos",
    body: (
      <p>
        Você pode pedir acesso, correção ou exclusão dos seus dados, e informações sobre como foram usados (Lei Geral de Proteção de Dados, LGPD). Para isso,{" "}
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-mint-ink">
          fale com os responsáveis pelo WhatsApp {site.contact.whatsappDisplay}
          <span className="sr-only"> (abre em nova aba)</span>
        </a>{" "}
        informando o número do pedido.
      </p>
    ),
  },
  {
    title: "Segurança",
    body: <p>Os dados trafegam por conexão segura e ficam em um armazenamento privado, de acesso restrito aos responsáveis pela venda. Este site não guarda os seus dados no navegador depois que você fecha a janela de compra.</p>,
  },
];

export default function Privacy() {
  return (
    <div className="on-light bg-paper-2 pb-24 pt-[calc(var(--header-h)+3rem)] text-ink md:pb-32">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <nav aria-label="Trilha" className="text-sm">
          <Link href="/" className="underline underline-offset-4 hover:text-mint-ink">
            Início
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span aria-current="page">Aviso de Privacidade</span>
        </nav>
        <h1 className="display mt-6 text-[clamp(2.6rem,8vw,5rem)]">Aviso de Privacidade</h1>
        <p className="mt-4 text-base text-mute-light md:text-lg">Como tratamos os dados informados na compra do livro Curva Zero.</p>
        <div className="mt-10 grid gap-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="display text-2xl md:text-3xl">{s.title}</h2>
              <div className="mt-2 grid gap-2 text-base text-ink/90">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
