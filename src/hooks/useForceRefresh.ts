import { useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";

/**
 * Hook personalizado para forçar refresh do conteúdo sem cache
 * Invalida queries do React Query e força recarregamento
 */
export function useForceRefresh() {
  const queryClient = useQueryClient();
  const [refreshKey, setRefreshKey] = useState(0);

  const forceRefresh = useCallback(() => {
    // Invalida todas as queries do React Query
    queryClient.invalidateQueries();

    // Força re-render dos componentes
    setRefreshKey((prev) => prev + 1);

    // Limpa cache do localStorage se necessário
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith("REACT_QUERY_OFFLINE_CACHE")) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn("Erro ao limpar cache do localStorage:", error);
    }

    console.log("🔄 Cache invalidado e conteúdo atualizado");
  }, [queryClient]);

  const clearAllCache = useCallback(() => {
    // Limpa todo o cache do React Query
    queryClient.clear();

    // Limpa localStorage completo se necessário
    try {
      localStorage.clear();
    } catch (error) {
      console.warn("Erro ao limpar localStorage:", error);
    }

    // Força refresh da página
    window.location.reload();
  }, [queryClient]);

  return {
    forceRefresh,
    clearAllCache,
    refreshKey,
  };
}
