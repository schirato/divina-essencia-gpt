import content from '../data/content.json'
import { useDivina } from '../store'

export default function Affirmations(){
  const { selectedArchetype } = useDivina()
  const list = (content.affirmations as any[]).filter(a => !a.archetypeId || a.archetypeId===selectedArchetype)

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="font-title text-2xl mb-4">Frases & Dicas</h1>
      <div className="grid gap-3">
        {list.map((a,i)=>(
          <div key={i} className="card p-4 italic">“{a.text}”</div>
        ))}
      </div>
    </main>
  )
}
