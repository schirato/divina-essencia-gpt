import { Navigate } from 'react-router-dom'
import { useSession } from './useSession'

export default function AuthGuard({ children }: { children: JSX.Element }){
  const { session, loading } = useSession()
  if(loading) return <div className="p-6">Carregando…</div>
  if(!session) return <Navigate to="/login" replace />
  return children
}
