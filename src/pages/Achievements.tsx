import { useDivina } from '../store'

const BADGES: Record<string, {title:string, desc:string}> = {
  'quiz_complete': { title: 'Despertei Minha Essência', desc: 'Completou o quiz arquetípico' },
  'planner_week': { title: 'Ritual Semanal', desc: 'Planejou 7 dias de autocuidado' }
}

export default function Achievements(){
  const { achievements } = useDivina()
  const list = achievements.length ? achievements : ['quiz_complete']

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="font-title text-2xl mb-4">Conquistas</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {list.map(code => (
          <div key={code} className="card p-4">
            <div className="font-semibold">{BADGES[code]?.title || code}</div>
            <div className="text-sm opacity-80">{BADGES[code]?.desc || 'Conquista alcançada'}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
