# Angel Consultancy and Network — Novo Website

Website institucional moderno, acolhedor e de alta performance desenvolvido para a **Angel Consultancy and Network**.

## 🎯 Proposta & Posicionamento

> *"Assistência humana, simples e confiável para sua organização financeira e administrativa."*

O projeto foi concebido para transmitir proximidade humana, clareza, transparência e segurança para pessoas físicas, associações/ONGs e profissionais liberais/autônomos na Bélgica.

---

## 🛠️ Stack Tecnológica

- **Frontend**: [React](https://react.dev/) (v19) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) com design system customizado
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Animações & Microinterações**: [Framer Motion](https://www.framer.com/motion/)
- **Roteamento**: [React Router](https://reactrouter.com/)
- **Linter & Qualidade**: Oxlint + TypeScript strict checking

---

## 🚀 Arquitetura & Infraestrutura (one.com)

- **Sem lock-in**: Totalmente desacoplado de Vercel, Supabase ou provedores proprietários.
- **Produção na one.com**:
  - Geração estática via `npm run build` na pasta `dist/`.
  - Arquivo `public/.htaccess` pré-configurado com regras de reescrita para Apache, garantindo navegação SPA sem erros 404, HTTPS e compressão Gzip.
- **Pronto para Backend Futuro**:
  - Estrutura pronta para conexão via endpoints PHP + MariaDB localizados no mesmo servidor (`/api/...`).

---

## 📁 Estrutura de Pastas

```text
src/
├── assets/         # Logotipos oficiais e imagens estáticas
├── components/
│   ├── common/     # SEO, ScrollToTop, WhatsAppButton
│   ├── navigation/ # Header com scroll blur e MobileMenu lateral 80%
│   └── ui/         # Button, Card, Badge, Input, Textarea, SectionTitle
├── hooks/          # useScrollHeader, useScrollLock
├── layouts/        # MainLayout (Header + Main + Footer + WhatsApp)
├── lib/            # utils (cn), animations (Framer Motion), constants
├── pages/          # HomePage, NotFoundPage
├── sections/       # Hero, Intro, Services, TargetAudience, Methodology, Contact, Footer
├── styles/         # globals.css (Tailwind e temas)
└── types/          # Tipagens estritas TypeScript
```

---

## 💻 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Checagem de tipagem e build de produção
npm run build

# Executar linter
npm run lint

# Visualizar build localmente
npm run preview
```

---

## 📦 Deploy no Servidor one.com

1. Execute localmente:
   ```bash
   npm run build
   ```
2. O diretório `dist/` conterá todos os arquivos finais otimizados (incluindo o `.htaccess`).
3. Envie o conteúdo de `dist/` diretamente para a raiz pública do seu servidor na one.com via FTP/SFTP ou gerenciador de arquivos.
