import { useDivina } from '../store'
import content from '../data/content.json'
import { Card, Button } from '../components/ui'
import { useSession } from '../useSession'
import { supabase } from '../supabase'

export default function Profile(){
  const { selectedArchetype, setArchetype, reset } = useDivina()
  const { session } = useSession()

  async function saveProfile(){
    const uid = session?.user?.id
    if(!uid) return
    await supabase.from('profiles').upsert({ uid, archetype: selectedArchetype || null })
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="font-title text-2xl mb-4">Perfil</h1>
      <Card className="p-4">
        <label className="block text-sm mb-2">Seu arquétipo</label>
        <select className="w-full p-2 rounded-lg" value={selectedArchetype || ''} onChange={e=>setArchetype(e.target.value)}>
          <option value="">Selecione…</option>
          {content.archetypes.map(a=>(<option key={a.id} value={a.id}>{a.name}</option>))}
        </select>
        <div className="flex gap-2 mt-3">
          <Button onClick={saveProfile}>Salvar</Button>
          <Button className="bg-rose" onClick={()=>reset()}>Resetar progresso</Button>
        </div>
      </Card>
    </main>
  )
}
