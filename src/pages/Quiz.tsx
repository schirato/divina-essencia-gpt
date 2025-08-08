import content from '../data/content.json'
import { useDivina } from '../store'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Quiz(){
  const nav = useNavigate()
  const { addScore, setArchetype, award, scores } = useDivina()
  const [step, setStep] = useState(0)

  const q = content.quiz[step]

  function choose(opt: any){
    Object.entries(opt.weights).forEach(([k,v])=>addScore(k, v as number))
    const next = step+1
    if(next < content.quiz.length){
      setStep(next)
    }else{
      // compute result
      const pairs = Object.entries(scores).sort((a,b)=> (b[1] as number) - (a[1] as number))
      const top = pairs[0]?.[0] || 'afrodite'
      setArchetype(top)
      award('quiz_complete')
      nav('/report')
    }
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="font-title text-2xl mb-4">Quiz Arquetípico</h1>
      <p className="mb-4">{q.prompt}</p>
      <div className="grid gap-3">
        {q.options.map(o => (
          <button key={o.id} className="card p-4 text-left hover:opacity-95" onClick={()=>choose(o)}>{o.text}</button>
        ))}
      </div>
      <div className="mt-4 text-sm opacity-70">Pergunta {step+1} de {content.quiz.length}</div>
    </main>
  )
}
