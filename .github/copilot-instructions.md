# Beleza & Bem-Estar App – AI Coding Instructions

## Visão Geral da Arquitetura
Este é um **PWA em português para beleza e bem-estar**, construído com Vite + React + TypeScript, com foco em **design mobile-first** para gerenciamento de treinos, cronogramas capilares, unhas, suplementos e medidas corporais.

### Stack Principal
- **Frontend**: Vite, React 18, TypeScript, TailwindCSS
- **UI**: shadcn/ui com Radix UI
- **Backend**: Supabase (auth, banco de dados, real-time)
- **Estado**: React Query (@tanstack/react-query) + hooks personalizados
- **PWA**: Service Worker com estratégia agressiva de invalidação de cache

## Arquitetura por Domínio
O app é organizado em **5 seções principais de bem-estar**:
1. **Treinos** (`src/components/TrainingSection.tsx`)
2. **Cabelo** (`src/components/HairSection.tsx`)
3. **Unhas** (`src/components/nails/`)
4. **Suplementos** (`src/components/SupplementsSection.tsx`)
5. **Corpo** (`src/components/BodyMeasurementsSection.tsx`)

Cada seção segue o padrão: `SectionComponent` → `hooks/useSection` → integração com Supabase.

## Padrões-Chave

### Gerenciamento de Estado
```ts
const { workouts, sessions, loading, addWorkout, completeWorkout } = useWorkouts();
```

### Estrutura de Componentes
- Componentes de seção (containers)
- Providers de contexto (ex: `HairProductsProvider`)
- Diálogos (CRUD com shadcn/ui)
- Layouts com Cards estilizados

### Navegação
```ts
const handleSectionChange = (section: string) => {
  setCurrentSection(section);
};
```

## Comandos de Desenvolvimento
```bash
npm run dev
npm run build
npm run build:dev
npm run lint
```

## Convenções Críticas

### Localização
- Texto em português (Brasil)
- `date-fns` com `ptBR`
- UI em português

### Cache (PWA)
```ts
runtimeCaching: [
  {
    urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*$/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "supabase-api-cache",
      networkTimeoutSeconds: 5,
      expiration: { maxAgeSeconds: 60 * 5 }
    }
  }
];
```

### Supabase
- Cliente em `client.ts`
- RLS ativado
- Subscriptions em tempo real
- Cache-control bem configurado

### Erros
- `sonner`: `toast.error("Mensagem em português")`
- Skeletons em loading
- Retry com React Query

## Organização de Arquivos
```
src/
├── components/
│   ├── [section]/
│   ├── ui/
│   └── layout/
├── hooks/
├── integrations/
├── types/
└── utils/
```

## Testes & Debug
- `<CacheDebugPanel />`
- `npm run build && npm run preview`
- Teste Supabase no dashboard
- Teste PWA em dispositivos

## Antipadrões
- Cache Supabase > 5min ❌
- Ignorar Provider ❌
- Texto em inglês ❌
- Supabase direto sem React Query ❌
- Sem loading ❌

## Integrações
- Auth: `useAuth` + Supabase
- Real-time: Subscriptions
- Notificação PWA: `usePWA`
- Gamificação: `useGamification`
- Offline sync: `useBackgroundSync`

## Boas Práticas
- Clean Code
- Tipagem explícita
- Baixa complexidade (SonarQube)
- Sem `any`, sem duplicação
- Remover `console.log`/`debugger`
- Sempre em PT-BR

## Organização
- Legibilidade > código complexo
- Divida componentes longos
- Nomes descritivos
- Pense na equipe
- Pergunte antes
- Questione e proponha melhorias

## Diretrizes por Pasta

### `src/components/**`
- Use shadcn/ui
- Sem lógica pesada no JSX
- Use `Skeleton` e `Toast`
- Navegação por estado
- Sem comentários automáticos

### `src/hooks/**`
- `react-hook-form` + Zod
- React Query
- Retorne `{ data, loading, error, actions }`
- Hooks por domínio

### `src/pages/**`
- Containers de seção
- Sem APIs diretas
- Use `ContentManager`

### `src/lib/**`
- Funções puras/coesas
- Nome claro

### `src/integrations/**`
- Serviços externos
- `{ data, error }`
- Compatível com React Query

### `supabase/**`
- Tipos/clientes
- RLS
- Subscriptions

## Automação
- Não crie `.md` sem instrução
- Não execute build automático
- Edite/remova/crie arquivos quando necessário