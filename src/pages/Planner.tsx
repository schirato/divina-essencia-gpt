import { moonPhase, phaseName } from '../store'
import { format } from 'date-fns'

export default function Planner(){
  const today = new Date()
  const phase = moonPhase(today)
  const name = phaseName(phase)

  const tips: Record<string,string> = {
    'Lua Nova': 'Intenções e auto-observação. Escreva 3 objetivos de autocuidado.',
    'Crescente Inicial': 'Inicie hábitos: hidratar pele, rotina capilar leve.',
    'Quarto Crescente': 'Ação e consistência: exercício + planner semanal.',
    'Crescente Gibosa': 'Aprimore: ajuste o guarda-roupa por arquétipo.',
    'Lua Cheia': 'Celebre conquistas, fotos e look do dia.',
    'Minguante Gibosa': 'Reflexão: descarte hábitos/itens que não servem mais.',
    'Quarto Minguante': 'Descanso ativo: skincare e relaxamento.',
    'Minguante Final': 'Fechamentos: journaling e meditação.'
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="font-title text-2xl mb-4">Planner & Calendário Lunar</h1>
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-60">{format(today, 'dd/MM/yyyy')}</div>
            <div className="text-xl font-semibold">{name}</div>
          </div>
          <div className="text-sm">Fase: {(phase*100).toFixed(0)}%</div>
        </div>
        <p className="mt-3">{tips[name] || 'Cuide do seu ritmo e seja gentil consigo.'}</p>
      </div>

      <section className="mt-6 grid md:grid-cols-2 gap-4">
        {Array.from({length: 7}).map((_,i)=>{
          const d = new Date(); d.setDate(d.getDate()+i)
          return (
            <div key={i} className="card p-4">
              <div className="font-semibold">{format(d, 'EEEE, dd/MM')}</div>
              <textarea placeholder="Planeje sua rotina de beleza/autoestima…" className="w-full mt-2 p-2 rounded-lg outline-none bg-white/80" rows={3}></textarea>
            </div>
          )
        })}
      </section>
    </main>
  )
}
