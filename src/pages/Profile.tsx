import { useDivina } from '../store'
import content from '../data/content.json'

export default function Profile(){
  const { selectedArchetype, setArchetype, reset } = useDivina()
  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="font-title text-2xl mb-4">Perfil</h1>
      <div className="card p-4">
        <label className="block text-sm mb-2">Seu arquétipo</label>
        <select className="w-full p-2 rounded-lg" value={selectedArchetype || ''} onChange={e=>setArchetype(e.target.value)}>
          <option value="">Selecione…</option>
          {content.archetypes.map(a=>(<option key={a.id} value={a.id}>{a.name}</option>))}
        </select>
        <button className="btn mt-3" onClick={()=>reset()}>Resetar progresso</button>
      </div>
    </main>
  )
}
