import { Outlet, useLocation, Link } from 'react-router-dom'
import { Home, Trophy, Image as ImageIcon, User } from 'lucide-react'

export default function Shell(){
  const { pathname } = useLocation()
  const hideNav = pathname === '/' // Welcome

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="flex-1">
        <Outlet/>
      </div>
      {!hideNav && (
        <nav className="sticky bottom-0 bg-creme border-t border-pessego/60">
          <div className="grid grid-cols-4 max-w-xl mx-auto text-sm">
            <Link to="/home" className="flex flex-col items-center py-2">
              <Home size={20}/><span>Início</span>
            </Link>
            <Link to="/achievements" className="flex flex-col items-center py-2">
              <Trophy size={20}/><span>Conquistas</span>
            </Link>
            <Link to="/inspiration" className="flex flex-col items-center py-2">
              <ImageIcon size={20}/><span>Inspiração</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center py-2">
              <User size={20}/><span>Perfil</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  )
}
