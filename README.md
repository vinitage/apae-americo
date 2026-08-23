# APAE Américo Brasiliense

Site institucional da **APAE Américo Brasiliense**, entidade de assistência social sem fins lucrativos que atende pessoas com deficiência intelectual e múltipla em Américo Brasiliense/SP desde 2007.

🔗 **Site:** [apaeamericobrasiliense.com.br](https://apaeamericobrasiliense.com.br)

## Sobre o projeto

Site institucional multipágina construído para dois públicos simultâneos:

- **Quem precisa de ajuda** → acolhimento de famílias, com fluxo dedicado de "Precisa de Ajuda?" e canal direto por WhatsApp
- **Quem quer ajudar** → doação via PIX, transferência bancária, alimentos, parceria empresarial e voluntariado

Inclui um **Portal da Transparência** completo (Auditoria, Balanço Social, Compras e Contratações, Certidões, Relatório Anual, Parcerias Públicas e Privadas), em conformidade com a Lei 13.019/2014 — Marco Regulatório do Terceiro Setor.

## Stack

- HTML5 semântico
- CSS3 (custom properties, arquivo único — sem pré-processador)
- JavaScript vanilla (scroll reveal, filtros do portal de transparência, menu mobile)
- [Tailwind CSS](https://tailwindcss.com) via CDN
- Google Fonts: Playfair Display + Inter

Sem framework, sem build step — deploy automático via Git a cada push na branch `master`.

## Estrutura

```
├── index.html              # Home
├── institucional.html      # Quem Somos, Diretoria, Conselho, Documentos
├── servicos.html           # Assistência Social, Saúde, Outros Programas
├── precisa-de-ajuda.html   # Acolhimento — fluxo de atendimento
├── transparencia.html      # Portal da Transparência (Lei 13.019/2014)
├── doe-agora.html          # PIX, transferência, alimentos, parcerias
├── juntese-a-nos.html      # Voluntariado, parcerias, trabalhe conosco
├── noticias.html           # Notícias e informativos
├── fotos-videos.html       # Galeria de fotos
├── contato.html            # Fale Conosco, Ouvidoria, LGPD
├── lgpd.html / privacidade.html
├── css/style.css           # arquivo único
├── js/main.js              # arquivo único
├── images/                 # fotos e logo
├── docs/                   # PDFs públicos (estatuto, ata, portal de transparência)
├── favicon.ico
├── robots.txt
├── sitemap.xml
└── .htaccess                # HTTPS, headers de segurança, cache e compressão
```

## Identidade Visual

```css
--blue-primary: #1A56DB   /* Azul APAE — identidade nacional */
--yellow-sun:   #F5B800   /* Amarelo girassol APAE */
--cta-donate:   #E8420A   /* Doe Agora */
--cream:        #FAF9F6   /* Fundo principal */
```

Heading em Playfair Display, corpo em Inter — tom editorial e institucional, sem ornamentos excessivos, com foco em clareza e acessibilidade (WCAG AA).

## SEO & Performance

- Meta tags completas (title, description, Open Graph, Twitter Card) por página
- Schema.org (`NGO`, `BreadcrumbList`, `FAQPage`) para rich results no Google
- Imagens com `width`/`height`, `loading` e `decoding` corretos
- Mobile-first, testado em 375px–1440px
- Metas de performance: LCP < 2,5s · CLS < 0,1 · PageSpeed Mobile > 85

## Transparência

Documentos institucionais e de prestação de contas ficam em `docs/` e são referenciados diretamente pelas páginas `institucional.html` e `transparencia.html`, conforme exigido pela Lei 13.019/2014.

---

Desenvolvido por [Vinta Digital](https://vndigital.site) — posicionamento digital para negócios locais.
