import { Outlet, useLocation, Link } from "react-router-dom";
import {
  Home,
  Trophy,
  Image as ImageIcon,
  User,
  RefreshCw,
} from "lucide-react";
import { useForceRefresh } from "./hooks/useForceRefresh";

export default function Shell() {
  const { pathname } = useLocation();
  const { forceRefresh } = useForceRefresh();
  const hideNav =
    pathname === "/welcome" ||
    pathname === "/login" ||
    pathname === "/register";

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Botão de refresh no topo (apenas em desenvolvimento) */}
      {!hideNav && process.env.NODE_ENV === "development" && (
        <div className="bg-amber-100 border-b border-amber-200 p-2 text-center">
          <button
            onClick={forceRefresh}
            className="inline-flex items-center gap-2 px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded text-sm font-medium transition-colors"
          >
            <RefreshCw size={14} />
            Atualizar Cache
          </button>
        </div>
      )}

      <div className="flex-1">
        <Outlet />
      </div>
      {!hideNav && (
        <nav className="sticky bottom-0 bg-creme border-t border-pessego/60">
          <div className="grid grid-cols-4 max-w-xl mx-auto text-sm">
            <Link to="/home" className="flex flex-col items-center py-2">
              <Home size={20} />
              <span>Início</span>
            </Link>
            <Link
              to="/achievements"
              className="flex flex-col items-center py-2"
            >
              <Trophy size={20} />
              <span>Conquistas</span>
            </Link>
            <Link to="/inspiration" className="flex flex-col items-center py-2">
              <ImageIcon size={20} />
              <span>Inspiração</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center py-2">
              <User size={20} />
              <span>Perfil</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
