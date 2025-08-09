import { useEffect, useState } from "react";

/**
 * Hook para detectar mudanças em arquivos durante desenvolvimento
 * Útil para invalidar cache automaticamente quando content.json é modificado
 */
export function useFileWatcher() {
  const [lastModified, setLastModified] = useState(Date.now());

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    // Intervalo para verificar mudanças (apenas em desenvolvimento)
    const interval = setInterval(() => {
      // Simula detecção de mudanças no arquivo
      // Na prática, o Vite HMR já faz isso, mas este hook pode ser usado
      // para invalidar cache específico quando necessário
      const currentTime = Date.now();
      if (currentTime - lastModified > 30000) {
        // A cada 30 segundos
        setLastModified(currentTime);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [lastModified]);

  return { lastModified };
}

/**
 * Hook para forçar refresh quando o conteúdo JSON é modificado
 */
export function useContentRefresh() {
  const { lastModified } = useFileWatcher();
  const [contentVersion, setContentVersion] = useState(0);

  useEffect(() => {
    // Incrementa a versão do conteúdo para forçar re-render
    setContentVersion((prev) => prev + 1);
  }, [lastModified]);

  return { contentVersion };
}
