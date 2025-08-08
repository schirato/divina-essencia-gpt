import { useState } from 'react'
import { supabase } from '../supabase'
import { Link, useNavigate } from 'react-router-dom'

export default function Login(){
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    setError(null); setLoading(true)
    if(!validateEmail(email)) { setError('E-mail inválido.'); setLoading(false); return }
    if(!validatePassword(password)) { setError('Senha deve ter 8+ caracteres, incluindo maiúscula, minúscula e número.'); setLoading(false); return }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if(error){ setError(error.message) } else { nav('/home') }
    setLoading(false)
  }

  async function onGoogle(){
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/home' }
    })
    if(error) setError(error.message)
  }

  return (
    <main className="p-6 max-w-sm mx-auto">
      <h1 className="font-title text-2xl mb-2">Entrar</h1>
      <form onSubmit={onSubmit} className="card p-4 grid gap-3">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <input className="p-2 rounded-lg" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="p-2 rounded-lg" placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn" disabled={loading}>{loading? 'Entrando...' : 'Entrar'}</button>
        <button type="button" className="btn" onClick={onGoogle}>Entrar com Google</button>
        <div className="text-sm">Não tem conta? <Link to="/register" className="underline">Cadastre-se</Link></div>
      </form>
    </main>
  )
}

function validateEmail(v:string){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }
function validatePassword(v:string){ return /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v) && v.length >= 8 }
