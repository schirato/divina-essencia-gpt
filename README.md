# Divina Essência — Web App (React + Vite + TS) • PWA
App web/PWA premium para autoconhecimento por arquétipos femininos na beleza.

## Rodando localmente
```bash
npm i
npm run dev
```
> PWA: já vem com manifest, ícones e service worker simples (cache de app shell).

## Pastas principais
- `src/pages`: Welcome, Home, Quiz, Report, Planner (calendário lunar), Affirmations, Achievements, Inspiration, Profile
- `src/data/content.json`: Arquétipos, dicas, afirmações, quiz
- `src/store.ts`: estado global, conquistas e util de fase da lua
- `public/sw.js` e `public/manifest.webmanifest`: PWA
- `src/assets`: logos e cards de inspiração

## Próximos upgrades (prontos para implementar)
- Notificações diárias com agendamento (Service Worker + Alarms)
- Persistência em IndexedDB/SQLite WASM para relatórios avançados
- Tema escuro e personalização por arquétipo
- Upload da comunidade (moderação + curadoria)
- Internacionalização (i18n)

## Supabase (Auth + DB)
1. Crie `.env` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (veja `.env.example`).
2. Em **Auth > Providers**, habilite **Google** e configure o **Redirect** para `http://localhost:5173/` (dev) e seu domínio (prod).
3. Em **Table Editor**, rode o SQL `supabase-schema.sql` deste projeto para criar tabelas iniciais.

### Tabelas iniciais
- `profiles` (uid, name, archetype, avatar_url, created_at)
- `planner_entries` (id, uid, date, content)
- `achievements` (id, uid, code, created_at)
- `inspiration_posts` (id, uid, image_url, caption, created_at)

