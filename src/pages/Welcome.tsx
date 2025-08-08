import { Link } from 'react-router-dom'
import logo from '../assets/logo-rose.svg'

export default function Welcome(){
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-6 p-8 text-center">
      <img src={logo} className="w-28" alt="Logo"/>
      <h1 className="font-title text-3xl">Divina Essência</h1>
      <p className="text-onbg/80">Descubra seu poder. Viva sua essência.</p>
      <div className="flex gap-3"><Link to="/login" className="btn">Entrar</Link><Link to="/register" className="btn">Cadastrar</Link></div>
    </main>
  )
}
