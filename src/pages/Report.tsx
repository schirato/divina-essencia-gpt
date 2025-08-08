import content from '../data/content.json'
import { useDivina } from '../store'

export default function Report(){
  const { selectedArchetype } = useDivina()
  const arch = content.archetypes.find(a => a.id === selectedArchetype) || content.archetypes[0]
  const tips = (content.tips as any[]).filter(t => t.archetypeId === arch.id)

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="font-title text-2xl mb-2">Seu Arquétipo Predominante</h1>
      <div className="card p-4">
        <h2 className="text-xl font-semibold">{arch.name}</h2>
        <p className="opacity-80">{arch.summary}</p>
        <h3 className="mt-4 font-semibold">Como aplicar na prática</h3>
        <ol className="list-decimal ml-5 space-y-1">
          <li><b>Identifique:</b> Escolha o arquétipo com o qual mais se conecta.</li>
          <li><b>Adapte:</b> Traduza os símbolos para seu estilo.</li>
          <li><b>Experimente:</b> Teste e observe como você se sente.</li>
        </ol>
        <p className="mt-3 text-sm italic opacity-70">O arquétipo é uma ferramenta, não uma regra. Beleza é expressão autêntica!</p>
      </div>

      <section className="mt-6 grid md:grid-cols-2 gap-4">
        {tips.map((t,i)=>(
          <div key={i} className="card p-4">
            <div className="font-semibold capitalize">{t.type}</div>
            <div>{t.text}</div>
          </div>
        ))}
      </section>
    </main>
  )
}
