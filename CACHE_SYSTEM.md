# 🔄 Sistema de Cache e Atualização - Divina Essência

## 📋 Resumo das Implementações

Este sistema resolve o problema de cache excessivo durante o desenvolvimento, garantindo que mudanças no conteúdo sejam refletidas imediatamente sem necessidade de reload manual da página.

## 🛠️ Funcionalidades Implementadas

### 1. **Botão de Refresh Manual** (Desenvolvimento)

- **Localização**: Barra amarela no topo da aplicação (apenas em desenvolvimento)
- **Função**: Invalida cache do React Query e força atualização do conteúdo
- **Como usar**: Clique no botão "🔄 Atualizar Cache"

### 2. **Configuração Vite Otimizada**

```typescript
// vite.config.ts
server: {
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
}
```

### 3. **React Query com Cache Inteligente**

```typescript
// main.tsx
staleTime: process.env.NODE_ENV === 'development' ? 0 : 1000 * 60,
refetchOnWindowFocus: true,
refetchOnReconnect: true
```

### 4. **Service Worker Atualizado**

- **Cache Seletivo**: JSON e APIs não são cacheados agressivamente
- **Patterns Excluídos**: `/data/content.json`, `/api/`, `?timestamp=`
- **Versão**: Incrementada para `divina-v2`

### 5. **Meta Tags de Cache**

```html
<meta
  http-equiv="Cache-Control"
  content="no-cache, no-store, must-revalidate"
/>
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

## 🚀 Comandos Disponíveis

```bash
# Desenvolvimento normal
npm run dev

# Desenvolvimento SEM cache (força re-otimização)
npm run dev:no-cache

# Build para desenvolvimento (preserva logs)
npm run build:dev

# Limpar cache manualmente
npm run clear-cache
```

## 🎯 Como Testar

1. **Faça uma mudança** no arquivo `src/data/content.json`
2. **Salve o arquivo** (Vite HMR detecta automaticamente)
3. **Alternativamente**: Clique no botão "🔄 Atualizar Cache"
4. **Verifique**: Mudanças devem aparecer imediatamente

## 🔧 Hooks Personalizados

### `useForceRefresh`

```typescript
const { forceRefresh, clearAllCache, refreshKey } = useForceRefresh();
```

- `forceRefresh()`: Invalida cache e força atualização
- `clearAllCache()`: Limpa todo cache e recarrega página
- `refreshKey`: Chave para forçar re-render de componentes

### `useFileWatcher` (Experimental)

```typescript
const { contentVersion } = useContentRefresh();
```

- Monitora mudanças em arquivos durante desenvolvimento
- Auto-incrementa versão para forçar atualizações

## ⚡ Configurações por Ambiente

### Desenvolvimento

- Cache desabilitado no React Query (`staleTime: 0`)
- Headers HTTP anti-cache
- Botão manual de refresh visível
- Service Worker não cacheia JSONs

### Produção

- Cache normal do React Query (`staleTime: 1min`)
- Service Worker com cache inteligente
- Sem botão de refresh
- Performance otimizada

## 🐛 Resolução de Problemas

### Se mudanças não aparecem:

1. **Clique no botão "Atualizar Cache"**
2. **Use `npm run dev:no-cache`**
3. **Pressione `Ctrl+Shift+R` (hard refresh)**
4. **Execute `npm run clear-cache && npm run dev`**

### Se o servidor não iniciar:

```bash
# Mate processos na porta
taskkill /F /PID $(Get-NetTCPConnection -LocalPort 5173 | Select-Object -ExpandProperty OwningProcess)

# Reinicie
npm run dev:no-cache
```

## 📊 Status de Cache

- ✅ **Vite HMR**: Ativo e funcionando
- ✅ **React Query**: Cache inteligente por ambiente
- ✅ **Service Worker**: Cache seletivo implementado
- ✅ **Browser Cache**: Headers anti-cache configurados
- ✅ **Manual Refresh**: Botão disponível em dev

## 🎉 Resultado

**Agora você pode**:

- Editar `content.json` e ver mudanças imediatamente
- Desenvolver sem se preocupar com cache antigo
- Usar refresh manual quando necessário
- Manter performance em produção
- Monitorar atualizações facilmente

---

💡 **Dica**: Use `npm run dev:no-cache` quando começar o desenvolvimento diário para garantir que não há cache antigo interferindo.
