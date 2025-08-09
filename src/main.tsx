import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import "./styles/index.css";
import routes from "./routes";

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 60,
    },
  },
});

const persister = createSyncStoragePersister({ storage: window.localStorage });
persistQueryClient({ queryClient: qc, persister });

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
