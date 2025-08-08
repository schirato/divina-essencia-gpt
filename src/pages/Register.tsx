import { useState } from 'react'
import { supabase } from '../supabase'
import { Link, useNavigate } from 'react-router-dom'

export default function Register(){
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    setError(null); setLoading(true)
    if(name.trim().length < 2){ setError('Nome muito curto.'); setLoading(false); return }
    if(!validateEmail(email)) { setError('E-mail inválido.'); setLoading(false); return }
    if(!validatePassword(password)) { setError('Senha deve ter 8+ caracteres, incluindo maiúscula, minúscula e número.'); setLoading(false); return }
    if(password !== confirm){ setError('Senhas não coincidem.'); setLoading(false); return }

    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
    if(error){ setError(error.message) } else { nav('/home') }
    setLoading(false)
  }

  return (
    <main className="p-6 max-w-sm mx-auto">
      <h1 className="font-title text-2xl mb-2">Cadastro</h1>
      <form onSubmit={onSubmit} className="card p-4 grid gap-3">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <input className="p-2 rounded-lg" placeholder="Nome completo" value={name} onChange={e=>setName(e.target.value)} />
        <input className="p-2 rounded-lg" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="p-2 rounded-lg" placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <input className="p-2 rounded-lg" placeholder="Confirmar senha" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
        <button className="btn" disabled={loading}>{loading? 'Criando...' : 'Criar conta'}</button>
        <div className="text-sm">Já tem conta? <Link to="/login" className="underline">Entrar</Link></div>
      </form>
    </main>
  )
}

function validateEmail(v:string){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }
function validatePassword(v:string){ return /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v) && v.length >= 8 }
