# Site do piloto Enrico Vernieri

Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + Motion. Home longa com âncoras e páginas individuais de notícias.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Onde editar o conteúdo (tudo em `src/content`)

| Arquivo | O que controla |
| --- | --- |
| `site.ts` | Contatos, mídia kit, menu e a chave `showPlaceholders` (desligar antes de publicar) |
| `pilot.ts` | Fatos do piloto (nascimento, estreia, campeonatos) |
| `results.ts` | Resultados por temporada. Os totais e a matriz de evolução são calculados daqui. **Adicionar 2026 aqui** |
| `story.ts` | Capítulos da linha do tempo (texto, fatos, foto ou vídeo) |
| `events.ts` | Próximos desafios. Vazio = mostra o estado "calendário em preparação" |
| `sponsors.ts` | Logos das marcas parceiras e vídeos de campanhas |
| `news.ts` | Notícias. Cada item gera `/noticias/[slug]` |

## Identidade

- Verde `#00FF9C` (token `mint`), preto `ink`, claro `paper`. Sem modo claro/escuro: o ritmo vem da alternância de fundos.
- Número 5 e dígitos: vetor extraído de `números.pdf` (`public/digits`, `src/lib/digits.ts`).
- Logo: variações extraídas do PDF (`public/brand`), com fundo transparente.
- `SpeedingNumber` é a adaptação do Speeding Text (React Bits Pro): contagem com desfoque proporcional à velocidade, sem GSAP, com `prefers-reduced-motion`.
